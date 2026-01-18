import { MainLayout } from '@/components/layout/MainLayout'

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-hero text-red-500 mb-4">
          Welcome to HoadaoOfficial
        </h1>
        <p className="text-body-lg text-text-secondary mb-8">
          Vietnamese Lion Dance Cultural Organization
        </p>
        <p className="text-body text-text-primary">
          Platform coming soon...
        </p>
      </div>
    </MainLayout>
  )
}

