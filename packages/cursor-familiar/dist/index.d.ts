import * as react_jsx_runtime from 'react/jsx-runtime';

interface SpriteFrame {
    x: number;
    y: number;
    duration: number;
}
interface CursorCompanionProps {
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
declare function CursorCompanion({ spriteImage, spriteSize, moveFrames, idleFrames, speed, reactionDelay, stopDistance, homeStopDistance, className, }: CursorCompanionProps): react_jsx_runtime.JSX.Element;

export { CursorCompanion };
export type { CursorCompanionProps, SpriteFrame };
