import { useEffect, useRef } from "react";
import { useCursorPetMovement } from "./useCursorPetMovement";
import type { AnimationState, SpriteFrame, ToggleModifier } from "./types";

export interface CursorPetProps {
  spriteImage: string;
  spriteSize?: number;
  moveFrames?: readonly SpriteFrame[];
  idleFrames?: readonly SpriteFrame[];
  speed?: number;
  reactionDelay?: number;
  stopDistance?: number;
  homeStopDistance?: number;
  toggleKey?: string;
  toggleModifier?: ToggleModifier;
  enabled?: boolean;
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

export default function CursorPet({
  spriteImage,
  spriteSize = DEFAULT_SPRITE_SIZE,
  moveFrames = DEFAULT_MOVE_FRAMES,
  idleFrames = DEFAULT_IDLE_FRAMES,
  speed = 1.6,
  reactionDelay = 250,
  stopDistance = 24,
  homeStopDistance = 4,
  toggleKey = "c",
  toggleModifier = "alt",
  enabled = true,
  className = "",
}: CursorPetProps) {
  const petRef = useRef<HTMLSpanElement | null>(null);

  const positionRef = useRef({
    x: 0,
    y: 0,
  });

  const targetRef = useRef({
    x: 0,
    y: 0,
  });

  const lastMouseRef = useRef({
    x: 0,
    y: 0,
  });

  const scaleXRef = useRef(1);

  const isMovingRef = useRef(false);

  const isActiveRef = useRef(enabled);

  const animationStateRef = useRef<AnimationState>("idle");

  const frameIndexRef = useRef(0);

  const rafRef = useRef<number | null>(null);

  const spriteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const movementDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const renderTransform = () => {
    const el = petRef.current;

    if (!el) return;

    el.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) scaleX(${scaleXRef.current})`;
  };

  const renderFrame = (frame: SpriteFrame) => {
    const el = petRef.current;

    if (!el) return;

    el.style.backgroundPosition = `${frame.x}px ${frame.y}px`;
  };

  useEffect(() => {
    if (isActiveRef.current === enabled) return;

    isActiveRef.current = enabled;

    if (!enabled) {
      targetRef.current = {
        x: 0,
        y: 0,
      };

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
  }, [enabled]);

  useCursorPetMovement({
    speed,
    spriteSize,
    reactionDelay,
    stopDistance,
    homeStopDistance,
    toggleKey,
    toggleModifier,
    positionRef,
    targetRef,
    lastMouseRef,
    scaleXRef,
    isMovingRef,
    isActiveRef,
    movementDelayTimeoutRef,
    rafRef,
    renderTransform,
  });

  useEffect(() => {
    let mounted = true;

    const animateSprite = () => {
      if (!mounted) return;

      const nextState = isMovingRef.current ? "moving" : "idle";

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

  return (
    <span
      ref={petRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        width: spriteSize,
        height: spriteSize,
        pointerEvents: "none",
        userSelect: "none",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        backfaceVisibility: "hidden",
        willChange: "transform, background-position",
        contain: "layout style paint",
        transform: "translate3d(0px, 0px, 0px)",
        backgroundImage: `url(${spriteImage})`,
        backgroundSize: `${spriteSize * 6}px ${spriteSize * 3}px`,
        backgroundPosition: `0px -${spriteSize}px`,
      }}
    />
  );
}
