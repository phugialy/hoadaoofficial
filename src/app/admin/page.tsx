'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import { isAuthenticated, isAdmin } from '@/lib/auth/adminAuth'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const checkAuth = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100))

      const authenticated = await isAuthenticated()
      if (!authenticated) {
        router.push('/admin/login')
        setLoading(false)
        return
      }

      const admin = await isAdmin()
      if (!admin) {
        router.push('/admin/login')
        setLoading(false)
        return
      }

      setAuthorized(true)
      setLoading(false)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()

    const supabase = createBrowserClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAuth()
      } else if (event === 'SIGNED_OUT') {
        router.push('/admin/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  const adminMenuItems = [
    {
      title: 'Calendar & Events',
      description: 'Manage events and calendar entries',
      href: '/admin/calendar',
      icon: '📅',
      color: 'bg-blue-500',
    },
    {
      title: 'Carousel Images',
      description: 'Manage featured carousel images for homepage',
      href: '/admin/carousel',
      icon: '🖼️',
      color: 'bg-purple-500',
    },
    {
      title: 'Gallery Management',
      description: 'Upload, remove, and manage gallery photos with display order',
      href: '/admin/gallery',
      icon: '📷',
      color: 'bg-green-500',
    },
    {
      title: 'About Content',
      description: 'Edit organization mission and vision statements',
      href: '/admin/about',
      icon: '📝',
      color: 'bg-indigo-500',
    },
    {
      title: 'Instagram Posts',
      description: 'Manage Instagram feed posts',
      href: '/admin/instagram',
      icon: '📸',
      color: 'bg-pink-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your website content and settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6"
            >
              <div className={`${item.color} w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-4`}>
                {item.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600 mt-1">Active Events</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">-</div>
              <div className="text-sm text-gray-600 mt-1">Carousel Images</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-pink-600">-</div>
              <div className="text-sm text-gray-600 mt-1">Instagram Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
