import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Instagram Post type matching the component
export interface InstagramPost {
  id: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  caption?: string
  timestamp: string
  username?: string
  thumbnail_url?: string
}

/**
 * Instagram Posts API Route
 * 
 * This endpoint fetches Instagram posts. You can configure it to use:
 * 1. Instagram Basic Display API (requires OAuth setup)
 * 2. Instagram Graph API (requires Facebook App setup)
 * 3. Manual posts stored in Supabase
 * 
 * For now, this returns mock data. To set up real Instagram integration:
 * 
 * Option 1: Instagram Basic Display API
 * - Create an Instagram App at https://developers.facebook.com/
 * - Set up OAuth flow
 * - Use access token to fetch posts
 * 
 * Option 2: Instagram Graph API
 * - Create a Facebook App
 * - Connect Instagram Business Account
 * - Use Graph API to fetch posts
 * 
 * Option 3: Manual Posts (Recommended for quick setup)
 * - Store posts in Supabase media_gallery table
 * - Filter by a specific tag or category
 * - Return formatted data
 */

export async function GET() {
  try {
    // Fetch from Supabase instagram_posts table
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('timestamp', { ascending: false })
      .limit(12)

    if (error) {
      console.error('Error fetching Instagram posts from database:', error)
      // Fallback: return empty array
      return NextResponse.json({ posts: [] })
    }

    // Transform to match InstagramPost interface
    const posts: InstagramPost[] = (data || []).map((item) => ({
      id: item.id,
      media_url: item.media_url,
      media_type: item.media_type,
      permalink: item.permalink,
      caption: item.caption || undefined,
      timestamp: item.timestamp,
      username: item.username || undefined,
      thumbnail_url: item.thumbnail_url || undefined,
    }))

    return NextResponse.json({ posts })

    // Alternative: Use Instagram Basic Display API (if configured)
    // const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    // if (accessToken && posts.length === 0) {
    //   const response = await fetch(
    //     `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
    //   )
    //   const apiData = await response.json()
    //   return NextResponse.json({ posts: apiData.data || [] })
    // }

  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json(
      { 
        posts: [],
        error: 'Failed to fetch Instagram posts' 
      },
      { status: 500 }
    )
  }
}
