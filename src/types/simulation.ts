import type { Rect, Point } from "./level";
import type { InputFrame } from "./input";
export type PlayerState = Rect & {
  vx: number;
  vy: number;
  grounded: boolean;
  facing: -1 | 1;
  standingOnId: string | undefined;
  coyoteRemaining: number;
  jumpBufferRemaining: number;
  airJumpsRemaining: number;
};
/** Retry restores position/stage while preserving collections and completed milestones. */
export type CheckpointState = { id: string; levelIndex: number; spawn: Point };
export type GamePhase =
  "title" | "playing" | "paused" | "transition" | "respawning" | "recruiting" | "ended";
export type SimulationState = {
  phase: GamePhase;
  levelIndex: number;
  player: PlayerState;
  checkpoint: CheckpointState;
  collectedIds: Set<string>;
  activatedTriggerIds: Set<string>;
  receptorBound: boolean;
  hreBound: boolean;
  recruitmentCount: number;
  recruitmentClock: number;
  elapsed: number;
  levelTime: number;
  deathCount: number;
  phaseRemaining: number;
  previousPhase: "playing" | "recruiting";
};
export type GameEvent =
  | { type: "state" }
  | { type: "stage"; levelIndex: number; name: string; objective: string }
  | { type: "caption"; text: string }
  | { type: "collect"; total: number }
  | { type: "checkpoint"; id: string }
  | { type: "death"; total: number }
  | { type: "bound" }
  | { type: "hre" }
  | { type: "recruitment"; count: number; success: boolean }
  | { type: "ended"; elapsed: number; collected: number };
export type EventHandler = (event: GameEvent) => void;
export type Simulation = {
  readonly state: SimulationState;
  step(input: InputFrame, dt: number): void;
  start(): void;
  pause(): void;
  resume(): void;
  retry(): void;
  replay(): void;
};
