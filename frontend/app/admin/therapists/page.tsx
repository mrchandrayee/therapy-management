'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminTherapistsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  const therapists = {
    pending: [
      {
        id: 1,
        name: 'Dr. Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91-98765-43210',
        license: 'PSY-2024-001',
        specializations: ['Anxiety', 'Depression'],
        experience: 8,
        education: 'PhD Clinical Psychology, AIIMS',
        submittedAt: '2025-01-10',
        documents: ['License', 'Degree', 'Experience Certificate'],
        status: 'pending'
      },
      {
        id: 2,
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91-87654-32109',
        license: 'PSY-2024-002',
        specializations: ['Trauma', 'PTSD'],
        experience: 12,
        education: 'MD Psychiatry, PGI Chandigarh',
        submittedAt: '2025-01-12',
        documents: ['License', 'Degree', 'Experience Certificate'],
        status: 'pending'
      }
    ],
    approved: [
      {
        id: 3,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+91-76543-21098',
        license: 'PSY-2023-045',
        specializations: ['Anxiety', 'Stress Management'],
        experience: 10,
        education: 'PhD Clinical Psychology, Harvard',
        approvedAt: '2024-12-15',
        rating: 4.9,
        sessions: 127,
        status: 'approved'
      }
    ],
    rejected: [
      {
        id: 4,
        name: 'Dr. Raj Patel',
        email: 'raj.patel@email.com',
        phone: '+91-65432-10987',
        license: 'PSY-2024-003',
        specializations: ['Depression'],
        experience: 5,
        education: 'MA Psychology, Mumbai University',
        rejectedAt: '2025-01-08',
        rejectionReason: 'Insufficient experience documentation',
        status: 'rejected'
      }
    ]
  }

  const allTherapists = [...therapists.pending, ...therapists.approved, ...therapists.rejected]
  const currentTherapists = activeTab === 'all' ? allTherapists : therapists[activeTab]

  const filteredTherapists = currentTherapists.filter(therapist =>
    therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapist.license.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApprove = (id: number) => {
    console.log('Approving therapist:', id)
    // API call would go here
  }

  const handleReject = (id: number) => {
    console.log('Rejecting therapist:', id)
    // API call would go here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Therapist Management</h1>
            <p className="text-gray-600 mt-2">Review and manage therapist applications</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">📧</span>
              Invite Therapist
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{therapists.pending.length}</div>
              <div className="text-gray-600 text-sm">Pending Review</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{therapists.approved.length}</div>
              <div className="text-gray-600 text-sm">Approved</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{therapists.rejected.length}</div>
              <div className="text-gray-600 text-sm">Rejected</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{allTherapists.length}</div>
              <div className="text-gray-600 text-sm">Total Applications</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                {tab !== 'all' && ` (${therapists[tab].length})`}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search therapists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Pending Applications Alert */}
        {activeTab === 'pending' && therapists.pending.length > 0 && (
          <Alert variant="warning">
            <AlertDescription>
              <strong>{therapists.pending.length} therapist applications</strong> are waiting for your review. 
              Please review them promptly to maintain service quality.
            </AlertDescription>
          </Alert>
        )}

        {/* Therapists List */}
        <div className="space-y-6">
          {filteredTherapists.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No therapists found
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? 'No therapists match your search criteria.' : `No ${activeTab} therapists at the moment.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredTherapists.map((therapist) => (
                <Card key={therapist.id} variant="elevated" className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {therapist.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl">{therapist.name}</CardTitle>
                          <CardDescription>{therapist.email}</CardDescription>
                          <p className="text-sm text-gray-600">{therapist.phone}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(therapist.status)}>
                        {therapist.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">License Number</p>
                        <p className="font-medium">{therapist.license}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium">{therapist.experience} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Education</p>
                        <p className="font-medium text-sm">{therapist.education}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Specializations</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {therapist.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline" size="sm">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {therapist.status === 'approved' && (
                      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="font-medium text-green-700">⭐ {therapist.rating}/5</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sessions Completed</p>
                          <p className="font-medium text-green-700">{therapist.sessions}</p>
                        </div>
                      </div>
                    )}

                    {therapist.status === 'rejected' && (
                      <div className="mb-6 p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Rejection Reason</p>
                        <p className="font-medium text-red-700">{therapist.rejectionReason}</p>
                      </div>
                    )}

                    {therapist.documents && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">Submitted Documents</p>
                        <div className="flex flex-wrap gap-2">
                          {therapist.documents.map((doc, index) => (
                            <Badge key={index} variant="secondary" size="sm">
                              📄 {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        View Documents
                      </Button>
                      
                      {therapist.status === 'pending' && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(therapist.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(therapist.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {therapist.status === 'approved' && (
                        <>
                          <Button variant="outline" size="sm">
                            Suspend
                          </Button>
                          <Button variant="outline" size="sm">
                            View Analytics
                          </Button>
                        </>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}