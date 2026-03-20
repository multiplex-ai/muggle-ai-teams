# Animation & Media Deep Reference

Read this when you need detailed API info for animations, media handling, or advanced components.

## Table of Contents
1. [interpolate() Advanced](#interpolate-advanced)
2. [spring() Advanced](#spring-advanced)
3. [Easing Functions](#easing-functions)
4. [Transitions API](#transitions-api)
5. [Noise](#noise)
6. [SVG Paths](#svg-paths)
7. [SVG Shapes](#svg-shapes)
8. [Animation Utils](#animation-utils)
9. [Media Components](#media-components)
10. [Fonts](#fonts)
11. [Layout Utils](#layout-utils)
12. [TailwindCSS Setup](#tailwindcss)

---

## interpolate() Advanced

```tsx
interpolate(value, inputRange, outputRange, options?)
```

**Options:**
- `extrapolateLeft`: `'extend'` (default), `'clamp'`, `'wrap'`, `'identity'`
- `extrapolateRight`: `'extend'` (default), `'clamp'`, `'wrap'`, `'identity'`
- `easing`: function `(t: number) => number`

**Multi-step mapping:**
```tsx
// Scale up, hold, scale down
const scale = interpolate(
  frame,
  [0, 20, 80, 100],
  [0, 1, 1, 0.5],
  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
);
```

**Color interpolation** — use `interpolateColors()`:
```tsx
import {interpolateColors} from 'remotion';
const color = interpolateColors(frame, [0, 100], ['#ff0000', '#0000ff']);
```

---

## spring() Advanced

```tsx
spring({
  frame,              // current frame (required)
  fps,                // from useVideoConfig (required)
  from: 0,            // start value
  to: 1,              // end value
  config: {
    damping: 10,      // deceleration (200 = no bounce)
    mass: 1,          // weight
    stiffness: 100,   // bounciness
    overshootClamping: false,
  },
  delay: 0,           // delay in frames
  durationInFrames: undefined,  // stretch to exact duration
  reverse: false,     // play backwards
})
```

**Duration-based spring** (stretch to exact frames):
```tsx
const scale = spring({frame, fps, durationInFrames: 30, config: {damping: 200}});
```

**Chained springs:**
```tsx
const driver = spring({frame, fps, config: {damping: 200}});
const x = interpolate(driver, [0, 1], [-100, 0]);
const rotation = interpolate(driver, [0, 1], [-10, 0]);
const opacity = interpolate(driver, [0, 1], [0, 1]);
```

---

## Easing Functions

All from `import {Easing} from 'remotion'`:

| Function | Description |
|----------|-------------|
| `Easing.linear` | No easing |
| `Easing.ease` | Subtle acceleration/deceleration |
| `Easing.quad` | t^2 |
| `Easing.cubic` | t^3 |
| `Easing.sin` | Sinusoidal |
| `Easing.circle` | Circular |
| `Easing.exp` | Exponential |
| `Easing.bounce` | Bounce effect |
| `Easing.elastic(bounciness?)` | Elastic spring |
| `Easing.back(s?)` | Overshoot then settle |
| `Easing.bezier(x1, y1, x2, y2)` | CSS cubic-bezier |
| `Easing.poly(n)` | t^n |
| `Easing.step0(n)` / `Easing.step1(n)` | Step functions |

**Modifiers:** `Easing.in(fn)`, `Easing.out(fn)`, `Easing.inOut(fn)`

```tsx
const value = interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.inOut(Easing.cubic),
  extrapolateRight: 'clamp',
});
```

---

## Transitions API

**Package:** `@remotion/transitions`

### TransitionSeries

```tsx
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames: 20})}
  />
  <TransitionSeries.Sequence durationInFrames={90}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

**Presentations:** `fade()`, `slide({direction})`, `wipe({direction})`

**Timings:**
- `linearTiming({durationInFrames})` — constant speed
- `springTiming({config})` — spring physics

**Rules:**
- Transitions cannot be adjacent to each other
- A transition cannot exceed the duration of its adjacent sequences
- At least one sequence must precede/follow each transition

**Total duration = sum of sequences - sum of transition durations**

### Enter/Exit Animations

Place transition at the start or end of TransitionSeries for enter/exit effects:
```tsx
<TransitionSeries>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
  <TransitionSeries.Sequence durationInFrames={90}>
    <Content />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
</TransitionSeries>
```

---

## Noise

**Package:** `@remotion/noise`

Deterministic simplex noise for procedural effects.

```tsx
import {noise2D, noise3D, noise4D} from '@remotion/noise';

// 2D noise — returns [-1, 1]
const val = noise2D('seed', x, y);

// 3D noise — use frame as z for time-varying effects
const val3d = noise3D('seed', x, y, frame * 0.01);

// 4D noise
const val4d = noise4D('seed', x, y, z, w);
```

Same seed + same coordinates = same result (deterministic).

---

## SVG Paths

**Package:** `@remotion/paths`

```tsx
import {getLength, getPointAtLength, evolvePath, interpolatePath} from '@remotion/paths';

// Get total path length
const length = getLength('M 0 0 L 100 0'); // 100

// Get point at length
const point = getPointAtLength('M 0 0 L 100 0', 50); // {x: 50, y: 0}

// Animate path drawing (0 = invisible, 1 = fully drawn)
const evolution = evolvePath(0.5, 'M 0 0 L 100 0');
// {strokeDasharray: '100 100', strokeDashoffset: 50}
<path d="M 0 0 L 100 0" {...evolution} />

// Morph between two paths
const morphed = interpolatePath(0.5, pathA, pathB);
```

Additional: `reversePath()`, `scalePath()`, `translatePath()`, `getSubpaths()`, `getBoundingBox()`, `getTangentAtLength()`.

---

## SVG Shapes

**Package:** `@remotion/shapes`

```tsx
import {Circle, Rect, Triangle, Ellipse, Star, Pie} from '@remotion/shapes';

<Circle radius={100} fill="green" stroke="red" strokeWidth={1} />
<Rect width={200} height={200} fill="red" />
<Triangle length={100} fill="blue" direction="up" />
<Ellipse rx={100} ry={50} fill="green" />
<Star points={5} innerRadius={50} outerRadius={100} fill="gold" />
<Pie radius={100} progress={0.75} fill="orange" />
```

Each shape also has a `make*()` function returning the SVG path string: `makeCircle()`, `makeRect()`, etc.

---

## Animation Utils

**Package:** `@remotion/animation-utils`

CSS animation helpers:
```tsx
import {interpolateStyles, makeTransform} from '@remotion/animation-utils';

// Interpolate between CSS style objects
const style = interpolateStyles(progress, [0, 1], [
  {opacity: 0, transform: 'translateY(20px)'},
  {opacity: 1, transform: 'translateY(0px)'},
]);

// Build transform strings
const transform = makeTransform([
  ['translateX', `${x}px`],
  ['rotate', `${rotation}deg`],
  ['scale', scale],
]);
```

---

## Media Components

### OffthreadVideo (recommended)
```tsx
import {OffthreadVideo, staticFile} from 'remotion';

<OffthreadVideo
  src={staticFile('clip.mp4')}
  volume={0.5}                    // 0-1 or (frame) => number
  muted={false}
  playbackRate={1}
  startFrom={30}                  // Skip first 30 frames
  endAt={120}                     // End at frame 120
  style={{width: '100%'}}
  transparent={false}             // For transparent video (VP9, ProRes 4444)
/>
```

### Audio
```tsx
import {Audio, staticFile, interpolate} from 'remotion';

<Audio src={staticFile('music.mp3')} volume={0.5} />

// Dynamic volume
<Audio
  src={staticFile('voice.mp3')}
  volume={(f) => interpolate(f, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
/>
```

### Img
```tsx
import {Img, staticFile} from 'remotion';
<Img src={staticFile('photo.png')} style={{width: 400}} />
```

Always use `<Img>` over `<img>` — it delays rendering until loaded.

---

## Fonts

### Google Fonts
```bash
npm i @remotion/google-fonts
```
```tsx
import {loadFont} from '@remotion/google-fonts/Inter';
const {fontFamily} = loadFont();
<div style={{fontFamily}}>Text</div>
```

### Local Fonts
```bash
npm i @remotion/fonts
```
```tsx
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

loadFont({
  family: 'MyFont',
  url: staticFile('MyFont.woff2'),
  weight: '400',
  style: 'normal',
});
```

### Manual FontFace
```tsx
const handle = delayRender('Loading font...');
const font = new FontFace('Custom', `url('${staticFile('font.woff2')}') format('woff2')`);
font.load().then(() => {
  document.fonts.add(font);
  continueRender(handle);
});
```

---

## Layout Utils

**Package:** `@remotion/layout-utils`

```tsx
import {measureText, fitText} from '@remotion/layout-utils';

// Measure text dimensions
const {width, height} = measureText({
  text: 'Hello World',
  fontFamily: 'Arial',
  fontSize: 48,
  fontWeight: 'bold',
});

// Auto-size text to fit a container
const {fontSize} = fitText({
  text: 'Hello World',
  withinWidth: 800,
  fontFamily: 'Arial',
  fontWeight: 'bold',
});
```

---

## TailwindCSS

### v4 Setup
```bash
npm i -D @remotion/tailwind-v4 tailwindcss
```

`remotion.config.ts`:
```ts
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind-v4';
Config.overrideWebpackConfig((config) => enableTailwind(config));
```

`src/index.css`:
```css
@import 'tailwindcss';
```

`Root.tsx`:
```tsx
import './index.css';
```

`package.json` — add:
```json
{"sideEffects": ["*.css"]}
```

### v3 Setup
```bash
npm i -D @remotion/tailwind tailwindcss
```
Uses `@remotion/tailwind` package and standard `tailwind.config.js`.
