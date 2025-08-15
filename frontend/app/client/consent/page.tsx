'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FileText, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

interface ConsentDocument {
  id: string
  title: string
  type: string
  content: string
  version: string
  isMandatory: boolean
  requiresSessionConsent: boolean
  effectiveFrom: string
  lastUpdated: string
  isConsented: boolean
  consentDate?: string
  documentOpened: boolean
  timeSpentReading: number
}

interface SessionConsent {
  sessionId: string
  sessionDate: string
  therapistName: string
  documentsRequired: ConsentDocument[]
  allConsented: boolean
}

export default function ClientConsentPage() {
  const [consentDocuments, setConsentDocuments] = useState<ConsentDocument[]>([
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      type: 'terms_of_service',
      content: `
        <h2>Terms of Service - AmitaCare Mental Health Platform</h2>
        
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using AmitaCare's mental health services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        
        <h3>2. Service Description</h3>
        <p>AmitaCare provides online mental health therapy services through qualified licensed therapists. Our services include individual therapy, group therapy, and family counseling sessions conducted via secure video conferencing.</p>
        
        <h3>3. User Responsibilities</h3>
        <ul>
          <li>Provide accurate and complete information during registration</li>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>Attend scheduled sessions punctually</li>
          <li>Provide at least 30 hours notice for cancellations</li>
          <li>Respect therapist boundaries and professional guidelines</li>
        </ul>
        
        <h3>4. Payment Terms</h3>
        <p>Payment is required at the time of booking. We accept various payment methods including credit cards, debit cards, and digital wallets through our secure payment gateway.</p>
        
        <h3>5. Cancellation Policy</h3>
        <p>Sessions can be cancelled or rescheduled up to 30 hours before the scheduled time. Cancellations made within 30 hours may be subject to charges.</p>
        
        <h3>6. Privacy and Confidentiality</h3>
        <p>We maintain strict confidentiality of all client information in accordance with applicable privacy laws and professional ethics guidelines.</p>
        
        <h3>7. Limitation of Liability</h3>
        <p>AmitaCare's liability is limited to the amount paid for services. We are not liable for indirect, incidental, or consequential damages.</p>
        
        <h3>8. Termination</h3>
        <p>Either party may terminate the service relationship with appropriate notice. Upon termination, access to the platform will be revoked.</p>
        
        <p><strong>Last Updated:</strong> January 15, 2024</p>
      `,
      version: '2.1',
      isMandatory: true,
      requiresSessionConsent: false,
      effectiveFrom: '2024-01-15',
      lastUpdated: '2024-01-15',
      isConsented: false,
      documentOpened: false,
      timeSpentReading: 0
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      type: 'privacy_policy',
      content: `
        <h2>Privacy Policy - AmitaCare</h2>
        
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, book sessions, or communicate with us.</p>
        
        <h4>Personal Information:</h4>
        <ul>
          <li>Name, email address, phone number</li>
          <li>Date of birth, gender, address</li>
          <li>Medical history and therapy-related information</li>
          <li>Payment information (processed securely)</li>
        </ul>
        
        <h3>2. How We Use Your Information</h3>
        <ul>
          <li>Provide and improve our therapy services</li>
          <li>Process payments and send confirmations</li>
          <li>Send appointment reminders and important updates</li>
          <li>Ensure platform security and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
        
        <h3>3. Information Sharing</h3>
        <p>We do not sell, trade, or rent your personal information. We may share information only in these circumstances:</p>
        <ul>
          <li>With your assigned therapist for treatment purposes</li>
          <li>With your explicit consent</li>
          <li>To comply with legal requirements</li>
          <li>To protect our rights and safety</li>
        </ul>
        
        <h3>4. Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>5. Data Retention</h3>
        <p>We retain your information for as long as necessary to provide services and comply with legal obligations. Inactive accounts may be disabled after 3 years in compliance with the DPDP Act.</p>
        
        <h3>6. Your Rights</h3>
        <p>You have the right to access, update, or delete your personal information. You may also withdraw consent for data processing at any time.</p>
        
        <h3>7. Contact Us</h3>
        <p>For privacy-related questions, contact us at privacy@amitacare.com</p>
        
        <p><strong>Last Updated:</strong> January 15, 2024</p>
      `,
      version: '2.0',
      isMandatory: true,
      requiresSessionConsent: false,
      effectiveFrom: '2024-01-15',
      lastUpdated: '2024-01-15',
      isConsented: false,
      documentOpened: false,
      timeSpentReading: 0
    },
    {
      id: 'treatment-consent',
      title: 'Treatment Consent Form',
      type: 'treatment_consent',
      content: `
        <h2>Informed Consent for Mental Health Treatment</h2>
        
        <h3>1. Nature of Treatment</h3>
        <p>Mental health treatment involves a professional relationship between you and your therapist. The goal is to help you address psychological concerns and improve your mental well-being.</p>
        
        <h3>2. Treatment Methods</h3>
        <p>Your therapist may use various evidence-based approaches including:</p>
        <ul>
          <li>Cognitive Behavioral Therapy (CBT)</li>
          <li>Dialectical Behavior Therapy (DBT)</li>
          <li>Mindfulness-based interventions</li>
          <li>Solution-focused therapy</li>
          <li>Other therapeutic modalities as appropriate</li>
        </ul>
        
        <h3>3. Benefits and Risks</h3>
        <h4>Potential Benefits:</h4>
        <ul>
          <li>Improved emotional well-being</li>
          <li>Better coping strategies</li>
          <li>Enhanced relationships</li>
          <li>Increased self-awareness</li>
        </ul>
        
        <h4>Potential Risks:</h4>
        <ul>
          <li>Temporary increase in emotional distress</li>
          <li>Recall of unpleasant memories</li>
          <li>Changes in relationships</li>
          <li>No guarantee of improvement</li>
        </ul>
        
        <h3>4. Confidentiality</h3>
        <p>All communications are confidential except in cases where:</p>
        <ul>
          <li>You pose a danger to yourself or others</li>
          <li>Child or elder abuse is suspected</li>
          <li>Court orders require disclosure</li>
          <li>You provide written consent for disclosure</li>
        </ul>
        
        <h3>5. Emergency Situations</h3>
        <p>If you experience a mental health emergency, contact emergency services (112) or go to the nearest emergency room. Your therapist may not be immediately available.</p>
        
        <h3>6. Session Recordings</h3>
        <p>Sessions may be recorded only with your explicit consent for supervision or training purposes. You have the right to refuse recording.</p>
        
        <h3>7. Right to Withdraw</h3>
        <p>You have the right to withdraw from treatment at any time. We recommend discussing this decision with your therapist.</p>
        
        <p><strong>By consenting, you acknowledge that you have read, understood, and agree to these terms.</strong></p>
        
        <p><strong>Last Updated:</strong> January 15, 2024</p>
      `,
      version: '1.5',
      isMandatory: true,
      requiresSessionConsent: true,
      effectiveFrom: '2024-01-15',
      lastUpdated: '2024-01-15',
      isConsented: false,
      documentOpened: false,
      timeSpentReading: 0
    }
  ])

  const [sessionConsent, setSessionConsent] = useState<SessionConsent | null>({
    sessionId: 'SES-001',
    sessionDate: '2024-02-15',
    therapistName: 'Dr. Sarah Johnson',
    documentsRequired: consentDocuments.filter(doc => doc.requiresSessionConsent),
    allConsented: false
  })

  const [readingDocument, setReadingDocument] = useState<string | null>(null)
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openDocument = (documentId: string) => {
    setReadingDocument(documentId)
    setReadingStartTime(Date.now())
    
    // Mark document as opened
    setConsentDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, documentOpened: true }
        : doc
    ))
  }

  const closeDocument = () => {
    if (readingDocument && readingStartTime) {
      const timeSpent = Math.floor((Date.now() - readingStartTime) / 1000)
      
      // Update time spent reading
      setConsentDocuments(prev => prev.map(doc => 
        doc.id === readingDocument 
          ? { ...doc, timeSpentReading: doc.timeSpentReading + timeSpent }
          : doc
      ))
    }
    
    setReadingDocument(null)
    setReadingStartTime(null)
  }

  const handleConsentChange = (documentId: string, consented: boolean) => {
    setConsentDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { 
            ...doc, 
            isConsented: consented,
            consentDate: consented ? new Date().toISOString() : undefined
          }
        : doc
    ))
  }

  const submitConsents = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if all mandatory documents are consented
      const mandatoryDocs = consentDocuments.filter(doc => doc.isMandatory)
      const allMandatoryConsented = mandatoryDocs.every(doc => doc.isConsented)
      
      if (!allMandatoryConsented) {
        alert('Please consent to all mandatory documents before proceeding.')
        return
      }
      
      alert('Consent preferences saved successfully!')
    } catch (error) {
      alert('Error saving consent preferences. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitSessionConsent = async () => {
    if (!sessionConsent) return
    
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const allConsented = sessionConsent.documentsRequired.every(doc => doc.isConsented)
      
      if (!allConsented) {
        alert('Please consent to all required documents before joining the session.')
        return
      }
      
      setSessionConsent(prev => prev ? { ...prev, allConsented: true } : null)
      alert('Session consent recorded. You can now join your session.')
    } catch (error) {
      alert('Error recording session consent. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const mandatoryDocsConsented = consentDocuments
    .filter(doc => doc.isMandatory)
    .every(doc => doc.isConsented)

  const sessionDocsConsented = sessionConsent?.documentsRequired.every(doc => doc.isConsented) || false

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consent Management</h1>
          <p className="text-gray-600 mt-2">
            Review and manage your consent preferences for our services
          </p>
        </div>

        {/* Session-Specific Consent */}
        {sessionConsent && (
          <Card variant="elevated" className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-blue-900">Session Consent Required</CardTitle>
              </div>
              <CardDescription className="text-blue-700">
                You have an upcoming session with {sessionConsent.therapistName} on{' '}
                {new Date(sessionConsent.sessionDate).toLocaleDateString()}. 
                Please review and consent to the required documents before joining.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionConsent.documentsRequired.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.title}</h4>
                        <p className="text-sm text-gray-600">Required for this session</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDocument(doc.id)}
                      >
                        {doc.documentOpened ? 'Review Again' : 'Read Document'}
                      </Button>
                      <Checkbox
                        checked={doc.isConsented}
                        onCheckedChange={(checked) => handleConsentChange(doc.id, checked as boolean)}
                        disabled={!doc.documentOpened}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={submitSessionConsent}
                    disabled={!sessionDocsConsented || isSubmitting}
                    className="gradient-primary"
                  >
                    {isSubmitting ? 'Recording Consent...' : 'Confirm Session Consent'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* General Consent Documents */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Consent Documents</CardTitle>
            <CardDescription>
              Review and provide consent for our service terms and policies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {consentDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                        <Badge variant={doc.isMandatory ? 'destructive' : 'secondary'}>
                          {doc.isMandatory ? 'Mandatory' : 'Optional'}
                        </Badge>
                        {doc.requiresSessionConsent && (
                          <Badge variant="warning">Session Consent Required</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Version {doc.version}</span>
                        <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                        {doc.timeSpentReading > 0 && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Read for {Math.floor(doc.timeSpentReading / 60)}m {doc.timeSpentReading % 60}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => openDocument(doc.id)}
                      >
                        {doc.documentOpened ? 'Review' : 'Read'}
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={doc.isConsented}
                          onCheckedChange={(checked) => handleConsentChange(doc.id, checked as boolean)}
                          disabled={!doc.documentOpened}
                        />
                        <span className="text-sm text-gray-600">
                          {doc.isConsented ? 'Consented' : 'Not Consented'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {doc.isConsented && doc.consentDate && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Consented on {new Date(doc.consentDate).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {!doc.documentOpened && (
                    <Alert variant="warning" className="mt-4">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        You must read this document before providing consent.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  Your consent preferences are securely stored and can be updated at any time.
                </span>
              </div>
              
              <Button
                onClick={submitConsents}
                disabled={!mandatoryDocsConsented || isSubmitting}
                className="gradient-primary"
              >
                {isSubmitting ? 'Saving...' : 'Save Consent Preferences'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Reader Modal */}
        {readingDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {consentDocuments.find(doc => doc.id === readingDocument)?.title}
                </h2>
                <Button variant="outline" onClick={closeDocument}>
                  Close
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-6">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: consentDocuments.find(doc => doc.id === readingDocument)?.content || ''
                  }}
                />
              </ScrollArea>
              
              <div className="p-6 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Please read the entire document before providing consent.
                  </p>
                  <Button onClick={closeDocument} className="gradient-primary">
                    I Have Read This Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}