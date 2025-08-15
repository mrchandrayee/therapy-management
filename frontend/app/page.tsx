'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LandingPageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const therapyCategories = [
    { 
      id: 'anxiety', 
      name: 'Anxiety & Stress', 
      description: 'Manage anxiety, panic attacks, and stress-related issues',
      icon: '🧠',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    { 
      id: 'depression', 
      name: 'Depression', 
      description: 'Support for depression, mood disorders, and emotional wellness',
      icon: '💙',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    { 
      id: 'relationships', 
      name: 'Relationships', 
      description: 'Couples therapy, family counseling, and relationship issues',
      icon: '💕',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    },
    { 
      id: 'trauma', 
      name: 'Trauma & PTSD', 
      description: 'Healing from traumatic experiences and PTSD',
      icon: '🌱',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    { 
      id: 'addiction', 
      name: 'Addiction', 
      description: 'Recovery support and addiction counseling',
      icon: '🔄',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    },
    { 
      id: 'grief', 
      name: 'Grief & Loss', 
      description: 'Support through loss, bereavement, and life transitions',
      icon: '🕊️',
      color: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    },
  ]

  const features = [
    {
      title: 'Qualified Therapists',
      description: 'Licensed mental health professionals with verified credentials',
      icon: '👨‍⚕️'
    },
    {
      title: 'Secure & Private',
      description: 'End-to-end encrypted sessions with HIPAA compliance',
      icon: '🔒'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule, 24/7 availability',
      icon: '📅'
    },
    {
      title: 'Affordable Care',
      description: 'Transparent pricing with insurance coverage options',
      icon: '💰'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Qualified Therapists', value: '1,200+' },
    { label: 'Sessions Completed', value: '100K+' },
    { label: 'Success Rate', value: '95%' }
  ]

  return (
    <LandingPageLayout>
      {/* Hero Section */}
      <section className="relative gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container-enterprise section-padding-lg">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              🎉 Now serving 50+ cities across India
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Mental Health Journey Starts Here
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
              Connect with qualified therapists, book sessions instantly, and take control of your mental wellness with AmitaCare.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/auth/register?type=client">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  Book Your First Session
                </Button>
              </Link>
              <Link href="/therapists">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                  Browse Therapists
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-enterprise">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AmitaCare?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the highest quality mental health care with modern technology and compassionate professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Therapy Categories */}
      <section className="section-padding bg-gray-50">
        <div className="container-enterprise">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Support for Your Concerns
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our qualified therapists specialize in various areas to provide you with the best possible care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapyCategories.map((category) => (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCategory === category.id ? 'ring-2 ring-primary shadow-lg' : ''
                } ${category.color}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {category.description}
                  </CardDescription>
                  <Link href={`/therapists?category=${category.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Find Therapists
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-secondary text-white">
        <div className="container-enterprise text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of people who have found support and healing through AmitaCare. 
            Your mental health matters, and we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?type=client">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Free Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                Talk to Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding-sm bg-white border-t">
        <div className="container-enterprise">
          <div className="text-center">
            <p className="text-gray-600 mb-6">Trusted by leading healthcare organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge variant="outline" className="px-4 py-2">ISO 27001 Certified</Badge>
              <Badge variant="outline" className="px-4 py-2">HIPAA Compliant</Badge>
              <Badge variant="outline" className="px-4 py-2">SOC 2 Type II</Badge>
              <Badge variant="outline" className="px-4 py-2">GDPR Ready</Badge>
            </div>
          </div>
        </div>
      </section>
    </LandingPageLayout>
  )
}