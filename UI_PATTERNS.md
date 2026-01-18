# UI Patterns & Component Guidelines

## Design System Principles

### Visual Hierarchy
1. **Primary Actions** - Clear, prominent CTAs
2. **Secondary Actions** - Subtle but accessible
3. **Content Flow** - Logical reading order
4. **Whitespace** - Adequate spacing for clarity

### Color System
- **Primary** - Brand color for main actions
- **Secondary** - Supporting actions
- **Neutral** - Text, backgrounds, borders
- **Semantic** - Success, warning, error states
- **Accessibility** - Minimum 4.5:1 contrast ratio

### Typography Scale
- **Headings** - Clear hierarchy (h1-h6)
- **Body** - Readable size (16px minimum)
- **Line height** - 1.5-1.6 for readability
- **Font weights** - Use sparingly for emphasis

## Component Patterns

### Media Showcase Components

#### Video Player Component
```typescript
// Features:
- Responsive container (16:9 aspect ratio)
- Play/pause controls
- Fullscreen support
- Loading state with poster image
- Caption/subtitle support
- Mobile-optimized controls
```

#### Image Gallery Component
```typescript
// Features:
- Grid layout (responsive columns)
- Lightbox/modal view
- Lazy loading
- Image optimization
- Swipe gestures (mobile)
- Keyboard navigation
```

#### Media Carousel Component
```typescript
// Features:
- Auto-play with pause on hover
- Navigation arrows
- Dot indicators
- Touch/swipe support
- Smooth transitions
- Accessibility (ARIA labels)
```

### Calendar Components

#### Calendar View
```typescript
// Features:
- Month/week/day views
- Event indicators on dates
- Click to view event details
- Navigation (prev/next month)
- Today highlight
- Responsive grid
```

#### Event Card Component
```typescript
// Features:
- Event image/thumbnail
- Title and description
- Date/time display
- Location (if applicable)
- Category badge
- CTA button (View Details/RSVP)
- Responsive layout
```

#### Event List Component
```typescript
// Features:
- Filterable list
- Sort options (date, category)
- Search functionality
- Pagination or infinite scroll
- Empty state message
- Loading skeleton
```

### Team Components

#### Team Member Card
```typescript
// Features:
- Profile image
- Name and role
- Bio/description
- Social links (optional)
- Hover effects
- Responsive grid placement
```

#### Team Grid
```typescript
// Features:
- Responsive grid (1-4 columns)
- Filter by role/department
- Search functionality
- Modal/detail view on click
```

### Navigation Patterns

#### Mobile Navigation
- Hamburger menu
- Slide-out drawer
- Bottom navigation (for mobile apps)
- Sticky header on scroll

#### Desktop Navigation
- Horizontal menu bar
- Dropdown menus
- Breadcrumbs for deep pages
- Sticky header option

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layouts
- Stacked components
- Full-width images
- Touch-optimized buttons
- Bottom navigation (if app-like)

### Tablet (640px - 1024px)
- 2-column grids where appropriate
- Side-by-side content
- Larger touch targets
- Optimized spacing

### Desktop (1024px+)
- Multi-column layouts
- Hover states
- More whitespace
- Complex grid systems

## Interaction Patterns

### Loading States
- **Skeleton screens** - For content loading
- **Spinners** - For quick actions
- **Progress bars** - For long operations
- **Placeholder content** - Maintain layout

### Error States
- **Inline errors** - Form validation
- **Error messages** - User-friendly language
- **Retry actions** - Allow recovery
- **Empty states** - Helpful guidance

### Success States
- **Toast notifications** - Brief confirmations
- **Success messages** - Clear feedback
- **Visual indicators** - Icons, colors

## Animation Guidelines

### Principles
- **Purposeful** - Animations should enhance UX
- **Fast** - 200-300ms for micro-interactions
- **Smooth** - Use easing functions
- **Accessible** - Respect prefers-reduced-motion

### Common Animations
- **Fade in** - Content appearance
- **Slide** - Navigation transitions
- **Scale** - Button presses
- **Smooth scroll** - Page navigation

## Accessibility Patterns

### Keyboard Navigation
- Tab order is logical
- Focus indicators visible
- Skip links for main content
- Escape key closes modals

### Screen Reader Support
- Semantic HTML
- ARIA labels where needed
- Alt text for images
- Descriptive link text

### Visual Accessibility
- Color not sole indicator
- Sufficient contrast
- Text resizable
- Focus states clear

## Performance Patterns

### Image Optimization
- WebP format with fallbacks
- Responsive images (srcset)
- Lazy loading
- Placeholder blur

### Video Optimization
- Poster images
- Lazy loading
- Quality selection
- Autoplay only when appropriate

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports for heavy libraries

## Mobile-Specific Patterns

### Touch Interactions
- Swipe gestures for navigation
- Pull-to-refresh
- Long-press for context menus
- Pinch-to-zoom (where appropriate)

### Mobile UI Elements
- Bottom sheets
- Action sheets
- Native-like inputs
- Sticky headers/footers

## Component Reusability Rules

### When to Create a Component
1. Used in 2+ places
2. Complex logic that can be isolated
3. Clear, single responsibility
4. Reusable across different contexts

### Component Props Design
- **Required props** - Essential functionality
- **Optional props** - Customization
- **Default values** - Sensible defaults
- **Prop types** - TypeScript interfaces

### Component Composition
- **Small, focused components** - Single responsibility
- **Compose larger components** - Build from smaller pieces
- **Avoid prop drilling** - Use context when needed
- **Flexible APIs** - Allow customization

---

## Quick Component Checklist

Before creating a component:
- [ ] Is it reusable?
- [ ] Does it have a single responsibility?
- [ ] Is it responsive?
- [ ] Is it accessible?
- [ ] Are props well-typed?
- [ ] Does it handle loading/error states?
- [ ] Is it performant?

---

*Last updated: [Date]*


