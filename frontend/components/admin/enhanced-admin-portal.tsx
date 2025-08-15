'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Calendar, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  Building,
  UserCheck,
  Database,
  Activity,
  Settings,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface AdminStats {
  totalClients: number
  activeTherapists: number
  sessionsToday: number
  complianceRate: number
  pendingReports: number
  systemHealth: 'good' | 'warning' | 'critical'
}

interface ClientOverview {
  id: string
  name: string
  email: string
  therapist: string
  lastSession: string
  complianceStatus: 'compliant' | 'warning' | 'non-compliant'
  companyCode?: string
  sessionsRemaining: number
}

interface ComplianceAlert {
  id: string
  clientId: string
  clientName: string
  alertType: 'consent-expiring' | 'missing-consent' | 'data-breach' | 'retention-due'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  dueDate: string
  status: 'open' | 'in-progress' | 'resolved'
}

export function EnhancedAdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 1247,
    activeTherapists: 23,
    sessionsToday: 45,
    complianceRate: 94.2,
    pendingReports: 12,
    systemHealth: 'good'
  })

  const [clients] = useState<ClientOverview[]>([
    {
      id: 'CLI-001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      therapist: 'Dr. Sarah Johnson',
      lastSession: '2024-02-14',
      complianceStatus: 'compliant',
      companyCode: 'TECH001',
      sessionsRemaining: 8
    },
    {
      id: 'CLI-002',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      therapist: 'Dr. Michael Chen',
      lastSession: '2024-02-12',
      complianceStatus: 'warning',
      sessionsRemaining: 3
    },
    {
      id: 'CLI-003',
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      therapist: 'Dr. Priya Sharma',
      lastSession: '2024-02-10',
      complianceStatus: 'non-compliant',
      companyCode: 'HEALTH002',
      sessionsRemaining: 0
    }
  ])

  const [complianceAlerts] = useState<ComplianceAlert[]>([
    {
      id: 'ALERT-001',
      clientId: 'CLI-002',
      clientName: 'Jane Smith',
      alertType: 'consent-expiring',
      severity: 'medium',
      description: 'Data processing consent expires in 15 days',
      dueDate: '2024-03-01',
      status: 'open'
    },
    {
      id: 'ALERT-002',
      clientId: 'CLI-003',
      clientName: 'Bob Wilson',
      alertType: 'missing-consent',
      severity: 'high',
      description: 'Missing consent for session recording',
      dueDate: '2024-02-20',
      status: 'in-progress'
    },
    {
      id: 'ALERT-003',
      clientId: 'CLI-001',
      clientName: 'John Doe',
      alertType: 'retention-due',
      severity: 'low',
      description: 'Data retention review due',
      dueDate: '2024-03-15',
      status: 'open'
    }
  ])

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'non-compliant': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground">
            Comprehensive platform management and compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {stats.systemHealth !== 'good' && (
        <Alert className={stats.systemHealth === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
          <AlertTriangle className={`h-4 w-4 ${stats.systemHealth === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
          <AlertDescription className={stats.systemHealth === 'critical' ? 'text-red-800' : 'text-yellow-800'}>
            System health status: {stats.systemHealth}. Please review system metrics.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClients.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Therapists</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeTherapists}</div>
                <p className="text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  All verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.sessionsToday}</div>
                <p className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  8 in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">DPDP Compliance</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.complianceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {complianceAlerts.filter(a => a.status === 'open').length} alerts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Client Activity</CardTitle>
                <CardDescription>Latest client registrations and sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.slice(0, 5).map((client) => (
                    <div key={client.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Last session: {new Date(client.lastSession).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getComplianceColor(client.complianceStatus)}>
                        {client.complianceStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Alerts</CardTitle>
                <CardDescription>Active compliance issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceAlerts.filter(a => a.status !== 'resolved').slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.severity === 'critical' ? 'text-red-600' :
                          alert.severity === 'high' ? 'text-orange-600' :
                          alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        <div>
                          <p className="font-medium">{alert.clientName}</p>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Client Management</h2>
              <p className="text-muted-foreground">Manage client accounts and compliance status</p>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search clients..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Client</th>
                      <th className="p-4 font-medium">Therapist</th>
                      <th className="p-4 font-medium">Company</th>
                      <th className="p-4 font-medium">Last Session</th>
                      <th className="p-4 font-medium">Sessions Left</th>
                      <th className="p-4 font-medium">Compliance</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </td>
                        <td className="p-4">{client.therapist}</td>
                        <td className="p-4">
                          {client.companyCode ? (
                            <Badge variant="outline">
                              <Building className="h-3 w-3 mr-1" />
                              {client.companyCode}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Individual</span>
                          )}
                        </td>
                        <td className="p-4">
                          {new Date(client.lastSession).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge variant={client.sessionsRemaining > 5 ? 'default' : 'destructive'}>
                            {client.sessionsRemaining}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getComplianceColor(client.complianceStatus)}>
                            {client.complianceStatus}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">DPDP Act Compliance</h2>
            <p className="text-muted-foreground">Monitor and manage data protection compliance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Compliance Rate</span>
                    <Badge className="bg-green-100 text-green-800">
                      {stats.complianceRate}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Alerts</span>
                    <Badge className="bg-red-100 text-red-800">
                      {complianceAlerts.filter(a => a.status === 'open').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Consent Renewals Due</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {complianceAlerts.filter(a => a.alertType === 'consent-expiring').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Active Compliance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceAlerts.filter(a => a.status !== 'resolved').map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(alert.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium">{alert.clientName}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm">Resolve</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            <p className="text-muted-foreground">Generate compliance and operational reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  DPDP Compliance Report
                </CardTitle>
                <CardDescription>
                  Comprehensive data protection compliance report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Session Analytics
                </CardTitle>
                <CardDescription>
                  Detailed session statistics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Audit Report
                </CardTitle>
                <CardDescription>
                  Complete audit trail of data processing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Company Management</h2>
            <p className="text-muted-foreground">Manage corporate clients and employee validation</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Company management features will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">System Management</h2>
            <p className="text-muted-foreground">System health, configuration, and maintenance</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                System management features will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}