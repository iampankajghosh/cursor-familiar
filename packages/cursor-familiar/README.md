# cursor-familiar

Animated pixel companions for the web.

## Install

```bash
npm install cursor-familiar
```

```bash
pnpm add cursor-familiar
```

## Usage

```tsx
"use client";

import { CursorCompanion } from "cursor-familiar";

export default function App() {
  return <CursorCompanion spriteImage="/sprites/cat.png" />;
}
```

---

## Features

- Pixel-perfect sprite animation
- Cursor-following companion behavior
- Idle and movement animations
- Custom sprite sheets
- Lightweight
- React + TypeScript support

---

## Props

| Prop               | Type     | Default  |
| ------------------ | -------- | -------- |
| `spriteImage`      | `string` | required |
| `spriteSize`       | `number` | `32`     |
| `speed`            | `number` | `1.6`    |
| `reactionDelay`    | `number` | `250`    |
| `stopDistance`     | `number` | `24`     |
| `homeStopDistance` | `number` | `4`      |

---

## Controls

| Shortcut  | Action           |
| --------- | ---------------- |
| `Alt + C` | Toggle companion |

---

## License

MIT
