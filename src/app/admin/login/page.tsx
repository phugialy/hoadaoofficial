'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signOut, isAuthenticated, isAdmin } from '@/lib/auth/adminAuth'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already logged in
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRedirectUrl = () => {
    const returnUrl = searchParams.get('returnUrl')
    return returnUrl || '/admin' // Default to dashboard instead of calendar
  }

  const checkAuth = async () => {
    const authenticated = await isAuthenticated()
    if (authenticated) {
      const admin = await isAdmin()
      if (admin) {
        router.push(getRedirectUrl())
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Sign in
      const signInResult = await signIn(email, password)
      console.log('Sign in result:', signInResult)

      // Wait a bit for session to be established in cookies
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Verify admin status
      const authenticated = await isAuthenticated()
      console.log('Is authenticated:', authenticated)

      if (!authenticated) {
        setError('Authentication failed. Please try again.')
        setLoading(false)
        return
      }

      const admin = await isAdmin()
      console.log('Is admin:', admin)

      if (!admin) {
        await signOut()
        setError('Access denied. Admin privileges required.')
        setLoading(false)
        return
      }

      // Success - redirect using router.push for client-side navigation
      // This preserves the Supabase client instance and session
      const redirectUrl = getRedirectUrl()
      console.log('✅ Login successful, redirecting to', redirectUrl)
      router.push(redirectUrl)
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

