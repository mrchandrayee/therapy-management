'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface MapMarker {
  id: string
  type: 'client' | 'therapist' | 'company'
  name: string
  latitude: number
  longitude: number
  pincode: string
  additionalInfo: Record<string, any>
}

interface LocationStats {
  totalLocations: number
  clientsWithLocation: number
  therapistsWithLocation: number
  companiesWithLocation: number
  topPincodes: Array<{ pincode: string; count: number }>
}

export default function AdminMapPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'client' | 'therapist' | 'company'>('all')
  const [searchPincode, setSearchPincode] = useState('')
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  
  // Mock data - replace with actual API calls
  const [locationStats, setLocationStats] = useState<LocationStats>({
    totalLocations: 1247,
    clientsWithLocation: 892,
    therapistsWithLocation: 234,
    companiesWithLocation: 121,
    topPincodes: [
      { pincode: '110001', count: 45 },
      { pincode: '400001', count: 38 },
      { pincode: '560001', count: 32 },
      { pincode: '600001', count: 28 },
      { pincode: '700001', count: 25 }
    ]
  })

  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([
    {
      id: '1',
      type: 'client',
      name: 'John Doe',
      latitude: 28.6139,
      longitude: 77.2090,
      pincode: '110001',
      additionalInfo: {
        totalSessions: 12,
        company: 'Tech Corp',
        lastSession: '2024-01-15'
      }
    },
    {
      id: '2',
      type: 'therapist',
      name: 'Dr. Sarah Johnson',
      latitude: 28.7041,
      longitude: 77.1025,
      pincode: '110035',
      additionalInfo: {
        specializations: 'Anxiety, Depression',
        totalSessions: 156,
        isAvailable: true
      }
    },
    {
      id: '3',
      type: 'company',
      name: 'Tech Corp',
      latitude: 28.5355,
      longitude: 77.3910,
      pincode: '110092',
      additionalInfo: {
        employeeCount: 45,
        agreementStatus: 'active',
        discountPercentage: 20
      }
    },
    {
      id: '4',
      type: 'client',
      name: 'Jane Smith',
      latitude: 19.0760,
      longitude: 72.8777,
      pincode: '400001',
      additionalInfo: {
        totalSessions: 8,
        company: 'Direct Client',
        lastSession: '2024-01-20'
      }
    },
    {
      id: '5',
      type: 'therapist',
      name: 'Dr. Michael Brown',
      latitude: 12.9716,
      longitude: 77.5946,
      pincode: '560001',
      additionalInfo: {
        specializations: 'Trauma, PTSD',
        totalSessions: 89,
        isAvailable: false
      }
    }
  ])

  const filteredMarkers = mapMarkers.filter(marker => {
    if (selectedType !== 'all' && marker.type !== selectedType) return false
    if (searchPincode && !marker.pincode.includes(searchPincode)) return false
    return true
  })

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'client': return 'bg-blue-500'
      case 'therapist': return 'bg-green-500'
      case 'company': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'client': return '👤'
      case 'therapist': return '👨‍⚕️'
      case 'company': return '🏢'
      default: return '📍'
    }
  }

  const MarkerCard = ({ marker }: { marker: MapMarker }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        selectedMarker?.id === marker.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedMarker(marker)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${getMarkerColor(marker.type)}`} />
          <span className="text-lg">{getMarkerIcon(marker.type)}</span>
          <div>
            <h4 className="font-medium">{marker.name}</h4>
            <p className="text-sm text-gray-500">{marker.type}</p>
          </div>
        </div>
        
        <div className="space-y-1 text-sm">
          <p><strong>Pincode:</strong> {marker.pincode}</p>
          <p><strong>Location:</strong> {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}</p>
          
          {marker.type === 'client' && (
            <>
              <p><strong>Sessions:</strong> {marker.additionalInfo.totalSessions}</p>
              <p><strong>Company:</strong> {marker.additionalInfo.company}</p>
            </>
          )}
          
          {marker.type === 'therapist' && (
            <>
              <p><strong>Specializations:</strong> {marker.additionalInfo.specializations}</p>
              <p><strong>Sessions:</strong> {marker.additionalInfo.totalSessions}</p>
              <Badge variant={marker.additionalInfo.isAvailable ? 'success' : 'secondary'}>
                {marker.additionalInfo.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </>
          )}
          
          {marker.type === 'company' && (
            <>
              <p><strong>Employees:</strong> {marker.additionalInfo.employeeCount}</p>
              <p><strong>Discount:</strong> {marker.additionalInfo.discountPercentage}%</p>
              <Badge variant={marker.additionalInfo.agreementStatus === 'active' ? 'success' : 'secondary'}>
                {marker.additionalInfo.agreementStatus}
              </Badge>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Location Map</h1>
            <p className="text-gray-600 mt-2">Visualize clients, therapists, and companies by location</p>
          </div>
          
          <div className="flex space-x-4">
            <Input
              placeholder="Search by pincode..."
              value={searchPincode}
              onChange={(e) => setSearchPincode(e.target.value)}
              className="w-48"
            />
            
            <Select value={selectedType} onValueChange={(value: 'all' | 'client' | 'therapist' | 'company') => setSelectedType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="therapist">Therapists</SelectItem>
                <SelectItem value="company">Companies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Locations</p>
                  <p className="text-3xl font-bold text-blue-600">{locationStats.totalLocations}</p>
                </div>
                <span className="text-3xl">📍</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clients</p>
                  <p className="text-3xl font-bold text-green-600">{locationStats.clientsWithLocation}</p>
                </div>
                <span className="text-3xl">👤</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Therapists</p>
                  <p className="text-3xl font-bold text-purple-600">{locationStats.therapistsWithLocation}</p>
                </div>
                <span className="text-3xl">👨‍⚕️</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Companies</p>
                  <p className="text-3xl font-bold text-orange-600">{locationStats.companiesWithLocation}</p>
                </div>
                <span className="text-3xl">🏢</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
                  Showing {filteredMarkers.length} locations
                  {searchPincode && ` in pincode ${searchPincode}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">🗺️</span>
                    <p className="text-gray-600 mb-2">Interactive Map View</p>
                    <p className="text-sm text-gray-500">
                      Map integration with Google Maps or Mapbox would be implemented here
                    </p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm">Clients</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">Therapists</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-sm">Companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location List and Details */}
          <div className="space-y-6">
            {/* Top Pincodes */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pincodes</CardTitle>
                <CardDescription>Areas with highest concentration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locationStats.topPincodes.map((item, index) => (
                    <div key={item.pincode} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm">{item.pincode}</span>
                      </div>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Marker Details */}
            {selectedMarker && (
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                  <CardDescription>Selected marker information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMarkerIcon(selectedMarker.type)}</span>
                      <div>
                        <h4 className="font-medium">{selectedMarker.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{selectedMarker.type}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Pincode:</strong> {selectedMarker.pincode}</p>
                      <p><strong>Coordinates:</strong> {selectedMarker.latitude.toFixed(6)}, {selectedMarker.longitude.toFixed(6)}</p>
                      
                      {Object.entries(selectedMarker.additionalInfo).map(([key, value]) => (
                        <p key={key}>
                          <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {String(value)}
                        </p>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t">
                      <Button size="sm" className="w-full">
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Location List */}
        <Card>
          <CardHeader>
            <CardTitle>All Locations</CardTitle>
            <CardDescription>
              {filteredMarkers.length} locations found
              {selectedType !== 'all' && ` (${selectedType}s only)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarkers.map((marker) => (
                <MarkerCard key={marker.id} marker={marker} />
              ))}
            </div>
            
            {filteredMarkers.length === 0 && (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-gray-600">No locations found matching your criteria</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}