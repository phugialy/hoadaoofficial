import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * POST /api/admin/create-admin-user
 * Creates the initial admin user
 * This should only be called once during setup
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Use admin API to create user
    // Note: This requires service role key to work
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'bigpstudio@gmail.com',
      password: 'hoadaoliondance.com',
      email_confirm: true, // Skip email confirmation for initial admin
      user_metadata: {
        is_admin: true,
      },
    })

    if (error) {
      // If user already exists, try to update metadata
      if (error.message.includes('already registered')) {
        // Get existing user and update metadata
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users?.users.find((u) => u.email === 'bigpstudio@gmail.com')

        if (existingUser) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            user_metadata: {
              is_admin: true,
            },
          })

          if (updateError) throw updateError

          return NextResponse.json({
            success: true,
            message: 'Admin user already exists. Updated metadata with is_admin flag.',
            user: existingUser,
          })
        }
      }

      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: data.user,
    })
  } catch (error) {
    console.error('Create admin user error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create admin user',
      },
      { status: 500 }
    )
  }
}

