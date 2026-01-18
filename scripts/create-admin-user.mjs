/**
 * Script to create admin user using Supabase Admin API
 * Run with: node scripts/create-admin-user.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Simple .env.local parser (without requiring dotenv package)
function loadEnvLocal() {
  try {
    const envPath = join(__dirname, '..', '.env.local')
    const envFile = readFileSync(envPath, 'utf-8')
    const envVars = {}
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          envVars[key.trim()] = value.trim()
        }
      }
    })
    
    Object.assign(process.env, envVars)
  } catch (error) {
    console.warn('Could not load .env.local, using process.env:', error.message)
  }
}

loadEnvLocal()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    console.log('- Email: bigpstudio@gmail.com')
    console.log('- Password: hoadaoliondance.com')

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
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log('User already exists. Updating metadata...')

        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users?.users.find((u) => u.email === 'bigpstudio@gmail.com')

        if (existingUser) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            user_metadata: {
              ...existingUser.user_metadata,
              is_admin: true,
            },
          })

          if (updateError) throw updateError

          console.log('✅ Admin user metadata updated successfully!')
          console.log('User ID:', existingUser.id)
          console.log('Email:', existingUser.email)
          console.log('Metadata:', existingUser.user_metadata)
          return
        }
      }

      throw error
    }

    console.log('✅ Admin user created successfully!')
    console.log('User ID:', data.user.id)
    console.log('Email:', data.user.email)
    console.log('Metadata:', data.user.user_metadata)
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    if (error.details) {
      console.error('Details:', error.details)
    }
    process.exit(1)
  }
}

createAdminUser()

