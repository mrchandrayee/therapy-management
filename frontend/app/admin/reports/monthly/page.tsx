'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, Download, TrendingUp, Users, DollarSign, Building2, Percent } from 'lucide-react'

interface MonthlyReportData {
    period: string
    summary: {
        clientsSeen: number
        totalSessions: number
        completedSessions: number
        totalRevenue: number
        activeTherapists: number
        activeCompanies: number
        totalDiscounts: number
    }
    therapistPerformance: Array<{
        id: string
        name: string
        sessionsCompleted: number
        revenue: number
        clientsSeen: number
        averageRating: number
        completionRate: number
    }>
    companyPerformance: Array<{
        id: string
        name: string
        sessionsBooked: number
        sessionsCompleted: number
        totalSpent: number
        activeEmployees: number
        completionRate: number
    }>
    revenueBreakdown: {
        directPayments: number
        companyPayments: number
        discountsApplied: number
        netRevenue: number
    }
}

export default function MonthlyReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('')
    const [reportData, setReportData] = useState<MonthlyReportData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Generate period options (last 12 months)
    const generatePeriodOptions = () => {
        const options = []
        const now = new Date()

        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            options.push({ value, label })
        }

        return options
    }

    const periodOptions = generatePeriodOptions()

    useEffect(() => {
        if (!selectedPeriod) {
            setSelectedPeriod(periodOptions[0]?.value || '')
        }
    }, [])

    useEffect(() => {
        if (selectedPeriod) {
            fetchReportData(selectedPeriod)
        }
    }, [selectedPeriod])

    const fetchReportData = async (period: string) => {
        setLoading(true)
        setError(null)

        try {
            // Mock data for now - replace with actual API call
            const mockData: MonthlyReportData = {
                period,
                summary: {
                    clientsSeen: 145,
                    totalSessions: 320,
                    completedSessions: 298,
                    totalRevenue: 485000,
                    activeTherapists: 12,
                    activeCompanies: 8,
                    totalDiscounts: 24500
                },
                therapistPerformance: [
                    {
                        id: '1',
                        name: 'Dr. Sarah Johnson',
                        sessionsCompleted: 45,
                        revenue: 67500,
                        clientsSeen: 28,
                        averageRating: 4.8,
                        completionRate: 95.6
                    },
                    {
                        id: '2',
                        name: 'Dr. Michael Chen',
                        sessionsCompleted: 38,
                        revenue: 57000,
                        clientsSeen: 24,
                        averageRating: 4.7,
                        completionRate: 92.3
                    },
                    {
                        id: '3',
                        name: 'Dr. Emily Rodriguez',
                        sessionsCompleted: 42,
                        revenue: 63000,
                        clientsSeen: 26,
                        averageRating: 4.9,
                        completionRate: 97.7
                    }
                ],
                companyPerformance: [
                    {
                        id: '1',
                        name: 'TechCorp Solutions',
                        sessionsBooked: 85,
                        sessionsCompleted: 78,
                        totalSpent: 117000,
                        activeEmployees: 45,
                        completionRate: 91.8
                    },
                    {
                        id: '2',
                        name: 'Global Industries',
                        sessionsBooked: 62,
                        sessionsCompleted: 59,
                        totalSpent: 88500,
                        activeEmployees: 32,
                        completionRate: 95.2
                    }
                ],
                revenueBreakdown: {
                    directPayments: 195000,
                    companyPayments: 290000,
                    discountsApplied: 24500,
                    netRevenue: 460500
                }
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            setReportData(mockData)
        } catch (err) {
            setError('Failed to fetch report data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleExportReport = () => {
        // Implement export functionality
        console.log('Exporting report for period:', selectedPeriod)
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading report data...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Monthly Reports</h1>
                        <p className="text-muted-foreground">
                            Comprehensive monthly performance and revenue analytics
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-48">
                                <Calendar className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                {periodOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleExportReport} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {reportData && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(reportData.summary.totalRevenue)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Net: {formatCurrency(reportData.revenueBreakdown.netRevenue)}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.summary.completedSessions}</div>
                                    <p className="text-xs text-muted-foreground">
                                        of {reportData.summary.totalSessions} booked
                                    </p>
                                    <Progress
                                        value={(reportData.summary.completedSessions / reportData.summary.totalSessions) * 100}
                                        className="mt-2"
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Clients Served</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.summary.clientsSeen}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {reportData.summary.activeTherapists} active therapists
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{reportData.summary.activeCompanies}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <Percent className="h-3 w-3 inline mr-1" />
                                        {formatCurrency(reportData.summary.totalDiscounts)} discounts
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Revenue Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Breakdown</CardTitle>
                                <CardDescription>
                                    Detailed breakdown of revenue sources for {periodOptions.find(p => p.value === selectedPeriod)?.label}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Direct Payments</p>
                                        <p className="text-xl font-semibold">{formatCurrency(reportData.revenueBreakdown.directPayments)}</p>
                                    </div>
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Company Payments</p>
                                        <p className="text-xl font-semibold">{formatCurrency(reportData.revenueBreakdown.companyPayments)}</p>
                                    </div>
                                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Discounts Applied</p>
                                        <p className="text-xl font-semibold text-red-600">-{formatCurrency(reportData.revenueBreakdown.discountsApplied)}</p>
                                    </div>
                                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Net Revenue</p>
                                        <p className="text-xl font-semibold text-primary">{formatCurrency(reportData.revenueBreakdown.netRevenue)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Therapist Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Therapist Performance</CardTitle>
                                <CardDescription>
                                    Individual therapist metrics and performance indicators
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Therapist</TableHead>
                                            <TableHead>Sessions</TableHead>
                                            <TableHead>Clients</TableHead>
                                            <TableHead>Revenue</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Completion Rate</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.therapistPerformance.map((therapist) => (
                                            <TableRow key={therapist.id}>
                                                <TableCell className="font-medium">{therapist.name}</TableCell>
                                                <TableCell>{therapist.sessionsCompleted}</TableCell>
                                                <TableCell>{therapist.clientsSeen}</TableCell>
                                                <TableCell>{formatCurrency(therapist.revenue)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        ⭐ {therapist.averageRating}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={therapist.completionRate} className="w-16" />
                                                        <span className="text-sm">{therapist.completionRate}%</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Company Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Performance</CardTitle>
                                <CardDescription>
                                    Corporate client engagement and utilization metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Sessions Booked</TableHead>
                                            <TableHead>Sessions Completed</TableHead>
                                            <TableHead>Active Employees</TableHead>
                                            <TableHead>Total Spent</TableHead>
                                            <TableHead>Completion Rate</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.companyPerformance.map((company) => (
                                            <TableRow key={company.id}>
                                                <TableCell className="font-medium">{company.name}</TableCell>
                                                <TableCell>{company.sessionsBooked}</TableCell>
                                                <TableCell>{company.sessionsCompleted}</TableCell>
                                                <TableCell>{company.activeEmployees}</TableCell>
                                                <TableCell>{formatCurrency(company.totalSpent)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={company.completionRate} className="w-16" />
                                                        <span className="text-sm">{company.completionRate}%</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}