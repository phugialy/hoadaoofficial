import { MainLayout } from '@/components/layout/MainLayout'
import ImageCarousel, { CarouselImage } from '@/components/social/ImageCarousel'
import AboutSection from '@/components/home/AboutSection'
import HomeGallerySection from '@/components/home/HomeGallerySection'
import ActivitiesProgramsSection from '@/components/home/ActivitiesProgramsSection'
import ContactSection from '@/components/home/ContactSection'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase'

// Example carousel images - fallback when DB is empty or fetch fails
const defaultCarouselImages: CarouselImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
    alt: 'Lion Dance Performance',
    title: 'Traditional Lion Dance',
    description: 'Celebrating Chinese New Year with vibrant performances',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=1200&h=800&fit=crop',
    alt: 'Team Performance',
    title: 'Team Showcase',
    description: 'Our talented team in action',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop',
    alt: 'Cultural Event',
    title: 'Cultural Celebration',
    description: 'Bringing communities together through tradition',
  },
]

export default async function Home() {
  // Fetch carousel images directly from Supabase (avoids fetch-to-self / localhost at build time on Vercel)
  let carouselImages = defaultCarouselImages
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('carousel_images')
      .select(`
        *,
        gallery_item:media_items!carousel_images_gallery_item_id_fkey (
          url,
          title,
          description,
          updated_at
        )
      `)
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      carouselImages = data.map((item: { id: string; url: string; alt?: string; title?: string; description?: string; gallery_item_id?: string; gallery_item?: { url?: string; title?: string; description?: string } | null }) => {
        const g = item.gallery_item
        if (g && item.gallery_item_id) {
          return {
            id: item.id,
            url: g.url || item.url,
            alt: item.alt || g.title || item.title || undefined,
            title: g.title || item.title || undefined,
            description: g.description || item.description || undefined,
          }
        }
        return {
          id: item.id,
          url: item.url,
          alt: item.alt || item.title || undefined,
          title: item.title || undefined,
          description: item.description || undefined,
        }
      })
    }
  } catch (error) {
    console.error('Error fetching carousel images:', error)
  }

  return (
    <MainLayout>
      {/* Hero Section - Stunning Carousel */}
      <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="relative z-20">
          <ImageCarousel
            images={carouselImages}
            autoPlay={true}
            autoPlayInterval={6000}
            showIndicators={true}
            showControls={true}
            className="h-[70vh] md:h-[85vh]"
          />
          {/* Hero Overlay Content - Positioned at bottom to not block image */}
          <div className="absolute inset-0 z-30 flex items-end justify-center pointer-events-none">
            <div className="w-full">
              {/* Subtle gradient overlay only at bottom */}
              <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-8 md:pb-12">
                <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                  <div className="text-center animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-3 md:mb-4 drop-shadow-2xl tracking-tight leading-tight">
                      Welcome to Hoa Dao Lion Dance Association
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 drop-shadow-lg font-light leading-relaxed max-w-3xl mx-auto">
                      Preserving Vietnamese Lion Dance Culture
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-5 pointer-events-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <Link
                        href="/events"
                        className="px-8 py-3 md:px-10 md:py-4 bg-red-600/95 backdrop-blur-md text-white rounded-xl font-medium hover:bg-red-700 transition-editorial hover-lift shadow-xl text-base md:text-body-lg border border-white/20"
                      >
                        View Events
                      </Link>
                      <Link
                        href="/team"
                        className="px-8 py-3 md:px-10 md:py-4 bg-gold-500/95 backdrop-blur-md text-white rounded-xl font-medium hover:bg-gold-600 transition-editorial hover-lift shadow-xl text-base md:text-body-lg border border-white/20"
                      >
                        Meet the Team
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Gallery Section */}
      <HomeGallerySection />

      {/* Activities & Programs Section */}
      <ActivitiesProgramsSection />

      {/* Contact Section */}
      <ContactSection />
    </MainLayout>
  )
}

