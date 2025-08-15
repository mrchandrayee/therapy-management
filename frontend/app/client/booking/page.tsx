'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { TimeZoneSelector } from '@/components/ui/time-zone-selector'
import { Calendar, Clock, User, Star, MapPin, Globe, Tag, Percent } from 'lucide-react'

interface Therapist {
  id: string
  name: string
  specializations: string[]
  rating: number
  experience: number
  location: string
  languages: string[]
  brief: string
  availableSlots: string[]
  pricePerSession: number
  image?: string
}

interface BookingForm {
  category: string
  therapistId: string
  date: string
  time: string
  sessionType: 'individual' | 'family' | 'group'
  timezone: string
  notes: string
  couponCode: string
  packageType: 'single' | '6-session' | '12-session'
}

export default function ClientBookingPage() {
  const [step, setStep] = useState(1)
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    category: '',
    therapistId: '',
    date: '',
    time: '',
    sessionType: 'individual',
    timezone: 'Asia/Kolkata',
    notes: '',
    couponCode: '',
    packageType: 'single'
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const categories = [
    'Anxiety & Stress',
    'Depression',
    'Relationship Issues',
    'Family Therapy',
    'Addiction',
    'Trauma & PTSD',
    'Career Counseling',
    'Child Psychology',
    'Couples Therapy',
    'Grief & Loss'
  ]

  const therapists: Therapist[] = [
    {
      id: 'THR-001',
      name: 'Dr. Sarah Johnson',
      specializations: ['Anxiety & Stress', 'Depression', 'Trauma & PTSD'],
      rating: 4.8,
      experience: 8,
      location: 'Mumbai, India',
      languages: ['English', 'Hindi'],
      brief: 'Experienced clinical psychologist specializing in anxiety disorders and trauma recovery. Uses evidence-based approaches including CBT and EMDR.',
      availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      pricePerSession: 2500,
      image: '/therapists/sarah.jpg'
    },
    {
      id: 'THR-002',
      name: 'Dr. Michael Chen',
      specializations: ['Relationship Issues', 'Couples Therapy', 'Family Therapy'],
      rating: 4.9,
      experience: 12,
      location: 'Delhi, India',
      languages: ['English', 'Mandarin'],
      brief: 'Licensed marriage and family therapist with expertise in relationship dynamics and family systems therapy.',
      availableSlots: ['10:00', '11:00', '13:00', '15:00', '17:00'],
      pricePerSession: 3000,
      image: '/therapists/michael.jpg'
    },
    {
      id: 'THR-003',
      name: 'Dr. Priya Sharma',
      specializations: ['Child Psychology', 'Family Therapy', 'Anxiety & Stress'],
      rating: 4.7,
      experience: 6,
      location: 'Bangalore, India',
      languages: ['English', 'Hindi', 'Kannada'],
      brief: 'Child and adolescent psychologist with a warm, empathetic approach. Specializes in helping young minds navigate challenges.',
      availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
      pricePerSession: 2200,
      image: '/therapists/priya.jpg'
    }
  ]

  const packageOptions = [
    { value: 'single', label: 'Single Session', discount: 0 },
    { value: '6-session', label: '6 Session Package', discount: 10 },
    { value: '12-session', label: '12 Session Package', discount: 20 }
  ]

  const filteredTherapists = therapists.filter(therapist => {
    const matchesCategory = !bookingForm.category || therapist.specializations.includes(bookingForm.category)
    const matchesSearch = !searchTerm || 
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const validateCoupon = async (code: string) => {
    if (!code) {
      setCouponDiscount(0)
      return
    }

    setIsValidatingCoupon(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock coupon validation
      const mockCoupons: { [key: string]: number } = {
        'WELLNESS50': 50,
        'FIRST25': 25,
        'CORP15': 15,
        'STUDENT20': 20
      }
      
      const discount = mockCoupons[code.toUpperCase()] || 0
      setCouponDiscount(discount)
      
      if (discount > 0) {
        alert(`Coupon applied! ${discount}% discount`)
      } else {
        alert('Invalid coupon code')
      }
    } catch (error) {
      alert('Error validating coupon')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const calculatePrice = () => {
    if (!selectedTherapist) return 0
    
    const basePrice = selectedTherapist.pricePerSession
    const packageDiscount = packageOptions.find(p => p.value === bookingForm.packageType)?.discount || 0
    const totalDiscount = Math.max(packageDiscount, couponDiscount)
    
    return Math.round(basePrice * (1 - totalDiscount / 100))
  }

  const proceedToPayment = () => {
    if (!selectedTherapist || !bookingForm.date || !bookingForm.time) {
      alert('Please complete all required fields')
      return
    }
    
    // Simulate payment process
    alert('Redirecting to payment gateway...')
  }

  const selectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist)
    setBookingForm({ ...bookingForm, therapistId: therapist.id })
    setStep(2)
  }

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
            <p className="text-gray-600 mt-2">Find and book sessions with qualified therapists</p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className="w-8 h-1 bg-gray-200">
              <div className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className="w-8 h-1 bg-gray-200">
              <div className={`h-full bg-primary transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Category & Therapist Selection */}
        {step === 1 && (
          <>
            {/* Category Selection */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Select Category</CardTitle>
                <CardDescription>Choose the area you'd like help with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={bookingForm.category === category ? "default" : "outline"}
                      onClick={() => setBookingForm({ ...bookingForm, category })}
                      className="h-auto p-3 text-left justify-start"
                    >
                      <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{category}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="relative">
                  <Input
                    placeholder="Search therapists by name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Therapist List */}
            <div className="grid gap-6">
              {filteredTherapists.map((therapist) => (
                <Card key={therapist.id} variant="elevated" className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-lg">
                            {therapist.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{therapist.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{therapist.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{therapist.experience} years experience</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{therapist.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Globe className="w-4 h-4" />
                              <span>{therapist.languages.join(', ')}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{therapist.brief}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {therapist.specializations.map((spec) => (
                              <Badge key={spec} variant="secondary">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-primary">₹{therapist.pricePerSession}</span>
                              <span className="text-gray-600 ml-1">per session</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {therapist.availableSlots.length} slots available today
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <Button
                          onClick={() => selectTherapist(therapist)}
                          className="gradient-primary w-full lg:w-auto"
                        >
                          Select Therapist
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTherapists.length === 0 && (
              <Card variant="elevated">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Therapists Found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or category selection.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && selectedTherapist && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Schedule Session with {selectedTherapist.name}</CardTitle>
              <CardDescription>Select your preferred date, time, and session details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date">Session Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sessionType">Session Type</Label>
                  <Select value={bookingForm.sessionType} onValueChange={(value: any) => setBookingForm({ ...bookingForm, sessionType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Session</SelectItem>
                      <SelectItem value="family">Family Session</SelectItem>
                      <SelectItem value="group">Group Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                  {selectedTherapist.availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={bookingForm.time === slot ? "default" : "outline"}
                      onClick={() => setBookingForm({ ...bookingForm, time: slot })}
                      className="text-sm"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <TimeZoneSelector
                  value={bookingForm.timezone}
                  onValueChange={(value) => setBookingForm({ ...bookingForm, timezone: value })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="Any specific concerns or information you'd like to share..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!bookingForm.date || !bookingForm.time}
                  className="gradient-primary"
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 3 && selectedTherapist && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Complete your booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="packageType">Package Type</Label>
                  <Select value={bookingForm.packageType} onValueChange={(value: any) => setBookingForm({ ...bookingForm, packageType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packageOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{option.label}</span>
                            {option.discount > 0 && (
                              <Badge variant="success" className="ml-2">
                                {option.discount}% off
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="couponCode"
                      value={bookingForm.couponCode}
                      onChange={(e) => setBookingForm({ ...bookingForm, couponCode: e.target.value })}
                      placeholder="Enter coupon code"
                    />
                    <Button
                      variant="outline"
                      onClick={() => validateCoupon(bookingForm.couponCode)}
                      disabled={isValidatingCoupon}
                    >
                      <Percent className="w-4 h-4 mr-2" />
                      {isValidatingCoupon ? 'Validating...' : 'Apply'}
                    </Button>
                  </div>
                  {couponDiscount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Coupon applied: {couponDiscount}% discount
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={proceedToPayment} className="gradient-primary flex-1">
                    Pay ₹{calculatePrice()} & Book Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {selectedTherapist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedTherapist.name}</h4>
                    <p className="text-sm text-gray-600">{selectedTherapist.specializations[0]}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(bookingForm.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingForm.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Type:</span>
                    <span className="font-medium capitalize">{bookingForm.sessionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timezone:</span>
                    <span className="font-medium">{bookingForm.timezone}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span>₹{selectedTherapist.pricePerSession}</span>
                  </div>
                  
                  {packageOptions.find(p => p.value === bookingForm.packageType)?.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Package Discount:</span>
                      <span>-{packageOptions.find(p => p.value === bookingForm.packageType)?.discount}%</span>
                    </div>
                  )}
                  
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount:</span>
                      <span>-{couponDiscount}%</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{calculatePrice()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}