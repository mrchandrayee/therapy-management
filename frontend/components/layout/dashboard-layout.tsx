'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  userType?: 'client' | 'therapist' | 'admin'
  className?: string
}

export function DashboardLayout({ children, userType = 'client', className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const clientNavigation = [
    { name: 'Dashboard', href: '/client', icon: '🏠' },
    { name: 'Book Session', href: '/client/booking', icon: '📅' },
    { name: 'My Sessions', href: '/client/sessions', icon: '🎯' },
    { name: 'Test Reports', href: '/client/test-reports', icon: '📋' },
    { name: 'Messages', href: '/client/messages', icon: '💬', badge: '3' },
    { name: 'Progress', href: '/client/progress', icon: '📊' },
    { name: 'Billing', href: '/client/billing', icon: '💳' },
    { name: 'Settings', href: '/client/settings', icon: '⚙️' },
  ]

  const therapistNavigation = [
    { name: 'Dashboard', href: '/therapist', icon: '🏠' },
    { name: 'Availability', href: '/therapist/availability', icon: '📅' },
    { name: 'Sessions', href: '/therapist/sessions', icon: '🎯' },
    { name: 'Session Extension', href: '/therapist/session-extension', icon: '⏱️' },
    { name: 'Case Sheets', href: '/therapist/case-sheets', icon: '📋' },
    { name: 'My Clients', href: '/therapist/clients', icon: '👥' },
    { name: 'Messages', href: '/therapist/messages', icon: '💬', badge: '5' },
    { name: 'Resources', href: '/therapist/resources', icon: '📚' },
    { name: 'Analytics', href: '/therapist/analytics', icon: '📊' },
    { name: 'Settings', href: '/therapist/settings', icon: '⚙️' },
  ]

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin', icon: '🏠' },
    { name: 'Therapists', href: '/admin/therapists', icon: '👨‍⚕️' },
    { name: 'Clients', href: '/admin/clients', icon: '👥' },
    { name: 'Sessions', href: '/admin/sessions', icon: '📅' },
    { name: 'Companies', href: '/admin/companies', icon: '🏢' },
    { name: 'Coupons', href: '/admin/coupons', icon: '🎫' },
    { name: 'Reports', href: '/admin/reports', icon: '📊' },
    { name: 'Support', href: '/admin/support', icon: '🎧', badge: '12' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ]

  const navigation = userType === 'therapist' ? therapistNavigation : userType === 'admin' ? adminNavigation : clientNavigation

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-xl font-bold text-gradient-primary">AmitaCare</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500 capitalize">{userType}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="destructive" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Emergency contact */}
          <div className="p-4 border-t bg-red-50">
            <div className="text-center">
              <p className="text-xs font-medium text-red-800 mb-2">Emergency Support</p>
              <Button variant="destructive" size="sm" className="w-full">
                <span className="mr-2">🚨</span>
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 0 1 6 6v2l1.5 3h-15l1.5-3v-2a6 6 0 0 1 6-6z" />
                </svg>
                <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>

              {/* Profile dropdown */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">JD</span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}