'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, Plus, Minus, Play, Pause, Square } from 'lucide-react'

interface SessionExtension {
  sessionId: string
  clientName: string
  originalDuration: number
  extensionsUsed: number
  maxExtensions: number
  extensionDuration: number
  totalExtended: number
  isActive: boolean
  startTime: string
  endTime?: string
}

export default function SessionExtensionPage() {
  const [currentSession, setCurrentSession] = useState<SessionExtension | null>({
    sessionId: 'SES-001',
    clientName: 'John Doe',
    originalDuration: 60,
    extensionsUsed: 1,
    maxExtensions: 3,
    extensionDuration: 10,
    totalExtended: 10,
    isActive: true,
    startTime: '2024-02-15T14:00:00'
  })

  const [sessionTimer, setSessionTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showExtensionConfirm, setShowExtensionConfirm] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isTimerRunning && currentSession) {
      interval = setInterval(() => {
        const startTime = new Date(currentSession.startTime).getTime()
        const now = new Date().getTime()
        const elapsed = Math.floor((now - startTime) / 1000)
        setSessionTimer(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, currentSession])

  // Auto-start timer when session is active
  useEffect(() => {
    if (currentSession?.isActive) {
      setIsTimerRunning(true)
    }
  }, [currentSession])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionProgress = () => {
    if (!currentSession) return 0
    const totalPlannedDuration = (currentSession.originalDuration + currentSession.totalExtended) * 60
    return Math.min((sessionTimer / totalPlannedDuration) * 100, 100)
  }

  const getRemainingTime = () => {
    if (!currentSession) return 0
    const totalPlannedDuration = (currentSession.originalDuration + currentSession.totalExtended) * 60
    return Math.max(totalPlannedDuration - sessionTimer, 0)
  }

  const isOvertime = () => {
    if (!currentSession) return false
    const totalPlannedDuration = (currentSession.originalDuration + currentSession.totalExtended) * 60
    return sessionTimer > totalPlannedDuration
  }

  const canExtend = () => {
    return currentSession && currentSession.extensionsUsed < currentSession.maxExtensions
  }

  const extendSession = () => {
    if (!currentSession || !canExtend()) return

    const updatedSession = {
      ...currentSession,
      extensionsUsed: currentSession.extensionsUsed + 1,
      totalExtended: currentSession.totalExtended + currentSession.extensionDuration
    }

    setCurrentSession(updatedSession)
    setShowExtensionConfirm(false)
    
    // Notify client about extension
    alert(`Session extended by ${currentSession.extensionDuration} minutes. Client has been notified.`)
  }

  const endSession = () => {
    if (!currentSession) return

    const endTime = new Date().toISOString()
    setCurrentSession({
      ...currentSession,
      isActive: false,
      endTime
    })
    setIsTimerRunning(false)
    
    alert('Session ended successfully. Session notes can now be completed.')
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  if (!currentSession) {
    return (
      <DashboardLayout userType="therapist">
        <div className="space-y-8">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Session</h2>
            <p className="text-gray-600">Start a session to access extension controls.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Session Extension</h1>
            <p className="text-gray-600 mt-2">Manage session timing and extensions</p>
          </div>
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <Button
              onClick={toggleTimer}
              variant="outline"
              className={isTimerRunning ? 'text-orange-600' : 'text-green-600'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isTimerRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button
              onClick={endSession}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Square className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>

        {/* Session Info */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
            <CardDescription>Session with {currentSession.clientName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Session ID</p>
                <p className="font-semibold">{currentSession.sessionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold">{currentSession.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Time</p>
                <p className="font-semibold">
                  {new Date(currentSession.startTime).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={currentSession.isActive ? 'success' : 'secondary'}>
                  {currentSession.isActive ? 'Active' : 'Ended'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timer Display */}
        <Card variant="elevated">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className={`text-6xl font-mono font-bold ${isOvertime() ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(sessionTimer)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isOvertime() ? 'Overtime' : 'Session Time'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    isOvertime() ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${Math.min(getSessionProgress(), 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Original Duration</p>
                  <p className="font-semibold">{currentSession.originalDuration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-600">Extended Time</p>
                  <p className="font-semibold">{currentSession.totalExtended} minutes</p>
                </div>
                <div>
                  <p className="text-gray-600">Remaining Time</p>
                  <p className={`font-semibold ${isOvertime() ? 'text-red-600' : 'text-green-600'}`}>
                    {isOvertime() ? 'Overtime' : formatTime(getRemainingTime())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extension Controls */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Session Extensions</CardTitle>
            <CardDescription>
              Extend your session in {currentSession.extensionDuration}-minute increments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Extensions Used</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">
                    {currentSession.extensionsUsed}/{currentSession.maxExtensions}
                  </span>
                  <div className="flex space-x-1">
                    {Array.from({ length: currentSession.maxExtensions }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index < currentSession.extensionsUsed ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setShowExtensionConfirm(true)}
                disabled={!canExtend() || !currentSession.isActive}
                className="gradient-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Extend Session (+{currentSession.extensionDuration} min)
              </Button>
            </div>

            {!canExtend() && currentSession.isActive && (
              <Alert variant="warning">
                <AlertDescription>
                  You have used all available extensions for this session. 
                  Maximum {currentSession.maxExtensions} extensions of {currentSession.extensionDuration} minutes each are allowed.
                </AlertDescription>
              </Alert>
            )}

            {!currentSession.isActive && (
              <Alert>
                <AlertDescription>
                  This session has ended. Extensions are no longer available.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Extension History */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Extension History</CardTitle>
            <CardDescription>Track of session extensions</CardDescription>
          </CardHeader>
          <CardContent>
            {currentSession.extensionsUsed > 0 ? (
              <div className="space-y-3">
                {Array.from({ length: currentSession.extensionsUsed }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Extension {index + 1}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">+{currentSession.extensionDuration} minutes</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Date.now() - (currentSession.extensionsUsed - index - 1) * 10 * 60 * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No extensions used yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extension Confirmation Modal */}
        {showExtensionConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Extend Session</CardTitle>
                <CardDescription>
                  Are you sure you want to extend this session by {currentSession.extensionDuration} minutes?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> The client will be automatically notified about the session extension.
                      This will use {currentSession.extensionsUsed + 1} of {currentSession.maxExtensions} available extensions.
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={extendSession} className="gradient-primary flex-1">
                      Confirm Extension
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowExtensionConfirm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}