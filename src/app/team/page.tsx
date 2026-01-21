import { MainLayout } from '@/components/layout/MainLayout'
import TeamGrid from '@/components/team/TeamGrid'

export default async function TeamPage() {
  return (
    <MainLayout>
      <div className="luxury-padding bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20 animate-fade-in">
            <h1 className="heading-editorial text-red-600 mb-6 font-display">
              Our Team
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-gold-500 mx-auto rounded-full mb-8"></div>
            <p className="text-editorial text-gray-600 max-w-2xl mx-auto">
              Meet the talented performers and dedicated members who bring Vietnamese Lion Dance culture to life
            </p>
          </div>

          <TeamGrid />
        </div>
      </div>
    </MainLayout>
  )
}
