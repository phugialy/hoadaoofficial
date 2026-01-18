# Design Tokens Reference

## Visual Design System Tokens

This document provides the complete design token system for consistent styling across the cultural organization platform.

## Color Tokens

### Brand Colors - Chinese New Year Theme

**Note**: See `CULTURAL_THEME_GUIDE.md` for complete cultural theme integration.

```typescript
export const brandColors = {
  // Primary: Traditional Chinese Red
  primary: {
    DEFAULT: '#C8102E',      // Traditional Chinese red
    50: '#fef2f2',          // Lightest - backgrounds
    100: '#fee2e2',         // Very light
    200: '#fecaca',         // Light
    300: '#fca5a5',         // Medium light
    400: '#f87171',         // Medium
    500: '#C8102E',         // Base red (traditional)
    600: '#b91c1c',         // Darker - hover
    700: '#991b1b',         // Dark - active
    800: '#7f1d1d',         // Darker
    900: '#5a1515',         // Darkest
    
    // Variations
    vibrant: '#E53E3E',     // Bright, energetic
    deep: '#8B0000',        // Deep, rich
    festive: '#FF0000',     // Pure festive red
  },
  
  // Secondary: Traditional Gold
  secondary: {
    DEFAULT: '#FFD700',      // Classic gold
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#FFD700',         // Base gold
    600: '#d97706',         // Darker
    700: '#b45309',         // Dark
    800: '#92400e',
    900: '#78350f',
    
    // Variations
    rich: '#D4AF37',        // Rich, luxurious
    bright: '#FFC125',      // Bright gold
    metallic: '#B8860B',    // Metallic gold
  },
  
  // Accent: Gold for CTAs and highlights
  accent: {
    DEFAULT: '#FFD700',      // Gold for accents
    hover: '#f59e0b',       // Darker gold on hover
    light: '#fef3c7',       // Light gold backgrounds
  },
  
  // Heritage: Deep red for cultural depth
  heritage: {
    DEFAULT: '#8B0000',      // Deep red
    light: '#b91c1c',
    dark: '#5a1515',
  },
  
  // Celebration: Festive red for events
  celebration: {
    DEFAULT: '#E53E3E',     // Vibrant red
    light: '#fca5a5',
    dark: '#b91c1c',
  },
  
  // Prosperity Green (secondary accent)
  prosperity: {
    DEFAULT: '#228B22',     // Prosperity green
    light: '#90EE90',
    dark: '#006400',
    jade: '#00A86B',        // Jade green
  },
};
```

### Semantic Colors
```typescript
export const semanticColors = {
  success: {
    light: '#d1fae5',   // Background
    DEFAULT: '#10b981', // Main
    dark: '#059669',    // Hover/active
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },
};
```

### Neutral Colors
```typescript
export const neutralColors = {
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',   // Lightest background
    100: '#f3f4f6',  // Light background
    200: '#e5e7eb',  // Borders
    300: '#d1d5db',  // Disabled
    400: '#9ca3af',  // Placeholder
    500: '#6b7280',  // Secondary text
    600: '#4b5563',  // Muted text
    700: '#374151',  // Primary text (light mode)
    800: '#1f2937',  // Dark background
    900: '#111827',  // Darkest text/background
  },
};
```

## Typography Tokens

### Font Families
```typescript
export const fontFamilies = {
  display: "'[DisplayFont]', serif",    // Headlines, hero
  body: "'[BodyFont]', sans-serif",     // Body text
  accent: "'[AccentFont]', cursive",    // Special elements (optional)
  mono: "'[MonospaceFont]', monospace", // Code, data
};
```

### Font Sizes (with line heights)
```typescript
export const fontSizes = {
  hero: {
    fontSize: '48px',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    mobile: {
      fontSize: '32px',
      lineHeight: '1.2',
    },
  },
  h1: {
    fontSize: '36px',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
    mobile: {
      fontSize: '28px',
      lineHeight: '1.3',
    },
  },
  h2: {
    fontSize: '28px',
    lineHeight: '1.3',
    mobile: {
      fontSize: '24px',
      lineHeight: '1.4',
    },
  },
  h3: {
    fontSize: '24px',
    lineHeight: '1.4',
    mobile: {
      fontSize: '20px',
    },
  },
  h4: {
    fontSize: '20px',
    lineHeight: '1.4',
    mobile: {
      fontSize: '18px',
    },
  },
  'body-lg': {
    fontSize: '18px',
    lineHeight: '1.6',
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.6',
  },
  'body-sm': {
    fontSize: '14px',
    lineHeight: '1.5',
  },
  caption: {
    fontSize: '12px',
    lineHeight: '1.4',
  },
};
```

### Font Weights
```typescript
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};
```

## Spacing Tokens

### Base Spacing Scale (4px increments)
```typescript
export const spacing = {
  0: '0px',
  1: '4px',   // xs
  2: '8px',   // sm
  3: '12px',
  4: '16px',  // md
  5: '20px',
  6: '24px',  // lg
  8: '32px',  // xl
  10: '40px',
  12: '48px', // 2xl
  16: '64px', // 3xl
  24: '96px', // 4xl
};
```

### Component Spacing
```typescript
export const componentSpacing = {
  cardPadding: {
    sm: '16px',
    md: '24px',
    lg: '32px',
  },
  sectionGap: {
    sm: '48px',
    md: '64px',
    lg: '96px',
  },
  containerPadding: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },
};
```

## Border Radius Tokens

```typescript
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px', // Circular
};
```

## Shadow Tokens

```typescript
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};
```

## Z-Index Scale

```typescript
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};
```

## Breakpoint Tokens

```typescript
export const breakpoints = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px', // 2X large devices
};
```

## Animation Tokens

### Duration
```typescript
export const animationDuration = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};
```

### Easing Functions
```typescript
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};
```

### Transitions
```typescript
export const transitions = {
  default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color 200ms, background-color 200ms, border-color 200ms',
  transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 200ms ease-in-out',
};
```

## Component-Specific Tokens

### Button Tokens
```typescript
export const buttonTokens = {
  height: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
  padding: {
    sm: '8px 16px',
    md: '12px 24px',
    lg: '16px 32px',
  },
  borderRadius: '8px',
  fontSize: {
    sm: '14px',
    md: '16px',
    lg: '18px',
  },
};
```

### Card Tokens
```typescript
export const cardTokens = {
  padding: {
    sm: '16px',
    md: '24px',
    lg: '32px',
  },
  borderRadius: '12px',
  shadow: 'md',
  hoverShadow: 'lg',
};
```

### Input Tokens
```typescript
export const inputTokens = {
  height: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
  padding: '12px 16px',
  borderRadius: '8px',
  borderWidth: '1px',
  fontSize: '16px', // Prevents iOS zoom
};
```

## Layout Tokens

### Container Widths
```typescript
export const containerWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px', // Max content width
};
```

### Grid Gutter
```typescript
export const gridGutter = {
  sm: '16px',
  md: '24px',
  lg: '32px',
};
```

### Header Heights
```typescript
export const headerHeights = {
  mobile: '56px',
  desktop: '80px',
};
```

## Media Query Helpers

```typescript
// Usage in CSS/Tailwind
export const mediaQueries = {
  sm: '@media (min-width: 640px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)',
};
```

## Accessibility Tokens

### Focus Ring
```typescript
export const focusRing = {
  width: '2px',
  offset: '2px',
  color: 'brand.primary',
  style: 'solid',
};
```

### Minimum Touch Target
```typescript
export const touchTarget = {
  minimum: '44px', // iOS/Android standard
  recommended: '48px',
};
```

### Color Contrast Ratios
```typescript
export const contrastRatios = {
  normalText: 4.5,      // WCAG AA
  largeText: 3.0,        // WCAG AA (18px+)
  enhanced: 7.0,         // WCAG AAA
};
```

## Usage in Tailwind Config

```typescript
// tailwind.config.ts
import { 
  brandColors, 
  semanticColors, 
  neutralColors,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
} from './design-tokens';

export default {
  theme: {
    extend: {
      colors: {
        brand: brandColors,
        ...semanticColors,
        ...neutralColors,
      },
      fontSize: fontSizes,
      spacing: spacing,
      borderRadius: borderRadius,
      boxShadow: shadows,
      screens: breakpoints,
    },
  },
};
```

## CSS Custom Properties (Alternative)

```css
:root {
  /* Colors */
  --color-brand-primary: #[YourColor];
  --color-brand-secondary: #[YourColor];
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  
  /* Typography */
  --font-size-hero: 48px;
  --font-size-h1: 36px;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-default: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Token Naming Convention

### Pattern: `category-variant-modifier`

Examples:
- `color-brand-primary`
- `spacing-md`
- `font-size-hero`
- `shadow-lg`
- `border-radius-md`

### Categories
- `color-*` - Colors
- `spacing-*` - Spacing
- `font-*` - Typography
- `shadow-*` - Shadows
- `border-*` - Borders
- `animation-*` - Animations
- `z-*` - Z-index

---

## Color Usage Examples

### Primary Actions (CTAs)
```typescript
// Main CTA - Red
backgroundColor: 'red-500' (#C8102E)
textColor: 'white'
hover: 'red-600' (#b91c1c)

// Secondary CTA - Gold
backgroundColor: 'gold-500' (#FFD700)
textColor: 'black' or 'red-700'
hover: 'gold-600' (#d97706)
```

### Text Colors
```typescript
// Primary text
color: 'black-rich' (#1a1a1a) or 'gray-700' (#374151)

// Headings
color: 'red-700' (#991b1b) or 'black-rich' (#1a1a1a)

// Accent text
color: 'gold-700' (#b45309) or 'red-600' (#b91c1c)
```

### Background Colors
```typescript
// Main background
backgroundColor: 'white-pure' (#ffffff)

// Card backgrounds
backgroundColor: 'white-pure' (#ffffff) or 'gray-50' (#f9fafb)

// Accent backgrounds
backgroundColor: 'red-50' (#fef2f2) or 'gold-50' (#fffbeb)
```

## Accessibility - Color Contrast

### ✅ Meets WCAG AA (4.5:1)
- Red-500 (#C8102E) on White: **7.2:1**
- Red-700 (#991b1b) on White: **8.5:1**
- White on Red-500: **7.2:1**

### ⚠️ Recommendations
- **Gold-500 (#FFD700) on White**: 1.9:1 - Use darker gold (gold-600+) for text
- **Text on Gold**: Use black or dark red, not white
- **Text on Red**: Use white or gold, not black

## Color Combinations

### Red + Gold (Festive, Traditional)
- Hero backgrounds: Red with gold text
- Event cards: Red border, gold badge
- Buttons: Red primary, gold secondary

### Red + White (Clean, Modern)
- Content cards: White background, red accents
- Navigation: White background, red active states

### Gold + Black (Luxurious, Premium)
- Premium content: Gold accents, black text

---

*These design tokens ensure visual consistency across the entire platform.*  
*See CULTURAL_THEME_GUIDE.md for cultural context.*  
*Last updated: [Date]*

