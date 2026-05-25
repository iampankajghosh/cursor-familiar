"use client";

import { useEffect, useRef } from "react";

export interface SpriteFrame {
  x: number;
  y: number;
  duration: number;
}

type AnimationState = "moving" | "idle";

export interface CursorCompanionProps {
  spriteImage: string;
  spriteSize?: number;
  moveFrames?: readonly SpriteFrame[];
  idleFrames?: readonly SpriteFrame[];
  speed?: number;
  reactionDelay?: number;
  stopDistance?: number;
  homeStopDistance?: number;
  className?: string;
}

const DEFAULT_SPRITE_SIZE = 32;

const DEFAULT_MOVE_FRAMES = [
  { x: 0, y: 0, duration: 110 },
  { x: -32, y: 0, duration: 110 },
  { x: -64, y: 0, duration: 110 },
  { x: -96, y: 0, duration: 110 },
  { x: -128, y: 0, duration: 110 },
  { x: -160, y: 0, duration: 110 },
] as const satisfies readonly SpriteFrame[];

const DEFAULT_IDLE_FRAMES = [
  { x: 0, y: -32, duration: 100 },
  { x: -32, y: -32, duration: 100 },
  { x: -64, y: -32, duration: 120 },
  { x: -96, y: -32, duration: 120 },
  { x: -128, y: -32, duration: 400 },
  { x: -160, y: -32, duration: 500 },
  { x: 0, y: -64, duration: 120 },
  { x: -32, y: -64, duration: 120 },
  { x: -64, y: -64, duration: 80 },
  { x: -96, y: -64, duration: 80 },
  { x: -128, y: -64, duration: 150 },
  { x: -160, y: -64, duration: 400 },
] as const satisfies readonly SpriteFrame[];

export function CursorCompanion({
  spriteImage,
  spriteSize = DEFAULT_SPRITE_SIZE,
  moveFrames = DEFAULT_MOVE_FRAMES,
  idleFrames = DEFAULT_IDLE_FRAMES,
  speed = 1.6,
  reactionDelay = 250,
  stopDistance = 24,
  homeStopDistance = 4,
  className = "",
}: CursorCompanionProps) {
  const characterRef = useRef<HTMLSpanElement | null>(null);

  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const scaleXRef = useRef(1);

  const isMovingRef = useRef(false);
  const isActiveRef = useRef(true);

  const animationStateRef = useRef<AnimationState>("idle");

  const frameIndexRef = useRef(0);

  const rafRef = useRef<number | null>(null);

  const spriteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const movementDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const renderTransform = () => {
    const el = characterRef.current;

    if (!el) return;

    el.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) scaleX(${scaleXRef.current})`;
  };

  const renderFrame = (frame: SpriteFrame) => {
    const el = characterRef.current;

    if (!el) return;

    el.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
  };

  useEffect(() => {
    let mounted = true;

    const animateSprite = () => {
      if (!mounted) return;

      const nextState: AnimationState = isMovingRef.current ? "moving" : "idle";

      const frames = nextState === "moving" ? moveFrames : idleFrames;

      if (animationStateRef.current !== nextState) {
        animationStateRef.current = nextState;
        frameIndexRef.current = 0;
      }

      const frame = frames[frameIndexRef.current];

      renderFrame(frame);

      frameIndexRef.current = (frameIndexRef.current + 1) % frames.length;

      spriteTimeoutRef.current = setTimeout(animateSprite, frame.duration);
    };

    animateSprite();

    return () => {
      mounted = false;

      if (spriteTimeoutRef.current) {
        clearTimeout(spriteTimeoutRef.current);
      }
    };
  }, [moveFrames, idleFrames]);

  useEffect(() => {
    let mounted = true;

    const tick = () => {
      if (!mounted) return;

      const current = positionRef.current;
      const target = targetRef.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;

      const distance = Math.hypot(dx, dy);

      const threshold = isActiveRef.current ? stopDistance : homeStopDistance;

      if (isMovingRef.current) {
        if (distance > threshold) {
          const angle = Math.atan2(dy, dx);

          current.x += Math.cos(angle) * speed;
          current.y += Math.sin(angle) * speed;

          if (dx > 1) {
            scaleXRef.current = 1;
          } else if (dx < -1) {
            scaleXRef.current = -1;
          }
        } else {
          isMovingRef.current = false;

          if (!isActiveRef.current) {
            scaleXRef.current = 1;
          }
        }

        renderTransform();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      mounted = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, stopDistance, homeStopDistance]);

  useEffect(() => {
    const startMovement = () => {
      const dx = targetRef.current.x - positionRef.current.x;

      const dy = targetRef.current.y - positionRef.current.y;

      const distance = Math.hypot(dx, dy);

      if (distance > stopDistance && isActiveRef.current) {
        isMovingRef.current = true;
      }

      movementDelayTimeoutRef.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const nextPosition = {
        x: event.clientX - spriteSize / 2,
        y: event.clientY - spriteSize / 2,
      };

      lastMouseRef.current = nextPosition;

      if (!isActiveRef.current) return;

      targetRef.current = nextPosition;

      if (isMovingRef.current) return;

      if (!movementDelayTimeoutRef.current) {
        movementDelayTimeoutRef.current = setTimeout(
          startMovement,
          reactionDelay,
        );
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "c") {
        event.preventDefault();

        isActiveRef.current = !isActiveRef.current;

        if (!isActiveRef.current) {
          targetRef.current = { x: 0, y: 0 };

          if (movementDelayTimeoutRef.current) {
            clearTimeout(movementDelayTimeoutRef.current);

            movementDelayTimeoutRef.current = null;
          }
        } else {
          targetRef.current = {
            ...lastMouseRef.current,
          };
        }

        isMovingRef.current = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isMovingRef.current = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    window.addEventListener("keydown", handleKeyDown);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("keydown", handleKeyDown);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (movementDelayTimeoutRef.current) {
        clearTimeout(movementDelayTimeoutRef.current);
      }
    };
  }, [reactionDelay, spriteSize, stopDistance]);

  return (
    <span
      ref={characterRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-100 bg-no-repeat will-change-[transform,background-position] contain-[layout_style_paint] select-none [image-rendering:pixelated] backface-hidden ${className}`}
      style={{
        width: spriteSize,
        height: spriteSize,
        backgroundImage: `url(${spriteImage})`,
        backgroundSize: `${spriteSize * 6}px ${spriteSize * 3}px`,
        backgroundPosition: `0px -${spriteSize}px`,
      }}
    />
  );
}
