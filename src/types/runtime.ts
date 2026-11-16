import type { LevelDefinition } from "./level";
import type { SimulationState, EventHandler } from "./simulation";
import type { TouchControls } from "./input";
export type Runtime = {
  start(): void;
  pause(): void;
  resume(): void;
  retry(): void;
  replay(): void;
  setMuted(muted: boolean): void;
  getState(): Readonly<SimulationState>;
  dispose(): void;
};
export type RuntimeOptions = {
  canvas: HTMLCanvasElement;
  levels: readonly LevelDefinition[];
  onEvent: EventHandler;
  touchControls: TouchControls;
};
