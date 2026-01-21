import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * Get public gallery images with pagination
 * GET /api/gallery?page=1&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100 per page
    const offset = (page - 1) * limit

    const supabase = createServerClient()

    // Get total count of active images
    const { count } = await supabase
      .from('media_items')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'image')
      .eq('active', true)

    // Get active images with pagination
    const { data: images, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('type', 'image')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch gallery images' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      images: images || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    )
  }
}
