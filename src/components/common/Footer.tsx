import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-red-500 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-body text-gold-200 mb-2">
            HoadaoOfficial - Vietnamese Lion Dance Cultural Organization
          </p>
          <p className="text-body-sm text-gold-100">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}


