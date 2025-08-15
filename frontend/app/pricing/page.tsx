'use client'

import { useState } from 'react'
import { ContentPageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for getting started with mental health support',
      monthlyPrice: 999,
      yearlyPrice: 9990,
      features: [
        '2 therapy sessions per month',
        'Chat support with therapists',
        'Basic mood tracking',
        'Access to self-help resources',
        'Email support',
        'Mobile app access'
      ],
      limitations: [
        'Limited therapist selection',
        'No group therapy access',
        'Basic reporting only'
      ],
      popular: false,
      color: 'border-gray-200'
    },
    {
      name: 'Standard',
      description: 'Most popular plan for regular therapy sessions',
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      features: [
        '4 therapy sessions per month',
        'Priority chat support',
        'Advanced mood & progress tracking',
        'Access to all self-help resources',
        'Group therapy sessions (2/month)',
        'Video & audio sessions',
        'Session recordings',
        'Priority booking',
        'Phone & email support'
      ],
      limitations: [
        'Limited to 4 sessions per month'
      ],
      popular: true,
      color: 'border-primary ring-2 ring-primary'
    },
    {
      name: 'Premium',
      description: 'Comprehensive mental health support with unlimited access',
      monthlyPrice: 3999,
      yearlyPrice: 39990,
      features: [
        'Unlimited therapy sessions',
        '24/7 crisis support',
        'AI-powered insights & recommendations',
        'Access to premium therapists',
        'Unlimited group therapy',
        'Family therapy sessions (2/month)',
        'Personalized treatment plans',
        'Priority support (phone, chat, email)',
        'Dedicated care coordinator',
        'Integration with health apps',
        'Detailed progress reports'
      ],
      limitations: [],
      popular: false,
      color: 'border-purple-200'
    }
  ]

  const addOns = [
    {
      name: 'Additional Session',
      price: 1500,
      description: 'Extra individual therapy session',
      icon: '👨‍⚕️'
    },
    {
      name: 'Couples Therapy',
      price: 2500,
      description: 'Specialized couples counseling session',
      icon: '💕'
    },
    {
      name: 'Family Therapy',
      price: 3000,
      description: 'Family counseling session (up to 4 members)',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      name: 'Crisis Support',
      price: 500,
      description: '24/7 emergency mental health support',
      icon: '🚨'
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'What if I need to cancel?',
      answer: 'You can cancel your subscription anytime. You\'ll continue to have access until the end of your current billing period.'
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No, our pricing is transparent. The only additional costs are optional add-ons that you choose to purchase.'
    },
    {
      question: 'Do you accept insurance?',
      answer: 'We\'re working with major insurance providers in India. Currently, we accept reimbursement from select corporate health plans.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 7-day free trial for new users to experience our platform and connect with a therapist.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm and PhonePe.'
    }
  ]

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  }

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyTotal = plan.monthlyPrice * 12
    const yearlySavings = monthlyTotal - plan.yearlyPrice
    return Math.round((yearlySavings / monthlyTotal) * 100)
  }

  return (
    <ContentPageLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your mental health journey. All plans include access to licensed therapists, 
            secure sessions, and our comprehensive mental health platform.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="success" size="sm">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              variant="elevated" 
              className={`relative hover:shadow-xl transition-shadow ${plan.color} ${
                plan.popular ? 'scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="primary" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {plan.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-gray-900">
                    ₹{getPrice(plan).toLocaleString('en-IN')}
                    <span className="text-lg font-normal text-gray-600">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-green-600 font-medium">
                      Save {getSavings(plan)}% annually
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-start">
                            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Link href="/auth/register?type=client" className="block">
                    <Button 
                      className={`w-full ${plan.popular ? 'gradient-primary' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Start {plan.name} Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-On Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enhance your mental health journey with additional services available for all plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} variant="elevated" className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{addon.icon}</div>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    ₹{addon.price.toLocaleString('en-IN')}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {addon.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full">
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise */}
        <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="text-center p-12">
            <div className="text-4xl mb-6">🏢</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise Solutions
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Custom mental health solutions for organizations, including employee assistance programs, 
              bulk licensing, and dedicated support teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact?type=enterprise">
                <Button className="gradient-primary" size="lg">
                  Contact Sales
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Enterprise Features
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Money Back Guarantee */}
        <Alert variant="success">
          <AlertDescription className="text-center">
            <strong>30-Day Money-Back Guarantee:</strong> Not satisfied with your experience? 
            Get a full refund within 30 days of your first session, no questions asked.
          </AlertDescription>
        </Alert>

        {/* FAQs */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our pricing? We've got answers.
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

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have found support and healing through AmitaCare. 
            Start with our 7-day free trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=client">
              <Button className="gradient-primary" size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Have Questions?
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ContentPageLayout>
  )
}