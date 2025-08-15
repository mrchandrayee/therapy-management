'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function FindTherapistsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null)

  const therapists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Clinical Psychologist',
      specializations: ['Anxiety & Stress Management', 'Depression & Mood Disorders'],
      languages: ['English', 'Hindi'],
      experience: 8,
      rating: 4.9,
      reviews: 127,
      fee: 1500,
      availability: 'Available Today',
      nextAvailable: '2:00 PM Today',
      bio: 'Specialized in cognitive behavioral therapy with extensive experience in treating anxiety and depression.'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      title: 'Marriage & Family Therapist',
      specializations: ['Relationship Counseling', 'Family Therapy'],
      languages: ['English', 'Tamil'],
      experience: 12,
      rating: 4.8,
      reviews: 89,
      fee: 2000,
      availability: 'Available Tomorrow',
      nextAvailable: '10:00 AM Tomorrow',
      bio: 'Expert in couples therapy and family dynamics with a focus on communication and conflict resolution.'
    }
  ]

  const specializations = [
    'Anxiety & Stress Management',
    'Depression & Mood Disorders',
    'Relationship Counseling',
    'Family Therapy',
    'Trauma & PTSD',
    'Addiction Recovery'
  ]

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         therapist.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSpecialization = !selectedSpecialization || 
                                 therapist.specializations.includes(selectedSpecialization)
    return matchesSearch && matchesSpecialization
  })

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Therapists</h1>
          <p className="text-gray-600 mt-2">Discover qualified mental health professionals</p>
        </div>

        {/* Search and Filters */}
        <Card variant="elevated" padding="lg">
          <div className="space-y-4">
            <Input
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                value={selectedSpecialization || ''}
                onChange={(e) => setSelectedSpecialization(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredTherapists.length} therapists
          </p>
        </div>

        {/* Therapist Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTherapists.map((therapist) => (
            <Card key={therapist.id} variant="elevated" className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {therapist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{therapist.name}</CardTitle>
                        <CardDescription className="text-gray-600">{therapist.title}</CardDescription>
                      </div>
                      <Badge variant={therapist.availability.includes('Today') ? 'success' : 'secondary'}>
                        {therapist.availability}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          {therapist.rating} ({therapist.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 text-sm">{therapist.bio}</p>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Specializations:</p>
                    <div className="flex flex-wrap gap-1">
                      {therapist.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{therapist.fee}</p>
                      <p className="text-sm text-gray-600">per session</p>
                      <p className="text-xs text-green-600 font-medium">
                        Next: {therapist.nextAvailable}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button className="gradient-primary" size="sm">
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}