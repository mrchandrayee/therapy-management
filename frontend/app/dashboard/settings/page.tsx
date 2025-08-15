'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications' | 'billing'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+91-98765-43210',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    address: '123 Main Street, Mumbai',
    pincode: '400001',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+91-87654-32109'
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    shareProgressWithTherapist: true,
    allowResearchParticipation: false,
    dataRetention: '2-years'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    therapistMessages: true,
    platformUpdates: false,
    marketingEmails: false
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={profileData.firstName}
            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
          />
          <Input
            label="Last Name"
            value={profileData.lastName}
            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            label="Phone"
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={profileData.gender}
              onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
        <div className="space-y-4">
          <Input
            label="Address"
            value={profileData.address}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          />
          <Input
            label="Pincode"
            value={profileData.pincode}
            onChange={(e) => setProfileData(prev => ({ ...prev, pincode: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Name"
            value={profileData.emergencyContactName}
            onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
          />
          <Input
            label="Emergency Contact Phone"
            type="tel"
            value={profileData.emergencyContactPhone}
            onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
          />
        </div>
      </div>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="private">Private</option>
              <option value="therapists-only">Visible to Therapists Only</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Share Progress with Therapist</p>
              <p className="text-sm text-gray-600">Allow your therapist to view your progress data</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.shareProgressWithTherapist}
              onChange={(e) => setPrivacySettings(prev => ({ ...prev, shareProgressWithTherapist: e.target.checked }))}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Research Participation</p>
              <p className="text-sm text-gray-600">Allow anonymized data to be used for mental health research</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.allowResearchParticipation}
              onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowResearchParticipation: e.target.checked }))}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention</label>
            <select
              value={privacySettings.dataRetention}
              onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataRetention: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="1-year">1 Year</option>
              <option value="2-years">2 Years</option>
              <option value="5-years">5 Years</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-gray-600">
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                  {key === 'smsNotifications' && 'Receive notifications via SMS'}
                  {key === 'pushNotifications' && 'Receive push notifications on your device'}
                  {key === 'sessionReminders' && 'Get reminders before your therapy sessions'}
                  {key === 'therapistMessages' && 'Get notified when your therapist sends a message'}
                  {key === 'platformUpdates' && 'Receive updates about new platform features'}
                  {key === 'marketingEmails' && 'Receive promotional emails and offers'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Current Plan: Standard</p>
                <p className="text-sm text-gray-600">₹1,999/month • 4 sessions included</p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Next billing date: February 15, 2025</p>
              <p className="text-sm text-gray-600">Payment method: •••• 1234</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <Card variant="elevated">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  💳
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 1234</p>
                  <p className="text-sm text-gray-600">Expires 12/26</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Remove</Button>
              </div>
            </CardContent>
          </Card>
          <Button variant="outline">Add Payment Method</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { date: '2025-01-15', amount: '₹1,999', status: 'Paid', description: 'Monthly subscription' },
                { date: '2024-12-15', amount: '₹1,999', status: 'Paid', description: 'Monthly subscription' },
                { date: '2024-11-15', amount: '₹1,999', status: 'Paid', description: 'Monthly subscription' }
              ].map((bill, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{bill.description}</p>
                    <p className="text-sm text-gray-600">{bill.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{bill.amount}</p>
                    <p className="text-sm text-green-600">{bill.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        {success && (
          <Alert variant="success">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'privacy', label: 'Privacy', icon: '🔒' },
                { id: 'notifications', label: 'Notifications', icon: '🔔' },
                { id: 'billing', label: 'Billing', icon: '💳' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>
                  {activeTab === 'profile' && 'Profile Settings'}
                  {activeTab === 'privacy' && 'Privacy Settings'}
                  {activeTab === 'notifications' && 'Notification Settings'}
                  {activeTab === 'billing' && 'Billing Settings'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'profile' && 'Update your personal information and contact details'}
                  {activeTab === 'privacy' && 'Control your privacy and data sharing preferences'}
                  {activeTab === 'notifications' && 'Choose how you want to be notified'}
                  {activeTab === 'billing' && 'Manage your subscription and payment methods'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'privacy' && renderPrivacyTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'billing' && renderBillingTab()}

                <div className="flex justify-end pt-6 border-t mt-8">
                  <Button
                    onClick={handleSave}
                    loading={isLoading}
                    className="gradient-primary"
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}