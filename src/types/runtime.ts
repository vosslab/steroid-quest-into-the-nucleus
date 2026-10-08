import type { LevelDefinition } from "./level";
import type { SimulationState, EventHandler } from "./simulation";
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
};
