'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress, CircularProgress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'anxiety' | 'sleep' | 'energy'>('mood')

  const progressData = {
    overall: {
      score: 7.2,
      change: +0.8,
      trend: 'improving'
    },
    metrics: {
      mood: {
        current: 7.2,
        previous: 6.4,
        goal: 8.0,
        data: [6.1, 6.3, 6.8, 7.0, 7.2, 7.1, 7.4]
      },
      anxiety: {
        current: 4.1,
        previous: 5.2,
        goal: 3.0,
        data: [5.8, 5.5, 5.0, 4.8, 4.5, 4.2, 4.1]
      },
      sleep: {
        current: 6.8,
        previous: 6.2,
        goal: 8.0,
        data: [5.9, 6.1, 6.4, 6.6, 6.8, 6.7, 6.9]
      },
      energy: {
        current: 6.5,
        previous: 5.8,
        goal: 7.5,
        data: [5.2, 5.5, 5.9, 6.2, 6.5, 6.4, 6.7]
      }
    },
    goals: [
      {
        id: 1,
        title: 'Daily Mindfulness Practice',
        description: 'Practice mindfulness meditation for 10 minutes daily',
        progress: 85,
        target: 30,
        current: 25,
        unit: 'days',
        status: 'on-track'
      },
      {
        id: 2,
        title: 'Anxiety Management',
        description: 'Reduce anxiety levels using breathing techniques',
        progress: 70,
        target: 3.0,
        current: 4.1,
        unit: 'score',
        status: 'improving'
      },
      {
        id: 3,
        title: 'Sleep Quality',
        description: 'Improve sleep quality and duration',
        progress: 60,
        target: 8.0,
        current: 6.8,
        unit: 'hours',
        status: 'needs-attention'
      },
      {
        id: 4,
        title: 'Social Connections',
        description: 'Engage in meaningful social interactions',
        progress: 90,
        target: 3,
        current: 4,
        unit: 'times/week',
        status: 'achieved'
      }
    ],
    milestones: [
      {
        id: 1,
        title: 'First Therapy Session',
        date: '2024-12-01',
        description: 'Completed initial assessment with Dr. Sarah Johnson',
        achieved: true
      },
      {
        id: 2,
        title: '30-Day Streak',
        date: '2024-12-30',
        description: 'Maintained daily mood tracking for 30 consecutive days',
        achieved: true
      },
      {
        id: 3,
        title: 'Anxiety Reduction',
        date: '2025-01-15',
        description: 'Reduced anxiety levels by 20% from baseline',
        achieved: true
      },
      {
        id: 4,
        title: 'Sleep Improvement',
        date: '2025-02-01',
        description: 'Achieve consistent 8-hour sleep schedule',
        achieved: false
      },
      {
        id: 5,
        title: '100 Days of Progress',
        date: '2025-03-01',
        description: 'Complete 100 days of consistent mental health tracking',
        achieved: false
      }
    ],
    insights: [
      {
        type: 'positive',
        title: 'Great Progress!',
        description: 'Your mood scores have improved by 12% this month. Keep up the excellent work with your mindfulness practice.'
      },
      {
        type: 'suggestion',
        title: 'Sleep Optimization',
        description: 'Consider establishing a consistent bedtime routine. Your sleep quality directly impacts your mood and energy levels.'
      },
      {
        type: 'achievement',
        title: 'Milestone Reached',
        description: 'Congratulations! You\'ve successfully reduced your anxiety levels by 20% from your baseline.'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'success'
      case 'on-track': return 'success'
      case 'improving': return 'warning'
      case 'needs-attention': return 'destructive'
      default: return 'secondary'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return '🎉'
      case 'suggestion': return '💡'
      case 'achievement': return '🏆'
      case 'warning': return '⚠️'
      default: return 'ℹ️'
    }
  }

  const currentMetric = progressData.metrics[selectedMetric]

  return (
    <DashboardLayout userType="client">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600 mt-2">Monitor your mental health journey and celebrate your achievements</p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-2">
            <Button variant="outline">
              <span className="mr-2">📊</span>
              Export Report
            </Button>
            <Button className="gradient-primary">
              <span className="mr-2">📝</span>
              Log Today's Mood
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Wellness Score</span>
              <Badge variant={progressData.overall.change > 0 ? 'success' : 'destructive'}>
                {progressData.overall.change > 0 ? '+' : ''}{progressData.overall.change}
              </Badge>
            </CardTitle>
            <CardDescription>Your comprehensive mental health score based on all tracked metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <CircularProgress 
                value={progressData.overall.score * 10} 
                max={100}
                size={200}
                label="Overall Score"
                className="mb-4"
              />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{progressData.overall.score}/10</p>
              <p className="text-gray-600">
                Your wellness score is <span className="font-medium text-green-600">improving</span> this month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metric Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Your Metrics</h2>
            <div className="space-y-3">
              {Object.entries(progressData.metrics).map(([key, metric]) => (
                <Card 
                  key={key}
                  variant={selectedMetric === key ? 'elevated' : 'default'}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedMetric === key ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedMetric(key as any)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">{key}</h3>
                        <p className="text-2xl font-bold text-primary">{metric.current}</p>
                        <p className="text-sm text-gray-600">
                          Goal: {metric.goal}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={metric.current > metric.previous ? 'success' : 'warning'}>
                          {metric.current > metric.previous ? '+' : ''}{(metric.current - metric.previous).toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Metric Chart */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="capitalize">{selectedMetric} Trend</CardTitle>
                <CardDescription>Your {selectedMetric} levels over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">{currentMetric.current}</p>
                      <p className="text-sm text-gray-600">Current Level</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{currentMetric.goal}</p>
                      <p className="text-sm text-gray-600">Target Goal</p>
                    </div>
                  </div>
                  
                  <Progress 
                    value={(currentMetric.current / currentMetric.goal) * 100} 
                    variant={currentMetric.current >= currentMetric.goal ? 'success' : 'default'}
                    showLabel
                    label="Progress to Goal"
                  />

                  {/* Simple chart representation */}
                  <div className="mt-6">
                    <div className="flex items-end justify-between h-32 space-x-2">
                      {currentMetric.data.map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary rounded-t"
                            style={{ height: `${(value / 10) * 100}%` }}
                          />
                          <p className="text-xs text-gray-600 mt-2">
                            Day {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Goals Progress */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressData.goals.map((goal) => (
              <Card key={goal.id} variant="elevated" className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge variant={getStatusColor(goal.status)}>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress 
                      value={goal.progress} 
                      variant={goal.progress >= 80 ? 'success' : goal.progress >= 60 ? 'warning' : 'default'}
                      showLabel
                    />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current: {goal.current} {goal.unit}</span>
                      <span className="text-gray-600">Target: {goal.target} {goal.unit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Milestones</h2>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="space-y-6">
                {progressData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {milestone.achieved ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${milestone.achieved ? 'text-gray-900' : 'text-gray-600'}`}>
                          {milestone.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(milestone.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Insights</h2>
          <div className="space-y-4">
            {progressData.insights.map((insight, index) => (
              <Alert key={index} variant={insight.type === 'positive' || insight.type === 'achievement' ? 'success' : 'info'}>
                <AlertDescription className="flex items-start space-x-3">
                  <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                  <div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Keep Up the Great Work! 🌟
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              You're making excellent progress on your mental health journey. 
              Continue with your current practices and consider setting new goals to maintain momentum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gradient-primary">
                Set New Goal
              </Button>
              <Button variant="outline">
                Schedule Check-in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}