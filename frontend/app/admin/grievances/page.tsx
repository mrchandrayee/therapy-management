'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminGrievancesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'under_review' | 'resolved'>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all')

  const grievances = [
    {
      id: 'GRV-001',
      title: 'Session audio quality issues',
      description: 'Experiencing poor audio quality during video sessions with Dr. Sarah Johnson',
      type: 'technical_issue',
      priority: 'high',
      status: 'under_review',
      submittedBy: 'John Doe',
      submittedAt: '2025-01-14T10:30:00Z',
      assignedTo: 'Tech Support Team',
      dueDate: '2025-01-16T18:00:00Z',
      session: 'SES-12345',
      therapist: 'Dr. Sarah Johnson'
    },
    {
      id: 'GRV-002',
      title: 'Billing discrepancy in monthly subscription',
      description: 'Charged twice for January subscription. Need immediate refund.',
      type: 'billing_issue',
      priority: 'urgent',
      status: 'submitted',
      submittedBy: 'Jane Smith',
      submittedAt: '2025-01-13T14:20:00Z',
      assignedTo: null,
      dueDate: '2025-01-15T14:20:00Z',
      payment: 'PAY-67890'
    },
    {
      id: 'GRV-003',
      title: 'Therapist unprofessional behavior',
      description: 'Dr. Michael Chen was late to session and seemed unprepared',
      type: 'therapist_conduct',
      priority: 'medium',
      status: 'resolved',
      submittedBy: 'Mike Johnson',
      submittedAt: '2025-01-10T09:15:00Z',
      assignedTo: 'Clinical Director',
      dueDate: '2025-01-12T09:15:00Z',
      resolvedAt: '2025-01-12T16:30:00Z',
      resolution: 'Spoke with therapist. Additional training provided. Client offered free session.',
      therapist: 'Dr. Michael Chen',
      satisfactionRating: 4
    },
    {
      id: 'GRV-004',
      title: 'Privacy concern about data sharing',
      description: 'Concerned about how my therapy notes are being stored and shared',
      type: 'privacy_concern',
      priority: 'high',
      status: 'under_review',
      submittedBy: 'Anonymous User',
      submittedAt: '2025-01-12T11:45:00Z',
      assignedTo: 'Privacy Officer',
      dueDate: '2025-01-14T11:45:00Z'
    }
  ]

  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grievance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grievance.submittedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || grievance.status === filterStatus
    const matchesPriority = filterPriority === 'all' || grievance.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'warning'
      case 'under_review': return 'info'
      case 'investigating': return 'info'
      case 'resolved': return 'success'
      case 'closed': return 'secondary'
      case 'escalated': return 'destructive'
      default: return 'secondary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical_issue': return '🔧'
      case 'billing_issue': return '💳'
      case 'therapist_conduct': return '👨‍⚕️'
      case 'privacy_concern': return '🔒'
      case 'service_quality': return '⭐'
      case 'accessibility': return '♿'
      default: return '📋'
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'resolved' || status === 'closed') return false
    return new Date(dueDate) < new Date()
  }

  const stats = {
    total: grievances.length,
    submitted: grievances.filter(g => g.status === 'submitted').length,
    underReview: grievances.filter(g => g.status === 'under_review').length,
    resolved: grievances.filter(g => g.status === 'resolved').length,
    overdue: grievances.filter(g => isOverdue(g.dueDate, g.status)).length
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grievance Management</h1>
            <p className="text-gray-600 mt-2">Handle customer complaints and support requests</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">📊</span>
              Grievance Report
            </Button>
          </div>
        </div>

        {/* Overdue Alert */}
        {stats.overdue > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>{stats.overdue} grievances are overdue</strong> and require immediate attention. 
              Please review and take action to maintain service quality.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
              <div className="text-gray-600 text-sm">Total Grievances</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.submitted}</div>
              <div className="text-gray-600 text-sm">New Submissions</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.underReview}</div>
              <div className="text-gray-600 text-sm">Under Review</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.resolved}</div>
              <div className="text-gray-600 text-sm">Resolved</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.overdue}</div>
              <div className="text-gray-600 text-sm">Overdue</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(['all', 'submitted', 'under_review', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFilterPriority(priority)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filterPriority === priority
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-64">
            <Input
              placeholder="Search grievances..."
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

        {/* Grievances List */}
        <div className="space-y-6">
          {filteredGrievances.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No grievances found
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? 'No grievances match your search criteria.' : 'No grievances to display.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredGrievances.map((grievance) => (
                <Card 
                  key={grievance.id} 
                  variant="elevated" 
                  className={`hover:shadow-lg transition-shadow ${
                    isOverdue(grievance.dueDate, grievance.status) ? 'border-red-200 bg-red-50' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{getTypeIcon(grievance.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-lg">{grievance.title}</CardTitle>
                            {isOverdue(grievance.dueDate, grievance.status) && (
                              <Badge variant="destructive" size="sm">OVERDUE</Badge>
                            )}
                          </div>
                          <CardDescription className="mb-2">
                            Grievance ID: {grievance.id} • Submitted by {grievance.submittedBy}
                          </CardDescription>
                          <p className="text-gray-700 text-sm">{grievance.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusColor(grievance.status)}>
                          {grievance.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityColor(grievance.priority)} size="sm">
                          {grievance.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="font-medium">
                          {new Date(grievance.submittedAt).toLocaleDateString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(grievance.submittedAt).toLocaleTimeString('en-IN')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className={`font-medium ${
                          isOverdue(grievance.dueDate, grievance.status) ? 'text-red-600' : ''
                        }`}>
                          {new Date(grievance.dueDate).toLocaleDateString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(grievance.dueDate).toLocaleTimeString('en-IN')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Assigned To</p>
                        <p className="font-medium">
                          {grievance.assignedTo || 'Unassigned'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Related</p>
                        <div className="space-y-1">
                          {grievance.session && (
                            <p className="text-xs text-blue-600">Session: {grievance.session}</p>
                          )}
                          {grievance.payment && (
                            <p className="text-xs text-green-600">Payment: {grievance.payment}</p>
                          )}
                          {grievance.therapist && (
                            <p className="text-xs text-purple-600">Therapist: {grievance.therapist}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Resolution Details */}
                    {grievance.status === 'resolved' && grievance.resolution && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-green-800 mb-2">Resolution</h4>
                        <p className="text-green-700 text-sm mb-2">{grievance.resolution}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-green-600">
                            Resolved on {new Date(grievance.resolvedAt!).toLocaleDateString('en-IN')}
                          </p>
                          {grievance.satisfactionRating && (
                            <div className="flex items-center">
                              <span className="text-xs text-green-600 mr-1">Satisfaction:</span>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < grievance.satisfactionRating! ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Add Comment
                      </Button>
                      
                      {grievance.status === 'submitted' && (
                        <>
                          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Assign
                          </Button>
                          <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Start Review
                          </Button>
                        </>
                      )}
                      
                      {grievance.status === 'under_review' && (
                        <>
                          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                            Mark Resolved
                          </Button>
                          <Button variant="destructive" size="sm">
                            Escalate
                          </Button>
                        </>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        Contact User
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