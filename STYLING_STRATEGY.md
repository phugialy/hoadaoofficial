# Styling Strategy & Marketing UI Guidelines

## Design System Terminology

### Color System Terms

#### Primary Palette
- **Brand Primary**: Main brand color (cultural identity)
- **Brand Secondary**: Supporting brand color
- **Accent**: Highlight color for CTAs and important elements
- **Heritage**: Deep, rich colors representing cultural depth
- **Celebration**: Vibrant colors for events and highlights

#### Semantic Colors
- **Success**: Green tones for confirmations, achievements
- **Warning**: Amber/yellow for important notices
- **Error**: Red tones for errors (use sparingly)
- **Info**: Blue tones for informational content

#### Neutral Palette
- **Background Primary**: Main background (light/dark mode)
- **Background Secondary**: Card/surface backgrounds
- **Text Primary**: Main text color (high contrast)
- **Text Secondary**: Supporting text (medium contrast)
- **Border**: Subtle borders and dividers
- **Overlay**: Semi-transparent overlays for modals

### Typography Terms

#### Font Families
- **Display Font**: For headlines, hero sections (cultural, elegant)
- **Body Font**: For readable content (clean, modern)
- **Accent Font**: For special elements, quotes (optional, decorative)

#### Type Scale
- **Hero**: 48px-72px (mobile: 32px-48px) - Main headlines
- **H1**: 36px-48px (mobile: 28px-36px) - Page titles
- **H2**: 28px-36px (mobile: 24px-28px) - Section titles
- **H3**: 24px-28px (mobile: 20px-24px) - Subsection titles
- **H4**: 20px-24px (mobile: 18px-20px) - Card titles
- **Body Large**: 18px - Important body text
- **Body**: 16px - Standard body text
- **Body Small**: 14px - Supporting text
- **Caption**: 12px-14px - Image captions, metadata

#### Font Weights
- **Light (300)**: Decorative text, large displays
- **Regular (400)**: Body text, standard content
- **Medium (500)**: Emphasis, buttons
- **Semibold (600)**: Headings, important text
- **Bold (700)**: Strong emphasis, CTAs

### Spacing System Terms

#### Spacing Scale (4px base unit)
- **xs**: 4px - Tight spacing
- **sm**: 8px - Small gaps
- **md**: 16px - Standard spacing
- **lg**: 24px - Comfortable spacing
- **xl**: 32px - Section spacing
- **2xl**: 48px - Large section spacing
- **3xl**: 64px - Hero spacing
- **4xl**: 96px - Page-level spacing

#### Layout Spacing
- **Container Padding**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Section Gap**: 48px-64px between major sections
- **Component Gap**: 24px-32px between related components
- **Card Padding**: 16px-24px internal padding

### Layout Terms

#### Grid System
- **Container**: Max-width container (1200px-1400px)
- **Grid Columns**: 12-column grid (desktop), 4-column (tablet), 1-column (mobile)
- **Gutter**: Space between grid columns (16px-24px)
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

#### Layout Patterns
- **Full Bleed**: Content extends to viewport edges
- **Contained**: Content within max-width container
- **Asymmetric**: Uneven column layouts for visual interest
- **Symmetrical**: Balanced, centered layouts
- **Staggered**: Alternating layouts for rhythm

## Marketing-Focused Layout Strategies

### Hero Section Patterns

#### Pattern 1: Full-Screen Video Hero
```
┌─────────────────────────────────┐
│  [Background Video/Image]        │
│                                  │
│     [Overlay with gradient]      │
│                                  │
│     [Headline - Large]           │
│     [Subheadline]                │
│     [CTA Button]                  │
│                                  │
└─────────────────────────────────┘
```
**Use Case**: Homepage, landing pages
**Key Elements**: 
- Full viewport height (100vh)
- Video or high-impact image
- Overlay for text readability
- Clear CTA above fold

#### Pattern 2: Split Hero
```
┌──────────────┬──────────────────┐
│              │                  │
│   [Image/    │  [Headline]      │
│    Video]    │  [Description]   │
│              │  [CTA]           │
│              │                  │
└──────────────┴──────────────────┘
```
**Use Case**: Feature pages, event pages
**Key Elements**:
- 50/50 or 40/60 split
- Visual on left, content on right (or vice versa)
- Responsive: stacks on mobile

#### Pattern 3: Centered Content Hero
```
┌─────────────────────────────────┐
│                                  │
│        [Headline - Centered]     │
│        [Subheadline]             │
│        [CTA Buttons]             │
│                                  │
│        [Background Image]         │
│                                  │
└─────────────────────────────────┘
```
**Use Case**: About pages, team pages
**Key Elements**:
- Centered text alignment
- Background image with overlay
- Multiple CTAs if needed

### Showcase Section Patterns

#### Pattern 1: Media Grid Showcase
```
┌──────┬──────┬──────┐
│      │      │      │
│ Img  │ Img  │ Img  │
│      │      │      │
├──────┼──────┼──────┤
│      │      │      │
│ Vid  │ Img  │ Img  │
│      │      │      │
└──────┴──────┴──────┘
```
**Use Case**: Gallery, performance highlights
**Key Elements**:
- Responsive grid (3-4 columns desktop, 2 tablet, 1 mobile)
- Mixed media (images and videos)
- Hover effects for interactivity
- Lightbox on click

#### Pattern 2: Featured Carousel
```
┌─────────────────────────────────┐
│  ←  [Large Featured Media]  →   │
│     [Thumbnail Strip Below]      │
└─────────────────────────────────┘
```
**Use Case**: Featured performances, highlights
**Key Elements**:
- Large featured item
- Thumbnail navigation
- Auto-play with pause
- Touch/swipe support

#### Pattern 3: Masonry Layout
```
┌───┬─────┬───┐
│   │     │   │
│   │     │   │
├───┤     ├───┤
│   │     │   │
└───┴─────┴───┘
```
**Use Case**: Photo galleries, diverse content
**Key Elements**:
- Variable height items
- Efficient space usage
- Lazy loading
- Infinite scroll option

### Event/Calendar Marketing Layouts

#### Pattern 1: Featured Event Card
```
┌─────────────────────────────────┐
│  [Event Image - Full Width]     │
├─────────────────────────────────┤
│  [Date Badge]  [Category]       │
│  [Event Title - Large]           │
│  [Description]                   │
│  [Location] [Time]               │
│  [CTA: Learn More / RSVP]        │
└─────────────────────────────────┘
```
**Use Case**: Upcoming events, featured events
**Key Elements**:
- Large, compelling image
- Clear date/time
- Prominent CTA
- Category badge

#### Pattern 2: Event Timeline
```
┌─────────────────────────────────┐
│  [Today Marker]                  │
│    │                             │
│    ├─ [Event Card]               │
│    │                             │
│    ├─ [Event Card]               │
│    │                             │
│    └─ [Event Card]               │
└─────────────────────────────────┘
```
**Use Case**: Weekly/daily event schedules
**Key Elements**:
- Visual timeline
- Chronological order
- Today indicator
- Quick event details

#### Pattern 3: Calendar Grid with Events
```
┌─────────────────────────────────┐
│  [Month Navigation]              │
│  [Calendar Grid]                 │
│  ┌─┬─┬─┬─┬─┬─┬─┐                │
│  │ │ │ │ │ │ │ │                │
│  └─┴─┴─┴─┴─┴─┴─┘                │
│  [Event List Sidebar]            │
└─────────────────────────────────┘
```
**Use Case**: Full calendar view
**Key Elements**:
- Interactive calendar
- Event indicators on dates
- Sidebar with event details
- Month/week/day views

### Team Showcase Layouts

#### Pattern 1: Team Grid
```
┌──────┬──────┬──────┬──────┐
│      │      │      │      │
│Member│Member│Member│Member│
│      │      │      │      │
├──────┼──────┼──────┼──────┤
│      │      │      │      │
│Member│Member│Member│Member│
│      │      │      │      │
└──────┴──────┴──────┴──────┘
```
**Use Case**: Team page, about page
**Key Elements**:
- Uniform card sizes
- Profile images
- Name and role
- Hover effects (reveal bio)

#### Pattern 2: Featured Team Member
```
┌─────────────────────────────────┐
│  [Large Profile Image]           │
│  [Name - Large]                    │
│  [Role/Title]                     │
│  [Bio/Description]                │
│  [Social Links]                   │
└─────────────────────────────────┘
```
**Use Case**: Individual team member pages
**Key Elements**:
- Large, professional image
- Prominent name
- Detailed bio
- Social media links

#### Pattern 3: Leadership Spotlight
```
┌──────┬──────────────────────────┐
│      │  [Name - Large]           │
│[Img] │  [Title]                  │
│      │  [Bio]                    │
│      │  [Quote/Statement]         │
└──────┴──────────────────────────┘
```
**Use Case**: Leadership team, key members
**Key Elements**:
- Split layout
- Image on left, content on right
- Prominent quote
- Professional presentation

## Unique UI Strategies for Cultural Marketing

### Strategy 1: Storytelling Through Visuals

#### Implementation
- **Hero Videos**: Showcase performances, behind-the-scenes
- **Image Sequences**: Tell stories through photo series
- **Timeline Visualizations**: Show organization history
- **Before/After**: Show transformation, growth

#### Component Pattern
```typescript
// StorySection component
- Full-width background media
- Overlay text with narrative
- Progressive reveal on scroll
- Interactive elements (click to continue story)
```

### Strategy 2: Emotional Connection

#### Visual Elements
- **Warm Color Palette**: Inviting, cultural colors
- **Authentic Imagery**: Real moments, not stock photos
- **Cultural Symbols**: Subtle integration of cultural elements
- **Human Faces**: Show real people, real emotions

#### Implementation
- Use real photos from events
- Show candid moments, not just posed shots
- Include diverse representation
- Highlight community connections

### Strategy 3: Event FOMO (Fear of Missing Out)

#### Layout Elements
- **Countdown Timers**: For upcoming events
- **Limited Availability**: Show remaining spots
- **Recent Activity**: "X people viewing this event"
- **Social Proof**: "Join 500+ attendees"

#### Component Pattern
```typescript
// EventUrgency component
- Countdown timer
- Availability indicator
- Social proof badges
- Prominent CTA
```

### Strategy 4: Immersive Media Experience

#### Implementation
- **Full-Screen Media**: Videos/images take full viewport
- **Background Videos**: Subtle, looping background videos
- **Interactive Galleries**: Click to explore
- **360° Views**: If applicable for venues

#### Performance Considerations
- Lazy load below fold
- Optimize video file sizes
- Provide loading states
- Fallback images

### Strategy 5: Community Engagement

#### UI Elements
- **Testimonials Carousel**: Rotating member quotes
- **Social Feed Integration**: Recent posts
- **Member Spotlights**: Feature community members
- **Event Highlights**: Past event galleries

#### Layout Pattern
```
┌─────────────────────────────────┐
│  [Testimonial Quote]             │
│  [Member Name & Photo]            │
│  [Social Proof Stats]             │
└─────────────────────────────────┘
```

### Strategy 6: Clear Call-to-Action Hierarchy

#### CTA Levels
1. **Primary CTA**: Main action (Join Event, Register)
   - Large, prominent button
   - High contrast
   - Above fold

2. **Secondary CTA**: Supporting action (Learn More, View Gallery)
   - Medium prominence
   - Outlined or secondary color

3. **Tertiary CTA**: Additional actions (Share, Follow)
   - Subtle, text links or icons

#### CTA Placement Strategy
- **Above Fold**: Primary CTA visible immediately
- **After Value Proposition**: CTA after explaining benefits
- **Sticky CTA**: Floating CTA on scroll (mobile)
- **End of Content**: Final CTA after all information

## Component-Specific Styling Terms

### Card Components
- **Card Elevation**: Shadow depth (0-3 levels)
- **Card Hover**: Lift effect, scale, or color change
- **Card Border**: Subtle border or shadow
- **Card Padding**: Internal spacing (16px-24px)
- **Card Radius**: Border radius (8px-16px)

### Button Styles
- **Primary Button**: Solid, brand color, high contrast
- **Secondary Button**: Outlined, transparent background
- **Ghost Button**: Text only, no border
- **Icon Button**: Circular/square, icon only
- **Button Size**: sm (32px), md (40px), lg (48px)

### Modal/Overlay Terms
- **Backdrop**: Semi-transparent background (rgba(0,0,0,0.5))
- **Modal Size**: sm (400px), md (600px), lg (800px), full (100vw)
- **Modal Position**: Center, top, bottom (mobile)
- **Close Button**: X icon, top-right or top-left
- **Modal Animation**: Fade in, slide up, scale

### Navigation Terms
- **Header Height**: 64px-80px (desktop), 56px (mobile)
- **Sticky Header**: Fixed position on scroll
- **Nav Item Spacing**: 16px-24px between items
- **Active State**: Underline, background, or color change
- **Mobile Menu**: Slide-out drawer, full-screen overlay

## Responsive Strategy Terms

### Mobile-First Approach
- **Base Styles**: Mobile (320px+)
- **Progressive Enhancement**: Add styles for larger screens
- **Touch Targets**: Minimum 44x44px
- **Swipe Gestures**: Horizontal navigation, carousels

### Breakpoint Strategy
- **Mobile**: < 640px - Single column, stacked
- **Tablet**: 640px-1024px - 2 columns, side-by-side
- **Desktop**: 1024px+ - Multi-column, complex layouts
- **Large Desktop**: 1280px+ - Maximum container width

### Content Adaptation
- **Text Scaling**: Responsive font sizes
- **Image Sizing**: Responsive images (srcset)
- **Layout Shifts**: Stack on mobile, grid on desktop
- **Navigation**: Hamburger menu (mobile), full nav (desktop)

## Animation & Interaction Terms

### Micro-Interactions
- **Hover Effects**: Color change, scale, shadow
- **Click Feedback**: Ripple, scale down
- **Loading States**: Skeleton screens, spinners
- **Transition Duration**: 200ms-300ms (fast), 400ms-500ms (smooth)

### Scroll Animations
- **Fade In**: Content appears on scroll
- **Slide Up**: Content slides up on scroll
- **Parallax**: Background moves slower than foreground
- **Sticky Elements**: Elements stick to viewport on scroll

### Page Transitions
- **Fade**: Smooth fade between pages
- **Slide**: Horizontal/vertical slide
- **Scale**: Zoom in/out effect
- **Duration**: 300ms-500ms

## Accessibility Styling Terms

### Focus States
- **Focus Ring**: Visible outline (2px-4px)
- **Focus Color**: High contrast, brand color
- **Focus Offset**: 2px-4px from element edge

### Color Contrast
- **Text on Background**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio (18px+)
- **Interactive Elements**: Minimum 3:1 ratio

### Visual Indicators
- **Error States**: Red border, error icon
- **Success States**: Green border, checkmark
- **Required Fields**: Asterisk, label indicator
- **Disabled States**: Reduced opacity, no interaction

## Performance Styling Terms

### Image Optimization
- **Lazy Loading**: Load images on scroll
- **Responsive Images**: Multiple sizes (srcset)
- **Format**: WebP with fallback
- **Placeholder**: Blur-up, color placeholder

### CSS Optimization
- **Critical CSS**: Above-fold styles inline
- **Unused CSS**: Remove unused styles
- **CSS Variables**: For theming, easy updates
- **Minification**: Production build minifies CSS

## Brand Identity Styling

### Cultural Elements Integration
- **Color Palette**: Reflect cultural identity
- **Typography**: Consider cultural script if applicable
- **Patterns**: Subtle cultural patterns in backgrounds
- **Imagery**: Authentic cultural representation

### Visual Language
- **Warmth**: Inviting, community-focused
- **Elegance**: Professional, refined
- **Vibrancy**: Celebratory, energetic
- **Tradition**: Respectful, authentic

---

## Quick Reference: Styling Decisions

### When to Use Full Bleed
- Hero sections
- Background images/videos
- Section dividers
- Full-width galleries

### When to Use Contained
- Text content
- Cards and components
- Navigation
- Forms

### When to Use Asymmetric Layouts
- Visual interest
- Breaking monotony
- Highlighting specific content
- Creative presentations

### When to Use Symmetric Layouts
- Professional content
- Balanced information
- Team grids
- Event listings

---

*These styling terms and strategies guide all visual design decisions in the project.*
*Last updated: [Date]*


