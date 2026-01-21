import { NextRequest, NextResponse } from 'next/server'

/**
 * Client-side Instagram import helper
 * This endpoint provides instructions for client-side import
 * POST /api/admin/instagram/import-client
 */
export async function POST(request: NextRequest) {
  // This is a placeholder - actual import should happen client-side
  // due to Instagram's CORS restrictions
  return NextResponse.json({
    error: 'Instagram oEmbed API requires client-side requests. Please use the manual import feature or ensure the post is public.',
    suggestion: 'Use the "+ Add Post" button to manually add posts with all details.'
  })
}
