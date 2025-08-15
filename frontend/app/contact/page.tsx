'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ContentPageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // API call would go here
      console.log('Contact form data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactMethods = [
    {
      title: 'General Support',
      description: 'Questions about our services, billing, or technical issues',
      icon: '💬',
      contact: 'support@amitacare.com',
      hours: '24/7 Support Available'
    },
    {
      title: 'Clinical Support',
      description: 'Questions about therapy, treatment, or clinical concerns',
      icon: '⚕️',
      contact: 'clinical@amitacare.com',
      hours: 'Mon-Fri, 9 AM - 6 PM IST'
    },
    {
      title: 'Emergency Support',
      description: 'Immediate mental health crisis support',
      icon: '🚨',
      contact: '+91-911-CRISIS (274747)',
      hours: '24/7 Emergency Line'
    },
    {
      title: 'Business Inquiries',
      description: 'Partnerships, enterprise solutions, and media inquiries',
      icon: '🏢',
      contact: 'business@amitacare.com',
      hours: 'Mon-Fri, 10 AM - 7 PM IST'
    }
  ]

  const offices = [
    {
      city: 'Mumbai',
      address: '123 Business District, Bandra Kurla Complex, Mumbai 400051',
      phone: '+91-22-1234-5678',
      type: 'Headquarters'
    },
    {
      city: 'Bangalore',
      address: '456 Tech Park, Electronic City, Bangalore 560100',
      phone: '+91-80-1234-5678',
      type: 'Technology Center'
    },
    {
      city: 'Delhi',
      address: '789 Corporate Plaza, Connaught Place, New Delhi 110001',
      phone: '+91-11-1234-5678',
      type: 'Regional Office'
    }
  ]

  const faqs = [
    {
      question: 'How quickly can I get a response?',
      answer: 'We typically respond to general inquiries within 24 hours. For urgent clinical matters, our team responds within 2-4 hours during business hours.'
    },
    {
      question: 'Can I schedule a call instead of emailing?',
      answer: 'Yes! You can request a callback in the form below, and our team will reach out to schedule a convenient time to speak.'
    },
    {
      question: 'Do you offer support in regional languages?',
      answer: 'Yes, we provide support in Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and other major Indian languages.'
    },
    {
      question: 'What if I have a mental health emergency?',
      answer: 'For immediate mental health crises, please call our 24/7 emergency line or contact your local emergency services (112). Our crisis counselors are available around the clock.'
    }
  ]

  return (
    <ContentPageLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help with any questions about our mental health services, platform, or how we can support your journey to better mental wellness.
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert variant="destructive">
          <AlertDescription className="text-center">
            <strong>🚨 Mental Health Emergency?</strong> If you're experiencing a crisis, please call our 24/7 emergency line at 
            <strong> +91-911-CRISIS (274747)</strong> or contact emergency services at <strong>112</strong> immediately.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert variant="success" className="mb-6">
                    <AlertDescription>
                      Thank you for your message! We'll get back to you within 24 hours.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      placeholder="Your full name"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="general">General Support</option>
                        <option value="clinical">Clinical Questions</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="technical">Technical Issues</option>
                        <option value="partnership">Partnership</option>
                        <option value="media">Media Inquiry</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                    placeholder="Brief description of your inquiry"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Please provide details about your inquiry..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full gradient-primary"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Methods</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} variant="elevated" className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{method.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                          <p className="font-medium text-primary">{method.contact}</p>
                          <p className="text-xs text-gray-500">{method.hours}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <Card key={index} variant="elevated">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {office.city}
                            <span className="ml-2 text-sm text-primary">({office.type})</span>
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{office.address}</p>
                          <p className="text-sm font-medium text-gray-900">{office.phone}</p>
                        </div>
                        <div className="text-2xl">🏢</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-xl">Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 8:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium">10:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium">12:00 PM - 4:00 PM IST</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-3">
                    <span className="text-gray-600">Emergency Support:</span>
                    <span className="font-medium text-red-600">24/7 Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about contacting us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="text-center p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Follow us on social media for mental health tips, updates, and community support.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>📘</span>
                <span>Facebook</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>🐦</span>
                <span>Twitter</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>📸</span>
                <span>Instagram</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>💼</span>
                <span>LinkedIn</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentPageLayout>
  )
}