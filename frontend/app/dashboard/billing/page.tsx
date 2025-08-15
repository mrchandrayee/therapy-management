'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'packages' | 'methods'>('overview')

  const billingData = {
    currentPlan: {
      name: 'Standard Plan',
      price: 1999,
      sessionsIncluded: 4,
      sessionsUsed: 2,
      nextBilling: '2025-02-15',
      status: 'active'
    },
    recentPayments: [
      {
        id: 'PAY-001',
        date: '2025-01-15',
        amount: 1999,
        description: 'Standard Plan - Monthly',
        status: 'completed',
        invoice: 'INV-20250115-001',
        therapist: 'Dr. Sarah Johnson'
      },
      {
        id: 'PAY-002',
        date: '2025-01-10',
        amount: 1500,
        description: 'Individual Session',
        status: 'completed',
        invoice: 'INV-20250110-002',
        therapist: 'Dr. Michael Chen'
      },
      {
        id: 'PAY-003',
        date: '2024-12-15',
        amount: 1999,
        description: 'Standard Plan - Monthly',
        status: 'completed',
        invoice: 'INV-20241215-003',
        therapist: 'Dr. Sarah Johnson'
      }
    ],
    packages: [
      {
        id: 'PKG-001',
        name: '6 Session Package',
        totalSessions: 6,
        sessionsUsed: 3,
        purchaseDate: '2024-12-01',
        expiryDate: '2025-03-01',
        amount: 8500,
        therapist: 'Dr. Sarah Johnson',
        status: 'active'
      }
    ],
    paymentMethods: [
      {
        id: 'PM-001',
        type: 'card',
        cardType: 'visa',
        lastFour: '1234',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true
      },
      {
        id: 'PM-002',
        type: 'upi',
        upiId: 'john.doe@paytm',
        isDefault: false
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'destructive'
      case 'active': return 'success'
      case 'expired': return 'destructive'
      default: return 'secondary'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{billingData.currentPlan.name}</h3>
              <p className="text-gray-600">₹{billingData.currentPlan.price}/month</p>
            </div>
            <Badge variant={getStatusColor(billingData.currentPlan.status)}>
              {billingData.currentPlan.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {billingData.currentPlan.sessionsUsed}/{billingData.currentPlan.sessionsIncluded}
              </div>
              <div className="text-sm text-gray-600">Sessions Used</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {billingData.currentPlan.sessionsIncluded - billingData.currentPlan.sessionsUsed}
              </div>
              <div className="text-sm text-gray-600">Sessions Remaining</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {new Date(billingData.currentPlan.nextBilling).toLocaleDateString('en-IN')}
              </div>
              <div className="text-sm text-gray-600">Next Billing</div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button className="gradient-primary">Upgrade Plan</Button>
            <Button variant="outline">Change Plan</Button>
            <Button variant="destructive">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ₹{billingData.recentPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
            </div>
            <div className="text-gray-600 text-sm">Total Spent</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {billingData.recentPayments.length}
            </div>
            <div className="text-gray-600 text-sm">Total Payments</div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {billingData.packages.reduce((sum, p) => sum + p.sessionsUsed, 0)}
            </div>
            <div className="text-gray-600 text-sm">Sessions Completed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment History</h3>
        <Button variant="outline">Download All Invoices</Button>
      </div>
      
      <div className="space-y-4">
        {billingData.recentPayments.map((payment) => (
          <Card key={payment.id} variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{payment.description}</h4>
                      <p className="text-sm text-gray-600">
                        {payment.therapist} • {new Date(payment.date).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500">Payment ID: {payment.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </div>
                  <Badge variant={getStatusColor(payment.status)} size="sm">
                    {payment.status}
                  </Badge>
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    Download Invoice
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPackages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Session Packages</h3>
        <Button className="gradient-primary">Buy New Package</Button>
      </div>
      
      {billingData.packages.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Packages</h3>
            <p className="text-gray-600 mb-6">
              Purchase session packages to save money on multiple sessions
            </p>
            <Button className="gradient-primary">Browse Packages</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {billingData.packages.map((pkg) => (
            <Card key={pkg.id} variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{pkg.name}</h4>
                    <p className="text-gray-600">with {pkg.therapist}</p>
                  </div>
                  <Badge variant={getStatusColor(pkg.status)}>
                    {pkg.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Sessions Used</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {pkg.sessionsUsed}/{pkg.totalSessions}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purchase Date</p>
                    <p className="font-medium">{new Date(pkg.purchaseDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-medium">{new Date(pkg.expiryDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="text-xl font-bold text-green-600">₹{pkg.amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">Book Session</Button>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <Button className="gradient-primary">Add Payment Method</Button>
      </div>
      
      <div className="space-y-4">
        {billingData.paymentMethods.map((method) => (
          <Card key={method.id} variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {method.type === 'card' ? '💳' : '📱'}
                  </div>
                  <div>
                    {method.type === 'card' ? (
                      <>
                        <h4 className="font-semibold text-gray-900">
                          {method.cardType?.toUpperCase()} •••• {method.lastFour}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">UPI</h4>
                        <p className="text-sm text-gray-600">{method.upiId}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {method.isDefault && (
                    <Badge variant="success" size="sm">Default</Badge>
                  )}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600 mt-2">Manage your subscription, payments, and billing information</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">💳</span>
              Make Payment
            </Button>
          </div>
        </div>

        {/* Billing Alert */}
        <Alert variant="info">
          <AlertDescription>
            Your next billing date is <strong>{new Date(billingData.currentPlan.nextBilling).toLocaleDateString('en-IN')}</strong>. 
            Amount: ₹{billingData.currentPlan.price}
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'payments', label: 'Payment History', icon: '💳' },
            { id: 'packages', label: 'Packages', icon: '📦' },
            { id: 'methods', label: 'Payment Methods', icon: '🏦' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'packages' && renderPackages()}
          {activeTab === 'methods' && renderPaymentMethods()}
        </div>
      </div>
    </DashboardLayout>
  )
}