import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Server-side authentication check for API routes
 * Extracts session from cookies or Authorization header
 */
export async function isAuthenticatedServer(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { isAuthenticated: false, user: null }
    }

    // Create a client with anon key (not service role) to verify user tokens
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    
    // Try Authorization header first (Bearer token)
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (!error && user) {
        return { isAuthenticated: true, user }
      }
    }
    
    // Try to get session from Supabase cookies
    // Supabase stores session in cookies with pattern: sb-<project-ref>-auth-token
    const cookieStore = await cookies()
    
    // Try common Supabase cookie names
    const cookieNames = [
      `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`,
      'sb-access-token',
      'sb-refresh-token',
    ]
    
    for (const cookieName of cookieNames) {
      const cookie = cookieStore.get(cookieName)
      if (cookie?.value) {
        try {
          // Try parsing as JSON (Supabase stores session as JSON in cookie)
          const sessionData = JSON.parse(cookie.value)
          if (sessionData?.access_token) {
            const { data: { user }, error } = await supabase.auth.getUser(sessionData.access_token)
            if (!error && user) {
              return { isAuthenticated: true, user }
            }
          }
        } catch {
          // If not JSON, try as direct token
          const { data: { user }, error } = await supabase.auth.getUser(cookie.value)
          if (!error && user) {
            return { isAuthenticated: true, user }
          }
        }
      }
    }
    
    return { isAuthenticated: false, user: null }
  } catch (error) {
    console.error('[isAuthenticatedServer] Error:', error)
    return { isAuthenticated: false, user: null }
  }
}

/**
 * Check if user is admin (server-side)
 */
export async function isAdminServer(user: any): Promise<boolean> {
  if (!user) return false
  
  // Check user metadata for admin flag
  const isAdminUser = user.user_metadata?.is_admin === true || user.user_metadata?.role === 'admin'
  
  return isAdminUser
}

/**
 * Combined auth check for API routes
 */
export async function checkAuth(request: NextRequest) {
  const authResult = await isAuthenticatedServer(request)
  
  if (!authResult.isAuthenticated) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
    }
  }
  
  const isAdmin = await isAdminServer(authResult.user)
  
  return {
    isAuthenticated: true,
    isAdmin,
    user: authResult.user,
  }
}
