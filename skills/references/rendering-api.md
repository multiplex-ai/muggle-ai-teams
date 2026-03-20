# Rendering API Reference

Read this when you need to render videos programmatically (Node.js/Bun scripts, servers, batch processing).

## Table of Contents
1. [bundle()](#bundle)
2. [selectComposition()](#selectcomposition)
3. [getCompositions()](#getcompositions)
4. [renderMedia()](#rendermedia)
5. [renderStill()](#renderstill)
6. [Full Pipeline Example](#full-pipeline)
7. [Batch Rendering](#batch-rendering)

---

## bundle()

**Package:** `@remotion/bundler`

Bundles a Remotion project using Webpack. Call once, reuse the output for multiple renders.

```ts
import path from 'path';
import {bundle} from '@remotion/bundler';

const serveUrl = await bundle({
  entryPoint: path.join(process.cwd(), './src/index.ts'),
  webpackOverride: (config) => config,
  onProgress: (progress) => console.log(`Bundling ${progress}%`),
});
```

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `entryPoint` | `string` | Absolute path to entry file (typically `src/index.ts`) |
| `webpackOverride?` | `(config) => config` | Webpack config transformer |
| `onProgress?` | `(percent: number) => void` | 0-100 progress callback |
| `outDir?` | `string` | Custom output directory (defaults to temp) |
| `enableCaching?` | `boolean` | Toggle Webpack caching |
| `publicDir?` | `string` | Custom public directory |
| `rootDir?` | `string` | Directory containing package.json |

**Returns:** `Promise<string>` — path to the bundled output.

**Do NOT** call `bundle()` for every render. Bundle once, render many times.

---

## selectComposition()

**Package:** `@remotion/renderer`

Evaluates a single composition (runs `calculateMetadata()`). Use this when you know which composition to render.

```ts
import {selectComposition} from '@remotion/renderer';

const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: 'MyVideo',
  inputProps: {title: 'Hello'},
  timeoutInMilliseconds: 30000,
});
// Returns: {id, width, height, fps, durationInFrames, defaultProps, props}
```

---

## getCompositions()

**Package:** `@remotion/renderer`

Returns ALL compositions. Use `selectComposition()` instead when you only need one.

```ts
import {getCompositions} from '@remotion/renderer';

const compositions = await getCompositions(bundleLocation, {
  inputProps: {},
});
```

---

## renderMedia()

**Package:** `@remotion/renderer`

Renders a video or audio file.

```ts
import {renderMedia} from '@remotion/renderer';

await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: 'out/video.mp4',
  inputProps: {title: 'Hello'},
  onProgress: ({progress}) => console.log(`${Math.round(progress * 100)}%`),
});
```

**Key Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `composition` | `object` | required | From `selectComposition()` |
| `serveUrl` | `string` | required | Bundle path or URL |
| `codec` | `string` | `'h264'` | h264, h265, vp8, vp9, prores, gif, mp3, aac, wav |
| `outputLocation?` | `string` | — | File path; omit for in-memory buffer |
| `inputProps?` | `object` | `{}` | Must match selectComposition call |
| `concurrency?` | `number \| string` | auto | Parallel threads (`4` or `'50%'`) |
| `frameRange?` | `number \| [number, number]` | all | Specific frames to render |
| `imageFormat?` | `string` | `'jpeg'` | `'jpeg'`, `'png'` (transparency), `'none'` (audio only) |
| `crf?` | `number` | codec-dependent | Quality (lower = better) |
| `videoBitrate?` | `string` | — | e.g. `'8M'` |
| `audioBitrate?` | `string` | — | e.g. `'128k'` |
| `scale?` | `number` | 1 | Output dimension multiplier |
| `muted?` | `boolean` | false | Skip audio |
| `envVariables?` | `Record<string,string>` | — | Environment variables |
| `timeoutInMilliseconds?` | `number` | 30000 | Per-frame timeout |
| `onProgress?` | `function` | — | Progress callback |

---

## renderStill()

**Package:** `@remotion/renderer`

Renders a single frame as an image.

```ts
import {renderStill} from '@remotion/renderer';

await renderStill({
  composition,
  serveUrl,
  output: '/tmp/thumbnail.png',
  inputProps: {},
  frame: 0,
  imageFormat: 'png',
  scale: 2,
});
```

**Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `output` | `string` | — | Output file path |
| `frame?` | `number` | 0 | Frame to render (-1 = last) |
| `imageFormat?` | `string` | `'png'` | png, jpeg, webp, pdf |
| `jpegQuality?` | `number` | — | 0-100 for jpeg |
| `scale?` | `number` | 1 | Scale multiplier |

---

## Full Pipeline

```ts
import path from 'path';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';

const inputProps = {title: 'My Video', items: ['a', 'b', 'c']};

// Bundle once
const serveUrl = await bundle({
  entryPoint: path.resolve('./src/index.ts'),
});

// Select composition (evaluates calculateMetadata)
const composition = await selectComposition({
  serveUrl,
  id: 'main-video',
  inputProps,
});

// Render
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: 'out/video.mp4',
  inputProps,
  onProgress: ({progress}) => {
    process.stdout.write(`\rRendering: ${(progress * 100).toFixed(1)}%`);
  },
});
```

---

## Batch Rendering

Render many videos from a dataset, reusing the same bundle:

```ts
const serveUrl = await bundle({entryPoint: path.resolve('./src/index.ts')});

const dataset = [
  {id: 'video1', title: 'First Video', color: '#ff0000'},
  {id: 'video2', title: 'Second Video', color: '#00ff00'},
  {id: 'video3', title: 'Third Video', color: '#0000ff'},
];

for (const item of dataset) {
  const composition = await selectComposition({
    serveUrl,
    id: 'template',
    inputProps: item,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: `out/${item.id}.mp4`,
    inputProps: item,
  });

  console.log(`Rendered ${item.id}`);
}
```

---

## Configuration

`remotion.config.ts` affects CLI commands only. For programmatic rendering, pass all options directly to the API functions.

```ts
// remotion.config.ts (CLI only)
import {Config} from '@remotion/cli/config';

Config.setConcurrency(8);
Config.setCodec('h265');
Config.overrideWebpackConfig((config) => {
  // Add custom loaders, plugins, etc.
  return config;
});
```

## Environment Variables

- CLI: prefix with `REMOTION_` or use `.env` file
- SSR APIs: pass via `envVariables` parameter (`.env` NOT auto-read for security)
