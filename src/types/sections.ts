import type {
  CheckpointDefinition,
  Collectible,
  Decoration,
  Encounter,
  EncounterStep,
  FlowZone,
  Hazard,
  Obstacle,
  Point,
  Rect,
  Transport,
  Trigger,
} from "./level";

/** All positions are chamber-local. Placement translates them together into world space. */
export type ChamberCommon = {
  id: string;
  placement: Point;
  width: number;
  height: number;
  objective: string;
  entrance: Point;
  exit: Point;
  sequence: readonly EncounterStep[];
  recovery: Omit<FlowZone, "id">;
  /** Exploration markers do not complete required encounters. */
  checkpoint?: Omit<CheckpointDefinition, "id" | "order">;
  optionalBranch?: Rect;
  /** IDs and references are stable local names; the compiler namespaces them once. */
  obstacles?: readonly Obstacle[];
  fields?: readonly FlowZone[];
  transports?: readonly Transport[];
  hazards?: readonly Hazard[];
  collectibles?: readonly Collectible[];
  decorations?: readonly Decoration[];
  triggers?: readonly Trigger[];
} & ({ required: true; completionCheckpoint: Point } | { required: false });

/** A visible circulation field that redirects a player into a later approach. */
export type CurrentLoopChamber = ChamberCommon & { kind: "current_loop" };
/** A motor or vesicle captures briefly, then drops the player at its authored exit. */
export type TransportRelayChamber = ChamberCommon & { kind: "transport_relay" };
/** Sticky contacts interrupt flow without creating a privileged landing surface. */
export type CaptureChamber = ChamberCommon & { kind: "capture_chamber" };
/** A channel is a fast curved route between two neighboring encounters. */
export type ChannelTransferChamber = ChamberCommon & { kind: "channel_transfer" };

export type ChamberSpec =
  CurrentLoopChamber | TransportRelayChamber | CaptureChamber | ChannelTransferChamber;

export type CompiledChambers = {
  width: number;
  height: number;
  obstacles: Obstacle[];
  flowZones: FlowZone[];
  transports: Transport[];
  encounters: Encounter[];
  requiredEncounterIds: string[];
  hazards: Hazard[];
  checkpoints: CheckpointDefinition[];
  collectibles: Collectible[];
  decorations: Decoration[];
  triggers: Trigger[];
};
