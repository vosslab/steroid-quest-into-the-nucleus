import type { Point, Rect } from "../types/level";
import type {
  CaptureChamber,
  ChannelTransferChamber,
  CurrentLoopChamber,
  TransportRelayChamber,
} from "../types/sections";

type Base = Pick<CurrentLoopChamber, "id" | "bounds" | "entrance" | "exit" | "sequence">;

/** The shared recipes make downward recovery explicit instead of relying on a floor. */
export function currentLoop(base: Base, acceleration: Point): CurrentLoopChamber {
  const { bounds } = base;
  return {
    ...base,
    kind: "current_loop",
    recovery: {
      x: bounds.x + bounds.width - 55,
      y: bounds.y,
      width: 55,
      height: bounds.height,
      acceleration: { x: 0, y: 360 },
      label: "downward return stream",
    },
    fields: [
      {
        x: bounds.x + 60,
        y: bounds.y,
        width: bounds.width - 120,
        height: bounds.height * 0.7,
        acceleration,
        vortex: {
          center: { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
          strength: 220,
        },
        label: "circulating current",
      },
    ],
  };
}

export function transportRelay(
  base: Base,
  path: readonly Point[],
  kind: "vesicle" | "motor" = "vesicle",
): TransportRelayChamber {
  const { bounds } = base;
  return {
    ...base,
    kind: "transport_relay",
    recovery: {
      x: bounds.x + bounds.width - 55,
      y: bounds.y,
      width: 55,
      height: bounds.height,
      acceleration: { x: 0, y: 340 },
      label: "return stream",
    },
    transports: [
      {
        kind,
        path,
        duration: 2.4,
        radius: 38,
        wait: 0.35,
        releaseVelocity: { x: 120, y: 0 },
        label: kind === "motor" ? "motor cargo" : "vesicle ride",
      },
    ],
  };
}

export function captureChamber(base: Base, sticky: Rect): CaptureChamber {
  const { bounds } = base;
  return {
    ...base,
    kind: "capture_chamber",
    recovery: {
      x: bounds.x + bounds.width - 55,
      y: bounds.y,
      width: 55,
      height: bounds.height,
      acceleration: { x: 0, y: 320 },
      label: "downward return stream",
    },
    obstacles: [
      {
        shape: {
          kind: "roundedRect",
          ...sticky,
          radius: Math.min(sticky.width, sticky.height) / 3,
        },
        response: { kind: "sticky", duration: 1.2 },
      },
    ],
  };
}

export function channelTransfer(base: Base, path: readonly Point[]): ChannelTransferChamber {
  const { bounds } = base;
  return {
    ...base,
    kind: "channel_transfer",
    recovery: {
      x: bounds.x + bounds.width - 55,
      y: bounds.y,
      width: 55,
      height: bounds.height,
      acceleration: { x: 0, y: 360 },
      label: "return stream",
    },
    transports: [
      {
        kind: "channel",
        path,
        duration: 1.1,
        radius: 28,
        wait: 0,
        releaseVelocity: { x: 180, y: 0 },
        label: "ER channel",
      },
    ],
  };
}
