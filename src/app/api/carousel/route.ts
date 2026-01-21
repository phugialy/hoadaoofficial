import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Public API endpoint to fetch active carousel images
 * Used by the homepage carousel component
 */
export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Fetch carousel images and join with gallery to get latest data
    const { data, error } = await supabase
      .from('carousel_images')
      .select(`
        *,
        gallery_item:media_items!carousel_images_gallery_item_id_fkey (
          url,
          title,
          description,
          updated_at
        )
      `)
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching carousel images:', error)
      // Return empty array instead of error for graceful fallback
      return NextResponse.json({ images: [] })
    }

    // Sync data: if gallery_item exists, use gallery data (always latest)
    const images = (data || []).map((item: any) => {
      const galleryItem = item.gallery_item
      
      // If carousel image references a gallery item, use gallery data
      if (galleryItem && item.gallery_item_id) {
        return {
          id: item.id,
          url: galleryItem.url || item.url,
          alt: item.alt || galleryItem.title || item.title || undefined,
          title: galleryItem.title || item.title || undefined,
          description: galleryItem.description || item.description || undefined,
        }
      }
      
      return {
        id: item.id,
        url: item.url,
        alt: item.alt || item.title || undefined,
        title: item.title || undefined,
        description: item.description || undefined,
      }
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching carousel images:', error)
    // Return empty array for graceful fallback to default images
    return NextResponse.json({ images: [] })
  }
}
