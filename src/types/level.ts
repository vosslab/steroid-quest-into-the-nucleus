/** World distances, velocities and durations use pixels and seconds. */
export type StageId = "membrane" | "cytoplasm" | "envelope" | "receptor" | "dna" | "transcription";
export type Point = { x: number; y: number };
export type Rect = Point & { width: number; height: number };
export type SurfaceMaterial = "membrane" | "mitochondrion" | "reticulum" | "gel";
export type Shape =
  | { kind: "circle"; center: Point; radius: number }
  | { kind: "capsule"; start: Point; end: Point; radius: number }
  | (Rect & { kind: "roundedRect"; radius: number });
/** Inclusive phase range; omitted bounds are open. Progress starts at zero. */
export type PhaseCondition = { encounterId: string; min?: number; max?: number };
export type Motion = { radiusX: number; radiusY: number; period: number; phase?: number };
export type Obstacle = {
  id: string;
  shape: Shape;
  material?: SurfaceMaterial;
  response:
    | { kind: "rebound"; restitution: number; impulse?: Point }
    | { kind: "sticky"; duration: number };
  motion?: Motion;
  activeWhen?: PhaseCondition;
};
export type FlowZone = Rect & {
  id: string;
  acceleration: Point;
  vortex?: { center: Point; strength: number };
  drag?: number;
  activeWhen?: PhaseCondition;
  label?: string;
};
/** Path points are player centers, interpolated along a smooth curve. */
export type Transport = {
  id: string;
  kind: "vesicle" | "motor" | "channel";
  path: readonly Point[];
  duration: number;
  radius: number;
  wait: number;
  releaseVelocity: Point;
  activeWhen?: PhaseCondition;
  label?: string;
};
export type EncounterStep = { region?: Rect; contactId?: string; caption: string; label?: string };
export type Encounter = { id: string; steps: readonly EncounterStep[] };
export type Hazard = Rect & { id: string; kind: "acid" };
export type Collectible = Point & { id: string };
/** Order is route progress, never an x-coordinate. Spawn is a calm player top-left. */
export type CheckpointDefinition = Rect & {
  id: string;
  order: number;
  spawn: Point;
  activeWhen?: PhaseCondition;
};
export type Trigger = Rect & {
  id: string;
  kind: "exit" | "receptor" | "hre" | "transcription" | "caption";
  caption?: string;
  activeWhen?: PhaseCondition;
  /** Biological binding can save an explicitly authored calm spawn. */
  checkpoint?: { order: number; spawn: Point };
};
/** Decorative geometry never determines collision. */
export type Decoration = Rect & {
  kind:
    "mitochondrion" | "vesicle" | "filament" | "lipid" | "pore" | "receptor" | "dna" | "nucleosome";
};
export type LevelDefinition = {
  id: StageId;
  name: string;
  objective: string;
  caption: string;
  width: number;
  height: number;
  spawn: Point;
  palette: { background: string; foreground: string; accent: string };
  obstacles: readonly Obstacle[];
  flowZones: readonly FlowZone[];
  transports: readonly Transport[];
  encounters: readonly Encounter[];
  hazards: readonly Hazard[];
  checkpoints: readonly CheckpointDefinition[];
  collectibles: readonly Collectible[];
  triggers: readonly Trigger[];
  decorations: readonly Decoration[];
};
