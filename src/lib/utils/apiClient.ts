import { createBrowserClient } from '@/lib/supabase'

/**
 * Helper function to make authenticated API requests
 * Automatically includes the authorization token from Supabase session
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const supabase = createBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()

  const headers = new Headers(options.headers)

  // Add authorization header if we have a session
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
