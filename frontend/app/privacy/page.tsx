'use client'

import { ContentPageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function PrivacyPage() {
  return (
    <ContentPageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 15, 2025
          </p>
        </div>

        <Alert variant="info">
          <AlertDescription>
            <strong>Your Privacy Matters:</strong> At AmitaCare, we are committed to protecting your personal information 
            and maintaining the highest standards of privacy and security in accordance with Indian data protection laws.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">Personal Information</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Name, email address, phone number, and date of birth</li>
                <li>Address and location information</li>
                <li>Emergency contact details</li>
                <li>Payment and billing information</li>
                <li>Government-issued ID for verification (therapists only)</li>
              </ul>

              <h4 className="font-semibold mb-3">Health Information</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Mental health assessments and questionnaires</li>
                <li>Therapy session notes and progress reports</li>
                <li>Treatment plans and goals</li>
                <li>Mood tracking and wellness data</li>
              </ul>

              <h4 className="font-semibold mb-3">Technical Information</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Usage patterns and session recordings (for quality assurance)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Provide Services:</strong> Facilitate therapy sessions, match you with therapists, and manage your account</li>
                <li><strong>Improve Care:</strong> Analyze treatment effectiveness and personalize your therapy experience</li>
                <li><strong>Communication:</strong> Send appointment reminders, platform updates, and support messages</li>
                <li><strong>Safety & Security:</strong> Protect against fraud, ensure platform security, and comply with legal requirements</li>
                <li><strong>Research:</strong> Conduct anonymized research to improve mental health outcomes (with your consent)</li>
                <li><strong>Legal Compliance:</strong> Meet regulatory requirements and respond to legal requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>3. Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">We may share your information with:</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Your Therapist:</strong> Relevant information necessary for providing mental health services</li>
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our platform (under strict confidentiality agreements)</li>
                <li><strong>Emergency Contacts:</strong> In case of mental health emergencies or safety concerns</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets (with continued privacy protection)</li>
              </ul>

              <h4 className="font-semibold mb-3">We will NOT share your information for:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Marketing purposes without your explicit consent</li>
                <li>Sale to third parties for commercial gain</li>
                <li>Non-essential business purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">We implement industry-leading security measures to protect your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encryption:</strong> End-to-end encryption for all therapy sessions and data transmission</li>
                <li><strong>Access Controls:</strong> Strict access controls and multi-factor authentication</li>
                <li><strong>Regular Audits:</strong> Regular security audits and penetration testing</li>
                <li><strong>Compliance:</strong> HIPAA, ISO 27001, and SOC 2 Type II compliance</li>
                <li><strong>Data Centers:</strong> Secure, certified data centers with 24/7 monitoring</li>
                <li><strong>Staff Training:</strong> Regular privacy and security training for all employees</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>5. Your Rights Under DPDP Act 2023</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">Under India's Digital Personal Data Protection Act 2023, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Information:</strong> Know what personal data we process and how</li>
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Correction:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Grievance Redressal:</strong> File complaints about data processing</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at <strong>privacy@amitacare.com</strong></p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active and for 2 years after closure</li>
                <li><strong>Health Records:</strong> Retained for 7 years as per medical record requirements</li>
                <li><strong>Payment Data:</strong> Retained for 7 years for tax and audit purposes</li>
                <li><strong>Session Recordings:</strong> Deleted after 30 days unless required for quality assurance</li>
                <li><strong>Marketing Data:</strong> Deleted immediately upon unsubscribe request</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>7. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p>You can control cookie settings through your browser preferences. Note that disabling cookies may affect platform functionality.</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>8. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                Your data is primarily stored and processed in India. If we need to transfer data internationally, 
                we ensure adequate protection through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adequacy decisions by the Indian government</li>
                <li>Standard contractual clauses</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Your explicit consent for specific transfers</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                We provide services to minors (under 18) only with verifiable parental consent. 
                For children under 18:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Parental consent is required for account creation</li>
                <li>Parents can access and control their child's data</li>
                <li>Additional privacy protections apply</li>
                <li>Specialized therapists trained in child psychology</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                We may update this privacy policy to reflect changes in our practices or legal requirements. 
                We will notify you of significant changes through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email notifications to your registered email address</li>
                <li>Prominent notices on our platform</li>
                <li>In-app notifications</li>
              </ul>
              <p className="mt-4">
                Continued use of our services after policy changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">For privacy-related questions or concerns, contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Data Protection Officer</strong></p>
                <p>Email: privacy@amitacare.com</p>
                <p>Phone: +91-22-1234-5678</p>
                <p>Address: 123 Business District, Bandra Kurla Complex, Mumbai 400051</p>
              </div>
              
              <p className="mt-4">
                <strong>Grievance Officer:</strong> For complaints under DPDP Act 2023<br/>
                Email: grievance@amitacare.com<br/>
                Response time: Within 72 hours
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert variant="success">
          <AlertDescription>
            <strong>Commitment to Privacy:</strong> We are committed to maintaining your trust through transparent 
            data practices and robust security measures. Your mental health journey deserves the highest level of privacy protection.
          </AlertDescription>
        </Alert>
      </div>
    </ContentPageLayout>
  )
}