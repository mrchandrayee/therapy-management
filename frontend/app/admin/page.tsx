'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '52,341', change: '+12%', color: 'text-blue-600' },
    { label: 'Active Therapists', value: '1,247', change: '+8%', color: 'text-green-600' },
    { label: 'Sessions Today', value: '342', change: '+15%', color: 'text-purple-600' },
    { label: 'Revenue (Month)', value: '₹12.4L', change: '+22%', color: 'text-yellow-600' },
    { label: 'Support Tickets', value: '23', change: '-5%', color: 'text-red-600' },
    { label: 'Platform Uptime', value: '99.9%', change: '0%', color: 'text-green-600' }
  ]

  const recentActivity = [
    { type: 'user', message: 'New user registration: John Doe', time: '2 min ago' },
    { type: 'therapist', message: 'Dr. Sarah Johnson completed session', time: '5 min ago' },
    { type: 'payment', message: 'Payment received: ₹1,500', time: '8 min ago' },
    { type: 'support', message: 'Support ticket resolved #1234', time: '12 min ago' },
    { type: 'system', message: 'System backup completed', time: '15 min ago' }
  ]

  const alerts = [
    { type: 'warning', message: 'Server CPU usage above 80%', priority: 'high' },
    { type: 'info', message: '5 therapist applications pending review', priority: 'medium' },
    { type: 'success', message: 'Monthly revenue target achieved', priority: 'low' }
  ]

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and management</p>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'warning' ? 'destructive' : alert.type === 'success' ? 'success' : 'info'}>
              <AlertDescription className="flex justify-between items-center">
                <span>{alert.message}</span>
                <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'warning' : 'secondary'}>
                  {alert.priority}
                </Badge>
              </AlertDescription>
            </Alert>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Badge variant={stat.change.startsWith('+') ? 'success' : stat.change.startsWith('-') ? 'destructive' : 'secondary'}>
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'therapist' ? 'bg-green-500' :
                      activity.type === 'payment' ? 'bg-yellow-500' :
                      activity.type === 'support' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">👥</span>
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">👨‍⚕️</span>
                  <span className="text-sm">Review Therapists</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">🎫</span>
                  <span className="text-sm">Create Coupons</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="text-2xl mb-2">📊</span>
                  <span className="text-sm">Generate Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}