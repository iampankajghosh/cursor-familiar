# cursor-pet

Animated pixel companions that follow your cursor.

![Cursor Pet Preview](https://raw.githubusercontent.com/iampankajghosh/cursor-pet/main/public/preview.gif)

---

## Install

```bash
npm install cursor-pet
```

```bash
pnpm add cursor-pet
```

```bash
yarn add cursor-pet
```

---

## Usage

```tsx
"use client";

import CursorPet from "cursor-pet";

export default function App() {
  return <CursorPet spriteImage="/ufo.png" />;
}
```

---

## Features

- Pixel-perfect sprite animation
- Smooth cursor-following movement
- Idle + movement animation states
- Custom sprite sheet support
- Lightweight
- Dependency-free
- React + TypeScript support
- Customizable keyboard toggle shortcut
- Works with any pixel character, creature, vehicle, or object

---

## Demo Sprites

Included demo sprite sheets you can download and use directly.

Preview:

![Demo Sprites](https://raw.githubusercontent.com/iampankajghosh/cursor-pet/main/public/origami-crane.png)

Downloads:

- [origami-crane.png](https://github.com/iampankajghosh/cursor-pet/blob/main/public/origami-crane.png)
- [ufo.png](https://github.com/iampankajghosh/cursor-pet/blob/main/public/ufo.png)

Usage:

```tsx
<CursorPet spriteImage="/ufo.png" />

<CursorPet spriteImage="/origami-crane.png" />
```

---

## Props

| Prop               | Type                                   | Default  | Description                          |
| ------------------ | -------------------------------------- | -------- | ------------------------------------ |
| `spriteImage`      | `string`                               | required | Sprite sheet image URL               |
| `spriteSize`       | `number`                               | `32`     | Width and height of each frame       |
| `moveFrames`       | `readonly SpriteFrame[]`               | built-in | Animation frames while moving        |
| `idleFrames`       | `readonly SpriteFrame[]`               | built-in | Animation frames while idle          |
| `speed`            | `number`                               | `1.6`    | Movement speed                       |
| `reactionDelay`    | `number`                               | `250`    | Delay before chasing the cursor      |
| `stopDistance`     | `number`                               | `24`     | Distance before stopping near cursor |
| `homeStopDistance` | `number`                               | `4`      | Stop distance when returning home    |
| `toggleKey`        | `string`                               | `"c"`    | Keyboard key used for toggling       |
| `toggleModifier`   | `"alt" \| "ctrl" \| "shift" \| "meta"` | `"alt"`  | Modifier key used for toggling       |
| `className`        | `string`                               | `""`     | Extra class names                    |

---

## SpriteFrame

```ts
interface SpriteFrame {
  x: number;
  y: number;
  duration: number;
}
```

---

## Toggle Shortcut

Default shortcut:

```txt
Alt + C
```

Custom shortcut:

```tsx
<CursorPet spriteImage="/ufo.png" toggleKey="p" toggleModifier="ctrl" />
```

This will use:

```txt
Ctrl + P
```

---

## Custom Animation Frames

```tsx
const moveFrames = [
  { x: 0, y: 0, duration: 100 },
  { x: -32, y: 0, duration: 100 },
];

const idleFrames = [
  { x: 0, y: -32, duration: 200 },
  { x: -32, y: -32, duration: 200 },
];

<CursorPet
  spriteImage="/ufo.png"
  moveFrames={moveFrames}
  idleFrames={idleFrames}
/>;
```

---

## Sprite Sheet Format

Default built-in animations expect:

- 6 columns
- 3 rows
- Uniform frame sizes

Example layout:

```txt
Row 1 → movement frames
Row 2 → idle frames
Row 3 → extra idle frames
```

---

## Generate Your Own Sprite Sheet

You can generate custom sprite sheets using Gemini, ChatGPT, Midjourney, or other AI tools.

Detailed sprite generation prompt:

- [Sprite Generation Prompt](https://github.com/iampankajghosh/cursor-pet/blob/main/sprite-prompt.md)

---

## Example Ideas

- Cats
- Dogs
- Ghosts
- Slimes
- Pokémon-style sprites
- Paper planes
- UFOs
- Tiny cars
- Retro game characters

---

## License

MIT
