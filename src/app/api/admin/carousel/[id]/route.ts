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
    if (body.url !== undefined) updateData.url = body.url
    if (body.alt !== undefined) updateData.alt = body.alt
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.display_order !== undefined) updateData.display_order = body.display_order
    if (body.active !== undefined) updateData.active = body.active

    const { data, error } = await supabase
      .from('carousel_images')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ image: data })
  } catch (error) {
    console.error('Error updating carousel image:', error)
    return NextResponse.json(
      { error: 'Failed to update carousel image' },
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
      .from('carousel_images')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting carousel image:', error)
    return NextResponse.json(
      { error: 'Failed to delete carousel image' },
      { status: 500 }
    )
  }
}
