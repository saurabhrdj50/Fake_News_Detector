# ⚡ ANIMATION & MOTION GUIDE

## Overview

This document explains all animations and micro-interactions in the Fake News Detector v2.0 frontend.

## 🎬 Animation Library: Framer Motion

Framer Motion is used for all complex animations due to:
- GPU-accelerated performance
- Spring physics for natural motion
- Gesture-based animations (hover, tap, drag)
- AnimatePresence for mount/unmount transitions
- TypeScript support
- React Suspense integration

## 📋 Animation Categories

### 1. PAGE-LEVEL ANIMATIONS

#### App.tsx - Main Container
```typescript
// Fade in entire app on load
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
```

**Effect**: Smooth page fade-in as app loads  
**Duration**: 0.8s  
**Timing**: Linear  
**Use Case**: Professional entrance

---

#### Background Blobs
```typescript
<motion.div
  animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
  transition={{ duration: 20, repeat: Infinity }}
/>
```

**Effect**: Floating gradient shapes in background  
**Duration**: 20s (full loop)  
**Repeat**: Infinite  
**Purpose**: Adds visual interest, keeps design dynamic

---

### 2. SECTION ANIMATIONS

#### Hero.tsx - Hero Section
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,      // 200ms delay between items
      delayChildren: 0.3,        // Wait 300ms before starting
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
```

**Effect**: Staggered fade-in of hero elements  
**Pattern**: Each element fades in slightly after previous  
**Duration**: 0.2s between elements  
**Use Case**: Creates flow and engagement

**Elements Animated:**
- Badge (top)
- Title (middle)
- Subtitle (middle)
- CTA Buttons (bottom)
- Stats Cards (bottom)

---

#### Stats Cards
```typescript
<motion.div
  whileHover={{ y: -5 }}
  className="p-4 bg-white/5"
>
```

**Effect**: Cards lift up on hover  
**Direction**: Y-axis (up 5px)  
**Duration**: Auto (fast)  
**Use Case**: Interactive feedback

---

### 3. COMPONENT ANIMATIONS

#### InputSection.tsx

**Progress Bar Animation:**
```typescript
<motion.div
  className="h-full"
  initial={{ width: 0 }}
  animate={{ width: `${percent}%` }}
  transition={{ type: 'spring', stiffness: 100 }}
/>
```

**Effect**: Animated fill as user types  
**Type**: Spring physics (bouncy)  
**Color**: Changes based on character count  
- Green (valid)
- Blue (warning)
- Red (error)

**Button Animations:**
```typescript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

**Effect**: 
- Hover: Slightly enlarges (2% scale)
- Tap: Slightly shrinks (2% scale)
- Creates tactile feedback

---

#### ResultCard.tsx

**Container Animation:**
```typescript
variants={{
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
    },
  },
}}
```

**Effect**: Card bounces in with spring physics  
**Stagger**: Each child element animates 100ms apart  
**Physics**: Stiff spring with damping (bouncy but controlled)

**Icon Animation:**
```typescript
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
>
```

**Effect**: Icon pulses (scales up and down)  
**Duration**: 2 seconds per cycle  
**Repeat**: Infinite  
**Purpose**: Draws attention to prediction

**Confidence Bar:**
```typescript
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${prediction.confidence}%` }}
  transition={{ duration: 1, ease: 'easeOut' }}
/>
```

**Effect**: Bar fills over time  
**Duration**: 1 second  
**Easing**: easeOut (decelerates towards end)  
**Purpose**: Smooth reveal of confidence

**Probability Progress Bars:**
```typescript
<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  {prediction.prob_fake.toFixed(1)}%
</motion.p>
```

**Effect**: Numbers fade in with delay  
**Delay**: 300ms (lets bar animation start first)  
**Purpose**: Creates visual hierarchy

---

#### HistoryPanel.tsx

**List Item Animation:**
```typescript
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 20 }}
  whileHover={{ scale: 1.02 }}
>
```

**Effects:**
- **Enter**: Slides in from left (fade + slide)
- **Exit**: Slides out to right (opposite)
- **Hover**: Slightly enlarges
- **Use Case**: Natural list animations

---

### 4. LOADING STATE ANIMATIONS

#### App.tsx - Loading Overlay
```typescript
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
>
  <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full" />
</motion.div>
```

**Effect**: Spinning loader ring  
**Speed**: 360° rotation in 2 seconds  
**Repeat**: Infinite  
**Easing**: Linear (constant speed)  
**Purpose**: Indicates processing

---

### 5. CONDITIONAL ANIMATIONS

#### InputSection.tsx - Warnings
```typescript
<motion.div
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
>
  Warning message...
</motion.div>
```

**Effect**: Warning slides in from left  
**Duration**: Auto  
**Use Case**: Important user feedback

---

### 6. CUSTOM TAILWIND ANIMATIONS

#### Hero Button Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

**Effect**: Element floats up and down  
**Duration**: 3 seconds  
**Use Case**: Subtle continuous motion

---

#### Glow Effect
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
  50% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.8); }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

**Effect**: Pulsing shadow/glow  
**Duration**: 2 seconds  
**Purpose**: Highlights important elements

---

#### Shimmer Loading
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent, white, transparent);
  animation: shimmer 2s infinite;
}
```

**Effect**: Shimmer across element  
**Duration**: 2 seconds  
**Purpose**: Loading placeholder

---

## 🎨 Animation Principles Applied

### 1. **Timing Hierarchy**
- Hero intro: 0.3-1.0s
- Button interactions: 0.2-0.3s
- Loading states: 2+ seconds
- Continuous: 3-25+ seconds

### 2. **Easing Functions**
- `easeOut`: When revealing content
- `easeIn`: When hiding content
- `easeInOut`: For loops
- `linear`: For rotations/continuous
- Spring physics: For interactive feedback

### 3. **Stagger Effects**
- Hero section: 0.2s between items
- Result card: 0.1s between items
- Lists: Per-item animations

### 4. **Spring Physics**
- stiffness: 100-150 (bouncy)
- damping: 15-25 (control)
- mass: 1 (default)
- Natural, satisfying motion

### 5. **Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Respects user accessibility preferences.

---

## 📊 Performance Optimization

### GPU Acceleration
All animations use `transform` and `opacity`:
```typescript
// Good - GPU accelerated
animate={{ x: 100, opacity: 0.5 }}

// Avoid - CPU intensive
animate={{ left: 100, color: 'red' }}
```

### Will-Change Hints
```css
.expensive-animation {
  will-change: transform, opacity;
}
```

Tells browser to prepare for changes.

### FramerMotion Best Practices
1. Use `variants` for reusable animations
2. Memoize complex components
3. Use `AnimatePresence` for mount/unmount
4. Avoid animating too many properties
5. Use `exit` animations for cleanup

---

## 🎯 Animation Checklist for Implementation

- [x] Page entrance fade-in
- [x] Hero section stagger
- [x] Button hover/tap
- [x] Progress bar fill
- [x] Icon pulse
- [x] Loading spinner
- [x] Result card spring bounce
- [x] List item slide-in
- [x] Warning message fade-in
- [x] Background blobs float
- [x] Custom CSS animations
- [x] Accessibility (reduced-motion)
- [x] Performance optimized

---

## 🚀 Advanced Animation Patterns

### Pattern 1: Staggered Entrance
```typescript
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

### Pattern 2: Spring Physics
```typescript
{
  type: 'spring',
  stiffness: 100,
  damping: 15,
}
```

### Pattern 3: Infinite Loops
```typescript
animate={{ scale: [1, 1.1, 1] }}
transition={{ repeat: Infinity, duration: 2 }}
```

### Pattern 4: Conditional Exit
```typescript
<AnimatePresence>
  {isVisible && <Component />}
</AnimatePresence>
```

### Pattern 5: Gesture-Based
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

---

## 📱 Responsive Animation Tweaks

For mobile, consider:
- Reducing animation duration (faster feedback)
- Reducing stagger delays
- Simplifying complex animations
- Using GPU-heavy transforms

Example:
```typescript
const duration = isMobile ? 0.3 : 0.6;
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration }}
/>
```

---

## 🔍 Testing Animations

### Visual Testing
1. Test at 2x CPU throttle (slow devices)
2. Test with animations disabled
3. Check on different screen sizes
4. Verify accessibility (reduced-motion)

### Performance Metrics
- Target: 60 FPS
- Use DevTools Performance tab
- Check for jank/dropped frames

---

This guide covers **100% of animations** in the project. Each animation serves a purpose and enhances UX without being distracting.

