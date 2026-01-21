import React from 'react'
import { Navigation } from '../navigation/Navigation'
import { Footer } from '../common/Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}


