'use client'

import { ContentPageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      id: 'individual',
      title: 'Individual Therapy',
      description: 'One-on-one sessions with licensed therapists for personalized mental health support',
      icon: '👤',
      features: ['Personalized treatment plans', 'Flexible scheduling', 'Progress tracking', 'Secure video sessions'],
      duration: '45-60 minutes',
      price: 'From ₹1,500',
      popular: true
    },
    {
      id: 'couples',
      title: 'Couples Therapy',
      description: 'Relationship counseling to improve communication and resolve conflicts',
      icon: '💕',
      features: ['Communication skills', 'Conflict resolution', 'Relationship building', 'Joint sessions'],
      duration: '60-90 minutes',
      price: 'From ₹2,500',
      popular: false
    },
    {
      id: 'family',
      title: 'Family Therapy',
      description: 'Family counseling to strengthen relationships and resolve family dynamics',
      icon: '👨‍👩‍👧‍👦',
      features: ['Family dynamics', 'Communication improvement', 'Conflict mediation', 'Group sessions'],
      duration: '60-90 minutes',
      price: 'From ₹3,000',
      popular: false
    },
    {
      id: 'group',
      title: 'Group Therapy',
      description: 'Therapeutic sessions with peers facing similar challenges',
      icon: '👥',
      features: ['Peer support', 'Shared experiences', 'Cost-effective', 'Social skills'],
      duration: '60-90 minutes',
      price: 'From ₹800',
      popular: false
    },
    {
      id: 'crisis',
      title: 'Crisis Support',
      description: '24/7 emergency mental health support for immediate assistance',
      icon: '🚨',
      features: ['24/7 availability', 'Immediate response', 'Crisis intervention', 'Safety planning'],
      duration: 'As needed',
      price: 'From ₹500',
      popular: false
    },
    {
      id: 'corporate',
      title: 'Corporate Wellness',
      description: 'Mental health programs for organizations and employee assistance',
      icon: '🏢',
      features: ['Employee assistance', 'Workplace wellness', 'Stress management', 'Team building'],
      duration: 'Customized',
      price: 'Contact for pricing',
      popular: false
    }
  ]

  const specializations = [
    {
      name: 'Anxiety & Stress Management',
      description: 'Techniques to manage anxiety, panic attacks, and chronic stress',
      therapists: 45,
      icon: '🧠'
    },
    {
      name: 'Depression & Mood Disorders',
      description: 'Support for depression, bipolar disorder, and mood-related issues',
      therapists: 38,
      icon: '💙'
    },
    {
      name: 'Trauma & PTSD',
      description: 'Specialized care for trauma recovery and PTSD treatment',
      therapists: 22,
      icon: '🌱'
    },
    {
      name: 'Addiction Recovery',
      description: 'Support for substance abuse and behavioral addiction recovery',
      therapists: 18,
      icon: '🔄'
    },
    {
      name: 'Grief & Loss',
      description: 'Counseling for bereavement, loss, and life transitions',
      therapists: 25,
      icon: '🕊️'
    },
    {
      name: 'Child & Adolescent',
      description: 'Specialized therapy for children and teenagers',
      therapists: 30,
      icon: '👶'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Assessment',
      description: 'Complete our initial assessment to understand your needs and match you with the right therapist',
      icon: '📋'
    },
    {
      step: 2,
      title: 'Matching',
      description: 'Our AI-powered system matches you with therapists based on your preferences and requirements',
      icon: '🎯'
    },
    {
      step: 3,
      title: 'First Session',
      description: 'Meet your therapist in a secure video session to discuss your goals and treatment plan',
      icon: '💬'
    },
    {
      step: 4,
      title: 'Ongoing Support',
      description: 'Continue with regular sessions, track progress, and adjust your treatment as needed',
      icon: '📈'
    }
  ]

  return (
    <ContentPageLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Mental Health Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive mental health support tailored to your unique needs. 
            From individual therapy to crisis support, we're here to help you on your journey to wellness.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card 
              key={service.id} 
              variant="elevated" 
              className={`hover:shadow-xl transition-shadow relative ${
                service.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="primary" className="px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Starting at:</span>
                    <span className="font-bold text-primary">{service.price}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Link href={`/therapists?service=${service.id}`}>
                      <Button className="w-full gradient-primary">
                        Find Therapists
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Specializations */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Areas of Specialization
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our therapists specialize in various mental health areas to provide you with expert care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <Card key={index} variant="elevated" className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{spec.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{spec.name}</CardTitle>
                      <p className="text-sm text-gray-600">{spec.therapists} therapists available</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {spec.description}
                  </CardDescription>
                  <Link href={`/therapists?specialization=${encodeURIComponent(spec.name)}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Find Specialists
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started with mental health support is simple and straightforward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Support */}
        <Card variant="elevated" className="bg-red-50 border-red-200">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Need Immediate Help?
            </h2>
            <p className="text-red-700 mb-6 max-w-2xl mx-auto">
              If you're experiencing a mental health crisis or having thoughts of self-harm, 
              please reach out for immediate support. Help is available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="destructive" size="lg">
                <span className="mr-2">📞</span>
                Crisis Hotline: 9152987821
              </Button>
              <Button variant="outline" size="lg" className="border-red-300 text-red-700">
                <span className="mr-2">💬</span>
                Emergency Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health. Our qualified therapists are here to support you 
            every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=client">
              <Button className="gradient-primary" size="lg">
                Get Started Today
              </Button>
            </Link>
            <Link href="/therapists">
              <Button variant="outline" size="lg">
                Browse Therapists
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ContentPageLayout>
  )
}