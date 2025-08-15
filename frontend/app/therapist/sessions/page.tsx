'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  FileText, 
  Search, 
  Filter,
  Play,
  Pause,
  Square,
  Plus,
  Eye,
  MessageSquare,
  Phone
} from 'lucide-react'

interface Session {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  date: string
  time: string
  duration: number
  type: 'individual' | 'family' | 'group' | 'supervision' | 'training'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  meetingLink: string
  notes?: string
  extensionsUsed: number
  maxExtensions: number
  totalExtended: number
  participants?: string[]
  sessionPrice: number
  timezone: string
  remindersSent: number
  lastReminderSent?: string
}

export default function TherapistSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'SES-001',
      clientId: 'CLT-001',
      clientName: 'John Doe',
      clientEmail: 'john.doe@email.com',
      date: '2024-02-15',
      time: '14:00',
      duration: 60,
      type: 'individual',
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      extensionsUsed: 0,
      maxExtensions: 3,
      totalExtended: 0,
      sessionPrice: 2500,
      timezone: 'Asia/Kolkata',
      remindersSent: 2,
      lastReminderSent: '2024-02-14T10:00:00'
    },
    {
      id: 'SES-002',
      clientId: 'CLT-002',
      clientName: 'Jane Smith',
      clientEmail: 'jane.smith@email.com',
      date: '2024-02-15',
      time: '16:00',
      duration: 90,
      type: 'family',
      status: 'in-progress',
      meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
      extensionsUsed: 1,
      maxExtensions: 3,
      totalExtended: 10,
      participants: ['Jane Smith', 'Mike Smith', 'Sarah Smith'],
      sessionPrice: 3500,
      timezone: 'Asia/Kolkata',
      remindersSent: 3,
      lastReminderSent: '2024-02-15T08:00:00'
    },
    {
      id: 'SES-003',
      clientId: 'CLT-003',
      clientName: 'Mike Johnson',
      clientEmail: 'mike.johnson@email.com',
      date: '2024-02-14',
      time: '10:00',
      duration: 60,
      type: 'individual',
      status: 'completed',
      meetingLink: 'https://meet.google.com/def-ghi-jkl',
      extensionsUsed: 2,
      maxExtensions: 3,
      totalExtended: 20,
      sessionPrice: 2500,
      timezone: 'Asia/Kolkata',
      remindersSent: 3,
      notes: 'Client showed significant improvement in anxiety management techniques.'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [activeTab, setActiveTab] = useState('today')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary'
      case 'in-progress': return 'warning'
      case 'completed': return 'success'
      case 'cancelled': return 'destructive'
      case 'no-show': return 'secondary'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <User className="w-4 h-4" />
      case 'family': return <User className="w-4 h-4" />
      case 'group': return <User className="w-4 h-4" />
      case 'supervision': return <FileText className="w-4 h-4" />
      case 'training': return <FileText className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const joinSession = (session: Session) => {
    // Update session status to in-progress
    setSessions(sessions.map(s => 
      s.id === session.id ? { ...s, status: 'in-progress' as const } : s
    ))
    
    // Open meeting link
    window.open(session.meetingLink, '_blank')
  }

  const endSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, status: 'completed' as const } : s
    ))
    alert('Session ended. You can now add session notes.')
  }

  const extendSession = (sessionId: string) => {
    setSessions(sessions.map(s => {
      if (s.id === sessionId && s.extensionsUsed < s.maxExtensions) {
        return {
          ...s,
          extensionsUsed: s.extensionsUsed + 1,
          totalExtended: s.totalExtended + 10
        }
      }
      return s
    }))
    alert('Session extended by 10 minutes. Client has been notified.')
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus
    const matchesType = filterType === 'all' || session.type === filterType
    const matchesDate = !selectedDate || session.date === selectedDate
    
    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0])
  const upcomingSessions = sessions.filter(s => new Date(s.date) > new Date())
  const completedSessions = sessions.filter(s => s.status === 'completed')

  const getSessionsByTab = () => {
    switch (activeTab) {
      case 'today': return todaySessions
      case 'upcoming': return upcomingSessions
      case 'completed': return completedSessions
      default: return filteredSessions
    }
  }

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-600 mt-2">Manage your therapy sessions and client interactions</p>
          </div>
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{todaySessions.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sessions.filter(s => s.status === 'in-progress').length}
                  </p>
                </div>
                <Video className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedSessions.length}</p>
                </div>
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="supervision">Supervision</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sessions Tabs */}
        <Card variant="elevated">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="today">Today ({todaySessions.length})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedSessions.length})</TabsTrigger>
                <TabsTrigger value="all">All Sessions</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSessionsByTab().map((session) => (
                <Card key={session.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {session.clientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{session.clientName}</h3>
                            <p className="text-sm text-gray-600">{session.clientEmail}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                            <Badge variant="outline">
                              {getTypeIcon(session.type)}
                              <span className="ml-1 capitalize">{session.type}</span>
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{session.time} ({session.duration + session.totalExtended} min)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Price:</span>
                            <span className="font-medium">₹{session.sessionPrice}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Extensions:</span>
                            <span className="font-medium">{session.extensionsUsed}/{session.maxExtensions}</span>
                          </div>
                        </div>

                        {session.participants && session.participants.length > 1 && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              <strong>Participants:</strong> {session.participants.join(', ')}
                            </p>
                          </div>
                        )}

                        {session.notes && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Notes:</strong> {session.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Session ID: {session.id}</span>
                          <span>Reminders sent: {session.remindersSent}</span>
                          {session.lastReminderSent && (
                            <span>Last reminder: {new Date(session.lastReminderSent).toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                        {session.status === 'scheduled' && (
                          <>
                            <Button
                              onClick={() => joinSession(session)}
                              className="gradient-primary"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join Session
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Client
                            </Button>
                          </>
                        )}

                        {session.status === 'in-progress' && (
                          <>
                            <Button
                              onClick={() => extendSession(session.id)}
                              variant="outline"
                              disabled={session.extensionsUsed >= session.maxExtensions}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Extend (+10 min)
                            </Button>
                            <Button
                              onClick={() => endSession(session.id)}
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Square className="w-4 h-4 mr-2" />
                              End Session
                            </Button>
                          </>
                        )}

                        {session.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Notes
                          </Button>
                        )}

                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getSessionsByTab().length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Sessions Found</h3>
                <p className="text-gray-600">
                  {activeTab === 'today' && "You have no sessions scheduled for today."}
                  {activeTab === 'upcoming' && "You have no upcoming sessions."}
                  {activeTab === 'completed' && "You have no completed sessions."}
                  {activeTab === 'all' && "No sessions match your current filters."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}