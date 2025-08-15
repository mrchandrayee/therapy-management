'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Session {
  id: string
  clientName: string
  therapistName: string
  time: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  meetingLink: string
  sessionType: 'individual' | 'group' | 'family' | 'supervision'
}

interface DaySchedule {
  date: string
  sessions: Session[]
  totalSessions: number
  completedSessions: number
  noShowSessions: number
}

export default function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('day')
  const [filterBy, setFilterBy] = useState<'all' | 'therapist' | 'client'>('all')
  const [selectedFilter, setSelectedFilter] = useState<string>('')
  
  // Mock data - replace with actual API calls
  const [todaySchedule, setTodaySchedule] = useState<DaySchedule>({
    date: new Date().toISOString().split('T')[0],
    sessions: [
      {
        id: '1',
        clientName: 'John Doe',
        therapistName: 'Dr. Sarah Johnson',
        time: '09:00',
        duration: 60,
        status: 'scheduled',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        sessionType: 'individual'
      },
      {
        id: '2',
        clientName: 'Jane Smith',
        therapistName: 'Dr. Michael Brown',
        time: '10:30',
        duration: 60,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/xyz-uvw-rst',
        sessionType: 'individual'
      },
      {
        id: '3',
        clientName: 'Robert Wilson',
        therapistName: 'Dr. Sarah Johnson',
        time: '14:00',
        duration: 90,
        status: 'no_show',
        meetingLink: 'https://meet.google.com/lmn-opq-rst',
        sessionType: 'family'
      },
      {
        id: '4',
        clientName: 'Emily Davis',
        therapistName: 'Dr. Lisa Anderson',
        time: '16:00',
        duration: 60,
        status: 'completed',
        meetingLink: 'https://meet.google.com/def-ghi-jkl',
        sessionType: 'individual'
      }
    ],
    totalSessions: 4,
    completedSessions: 1,
    noShowSessions: 1
  })

  const [therapistSchedules, setTherapistSchedules] = useState<Record<string, Session[]>>({
    'Dr. Sarah Johnson': [
      {
        id: '1',
        clientName: 'John Doe',
        therapistName: 'Dr. Sarah Johnson',
        time: '09:00',
        duration: 60,
        status: 'scheduled',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        sessionType: 'individual'
      },
      {
        id: '3',
        clientName: 'Robert Wilson',
        therapistName: 'Dr. Sarah Johnson',
        time: '14:00',
        duration: 90,
        status: 'no_show',
        meetingLink: 'https://meet.google.com/lmn-opq-rst',
        sessionType: 'family'
      }
    ],
    'Dr. Michael Brown': [
      {
        id: '2',
        clientName: 'Jane Smith',
        therapistName: 'Dr. Michael Brown',
        time: '10:30',
        duration: 60,
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/xyz-uvw-rst',
        sessionType: 'individual'
      }
    ],
    'Dr. Lisa Anderson': [
      {
        id: '4',
        clientName: 'Emily Davis',
        therapistName: 'Dr. Lisa Anderson',
        time: '16:00',
        duration: 60,
        status: 'completed',
        meetingLink: 'https://meet.google.com/def-ghi-jkl',
        sessionType: 'individual'
      }
    ]
  })

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'no_show': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionTypeIcon = (type: Session['sessionType']) => {
    switch (type) {
      case 'individual': return '👤'
      case 'group': return '👥'
      case 'family': return '👨‍👩‍👧‍👦'
      case 'supervision': return '👨‍🏫'
      default: return '💬'
    }
  }

  const handleEmergencyIntervention = (session: Session) => {
    // Handle emergency intervention
    console.log('Emergency intervention for session:', session.id)
  }

  const SessionCard = ({ session }: { session: Session }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getSessionTypeIcon(session.sessionType)}</span>
            <span className="font-medium">{session.time}</span>
            <Badge className={getStatusColor(session.status)}>
              {session.status.replace('_', ' ')}
            </Badge>
          </div>
          <span className="text-sm text-gray-500">{session.duration} min</span>
        </div>
        
        <div className="space-y-1 mb-3">
          <p className="text-sm"><strong>Client:</strong> {session.clientName}</p>
          <p className="text-sm"><strong>Therapist:</strong> {session.therapistName}</p>
          <p className="text-sm"><strong>Type:</strong> {session.sessionType}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(session.meetingLink, '_blank')}
          >
            Join Meeting
          </Button>
          
          {(session.status === 'no_show' || session.status === 'scheduled') && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleEmergencyIntervention(session)}
            >
              Emergency Intervention
            </Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Calendar Management</h1>
            <p className="text-gray-600 mt-2">Track therapy sessions and manage schedules</p>
          </div>
          
          <div className="flex space-x-4">
            <Select value={viewType} onValueChange={(value: 'day' | 'week' | 'month') => setViewType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterBy} onValueChange={(value: 'all' | 'therapist' | 'client') => setFilterBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="therapist">By Therapist</SelectItem>
                <SelectItem value="client">By Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions Today</p>
                  <p className="text-3xl font-bold text-blue-600">{todaySchedule.totalSessions}</p>
                </div>
                <span className="text-3xl">📅</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{todaySchedule.completedSessions}</p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">No Shows</p>
                  <p className="text-3xl font-bold text-orange-600">{todaySchedule.noShowSessions}</p>
                </div>
                <span className="text-3xl">⚠️</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.round((todaySchedule.completedSessions / todaySchedule.totalSessions) * 100)}%
                  </p>
                </div>
                <span className="text-3xl">📊</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Show Alerts */}
        {todaySchedule.sessions.filter(s => s.status === 'no_show').length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>No Show Alert:</strong> {todaySchedule.sessions.filter(s => s.status === 'no_show').length} session(s) 
              marked as no-show today. Review for potential intervention.
            </AlertDescription>
          </Alert>
        )}

        {/* Calendar Views */}
        <Tabs value={filterBy} onValueChange={(value: 'all' | 'therapist' | 'client') => setFilterBy(value)}>
          <TabsList>
            <TabsTrigger value="all">All Sessions</TabsTrigger>
            <TabsTrigger value="therapist">By Therapist</TabsTrigger>
            <TabsTrigger value="client">By Client</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Sessions</CardTitle>
                    <CardDescription>
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {todaySchedule.sessions.length > 0 ? (
                      <div className="space-y-4">
                        {todaySchedule.sessions
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((session) => (
                            <SessionCard key={session.id} session={session} />
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No sessions scheduled for this date</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="therapist" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(therapistSchedules).map(([therapistName, sessions]) => (
                <Card key={therapistName}>
                  <CardHeader>
                    <CardTitle className="text-lg">{therapistName}</CardTitle>
                    <CardDescription>{sessions.length} session(s) today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {sessions.length > 0 ? (
                      <div className="space-y-3">
                        {sessions
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((session) => (
                            <div key={session.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{session.time}</span>
                                <Badge className={getStatusColor(session.status)}>
                                  {session.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{session.clientName}</p>
                              <p className="text-xs text-gray-500">{session.sessionType} • {session.duration} min</p>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No sessions today</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Sessions</CardTitle>
                <CardDescription>Sessions organized by client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.sessions
                    .sort((a, b) => a.clientName.localeCompare(b.clientName))
                    .map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{session.clientName}</h4>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Therapist:</strong> {session.therapistName}</p>
                            <p><strong>Time:</strong> {session.time}</p>
                          </div>
                          <div>
                            <p><strong>Type:</strong> {session.sessionType}</p>
                            <p><strong>Duration:</strong> {session.duration} min</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}