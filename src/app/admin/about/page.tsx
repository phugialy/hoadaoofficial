'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import { isAuthenticated, isAdmin } from '@/lib/auth/adminAuth'
import AboutContentManager from '@/components/admin/AboutContentManager'

export default function AdminAboutPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">About Content</h1>
            <p className="text-gray-600">Manage your organization's mission and vision statements</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <AboutContentManager />
      </div>
    </div>
  )
}
