import type {
  CheckpointDefinition,
  Collectible,
  CrumbleConfig,
  Decoration,
  FlowZone,
  Hazard,
  Platform,
  PlatformMaterial,
  Point,
  Trigger,
} from "./level";

/** Local section coordinates. Compilation assigns stage-prefixed IDs and horizontal offsets. */
type SectionCommon = {
  id: string;
  caption: string;
  checkpoints: readonly { x: number; floor: number }[];
  hazards?: readonly Omit<Hazard, "id">[];
  collectibles?: readonly { x: number; y: number }[];
  decorations?: readonly Decoration[];
  flowZones?: readonly Omit<FlowZone, "id">[];
};

export type TunnelSection = SectionCommon & {
  kind: "tunnel";
  width: number;
  floor: number;
  ceiling: number;
  material: PlatformMaterial;
  baffles: readonly {
    x: number;
    side: "upper" | "lower";
    width: number;
    depth: number;
    material: PlatformMaterial;
  }[];
};

export type TerraceSection = SectionCommon & {
  kind: "terraces";
  route: readonly { width: number; floor: number; gap: number }[];
  material?: PlatformMaterial;
  vesicles?: readonly {
    x: number;
    floor: number;
    width: number;
    distance: number;
    period: number;
    axis: "x" | "y";
  }[];
};

/** A broad recovery floor, automatic spring, high solid landing, and descending exit step. */
export type BounceSection = SectionCommon & {
  kind: "bounce_chamber";
  width: number;
  floor: number;
  springX: number;
  springWidth: number;
  landingX: number;
  landingWidth: number;
  landingRise: number;
  launch?: Point;
  material: PlatformMaterial;
};

export type SectionSpec = TunnelSection | TerraceSection | BounceSection | SurpriseSection;

/** Each recipe owns a broad floor, static entry/exit, checkpoint, and optional return path. */
type SurpriseSectionCommon = SectionCommon & {
  width: number;
  floor: number;
  /** Compiler defaults reserve at least 180 units at each stationary end. */
  approachWidth?: number;
  recoveryWidth?: number;
  /** The compiler generates an upper collectible cache and its route back to the floor. */
  secret?: "none" | "high_cache";
};

export type RibosomeBridgeSection = SurpriseSectionCommon & {
  kind: "ribosome_bridge";
  bridgeRise: number;
  span: number;
  count: number;
  crumble: CrumbleConfig;
};

export type OrganellePinballSection = SurpriseSectionCommon & {
  kind: "organelle_pinball";
  bumperCount: number;
  launch: Point;
  landingRise: number;
};

export type VesicleExpressSection = SurpriseSectionCommon & {
  kind: "vesicle_express";
  ceiling: number;
  acceleration: Point;
  drag?: number;
};

export type OrbitChamberSection = SurpriseSectionCommon & {
  kind: "orbit_chamber";
  orbitRise: number;
  radiusX: number;
  radiusY: number;
  period: number;
  platformCount: number;
};

export type LowGravityShaftSection = SurpriseSectionCommon & {
  kind: "low_gravity_shaft";
  rise: number;
  gravityScale: number;
  ledgeCount: number;
};

/** Reusable cellular encounter recipes compiled into ordinary simulation geometry. */
export type SurpriseSection =
  | RibosomeBridgeSection
  | OrganellePinballSection
  | VesicleExpressSection
  | OrbitChamberSection
  | LowGravityShaftSection;

/** The compiler only lowers authored sections to the existing simulation contracts. */
export type CompiledSections = {
  width: number;
  platforms: Platform[];
  flowZones: FlowZone[];
  hazards: Hazard[];
  checkpoints: CheckpointDefinition[];
  collectibles: Collectible[];
  decorations: Decoration[];
  triggers: Trigger[];
};

/** Local recipe output uses the shared platform/field contracts without another entity model. */
export type SurpriseGeometry = Pick<
  CompiledSections,
  "platforms" | "flowZones" | "collectibles" | "decorations"
> & { checkpoints: readonly { x: number; floor: number }[] };
