import type { LevelDefinition } from "./level";
import type { GameEvent, SimulationState } from "./simulation";
export type RenderSnapshot = {
  state: Readonly<SimulationState>;
  level: LevelDefinition;
  canvasWidth: number;
  canvasHeight: number;
  reducedMotion: boolean;
};
export type Renderer = {
  play(event: GameEvent): void;
  draw(snapshot: RenderSnapshot): void;
  dispose(): void;
};
