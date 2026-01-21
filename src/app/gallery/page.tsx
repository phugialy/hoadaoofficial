import { MainLayout } from '@/components/layout/MainLayout'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export default async function GalleryPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-hero md:text-5xl text-red-500 mb-4 font-bold">
            Gallery
          </h1>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Explore our collection of photos and videos from performances, events, and cultural celebrations
          </p>
        </div>
        <GalleryGrid />
      </div>
    </MainLayout>
  )
}
