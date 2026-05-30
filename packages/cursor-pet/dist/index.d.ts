import * as react_jsx_runtime from 'react/jsx-runtime';

interface SpriteFrame {
    x: number;
    y: number;
    duration: number;
}
type ToggleModifier = "alt" | "ctrl" | "shift" | "meta";

interface CursorPetProps {
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
declare function CursorPet({ spriteImage, spriteSize, moveFrames, idleFrames, speed, reactionDelay, stopDistance, homeStopDistance, toggleKey, toggleModifier, enabled, className, }: CursorPetProps): react_jsx_runtime.JSX.Element;

export { CursorPet as default };
export type { CursorPetProps, SpriteFrame, ToggleModifier };
