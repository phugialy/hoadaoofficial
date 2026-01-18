import { createBrowserClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Check if user is authenticated
 * Uses getSession() which reads from localStorage/cookies
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = createBrowserClient()
    // getSession() is synchronous and reads from localStorage
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[isAuthenticated] Error getting session:', error)
      return false
    }
    
    const hasSession = !!session
    console.log('[isAuthenticated] Session check:', hasSession, session ? 'user: ' + session.user.email : 'no session')
    return hasSession
  } catch (error) {
    console.error('[isAuthenticated] Exception:', error)
    return false
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Check if user is admin
 * Admin status is stored in user metadata or in a separate admin_users table
 * For now, we check user metadata. Can be extended to check database table.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  // Check user metadata for admin flag
  const isAdminUser = user.user_metadata?.is_admin === true

  // Alternative: Check database table (if admin_users table exists)
  // const supabase = createBrowserClient()
  // const { data } = await supabase
  //   .from('admin_users')
  //   .select('id')
  //   .eq('user_id', user.id)
  //   .single()
  // return !!data

  return isAdminUser
}

/**
 * Sign in user
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Wait for session to be persisted to localStorage/cookies
  // This ensures the session is available on the next page load
  if (data.session) {
    // Give the browser time to persist the session
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return data
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get session
 */
export async function getSession() {
  const supabase = createBrowserClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

