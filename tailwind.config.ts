import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Chinese New Year Theme - Red (Primary)
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#C8102E',  // Traditional Chinese red
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#5a1515',
          vibrant: '#E53E3E',
          deep: '#8B0000',
          festive: '#FF0000',
        },
        // Chinese New Year Theme - Gold (Secondary)
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFD700',  // Traditional gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          rich: '#D4AF37',
          bright: '#FFC125',
          metallic: '#B8860B',
        },
        // Neutral colors
        background: {
          primary: '#ffffff',
          secondary: '#f9fafb',
        },
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          muted: '#9ca3af',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.03em' }],
        'h1': ['42px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h2': ['32px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h3': ['26px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h4': ['22px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '-0.01em' }],
        'body-lg': ['20px', { lineHeight: '1.75', letterSpacing: '-0.011em' }],
        'body': ['18px', { lineHeight: '1.75', letterSpacing: '-0.011em' }],
        'body-sm': ['16px', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
        'caption': ['14px', { lineHeight: '1.6', letterSpacing: '0em' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
        '5xl': '128px',
        '6xl': '160px',
        'section': '80px',
        'section-lg': '120px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

export default config


