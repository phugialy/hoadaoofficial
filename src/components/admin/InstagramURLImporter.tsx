'use client'

import { useState } from 'react'

interface ImportResult {
  success: boolean
  message: string
  post?: {
    instagram_post_id: string
    media_url: string
    permalink: string
    caption?: string
    timestamp: string
  }
}

export default function InstagramURLImporter() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      if (!url || !url.includes('instagram.com')) {
        throw new Error('Please enter a valid Instagram URL')
      }

      // Import via server-side API route (Instagram blocks client-side requests due to CORS)
      const response = await fetch('/api/admin/instagram/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import post')
      }

      setResult({
        success: true,
        message: 'Post imported successfully!',
        post: data.post,
      })
      setUrl('')
      
      // Refresh the page after a moment to show the new post
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import post'
      setError(errorMessage)
      setResult({
        success: false,
        message: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Import Instagram Post from URL</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <strong>✨ Easy Import:</strong> Just paste an Instagram post URL and we'll import it automatically!
        </p>
        <p className="text-xs text-blue-700">
          Works with public Instagram posts. No API connection needed.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-semibold mb-1">❌ Error:</p>
          <p>{error}</p>
          <p className="text-xs mt-2 text-red-700">
            <strong>Common issues:</strong>
            <br />• Post may be private (must be public)
            <br />• URL format may be incorrect
            <br />• Instagram may be blocking the request
            <br />• Post may have been deleted
            <br />
            <br /><strong>💡 Solution:</strong> If automatic import doesn't work, use the <strong>"+ Add Post"</strong> button below to manually add posts with all details.
          </p>
        </div>
      )}

      {result?.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✅ {result.message}
        </div>
      )}

      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instagram Post URL
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/ABC123XYZ/"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste any Instagram post URL (must be public)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !url}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing...' : '📥 Import Post'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> You can import multiple posts by copying URLs from your Instagram profile and importing them one by one.
        </p>
      </div>
    </div>
  )
}
