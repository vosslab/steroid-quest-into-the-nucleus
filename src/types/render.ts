import type { LevelDefinition } from "./level";
import type { SimulationState } from "./simulation";
export type RenderSnapshot = {
  state: Readonly<SimulationState>;
  level: LevelDefinition;
  canvasWidth: number;
  canvasHeight: number;
  reducedMotion: boolean;
};
export type Renderer = { draw(snapshot: RenderSnapshot): void; dispose(): void };
