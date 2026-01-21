'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/team', label: 'Team' },
    { href: '/gallery', label: 'Gallery' },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 transition-editorial">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo: public/logo-header.png (200×60); fallback to text if missing */}
          <Link href="/" className="flex items-center shrink-0 group">
            {!logoError ? (
              <Image
                src="/logo-header.png"
                alt="Hoa Dao Lion Dance Association"
                width={200}
                height={60}
                className="h-20 md:h-24 w-auto max-w-[280px] object-contain object-left"
                onError={() => setLogoError(true)}
                priority
                sizes="280px"
              />
            ) : (
              <span className="text-xl md:text-2xl font-display font-bold text-red-600 tracking-tight group-hover:text-red-700 transition-editorial">
                🦁 Hoa Dao Lion Dance Association
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-10 lg:gap-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm text-gray-700 hover:text-red-600 transition-editorial font-medium tracking-wide relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 px-2 text-body-sm text-gray-700 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-editorial font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}


