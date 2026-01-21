import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth/serverAuth'

export const dynamic = 'force-dynamic'

/**
 * Get all gallery images (admin only, includes inactive)
 * GET /api/admin/gallery?page=1&limit=20
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

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    const supabase = createServerClient()

    // Get total count
    const { count } = await supabase
      .from('media_items')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'image')

    // Get images with pagination
    const { data: images, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('type', 'image')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch images' },
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

/**
 * Update gallery image
 * PUT /api/admin/gallery
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await checkAuth(request)
    if (!authResult.isAuthenticated || !authResult.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, title, description, display_order, active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (display_order !== undefined) updateData.display_order = display_order
    if (active !== undefined) updateData.active = active

    const { data, error } = await supabase
      .from('media_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update image' },
        { status: 500 }
      )
    }

    // The database trigger will automatically sync carousel images
    // But we can also manually sync here for immediate update
    if (data) {
      // Sync carousel images that reference this gallery item
      await supabase
        .from('carousel_images')
        .update({
          url: data.url,
          title: data.title || null,
          description: data.description || null,
          updated_at: new Date().toISOString(),
        })
        .eq('gallery_item_id', id)
    }

    return NextResponse.json({
      success: true,
      mediaItem: data,
    })
  } catch (error) {
    console.error('Error updating gallery image:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    )
  }
}
