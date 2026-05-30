import { useEffect } from "react";
import type { ToggleModifier } from "./types";

interface Position {
  x: number;
  y: number;
}

interface UseCursorPetMovementProps {
  speed: number;
  spriteSize: number;
  reactionDelay: number;
  stopDistance: number;
  homeStopDistance: number;
  toggleKey: string;
  toggleModifier: ToggleModifier;
  positionRef: React.MutableRefObject<Position>;
  targetRef: React.MutableRefObject<Position>;
  lastMouseRef: React.MutableRefObject<Position>;
  scaleXRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  isActiveRef: React.MutableRefObject<boolean>;
  movementDelayTimeoutRef: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  rafRef: React.MutableRefObject<number | null>;
  renderTransform: () => void;
}

export function useCursorPetMovement({
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
}: UseCursorPetMovementProps) {
  const normalizedToggleKey = toggleKey.toLowerCase();

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
  }, [
    speed,
    stopDistance,
    homeStopDistance,
    positionRef,
    targetRef,
    scaleXRef,
    isMovingRef,
    isActiveRef,
    rafRef,
    renderTransform,
  ]);

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
      const modifierPressed =
        (toggleModifier === "alt" && event.altKey) ||
        (toggleModifier === "ctrl" && event.ctrlKey) ||
        (toggleModifier === "shift" && event.shiftKey) ||
        (toggleModifier === "meta" && event.metaKey);

      if (modifierPressed && event.key.toLowerCase() === normalizedToggleKey) {
        event.preventDefault();

        isActiveRef.current = !isActiveRef.current;

        if (!isActiveRef.current) {
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
  }, [
    reactionDelay,
    spriteSize,
    stopDistance,
    normalizedToggleKey,
    toggleModifier,
    positionRef,
    targetRef,
    lastMouseRef,
    isMovingRef,
    isActiveRef,
    movementDelayTimeoutRef,
  ]);
}
