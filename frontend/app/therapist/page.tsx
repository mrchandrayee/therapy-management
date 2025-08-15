'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress, CircularProgress } from '@/components/ui/progress'

export default function TherapistDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const therapistData = {
    profile: {
      name: 'Dr. Sarah Johnson',
      licenseNumber: 'PSY-2023-045',
      specializations: ['Anxiety & Stress Management', 'Depression & Mood Disorders'],
      competencies: [
        { name: 'Cognitive Behavioral Therapy', proficiency: 'expert', experience: 8 },
        { name: 'Mindfulness-Based Therapy', proficiency: 'advanced', experience: 5 },
        { name: 'Trauma-Informed Care', proficiency: 'intermediate', experience: 3 }
      ],
      rating: 4.9,
      totalReviews: 127,
      totalSessions: 342,
      approvalStatus: 'approved'
    },
    todaySchedule: [
      {
        id: 'SES-001',
        clientName: 'John Doe',
        time: '10:00 AM',
        duration: 60,
        type: 'individual',
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        canJoin: false,
        notes: 'Focus on anxiety management techniques'
      },
      {
        id: 'SES-002',
        clientName: 'Jane Smith',
        time: '2:30 PM',
        duration: 90,
        type: 'family',
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
        canJoin: true,
        notes: 'Family therapy session - communication issues',
        participants: ['Jane Smith', 'Mike Smith', 'Sarah Smith (daughter)']
      },
      {
        id: 'SES-003',
        clientName: 'Mike Johnson',
        time: '4:00 PM',
        duration: 60,
        type: 'individual',
        status: 'pending',
        meetingLink: 'https://meet.google.com/lmn-opqr-stu',
        canJoin: false,
        notes: 'PTSD recovery session'
      }
    ],
    weeklyStats: {
      sessionsCompleted: 12,
      sessionsScheduled: 15,
      averageRating: 4.8,
      totalEarnings: 18000,
      clientsSeen: 8,
      noShows: 1
    },
    recentActivity: [
      {
        type: 'session_completed',
        message: 'Completed session with John Doe',
        time: '2 hours ago',
        clientId: 'CLI-001'
      },
      {
        type: 'case_sheet_updated',
        message: 'Updated case sheet for Jane Smith',
        time: '4 hours ago',
        clientId: 'CLI-002'
      },
      {
        type: 'availability_updated',
        message: 'Updated availability for next week',
        time: '1 day ago'
      },
      {
        type: 'document_uploaded',
        message: 'Uploaded new certification',
        time: '2 days ago'
      }
    ]
  }

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'expert': return 'success'
      case 'advanced': return 'info'
      case 'intermediate': return 'warning'
      case 'basic': return 'secondary'
      default: return 'secondary'
    }
  }

  const canJoinSession = (session: any) => {
    const now = new Date()
    const sessionTime = new Date(`${selectedDate} ${session.time}`)
    const timeDiff = sessionTime.getTime() - now.getTime()
    return timeDiff <= 5 * 60 * 1000 && timeDiff >= -30 * 60 * 1000 // 5 min before to 30 min after
  }

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {therapistData.profile.name}
            </h1>
            <p className="text-gray-600 mt-2">
              License: {therapistData.profile.licenseNumber} • 
              Status: <span className="text-green-600 font-medium">Approved</span>
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-4">
            <Button variant="outline" onClick={() => window.location.href = '/therapist/availability'}>
              <span className="mr-2">📅</span>
              Manage Availability
            </Button>
            <Button className="gradient-primary" onClick={() => window.location.href = '/therapist/case-sheets'}>
              <span className="mr-2">📋</span>
              View Case Sheets
            </Button>
          </div>
        </div>

        {/* Today's Schedule Alert */}
        <Alert variant="info">
          <AlertDescription>
            You have <strong>{therapistData.todaySchedule.length} sessions</strong> scheduled for today. 
            Next session: {therapistData.todaySchedule[0]?.clientName} at {therapistData.todaySchedule[0]?.time}
          </AlertDescription>
        </Alert>

        {/* Weekly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {therapistData.weeklyStats.sessionsCompleted}
              </div>
              <div className="text-gray-600 text-sm">Sessions Completed</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {therapistData.weeklyStats.sessionsScheduled}
              </div>
              <div className="text-gray-600 text-sm">Sessions Scheduled</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {therapistData.weeklyStats.averageRating}
              </div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ₹{(therapistData.weeklyStats.totalEarnings / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-600 text-sm">Weekly Earnings</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {therapistData.weeklyStats.clientsSeen}
              </div>
              <div className="text-gray-600 text-sm">Clients Seen</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {therapistData.weeklyStats.noShows}
              </div>
              <div className="text-gray-600 text-sm">No Shows</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>
                      {new Date(selectedDate).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {therapistData.todaySchedule.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📅</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Today</h3>
                      <p className="text-gray-600">You have a free day! Enjoy your time off.</p>
                    </div>
                  ) : (
                    therapistData.todaySchedule.map((session) => (
                      <Card key={session.id} variant="default" className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {session.clientName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{session.clientName}</h4>
                                <p className="text-sm text-gray-600">
                                  {session.time} • {session.duration} min • {session.type}
                                </p>
                                {session.participants && (
                                  <p className="text-xs text-gray-500">
                                    Participants: {session.participants.join(', ')}
                                  </p>
                                )}
                                <p className="text-xs text-gray-600 mt-1">{session.notes}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant={getSessionStatusColor(session.status)} size="sm">
                                {session.status}
                              </Badge>
                              {canJoinSession(session) ? (
                                <Button className="gradient-primary" size="sm">
                                  Join Session
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" disabled>
                                  {new Date(`${selectedDate} ${session.time}`) > new Date() ? 'Too Early' : 'Session Ended'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile & Competencies */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <CircularProgress 
                    value={therapistData.profile.rating * 20} 
                    size={100}
                    label="Rating"
                    className="mb-4"
                  />
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {therapistData.profile.rating} ({therapistData.profile.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Sessions:</span>
                    <span className="font-medium">{therapistData.profile.totalSessions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">License:</span>
                    <span className="font-medium">{therapistData.profile.licenseNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competencies */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Competencies</CardTitle>
                <CardDescription>Your professional skills and expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {therapistData.profile.competencies.map((comp, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{comp.name}</span>
                        <Badge variant={getProficiencyColor(comp.proficiency)} size="sm">
                          {comp.proficiency}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{comp.experience} years experience</span>
                        <span>{comp.proficiency === 'expert' ? '100%' : comp.proficiency === 'advanced' ? '80%' : comp.proficiency === 'intermediate' ? '60%' : '40%'}</span>
                      </div>
                      <Progress 
                        value={comp.proficiency === 'expert' ? 100 : comp.proficiency === 'advanced' ? 80 : comp.proficiency === 'intermediate' ? 60 : 40} 
                        size="sm"
                        variant={comp.proficiency === 'expert' ? 'success' : 'default'}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Update Competencies
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {therapistData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'session_completed' ? 'bg-green-500' :
                        activity.type === 'case_sheet_updated' ? 'bg-blue-500' :
                        activity.type === 'availability_updated' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Update Availability', icon: '📅', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700', href: '/therapist/availability' },
                { name: 'View Case Sheets', icon: '📋', color: 'bg-green-50 hover:bg-green-100 text-green-700', href: '/therapist/case-sheets' },
                { name: 'My Sessions', icon: '📊', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700', href: '/therapist/sessions' },
                { name: 'Upload Documents', icon: '📄', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700', href: '/therapist/documents' },
                { name: 'My Profile', icon: '👤', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700', href: '/therapist/profile' },
                { name: 'Session Extensions', icon: '⏰', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700', href: '/therapist/session-extension' },
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`h-20 flex-col space-y-2 ${action.color}`}
                  onClick={() => window.location.href = action.href}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium text-center">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Your Specializations</CardTitle>
            <CardDescription>Areas of expertise displayed to clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {therapistData.profile.specializations.map((spec, index) => (
                <Badge key={index} variant="primary" className="px-3 py-1">
                  {spec}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm">
              Update Specializations
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}