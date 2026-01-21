import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Import Instagram post from URL using oEmbed API
 * POST /api/admin/instagram/import
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Extract post ID from URL
    const match = url.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/)
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid Instagram URL format' },
        { status: 400 }
      )
    }

    const postId = match[1]

    // Fetch post data using Instagram oEmbed API (no auth required for public posts)
    // Note: Instagram's oEmbed API sometimes blocks requests or requires specific conditions
    const oembedUrl = `https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${postId}/&omitscript=true`
    
    // Add headers to mimic browser request
    const response = await fetch(oembedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
      },
      // Don't follow redirects automatically
      redirect: 'follow',
    })

    // Check content type to ensure we got JSON, not HTML
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Instagram oEmbed API returned non-JSON:', {
        status: response.status,
        contentType,
        preview: text.substring(0, 200),
        url: oembedUrl
      })
      
      return NextResponse.json(
        { 
          error: 'Instagram API returned an error. The post may be private, deleted, or Instagram is blocking the request. Try using the manual "Add Post" button instead.' 
        },
        { status: 400 }
      )
    }

    if (!response.ok) {
      let errorData = {}
      try {
        errorData = await response.json()
      } catch (e) {
        // If response is not JSON, try to get text
        const text = await response.text()
        console.error('Instagram oEmbed API error (non-JSON):', text.substring(0, 200))
      }
      
      let errorMessage = 'Failed to fetch post from Instagram'
      
      if (response.status === 404) {
        errorMessage = 'Post not found. The post may be private, deleted, or the URL is incorrect.'
      } else if (response.status === 403) {
        errorMessage = 'Access denied. The post may be private or restricted.'
      } else if (errorData.error) {
        errorMessage = errorData.error
      } else if (errorData.error_message) {
        errorMessage = errorData.error_message
      }
      
      console.error('Instagram oEmbed API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: oembedUrl
      })
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    let oembedData
    try {
      oembedData = await response.json()
    } catch (e) {
      console.error('Failed to parse Instagram oEmbed response as JSON:', e)
      return NextResponse.json(
        { error: 'Invalid response from Instagram. The post may not be accessible.' },
        { status: 400 }
      )
    }
    
    if (!oembedData.thumbnail_url) {
      return NextResponse.json(
        { error: 'Post data incomplete. The post may not be accessible.' },
        { status: 400 }
      )
    }

    // Extract data from oEmbed response
    const postData = {
      instagram_post_id: postId,
      media_url: oembedData.thumbnail_url || '',
      media_type: 'IMAGE' as const,
      permalink: `https://www.instagram.com/p/${postId}/`,
      caption: oembedData.title || null,
      timestamp: new Date().toISOString(), // oEmbed doesn't provide timestamp
      username: oembedData.author_name?.replace('@', '') || null,
      thumbnail_url: oembedData.thumbnail_url || null,
      active: true,
      display_order: 0,
    }

    // Save to database
    const supabase = createServerClient()
    
    // Check if post already exists
    const { data: existing, error: checkError } = await supabase
      .from('instagram_posts')
      .select('id')
      .eq('instagram_post_id', postId)
      .maybeSingle() // Use maybeSingle instead of single to avoid error if not found
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing post:', checkError)
      throw checkError
    }

    let result
    if (existing && existing.id) {
      // Update existing post
      const { data, error } = await supabase
        .from('instagram_posts')
        .update(postData)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating post:', error)
        throw error
      }
      result = data
    } else {
      // Insert new post
      const { data, error } = await supabase
        .from('instagram_posts')
        .insert(postData)
        .select()
        .single()

      if (error) {
        console.error('Error inserting post:', error)
        // Check for duplicate key error
        if (error.code === '23505' || error.message.includes('duplicate')) {
          // Try to fetch the existing post
          const { data: existingPost } = await supabase
            .from('instagram_posts')
            .select('*')
            .eq('instagram_post_id', postId)
            .single()
          
          if (existingPost) {
            return NextResponse.json({
              success: true,
              post: existingPost,
              message: 'Post already exists and was not updated',
            })
          }
        }
        throw error
      }
      result = data
    }

    return NextResponse.json({
      success: true,
      post: result,
    })
  } catch (error) {
    console.error('Error importing Instagram post:', error)
    
    let errorMessage = 'Failed to import Instagram post'
    if (error instanceof Error) {
      errorMessage = error.message
      // Check for specific database errors
      if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
        errorMessage = 'This post already exists in the database'
      } else if (error.message.includes('permission denied') || error.message.includes('RLS')) {
        errorMessage = 'Permission denied. Please make sure you are logged in as admin.'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
