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
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface ClientReport {
  id: string
  client_id: string
  client_name: string
  client_email: string
  report_type: 'psychological_assessment' | 'medical_report' | 'lab_results' | 'previous_therapy' | 'other'
  title: string
  description: string
  file_url: string
  file_type: string
  file_size: number
  uploaded_at: string
  uploaded_by: 'client' | 'therapist' | 'admin'
  status: 'new' | 'reviewed' | 'archived'
  session_id?: string
  notes?: string
  is_confidential: boolean
}

export default function ClientReportsPage() {
  const [reports, setReports] = useState<ClientReport[]>([
    {
      id: '1',
      client_id: 'CLT-001',
      client_name: 'John Doe',
      client_email: 'john.doe@email.com',
      report_type: 'psychological_assessment',
      title: 'Beck Depression Inventory Results',
      description: 'BDI-II assessment results from previous therapy',
      file_url: '/reports/bdi-results.pdf',
      file_type: 'PDF',
      file_size: 1.2,
      uploaded_at: '2024-02-10T14:30:00',
      uploaded_by: 'client',
      status: 'new',
      session_id: 'SES-001',
      is_confidential: true
    },
    {
      id: '2',
      client_id: 'CLT-002',
      client_name: 'Jane Smith',
      client_email: 'jane.smith@email.com',
      report_type: 'medical_report',
      title: 'Psychiatric Evaluation Report',
      description: 'Recent psychiatric evaluation from Dr. Williams',
      file_url: '/reports/psych-eval.pdf',
      file_type: 'PDF',
      file_size: 2.8,
      uploaded_at: '2024-02-08T09:15:00',
      uploaded_by: 'client',
      status: 'reviewed',
      notes: 'Reviewed during session on 2024-02-09. Key findings noted.',
      is_confidential: true
    },
    {
      id: '3',
      client_id: 'CLT-003',
      client_name: 'Mike Johnson',
      client_email: 'mike.johnson@email.com',
      report_type: 'lab_results',
      title: 'Blood Work - Thyroid Function',
      description: 'TSH and T4 levels to rule out thyroid-related mood symptoms',
      file_url: '/reports/thyroid-labs.pdf',
      file_type: 'PDF',
      file_size: 0.8,
      uploaded_at: '2024-02-05T16:45:00',
      uploaded_by: 'client',
      status: 'reviewed',
      notes: 'Normal thyroid function. Mood symptoms likely not thyroid-related.',
      is_confidential: true
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterClient, setFilterClient] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  const reportTypes = [
    { value: 'psychological_assessment', label: 'Psychological Assessment' },
    { value: 'medical_report', label: 'Medical Report' },
    { value: 'lab_results', label: 'Lab Results' },
    { value: 'previous_therapy', label: 'Previous Therapy Records' },
    { value: 'other', label: 'Other' }
  ]

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'psychological_assessment': return '🧠'
      case 'medical_report': return '🏥'
      case 'lab_results': return '🔬'
      case 'previous_therapy': return '📋'
      default: return '📄'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'warning'
      case 'reviewed': return 'success'
      case 'archived': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />
      case 'reviewed': return <CheckCircle className="w-4 h-4" />
      case 'archived': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const markAsReviewed = (reportId: string, notes: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: 'reviewed' as const, notes }
        : report
    ))
    alert('Report marked as reviewed')
  }

  const archiveReport = (reportId: string) => {
    if (confirm('Are you sure you want to archive this report?')) {
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: 'archived' as const }
          : report
      ))
      alert('Report archived')
    }
  }

  const downloadReport = (report: ClientReport) => {
    // In a real app, this would trigger a secure download
    alert(`Downloading ${report.title}...`)
  }

  const viewReport = (report: ClientReport) => {
    // In a real app, this would open the report in a secure viewer
    window.open(report.file_url, '_blank')
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    const matchesType = filterType === 'all' || report.report_type === filterType
    const matchesClient = filterClient === 'all' || report.client_id === filterClient
    
    return matchesSearch && matchesStatus && matchesType && matchesClient
  })

  const getReportsByTab = () => {
    switch (activeTab) {
      case 'new': return filteredReports.filter(r => r.status === 'new')
      case 'reviewed': return filteredReports.filter(r => r.status === 'reviewed')
      case 'archived': return filteredReports.filter(r => r.status === 'archived')
      default: return filteredReports
    }
  }

  const newReports = reports.filter(r => r.status === 'new')
  const reviewedReports = reports.filter(r => r.status === 'reviewed')
  const archivedReports = reports.filter(r => r.status === 'archived')
  const uniqueClients = [...new Set(reports.map(r => ({ id: r.client_id, name: r.client_name })))]

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Reports</h1>
            <p className="text-gray-600 mt-2">View and manage client-uploaded test reports and documents</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Reports</p>
                  <p className="text-2xl font-bold text-orange-600">{newReports.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviewed</p>
                  <p className="text-2xl font-bold text-green-600">{reviewedReports.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-purple-600">{uniqueClients.length}</p>
                </div>
                <User className="w-8 h-8 text-purple-500" />
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
                    placeholder="Search reports..."
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterClient} onValueChange={setFilterClient}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Tabs */}
        <Card variant="elevated">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
                <TabsTrigger value="new">New ({newReports.length})</TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed ({reviewedReports.length})</TabsTrigger>
                <TabsTrigger value="archived">Archived ({archivedReports.length})</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getReportsByTab().map((report) => (
                <Card key={report.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="text-2xl">
                            {getReportTypeIcon(report.report_type)}
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                            <p className="text-sm text-gray-600">{report.client_name} • {report.client_email}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusColor(report.status)}>
                              {getStatusIcon(report.status)}
                              <span className="ml-1 capitalize">{report.status}</span>
                            </Badge>
                            <Badge variant="outline">
                              {reportTypes.find(t => t.value === report.report_type)?.label}
                            </Badge>
                            {report.is_confidential && (
                              <Badge variant="destructive">Confidential</Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{report.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{new Date(report.uploaded_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span>{report.file_type} • {report.file_size} MB</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>Uploaded by {report.uploaded_by}</span>
                          </div>
                          {report.session_id && (
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Session:</span>
                              <span className="font-medium">{report.session_id}</span>
                            </div>
                          )}
                        </div>

                        {report.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-blue-800">
                              <strong>Notes:</strong> {report.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewReport(report)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadReport(report)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        
                        {report.status === 'new' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const notes = prompt('Add review notes (optional):')
                              markAsReviewed(report.id, notes || '')
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Reviewed
                          </Button>
                        )}
                        
                        {report.status === 'reviewed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => archiveReport(report.id)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Archive
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getReportsByTab().length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
                <p className="text-gray-600">
                  {activeTab === 'new' && "No new reports to review."}
                  {activeTab === 'reviewed' && "No reviewed reports."}
                  {activeTab === 'archived' && "No archived reports."}
                  {activeTab === 'all' && "No reports match your current filters."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}