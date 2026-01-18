# Component Styling Reference

## Implementation Guide for Marketing UI Components

This document provides code-level styling references for implementing the marketing strategies defined in `STYLING_STRATEGY.md`.

## Color System Implementation

### Tailwind CSS Color Configuration
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#[YourBrandColor]',    // Main brand color
          secondary: '#[SecondaryColor]',   // Supporting color
          accent: '#[AccentColor]',        // CTA highlights
          heritage: '#[HeritageColor]',     // Cultural depth
          celebration: '#[CelebrationColor]', // Events/highlights
        },
        // Semantic Colors
        success: '#10b981',   // Green
        warning: '#f59e0b',  // Amber
        error: '#ef4444',    // Red
        info: '#3b82f6',     // Blue
        // Neutral Palette
        background: {
          primary: '#ffffff',    // Light mode
          secondary: '#f9fafb',  // Cards/surfaces
          dark: '#111827',       // Dark mode primary
          'dark-secondary': '#1f2937', // Dark mode secondary
        },
        text: {
          primary: '#111827',    // High contrast
          secondary: '#6b7280',  // Medium contrast
          muted: '#9ca3af',      // Low contrast
        },
      },
    },
  },
};
```

### Usage in Components
```typescript
// Primary brand color
className="bg-brand-primary text-white"

// Semantic colors
className="text-success" // For success messages
className="border-error" // For error states

// Neutral backgrounds
className="bg-background-secondary" // Card background
```

## Typography Scale Implementation

### Tailwind Typography Configuration
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontSize: {
        'hero': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '1.4' }],
      },
    },
  },
};
```

### Usage Examples
```typescript
// Hero headline
<h1 className="text-hero md:text-6xl lg:text-7xl">
  Welcome to Our Cultural Organization
</h1>

// Section title
<h2 className="text-h2 md:text-3xl">
  Upcoming Events
</h2>

// Body text
<p className="text-body text-text-primary">
  Join us for our weekly cultural performances...
</p>
```

## Layout Pattern Implementations

### Hero Section - Full-Screen Video Hero
```typescript
// components/hero/FullScreenVideoHero.tsx
interface FullScreenVideoHeroProps {
  videoUrl: string;
  posterImage: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  onCtaClick: () => void;
}

export const FullScreenVideoHero: React.FC<FullScreenVideoHeroProps> = ({
  videoUrl,
  posterImage,
  headline,
  subheadline,
  ctaText,
  onCtaClick,
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterImage}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-hero text-white mb-4 md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="text-body-lg text-white/90 mb-8 max-w-2xl md:text-xl">
          {subheadline}
        </p>
        <button
          onClick={onCtaClick}
          className="px-8 py-4 bg-brand-accent text-white rounded-lg text-body font-semibold hover:bg-brand-accent/90 transition-colors"
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
};
```

### Hero Section - Split Hero
```typescript
// components/hero/SplitHero.tsx
interface SplitHeroProps {
  imageUrl: string;
  imageAlt: string;
  headline: string;
  description: string;
  ctaText: string;
  reverse?: boolean; // Image on right if true
}

export const SplitHero: React.FC<SplitHeroProps> = ({
  imageUrl,
  imageAlt,
  headline,
  description,
  ctaText,
  reverse = false,
}) => {
  return (
    <section className="min-h-[600px] flex flex-col md:flex-row">
      {/* Image Section */}
      <div className={`w-full md:w-1/2 ${reverse ? 'md:order-2' : ''}`}>
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className={`w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 ${reverse ? 'md:order-1' : ''}`}>
        <h1 className="text-h1 md:text-4xl lg:text-5xl mb-4 text-text-primary">
          {headline}
        </h1>
        <p className="text-body-lg text-text-secondary mb-8">
          {description}
        </p>
        <button className="w-fit px-8 py-4 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors">
          {ctaText}
        </button>
      </div>
    </section>
  );
};
```

## Media Showcase Components

### Media Grid Showcase
```typescript
// components/media/MediaGrid.tsx
interface MediaGridProps {
  items: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    title?: string;
  }>;
  columns?: 2 | 3 | 4;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  columns = 3,
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform"
        >
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.title || ''}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <video
              src={item.url}
              poster={item.thumbnail}
              className="w-full h-full object-cover"
              muted
              loop
            />
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {item.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Featured Carousel
```typescript
// components/media/FeaturedCarousel.tsx
interface FeaturedCarouselProps {
  items: Array<{
    id: string;
    mediaUrl: string;
    type: 'image' | 'video';
    title: string;
    description?: string;
  }>;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  items,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <div className="relative">
      {/* Main Featured Item */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        {items[currentIndex].type === 'image' ? (
          <img
            src={items[currentIndex].mediaUrl}
            alt={items[currentIndex].title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={items[currentIndex].mediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
          />
        )}
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-h3 text-white mb-2">
            {items[currentIndex].title}
          </h3>
          {items[currentIndex].description && (
            <p className="text-body text-white/90">
              {items[currentIndex].description}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-2 overflow-x-auto">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-24 h-24 rounded overflow-hidden ${
              index === currentIndex ? 'ring-2 ring-brand-accent' : ''
            }`}
          >
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Event Card Components

### Featured Event Card
```typescript
// components/events/FeaturedEventCard.tsx
interface FeaturedEventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: Date;
    time: string;
    location?: string;
    category: string;
  };
  onLearnMore: () => void;
}

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({
  event,
  onLearnMore,
}) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(event.date);

  return (
    <article className="bg-background-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Event Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-brand-celebration text-white rounded-full text-caption font-semibold">
            {event.category}
          </span>
        </div>
        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
          <div className="text-caption text-text-secondary">Date</div>
          <div className="text-body-sm font-semibold text-text-primary">
            {formattedDate}
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-h3 mb-2 text-text-primary">
          {event.title}
        </h3>
        <p className="text-body text-text-secondary mb-4 line-clamp-2">
          {event.description}
        </p>
        
        {/* Event Details */}
        <div className="flex flex-col gap-2 mb-6 text-body-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span>{event.time}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onLearnMore}
          className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-semibold"
        >
          Learn More
        </button>
      </div>
    </article>
  );
};
```

## Button Component Variants

```typescript
// components/common/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary',
    secondary: 'bg-brand-secondary text-white hover:bg-brand-secondary/90 focus:ring-brand-secondary',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary',
    ghost: 'text-brand-primary hover:bg-brand-primary/10 focus:ring-brand-primary',
  };

  const sizes = {
    sm: 'px-4 py-2 text-body-sm',
    md: 'px-6 py-3 text-body',
    lg: 'px-8 py-4 text-body-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Responsive Utility Classes

### Container Patterns
```typescript
// Full-width container
<div className="w-full">...</div>

// Contained (max-width with padding)
<div className="container mx-auto px-4 md:px-6 lg:px-8">...</div>

// Full bleed (no padding, extends to edges)
<div className="w-screen -mx-4 md:-mx-6 lg:-mx-8">...</div>
```

### Grid Patterns
```typescript
// Responsive grid (1 col mobile, 2 tablet, 3 desktop)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  ...
</div>

// Flex with responsive direction
<div className="flex flex-col md:flex-row gap-4">
  ...
</div>
```

## Animation Utilities

### Hover Effects
```typescript
// Scale on hover
className="hover:scale-105 transition-transform"

// Lift effect (shadow)
className="hover:shadow-xl transition-shadow"

// Color change
className="hover:bg-brand-primary/10 transition-colors"
```

### Transition Classes
```typescript
// Fast transition (200ms)
className="transition-all duration-200"

// Smooth transition (300ms)
className="transition-all duration-300"

// Slow transition (500ms)
className="transition-all duration-500"
```

## Accessibility Styling

### Focus States
```typescript
// Focus ring
className="focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"

// Focus visible (keyboard only)
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
```

### Screen Reader Only
```typescript
// Hide visually but keep for screen readers
className="sr-only"

// Or custom
className="absolute w-px h-px p-0 -m-px overflow-hidden clip-[0_0_0_0] border-0"
```

---

## Chinese New Year Theme Components

**Note**: See `CULTURAL_THEME_GUIDE.md` and `COLOR_PALETTE_REFERENCE.md` for complete theme details.

### Themed Hero Section
```typescript
// components/hero/ChineseNewYearHero.tsx
interface ChineseNewYearHeroProps {
  videoUrl: string;
  posterImage: string;
  headline: string;
  subheadline: string;
  ctaText: string;
}

export const ChineseNewYearHero: React.FC<ChineseNewYearHeroProps> = ({
  videoUrl,
  posterImage,
  headline,
  subheadline,
  ctaText,
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video - Lion Dance */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterImage}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Overlay - Red to Gold Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/70 via-red-800/60 to-red-900/70" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-hero text-gold-500 mb-4 md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
          {headline}
        </h1>
        <p className="text-body-lg text-white mb-8 max-w-2xl md:text-xl drop-shadow-md">
          {subheadline}
        </p>
        <button className="px-8 py-4 bg-gold-500 text-red-800 rounded-lg text-body font-bold hover:bg-gold-600 transition-colors shadow-lg">
          {ctaText}
        </button>
      </div>
    </section>
  );
};
```

### Themed Event Card
```typescript
// components/events/ChineseNewYearEventCard.tsx
interface ChineseNewYearEventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: Date;
    time: string;
    location?: string;
  };
}

export const ChineseNewYearEventCard: React.FC<ChineseNewYearEventCardProps> = ({
  event,
}) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(event.date);

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-red-200 hover:border-red-400">
      {/* Event Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Chinese New Year Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-caption font-bold">
            🦁 Chinese New Year
          </span>
        </div>
        {/* Date Badge - Gold */}
        <div className="absolute top-4 right-4 bg-gold-500/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-md">
          <div className="text-caption text-red-800 font-semibold">Date</div>
          <div className="text-body-sm font-bold text-red-900">
            {formattedDate}
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-h3 mb-2 text-red-700 font-bold">
          {event.title}
        </h3>
        <p className="text-body text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        {/* Event Details */}
        <div className="flex flex-col gap-2 mb-6 text-body-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <span>{event.time}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* CTA Button - Red */}
        <button className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold shadow-md">
          Join Celebration
        </button>
      </div>
    </article>
  );
};
```

### Themed Button Variants
```typescript
// components/common/ChineseNewYearButton.tsx
interface CNYButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const CNYButton: React.FC<CNYButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md';
  
  const variants = {
    primary: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    secondary: 'bg-gold-500 text-red-800 hover:bg-gold-600 focus:ring-gold-500',
    outline: 'border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500',
    gold: 'bg-gold-500 text-black hover:bg-gold-600 focus:ring-gold-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-body-sm',
    md: 'px-6 py-3 text-body',
    lg: 'px-8 py-4 text-body-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Themed Navigation
```typescript
// components/navigation/CNYNavigation.tsx
export const CNYNavigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-md border-b-2 border-red-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-red-500">
              🦁 Lion Dance
            </span>
          </div>
          
          {/* Navigation Items */}
          <div className="hidden md:flex gap-8">
            <a href="/" className="text-red-700 font-semibold hover:text-red-500 transition-colors border-b-2 border-red-500">
              Home
            </a>
            <a href="/events" className="text-gray-700 hover:text-red-500 transition-colors">
              Events
            </a>
            <a href="/team" className="text-gray-700 hover:text-red-500 transition-colors">
              Team
            </a>
            <a href="/about" className="text-gray-700 hover:text-red-500 transition-colors">
              About
            </a>
          </div>
          
          {/* CTA Button */}
          <CNYButton variant="primary" size="sm">
            Join Us
          </CNYButton>
        </div>
      </div>
    </nav>
  );
};
```

### Themed Calendar Highlight
```typescript
// components/calendar/CNYCalendar.tsx
export const CNYCalendar: React.FC = () => {
  // Highlight Chinese New Year dates
  const highlightCNY = (date: Date) => {
    // Logic to determine if date is CNY
    return isChineseNewYear(date);
  };

  return (
    <div className="calendar-container">
      {/* Calendar grid with CNY highlights */}
      <div className={`calendar-day ${highlightCNY(date) ? 'bg-red-100 border-2 border-gold-500' : ''}`}>
        {/* Day content */}
      </div>
    </div>
  );
};
```

### Color Usage in Themed Components
```typescript
// Red (Primary)
className="bg-red-500 text-white"        // Primary buttons, backgrounds
className="text-red-700"                  // Headings, important text
className="border-red-300"                // Subtle borders
className="bg-red-50"                     // Light backgrounds

// Gold (Secondary/Accent)
className="bg-gold-500 text-red-800"      // Secondary buttons
className="text-gold-500"                 // Accent text, highlights
className="border-gold-300"               // Accent borders
className="bg-gold-50"                    // Light gold backgrounds

// Combinations
className="bg-red-500 text-gold-500"     // Red bg, gold text
className="bg-gold-500 text-red-700"     // Gold bg, red text
className="border-red-500 bg-gold-50"     // Red border, gold bg
```

---

## Quick Implementation Checklist

When implementing a new component:
- [ ] Uses Tailwind utility classes
- [ ] Responsive (mobile-first)
- [ ] Accessible (focus states, ARIA)
- [ ] Hover/interaction states
- [ ] Loading/error states
- [ ] TypeScript types defined
- [ ] Follows spacing scale
- [ ] Uses color system
- [ ] Uses typography scale

---

*Reference this document when implementing marketing UI components.*
*Last updated: [Date]*

