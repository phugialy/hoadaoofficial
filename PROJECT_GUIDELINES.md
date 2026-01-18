# HoadaoOfficial - Project Guidelines & Rules

## Project Overview
A cultural organization platform featuring:
- Video/image showcases
- Team advertising and profiles
- Calendar and events system (daily/weekly)
- Multi-audience support (members, customers, audiences)
- Responsive web and mobile views

## 1. Project Structure

### Directory Organization
```
/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components (buttons, cards, etc.)
│   │   ├── media/          # Video/image display components
│   │   ├── calendar/       # Calendar and event components
│   │   └── team/           # Team-related components
│   ├── pages/              # Page-level components/views
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── services/           # API/data services
│   ├── contexts/           # React contexts (state management)
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles, themes
│   └── assets/             # Static assets (images, icons)
├── public/                 # Public static files
└── docs/                   # Documentation
```

### Component Organization Rules
- **One component per file** - Each component in its own file
- **Co-location** - Related components can share a folder
- **Barrel exports** - Use index.ts files for clean imports
- **Naming** - PascalCase for components, camelCase for utilities

## 2. Technology Stack Recommendations

### Frontend Framework
- **React** (with TypeScript) - Component-based, reusable UI
- **Next.js** (optional) - If SSR/SSG needed for SEO
- **Vite** (alternative) - Fast development, modern tooling

### UI/Styling
- **Tailwind CSS** - Utility-first, responsive by default
- **CSS Modules** or **Styled Components** - For component-scoped styles
- **Responsive breakpoints**: Mobile-first approach

### State Management
- **React Context API** - For global state (user, theme, events)
- **React Query/TanStack Query** - For server state (API data)
- **Zustand** (optional) - Lightweight state management if needed

### Media Handling
- **React Player** or **Video.js** - Video playback
- **Image optimization** - Next.js Image or similar
- **Lazy loading** - For performance

### Calendar/Events
- **FullCalendar** or **React Big Calendar** - Calendar UI
- **date-fns** or **Day.js** - Date manipulation utilities

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** or **Yup** - Schema validation

## 3. UI/UX Guidelines

### Responsive Design Principles
1. **Mobile-First Approach**
   - Design for mobile screens first (320px+)
   - Progressive enhancement for larger screens
   - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

2. **Touch-Friendly Interactions**
   - Minimum touch target: 44x44px
   - Adequate spacing between interactive elements
   - Swipe gestures for mobile navigation

3. **Viewport Optimization**
   - Use viewport meta tags correctly
   - Test on real devices when possible
   - Consider landscape/portrait orientations

### Media Display Rules
1. **Images**
   - Always provide alt text for accessibility
   - Use responsive images (srcset, sizes)
   - Implement lazy loading for below-fold content
   - Support multiple formats (WebP with fallback)

2. **Videos**
   - Provide poster images
   - Include captions/subtitles for accessibility
   - Auto-play only with muted option
   - Provide play/pause controls
   - Consider bandwidth: offer quality options if possible

3. **Performance**
   - Optimize media file sizes
   - Use CDN for media delivery
   - Implement progressive loading
   - Show loading states/skeletons

### Accessibility (a11y)
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios (WCAG AA minimum)
- Screen reader compatibility

## 4. Calendar & Events System

### Event Data Structure
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  category: 'daily' | 'weekly' | 'special';
  imageUrl?: string;
  videoUrl?: string;
  attendees?: string[];
  public: boolean;
}
```

### Calendar Features
- Calendar view (month/week/day)
- List view for upcoming events
- Event filtering by category
- Event search functionality
- Event detail pages
- RSVP/registration (if needed)

### Event Display Rules
- Show upcoming events prominently
- Highlight daily/weekly recurring events
- Past events in archive view
- Clear date/time formatting
- Timezone handling

## 5. Code Quality Standards

### TypeScript
- **Strict mode enabled** - Type safety is mandatory
- **No `any` types** - Use `unknown` or proper types
- **Interface over type** - For object shapes
- **Type definitions** - All props, functions, and data structures

### Component Patterns
```typescript
// Component structure template
interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return <div>...</div>;
};
```

### Error Handling
- **Try-catch blocks** - For async operations
- **Error boundaries** - React error boundaries for component errors
- **User-friendly messages** - Never expose technical errors to users
- **Logging** - Console errors in development, proper logging in production

### Performance
- **Code splitting** - Lazy load routes/components
- **Memoization** - React.memo, useMemo, useCallback when appropriate
- **Virtual scrolling** - For long lists
- **Debounce/throttle** - For search, scroll handlers

## 6. Development Workflow

### Git Workflow
- **Feature branches** - One feature per branch
- **Meaningful commits** - Clear commit messages
- **Pull requests** - Code review before merge
- **Branch naming** - `feature/`, `fix/`, `refactor/`

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Accessibility considerations
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] No console.logs in production code
- [ ] Comments explain "why" not "what"

### Testing Strategy
- **Manual testing** - On multiple devices/browsers
- **Responsive testing** - All breakpoints
- **Accessibility testing** - Keyboard navigation, screen readers
- **Performance testing** - Lighthouse scores

## 7. File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `EventCard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Hooks**: `useCamelCase.ts` (e.g., `useEvents.ts`)
- **Types**: `camelCase.types.ts` (e.g., `event.types.ts`)
- **Constants**: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

## 8. State Management Rules

### When to Use Context
- User authentication state
- Theme preferences
- Global UI state (modals, notifications)
- App-wide settings

### When to Use Local State
- Form inputs
- Component-specific UI state
- Temporary calculations
- Component-scoped interactions

### When to Use Server State (React Query)
- API data fetching
- Caching and synchronization
- Background updates
- Optimistic updates

## 9. API & Data Management

### Data Fetching
- **Centralized API client** - Single source for API calls
- **Error handling** - Consistent error response handling
- **Loading states** - Show loading indicators
- **Caching strategy** - Cache frequently accessed data

### Data Structure
- **Normalized data** - Avoid nested duplicates
- **Type safety** - Type all API responses
- **Validation** - Validate API responses at runtime

## 10. Security Considerations

- **Input validation** - Validate all user inputs
- **XSS prevention** - Sanitize user-generated content
- **CSRF protection** - If using forms
- **Environment variables** - Never commit secrets
- **HTTPS** - Always use secure connections

## 11. Documentation Requirements

- **README.md** - Project setup, installation, overview
- **Component docs** - JSDoc comments for complex components
- **API docs** - Document API endpoints and data structures
- **Deployment guide** - How to deploy the application

## 12. Performance Targets

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Mobile-friendly** - Google Mobile-Friendly Test pass

## 13. Browser Support

- **Modern browsers** - Latest 2 versions of Chrome, Firefox, Safari, Edge
- **Mobile browsers** - iOS Safari, Chrome Mobile
- **Progressive enhancement** - Graceful degradation for older browsers

---

## Quick Reference Checklist

Before submitting code:
- [ ] TypeScript strict mode passes
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] Performance optimized (lazy loading, memoization)
- [ ] No console.logs
- [ ] Code is reusable and modular
- [ ] Comments explain complex logic
- [ ] Media files optimized

---

*Last updated: [Date]*
*Project: HoadaoOfficial - Cultural Organization Platform*


