'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversations = [
    {
      id: 1,
      therapist: 'Dr. Sarah Johnson',
      lastMessage: 'How are you feeling about the techniques we discussed?',
      timestamp: '2 hours ago',
      unreadCount: 2,
      online: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      therapist: 'Dr. Michael Chen',
      lastMessage: 'Great progress in our last session!',
      timestamp: '1 day ago',
      unreadCount: 0,
      online: false,
      avatar: 'MC'
    },
    {
      id: 3,
      therapist: 'Dr. Priya Sharma',
      lastMessage: 'I\'ve shared some resources for you to review',
      timestamp: '3 days ago',
      unreadCount: 1,
      online: true,
      avatar: 'PS'
    }
  ]

  const messages = {
    1: [
      {
        id: 1,
        sender: 'therapist',
        content: 'Hello John! How are you feeling today?',
        timestamp: '10:00 AM',
        type: 'text'
      },
      {
        id: 2,
        sender: 'user',
        content: 'Hi Dr. Johnson, I\'m doing better than yesterday. The breathing exercises really helped.',
        timestamp: '10:05 AM',
        type: 'text'
      },
      {
        id: 3,
        sender: 'therapist',
        content: 'That\'s wonderful to hear! Consistency with these techniques is key. How many times did you practice yesterday?',
        timestamp: '10:07 AM',
        type: 'text'
      },
      {
        id: 4,
        sender: 'user',
        content: 'I practiced 3 times - morning, afternoon, and before bed. The evening one was most effective.',
        timestamp: '10:10 AM',
        type: 'text'
      },
      {
        id: 5,
        sender: 'therapist',
        content: 'Excellent! I\'m attaching a guided meditation audio that might complement your evening routine.',
        timestamp: '10:15 AM',
        type: 'file',
        fileName: 'Evening_Meditation_Guide.mp3',
        fileSize: '12.5 MB'
      },
      {
        id: 6,
        sender: 'therapist',
        content: 'How are you feeling about the techniques we discussed?',
        timestamp: '2 hours ago',
        type: 'text'
      }
    ],
    2: [
      {
        id: 1,
        sender: 'therapist',
        content: 'Great progress in our last session! Keep up the good work.',
        timestamp: '1 day ago',
        type: 'text'
      }
    ],
    3: [
      {
        id: 1,
        sender: 'therapist',
        content: 'I\'ve shared some resources for you to review before our next session.',
        timestamp: '3 days ago',
        type: 'text'
      },
      {
        id: 2,
        sender: 'therapist',
        content: 'Here are some articles on trauma recovery techniques:',
        timestamp: '3 days ago',
        type: 'link',
        linkTitle: 'Understanding Trauma Recovery',
        linkUrl: 'https://example.com/trauma-recovery'
      }
    ]
  }

  const currentMessages = selectedConversation ? messages[selectedConversation as keyof typeof messages] || [] : []
  const currentConversation = conversations.find(c => c.id === selectedConversation)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    // Here you would typically send the message to your backend
    console.log('Sending message:', newMessage)
    setNewMessage('')
    
    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderMessage = (message: any) => {
    const isUser = message.sender === 'user'
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {message.type === 'text' && (
            <p className="text-sm">{message.content}</p>
          )}
          
          {message.type === 'file' && (
            <div className="space-y-2">
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center space-x-2 p-2 bg-white/10 rounded">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-medium">{message.fileName}</p>
                  <p className="text-xs opacity-75">{message.fileSize}</p>
                </div>
              </div>
            </div>
          )}
          
          {message.type === 'link' && (
            <div className="space-y-2">
              <p className="text-sm">{message.content}</p>
              <div className="p-2 bg-white/10 rounded">
                <p className="text-xs font-medium">{message.linkTitle}</p>
                <Button variant="link" className="p-0 h-auto text-xs">
                  View Article
                </Button>
              </div>
            </div>
          )}
          
          <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout userType="client">
      <div className="h-[calc(100vh-200px)] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <p className="text-sm text-gray-600">Chat with your therapists</p>
          </div>
          
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-r-primary' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{conversation.avatar}</span>
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.therapist}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" size="sm">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{currentConversation?.avatar}</span>
                    </div>
                    {currentConversation?.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{currentConversation?.therapist}</p>
                    <p className="text-sm text-gray-600">
                      {currentConversation?.online ? 'Online' : 'Last seen 2 hours ago'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {currentMessages.map(renderMessage)}
                
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={1}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="gradient-primary"
                    size="sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a therapist from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Support */}
      <Alert variant="info" className="mt-4">
        <AlertDescription>
          <strong>Need immediate support?</strong> For mental health emergencies, please call our 24/7 crisis line at 
          <strong> +91-911-CRISIS (274747)</strong> or contact emergency services at <strong>112</strong>.
        </AlertDescription>
      </Alert>
    </DashboardLayout>
  )
}