'use client'

import { useState, useEffect } from 'react'
import { authenticatedFetch } from '@/lib/utils/apiClient'

interface AboutContent {
  id: string
  mission: string | null
  vision: string | null
  active: boolean
}

export default function AboutContentManager() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch('/api/admin/about')
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.')
        }
        throw new Error('Failed to fetch content')
      }
      const data = await response.json()
      setContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      const response = await authenticatedFetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mission: formData.get('mission') as string || null,
          vision: formData.get('vision') as string || null,
          active: formData.get('active') === 'on',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save content')
      }

      const data = await response.json()
      setContent(data.content)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">About Content</h2>
        <p className="text-gray-600">
          Manage your organization's mission and vision statements displayed on the homepage.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Content saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Mission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission *
            </label>
            <textarea
              name="mission"
              defaultValue={content?.mission || ''}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Enter your organization's mission statement..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Describe your organization's purpose and goals
            </p>
          </div>

          {/* Vision */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision *
            </label>
            <textarea
              name="vision"
              defaultValue={content?.vision || ''}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Enter your organization's vision statement..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Describe your organization's long-term aspirations
            </p>
          </div>

          {/* Active Toggle */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                defaultChecked={content?.active !== false}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (visible on homepage)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Content'}
            </button>
            <button
              type="button"
              onClick={fetchContent}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Preview */}
      {content && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Mission:</h4>
              <p className="text-gray-600">{content.mission || 'Not set'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Vision:</h4>
              <p className="text-gray-600">{content.vision || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
