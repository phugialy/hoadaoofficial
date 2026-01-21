import { MainLayout } from '@/components/layout/MainLayout'
import ImageCarousel, { CarouselImage } from '@/components/social/ImageCarousel'
import SocialMediaSection from '@/components/home/SocialMediaSection'
import Link from 'next/link'

// Example carousel images - Replace with actual images from your Supabase storage
// You can also fetch these dynamically from Supabase (see commented code below)
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
  // Fetch carousel images from Supabase
  let carouselImages = defaultCarouselImages
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/carousel`, {
      cache: 'no-store',
    })
    if (response.ok) {
      const data = await response.json()
      if (data.images && data.images.length > 0) {
        carouselImages = data.images
      }
    }
  } catch (error) {
    console.error('Error fetching carousel images:', error)
    // Fallback to default images
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-gold-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-hero md:text-6xl text-red-500 mb-6 font-bold">
              Welcome to HoadaoOfficial
            </h1>
            <p className="text-body-lg md:text-xl text-text-secondary mb-8">
              Vietnamese Lion Dance Cultural Organization
            </p>
            <p className="text-body text-text-primary mb-8 max-w-2xl mx-auto">
              Experience the vibrant tradition of Chinese New Year Lion Dance performances. 
              Join us in celebrating cultural heritage through dynamic performances, 
              community events, and cultural education.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View Events
              </Link>
              <Link
                href="/team"
                className="px-8 py-3 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Carousel Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-h2 md:text-4xl text-gray-800 mb-4 font-bold">
              Featured Highlights
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Discover our latest performances and cultural celebrations
            </p>
          </div>
          <ImageCarousel
            images={carouselImages}
            autoPlay={true}
            autoPlayInterval={5000}
            showIndicators={true}
            showControls={true}
          />
        </div>
      </section>


      {/* Social Media Section */}
      <SocialMediaSection />

      {/* Quick Links Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-red-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-h2 md:text-4xl text-gray-800 mb-4 font-bold">
              Explore More
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              href="/events"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-h3 text-gray-800 mb-2 font-semibold">Events</h3>
              <p className="text-body-sm text-text-secondary">
                View our upcoming performances and cultural events
              </p>
            </Link>
            <Link
              href="/team"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-h3 text-gray-800 mb-2 font-semibold">Team</h3>
              <p className="text-body-sm text-text-secondary">
                Meet our talented performers and team members
              </p>
            </Link>
            <Link
              href="/gallery"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-h3 text-gray-800 mb-2 font-semibold">Gallery</h3>
              <p className="text-body-sm text-text-secondary">
                Browse our photo and video collection
              </p>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

