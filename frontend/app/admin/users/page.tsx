'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91-98765-43210',
      joinDate: '2024-12-01',
      lastActive: '2025-01-14',
      status: 'active',
      sessionsCount: 12,
      totalSpent: 18000,
      therapist: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+91-87654-32109',
      joinDate: '2024-11-15',
      lastActive: '2025-01-10',
      status: 'active',
      sessionsCount: 8,
      totalSpent: 12000,
      therapist: 'Dr. Michael Chen'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+91-76543-21098',
      joinDate: '2024-10-20',
      lastActive: '2024-12-25',
      status: 'inactive',
      sessionsCount: 3,
      totalSpent: 4500,
      therapist: 'Dr. Priya Sharma'
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'warning'
      case 'suspended': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage platform users and their activities</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">📊</span>
              Export Users
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{users.length}</div>
              <div className="text-gray-600 text-sm">Total Users</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-gray-600 text-sm">Active Users</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {users.reduce((sum, u) => sum + u.sessionsCount, 0)}
              </div>
              <div className="text-gray-600 text-sm">Total Sessions</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ₹{(users.reduce((sum, u) => sum + u.totalSpent, 0) / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-600 text-sm">Total Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['all', 'active', 'inactive', 'suspended'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search users..."
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

        {/* Users List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} variant="elevated" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-medium">{new Date(user.joinDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Active</p>
                    <p className="font-medium">{new Date(user.lastActive).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sessions</p>
                    <p className="font-medium">{user.sessionsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="font-medium">₹{user.totalSpent.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Therapist</p>
                    <p className="font-medium text-sm">{user.therapist}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    View Sessions
                  </Button>
                  <Button variant="outline" size="sm">
                    Payment History
                  </Button>
                  <Button variant="ghost" size="sm">
                    Send Message
                  </Button>
                  {user.status === 'active' && (
                    <Button variant="destructive" size="sm">
                      Suspend
                    </Button>
                  )}
                  {user.status === 'suspended' && (
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                      Reactivate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}