import { createServerClient } from '@/lib/supabase'

interface AboutContent {
  id: string
  mission: string | null
  vision: string | null
}

export default async function AboutSection() {
  let aboutContent: AboutContent | null = null

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('about_content')
      .select('id, mission, vision')
      .eq('active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      aboutContent = data
    }
  } catch (error) {
    console.error('Error fetching about content:', error)
  }

  // Default content if none exists
  const mission = aboutContent?.mission || 'To preserve and promote Vietnamese Lion Dance culture through dynamic performances, community engagement, and cultural education.'
  const vision = aboutContent?.vision || 'To be the leading Vietnamese cultural organization that bridges communities through the vibrant tradition of Chinese New Year Lion Dance performances.'

  return (
    <section className="luxury-padding bg-gradient-to-b from-white via-red-50/20 to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20 animate-fade-in">
            <h2 className="heading-editorial text-red-600 mb-6 font-display">
              About Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-gold-500 mx-auto rounded-full mb-8"></div>
            <p className="text-editorial text-gray-600 max-w-2xl mx-auto">
              Our commitment to preserving and celebrating Vietnamese cultural heritage
            </p>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Mission */}
            <div className="bg-white rounded-3xl shadow-md p-10 md:p-12 hover-lift hover-glow transition-editorial">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 tracking-tight">
                  Our Mission
                </h3>
              </div>
              <p className="text-body-lg text-gray-700 leading-relaxed font-light">
                {mission}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-red-50/50 to-gold-50/50 rounded-3xl shadow-md p-10 md:p-12 hover-lift hover-glow transition-editorial">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gold-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 tracking-tight">
                  Our Vision
                </h3>
              </div>
              <p className="text-body-lg text-gray-700 leading-relaxed font-light">
                {vision}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
