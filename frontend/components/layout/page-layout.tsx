'use client'

import { ReactNode } from 'react'
import { Header } from './header'
import { Footer } from './footer'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  headerVariant?: 'default' | 'transparent' | 'minimal'
  footerVariant?: 'default' | 'minimal'
  showHeader?: boolean
  showFooter?: boolean
  showAuth?: boolean
  className?: string
  containerClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function PageLayout({
  children,
  headerVariant = 'default',
  footerVariant = 'default',
  showHeader = true,
  showFooter = true,
  showAuth = true,
  className,
  containerClassName,
  maxWidth = '7xl',
  padding = 'md'
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  }

  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {showHeader && (
        <Header variant={headerVariant} showAuth={showAuth} />
      )}
      
      <main className="flex-1">
        <div className={cn(
          'mx-auto',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          containerClassName
        )}>
          {children}
        </div>
      </main>
      
      {showFooter && (
        <Footer variant={footerVariant} />
      )}
    </div>
  )
}

// Specialized layout components for different page types
export function LandingPageLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout
      headerVariant="transparent"
      footerVariant="default"
      maxWidth="full"
      padding="none"
      className={className}
    >
      {children}
    </PageLayout>
  )
}

export function AuthPageLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout
      headerVariant="minimal"
      footerVariant="minimal"
      showAuth={false}
      maxWidth="full"
      padding="none"
      className={cn('bg-gray-50', className)}
    >
      {children}
    </PageLayout>
  )
}

export function DashboardLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout
      headerVariant="default"
      showFooter={false}
      maxWidth="full"
      padding="none"
      className={className}
    >
      {children}
    </PageLayout>
  )
}

export function ContentPageLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PageLayout
      headerVariant="default"
      footerVariant="default"
      maxWidth="7xl"
      padding="md"
      className={className}
    >
      {children}
    </PageLayout>
  )
}