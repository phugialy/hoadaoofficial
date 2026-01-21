import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Store Instagram connection credentials
 * POST /api/admin/instagram/connect
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { instagram_business_account_id, access_token, token_expires_at, username } = body

    if (!instagram_business_account_id || !access_token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if connection already exists
    const { data: existing } = await supabase
      .from('instagram_connection')
      .select('id')
      .single()

    let result
    if (existing) {
      // Update existing connection
      const { data, error } = await supabase
        .from('instagram_connection')
        .update({
          instagram_business_account_id,
          access_token,
          token_expires_at: token_expires_at || null,
          username: username || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create new connection
      const { data, error } = await supabase
        .from('instagram_connection')
        .insert({
          instagram_business_account_id,
          access_token,
          token_expires_at: token_expires_at || null,
          username: username || null,
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({ 
      success: true,
      connection: {
        id: result.id,
        username: result.username,
        instagram_business_account_id: result.instagram_business_account_id,
        sync_enabled: result.sync_enabled,
      }
    })
  } catch (error) {
    console.error('Error saving Instagram connection:', error)
    return NextResponse.json(
      { error: 'Failed to save Instagram connection' },
      { status: 500 }
    )
  }
}

/**
 * Get Instagram connection status
 * GET /api/admin/instagram/connect
 */
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('instagram_connection')
      .select('id, instagram_business_account_id, username, last_synced_at, sync_enabled, token_expires_at')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return NextResponse.json({ 
      connected: !!data,
      connection: data || null,
    })
  } catch (error) {
    console.error('Error fetching Instagram connection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram connection', connected: false },
      { status: 500 }
    )
  }
}

/**
 * Delete Instagram connection
 * DELETE /api/admin/instagram/connect
 */
export async function DELETE() {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from('instagram_connection')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting Instagram connection:', error)
    return NextResponse.json(
      { error: 'Failed to delete Instagram connection' },
      { status: 500 }
    )
  }
}
