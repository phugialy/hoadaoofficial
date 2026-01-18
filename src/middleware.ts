import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only protect /admin/* routes (excluding login)
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    // NOTE: Supabase stores session in localStorage (client-side), not cookies
    // So we can't reliably check auth in middleware. 
    // Auth checks are done in the page component instead.
    // This middleware is kept for potential future cookie-based auth, but currently
    // it just allows the request through and lets the page component handle auth.
    
    // We could check for a cookie-based session token here if needed in the future,
    // but for now, let the page component handle authentication via localStorage
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}

