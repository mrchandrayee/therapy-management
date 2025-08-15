'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { TimeZoneSelector } from '@/components/ui/time-zone-selector'
import { FileUpload } from '@/components/ui/file-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Phone, MapPin, Calendar, Bell, Shield, FileText, Globe } from 'lucide-react'

interface ClientProfile {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  timezone: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  medicalHistory: string
  currentMedications: string
  allergies: string
  preferredLanguage: string
  communicationPreferences: {
    emailReminders: boolean
    smsReminders: boolean
    callReminders: boolean
  }
  privacySettings: {
    shareDataWithTherapist: boolean
    allowResearchParticipation: boolean
    receiveMarketingEmails: boolean
  }
  documents: Array<{
    id: string
    name: string
    type: string
    uploadedAt: string
  }>
  companyId?: string
  companyName?: string
  employeeId?: string
}

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<ClientProfile>({
    id: 'CLT-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    timezone: 'Asia/Kolkata',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+91 9876543211'
    },
    medicalHistory: 'No significant medical history',
    currentMedications: 'None',
    allergies: 'None known',
    preferredLanguage: 'English',
    communicationPreferences: {
      emailReminders: true,
      smsReminders: true,
      callReminders: false
    },
    privacySettings: {
      shareDataWithTherapist: true,
      allowResearchParticipation: false,
      receiveMarketingEmails: true
    },
    documents: [
      {
        id: 'DOC-001',
        name: 'ID_Proof.pdf',
        type: 'identification',
        uploadedAt: '2024-01-15'
      }
    ]
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Error updating profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDocumentUpload = (files: any[]) => {
    const newDocuments = files.map(file => ({
      id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: 'general',
      uploadedAt: new Date().toISOString().split('T')[0]
    }))
    
    setProfile({
      ...profile,
      documents: [...profile.documents, ...newDocuments]
    })
  }

  const removeDocument = (docId: string) => {
    setProfile({
      ...profile,
      documents: profile.documents.filter(doc => doc.id !== docId)
    })
  }

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
          </div>
          <div className="flex space-x-2 mt-4 lg:mt-0">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={isSaving} className="gradient-primary">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="gradient-primary">
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{profile.address.city}, {profile.address.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{profile.timezone}</span>
                  </div>
                </div>
                {profile.companyName && (
                  <div className="mt-2">
                    <Badge variant="secondary">
                      Corporate Client - {profile.companyName}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Card variant="elevated">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={profile.gender} 
                    onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select 
                    value={profile.preferredLanguage} 
                    onValueChange={(value) => setProfile({ ...profile, preferredLanguage: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                      <SelectItem value="Malayalam">Malayalam</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <TimeZoneSelector
                  value={profile.timezone}
                  onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={profile.address.street}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address, street: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile.address.city}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address, city: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profile.address.state}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address, state: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={profile.address.pincode}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address, pincode: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profile.address.country}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address, country: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      value={profile.emergencyContact.name}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, name: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={profile.emergencyContact.relationship}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, relationship: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, phone: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={profile.medicalHistory}
                  onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Please describe any relevant medical history..."
                />
              </div>
              
              <div>
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={profile.currentMedications}
                  onChange={(e) => setProfile({ ...profile, currentMedications: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="List any medications you are currently taking..."
                />
              </div>
              
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="List any known allergies..."
                />
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Communication Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Reminders</Label>
                      <p className="text-sm text-gray-600">Receive session reminders via email</p>
                    </div>
                    <Switch
                      checked={profile.communicationPreferences.emailReminders}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        communicationPreferences: {
                          ...profile.communicationPreferences,
                          emailReminders: checked
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Reminders</Label>
                      <p className="text-sm text-gray-600">Receive session reminders via SMS</p>
                    </div>
                    <Switch
                      checked={profile.communicationPreferences.smsReminders}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        communicationPreferences: {
                          ...profile.communicationPreferences,
                          smsReminders: checked
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Call Reminders</Label>
                      <p className="text-sm text-gray-600">Receive session reminders via phone call</p>
                    </div>
                    <Switch
                      checked={profile.communicationPreferences.callReminders}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        communicationPreferences: {
                          ...profile.communicationPreferences,
                          callReminders: checked
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Share Data with Therapist</Label>
                      <p className="text-sm text-gray-600">Allow your therapist to access your profile and session data</p>
                    </div>
                    <Switch
                      checked={profile.privacySettings.shareDataWithTherapist}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        privacySettings: {
                          ...profile.privacySettings,
                          shareDataWithTherapist: checked
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Research Participation</Label>
                      <p className="text-sm text-gray-600">Allow anonymized data to be used for research purposes</p>
                    </div>
                    <Switch
                      checked={profile.privacySettings.allowResearchParticipation}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        privacySettings: {
                          ...profile.privacySettings,
                          allowResearchParticipation: checked
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                    </div>
                    <Switch
                      checked={profile.privacySettings.receiveMarketingEmails}
                      onCheckedChange={(checked) => setProfile({
                        ...profile,
                        privacySettings: {
                          ...profile.privacySettings,
                          receiveMarketingEmails: checked
                        }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Identity Documents</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload identity documents for verification (optional but recommended)
                </p>
                
                {isEditing && (
                  <FileUpload
                    onFilesChange={handleDocumentUpload}
                    acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                    maxFiles={5}
                    maxSize={5}
                    existingFiles={[]}
                  />
                )}
                
                {profile.documents.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <h4 className="font-medium">Uploaded Documents</h4>
                    {profile.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}