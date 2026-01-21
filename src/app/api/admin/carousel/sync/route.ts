import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth/serverAuth'

/**
 * Sync carousel images with their referenced gallery items
 * POST /api/admin/carousel/sync
 * Optional: ?gallery_item_id=xxx to sync specific gallery item
 */
export async function POST(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams
    const galleryItemId = searchParams.get('gallery_item_id')

    if (galleryItemId) {
      // Sync specific gallery item
      const { data: galleryItem } = await supabase
        .from('media_items')
        .select('id, url, title, description')
        .eq('id', galleryItemId)
        .single()

      if (!galleryItem) {
        return NextResponse.json(
          { error: 'Gallery item not found' },
          { status: 404 }
        )
      }

      // Update all carousel images referencing this gallery item
      const { data, error } = await supabase
        .from('carousel_images')
        .update({
          url: galleryItem.url,
          title: galleryItem.title || null,
          description: galleryItem.description || null,
          updated_at: new Date().toISOString(),
        })
        .eq('gallery_item_id', galleryItemId)
        .select()

      if (error) throw error

      return NextResponse.json({
        success: true,
        synced: data?.length || 0,
        message: `Synced ${data?.length || 0} carousel image(s)`,
      })
    } else {
      // Sync all carousel images with their gallery references
      const { data: carouselImages, error: fetchError } = await supabase
        .from('carousel_images')
        .select('id, gallery_item_id')
        .not('gallery_item_id', 'is', null)

      if (fetchError) throw fetchError

      let syncedCount = 0
      const errors: string[] = []

      for (const carouselImage of carouselImages || []) {
        if (!carouselImage.gallery_item_id) continue

        const { data: galleryItem } = await supabase
          .from('media_items')
          .select('url, title, description')
          .eq('id', carouselImage.gallery_item_id)
          .single()

        if (galleryItem) {
          const { error: updateError } = await supabase
            .from('carousel_images')
            .update({
              url: galleryItem.url,
              title: galleryItem.title || null,
              description: galleryItem.description || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', carouselImage.id)

          if (updateError) {
            errors.push(`Failed to sync carousel image ${carouselImage.id}`)
          } else {
            syncedCount++
          }
        }
      }

      return NextResponse.json({
        success: true,
        synced: syncedCount,
        total: carouselImages?.length || 0,
        errors: errors.length > 0 ? errors : undefined,
        message: `Synced ${syncedCount} of ${carouselImages?.length || 0} carousel image(s)`,
      })
    }
  } catch (error) {
    console.error('Error syncing carousel images:', error)
    return NextResponse.json(
      { error: 'Failed to sync carousel images' },
      { status: 500 }
    )
  }
}
