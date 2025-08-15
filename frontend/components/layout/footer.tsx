import Link from 'next/link'

interface FooterProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export function Footer({ variant = 'default', className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { name: 'Individual Therapy', href: '/therapy/individual' },
      { name: 'Couples Therapy', href: '/therapy/couples' },
      { name: 'Family Therapy', href: '/therapy/family' },
      { name: 'Group Therapy', href: '/therapy/group' },
      { name: 'Corporate Wellness', href: '/corporate' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'File Grievance', href: '/grievance' },
      { name: 'Emergency Support', href: '/emergency' },
      { name: 'Crisis Resources', href: '/crisis' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Therapists', href: '/therapists' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'DPDP Compliance', href: '/dpdp' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const socialLinks = [
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
        </svg>
      ),
    },
  ]

  if (variant === 'minimal') {
    return (
      <footer className={`bg-gray-50 border-t ${className}`}>
        <div className="container-enterprise">
          <div className="py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">AC</span>
              </div>
              <span className="text-lg font-bold text-gradient-primary">AmitaCare</span>
            </div>
            <div className="text-sm text-gray-600 text-center md:text-right">
              <p>&copy; {currentYear} AmitaCare. All rights reserved.</p>
              <p className="mt-1">
                <Link href="/privacy" className="hover:text-primary">Privacy</Link>
                {' • '}
                <Link href="/terms" className="hover:text-primary">Terms</Link>
                {' • '}
                <Link href="/contact" className="hover:text-primary">Contact</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="container-enterprise">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AC</span>
                </div>
                <span className="text-xl font-bold">AmitaCare</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Professional mental health therapy services with qualified therapists across India. 
                Your mental wellness is our priority.
              </p>
              
              {/* Emergency Notice */}
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-6">
                <p className="text-red-200 text-xs font-medium">
                  <strong>Emergency:</strong> If you're in crisis, call 
                  <a href="tel:9152987821" className="underline ml-1">91529-87821</a> or 
                  <a href="tel:112" className="underline ml-1">112</a>
                </p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                <p>&copy; {currentYear} AmitaCare Technologies Pvt. Ltd. All rights reserved.</p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>🇮🇳 Made in India</span>
                <span>•</span>
                <span>ISO 27001 Certified</span>
                <span>•</span>
                <span>HIPAA Compliant</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center md:text-left">
              <p>
                AmitaCare is committed to providing accessible mental health services. 
                This platform is designed to complement, not replace, professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}