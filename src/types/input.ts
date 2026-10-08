export type InputFrame = {
  left: boolean;
  right: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
};
export type InputCommand = "pause" | "retry" | "focus-loss";
export type InputController = { sample(): InputFrame; clear(): void; dispose(): void };
