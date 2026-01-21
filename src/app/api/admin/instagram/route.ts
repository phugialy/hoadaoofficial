import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .order('display_order', { ascending: true })
      .order('timestamp', { ascending: false })

    if (error) throw error

    return NextResponse.json({ posts: data || [] })
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('instagram_posts')
      .insert({
        instagram_post_id: body.instagram_post_id,
        media_url: body.media_url,
        media_type: body.media_type || 'IMAGE',
        permalink: body.permalink,
        caption: body.caption || null,
        timestamp: body.timestamp,
        username: body.username || null,
        thumbnail_url: body.thumbnail_url || null,
        display_order: body.display_order || 0,
        active: body.active !== false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Error creating Instagram post:', error)
    return NextResponse.json(
      { error: 'Failed to create Instagram post' },
      { status: 500 }
    )
  }
}
