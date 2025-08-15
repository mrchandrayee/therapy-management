'use client'

import { ContentPageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  const team = [
    {
      name: 'Dr. Amit Sharma',
      role: 'Founder & Chief Medical Officer',
      bio: 'Psychiatrist with 15+ years experience in digital mental health',
      image: '/api/placeholder/200/200',
      credentials: ['MD Psychiatry', 'Digital Health Certified']
    },
    {
      name: 'Priya Patel',
      role: 'Chief Technology Officer',
      bio: 'Former Google engineer passionate about healthcare technology',
      image: '/api/placeholder/200/200',
      credentials: ['MS Computer Science', 'Healthcare IT Expert']
    },
    {
      name: 'Dr. Sarah Johnson',
      role: 'Head of Clinical Operations',
      bio: 'Clinical psychologist specializing in therapy platform design',
      image: '/api/placeholder/200/200',
      credentials: ['PhD Clinical Psychology', 'Telehealth Specialist']
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Compliance',
      bio: 'Healthcare compliance expert ensuring HIPAA and DPDP adherence',
      image: '/api/placeholder/200/200',
      credentials: ['JD Healthcare Law', 'Privacy Compliance Expert']
    }
  ]

  const values = [
    {
      title: 'Accessibility',
      description: 'Making mental healthcare accessible to everyone, regardless of location or background',
      icon: '🌍'
    },
    {
      title: 'Privacy',
      description: 'Protecting your personal information with the highest security standards',
      icon: '🔒'
    },
    {
      title: 'Quality',
      description: 'Connecting you only with licensed, verified mental health professionals',
      icon: '⭐'
    },
    {
      title: 'Innovation',
      description: 'Using technology to improve mental health outcomes and user experience',
      icon: '💡'
    },
    {
      title: 'Compassion',
      description: 'Approaching mental health with empathy, understanding, and cultural sensitivity',
      icon: '❤️'
    },
    {
      title: 'Evidence-Based',
      description: 'Supporting therapeutic approaches backed by scientific research',
      icon: '📊'
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'AmitaCare was founded with a mission to democratize mental healthcare in India'
    },
    {
      year: '2021',
      title: 'First 100 Therapists',
      description: 'Onboarded our first 100 licensed therapists across major Indian cities'
    },
    {
      year: '2022',
      title: '10,000 Sessions',
      description: 'Completed 10,000 successful therapy sessions with 95% satisfaction rate'
    },
    {
      year: '2023',
      title: 'Series A Funding',
      description: 'Raised $5M Series A to expand across India and enhance platform features'
    },
    {
      year: '2024',
      title: '50+ Cities',
      description: 'Expanded to serve 50+ cities with 1000+ therapists and 50,000+ users'
    },
    {
      year: '2025',
      title: 'AI Integration',
      description: 'Launched AI-powered matching and mental health insights platform'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '50,000+' },
    { label: 'Licensed Therapists', value: '1,200+' },
    { label: 'Cities Served', value: '50+' },
    { label: 'Sessions Completed', value: '100,000+' },
    { label: 'Languages Supported', value: '12+' },
    { label: 'Success Rate', value: '95%' }
  ]

  return (
    <ContentPageLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About AmitaCare
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're on a mission to make quality mental healthcare accessible, affordable, and stigma-free for everyone in India. 
            Our platform connects you with licensed therapists who understand your cultural context and language preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=client">
              <Button className="gradient-primary" size="lg">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/therapists">
              <Button variant="outline" size="lg">
                Meet Our Therapists
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                AmitaCare was born from a simple yet powerful realization: mental healthcare in India needed to be more accessible, 
                culturally sensitive, and free from stigma. Our founder, Dr. Amit Sharma, experienced firsthand the challenges 
                people face when seeking mental health support.
              </p>
              <p>
                After years of practicing psychiatry in traditional settings, Dr. Sharma recognized that many people couldn't 
                access quality mental healthcare due to geographical barriers, social stigma, or lack of culturally competent 
                therapists. This led to the creation of AmitaCare in 2020.
              </p>
              <p>
                Today, we're proud to be India's leading mental health platform, serving thousands of users across 50+ cities 
                with a network of 1,200+ licensed therapists who speak 12+ languages and understand diverse cultural contexts.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="text-6xl">🧠</div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4">
              <div className="text-2xl font-bold text-primary">2020</div>
              <div className="text-sm text-gray-600">Founded</div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we serve our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} variant="elevated" className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a small startup to India's leading mental health platform.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card variant="elevated" className="hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="primary" className="text-sm font-bold">
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{milestone.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-white border-4 border-primary rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our diverse team of healthcare professionals, technologists, and mental health advocates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} variant="elevated" className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="space-y-1">
                    {member.credentials.map((cred, credIndex) => (
                      <Badge key={credIndex} variant="outline" size="sm">
                        {cred}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications & Compliance */}
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Certifications & Compliance
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We maintain the highest standards of security, privacy, and clinical excellence.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="font-semibold text-gray-900">ISO 27001</h3>
                <p className="text-sm text-gray-600">Information Security</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold text-gray-900">HIPAA</h3>
                <p className="text-sm text-gray-600">Healthcare Privacy</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-semibold text-gray-900">DPDP Act</h3>
                <p className="text-sm text-gray-600">Data Protection</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚕️</span>
                </div>
                <h3 className="font-semibold text-gray-900">Clinical Excellence</h3>
                <p className="text-sm text-gray-600">Quality Assurance</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have found support, healing, and growth through AmitaCare. 
            Your mental health matters, and we're here to help every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=client">
              <Button className="gradient-primary" size="lg">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ContentPageLayout>
  )
}