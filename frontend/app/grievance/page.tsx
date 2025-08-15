'use client'

import { useState } from 'react'
import { ContentPageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function GrievancePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: 'medium',
    relatedSession: '',
    relatedPayment: '',
    contactPreference: 'email'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const grievanceTypes = [
    { value: 'service_quality', label: 'Service Quality', description: 'Issues with therapy quality or therapist performance' },
    { value: 'technical_issue', label: 'Technical Issue', description: 'Problems with video calls, app, or website' },
    { value: 'billing_issue', label: 'Billing Issue', description: 'Payment, refund, or subscription problems' },
    { value: 'therapist_conduct', label: 'Therapist Conduct', description: 'Unprofessional behavior or ethical concerns' },
    { value: 'privacy_concern', label: 'Privacy Concern', description: 'Data protection or confidentiality issues' },
    { value: 'accessibility', label: 'Accessibility', description: 'Difficulty accessing services due to disability' },
    { value: 'other', label: 'Other', description: 'Any other concern not listed above' }
  ]

  const priorityLevels = [
    { value: 'low', label: 'Low', description: 'General feedback or minor issues' },
    { value: 'medium', label: 'Medium', description: 'Issues affecting service quality' },
    { value: 'high', label: 'High', description: 'Serious problems requiring urgent attention' },
    { value: 'urgent', label: 'Urgent', description: 'Critical issues affecting safety or wellbeing' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // API call would go here
      console.log('Grievance submitted:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        type: '',
        priority: 'medium',
        relatedSession: '',
        relatedPayment: '',
        contactPreference: 'email'
      })
    } catch (error) {
      console.error('Error submitting grievance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <ContentPageLayout>
        <div className="max-w-2xl mx-auto py-12">
          <Card variant="elevated" className="text-center">
            <CardContent className="p-12">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Grievance Submitted Successfully
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for bringing this to our attention. We take all concerns seriously and will investigate promptly.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-blue-700 text-sm space-y-2 text-left">
                  <li>• You'll receive a confirmation email with your grievance ID</li>
                  <li>• Our team will review your concern within 24 hours</li>
                  <li>• We'll contact you for any additional information needed</li>
                  <li>• You'll receive regular updates on the resolution progress</li>
                  <li>• Most grievances are resolved within 3-5 business days</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setSuccess(false)} className="gradient-primary">
                  Submit Another Grievance
                </Button>
                <Button variant="outline">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentPageLayout>
    )
  }

  return (
    <ContentPageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">File a Grievance</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing excellent service. If you have any concerns or complaints, 
            please let us know so we can address them promptly.
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert variant="destructive">
          <AlertDescription>
            <strong>🚨 Mental Health Emergency?</strong> If you're experiencing a crisis or having thoughts of self-harm, 
            please call our 24/7 emergency line at <strong>+91-911-CRISIS (274747)</strong> or contact emergency services at <strong>112</strong> immediately.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grievance Form */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Grievance Details</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us understand and resolve your concern.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <Input
                    label="Grievance Title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    placeholder="Brief summary of your concern"
                    helperText="Provide a clear, concise title for your grievance"
                  />

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type of Grievance <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {grievanceTypes.map((type) => (
                        <label key={type.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value={type.value}
                            checked={formData.type === type.value}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="mt-1"
                            required
                          />
                          <div>
                            <p className="font-medium text-gray-900">{type.label}</p>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Priority Level <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {priorityLevels.map((priority) => (
                        <label key={priority.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            value={priority.value}
                            checked={formData.priority === priority.value}
                            onChange={(e) => handleInputChange('priority', e.target.value)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{priority.label}</p>
                            <p className="text-xs text-gray-600">{priority.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Please describe your concern in detail. Include dates, times, names, and any other relevant information..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      The more details you provide, the better we can assist you.
                    </p>
                  </div>

                  {/* Related Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Related Session ID (if applicable)"
                      type="text"
                      value={formData.relatedSession}
                      onChange={(e) => handleInputChange('relatedSession', e.target.value)}
                      placeholder="e.g., SES-12345"
                      helperText="If your grievance relates to a specific session"
                    />
                    <Input
                      label="Related Payment ID (if applicable)"
                      type="text"
                      value={formData.relatedPayment}
                      onChange={(e) => handleInputChange('relatedPayment', e.target.value)}
                      placeholder="e.g., PAY-67890"
                      helperText="If your grievance relates to a payment issue"
                    />
                  </div>

                  {/* Contact Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Contact Method
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contactPreference"
                          value="email"
                          checked={formData.contactPreference === 'email'}
                          onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contactPreference"
                          value="phone"
                          checked={formData.contactPreference === 'phone'}
                          onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Phone</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contactPreference"
                          value="both"
                          checked={formData.contactPreference === 'both'}
                          onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Both</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      loading={isLoading}
                      className="w-full gradient-primary"
                      size="lg"
                    >
                      Submit Grievance
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Grievance Officer</h4>
                    <p className="text-sm text-gray-600">Email: grievance@amitacare.com</p>
                    <p className="text-sm text-gray-600">Phone: +91-22-1234-5678</p>
                    <p className="text-xs text-gray-500">Response within 72 hours</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Emergency Support</h4>
                    <p className="text-sm text-red-600 font-medium">+91-911-CRISIS (274747)</p>
                    <p className="text-xs text-gray-500">24/7 Mental Health Crisis Line</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Information */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Grievance Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Submission</p>
                      <p className="text-sm text-gray-600">Your grievance is recorded and assigned a unique ID</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Review</p>
                      <p className="text-sm text-gray-600">Our team reviews and investigates within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Resolution</p>
                      <p className="text-sm text-gray-600">We work to resolve your concern within 3-5 business days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Follow-up</p>
                      <p className="text-sm text-gray-600">We ensure you're satisfied with the resolution</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rights Information */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Right to fair and timely resolution</li>
                  <li>• Right to be heard without discrimination</li>
                  <li>• Right to privacy and confidentiality</li>
                  <li>• Right to escalate unresolved issues</li>
                  <li>• Right to seek external mediation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ContentPageLayout>
  )
}