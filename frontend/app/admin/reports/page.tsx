'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, Calendar, Users, DollarSign, TrendingUp, FileText } from 'lucide-react'

interface ReportData {
  month: string
  clientsSeen: number
  totalSessions: number
  directBookings: number
  companyBookings: number
  totalRevenue: number
  discountsGiven: number
  therapistsMapped: number
  companies: Array<{
    name: string
    sessions: number
    revenue: number
    discount: number
  }>
  therapists: Array<{
    name: string
    sessions: number
    clients: number
    revenue: number
  }>
}

export default function AdminReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-02')
  const [reportType, setReportType] = useState('monthly')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock report data
  const reportData: ReportData = {
    month: selectedMonth,
    clientsSeen: 156,
    totalSessions: 234,
    directBookings: 145,
    companyBookings: 89,
    totalRevenue: 468000,
    discountsGiven: 67200,
    therapistsMapped: 12,
    companies: [
      { name: 'TechCorp Solutions', sessions: 45, revenue: 135000, discount: 33750 },
      { name: 'HealthFirst Inc', sessions: 28, revenue: 84000, discount: 8400 },
      { name: 'Global Dynamics', sessions: 16, revenue: 48000, discount: 12000 }
    ],
    therapists: [
      { name: 'Dr. Sarah Johnson', sessions: 32, clients: 24, revenue: 96000 },
      { name: 'Dr. Michael Chen', sessions: 28, clients: 21, revenue: 84000 },
      { name: 'Dr. Priya Sharma', sessions: 25, clients: 19, revenue: 75000 },
      { name: 'Dr. James Wilson', sessions: 22, clients: 18, revenue: 66000 }
    ]
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    alert('Report generated successfully!')
  }

  const downloadReport = (format: 'pdf' | 'excel') => {
    // Simulate download
    alert(`Downloading ${format.toUpperCase()} report for ${selectedMonth}`)
  }

  const months = [
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-01', label: 'January 2024' },
    { value: '2023-12', label: 'December 2023' },
    { value: '2023-11', label: 'November 2023' },
    { value: '2023-10', label: 'October 2023' },
  ]

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Generate comprehensive reports for financial and statutory purposes</p>
          </div>
        </div>

        {/* Report Configuration */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Select parameters for report generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="quarterly">Quarterly Report</SelectItem>
                    <SelectItem value="yearly">Yearly Report</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="month">Select Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={generateReport} 
                  loading={isGenerating}
                  className="gradient-primary w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => downloadReport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => downloadReport('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients Seen</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.clientsSeen}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.totalSessions}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{reportData.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Therapists Active</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.therapistsMapped}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Booking Sources</CardTitle>
              <CardDescription>Direct vs Company bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Direct Bookings</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{reportData.directBookings}</p>
                    <p className="text-xs text-gray-500">
                      {((reportData.directBookings / reportData.totalSessions) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Company Bookings</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{reportData.companyBookings}</p>
                    <p className="text-xs text-gray-500">
                      {((reportData.companyBookings / reportData.totalSessions) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Discounts Given</span>
                    <span className="font-semibold text-red-600">₹{reportData.discountsGiven.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Financial summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gross Revenue</span>
                  <span className="font-semibold">₹{(reportData.totalRevenue + reportData.discountsGiven).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-600">Less: Discounts</span>
                  <span className="font-semibold text-red-600">-₹{reportData.discountsGiven.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Net Revenue</span>
                    <span className="font-bold text-green-600">₹{reportData.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Average per Session</span>
                  <span className="font-semibold">₹{Math.round(reportData.totalRevenue / reportData.totalSessions).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Performance */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Company Performance</CardTitle>
            <CardDescription>Sessions and revenue by company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Company Name</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Sessions</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Discount</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Net Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.companies.map((company, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{company.name}</td>
                      <td className="py-3 px-4 text-right">{company.sessions}</td>
                      <td className="py-3 px-4 text-right">₹{company.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-red-600">₹{company.discount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-semibold">₹{(company.revenue - company.discount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Therapist Performance */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Therapist Performance</CardTitle>
            <CardDescription>Sessions and revenue by therapist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Therapist Name</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Sessions</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Unique Clients</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue Generated</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Avg per Session</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.therapists.map((therapist, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{therapist.name}</td>
                      <td className="py-3 px-4 text-right">{therapist.sessions}</td>
                      <td className="py-3 px-4 text-right">{therapist.clients}</td>
                      <td className="py-3 px-4 text-right">₹{therapist.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">₹{Math.round(therapist.revenue / therapist.sessions).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Export & Compliance</CardTitle>
            <CardDescription>Generate reports for statutory and financial purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                Financial Report
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                Statutory Report
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                Tax Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}