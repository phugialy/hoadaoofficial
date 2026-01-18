'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { isAuthenticated, isAdmin } from '@/lib/auth/adminAuth'
import AdminCalendar from '@/components/admin/AdminCalendar'
import SyncSheetButton from '@/components/admin/SyncSheetButton'

export default function AdminCalendarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  const checkAuth = async () => {
    try {
      console.log('[Calendar] Starting auth check...')
      
      // Wait a bit for Supabase to initialize from localStorage
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Check authentication
      const authenticated = await isAuthenticated()

      if (!authenticated) {
        console.log('[Calendar] Not authenticated, redirecting to login')
        router.push('/admin/login')
        setLoading(false)
        return
      }

      // Check admin status
      const admin = await isAdmin()
      console.log('[Calendar] Admin check result:', admin)

      if (!admin) {
        console.log('[Calendar] Not admin, redirecting to login')
        router.push('/admin/login')
        setLoading(false)
        return
      }

      console.log('[Calendar] ✅ Auth check passed, showing calendar')
      setAuthorized(true)
      setLoading(false)
    } catch (error) {
      console.error('[Calendar] ❌ Auth check error:', error)
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
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Calendar] Auth state changed:', event, session ? 'has session' : 'no session')
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Re-check auth when signed in
        checkAuth()
      } else if (event === 'SIGNED_OUT') {
        router.push('/admin/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // Note: checkAuth and router are intentionally omitted from deps to avoid infinite loops
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
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Admin Calendar</h1>
          <SyncSheetButton />
        </div>
        <AdminCalendar />
      </div>
    </div>
  )
}

