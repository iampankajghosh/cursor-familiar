export interface SpriteFrame {
  x: number;
  y: number;
  duration: number;
}

export type ToggleModifier = "alt" | "ctrl" | "shift" | "meta";

export type AnimationState = "moving" | "idle";
