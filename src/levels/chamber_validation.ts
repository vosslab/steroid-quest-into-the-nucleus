import { PLAYER_RADIUS } from "../constants";
import type { PhaseCondition, Point, Rect, Shape } from "../types/level";
import type { ChamberSpec } from "../types/sections";

const LOCAL_NAME = /^[a-z][a-z0-9_]*$/;

function pointWithin(point: Point, bounds: Rect): boolean {
  return (
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    point.x >= bounds.x &&
    point.y >= bounds.y &&
    point.x <= bounds.x + bounds.width &&
    point.y <= bounds.y + bounds.height
  );
}

function rectWithin(rect: Rect, bounds: Rect): boolean {
  return (
    Number.isFinite(rect.width) &&
    Number.isFinite(rect.height) &&
    rect.width > 0 &&
    rect.height > 0 &&
    pointWithin(rect, bounds) &&
    pointWithin({ x: rect.x + rect.width, y: rect.y + rect.height }, bounds)
  );
}

function shapeBounds(shape: Shape): Rect {
  if (shape.kind === "roundedRect") return shape;
  const start = shape.kind === "circle" ? shape.center : shape.start;
  const end = shape.kind === "circle" ? shape.center : shape.end;
  return {
    x: Math.min(start.x, end.x) - shape.radius,
    y: Math.min(start.y, end.y) - shape.radius,
    width: Math.abs(end.x - start.x) + 2 * shape.radius,
    height: Math.abs(end.y - start.y) + 2 * shape.radius,
  };
}

function validateCondition(
  condition: PhaseCondition | undefined,
  chambers: readonly ChamberSpec[],
): void {
  if (!condition) return;
  const referenced = chambers.find((chamber) => chamber.id === condition.encounterId);
  if (!referenced) throw new Error(`Unknown encounter reference: ${condition.encounterId}`);
  const values = [condition.min, condition.max].filter((value) => value !== undefined);
  if (
    values.some(
      (value) => !Number.isInteger(value) || value < 0 || value > referenced.sequence.length,
    ) ||
    (condition.min ?? 0) > (condition.max ?? referenced.sequence.length)
  ) {
    throw new Error(`${condition.encounterId}: invalid phase bounds.`);
  }
}

function validateChamber(chamber: ChamberSpec, chambers: readonly ChamberSpec[]): void {
  const bounds: Rect = { x: 0, y: 0, width: chamber.width, height: chamber.height };
  if (!chamber.objective.trim()) throw new Error(`${chamber.id}: objective is required.`);
  if (!pointWithin(chamber.entrance, bounds) || !pointWithin(chamber.exit, bounds))
    throw new Error(`${chamber.id}: entrance and exit must be inside the chamber.`);
  if (!rectWithin(chamber.recovery, bounds) || chamber.recovery.acceleration.y <= 0)
    throw new Error(`${chamber.id}: recovery must be an in-bounds downward field.`);
  if (chamber.recovery.y > 2 || chamber.recovery.height < chamber.height - 4)
    throw new Error(`${chamber.id}: recovery must reach every upper pocket.`);
  if (chamber.sequence.length === 0)
    throw new Error(`${chamber.id}: interaction sequence is required.`);
  if (
    chamber.required &&
    (!pointWithin(chamber.completionCheckpoint, bounds) ||
      !pointWithin(
        {
          x: chamber.completionCheckpoint.x + 2 * PLAYER_RADIUS,
          y: chamber.completionCheckpoint.y + 2 * PLAYER_RADIUS,
        },
        bounds,
      ))
  ) {
    throw new Error(`${chamber.id}: completion spawn leaves its chamber.`);
  }
  const seen = new Set(["return", "checkpoint", "complete"]);
  const primitives = [
    ...(chamber.obstacles ?? []),
    ...(chamber.fields ?? []),
    ...(chamber.transports ?? []),
    ...(chamber.hazards ?? []),
    ...(chamber.collectibles ?? []),
    ...(chamber.triggers ?? []),
  ];
  for (const item of primitives) {
    if (!LOCAL_NAME.test(item.id) || seen.has(item.id))
      throw new Error(`${chamber.id}: invalid or repeated primitive ID: ${item.id}`);
    seen.add(item.id);
  }
  const conditioned = [
    chamber.recovery,
    ...(chamber.fields ?? []),
    ...(chamber.obstacles ?? []),
    ...(chamber.transports ?? []),
    ...(chamber.triggers ?? []),
    ...(chamber.checkpoint ? [chamber.checkpoint] : []),
  ];
  for (const item of conditioned) validateCondition(item.activeWhen, chambers);
  const stepIds = new Set<string>();
  for (const step of chamber.sequence) {
    if (typeof step.id !== "string" || !LOCAL_NAME.test(step.id) || stepIds.has(step.id))
      throw new Error(`${chamber.id}: invalid or repeated encounter step ID: ${step.id}`);
    stepIds.add(step.id);
    if (step.kind === "region" && !rectWithin(step.region, bounds))
      throw new Error(`${chamber.id}: encounter region leaves its chamber.`);
    if (step.kind === "contact" && !chamber.obstacles?.some((item) => item.id === step.contactId))
      throw new Error(`${chamber.id}: unknown contact reference: ${step.contactId}`);
    if (
      (step.kind === "transport_capture" || step.kind === "transport_delivery") &&
      !chamber.transports?.some((item) => item.id === step.transportId)
    )
      throw new Error(`${chamber.id}: unknown transport reference: ${step.transportId}`);
  }
  for (const field of [chamber.recovery, ...(chamber.fields ?? [])]) {
    if (
      !rectWithin(field, bounds) ||
      !Number.isFinite(field.acceleration.x) ||
      !Number.isFinite(field.acceleration.y) ||
      (field.vortex &&
        (!pointWithin(field.vortex.center, bounds) || !Number.isFinite(field.vortex.strength)))
    )
      throw new Error(`${chamber.id}: field leaves its chamber or has invalid force.`);
  }
  for (const obstacle of chamber.obstacles ?? []) {
    const rect = shapeBounds(obstacle.shape);
    const motion = obstacle.motion;
    const sweep = {
      x: rect.x - (motion?.radiusX ?? 0),
      y: rect.y - (motion?.radiusY ?? 0),
      width: rect.width + 2 * (motion?.radiusX ?? 0),
      height: rect.height + 2 * (motion?.radiusY ?? 0),
    };
    if (
      !Number.isFinite(obstacle.shape.radius) ||
      obstacle.shape.radius <= 0 ||
      !rectWithin(sweep, bounds) ||
      (motion &&
        (![motion.radiusX, motion.radiusY, motion.period, motion.phase ?? 0].every(
          Number.isFinite,
        ) ||
          motion.radiusX < 0 ||
          motion.radiusY < 0 ||
          motion.period <= 0))
    )
      throw new Error(`${chamber.id}: obstacle or motion leaves its chamber.`);
  }
  for (const transport of chamber.transports ?? []) {
    if (
      transport.path.length < 2 ||
      !Number.isFinite(transport.duration) ||
      transport.duration <= 0 ||
      !Number.isFinite(transport.wait) ||
      transport.wait < 0 ||
      !Number.isFinite(transport.radius) ||
      transport.radius <= 0 ||
      ![transport.releaseVelocity.x, transport.releaseVelocity.y].every(Number.isFinite)
    )
      throw new Error(`${chamber.id}: transport needs a valid timed path.`);
    if (!transport.path.every((point) => pointWithin(point, bounds)))
      throw new Error(`${chamber.id}: transport path leaves its chamber.`);
  }
  const rectangles = [
    ...(chamber.hazards ?? []),
    ...(chamber.triggers ?? []),
    ...(chamber.decorations ?? []),
    ...(chamber.optionalBranch ? [chamber.optionalBranch] : []),
  ];
  if (rectangles.some((rect) => !rectWithin(rect, bounds)))
    throw new Error(`${chamber.id}: authored rectangle leaves its chamber.`);
  if (chamber.collectibles?.some((point) => !pointWithin(point, bounds)))
    throw new Error(`${chamber.id}: collectible leaves its chamber.`);
  if (
    chamber.checkpoint &&
    (!rectWithin(chamber.checkpoint, bounds) ||
      !pointWithin(chamber.checkpoint.spawn, chamber.checkpoint))
  )
    throw new Error(`${chamber.id}: checkpoint and spawn must be inside the chamber.`);
}

/** Reject authoring errors before translation or safety sampling. Overlapping chambers are valid. */
export function validateChambers(
  stage: string,
  width: number,
  height: number,
  chambers: readonly ChamberSpec[],
): void {
  if (
    !LOCAL_NAME.test(stage) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    throw new Error("Stage ID and world bounds must be valid.");
  const world = { x: 0, y: 0, width, height };
  const seen = new Set<string>();
  for (const chamber of chambers) {
    if (!LOCAL_NAME.test(chamber.id) || seen.has(chamber.id))
      throw new Error(`Invalid or repeated chamber ID: ${chamber.id}`);
    seen.add(chamber.id);
    if (
      chamber.width < 120 ||
      chamber.height < 120 ||
      !rectWithin({ ...chamber.placement, width: chamber.width, height: chamber.height }, world)
    )
      throw new Error(
        `${chamber.id}: chamber bounds must be finite, usable, and inside the world.`,
      );
  }
  for (const chamber of chambers) validateChamber(chamber, chambers);
}
