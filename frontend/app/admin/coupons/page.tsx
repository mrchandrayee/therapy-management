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
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Mail, Edit, Trash2, Copy } from 'lucide-react'

interface Coupon {
  id: string
  code: string
  type: 'individual' | 'company' | 'ngo'
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxUses: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  description: string
  companyName?: string
  emailsSent: string[]
  createdAt: string
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'CPN-001',
      code: 'WELLNESS50',
      type: 'individual',
      discountType: 'percentage',
      discountValue: 50,
      maxUses: 100,
      usedCount: 23,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      isActive: true,
      description: 'New year wellness discount',
      emailsSent: ['user1@example.com', 'user2@example.com'],
      createdAt: '2024-01-01'
    },
    {
      id: 'CPN-002',
      code: 'CORP25',
      type: 'company',
      discountType: 'percentage',
      discountValue: 25,
      maxUses: 500,
      usedCount: 156,
      validFrom: '2024-01-01',
      validUntil: '2024-06-30',
      isActive: true,
      description: 'Corporate wellness program',
      companyName: 'TechCorp Solutions',
      emailsSent: ['hr@techcorp.com'],
      createdAt: '2024-01-01'
    }
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [emailModal, setEmailModal] = useState<{ show: boolean; coupon: Coupon | null }>({ show: false, coupon: null })

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'individual' as 'individual' | 'company' | 'ngo',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    maxUses: 100,
    validFrom: '',
    validUntil: '',
    description: '',
    companyName: ''
  })

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewCoupon({ ...newCoupon, code: result })
  }

  const createCoupon = () => {
    const coupon: Coupon = {
      id: `CPN-${String(coupons.length + 1).padStart(3, '0')}`,
      ...newCoupon,
      usedCount: 0,
      isActive: true,
      emailsSent: [],
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setCoupons([...coupons, coupon])
    setNewCoupon({
      code: '',
      type: 'individual',
      discountType: 'percentage',
      discountValue: 0,
      maxUses: 100,
      validFrom: '',
      validUntil: '',
      description: '',
      companyName: ''
    })
    setShowCreateForm(false)
  }

  const toggleCouponStatus = (couponId: string) => {
    setCoupons(coupons.map(c => 
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    ))
  }

  const deleteCoupon = (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== couponId))
    }
  }

  const sendCouponEmail = (coupon: Coupon, emails: string[]) => {
    // Simulate sending emails
    const updatedCoupons = coupons.map(c => 
      c.id === coupon.id 
        ? { ...c, emailsSent: [...c.emailsSent, ...emails] }
        : c
    )
    setCoupons(updatedCoupons)
    setEmailModal({ show: false, coupon: null })
    alert(`Coupon sent to ${emails.length} email(s)`)
  }

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (coupon.companyName && coupon.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || coupon.type === filterType
    
    return matchesSearch && matchesType
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Coupon code copied to clipboard!')
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
            <p className="text-gray-600 mt-2">Create and manage discount coupons for clients</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        {(showCreateForm || editingCoupon) && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="code"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="Enter coupon code"
                    />
                    <Button variant="outline" onClick={generateCouponCode}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Coupon Type</Label>
                  <Select value={newCoupon.type} onValueChange={(value: any) => setNewCoupon({ ...newCoupon, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select value={newCoupon.discountType} onValueChange={(value: any) => setNewCoupon({ ...newCoupon, discountType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">
                    Discount Value {newCoupon.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="1"
                    max={newCoupon.discountType === 'percentage' ? '100' : '10000'}
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxUses">Maximum Uses</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    min="1"
                    value={newCoupon.maxUses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {newCoupon.type === 'company' && (
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={newCoupon.companyName}
                      onChange={(e) => setNewCoupon({ ...newCoupon, companyName: e.target.value })}
                      placeholder="Enter company name"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="Enter coupon description"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={createCoupon} className="gradient-primary">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingCoupon(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coupons List */}
        <div className="grid gap-6">
          {filteredCoupons.map((coupon) => (
            <Card key={coupon.id} variant="elevated">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{coupon.code}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Badge variant={coupon.isActive ? 'success' : 'secondary'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {coupon.type}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{coupon.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Discount:</span>
                        <p className="font-medium">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}%` 
                            : `₹${coupon.discountValue}`
                          }
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Usage:</span>
                        <p className="font-medium">{coupon.usedCount}/{coupon.maxUses}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Valid From:</span>
                        <p className="font-medium">{new Date(coupon.validFrom).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Valid Until:</span>
                        <p className="font-medium">{new Date(coupon.validUntil).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {coupon.companyName && (
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Company:</span>
                        <p className="font-medium">{coupon.companyName}</p>
                      </div>
                    )}

                    {coupon.emailsSent.length > 0 && (
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Emails sent to:</span>
                        <p className="text-sm">{coupon.emailsSent.length} recipient(s)</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 mt-4 lg:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEmailModal({ show: true, coupon })}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => toggleCouponStatus(coupon.id)}
                      />
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCoupon(coupon)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCoupon(coupon.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <Card variant="elevated">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Coupons Found</h3>
              <p className="text-gray-600">Create your first coupon to get started.</p>
            </CardContent>
          </Card>
        )}

        {/* Email Modal */}
        {emailModal.show && emailModal.coupon && (
          <EmailCouponModal
            coupon={emailModal.coupon}
            onSend={sendCouponEmail}
            onClose={() => setEmailModal({ show: false, coupon: null })}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

function EmailCouponModal({ 
  coupon, 
  onSend, 
  onClose 
}: { 
  coupon: Coupon
  onSend: (coupon: Coupon, emails: string[]) => void
  onClose: () => void 
}) {
  const [emails, setEmails] = useState('')
  const [subject, setSubject] = useState(`Your ${coupon.discountValue}% discount coupon - ${coupon.code}`)
  const [message, setMessage] = useState(`Hi there!\n\nWe're excited to share a special discount coupon with you:\n\nCoupon Code: ${coupon.code}\nDiscount: ${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}\nValid until: ${new Date(coupon.validUntil).toLocaleDateString()}\n\nUse this code during booking to get your discount.\n\nBest regards,\nAmitaCare Team`)

  const handleSend = () => {
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e)
    if (emailList.length === 0) {
      alert('Please enter at least one email address')
      return
    }
    onSend(coupon, emailList)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle>Send Coupon via Email</CardTitle>
          <CardDescription>Send {coupon.code} to recipients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emails">Email Addresses (comma separated)</Label>
            <Textarea
              id="emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleSend} className="gradient-primary">
              Send Email
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}