import type { Point, Rect } from "../types/level";
import type {
  CaptureChamber,
  ChannelTransferChamber,
  CurrentLoopChamber,
  TransportRelayChamber,
  ChamberCommon,
} from "../types/sections";

type Base = Omit<ChamberCommon, "recovery" | "required"> &
  ({ required: true; completionCheckpoint: Point } | { required: false });

/** The shared recipes make downward recovery explicit instead of relying on a floor. */
export function currentLoop(base: Base, acceleration: Point): CurrentLoopChamber {
  const { width, height } = base;
  return {
    ...base,
    kind: "current_loop",
    recovery: {
      x: width - 55,
      y: 0,
      width: 55,
      height: height,
      acceleration: { x: 0, y: 360 },
      label: "downward return stream",
    },
    fields: [
      {
        id: "circulation",
        x: 60,
        y: 0,
        width: width - 120,
        height: height * 0.7,
        acceleration,
        vortex: {
          center: { x: width / 2, y: height / 2 },
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
  const { width, height } = base;
  return {
    ...base,
    kind: "transport_relay",
    recovery: {
      x: width - 55,
      y: 0,
      width: 55,
      height: height,
      acceleration: { x: 0, y: 340 },
      label: "return stream",
    },
    transports: [
      {
        id: "cargo",
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
  const { width, height } = base;
  return {
    ...base,
    kind: "capture_chamber",
    recovery: {
      x: width - 55,
      y: 0,
      width: 55,
      height: height,
      acceleration: { x: 0, y: 320 },
      label: "downward return stream",
    },
    obstacles: [
      {
        id: "sticky",
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
  const { width, height } = base;
  return {
    ...base,
    kind: "channel_transfer",
    recovery: {
      x: width - 55,
      y: 0,
      width: 55,
      height: height,
      acceleration: { x: 0, y: 360 },
      label: "return stream",
    },
    transports: [
      {
        id: "channel",
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
