/**
 * Animation Utilities for Chinese New Year Lion Dance Theme
 * 
 * Ready-to-use animation functions and constants
 */

// Animation Duration Constants
export const ANIMATION_DURATION = {
  fast: 150,
  base: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  celebration: 1000,
} as const;

// Easing Functions
export const EASING = {
  // Standard
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Festive/Celebratory
  festive: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy
  dramatic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // Smooth entrance
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',     // Elastic bounce
} as const;

// Theme Colors for Animations
export const ANIMATION_COLORS = {
  red: {
    primary: '#C8102E',
    vibrant: '#E53E3E',
    deep: '#8B0000',
  },
  gold: {
    primary: '#FFD700',
    rich: '#D4AF37',
    bright: '#FFC125',
  },
} as const;

// Tailwind Animation Classes (for use with Tailwind)
export const TAILWIND_ANIMATIONS = {
  // Confetti
  confetti: 'animate-confetti',
  
  // Lion Dance
  lionBob: 'animate-lion-bob',
  lionDance: 'animate-lion-dance',
  lionEntrance: 'animate-lion-entrance',
  
  // Festive
  firecracker: 'animate-firecracker',
  sparkle: 'animate-sparkle',
  shimmer: 'animate-shimmer',
  
  // Drum
  drumBeat: 'animate-drum-beat',
  ripple: 'animate-ripple',
  
  // General
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideIn: 'animate-slide-in',
  slideOut: 'animate-slide-out',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
} as const;

// CSS Keyframes (to add to global CSS or Tailwind config)
export const CSS_KEYFRAMES = `
/* Lion Dance Animations */
@keyframes lion-bob {
  0%, 100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

@keyframes lion-dance {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(-5deg);
  }
  75% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes lion-entrance {
  0% {
    opacity: 0;
    transform: translateX(-100px) scale(0.8) rotateY(-20deg);
  }
  50% {
    transform: translateX(10px) scale(1.05) rotateY(5deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0deg);
  }
}

/* Festive Animations */
@keyframes confetti {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(500px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes firecracker {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes sparkle {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0) translateY(-20px);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}

/* Drum Animations */
@keyframes drum-beat {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 20px rgba(200, 16, 46, 0);
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* General Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
`;

// Utility Functions

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation style with reduced motion support
 */
export const getAnimationStyle = (
  duration: number,
  easing: string = EASING.easeInOut,
  shouldAnimate: boolean = true
): React.CSSProperties => {
  if (prefersReducedMotion() || !shouldAnimate) {
    return {
      transition: 'none',
    };
  }

  return {
    transition: `all ${duration}ms ${easing}`,
  };
};

/**
 * Create staggered animation delays
 */
export const getStaggerDelay = (index: number, baseDelay: number = 100): number => {
  return index * baseDelay;
};

/**
 * Generate confetti colors (red & gold theme)
 */
export const getConfettiColors = (): string[] => {
  return [
    ANIMATION_COLORS.red.primary,
    ANIMATION_COLORS.red.vibrant,
    ANIMATION_COLORS.gold.primary,
    ANIMATION_COLORS.gold.rich,
    ANIMATION_COLORS.gold.bright,
  ];
};

/**
 * Intersection Observer hook for scroll animations
 */
export const createScrollObserver = (
  callback: (isIntersecting: boolean) => void,
  threshold: number = 0.1
): IntersectionObserver => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        callback(entry.isIntersecting);
      });
    },
    { threshold }
  );
};

/**
 * Debounce function for scroll/resize events
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for scroll/resize events
 */
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// React Hook for Scroll Animation
import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return [ref, isVisible] as const;
};

// React Hook for Parallax Effect
export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setOffset(window.scrollY * speed);
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset] as const;
};

// Animation Presets
export const ANIMATION_PRESETS = {
  // Page transitions
  pageEnter: {
    duration: ANIMATION_DURATION.slow,
    easing: EASING.easeOut,
    properties: {
      opacity: [0, 1],
      transform: ['translateY(20px)', 'translateY(0)'],
    },
  },
  
  // Card entrance
  cardEnter: {
    duration: ANIMATION_DURATION.normal,
    easing: EASING.easeOut,
    properties: {
      opacity: [0, 1],
      transform: ['scale(0.95)', 'scale(1)'],
    },
  },
  
  // Festive celebration
  celebration: {
    duration: ANIMATION_DURATION.celebration,
    easing: EASING.festive,
    properties: {
      transform: ['scale(1)', 'scale(1.1)', 'scale(1)'],
    },
  },
  
  // Lion dance entrance
  lionEntrance: {
    duration: ANIMATION_DURATION.slower,
    easing: EASING.dramatic,
    properties: {
      opacity: [0, 1],
      transform: ['translateX(-100px) scale(0.8)', 'translateX(0) scale(1)'],
    },
  },
} as const;


