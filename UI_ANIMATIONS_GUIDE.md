# UI Animations Guide
## Unique & Standout Animations for Chinese New Year Lion Dance Theme

## Animation Philosophy

**Goal**: Create memorable, culturally-appropriate animations that enhance the festive spirit while maintaining professional quality and performance.

**Principles**:
- **Cultural relevance**: Animations inspired by Lion Dance and Chinese New Year traditions
- **Performance first**: Smooth 60fps animations, optimized for all devices
- **Accessibility**: Respect `prefers-reduced-motion`
- **Purposeful**: Every animation serves a purpose (celebration, guidance, feedback)

## Animation Categories

### 1. Festive Celebrations
### 2. Lion Dance Inspired
### 3. Page Transitions
### 4. Micro-Interactions
### 5. Loading States
### 6. Scroll Animations

---

## 1. Festive Celebration Animations

### Confetti Explosion
**Use Case**: Event confirmations, successful actions, special announcements

```typescript
// components/animations/ConfettiExplosion.tsx
import React, { useEffect, useRef } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiExplosionProps {
  trigger: boolean;
  colors?: string[];
  particleCount?: number;
}

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  trigger,
  colors = ['#C8102E', '#FFD700', '#E53E3E', '#D4AF37'], // Red & Gold theme
  particleCount = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }));

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // Gravity
        particle.rotation += particle.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();

        // Remove if out of bounds
        return (
          particle.x > -50 &&
          particle.x < canvas.width + 50 &&
          particle.y < canvas.height + 50
        );
      });

      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trigger, colors, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ willChange: 'transform' }}
    />
  );
};
```

### Firecracker Burst
**Use Case**: Page loads, event highlights, countdown completions

```typescript
// components/animations/FirecrackerBurst.tsx
import React, { useEffect, useState } from 'react';

interface FirecrackerBurstProps {
  trigger: boolean;
  position?: { x: number; y: number };
}

export const FirecrackerBurst: React.FC<FirecrackerBurstProps> = ({
  trigger,
  position = { x: 50, y: 50 },
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!isAnimating) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative w-4 h-4">
        {/* Central burst */}
        <div className="absolute inset-0 bg-gold-500 rounded-full animate-ping" />
        <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse" />
        
        {/* Radial sparks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gold-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-30px)`,
              animation: `sparkle 0.8s ease-out forwards`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-30px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-80px) scale(0);
          }
        }
      `}</style>
    </div>
  );
};
```

### Red Envelope Reveal
**Use Case**: Special announcements, rewards, exclusive content

```typescript
// components/animations/RedEnvelopeReveal.tsx
import React, { useState } from 'react';

interface RedEnvelopeRevealProps {
  children: React.ReactNode;
  onReveal?: () => void;
}

export const RedEnvelopeReveal: React.FC<RedEnvelopeRevealProps> = ({
  children,
  onReveal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      onReveal?.();
    }
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      {/* Red Envelope */}
      <div
        className={`transition-all duration-500 ${
          isOpen ? 'opacity-0 scale-0 rotate-12' : 'opacity-100 scale-100'
        }`}
      >
        <div className="bg-red-500 w-48 h-64 rounded-lg shadow-2xl relative overflow-hidden">
          {/* Gold border */}
          <div className="absolute inset-0 border-4 border-gold-500 rounded-lg" />
          
          {/* Gold character/pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold-500 text-6xl font-bold">福</span>
          </div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Content Reveal */}
      <div
        className={`transition-all duration-500 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 absolute inset-0'
        }`}
      >
        <div className="bg-gold-50 border-4 border-gold-500 rounded-lg p-6 shadow-2xl">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};
```

---

## 2. Lion Dance Inspired Animations

### Lion Head Bob
**Use Case**: Loading states, waiting indicators, playful interactions

```typescript
// components/animations/LionHeadBob.tsx
import React from 'react';

interface LionHeadBobProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LionHeadBob: React.FC<LionHeadBobProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} relative animate-lion-bob`}
        style={{
          animation: 'lionBob 1s ease-in-out infinite',
        }}
      >
        {/* Lion Head SVG/Emoji */}
        <div className="text-6xl">🦁</div>
        
        {/* Or use custom SVG */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
        >
          {/* Lion head shape */}
          <circle cx="50" cy="50" r="40" fill="#FFD700" />
          <circle cx="40" cy="45" r="5" fill="#000" />
          <circle cx="60" cy="45" r="5" fill="#000" />
          <path d="M 35 60 Q 50 70 65 60" stroke="#C8102E" strokeWidth="3" fill="none" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes lionBob {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
};
```

### Lion Dance Entrance
**Use Case**: Page transitions, hero section, major announcements

```typescript
// components/animations/LionDanceEntrance.tsx
import React, { useEffect, useState } from 'react';

interface LionDanceEntranceProps {
  children: React.ReactNode;
  delay?: number;
}

export const LionDanceEntrance: React.FC<LionDanceEntranceProps> = ({
  children,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-x-0 scale-100'
          : 'opacity-0 -translate-x-full scale-95'
      }`}
      style={{
        animation: isVisible ? 'lionEntrance 1s ease-out' : 'none',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes lionEntrance {
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
      `}</style>
    </div>
  );
};
```

### Drum Beat Pulse
**Use Case**: Event countdowns, important notifications, rhythm indicators

```typescript
// components/animations/DrumBeatPulse.tsx
import React, { useEffect, useState } from 'react';

interface DrumBeatPulseProps {
  active: boolean;
  beatInterval?: number; // milliseconds
}

export const DrumBeatPulse: React.FC<DrumBeatPulseProps> = ({
  active,
  beatInterval = 500,
}) => {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setBeat((prev) => prev + 1);
    }, beatInterval);

    return () => clearInterval(interval);
  }, [active, beatInterval]);

  return (
    <div className="relative">
      {/* Drum visual */}
      <div
        className="w-20 h-20 bg-red-600 rounded-full border-4 border-gold-500 flex items-center justify-center shadow-lg"
        style={{
          animation: active ? 'drumBeat 0.5s ease-in-out' : 'none',
          animationIterationCount: 'infinite',
        }}
      >
        <span className="text-white text-2xl font-bold">🥁</span>
      </div>

      {/* Ripple effect */}
      {active && (
        <div
          className="absolute inset-0 rounded-full border-4 border-gold-400"
          style={{
            animation: `ripple 1s ease-out infinite`,
            animationDelay: '0s',
          }}
        />
      )}

      <style jsx>{`
        @keyframes drumBeat {
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
      `}</style>
    </div>
  );
};
```

---

## 3. Page Transitions

### Red & Gold Fade Transition
**Use Case**: Route changes, page navigation

```typescript
// components/animations/PageTransition.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'entering' | 'entered'>('entered');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('entering');
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('entered');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === 'entering'
          ? 'opacity-0 scale-95'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: transitionStage === 'entering'
          ? 'linear-gradient(135deg, #C8102E 0%, #FFD700 100%)'
          : 'transparent',
      }}
    >
      {children}
    </div>
  );
};
```

### Slide with Gold Accent
**Use Case**: Modal appearances, drawer animations

```typescript
// components/animations/SlideWithGoldAccent.tsx
import React from 'react';

interface SlideWithGoldAccentProps {
  isOpen: boolean;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

export const SlideWithGoldAccent: React.FC<SlideWithGoldAccentProps> = ({
  isOpen,
  children,
  direction = 'right',
}) => {
  const directionClasses = {
    left: 'translate-x-full',
    right: '-translate-x-full',
    top: 'translate-y-full',
    bottom: '-translate-y-full',
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Gold accent line */}
      <div
        className={`absolute bg-gold-500 transition-all duration-500 ${
          direction === 'left' || direction === 'right'
            ? 'w-1 h-full top-0'
            : 'h-1 w-full left-0'
        } ${
          isOpen
            ? direction === 'left'
              ? 'left-0'
              : direction === 'right'
              ? 'right-0'
              : direction === 'top'
              ? 'top-0'
              : 'bottom-0'
            : directionClasses[direction]
        }`}
      />

      {/* Content */}
      <div
        className={`h-full transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : directionClasses[direction]
        }`}
      >
        {children}
      </div>
    </div>
  );
};
```

---

## 4. Micro-Interactions

### Red to Gold Hover Glow
**Use Case**: Buttons, cards, interactive elements

```typescript
// Tailwind classes or custom component
export const GlowButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <button className="relative px-6 py-3 bg-red-500 text-white rounded-lg overflow-hidden group">
      <span className="relative z-10">{children}</span>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shine sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  );
};
```

### Lion Paw Tap
**Use Case**: Click feedback, button presses

```typescript
// components/animations/LionPawTap.tsx
import React, { useState } from 'react';

interface LionPawTapProps {
  children: React.ReactNode;
  onTap?: () => void;
}

export const LionPawTap: React.FC<LionPawTapProps> = ({ children, onTap }) => {
  const [isTapping, setIsTapping] = useState(false);

  const handleTap = () => {
    setIsTapping(true);
    onTap?.();
    setTimeout(() => setIsTapping(false), 200);
  };

  return (
    <div
      onClick={handleTap}
      className={`cursor-pointer transition-transform duration-200 ${
        isTapping ? 'scale-95' : 'scale-100'
      }`}
    >
      {children}
      
      {/* Paw print effect */}
      {isTapping && (
        <div className="absolute pointer-events-none">
          <span className="text-4xl opacity-50 animate-fade-out">🐾</span>
        </div>
      )}
    </div>
  );
};
```

### Gold Sparkle on Hover
**Use Case**: Premium content, special features

```typescript
// components/animations/GoldSparkle.tsx
import React, { useState } from 'react';

interface GoldSparkleProps {
  children: React.ReactNode;
}

export const GoldSparkle: React.FC<GoldSparkleProps> = ({ children }) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newSparkle = {
      id: Date.now(),
      x,
      y,
    };

    setSparkles((prev) => [...prev.slice(-4), newSparkle]);

    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1000);
  };

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSparkles([])}
    >
      {children}
      
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-2 h-2 bg-gold-400 rounded-full animate-sparkle" />
        </div>
      ))}

      <style jsx>{`
        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) translateY(-20px);
          }
        }
        .animate-sparkle {
          animation: sparkle 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
```

---

## 5. Loading States

### Lion Dance Loading
**Use Case**: Page loads, data fetching

```typescript
// components/loading/LionDanceLoading.tsx
export const LionDanceLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {/* Animated Lion */}
      <div className="relative w-32 h-32 mb-4">
        <div className="absolute inset-0 animate-lion-dance">
          <span className="text-8xl">🦁</span>
        </div>
        
        {/* Drum beats */}
        <div className="absolute -left-8 top-1/2 animate-drum-beat">
          <span className="text-4xl">🥁</span>
        </div>
        <div className="absolute -right-8 top-1/2 animate-drum-beat" style={{ animationDelay: '0.3s' }}>
          <span className="text-4xl">🥁</span>
        </div>
      </div>

      <p className="text-red-600 font-semibold animate-pulse">Loading...</p>

      <style jsx>{`
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

        @keyframes drum-beat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .animate-lion-dance {
          animation: lion-dance 1s ease-in-out infinite;
        }

        .animate-drum-beat {
          animation: drum-beat 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
```

### Red & Gold Skeleton
**Use Case**: Content loading, placeholder states

```typescript
// components/loading/RedGoldSkeleton.tsx
export const RedGoldSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gradient-to-r from-red-200 via-gold-200 to-red-200 rounded w-3/4" />
      <div className="h-4 bg-gradient-to-r from-gold-200 via-red-200 to-gold-200 rounded w-1/2" />
      <div className="h-32 bg-gradient-to-r from-red-100 via-gold-100 to-red-100 rounded" />
    </div>
  );
};
```

---

## 6. Scroll Animations

### Fade In with Red Accent
**Use Case**: Content reveals on scroll

```typescript
// hooks/useScrollAnimation.ts
import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible] as const;
};

// Usage in component
export const ScrollReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{
        borderLeft: isVisible ? '4px solid #C8102E' : '4px solid transparent',
        transition: 'all 0.8s ease-out',
      }}
    >
      {children}
    </div>
  );
};
```

### Parallax Lion
**Use Case**: Hero sections, background elements

```typescript
// components/animations/ParallaxLion.tsx
import { useEffect, useRef, useState } from 'react';

export const ParallaxLion: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none opacity-20"
      style={{
        transform: `translateY(${parallaxOffset}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="text-9xl text-gold-500">🦁</div>
    </div>
  );
};
```

---

## Performance Optimization

### Use CSS Animations When Possible
```css
/* Prefer CSS over JavaScript for performance */
.animate-festive {
  animation: festive 2s ease-in-out infinite;
}

@keyframes festive {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### GPU Acceleration
```typescript
// Use transform and opacity for smooth animations
className="transform transition-transform duration-300"
style={{ willChange: 'transform' }}
```

### Reduce Motion for Accessibility
```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable or simplify animations
}
```

---

## Animation Timing

### Duration Guidelines
- **Micro-interactions**: 150-300ms
- **Transitions**: 300-500ms
- **Page transitions**: 500-800ms
- **Celebrations**: 1000-2000ms

### Easing Functions
```typescript
// Cultural theme easing
const easing = {
  festive: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy, celebratory
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',           // Standard
  dramatic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth entrance
};
```

---

## Implementation Checklist

When adding animations:
- [ ] Performance tested (60fps)
- [ ] Accessibility considered (prefers-reduced-motion)
- [ ] Culturally appropriate
- [ ] Purposeful (not just decorative)
- [ ] Mobile optimized
- [ ] Fallback for low-end devices
- [ ] Tested on multiple browsers

---

## Quick Reference

### Most Used Animations

#### 1. Confetti Explosion
```tsx
<ConfettiExplosion trigger={showConfetti} />
```
**Use**: Event confirmations, celebrations, success actions

#### 2. Lion Dance Loading
```tsx
<LionDanceLoading />
```
**Use**: Page loads, data fetching

#### 3. Scroll Reveal
```tsx
const [ref, isVisible] = useScrollAnimation();
<div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>
  Content
</div>
```
**Use**: Content reveals on scroll

### Quick Copy-Paste

#### Scroll Animation Hook
```tsx
import { useScrollAnimation } from '@/utils/ANIMATION_UTILITIES';

const [ref, isVisible] = useScrollAnimation();
<div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>
  Content
</div>
```

#### Confetti on Click
```tsx
const [showConfetti, setShowConfetti] = useState(false);
<button onClick={() => setShowConfetti(true)}>Celebrate</button>
<ConfettiExplosion trigger={showConfetti} />
```

#### Loading State
```tsx
{isLoading ? <LionDanceLoading /> : <Content />}
```

### Common Patterns
```tsx
// Fade In
className="opacity-0 animate-fade-in duration-300"

// Scale on Hover
className="hover:scale-105 transition-transform duration-300"

// Red to Gold Hover
className="bg-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-gold-500"
```

---

*These animations bring the Chinese New Year Lion Dance spirit to life in the digital experience.*  
*See ANIMATION_UTILITIES.ts for utility functions.*  
*Last updated: [Date]*

