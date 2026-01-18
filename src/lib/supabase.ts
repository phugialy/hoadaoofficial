import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client-side Supabase client (for use in components)
// Use singleton pattern to ensure same client instance across app
let browserClientInstance: ReturnType<typeof createClient> | null = null

export function createBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserClient can only be called in browser context')
  }

  // Return existing instance if available
  if (browserClientInstance) {
    return browserClientInstance
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  browserClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return browserClientInstance
}

// Server-side client (for API routes and server components)
export function createServerClient() {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  // Use anon key for server-side if service role key is not available
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

  if (!key) {
    throw new Error('Missing Supabase API key')
  }

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Default export for client-side use (only in browser)
export const supabase = typeof window !== 'undefined' 
  ? createBrowserClient()
  : null

