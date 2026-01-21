'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface InstagramPost {
  id: string
  instagram_post_id: string
  media_url: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  caption?: string
  timestamp: string
  username?: string
  thumbnail_url?: string
  active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export default function InstagramPostManager() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<InstagramPost | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/instagram')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      instagram_post_id: formData.get('instagram_post_id') as string,
      media_url: formData.get('media_url') as string,
      media_type: formData.get('media_type') as string,
      permalink: formData.get('permalink') as string,
      caption: formData.get('caption') as string,
      timestamp: formData.get('timestamp') as string,
      username: formData.get('username') as string,
      thumbnail_url: formData.get('thumbnail_url') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      active: formData.get('active') === 'on',
    }

    try {
      const url = editing ? `/api/admin/instagram/${editing.id}` : '/api/admin/instagram'
      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save post')
      
      setShowForm(false)
      setEditing(null)
      fetchPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/instagram/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')
      fetchPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/instagram/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })

      if (!response.ok) throw new Error('Failed to update post')
      fetchPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Instagram Posts</h2>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          + Add Post
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">
            {editing ? 'Edit Post' : 'Add New Instagram Post'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Post ID *
                </label>
                <input
                  type="text"
                  name="instagram_post_id"
                  required
                  defaultValue={editing?.instagram_post_id || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., ABC123XYZ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Type *
                </label>
                <select
                  name="media_type"
                  required
                  defaultValue={editing?.media_type || 'IMAGE'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="CAROUSEL_ALBUM">Carousel Album</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media URL *
                </label>
                <input
                  type="url"
                  name="media_url"
                  required
                  defaultValue={editing?.media_url || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permalink *
                </label>
                <input
                  type="url"
                  name="permalink"
                  required
                  defaultValue={editing?.permalink || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://instagram.com/p/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editing?.username || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timestamp *
                </label>
                <input
                  type="datetime-local"
                  name="timestamp"
                  required
                  defaultValue={
                    editing?.timestamp
                      ? new Date(editing.timestamp).toISOString().slice(0, 16)
                      : ''
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  name="thumbnail_url"
                  defaultValue={editing?.thumbnail_url || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  defaultValue={editing?.display_order || 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <textarea
                  name="caption"
                  defaultValue={editing?.caption || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editing?.active !== false}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible on homepage)</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-lg"
              >
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditing(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts
          .sort((a, b) => {
            // Sort by display_order first, then by timestamp
            if (a.display_order !== b.display_order) {
              return a.display_order - b.display_order
            }
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          })
          .map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                !post.active ? 'opacity-50' : ''
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={post.media_url || post.thumbnail_url || '/placeholder.jpg'}
                  alt={post.caption || 'Instagram post'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {post.media_type !== 'IMAGE' && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full">
                    {post.media_type === 'VIDEO' ? '▶' : '📷'}
                  </div>
                )}
              </div>
              <div className="p-3">
                {post.caption && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {post.caption}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      post.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {post.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.timestamp)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditing(post)
                      setShowForm(true)
                    }}
                    className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(post.id, post.active)}
                    className="flex-1 px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                  >
                    {post.active ? 'Off' : 'On'}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">No Instagram posts yet. Add your first post!</p>
        </div>
      )}
    </div>
  )
}
