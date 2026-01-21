import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Sync Instagram posts from Instagram Graph API to database
 * POST /api/admin/instagram/sync
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get Instagram connection
    const { data: connection, error: connError } = await supabase
      .from('instagram_connection')
      .select('*')
      .eq('sync_enabled', true)
      .single()

    if (connError || !connection) {
      return NextResponse.json(
        { error: 'Instagram not connected. Please connect your account first.' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (connection.token_expires_at && new Date(connection.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Instagram access token has expired. Please reconnect your account.' },
        { status: 401 }
      )
    }

    // Fetch posts from Instagram Graph API
    const instagramApiUrl = `https://graph.instagram.com/${connection.instagram_business_account_id}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${connection.access_token}&limit=25`

    const response = await fetch(instagramApiUrl)
    const apiData = await response.json()

    if (!response.ok || apiData.error) {
      console.error('Instagram API error:', apiData.error)
      return NextResponse.json(
        { error: apiData.error?.message || 'Failed to fetch from Instagram API' },
        { status: response.status }
      )
    }

    const posts = apiData.data || []
    let syncedCount = 0
    let updatedCount = 0
    let errorCount = 0

    // Sync each post to database
    for (const post of posts) {
      try {
        // Check if post already exists
        const { data: existing } = await supabase
          .from('instagram_posts')
          .select('id')
          .eq('instagram_post_id', post.id)
          .single()

        const postData = {
          instagram_post_id: post.id,
          media_url: post.media_url,
          media_type: post.media_type || 'IMAGE',
          permalink: post.permalink,
          caption: post.caption || null,
          timestamp: post.timestamp,
          username: post.username || connection.username || null,
          thumbnail_url: post.thumbnail_url || null,
          active: true,
          display_order: 0,
        }

        if (existing) {
          // Update existing post
          const { error: updateError } = await supabase
            .from('instagram_posts')
            .update(postData)
            .eq('id', existing.id)

          if (updateError) throw updateError
          updatedCount++
        } else {
          // Insert new post
          const { error: insertError } = await supabase
            .from('instagram_posts')
            .insert(postData)

          if (insertError) throw insertError
          syncedCount++
        }
      } catch (err) {
        console.error(`Error syncing post ${post.id}:`, err)
        errorCount++
      }
    }

    // Update last_synced_at
    await supabase
      .from('instagram_connection')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', connection.id)

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      updated: updatedCount,
      errors: errorCount,
      total: posts.length,
    })
  } catch (error) {
    console.error('Error syncing Instagram posts:', error)
    return NextResponse.json(
      { error: 'Failed to sync Instagram posts' },
      { status: 500 }
    )
  }
}
