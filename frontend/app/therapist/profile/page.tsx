'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Star,
  Save,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  DollarSign
} from 'lucide-react'

interface TherapistProfile {
  id: string
  user: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  license_number: string
  specializations: string[]
  bio: string
  consultation_fee: number
  languages_spoken: string
  experience_level: 'beginner' | 'intermediate' | 'experienced' | 'expert'
  years_of_experience: number
  is_available: boolean
  max_clients_per_day: number
  session_duration_minutes: number
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended'
  average_rating: number
  total_reviews: number
  total_sessions: number
  created_at: string
}

interface Competency {
  id: string
  name: string
  category: string
  proficiency_level: 'basic' | 'intermediate' | 'advanced' | 'expert'
  years_of_experience: number
}

export default function TherapistProfilePage() {
  const [profile, setProfile] = useState<TherapistProfile>({
    id: '1',
    user: {
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+91 98765 43210'
    },
    license_number: 'PSY-2023-045',
    specializations: ['Anxiety & Stress Management', 'Depression & Mood Disorders', 'Trauma Therapy'],
    bio: 'Experienced clinical psychologist with over 8 years of practice. Specialized in cognitive behavioral therapy and trauma-informed care. Passionate about helping clients achieve mental wellness through evidence-based therapeutic approaches.',
    consultation_fee: 2500,
    languages_spoken: 'English, Hindi, Bengali',
    experience_level: 'experienced',
    years_of_experience: 8,
    is_available: true,
    max_clients_per_day: 6,
    session_duration_minutes: 60,
    approval_status: 'approved',
    average_rating: 4.9,
    total_reviews: 127,
    total_sessions: 342,
    created_at: '2023-01-15T10:30:00'
  })

  const [competencies, setCompetencies] = useState<Competency[]>([
    {
      id: '1',
      name: 'Cognitive Behavioral Therapy',
      category: 'Therapeutic Approaches',
      proficiency_level: 'expert',
      years_of_experience: 8
    },
    {
      id: '2',
      name: 'Mindfulness-Based Therapy',
      category: 'Therapeutic Approaches',
      proficiency_level: 'advanced',
      years_of_experience: 5
    },
    {
      id: '3',
      name: 'Trauma-Informed Care',
      category: 'Specialized Care',
      proficiency_level: 'intermediate',
      years_of_experience: 3
    }
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [activeTab, setActiveTab] = useState('basic')

  const experienceLevels = [
    { value: 'beginner', label: '0-2 years' },
    { value: 'intermediate', label: '3-5 years' },
    { value: 'experienced', label: '6-10 years' },
    { value: 'expert', label: '10+ years' }
  ]

  const proficiencyLevels = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ]

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'destructive'
      case 'suspended': return 'destructive'
      default: return 'secondary'
    }
  }

  const getApprovalStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'rejected': return <AlertTriangle className="w-4 h-4" />
      case 'suspended': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert': return 'success'
      case 'advanced': return 'primary'
      case 'intermediate': return 'warning'
      case 'basic': return 'secondary'
      default: return 'secondary'
    }
  }

  const saveProfile = () => {
    // Validate required fields
    if (!editedProfile.user.first_name || !editedProfile.user.last_name || !editedProfile.bio) {
      alert('Please fill in all required fields')
      return
    }

    if (editedProfile.consultation_fee < 0 || editedProfile.consultation_fee > 50000) {
      alert('Consultation fee must be between ₹0 and ₹50,000')
      return
    }

    if (editedProfile.max_clients_per_day < 1 || editedProfile.max_clients_per_day > 20) {
      alert('Max clients per day must be between 1 and 20')
      return
    }

    setProfile(editedProfile)
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const cancelEdit = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your professional profile and credentials</p>
          </div>
          <div className="flex space-x-2 mt-4 lg:mt-0">
            {isEditing ? (
              <>
                <Button onClick={saveProfile} className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="gradient-primary">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Status Alert */}
        <Alert variant={profile.approval_status === 'approved' ? 'success' : 'warning'}>
          <div className="flex items-center space-x-2">
            {getApprovalStatusIcon(profile.approval_status)}
            <AlertDescription>
              <strong>Profile Status:</strong> {profile.approval_status === 'approved' ? 'Approved and Active' : 
                profile.approval_status === 'pending' ? 'Pending Admin Approval' :
                profile.approval_status === 'rejected' ? 'Rejected - Please contact admin' :
                'Suspended - Please contact admin'}
            </AlertDescription>
          </div>
        </Alert>

        {/* Profile Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-yellow-600">{profile.average_rating}</p>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">{profile.total_reviews} reviews</div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">{profile.total_sessions}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Experience</p>
                  <p className="text-2xl font-bold text-green-600">{profile.years_of_experience}y</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultation Fee</p>
                  <p className="text-2xl font-bold text-purple-600">₹{profile.consultation_fee}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Card variant="elevated">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="professional">Professional Details</TabsTrigger>
                <TabsTrigger value="competencies">Competencies</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first-name">First Name *</Label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <Input
                      id="first-name"
                      value={isEditing ? editedProfile.user.first_name : profile.user.first_name}
                      onChange={(e) => isEditing && setEditedProfile({
                        ...editedProfile,
                        user: { ...editedProfile.user, first_name: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="last-name">Last Name *</Label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <Input
                      id="last-name"
                      value={isEditing ? editedProfile.user.last_name : profile.user.last_name}
                      onChange={(e) => isEditing && setEditedProfile({
                        ...editedProfile,
                        user: { ...editedProfile.user, last_name: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.user.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact admin if needed.</p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <Input
                      id="phone"
                      value={isEditing ? editedProfile.user.phone || '' : profile.user.phone || ''}
                      onChange={(e) => isEditing && setEditedProfile({
                        ...editedProfile,
                        user: { ...editedProfile.user, phone: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="license">License Number</Label>
                  <Input
                    id="license"
                    value={profile.license_number}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">License number cannot be changed. Contact admin if needed.</p>
                </div>

                <div>
                  <Label htmlFor="languages">Languages Spoken</Label>
                  <Input
                    id="languages"
                    value={isEditing ? editedProfile.languages_spoken : profile.languages_spoken}
                    onChange={(e) => isEditing && setEditedProfile({
                      ...editedProfile,
                      languages_spoken: e.target.value
                    })}
                    disabled={!isEditing}
                    placeholder="English, Hindi, Bengali"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={isEditing ? editedProfile.bio : profile.bio}
                  onChange={(e) => isEditing && setEditedProfile({
                    ...editedProfile,
                    bio: e.target.value
                  })}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Describe your professional background, specializations, and approach to therapy..."
                />
                <p className="text-xs text-gray-500 mt-1">This bio will be shown to clients when they select a therapist.</p>
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="experience-level">Experience Level</Label>
                  <Select
                    value={isEditing ? editedProfile.experience_level : profile.experience_level}
                    onValueChange={(value: any) => isEditing && setEditedProfile({
                      ...editedProfile,
                      experience_level: value
                    })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="years-experience">Years of Experience</Label>
                  <Input
                    id="years-experience"
                    type="number"
                    min="0"
                    max="50"
                    value={isEditing ? editedProfile.years_of_experience : profile.years_of_experience}
                    onChange={(e) => isEditing && setEditedProfile({
                      ...editedProfile,
                      years_of_experience: parseInt(e.target.value) || 0
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="consultation-fee">Consultation Fee (₹)</Label>
                  <Input
                    id="consultation-fee"
                    type="number"
                    min="0"
                    max="50000"
                    value={isEditing ? editedProfile.consultation_fee : profile.consultation_fee}
                    onChange={(e) => isEditing && setEditedProfile({
                      ...editedProfile,
                      consultation_fee: parseInt(e.target.value) || 0
                    })}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500 mt-1">Fee per session (maximum ₹50,000)</p>
                </div>

                <div>
                  <Label htmlFor="session-duration">Default Session Duration (minutes)</Label>
                  <Select
                    value={String(isEditing ? editedProfile.session_duration_minutes : profile.session_duration_minutes)}
                    onValueChange={(value) => isEditing && setEditedProfile({
                      ...editedProfile,
                      session_duration_minutes: parseInt(value)
                    })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="max-clients">Max Clients Per Day</Label>
                  <Input
                    id="max-clients"
                    type="number"
                    min="1"
                    max="20"
                    value={isEditing ? editedProfile.max_clients_per_day : profile.max_clients_per_day}
                    onChange={(e) => isEditing && setEditedProfile({
                      ...editedProfile,
                      max_clients_per_day: parseInt(e.target.value) || 1
                    })}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum number of clients you can see in a day</p>
                </div>
              </div>

              <div>
                <Label>Specializations</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.specializations.map((spec, index) => (
                    <Badge key={index} variant="primary">
                      {spec}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  To update specializations, please contact the administrator.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="competencies" className="space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Professional Competencies</h3>
                <p className="text-gray-600">Your skills and areas of expertise</p>
              </div>

              <div className="space-y-4">
                {competencies.map((competency) => (
                  <Card key={competency.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{competency.name}</h4>
                          <p className="text-sm text-gray-600">{competency.category}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {competency.years_of_experience} years of experience
                          </p>
                        </div>
                        <Badge variant={getProficiencyColor(competency.proficiency_level)}>
                          {competency.proficiency_level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert variant="info">
                <AlertDescription>
                  To update your competencies or add new ones, please contact the administrator.
                  Competency updates require verification of credentials.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="availability-toggle">Available for New Clients</Label>
                    <p className="text-sm text-gray-600">
                      Toggle your availability for accepting new client bookings
                    </p>
                  </div>
                  <Switch
                    id="availability-toggle"
                    checked={isEditing ? editedProfile.is_available : profile.is_available}
                    onCheckedChange={(checked) => isEditing && setEditedProfile({
                      ...editedProfile,
                      is_available: checked
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Member Since:</span>
                    <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Profile Status:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getApprovalStatusColor(profile.approval_status)}>
                        {getApprovalStatusIcon(profile.approval_status)}
                        <span className="ml-1 capitalize">{profile.approval_status}</span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Sessions Conducted:</span>
                    <p className="font-medium">{profile.total_sessions}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Client Reviews:</span>
                    <p className="font-medium">{profile.total_reviews} reviews</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}