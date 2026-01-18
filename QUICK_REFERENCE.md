# Quick Reference Checklist

## Before Starting Work
- [ ] Pull latest changes from main branch
- [ ] Create feature branch with descriptive name
- [ ] Review relevant guidelines and rules

## While Coding
- [ ] TypeScript strict mode - no `any` types
- [ ] One component per file
- [ ] Mobile-first responsive design
- [ ] Error handling for all async operations
- [ ] Loading states for user feedback
- [ ] Alt text for all images
- [ ] Semantic HTML elements

## Before Committing
- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] No console.log statements
- [ ] Meaningful commit message
- [ ] Files are properly organized

## Before Creating Pull Request
- [ ] Self-review completed
- [ ] Tested on mobile device
- [ ] Tested on desktop browser
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Images/videos load correctly
- [ ] Calendar/events work correctly
- [ ] Responsive at all breakpoints
- [ ] PR description is clear
- [ ] Screenshots included (if UI changes)

## Code Review Checklist
- [ ] Follows TypeScript rules
- [ ] Follows component structure
- [ ] Error handling present
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Performance considered
- [ ] Code is reusable/modular
- [ ] Documentation updated if needed

## Pre-Deployment Checklist
- [ ] All tests pass
- [ ] Staging tested thoroughly
- [ ] Environment variables configured
- [ ] Build succeeds
- [ ] Performance targets met
- [ ] No console errors
- [ ] Mobile responsive verified
- [ ] Media files optimized

---

## Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
npm run type-check # Check TypeScript types
```

### Git Workflow
```bash
git checkout -b feature/description    # Create feature branch
git add .                              # Stage changes
git commit -m "feat: description"      # Commit with message
git push origin feature/description   # Push to remote
```

### Component Creation
1. Create file: `ComponentName.tsx`
2. Define props interface
3. Export component
4. Add to barrel export (`index.ts`)
5. Use in parent component

---

## File Naming Quick Reference

| Type | Convention | Example |
|------|-----------|---------|
| Component | `PascalCase.tsx` | `EventCard.tsx` |
| Utility | `camelCase.ts` | `formatDate.ts` |
| Hook | `useCamelCase.ts` | `useEvents.ts` |
| Type | `camelCase.types.ts` | `event.types.ts` |
| Constant | `UPPER_SNAKE_CASE.ts` | `API_ENDPOINTS.ts` |

---

## Component Structure Template

```typescript
import React from 'react';
import { ComponentProps } from './component.types';

interface ComponentProps {
  // Required props first
  requiredProp: string;
  // Optional props with defaults
  optionalProp?: number;
}

export const Component: React.FC<ComponentProps> = ({ 
  requiredProp, 
  optionalProp = 0 
}) => {
  // Hooks
  const [state, setState] = React.useState();
  
  // Effects
  React.useEffect(() => {
    // effect logic
  }, []);
  
  // Handlers
  const handleClick = () => {
    // handler logic
  };
  
  // Render
  return <div>...</div>;
};
```

---

## Error Handling Template

```typescript
try {
  const data = await fetchData();
  // success handling
} catch (error) {
  // Log error (development)
  console.error('Failed to fetch data:', error);
  // Show user-friendly message
  showError('Unable to load data. Please try again.');
}
```

---

## Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Small devices
md: '768px'   // Tablets
lg: '1024px'  // Desktops
xl: '1280px'  // Large desktops
2xl: '1536px' // Extra large
```

---

## Media Optimization Checklist

### Images
- [ ] WebP format with fallback
- [ ] Proper sizing (not too large)
- [ ] Alt text provided
- [ ] Lazy loading for below-fold
- [ ] Responsive (srcset or Next.js Image)

### Videos
- [ ] Poster image provided
- [ ] Controls available
- [ ] Captions/subtitles (if available)
- [ ] Loading state shown
- [ ] Autoplay only if muted

---

## Accessibility Quick Checks

- [ ] All images have alt text
- [ ] Buttons have accessible labels
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient (4.5:1)
- [ ] Semantic HTML used
- [ ] ARIA labels where needed

---

## Performance Quick Checks

- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading for routes/components
- [ ] Memoization where appropriate
- [ ] No unnecessary re-renders
- [ ] Bundle size reasonable

---

## Common Issues & Solutions

### TypeScript Error: "any" type
**Solution**: Define proper type or use `unknown`

### Component Too Large
**Solution**: Split into smaller components

### Not Responsive
**Solution**: Check Tailwind breakpoints, test on mobile

### Images Not Loading
**Solution**: Check paths, alt text, optimization

### Calendar Not Displaying
**Solution**: Check date formatting, timezone handling

### Performance Issues
**Solution**: Check lazy loading, memoization, bundle size

---

*Keep this reference handy during development!*


