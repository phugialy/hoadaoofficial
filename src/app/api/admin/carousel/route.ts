import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
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
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error

    // Sync data: if gallery_item exists and is newer, use gallery data
    const syncedImages = (data || []).map((item: any) => {
      const galleryItem = item.gallery_item
      
      // If carousel image references a gallery item, use gallery data
      if (galleryItem && item.gallery_item_id) {
        return {
          ...item,
          url: galleryItem.url || item.url,
          title: galleryItem.title || item.title,
          description: galleryItem.description || item.description,
          gallery_item_id: item.gallery_item_id,
        }
      }
      
      return {
        ...item,
        gallery_item_id: item.gallery_item_id || null,
      }
    })

    return NextResponse.json({ images: syncedImages })
  } catch (error) {
    console.error('Error fetching carousel images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch carousel images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    // If gallery_item_id is provided, fetch latest data from gallery
    let url = body.url
    let title = body.title || null
    let description = body.description || null
    
    if (body.gallery_item_id) {
      const { data: galleryItem } = await supabase
        .from('media_items')
        .select('url, title, description')
        .eq('id', body.gallery_item_id)
        .single()
      
      if (galleryItem) {
        url = galleryItem.url
        title = galleryItem.title || title
        description = galleryItem.description || description
      }
    }

    // Create carousel image
    const { data, error } = await supabase
      .from('carousel_images')
      .insert({
        url: url,
        alt: body.alt || null,
        title: title,
        description: description,
        display_order: body.display_order || 0,
        active: body.active !== false,
        gallery_item_id: body.gallery_item_id || null, // Store reference to gallery item
      })
      .select()
      .single()

    if (error) throw error

    // If add_to_gallery is true, also add to gallery
    // Also check if URL is from gallery (already in gallery)
    if (body.add_to_gallery === true && body.url) {
      // Check if image already exists in gallery by URL
      const { data: existing } = await supabase
        .from('media_items')
        .select('id')
        .eq('url', body.url)
        .maybeSingle()

      if (!existing) {
        // Extract storage_path from URL if it's a Supabase storage URL
        let storage_path = body.url
        const urlMatch = body.url.match(/gallery\/([^?#]+)/)
        if (urlMatch) {
          storage_path = `gallery/${urlMatch[1]}`
        } else {
          // For external URLs, use the URL as storage_path
          storage_path = body.url
        }

        // Add to gallery
        await supabase
          .from('media_items')
          .insert({
            type: 'image',
            storage_path: storage_path,
            url: body.url,
            title: body.title || null,
            description: body.description || null,
            display_order: body.display_order || 0,
            active: true,
          })
      }
    }
    
    // If selecting from gallery (mode === 'gallery'), ensure it's marked as synced
    // This helps track which carousel images are from gallery

    return NextResponse.json({ image: data })
  } catch (error) {
    console.error('Error creating carousel image:', error)
    return NextResponse.json(
      { error: 'Failed to create carousel image' },
      { status: 500 }
    )
  }
}
