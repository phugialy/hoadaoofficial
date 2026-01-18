# Development Rules

## Code Rules

### 1. TypeScript Rules
- **MANDATORY**: All files must use TypeScript (.tsx for components, .ts for utilities)
- **NO `any` types**: Use `unknown` or proper types. If unsure, create an interface/type
- **Strict mode**: Always enabled - no exceptions
- **Type everything**: Props, return values, function parameters, state, API responses
- **Interfaces for objects**: Use `interface` for object shapes, `type` for unions/intersections

### 2. Component Rules
- **One component per file**: Each component gets its own file
- **Named exports**: Use `export const ComponentName` not default exports
- **Props interface**: Always define props interface above component
- **Component size**: Keep components under 200 lines. Split if larger
- **No inline styles**: Use CSS classes, Tailwind, or styled-components
- **Prop validation**: Use TypeScript, no PropTypes needed

### 3. File Organization Rules
- **Barrel exports**: Use `index.ts` files to export from folders
- **Co-location**: Related files stay together (component + styles + types)
- **Naming consistency**: 
  - Components: `PascalCase.tsx`
  - Utilities: `camelCase.ts`
  - Hooks: `useCamelCase.ts`
  - Types: `camelCase.types.ts`
  - Constants: `UPPER_SNAKE_CASE.ts`

### 4. Import Rules
- **Absolute imports**: Use path aliases (e.g., `@/components`, `@/utils`)
- **Import order**: 
  1. External libraries
  2. Internal absolute imports
  3. Relative imports
  4. Types (with `type` keyword)
- **No circular dependencies**: If detected, refactor immediately

### 5. State Management Rules
- **Local state first**: Use `useState` unless state needs to be shared
- **Context for global**: Only use Context for truly global state (user, theme)
- **React Query for server state**: All API data goes through React Query
- **No prop drilling**: If passing props through 3+ levels, use Context
- **State location**: Keep state as close to where it's used as possible

## Component Creation Rules

### Before Creating a Component
1. **Check for existing**: Search codebase for similar components
2. **Reusability**: Will this be used in 2+ places? If yes, make it reusable
3. **Single responsibility**: One component = one purpose
4. **Props design**: Minimal required props, sensible defaults

### Component Structure (Required Order)
```typescript
// 1. Imports
import React from 'react';
import { SomeType } from '@/types';

// 2. Types/Interfaces
interface ComponentProps {
  // props
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks (in order: useState, useEffect, custom hooks)
  // 5. Handlers
  // 6. Render
  return <div>...</div>;
};
```

### Component Props Rules
- **Required props first**: List required props before optional
- **Default values**: Use default parameters for optional props
- **Destructuring**: Always destructure props in function signature
- **No prop spreading**: Avoid `{...props}` unless building wrapper components

## Styling Rules

### CSS/Tailwind Rules
- **Mobile-first**: Write mobile styles first, then add breakpoints
- **Utility classes**: Prefer Tailwind utilities over custom CSS
- **Custom CSS**: Only when utility classes are insufficient
- **No inline styles**: Exception: dynamic styles that change at runtime
- **Consistent spacing**: Use Tailwind spacing scale (4px increments)

### Responsive Rules
- **Breakpoint usage**: Always test at sm, md, lg, xl breakpoints
- **Touch targets**: Minimum 44x44px on mobile
- **Text size**: Minimum 16px for body text (prevents iOS zoom)
- **Viewport meta**: Always include in HTML head

## Error Handling Rules

### Required Error Handling
- **Try-catch**: All async operations (API calls, file operations)
- **Error boundaries**: At least one error boundary at app level
- **User messages**: Never show technical errors to users
- **Logging**: Log errors to console in development, proper service in production
- **Fallback UI**: Always provide fallback for failed operations

### Error Message Rules
- **User-friendly**: "Unable to load events" not "Error 500"
- **Actionable**: Tell user what they can do
- **No stack traces**: Never expose stack traces to users

## Performance Rules

### Required Optimizations
- **Lazy loading**: Routes and heavy components
- **Image optimization**: Always use optimized images (WebP, proper sizing)
- **Code splitting**: Split by route, not by component (unless component is heavy)
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback` when:
  - Component re-renders frequently with same props
  - Expensive calculations
  - Callbacks passed to child components

### Performance Anti-Patterns (DO NOT)
- **No unnecessary re-renders**: Avoid creating objects/arrays in render
- **No inline functions**: In JSX unless absolutely necessary
- **No large bundles**: Keep initial bundle under 200KB (gzipped)

## Media Handling Rules

### Image Rules
- **Alt text**: Required for all images (empty string `""` only if decorative)
- **Responsive images**: Use `srcset` or Next.js Image component
- **Lazy loading**: All below-fold images
- **Format**: WebP with fallback to JPG/PNG
- **Sizing**: Provide width/height to prevent layout shift

### Video Rules
- **Poster image**: Required for all videos
- **Controls**: Always provide play/pause controls
- **Autoplay**: Only if muted and user-initiated
- **Captions**: Provide captions/subtitles when available
- **Loading**: Show loading state while video loads

## API & Data Rules

### API Call Rules
- **Centralized client**: All API calls through single client/service
- **Error handling**: Every API call must handle errors
- **Loading states**: Show loading indicators for async operations
- **Type safety**: Type all API requests and responses
- **Validation**: Validate API responses match expected types

### Data Fetching Rules
- **React Query**: Use for all server state
- **Caching**: Leverage React Query caching (don't refetch unnecessarily)
- **Optimistic updates**: Use for better UX where appropriate
- **Refetch strategy**: Define when data should refetch (on mount, on focus, etc.)

## Calendar & Events Rules

### Event Data Rules
- **Date handling**: Always use date-fns or Day.js (no native Date manipulation)
- **Timezone**: Store dates in UTC, display in user's timezone
- **Validation**: Validate event dates (start < end, no past events for creation)
- **Categories**: Use enum/union type for event categories

### Calendar Display Rules
- **Today highlight**: Always highlight current date
- **Event indicators**: Show event count or indicator on dates with events
- **Navigation**: Provide clear prev/next month navigation
- **Responsive**: Calendar must work on mobile (consider list view)

## Git & Version Control Rules

### Commit Rules
- **Meaningful messages**: Clear, descriptive commit messages
- **Conventional commits**: Use prefixes (feat:, fix:, refactor:, docs:)
- **Atomic commits**: One logical change per commit
- **No WIP commits**: Don't commit broken code to main/master

### Branch Rules
- **Feature branches**: One feature per branch
- **Branch naming**: `feature/description`, `fix/description`, `refactor/description`
- **Keep updated**: Regularly merge/rebase from main
- **Delete after merge**: Delete feature branches after merging

### Pull Request Rules
- **Self-review**: Review your own PR before requesting review
- **Description**: Clear description of changes
- **Testing**: Test on multiple devices/browsers
- **Screenshots**: Include screenshots for UI changes
- **Small PRs**: Keep PRs focused and reasonably sized

## Testing Rules

### Manual Testing Requirements
- **Multiple browsers**: Chrome, Firefox, Safari, Edge
- **Multiple devices**: Mobile (iOS/Android), Tablet, Desktop
- **Responsive**: Test all breakpoints
- **Accessibility**: Keyboard navigation, screen reader
- **Performance**: Check Lighthouse scores

### Testing Checklist (Before PR)
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1024px+)
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] Images load correctly
- [ ] Videos play correctly
- [ ] Calendar displays correctly
- [ ] Events filter/search works
- [ ] Forms validate correctly

## Code Review Rules

### Reviewer Responsibilities
- **Check guidelines**: Ensure code follows project guidelines
- **Test functionality**: Actually test the changes
- **Check types**: Verify TypeScript types are correct
- **Check responsive**: Verify responsive design
- **Check accessibility**: Verify accessibility requirements
- **Provide feedback**: Constructive, actionable feedback

### Author Responsibilities
- **Address feedback**: Respond to all review comments
- **Update PR**: Keep PR updated with fixes
- **Be responsive**: Respond to reviews promptly
- **Explain decisions**: Explain non-obvious choices

## Documentation Rules

### Code Documentation
- **JSDoc comments**: For complex functions/components
- **Explain "why"**: Comments explain why, not what
- **Type comments**: Use TypeScript types instead of comments when possible
- **README updates**: Update README for new features/setup changes

### Component Documentation
- **Props documentation**: Document all props (use TypeScript + JSDoc)
- **Usage examples**: Include usage examples in component file or Storybook
- **Edge cases**: Document known edge cases or limitations

## Security Rules

### Required Security Practices
- **No secrets in code**: Use environment variables
- **Input validation**: Validate all user inputs
- **XSS prevention**: Sanitize user-generated content
- **HTTPS only**: All API calls over HTTPS
- **CORS**: Properly configure CORS if needed

### Data Handling Rules
- **No sensitive data in logs**: Don't log passwords, tokens, personal data
- **Sanitize data**: Sanitize data before displaying
- **Rate limiting**: Implement rate limiting for API calls if needed

## Accessibility Rules (a11y)

### Required Accessibility
- **Semantic HTML**: Use proper HTML elements (button, nav, main, etc.)
- **ARIA labels**: Use when semantic HTML isn't sufficient
- **Keyboard navigation**: All interactive elements keyboard accessible
- **Focus indicators**: Visible focus states
- **Color contrast**: Minimum 4.5:1 for text
- **Alt text**: All images have descriptive alt text

### Accessibility Testing
- **Keyboard only**: Test navigation with keyboard only
- **Screen reader**: Test with screen reader (NVDA, JAWS, VoiceOver)
- **Color blind**: Don't rely solely on color for information

## Deployment Rules

### Pre-Deployment Checklist
- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Performance targets met
- [ ] Accessibility requirements met
- [ ] Mobile responsive verified
- [ ] All media optimized

### Deployment Process
- **Staging first**: Deploy to staging before production
- **Test staging**: Thoroughly test staging environment
- **Production deploy**: Only after staging approval
- **Monitor**: Monitor after deployment for errors

## Code Quality Rules

### Code Smell Indicators (Refactor If You See)
- **Duplication**: Same code in 2+ places
- **Long functions**: Functions over 50 lines
- **Deep nesting**: More than 3 levels of nesting
- **Magic numbers**: Use named constants
- **Complex conditionals**: Extract to functions
- **God components**: Components doing too much

### Refactoring Rules
- **Small steps**: Refactor in small, incremental steps
- **Tests first**: Write tests before major refactoring
- **One thing at a time**: Don't refactor and add features simultaneously
- **Document decisions**: Document why refactoring was needed

## Emergency Rules

### When Things Break
1. **Don't panic**: Assess the situation
2. **Check logs**: Review error logs
3. **Rollback if needed**: Have rollback plan ready
4. **Fix in staging**: Never fix directly in production
5. **Test thoroughly**: Test fix before deploying
6. **Document issue**: Document what broke and why

### Hotfix Process
- **Create hotfix branch**: From production/main
- **Minimal change**: Only fix the critical issue
- **Test quickly**: Test the specific fix
- **Deploy carefully**: Deploy with extra caution
- **Follow up**: Create proper fix in feature branch later

---

## Rule Violations

### Handling Violations
- **Code review**: Catch violations in code review
- **Linting**: Use ESLint to catch common violations
- **Type checking**: TypeScript catches type violations
- **Team discussion**: Discuss persistent violations as a team

### Rule Updates
- **Evolving rules**: Rules can be updated based on team feedback
- **Document changes**: Document why rules change
- **Team consensus**: Major rule changes require team discussion

---

## Quick Reference: DO's and DON'Ts

### DO
✅ Use TypeScript for everything
✅ Create reusable components
✅ Handle errors gracefully
✅ Test on multiple devices
✅ Use semantic HTML
✅ Optimize images and media
✅ Write meaningful commit messages
✅ Document complex logic
✅ Keep components small and focused
✅ Use mobile-first approach

### DON'T
❌ Use `any` type
❌ Commit secrets or API keys
❌ Skip error handling
❌ Ignore accessibility
❌ Use inline styles
❌ Create components that are too large
❌ Skip testing
❌ Use magic numbers/strings
❌ Ignore TypeScript errors
❌ Deploy without testing

---

*These rules are mandatory for all development work on this project.*
*Last updated: [Date]*


