export type InputFrame = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  pulsePressed: boolean;
  pulseHeld: boolean;
};
export type InputCommand = "pause" | "retry" | "focus-loss";
export type InputController = { sample(): InputFrame; clear(): void; dispose(): void };
