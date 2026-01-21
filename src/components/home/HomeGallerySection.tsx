import { createServerClient } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface GalleryImage {
  id: string
  url: string
  title: string | null
  thumbnail_url: string | null
}

export default async function HomeGallerySection() {
  let galleryImages: GalleryImage[] = []

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('media_items')
      .select('id, url, title, thumbnail_url')
      .eq('type', 'image')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(6) // Show 6 images on homepage

    if (!error && data) {
      galleryImages = data
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error)
  }

  if (galleryImages.length === 0) {
    return null // Don't show section if no images
  }

  return (
    <section className="luxury-padding bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="heading-editorial text-gray-900 mb-6 font-display">
            Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-gold-500 mx-auto rounded-full mb-8"></div>
          <p className="text-editorial text-gray-600 max-w-2xl mx-auto">
            Beautiful image grid showcasing cultural events and activities
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-editorial hover-lift ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <Image
                src={image.thumbnail_url || image.url}
                alt={image.title || 'Gallery image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-medium text-base md:text-lg">
                      {image.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 px-10 py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-editorial hover-lift shadow-md hover:shadow-xl"
          >
            View Full Gallery
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
