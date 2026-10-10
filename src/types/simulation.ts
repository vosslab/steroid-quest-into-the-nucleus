import type { Encounter, Rect, Point } from "./level";
import type { InputFrame } from "./input";
export type Attachment = {
  kind: "transport" | "sticky";
  id: string;
  progress: number;
  remaining: number;
  heldTime: number;
};
/** x/y are the bounding box top-left; all contact uses its inscribed circle. */
export type PlayerState = Rect & {
  radius: number;
  vx: number;
  vy: number;
  attachment: Attachment | undefined;
  captureCooldown: number;
};
export type CheckpointState = { id: string; levelIndex: number; order: number; spawn: Point };
export type GamePhase =
  "title" | "playing" | "paused" | "transition" | "respawning" | "recruiting" | "ended";
/** Simulation seconds; pause freezes this state and retry cancels it. */
export type TransitionState = {
  readonly destinationId: string;
  readonly elapsed: number;
  readonly duration: number;
};
/** Purely derived from level requirements and encounterPhases, never stored in session state. */
export type EncounterProgress = {
  current: Encounter | undefined;
  completed: number;
  total: number;
  ready: boolean;
};
export type SimulationState = {
  phase: GamePhase;
  levelIndex: number;
  player: PlayerState;
  checkpoint: CheckpointState;
  collectedIds: Set<string>;
  activatedTriggerIds: Set<string>;
  encounterPhases: Map<string, number>;
  receptorBound: boolean;
  hreBound: boolean;
  recruitmentCount: number;
  recruitmentClock: number;
  elapsed: number;
  levelTime: number;
  deathCount: number;
  phaseRemaining: number;
  transition: TransitionState | undefined;
  previousPhase: "playing" | "recruiting" | "transition";
};
export type GameEvent =
  | { type: "state" }
  | { type: "reset" }
  | { type: "stage"; levelIndex: number; name: string; objective: string }
  | { type: "caption"; text: string }
  | { type: "collect"; total: number }
  | { type: "checkpoint"; id: string }
  | { type: "death"; total: number }
  | { type: "bounce"; obstacleId: string }
  | { type: "capture" | "release"; id: string }
  | { type: "encounter"; id: string; phase: number }
  | { type: "destination-ready"; destinationId: string }
  | { type: "transition-start"; destinationId: string }
  | { type: "pulse" }
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
