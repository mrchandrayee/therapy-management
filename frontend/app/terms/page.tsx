'use client'

import { ContentPageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TermsPage() {
  return (
    <ContentPageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 15, 2025
          </p>
        </div>

        <Alert variant="info">
          <AlertDescription>
            <strong>Important:</strong> Please read these terms carefully before using AmitaCare. 
            By accessing or using our services, you agree to be bound by these terms.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                By accessing or using AmitaCare's platform and services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service and our Privacy Policy. 
                If you do not agree to these terms, please do not use our services.
              </p>
              <p>
                These terms constitute a legally binding agreement between you and AmitaCare Technologies Pvt. Ltd., 
                a company incorporated under the laws of India.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>2. Description of Services</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">AmitaCare provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Online mental health therapy and counseling services</li>
                <li>Platform to connect clients with licensed mental health professionals</li>
                <li>Secure video, audio, and text-based communication tools</li>
                <li>Mental health assessment and progress tracking tools</li>
                <li>Educational resources and self-help materials</li>
                <li>Crisis support and emergency assistance</li>
              </ul>
              <p className="mt-4">
                <strong>Important:</strong> Our services are designed to supplement, not replace, traditional in-person therapy. 
                In case of medical emergencies, please contact local emergency services immediately.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>3. Eligibility and Registration</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">Client Eligibility</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Must be at least 18 years old (or have parental consent if under 18)</li>
                <li>Must be a resident of India</li>
                <li>Must provide accurate and complete registration information</li>
                <li>Must have the legal capacity to enter into this agreement</li>
              </ul>

              <h4 className="font-semibold mb-3">Therapist Eligibility</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Must hold valid licenses to practice mental health services in India</li>
                <li>Must provide proof of education, training, and professional credentials</li>
                <li>Must maintain professional liability insurance</li>
                <li>Must comply with applicable professional ethics and standards</li>
                <li>Must pass our verification and background check process</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>4. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">All Users Must:</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of their account credentials</li>
                <li>Use the platform in compliance with applicable laws</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Report any technical issues or security concerns promptly</li>
              </ul>

              <h4 className="font-semibold mb-3">Prohibited Activities:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sharing account credentials with others</li>
                <li>Using the platform for illegal or harmful activities</li>
                <li>Harassing, threatening, or abusing other users</li>
                <li>Attempting to breach platform security</li>
                <li>Recording sessions without explicit consent</li>
                <li>Providing false or misleading information</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>5. Therapist-Client Relationship</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">Professional Standards</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Therapists must adhere to professional ethical guidelines</li>
                <li>Client confidentiality must be maintained at all times</li>
                <li>Therapeutic boundaries must be respected</li>
                <li>Dual relationships outside the therapeutic context are prohibited</li>
              </ul>

              <h4 className="font-semibold mb-3">Limitations</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Online therapy may not be suitable for all mental health conditions</li>
                <li>Therapists cannot prescribe medications through our platform</li>
                <li>Emergency services are not available through regular sessions</li>
                <li>Therapists may refer clients to in-person care when appropriate</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>6. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">Fees and Billing</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>All fees are clearly displayed before booking sessions</li>
                <li>Payment is required before session confirmation</li>
                <li>Subscription fees are billed monthly or annually as selected</li>
                <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
              </ul>

              <h4 className="font-semibold mb-3">Refund Policy</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellations made 24+ hours before session: Full refund</li>
                <li>Cancellations made 2-24 hours before: 50% refund</li>
                <li>Cancellations made less than 2 hours before: No refund</li>
                <li>Technical issues preventing session: Full refund</li>
                <li>Subscription cancellations: Pro-rated refund for unused portion</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>7. Privacy and Confidentiality</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                We are committed to protecting your privacy and maintaining confidentiality in accordance with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Digital Personal Data Protection Act (DPDP) 2023</li>
                <li>Information Technology Act 2000</li>
                <li>Professional mental health confidentiality standards</li>
                <li>International privacy frameworks (HIPAA, GDPR)</li>
              </ul>

              <h4 className="font-semibold mb-3">Exceptions to Confidentiality</h4>
              <p className="mb-2">Confidentiality may be breached only in cases of:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Imminent risk of harm to self or others</li>
                <li>Suspected child abuse or neglect</li>
                <li>Court orders or legal requirements</li>
                <li>Client consent for specific disclosures</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>8. Platform Security</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">We implement comprehensive security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for all communications</li>
                <li>Secure data storage with regular backups</li>
                <li>Multi-factor authentication options</li>
                <li>Regular security audits and updates</li>
                <li>Compliance with industry security standards</li>
                <li>24/7 monitoring for security threats</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>9. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">Our Rights</h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>AmitaCare platform, software, and content are our intellectual property</li>
                <li>Trademarks, logos, and brand elements are protected</li>
                <li>Users receive limited license to use the platform for intended purposes</li>
              </ul>

              <h4 className="font-semibold mb-3">Your Rights</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain ownership of content you create or upload</li>
                <li>You grant us license to use your content for service provision</li>
                <li>You can request deletion of your content upon account closure</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>10. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                <strong>Important Disclaimer:</strong> AmitaCare provides a platform connecting clients with therapists. 
                We do not provide direct medical or therapeutic services.
              </p>
              
              <h4 className="font-semibold mb-3">Limitations</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are not liable for the quality or outcomes of therapeutic services</li>
                <li>Our liability is limited to the amount paid for services in the past 12 months</li>
                <li>We are not responsible for therapist actions outside our platform</li>
                <li>Technical issues beyond our control are not our responsibility</li>
                <li>We do not guarantee specific therapeutic outcomes</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>11. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4 className="font-semibold mb-3">Account Termination</h4>
              <p className="mb-4">Either party may terminate the agreement:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Users can close their accounts at any time</li>
                <li>We may suspend or terminate accounts for terms violations</li>
                <li>Therapists may be removed for professional misconduct</li>
                <li>30-day notice will be provided for non-urgent terminations</li>
              </ul>

              <h4 className="font-semibold mb-3">Effect of Termination</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to platform services will cease</li>
                <li>Data will be retained as per our privacy policy</li>
                <li>Outstanding payments remain due</li>
                <li>Confidentiality obligations continue</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>12. Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                These terms are governed by the laws of India. Any disputes will be resolved through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Initial attempt at amicable resolution</li>
                <li>Mediation through recognized mediation centers</li>
                <li>Arbitration under the Arbitration and Conciliation Act, 2015</li>
                <li>Courts in Mumbai, Maharashtra have exclusive jurisdiction</li>
              </ul>

              <h4 className="font-semibold mb-3">Grievance Redressal</h4>
              <p className="mb-2">For complaints or disputes, contact:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Grievance Officer:</strong> Rajesh Kumar</p>
                <p>Email: grievance@amitacare.com</p>
                <p>Phone: +91-22-1234-5678</p>
                <p>Response time: Within 72 hours</p>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>13. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">
                We may update these terms to reflect changes in our services or legal requirements. 
                We will notify users of significant changes through:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email notifications 30 days before changes take effect</li>
                <li>Prominent notices on our platform</li>
                <li>In-app notifications for mobile users</li>
              </ul>
              <p className="mt-4">
                Continued use of our services after changes constitutes acceptance of updated terms.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>14. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="mb-4">For questions about these terms, contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>AmitaCare Technologies Pvt. Ltd.</strong></p>
                <p>Address: 123 Business District, Bandra Kurla Complex, Mumbai 400051</p>
                <p>Email: legal@amitacare.com</p>
                <p>Phone: +91-22-1234-5678</p>
                <p>Business Hours: Monday-Friday, 9 AM - 6 PM IST</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert variant="success">
          <AlertDescription>
            <strong>Thank you for choosing AmitaCare.</strong> We are committed to providing safe, 
            secure, and effective mental health services while protecting your rights and privacy.
          </AlertDescription>
        </Alert>
      </div>
    </ContentPageLayout>
  )
}