import { NextRequest, NextResponse } from 'next/server'
import { sendTestEmail } from '@/lib/services/mailtrapService'

/**
 * POST /api/test/mailtrap
 * Send a test email via Mailtrap Email API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const toEmail = body.to || 'bigpstudio@gmail.com'

    const result = await sendTestEmail(toEmail)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        message_ids: result.message_ids,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          errors: result.errors,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test email',
      },
      { status: 500 }
    )
  }
}

