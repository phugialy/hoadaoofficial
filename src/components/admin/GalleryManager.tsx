'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { authenticatedFetch } from '@/lib/utils/apiClient'

interface GalleryImage {
  id: string
  type: 'image' | 'video'
  storage_path: string
  url: string
  thumbnail_url: string | null
  title: string | null
  description: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

type SortOption = 'display_order' | 'created_at' | 'title' | 'active'
type SortDirection = 'asc' | 'desc'

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<GalleryImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadQueue, setUploadQueue] = useState<Array<{ file: File; progress: number; status: 'pending' | 'uploading' | 'success' | 'error'; error?: string }>>([])
  const [sortBy, setSortBy] = useState<SortOption>('display_order')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchImages()
  }, [pagination.page])

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      uploadFiles(files)
    }
  }

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch(`/api/admin/gallery?page=${pagination.page}&limit=${pagination.limit}`)
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.')
        }
        throw new Error('Failed to fetch images')
      }
      const data = await response.json()
      setImages(data.images || [])
      setPagination(data.pagination || pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (fileArray.length > 0) {
      uploadFiles(fileArray)
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return

    // Initialize upload queue
    const queue = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }))
    setUploadQueue(queue)
    setUploading(true)
    setError(null)

    // Get current max display order to append new images
    const maxOrder = images.length > 0 
      ? Math.max(...images.map(img => img.display_order), 0)
      : -1

    // Upload files sequentially to avoid overwhelming the server
    for (let i = 0; i < queue.length; i++) {
      const file = files[i]
      
      // Update status to uploading
      setUploadQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'uploading' } : item
      ))

      try {
        const formData = new FormData()
        formData.append('file', file)
        
        // Auto-generate title from filename (user can edit later)
        const fileName = file.name.replace(/\.[^/.]+$/, '')
        formData.append('title', fileName)
        
        // No description by default (user can add later)
        formData.append('display_order', (maxOrder + 1 + i).toString())
        formData.append('active', 'true') // Active by default

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadQueue(prev => prev.map((item, idx) => 
            idx === i ? { ...item, progress: Math.min(item.progress + 10, 90) } : item
          ))
        }, 200)

        const response = await authenticatedFetch('/api/admin/gallery/upload', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to upload image')
        }

        // Mark as success
        setUploadQueue(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'success', progress: 100 } : item
        ))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
        setUploadQueue(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'error', error: errorMessage } : item
        ))
        setError(`Failed to upload ${file.name}: ${errorMessage}`)
      }
    }

    // Refresh images after all uploads complete
    setTimeout(() => {
      fetchImages()
      
      // Clear upload queue after a delay
      setTimeout(() => {
        setUploadQueue([])
        setUploading(false)
        setUploadProgress(0)
      }, 3000)
    }, 1000)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updateData = {
      id: editing!.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      active: formData.get('active') === 'on',
    }

    try {
      const response = await authenticatedFetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) throw new Error('Failed to update image')
      
      setEditing(null)
      fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) return

    try {
      const response = await authenticatedFetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete image')
      fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image')
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await authenticatedFetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      })

      if (!response.ok) throw new Error('Failed to update image')
      fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image')
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const image = images.find(img => img.id === id)
    if (!image) return

    const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)
    const currentIndex = sortedImages.findIndex(img => img.id === id)
    
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === sortedImages.length - 1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const targetImage = sortedImages[targetIndex]

    // Swap display orders
    const newOrder = targetImage.display_order
    const oldOrder = image.display_order

    try {
      // Update both images
      await Promise.all([
        authenticatedFetch('/api/admin/gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, display_order: newOrder }),
        }),
        authenticatedFetch('/api/admin/gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: targetImage.id, display_order: oldOrder }),
        }),
      ])

      fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder images')
    }
  }

  const handleQuickOrderChange = async (id: string, newOrder: number) => {
    try {
      const response = await authenticatedFetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, display_order: newOrder }),
      })

      if (!response.ok) throw new Error('Failed to update order')
      fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  const sortedImages = [...images].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'display_order':
        comparison = a.display_order - b.display_order
        break
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '')
        break
      case 'active':
        comparison = (a.active ? 1 : 0) - (b.active ? 1 : 0)
        break
    }
    
    return sortDirection === 'asc' ? comparison : -comparison
  })

  if (loading && images.length === 0) {
    return <div className="text-center py-12">Loading gallery...</div>
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gallery Images</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {pagination.total} images | Page {pagination.page} of {pagination.totalPages}
            </p>
          </div>
        <button
          onClick={() => {
            fileInputRef.current?.click()
          }}
          disabled={uploading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : '+ Upload Images'}
        </button>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="display_order">Display Order</option>
            <option value="created_at">Date Uploaded</option>
            <option value="title">Title</option>
            <option value="active">Active Status</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-1"
          >
            {sortDirection === 'asc' ? '↑' : '↓'} {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Drag and Drop Upload Zone */}
      {!editing && (
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <svg
              className={`w-16 h-16 mb-4 ${isDragging ? 'text-red-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isDragging ? 'Drop images here' : 'Drag & drop images here'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`px-6 py-2 rounded-lg cursor-pointer transition-colors ${
                uploading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </label>
            <p className="text-xs text-gray-500 mt-3">
              Maximum 10MB per file. Supported: JPG, PNG, WebP, GIF, etc.
            </p>
          </div>

          {/* Upload Progress */}
          {uploadQueue.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Upload Progress ({uploadQueue.filter(item => item.status === 'success').length}/{uploadQueue.length} completed)
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {uploadQueue.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                        {item.file.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        item.status === 'success' ? 'bg-green-100 text-green-800' :
                        item.status === 'error' ? 'bg-red-100 text-red-800' :
                        item.status === 'uploading' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'success' ? '✓ Success' :
                         item.status === 'error' ? '✗ Error' :
                         item.status === 'uploading' ? 'Uploading...' :
                         'Pending'}
                      </span>
                    </div>
                    {(item.status === 'uploading' || item.status === 'pending') && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            item.status === 'error' ? 'bg-red-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                    {item.status === 'error' && item.error && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedImages.map((image, index) => {
          const isEditing = editing?.id === image.id
          return (
            <div key={image.id} className="col-span-full md:col-span-1">
              <div
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  !image.active ? 'opacity-50' : ''
                } ${isEditing ? 'shadow-xl ring-2 ring-blue-500' : ''}`}
              >
                <div className="relative h-48">
                  <Image
                    src={image.url}
                    alt={image.title || 'Gallery image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 truncate">
                    {image.title || 'Untitled'}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        image.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {image.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {image.display_order}
                    </span>
                  </div>

                  {/* Order Controls */}
                  {!isEditing && (
                    <div className="mt-2 flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="text-xs text-gray-600 flex-1">Quick Order:</span>
                      <button
                        onClick={() => handleReorder(image.id, 'up')}
                        disabled={sortBy !== 'display_order' || index === 0}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleReorder(image.id, 'down')}
                        disabled={sortBy !== 'display_order' || index === sortedImages.length - 1}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <input
                        type="number"
                        value={image.display_order}
                        onChange={(e) => {
                          const newOrder = parseInt(e.target.value) || 0
                          handleQuickOrderChange(image.id, newOrder)
                        }}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-center"
                        title="Change display order"
                      />
                    </div>
                  )}

                  {!isEditing && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(image)
                          // Scroll to the image card smoothly
                          setTimeout(() => {
                            const element = document.getElementById(`image-card-${image.id}`)
                            element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 100)
                        }}
                        className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(image.id, image.active)}
                        className="flex-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                      >
                        {image.active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Animated Edit Form Dropdown */}
                {isEditing && (
                  <div
                    id={`image-card-${image.id}`}
                    className="border-t border-gray-200 bg-gray-50 animate-slide-down"
                    style={{
                      animation: 'slideDown 0.3s ease-out',
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Edit Image</h3>
                        <button
                          onClick={() => setEditing(null)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Close edit form"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <form onSubmit={handleUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              defaultValue={editing.title || ''}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Image title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Display Order
                            </label>
                            <input
                              type="number"
                              name="display_order"
                              defaultValue={editing.display_order || 0}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              name="description"
                              defaultValue={editing.description || ''}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Image description"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="active"
                                defaultChecked={editing.active !== false}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">Active (visible in public gallery)</span>
                            </label>
                          </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {images.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">No images in gallery yet. Upload your first image!</p>
        </div>
      )}
    </div>
  )
}
