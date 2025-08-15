'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CouponsPage() {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    message: string
    discount?: number
    sessions?: number
  } | null>(null)

  const availableCoupons = [
    {
      id: 'COUP-001',
      code: 'WELCOME20',
      name: 'Welcome Discount',
      description: '20% off your first session',
      discountType: 'percentage',
      discountValue: 20,
      validUntil: '2025-03-31',
      maxSessions: 1,
      sessionsUsed: 0,
      status: 'active',
      source: 'promotional'
    },
    {
      id: 'COUP-002',
      code: 'COMPANY123',
      name: 'TechCorp Employee Benefit',
      description: 'Company-sponsored therapy sessions',
      discountType: 'percentage',
      discountValue: 100,
      validUntil: '2025-12-31',
      maxSessions: 6,
      sessionsUsed: 2,
      status: 'active',
      source: 'company',
      companyName: 'TechCorp Solutions'
    },
    {
      id: 'COUP-003',
      code: 'REFER50',
      name: 'Referral Bonus',
      description: '50% off when you refer a friend',
      discountType: 'percentage',
      discountValue: 50,
      validUntil: '2025-02-28',
      maxSessions: 2,
      sessionsUsed: 1,
      status: 'active',
      source: 'referral'
    }
  ]

  const usedCoupons = [
    {
      id: 'COUP-004',
      code: 'FIRST100',
      name: 'First Session Free',
      description: 'Complimentary first therapy session',
      discountValue: 100,
      usedAt: '2024-12-15',
      sessionId: 'SES-12345',
      therapist: 'Dr. Sarah Johnson',
      savedAmount: 1500
    }
  ]

  const validateCoupon = async () => {
    if (!couponCode.trim()) return

    setIsValidating(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation logic
      const existingCoupon = availableCoupons.find(c => 
        c.code.toLowerCase() === couponCode.toLowerCase()
      )
      
      if (existingCoupon) {
        if (existingCoupon.sessionsUsed >= existingCoupon.maxSessions) {
          setValidationResult({
            valid: false,
            message: 'This coupon has been fully used'
          })
        } else if (new Date(existingCoupon.validUntil) < new Date()) {
          setValidationResult({
            valid: false,
            message: 'This coupon has expired'
          })
        } else {
          setValidationResult({
            valid: true,
            message: `Valid coupon! ${existingCoupon.discountValue}% discount available`,
            discount: existingCoupon.discountValue,
            sessions: existingCoupon.maxSessions - existingCoupon.sessionsUsed
          })
        }
      } else {
        setValidationResult({
          valid: false,
          message: 'Invalid coupon code'
        })
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: 'Error validating coupon. Please try again.'
      })
    } finally {
      setIsValidating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'used': return 'secondary'
      case 'expired': return 'destructive'
      default: return 'secondary'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'company': return '🏢'
      case 'referral': return '👥'
      case 'promotional': return '🎉'
      default: return '🎫'
    }
  }

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coupons & Discounts</h1>
            <p className="text-gray-600 mt-2">Manage your discount coupons and promotional offers</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button className="gradient-primary">
              <span className="mr-2">🎁</span>
              Refer Friends
            </Button>
          </div>
        </div>

        {/* Coupon Validator */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Apply Coupon Code</CardTitle>
            <CardDescription>Enter a coupon code to check its validity and discount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter coupon code (e.g., WELCOME20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
                />
              </div>
              <Button 
                onClick={validateCoupon}
                loading={isValidating}
                disabled={!couponCode.trim()}
              >
                Validate
              </Button>
            </div>
            
            {validationResult && (
              <div className="mt-4">
                <Alert variant={validationResult.valid ? 'success' : 'destructive'}>
                  <AlertDescription>
                    {validationResult.message}
                    {validationResult.valid && validationResult.sessions && (
                      <span className="block mt-2">
                        Remaining sessions: {validationResult.sessions}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Coupons */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Coupons</h2>
          
          {availableCoupons.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Coupons</h3>
                <p className="text-gray-600 mb-6">
                  You don't have any active coupons at the moment. Check back later for new offers!
                </p>
                <Button className="gradient-primary">Browse Offers</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCoupons.map((coupon) => (
                <Card key={coupon.id} variant="elevated" className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getSourceIcon(coupon.source)}</span>
                        <CardTitle className="text-lg">{coupon.name}</CardTitle>
                      </div>
                      <Badge variant={getStatusColor(coupon.status)}>
                        {coupon.status}
                      </Badge>
                    </div>
                    <CardDescription>{coupon.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Coupon Code */}
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-primary font-mono">
                          {coupon.code}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Coupon Code</p>
                      </div>
                      
                      {/* Discount Details */}
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {coupon.discountValue}% OFF
                        </p>
                        <p className="text-sm text-gray-600">Discount Amount</p>
                      </div>
                      
                      {/* Usage Information */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {coupon.maxSessions - coupon.sessionsUsed}
                          </p>
                          <p className="text-xs text-gray-600">Sessions Left</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(coupon.validUntil).toLocaleDateString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-600">Valid Until</p>
                        </div>
                      </div>
                      
                      {/* Company Information */}
                      {coupon.companyName && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Company Benefit:</strong> {coupon.companyName}
                          </p>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <Button 
                        className="w-full gradient-primary"
                        disabled={coupon.sessionsUsed >= coupon.maxSessions}
                      >
                        {coupon.sessionsUsed >= coupon.maxSessions ? 'Fully Used' : 'Use Coupon'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Used Coupons History */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Coupon History</h2>
          
          {usedCoupons.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Coupon History</h3>
                <p className="text-gray-600">You haven't used any coupons yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {usedCoupons.map((coupon) => (
                <Card key={coupon.id} variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xl">✓</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                          <p className="text-sm text-gray-600">{coupon.description}</p>
                          <p className="text-xs text-gray-500">
                            Used on {new Date(coupon.usedAt).toLocaleDateString('en-IN')} • 
                            Session: {coupon.sessionId} • 
                            Therapist: {coupon.therapist}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ₹{coupon.savedAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">Saved</p>
                        <Badge variant="secondary" size="sm">
                          {coupon.code}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Referral Program */}
        <Card variant="elevated" className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Refer Friends & Earn Rewards
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Share AmitaCare with your friends and family. When they book their first session, 
              you both get 50% off your next session!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gradient-primary" size="lg">
                Share Referral Link
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}