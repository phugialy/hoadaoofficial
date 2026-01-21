import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {}
    if (body.instagram_post_id !== undefined) updateData.instagram_post_id = body.instagram_post_id
    if (body.media_url !== undefined) updateData.media_url = body.media_url
    if (body.media_type !== undefined) updateData.media_type = body.media_type
    if (body.permalink !== undefined) updateData.permalink = body.permalink
    if (body.caption !== undefined) updateData.caption = body.caption
    if (body.timestamp !== undefined) updateData.timestamp = body.timestamp
    if (body.username !== undefined) updateData.username = body.username
    if (body.thumbnail_url !== undefined) updateData.thumbnail_url = body.thumbnail_url
    if (body.display_order !== undefined) updateData.display_order = body.display_order
    if (body.active !== undefined) updateData.active = body.active

    const { data, error } = await supabase
      .from('instagram_posts')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Error updating Instagram post:', error)
    return NextResponse.json(
      { error: 'Failed to update Instagram post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from('instagram_posts')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting Instagram post:', error)
    return NextResponse.json(
      { error: 'Failed to delete Instagram post' },
      { status: 500 }
    )
  }
}
