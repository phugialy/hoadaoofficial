import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth/serverAuth'

export const dynamic = 'force-dynamic'

/**
 * Get gallery images for carousel selection
 * GET /api/admin/carousel/gallery
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await checkAuth(request)
    if (!authResult.isAuthenticated || !authResult.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()

    // Get all active gallery images
    const { data: images, error } = await supabase
      .from('media_items')
      .select('id, url, title, description, storage_path')
      .eq('type', 'image')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch gallery images' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      images: images || [],
    })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}
