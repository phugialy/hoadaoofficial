'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { authenticatedFetch } from '@/lib/utils/apiClient'

interface CarouselImage {
  id: string
  url: string
  alt?: string
  title?: string
  description?: string
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

interface GalleryImage {
  id: string
  url: string
  title: string | null
  description: string | null
  storage_path: string
}

export default function CarouselImageManager() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<CarouselImage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [mode, setMode] = useState<'upload' | 'gallery'>('gallery') // 'upload' or 'gallery' - gallery is default
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<Array<{ file: File; progress: number; status: 'pending' | 'uploading' | 'success' | 'error'; error?: string }>>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchImages()
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const response = await authenticatedFetch('/api/admin/carousel/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryImages(data.images || [])
      } else if (response.status === 401) {
        setError('Unauthorized. Please log in again.')
      }
    } catch (err) {
      console.error('Failed to fetch gallery images:', err)
    }
  }

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch('/api/admin/carousel')
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.')
        }
        throw new Error('Failed to fetch images')
      }
      const data = await response.json()
      setImages(data.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate gallery selection if in gallery mode
    if (!editing && mode === 'gallery' && !selectedGalleryImage) {
      setError('Please select an image from the gallery')
      return
    }

    const formData = new FormData(e.currentTarget)
    
    let url: string
    let title: string = ''
    let description: string = ''

    if (!editing && mode === 'gallery' && selectedGalleryImage) {
      // Use selected gallery image
      const galleryImage = galleryImages.find(img => img.id === selectedGalleryImage)
      if (!galleryImage) {
        setError('Selected gallery image not found')
        return
      }
      url = galleryImage.url
      title = galleryImage.title || ''
      description = galleryImage.description || ''
    } else {
      // This shouldn't happen - upload mode is handled separately
      setError('Invalid mode')
      return
    }

    const data = {
      url,
      alt: formData.get('alt') as string || title,
      title: title || formData.get('title') as string,
      description: description || formData.get('description') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      active: formData.get('active') === 'on',
      gallery_item_id: mode === 'gallery' && selectedGalleryImage ? selectedGalleryImage : null, // Store reference to gallery item for sync
    }

    try {
      const apiUrl = editing ? `/api/admin/carousel/${editing.id}` : '/api/admin/carousel'
      const method = editing ? 'PUT' : 'POST'

      const response = await authenticatedFetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to save image')
      
      setShowForm(false)
      setEditing(null)
      setMode('url')
      setSelectedGalleryImage(null)
      fetchImages()
      // Refresh gallery list to show sync status
      fetchGalleryImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save image')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await authenticatedFetch(`/api/admin/carousel/${id}`, {
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
      const response = await authenticatedFetch(`/api/admin/carousel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
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
      // Update both images using the individual image route
      await Promise.all([
        authenticatedFetch(`/api/admin/carousel/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newOrder }),
        }),
        authenticatedFetch(`/api/admin/carousel/${targetImage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: oldOrder }),
        }),
      ])

      fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder images')
    }
  }

  const handleQuickOrderChange = async (id: string, newOrder: number) => {
    try {
      const response = await authenticatedFetch(`/api/admin/carousel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newOrder }),
      })

      if (!response.ok) throw new Error('Failed to update order')
      fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    }
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
        <h2 className="text-2xl font-bold text-gray-800">Carousel Images</h2>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const response = await authenticatedFetch('/api/admin/carousel/sync', {
                  method: 'POST',
                })
                if (response.ok) {
                  const data = await response.json()
                  alert(`✅ ${data.message}`)
                  fetchImages() // Refresh to show updated data
                } else {
                  alert('Failed to sync carousel images')
                }
              } catch (err) {
                console.error('Sync error:', err)
                alert('Failed to sync carousel images')
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            title="Sync carousel images with their gallery references"
          >
            🔄 Sync from Gallery
          </button>
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            + Add Image
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">
            {editing ? 'Edit Image' : 'Add New Image'}
          </h3>
          
          {!editing && (
            <div className="mb-4 flex gap-2 border-b pb-4">
              <button
                type="button"
                onClick={() => {
                  setMode('gallery')
                  fetchGalleryImages()
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'gallery'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Select from Gallery
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('upload')
                  setSelectedGalleryImage(null)
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'upload'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Upload Images
              </button>
            </div>
          )}

          {/* Upload Mode - Drag and Drop */}
          {mode === 'upload' && !editing && (
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
                  id="carousel-file-upload"
                />
                <label
                  htmlFor="carousel-file-upload"
                  className={`px-6 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Choose Files'}
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  Maximum 10MB per file. Images will be added to gallery and carousel automatically.
                </p>
              </div>

              {/* Upload Progress */}
              {uploadQueue.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Upload Progress ({uploadQueue.filter(item => item.status === 'success').length}/{uploadQueue.length} completed)
                  </p>
                  {uploadQueue.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 py-1">
                      {item.status === 'pending' && <span className="text-gray-500">⚪</span>}
                      {item.status === 'uploading' && <span className="text-blue-500">🔵</span>}
                      {item.status === 'success' && <span className="text-green-500">✅</span>}
                      {item.status === 'error' && <span className="text-red-500">❌</span>}
                      <span className="text-sm text-gray-800 flex-1 truncate">{item.file.name}</span>
                      {item.status === 'uploading' && (
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                      {item.status === 'error' && (
                        <span className="text-xs text-red-500 ml-2">{item.error}</span>
                      )}
                      {(item.status === 'pending' || item.status === 'uploading') && (
                        <span className="text-xs text-gray-500 ml-2">{item.progress}%</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'gallery' && !editing && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Gallery Image *
                  </label>
                  <Link 
                    href="/admin/gallery" 
                    target="_blank"
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Manage Gallery
                  </Link>
                </div>
                {galleryImages.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-lg text-center border border-gray-200">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 mb-2">No images in gallery yet</p>
                    <Link href="/admin/gallery" className="text-red-600 hover:underline font-medium">
                      Upload images to gallery →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-xs text-gray-500">
                      {galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} available • Click to select
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-3 border border-gray-300 rounded-lg bg-gray-50">
                      {galleryImages.map((img) => {
                        const isSelected = selectedGalleryImage === img.id
                        return (
                          <div
                            key={img.id}
                            onClick={() => setSelectedGalleryImage(img.id)}
                            className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all transform ${
                              isSelected
                                ? 'border-red-600 ring-2 ring-red-300 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                            }`}
                          >
                            <Image
                              src={img.url}
                              alt={img.title || 'Gallery image'}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            {/* Overlay with title */}
                            {img.title && (
                              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity ${
                                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              }`}>
                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                  <p className="text-white text-xs font-medium truncate">{img.title}</p>
                                </div>
                              </div>
                            )}
                            {/* Selection indicator */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                <div className="bg-red-600 text-white rounded-full p-2 shadow-lg">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                            {/* Checkmark badge */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {selectedGalleryImage && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Selected: {galleryImages.find(img => img.id === selectedGalleryImage)?.title || 'Untitled'}
                            </p>
                            {galleryImages.find(img => img.id === selectedGalleryImage)?.description && (
                              <p className="text-xs text-green-700 mt-1">
                                {galleryImages.find(img => img.id === selectedGalleryImage)?.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    required
                    defaultValue={editing?.url || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://..."
                  />
                </div>
              ) : mode === 'gallery' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Image
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                    {selectedGalleryImage 
                      ? galleryImages.find(img => img.id === selectedGalleryImage)?.title || 'Selected'
                      : 'Please select an image from gallery'
                    }
                  </div>
                </div>
              ) : null}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  name="alt"
                  defaultValue={editing?.alt || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editing?.title || ''}
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
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editing?.description || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images
          .sort((a, b) => a.display_order - b.display_order)
          .map((image, index) => {
            const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)
            const currentIndex = sortedImages.findIndex(img => img.id === image.id)
            return (
              <div
                key={image.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  !image.active ? 'opacity-50' : ''
                }`}
              >
                <div className="relative h-48">
                  <Image
                    src={image.url}
                    alt={image.alt || image.title || 'Carousel image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-800 flex-1">
                      {image.title || 'Untitled'}
                    </h3>
                    {/* Show sync status */}
                    {(image as any).gallery_item_id ? (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded flex items-center gap-1" title="Synced with gallery - updates automatically">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Synced
                      </span>
                    ) : galleryImages.some(gImg => gImg.url === image.url) ? (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded flex items-center gap-1" title="This image exists in gallery but is not synced">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        In Gallery
                      </span>
                    ) : null}
                  </div>
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
                  <div className="mt-2 flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-600 flex-1">Quick Order:</span>
                    <button
                      onClick={() => handleReorder(image.id, 'up')}
                      disabled={currentIndex === 0}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(image.id, 'down')}
                      disabled={currentIndex === sortedImages.length - 1}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title="Change display order"
                    />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(image)
                        setShowForm(true)
                        setMode((image as any).gallery_item_id ? 'gallery' : 'upload')
                        setSelectedGalleryImage((image as any).gallery_item_id)
                      }}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(image.id, image.active)}
                      className="flex-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                    >
                      {image.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">No carousel images yet. Add your first image!</p>
        </div>
      )}
    </div>
  )
}
