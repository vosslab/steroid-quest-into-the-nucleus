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

/** A chamber is local authored space inside one compact stage. */
export type ChamberCommon = {
  id: string;
  bounds: Rect;
  entrance: Point;
  exit: Point;
  sequence: readonly EncounterStep[];
  recovery: Omit<FlowZone, "id">;
  /** Explicit calm save area at a chamber join; recipes never infer one from an entrance. */
  checkpoint?: Omit<CheckpointDefinition, "id" | "order">;
  optionalBranch?: Rect;
  obstacles?: readonly Omit<Obstacle, "id">[];
  fields?: readonly Omit<FlowZone, "id">[];
  transports?: readonly Omit<Transport, "id">[];
  hazards?: readonly Omit<Hazard, "id">[];
  collectibles?: readonly Omit<Collectible, "id">[];
  decorations?: readonly Decoration[];
  triggers?: readonly Omit<Trigger, "id">[];
};

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
  hazards: Hazard[];
  checkpoints: CheckpointDefinition[];
  collectibles: Collectible[];
  decorations: Decoration[];
  triggers: Trigger[];
};
