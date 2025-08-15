'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')

  const sessions = {
    upcoming: [
      {
        id: 1,
        therapist: 'Dr. Sarah Johnson',
        date: '2025-01-15',
        time: '10:00 AM',
        duration: 60,
        type: 'Individual Therapy',
        status: 'confirmed',
        sessionLink: 'https://meet.amitacare.com/session/abc123',
        notes: 'Focus on anxiety management techniques',
        canReschedule: true,
        canCancel: true
      },
      {
        id: 2,
        therapist: 'Dr. Michael Chen',
        date: '2025-01-17',
        time: '2:30 PM',
        duration: 90,
        type: 'Couples Therapy',
        status: 'pending',
        sessionLink: null,
        notes: 'Relationship communication workshop',
        canReschedule: true,
        canCancel: true
      },
      {
        id: 3,
        therapist: 'Dr. Priya Sharma',
        date: '2025-01-20',
        time: '4:00 PM',
        duration: 60,
        type: 'Individual Therapy',
        status: 'confirmed',
        sessionLink: 'https://meet.amitacare.com/session/def456',
        notes: 'PTSD recovery session',
        canReschedule: true,
        canCancel: true
      }
    ],
    past: [
      {
        id: 4,
        therapist: 'Dr. Sarah Johnson',
        date: '2025-01-10',
        time: '10:00 AM',
        duration: 60,
        type: 'Individual Therapy',
        status: 'completed',
        rating: 5,
        feedback: 'Very helpful session, learned new coping strategies',
        notes: 'Discussed stress management at work',
        sessionSummary: 'Patient showed good progress in anxiety management. Homework assigned: daily mindfulness practice.'
      },
      {
        id: 5,
        therapist: 'Dr. Michael Chen',
        date: '2025-01-08',
        time: '3:00 PM',
        duration: 90,
        type: 'Couples Therapy',
        status: 'completed',
        rating: 4,
        feedback: 'Good session, need more practice with communication',
        notes: 'Communication exercises for couples',
        sessionSummary: 'Couple practiced active listening techniques. Progress noted in conflict resolution.'
      }
    ],
    cancelled: [
      {
        id: 6,
        therapist: 'Dr. Priya Sharma',
        date: '2025-01-05',
        time: '11:00 AM',
        duration: 60,
        type: 'Individual Therapy',
        status: 'cancelled',
        reason: 'Therapist unavailable due to emergency',
        refundStatus: 'refunded',
        notes: 'Trauma therapy session'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const filteredSessions = sessions[activeTab].filter(session =>
    session.therapist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderUpcomingSession = (session: any) => (
    <Card key={session.id} variant="elevated" className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{session.therapist}</CardTitle>
            <CardDescription>{session.type}</CardDescription>
          </div>
          <Badge variant={getStatusColor(session.status)}>
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Date:</span>
              <p className="font-medium">{new Date(session.date).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <p className="font-medium">{session.time} ({session.duration} min)</p>
            </div>
          </div>

          {session.notes && (
            <div>
              <span className="text-gray-600 text-sm">Session Focus:</span>
              <p className="text-sm text-gray-700">{session.notes}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {session.sessionLink && (
              <Button className="gradient-primary" size="sm">
                Join Session
              </Button>
            )}
            {session.canReschedule && (
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
            )}
            {session.canCancel && (
              <Button variant="destructive" size="sm">
                Cancel
              </Button>
            )}
            <Button variant="ghost" size="sm">
              Message Therapist
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderPastSession = (session: any) => (
    <Card key={session.id} variant="elevated" className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{session.therapist}</CardTitle>
            <CardDescription>{session.type}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {session.rating && (
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < session.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">{session.rating}/5</span>
              </div>
            )}
            <Badge variant={getStatusColor(session.status)}>
              {session.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Date:</span>
              <p className="font-medium">{new Date(session.date).toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <p className="font-medium">{session.duration} minutes</p>
            </div>
          </div>

          {session.sessionSummary && (
            <div>
              <span className="text-gray-600 text-sm">Session Summary:</span>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
                {session.sessionSummary}
              </p>
            </div>
          )}

          {session.feedback && (
            <div>
              <span className="text-gray-600 text-sm">Your Feedback:</span>
              <p className="text-sm text-gray-700 italic">"{session.feedback}"</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              View Notes
            </Button>
            <Button variant="outline" size="sm">
              Book Follow-up
            </Button>
            <Button variant="ghost" size="sm">
              Download Summary
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCancelledSession = (session: any) => (
    <Card key={session.id} variant="elevated" className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{session.therapist}</CardTitle>
            <CardDescription>{session.type}</CardDescription>
          </div>
          <Badge variant={getStatusColor(session.status)}>
            {session.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Original Date:</span>
              <p className="font-medium">{new Date(session.date).toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <span className="text-gray-600">Refund Status:</span>
              <p className="font-medium text-green-600 capitalize">{session.refundStatus}</p>
            </div>
          </div>

          {session.reason && (
            <div>
              <span className="text-gray-600 text-sm">Cancellation Reason:</span>
              <p className="text-sm text-gray-700">{session.reason}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button className="gradient-primary" size="sm">
              Reschedule
            </Button>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-600 mt-2">Manage your therapy sessions and view session history</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">📅</span>
              Book New Session
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {sessions.upcoming.length}
              </div>
              <div className="text-gray-600 text-sm">Upcoming Sessions</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {sessions.past.length}
              </div>
              <div className="text-gray-600 text-sm">Completed Sessions</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                4.5
              </div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                12
              </div>
              <div className="text-gray-600 text-sm">Total Hours</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({sessions[tab].length})
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search sessions..."
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

        {/* Next Session Alert */}
        {activeTab === 'upcoming' && sessions.upcoming.length > 0 && (
          <Alert variant="info">
            <AlertDescription>
              <strong>Next Session:</strong> {sessions.upcoming[0].therapist} on{' '}
              {new Date(sessions.upcoming[0].date).toLocaleDateString('en-IN')} at {sessions.upcoming[0].time}
              <Button variant="link" className="p-0 h-auto ml-2">
                Join now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Sessions List */}
        <div className="space-y-6">
          {filteredSessions.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} sessions found
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'upcoming' 
                    ? "You don't have any upcoming sessions. Book a session to get started."
                    : `You don't have any ${activeTab} sessions matching your search.`
                  }
                </p>
                {activeTab === 'upcoming' && (
                  <Button className="gradient-primary">
                    Book Your First Session
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSessions.map((session) => {
                if (activeTab === 'upcoming') return renderUpcomingSession(session)
                if (activeTab === 'past') return renderPastSession(session)
                if (activeTab === 'cancelled') return renderCancelledSession(session)
                return null
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}