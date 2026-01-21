'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GalleryManager from '@/components/admin/GalleryManager'
import { createBrowserClient } from '@/lib/supabase'
import { isAuthenticated, isAdmin } from '@/lib/auth/adminAuth'

export default function AdminGalleryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const checkAuth = async () => {
    try {
      // Wait a bit for Supabase to initialize from localStorage
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Check authentication
      const authenticated = await isAuthenticated()

      if (!authenticated) {
        // Preserve the destination URL for redirect after login
        const returnUrl = searchParams.get('returnUrl') || '/admin/gallery'
        router.push(`/admin/login?returnUrl=${encodeURIComponent(returnUrl)}`)
        setLoading(false)
        return
      }

      // Check admin status
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

    // Listen to auth state changes
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
            <h1 className="text-4xl font-bold text-red-600 mb-2">Gallery Management</h1>
            <p className="text-gray-600">Upload and manage gallery images. Images uploaded here can be used in the carousel and displayed on the public gallery page.</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <GalleryManager />
      </div>
    </div>
  )
}
