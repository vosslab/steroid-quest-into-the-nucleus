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
export type BiologicalMilestone = "receptor_bound" | "hre_bound";
/** IDs are stable local names within an encounter; each step has one completion source.
 * Transport delivery excludes early release. */
export type EncounterStep = { id: string; caption: string; label?: string } & (
  | { kind: "region"; region: Rect }
  | { kind: "contact"; contactId: string }
  | { kind: "transport_capture"; transportId: string }
  | { kind: "transport_delivery"; transportId: string }
  | { kind: "milestone"; milestone: BiologicalMilestone }
);
/** Order comes from the level's required encounter sequence, independent of position. */
export type EncounterCheckpoint = { id: string; order: number; spawn: Point };
export type Encounter = {
  id: string;
  objective: string;
  steps: readonly EncounterStep[];
  completionCheckpoint?: EncounterCheckpoint;
};
/** The next stage is inferred from campaign order, rather than stored in the destination. */
export type DestinationDefinition = {
  id: string;
  center: Point;
  radius: number;
  label: string;
  motif: "vesicle" | "nucleus" | "receptor" | "chromatin" | "gene";
};
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
  kind: "receptor" | "hre" | "transcription" | "caption";
  caption?: string;
  activeWhen?: PhaseCondition;
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
  /** Completion is derived from encounterPhases; this array supplies ordering only. */
  requiredEncounterIds: readonly string[];
  /** Transcription ends the campaign and has no onward destination. */
  destination: DestinationDefinition | undefined;
  hazards: readonly Hazard[];
  checkpoints: readonly CheckpointDefinition[];
  collectibles: readonly Collectible[];
  triggers: readonly Trigger[];
  decorations: readonly Decoration[];
};
