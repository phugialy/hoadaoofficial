/**
 * Mailtrap.io Email API Service
 * For sending transactional emails via Mailtrap Email API
 */

const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN || '5d62b8d34572f8b966abe4734f8aa6df'
const MAILTRAP_API_URL = 'https://send.api.mailtrap.io/api/send'

export interface MailtrapEmailOptions {
  from: {
    email: string
    name?: string
  }
  to: Array<{ email: string; name?: string }>
  subject: string
  text?: string
  html?: string
  category?: string
}

export interface MailtrapResponse {
  success: boolean
  message_ids?: string[]
  errors?: string[]
}

/**
 * Send email via Mailtrap Email API
 */
export async function sendMailtrapEmail(options: MailtrapEmailOptions): Promise<MailtrapResponse> {
  try {
    const response = await fetch(MAILTRAP_API_URL, {
      method: 'POST',
      headers: {
        'Api-Token': MAILTRAP_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        errors: Array.isArray(data.errors) ? data.errors : [data.message || 'Unknown error'],
      }
    }

    return {
      success: true,
      message_ids: data.message_ids || [],
    }
  } catch (error) {
    console.error('Mailtrap API error:', error)
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Failed to send email'],
    }
  }
}

/**
 * Send test email
 */
export async function sendTestEmail(to: string = 'bigpstudio@gmail.com'): Promise<MailtrapResponse> {
  return sendMailtrapEmail({
    from: {
      email: 'hello@hoadaoliondance.com',
      name: 'HoadaoOfficial',
    },
    to: [{ email: to }],
    subject: 'Test Email from HoadaoOfficial',
    text: 'This is a test email from HoadaoOfficial platform.',
    html: '<p>This is a test email from <strong>HoadaoOfficial</strong> platform.</p>',
    category: 'Test',
  })
}

