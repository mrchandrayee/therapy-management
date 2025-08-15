'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress, CircularProgress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertIcons } from '@/components/ui/alert'

export default function DashboardPage() {
  const upcomingSessions = [
    {
      id: 1,
      therapist: 'Dr. Sarah Johnson',
      date: '2025-01-15',
      time: '10:00 AM',
      type: 'Individual Therapy',
      status: 'confirmed'
    },
    {
      id: 2,
      therapist: 'Dr. Michael Chen',
      date: '2025-01-17',
      time: '2:30 PM',
      type: 'Couples Therapy',
      status: 'pending'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Session completed',
      details: 'Individual therapy with Dr. Sarah Johnson',
      time: '2 hours ago',
      type: 'session'
    },
    {
      id: 2,
      action: 'Message received',
      details: 'New message from Dr. Michael Chen',
      time: '1 day ago',
      type: 'message'
    },
    {
      id: 3,
      action: 'Progress updated',
      details: 'Weekly mood tracking completed',
      time: '2 days ago',
      type: 'progress'
    }
  ]

  const stats = [
    {
      title: 'Total Sessions',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: '📅'
    },
    {
      title: 'This Month',
      value: '6',
      change: '+2',
      changeType: 'positive',
      icon: '🗓️'
    },
    {
      title: 'Mood Score',
      value: '7.2',
      change: '+0.8',
      changeType: 'positive',
      icon: '😊'
    },
    {
      title: 'Streak',
      value: '12 days',
      change: 'Active',
      changeType: 'neutral',
      icon: '🔥'
    }
  ]

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your mental health journey today.</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">📞</span>
              Book Emergency Session
            </Button>
          </div>
        </div>

        {/* Important Alert */}
        <Alert variant="info" closable>
          <AlertIcons.info />
          <AlertDescription>
            <strong>Reminder:</strong> You have a session with Dr. Sarah Johnson tomorrow at 10:00 AM. 
            <Button variant="link" className="p-0 h-auto ml-2">
              View details
            </Button>
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated" className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <span className="text-2xl">{stat.icon}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center mt-1">
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'success' : stat.changeType === 'negative' ? 'destructive' : 'secondary'}
                    size="sm"
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Upcoming Sessions</span>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardTitle>
                <CardDescription>
                  Your scheduled therapy sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {session.therapist.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{session.therapist}</p>
                          <p className="text-sm text-gray-600">{session.type}</p>
                          <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={session.status === 'confirmed' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {session.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress & Activity */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your mental health journey</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <CircularProgress 
                  value={72} 
                  size={120}
                  label="Overall"
                  className="mb-4"
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mood Tracking</span>
                    <span>6/7 days</span>
                  </div>
                  <Progress value={85} variant="success" size="sm" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Session Attendance</span>
                    <span>2/2 sessions</span>
                  </div>
                  <Progress value={100} variant="success" size="sm" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Exercise Goals</span>
                    <span>4/5 days</span>
                  </div>
                  <Progress value={80} variant="warning" size="sm" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'session' ? 'bg-green-500' :
                        activity.type === 'message' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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
                { name: 'Book Session', icon: '📅', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
                { name: 'Send Message', icon: '💬', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
                { name: 'Track Mood', icon: '😊', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
                { name: 'View Progress', icon: '📊', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                { name: 'Resources', icon: '📚', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' },
                { name: 'Support', icon: '🎧', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`h-20 flex-col space-y-2 ${action.color}`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}