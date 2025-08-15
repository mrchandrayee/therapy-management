'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function AdminCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'expired'>('all')

  const companies = [
    {
      id: 1,
      name: 'TechCorp Solutions Pvt Ltd',
      type: 'private',
      contactPerson: 'Rajesh Kumar',
      contactEmail: 'rajesh@techcorp.com',
      contactPhone: '+91-98765-43210',
      agreementStatus: 'active',
      agreementStart: '2024-01-01',
      agreementEnd: '2024-12-31',
      totalCommitted: 500000,
      amountUtilized: 325000,
      maxEmployees: 100,
      activeEmployees: 67,
      totalSessions: 234,
      discountPercentage: 15,
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    {
      id: 2,
      name: 'Global Innovations Ltd',
      type: 'public',
      contactPerson: 'Priya Sharma',
      contactEmail: 'priya@globalinnovations.com',
      contactPhone: '+91-87654-32109',
      agreementStatus: 'pending',
      agreementStart: '2025-02-01',
      agreementEnd: '2026-01-31',
      totalCommitted: 750000,
      amountUtilized: 0,
      maxEmployees: 150,
      activeEmployees: 0,
      totalSessions: 0,
      discountPercentage: 20,
      city: 'Bangalore',
      state: 'Karnataka'
    },
    {
      id: 3,
      name: 'StartupHub Incubator',
      type: 'startup',
      contactPerson: 'Amit Patel',
      contactEmail: 'amit@startuphub.com',
      contactPhone: '+91-76543-21098',
      agreementStatus: 'active',
      agreementStart: '2024-06-01',
      agreementEnd: '2025-05-31',
      totalCommitted: 200000,
      amountUtilized: 145000,
      maxEmployees: 50,
      activeEmployees: 32,
      totalSessions: 89,
      discountPercentage: 25,
      city: 'Pune',
      state: 'Maharashtra'
    }
  ]

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || company.agreementStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'pending': return 'warning'
      case 'expired': return 'destructive'
      case 'terminated': return 'destructive'
      default: return 'secondary'
    }
  }

  const getUtilizationPercentage = (utilized: number, committed: number) => {
    return committed > 0 ? (utilized / committed) * 100 : 0
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
            <p className="text-gray-600 mt-2">Manage corporate clients and their agreements</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">🏢</span>
              Add New Company
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{companies.length}</div>
              <div className="text-gray-600 text-sm">Total Companies</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {companies.filter(c => c.agreementStatus === 'active').length}
              </div>
              <div className="text-gray-600 text-sm">Active Agreements</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {companies.reduce((sum, c) => sum + c.activeEmployees, 0)}
              </div>
              <div className="text-gray-600 text-sm">Active Employees</div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ₹{(companies.reduce((sum, c) => sum + c.amountUtilized, 0) / 100000).toFixed(1)}L
              </div>
              <div className="text-gray-600 text-sm">Total Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['all', 'active', 'pending', 'expired'] as const).map((status) => (
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
              placeholder="Search companies..."
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

        {/* Companies List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} variant="elevated" className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {company.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <CardDescription>
                        {company.type.charAt(0).toUpperCase() + company.type.slice(1)} Company • {company.city}, {company.state}
                      </CardDescription>
                      <p className="text-sm text-gray-600 mt-1">
                        Contact: {company.contactPerson} • {company.contactEmail}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(company.agreementStatus)}>
                    {company.agreementStatus}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Agreement Details */}
                  <div>
                    <p className="text-sm text-gray-600">Agreement Period</p>
                    <p className="font-medium">
                      {new Date(company.agreementStart).toLocaleDateString('en-IN')} - 
                      {new Date(company.agreementEnd).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Discount: {company.discountPercentage}%
                    </p>
                  </div>

                  {/* Financial Details */}
                  <div>
                    <p className="text-sm text-gray-600">Financial Commitment</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{company.totalCommitted.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Utilized: ₹{company.amountUtilized.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Employee Stats */}
                  <div>
                    <p className="text-sm text-gray-600">Employee Coverage</p>
                    <p className="text-xl font-bold text-blue-600">
                      {company.activeEmployees}/{company.maxEmployees}
                    </p>
                    <p className="text-sm text-gray-600">
                      Sessions: {company.totalSessions}
                    </p>
                  </div>

                  {/* Utilization */}
                  <div>
                    <p className="text-sm text-gray-600">Budget Utilization</p>
                    <div className="mt-2">
                      <Progress 
                        value={getUtilizationPercentage(company.amountUtilized, company.totalCommitted)} 
                        className="mb-2"
                      />
                      <p className="text-sm font-medium">
                        {getUtilizationPercentage(company.amountUtilized, company.totalCommitted).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    View Employees
                  </Button>
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Coupons
                  </Button>
                  {company.agreementStatus === 'pending' && (
                    <>
                      <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm">
                        Reject
                      </Button>
                    </>
                  )}
                  {company.agreementStatus === 'active' && (
                    <Button variant="outline" size="sm">
                      Renew Agreement
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card variant="elevated">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No companies found
              </h3>
              <p className="text-gray-600">
                {searchQuery ? 'No companies match your search criteria.' : 'No companies registered yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}