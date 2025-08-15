'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, User, Video, MapPin, Bell, AlertTriangle, CheckCircle, X } from 'lucide-react'

interface Session {
    id: string
    date: string
    time: string
    duration: number
    therapistName: string
    therapistImage?: string
    sessionType: 'individual' | 'family' | 'group'
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
    meetingLink?: string
    canJoin: boolean
    canReschedule: boolean
    canCancel: boolean
    notes?: string
    remindersSent: {
        booking: boolean
        dayBefore: boolean
        hourBefore: boolean
    }
}

export default function ClientCalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
    const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata')

    const sessions: Session[] = [
        {
            id: 'SES-001',
            date: '2024-02-15',
            time: '10:00',
            duration: 60,
            therapistName: 'Dr. Sarah Johnson',
            sessionType: 'individual',
            status: 'confirmed',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            canJoin: true,
            canReschedule: true,
            canCancel: true,
            notes: 'Focus on anxiety management techniques',
            remindersSent: {
                booking: true,
                dayBefore: true,
                hourBefore: false
            }
        },
        {
            id: 'SES-002',
            date: '2024-02-16',
            time: '14:30',
            duration: 90,
            therapistName: 'Dr. Michael Chen',
            sessionType: 'family',
            status: 'confirmed',
            meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
            canJoin: false,
            canReschedule: true,
            canCancel: true,
            notes: 'Family therapy session - communication issues',
            remindersSent: {
                booking: true,
                dayBefore: false,
                hourBefore: false
            }
        },
        {
            id: 'SES-003',
            date: '2024-02-18',
            time: '16:00',
            duration: 60,
            therapistName: 'Dr. Priya Sharma',
            sessionType: 'individual',
            status: 'pending',
            canJoin: false,
            canReschedule: true,
            canCancel: true,
            notes: 'Follow-up session for progress review',
            remindersSent: {
                booking: false,
                dayBefore: false,
                hourBefore: false
            }
        },
        {
            id: 'SES-004',
            date: '2024-02-12',
            time: '11:00',
            duration: 60,
            therapistName: 'Dr. Sarah Johnson',
            sessionType: 'individual',
            status: 'completed',
            canJoin: false,
            canReschedule: false,
            canCancel: false,
            notes: 'Completed session - good progress made',
            remindersSent: {
                booking: true,
                dayBefore: true,
                hourBefore: true
            }
        }
    ]

    const getStatusColor = (status: Session['status']) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            case 'completed': return 'bg-blue-100 text-blue-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getSessionTypeIcon = (type: Session['sessionType']) => {
        switch (type) {
            case 'individual': return <User className="h-4 w-4" />
            case 'family': return <User className="h-4 w-4" />
            case 'group': return <User className="h-4 w-4" />
            default: return <User className="h-4 w-4" />
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const isToday = (dateString: string) => {
        const today = new Date().toISOString().split('T')[0]
        return dateString === today
    }

    const canJoinNow = (session: Session) => {
        if (!session.canJoin || !session.meetingLink) return false

        const sessionDateTime = new Date(`${session.date}T${session.time}:00`)
        const now = new Date()
        const timeDiff = sessionDateTime.getTime() - now.getTime()
        const minutesDiff = timeDiff / (1000 * 60)

        // Enhanced 5-minute rule: Can join 5 minutes before to 15 minutes after session start
        return minutesDiff >= -5 && minutesDiff <= 15
    }

    const getJoinButtonState = (session: Session) => {
        if (!session.canJoin || !session.meetingLink) return { canJoin: false, message: 'No meeting link available' }

        const sessionDateTime = new Date(`${session.date}T${session.time}:00`)
        const now = new Date()
        const timeDiff = sessionDateTime.getTime() - now.getTime()
        const minutesDiff = timeDiff / (1000 * 60)

        if (minutesDiff > 5) {
            const timeUntil = Math.ceil(minutesDiff)
            return { 
                canJoin: false, 
                message: `Available in ${timeUntil} minutes`,
                countdown: timeUntil
            }
        }

        if (minutesDiff >= -5 && minutesDiff <= 15) {
            return { canJoin: true, message: 'Join Now' }
        }

        if (minutesDiff < -15) {
            return { canJoin: false, message: 'Session ended' }
        }

        return { canJoin: false, message: 'Not available' }
    }

    const convertToClientTimezone = (date: string, time: string, fromTz: string, toTz: string) => {
        const dateTime = new Date(`${date}T${time}:00`)
        return dateTime.toLocaleString('en-US', {
            timeZone: toTz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Calendar</h1>
                        <p className="text-muted-foreground">
                            Manage your therapy sessions and appointments
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                                <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day">Day</SelectItem>
                                <SelectItem value="week">Week</SelectItem>
                                <SelectItem value="month">Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Upcoming Sessions Alert */}
                {sessions.some(s => isToday(s.date) && s.status === 'confirmed') && (
                    <Alert>
                        <Bell className="h-4 w-4" />
                        <AlertDescription>
                            You have sessions scheduled for today. Check your calendar below.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Sessions List */}
                <div className="grid gap-4">
                    {sessions
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((session) => (
                            <Card key={session.id} className={`${isToday(session.date) ? 'ring-2 ring-blue-500' : ''}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                {getSessionTypeIcon(session.sessionType)}
                                                <CardTitle className="text-lg">{session.therapistName}</CardTitle>
                                            </div>
                                            <Badge className={getStatusColor(session.status)}>
                                                {session.status}
                                            </Badge>
                                            {isToday(session.date) && (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                    Today
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {session.status === 'confirmed' && (() => {
                                                const joinState = getJoinButtonState(session)
                                                if (joinState.canJoin) {
                                                    return (
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                            <Video className="h-4 w-4 mr-2" />
                                                            {joinState.message}
                                                        </Button>
                                                    )
                                                } else if (joinState.countdown) {
                                                    return (
                                                        <Button size="sm" variant="outline" disabled>
                                                            <Clock className="h-4 w-4 mr-2" />
                                                            {joinState.message}
                                                        </Button>
                                                    )
                                                }
                                                return null
                                            })()}
                                            {session.canReschedule && session.status !== 'completed' && (
                                                <Button variant="outline" size="sm">
                                                    Reschedule
                                                </Button>
                                            )}
                                            {session.canCancel && session.status !== 'completed' && session.status !== 'cancelled' && (
                                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <CardDescription className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(session.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {session.time} ({session.duration} min)
                                        </span>
                                        <span className="flex items-center gap-1 capitalize">
                                            <MapPin className="h-4 w-4" />
                                            {session.sessionType} session
                                        </span>
                                    </CardDescription>
                                </CardHeader>

                                {session.notes && (
                                    <CardContent className="pt-0">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-sm text-gray-700">{session.notes}</p>
                                        </div>
                                    </CardContent>
                                )}

                                {/* Reminder Status */}
                                <CardContent className="pt-0">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className={`h-3 w-3 ${session.remindersSent.booking ? 'text-green-500' : 'text-gray-300'}`} />
                                            Booking confirmed
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className={`h-3 w-3 ${session.remindersSent.dayBefore ? 'text-green-500' : 'text-gray-300'}`} />
                                            Day before reminder
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className={`h-3 w-3 ${session.remindersSent.hourBefore ? 'text-green-500' : 'text-gray-300'}`} />
                                            Hour before reminder
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>

                {sessions.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No sessions scheduled</h3>
                            <p className="text-muted-foreground text-center">
                                You don't have any therapy sessions scheduled at the moment.
                            </p>
                            <Button className="mt-4">
                                Schedule a Session
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}