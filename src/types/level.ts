/** Shared contracts. World coordinates and velocities are measured in pixels and seconds. */
export type StageId = "membrane" | "cytoplasm" | "envelope" | "receptor" | "dna" | "transcription";
export type Point = { x: number; y: number };
export type Rect = Point & { width: number; height: number };
export type Platform = Rect & {
  id: string;
  kind: "solid" | "oneway" | "bounce";
  motion?: { axis: "x" | "y"; distance: number; period: number; phase?: number };
};
export type Hazard = Rect & { id: string; kind: "enzyme" | "acid" | "spike" };
export type Collectible = Point & { id: string };
export type CheckpointDefinition = Rect & { id: string; spawn: Point };
export type Trigger = Rect & {
  id: string;
  kind: "exit" | "receptor" | "hre" | "transcription" | "caption";
  caption?: string;
};
/** Decorative geometry never determines collision. */
export type Decoration = Rect & {
  kind:
    "mitochondrion" | "vesicle" | "filament" | "lipid" | "pore" | "receptor" | "dna" | "nucleosome";
};
/** Prefix content IDs with the stage ID to keep campaign-wide progress sets unambiguous. */
export type LevelDefinition = {
  id: StageId;
  name: string;
  objective: string;
  caption: string;
  width: number;
  height: number;
  spawn: Point;
  palette: { background: string; foreground: string; accent: string };
  platforms: readonly Platform[];
  hazards: readonly Hazard[];
  checkpoints: readonly CheckpointDefinition[];
  collectibles: readonly Collectible[];
  triggers: readonly Trigger[];
  decorations: readonly Decoration[];
};
