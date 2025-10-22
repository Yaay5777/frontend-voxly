# 🎨 Original Frontend Design Reference

## Background Colors

### Light Mode
```css
background: linear-gradient(to bottom right, 
  rgb(239 246 255),  /* blue-50 */
  rgb(245 243 255),  /* purple-50 */
  rgb(252 231 243)   /* pink-50 */
);
```
Tailwind: `bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`

### Dark Mode
```css
background: rgb(17 24 39); /* gray-900 */
```
Tailwind: `dark:bg-gray-900`

## Color Palette (from tailwind.config.js)

```javascript
voxly: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',  // Primary brand color
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}

accent: {
  50: '#fdf4ff',
  100: '#fae8ff',
  200: '#f5d0fe',
  300: '#f0abfc',
  400: '#e879f9',
  500: '#d946ef',  // Primary accent
  600: '#c026d3',
  700: '#a21caf',
  800: '#86198f',
  900: '#701a75',
}
```

## Glass Morphism

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

## Theme System

Uses **Zustand** store (`useThemeStore`):
- State: `isDark` (boolean)
- Function: `toggleTheme()` 
- Persisted to localStorage as `'voxly-theme'`

## Typography

- Sans: Inter
- Display: Poppins
- Mono: JetBrains Mono

## Key Components

1. **GlassCard** - Glassmorphism container
2. **GlowButton** - Gradient button with glow effect
3. **ParticleBackground** - Animated particle system
4. **WaveformVisualizer** - Audio waveform display
5. **Avatar3D** - 3D avatar using Three.js

## Current Final-Voxly Setup

✅ ThemeContext (React Context)
✅ Light/Dark toggle
❌ Need to match exact colors
❌ Need to use Tailwind classes properly
