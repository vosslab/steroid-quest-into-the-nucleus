import { circleRectOverlap, circleShapeContact, pathPoint, shapeAt } from "../physics";
import { PLAYER_RADIUS } from "../constants";
import type { FlowZone, PhaseCondition, Point, Rect, Transport } from "../types/level";
import type { ChamberSpec, CompiledChambers } from "../types/sections";

const TRANSPORT_SAMPLES = 200;
const MOVING_OBSTACLE_SAMPLES = 24;

const finite = (value: number): boolean => Number.isFinite(value);
const inBounds = (point: Point, bounds: Rect): boolean =>
  point.x >= bounds.x &&
  point.x <= bounds.x + bounds.width &&
  point.y >= bounds.y &&
  point.y <= bounds.y + bounds.height;
const rectWithin = (rect: Rect, bounds: Rect): boolean =>
  rect.x >= bounds.x &&
  rect.y >= bounds.y &&
  rect.x + rect.width <= bounds.x + bounds.width &&
  rect.y + rect.height <= bounds.y + bounds.height;

/** Different encounters can advance independently, so only shared IDs can prove disjoint phases. */
export function conditionsOverlap(
  first: PhaseCondition | undefined,
  second: PhaseCondition | undefined,
): boolean {
  if (!first || !second || first.encounterId !== second.encounterId) return true;
  const firstMin = first.min ?? Number.NEGATIVE_INFINITY;
  const firstMax = first.max ?? Number.POSITIVE_INFINITY;
  const secondMin = second.min ?? Number.NEGATIVE_INFINITY;
  const secondMax = second.max ?? Number.POSITIVE_INFINITY;
  return firstMin <= secondMax && secondMin <= firstMax;
}

function spawnCenter(spawn: Point): Point {
  return { x: spawn.x + PLAYER_RADIUS, y: spawn.y + PLAYER_RADIUS };
}

function fieldHasForce(field: FlowZone): boolean {
  return (
    field.acceleration.x !== 0 || field.acceleration.y !== 0 || (field.vortex?.strength ?? 0) !== 0
  );
}

function withinWorld(center: Point, width: number, height: number): boolean {
  return (
    center.x >= PLAYER_RADIUS &&
    center.x <= width - PLAYER_RADIUS &&
    center.y >= PLAYER_RADIUS &&
    center.y <= height - PLAYER_RADIUS
  );
}

function obstacleBlocksPoint(
  center: Point,
  obstacle: CompiledChambers["obstacles"][number],
): boolean {
  if (!obstacle.motion) return Boolean(circleShapeContact(center, PLAYER_RADIUS, obstacle.shape));
  const period = obstacle.motion.period;
  if (!finite(period) || period <= 0)
    return Boolean(circleShapeContact(center, PLAYER_RADIUS, obstacle.shape));
  for (let index = 0; index <= MOVING_OBSTACLE_SAMPLES; index += 1) {
    const time = (period * index) / MOVING_OBSTACLE_SAMPLES;
    if (circleShapeContact(center, PLAYER_RADIUS, shapeAt(obstacle, time))) return true;
  }
  return false;
}

function validateSpawn(
  label: string,
  spawn: Point,
  activeWhen: PhaseCondition | undefined,
  width: number,
  height: number,
  compiled: CompiledChambers,
): void {
  const center = spawnCenter(spawn);
  if (!withinWorld(center, width, height)) throw new Error(`${label}: spawn leaves the world.`);
  if (compiled.hazards.some((hazard) => circleRectOverlap(center, PLAYER_RADIUS, hazard)))
    throw new Error(`${label}: spawn overlaps a hazard.`);
  if (
    compiled.obstacles.some(
      (obstacle) =>
        conditionsOverlap(activeWhen, obstacle.activeWhen) && obstacleBlocksPoint(center, obstacle),
    )
  ) {
    throw new Error(`${label}: spawn overlaps an obstacle.`);
  }
  if (
    compiled.flowZones.some(
      (field) =>
        fieldHasForce(field) &&
        conditionsOverlap(activeWhen, field.activeWhen) &&
        circleRectOverlap(center, PLAYER_RADIUS, field),
    )
  ) {
    throw new Error(`${label}: spawn must be calm.`);
  }
}

function validateTransport(
  transport: Transport,
  width: number,
  height: number,
  compiled: CompiledChambers,
): void {
  for (let index = 0; index <= TRANSPORT_SAMPLES; index += 1) {
    const center = pathPoint(transport.path, index / TRANSPORT_SAMPLES);
    if (!withinWorld(center, width, height))
      throw new Error(`${transport.id}: transport path leaves the world.`);
    if (compiled.hazards.some((hazard) => circleRectOverlap(center, PLAYER_RADIUS, hazard)))
      throw new Error(`${transport.id}: transport path overlaps a hazard.`);
    if (
      compiled.obstacles.some(
        (obstacle) =>
          !obstacle.motion &&
          conditionsOverlap(transport.activeWhen, obstacle.activeWhen) &&
          circleShapeContact(center, PLAYER_RADIUS, obstacle.shape),
      )
    ) {
      throw new Error(`${transport.id}: transport path overlaps an obstacle.`);
    }
  }
}

function validateCompiledSafety(width: number, height: number, compiled: CompiledChambers): void {
  for (const checkpoint of compiled.checkpoints) {
    validateSpawn(checkpoint.id, checkpoint.spawn, checkpoint.activeWhen, width, height, compiled);
  }
  for (const trigger of compiled.triggers) {
    if (trigger.kind === "receptor" && trigger.checkpoint) {
      validateSpawn(
        `${trigger.id} receptor checkpoint`,
        trigger.checkpoint.spawn,
        trigger.activeWhen,
        width,
        height,
        compiled,
      );
    }
  }
  for (const transport of compiled.transports)
    validateTransport(transport, width, height, compiled);
}

function validateChamber(chamber: ChamberSpec, seen: Set<string>): void {
  if (!/^[a-z][a-z0-9_]*$/.test(chamber.id) || seen.has(chamber.id)) {
    throw new Error(`Invalid or repeated chamber ID: ${chamber.id}`);
  }
  seen.add(chamber.id);
  const { bounds } = chamber;
  if (
    ![bounds.x, bounds.y, bounds.width, bounds.height].every(finite) ||
    bounds.width < 120 ||
    bounds.height < 120
  ) {
    throw new Error(`${chamber.id}: chamber bounds must be finite and usable.`);
  }
  if (!inBounds(chamber.entrance, bounds) || !inBounds(chamber.exit, bounds)) {
    throw new Error(`${chamber.id}: entrance and exit must be inside the chamber.`);
  }
  if (!rectWithin(chamber.recovery, bounds) || chamber.recovery.acceleration.y <= 0) {
    throw new Error(`${chamber.id}: recovery must be an in-bounds downward field.`);
  }
  if (chamber.sequence.length === 0)
    throw new Error(`${chamber.id}: interaction sequence is required.`);
  if (chamber.recovery.y > bounds.y + 2 || chamber.recovery.height < bounds.height - 4) {
    throw new Error(`${chamber.id}: recovery must reach every upper pocket.`);
  }
  for (const field of chamber.fields ?? []) {
    if (!rectWithin(field, bounds)) throw new Error(`${chamber.id}: field leaves its chamber.`);
  }
  if (chamber.checkpoint) {
    if (
      !rectWithin(chamber.checkpoint, bounds) ||
      !inBounds(chamber.checkpoint.spawn, chamber.checkpoint)
    ) {
      throw new Error(`${chamber.id}: checkpoint and spawn must be inside the chamber.`);
    }
  }
  for (const transport of chamber.transports ?? []) {
    if (transport.path.length < 2 || transport.duration <= 0 || transport.wait < 0) {
      throw new Error(`${chamber.id}: transport needs a timed path.`);
    }
    if (!transport.path.every((point) => inBounds(point, bounds))) {
      throw new Error(`${chamber.id}: transport path leaves its chamber.`);
    }
  }
}

/** Compile declarative cellular chambers into the shared, data-only simulation primitives. */
export function compileChambers(
  stage: string,
  width: number,
  height: number,
  chambers: readonly ChamberSpec[],
): CompiledChambers {
  const compiled: CompiledChambers = {
    width,
    height,
    obstacles: [],
    flowZones: [],
    transports: [],
    encounters: [],
    hazards: [],
    checkpoints: [],
    collectibles: [],
    decorations: [],
    triggers: [],
  };
  const ids = new Set<string>();
  for (const [order, chamber] of chambers.entries()) {
    validateChamber(chamber, ids);
    const prefix = `${stage}-${chamber.id}`;
    compiled.obstacles.push(
      ...(chamber.obstacles ?? []).map((item, index) => ({
        ...item,
        id: `${prefix}-obstacle-${index}`,
      })),
    );
    compiled.flowZones.push(
      { ...chamber.recovery, id: `${prefix}-return` },
      ...(chamber.fields ?? []).map((item, index) => ({ ...item, id: `${prefix}-field-${index}` })),
    );
    compiled.transports.push(
      ...(chamber.transports ?? []).map((item, index) => ({
        ...item,
        id: `${prefix}-transport-${index}`,
      })),
    );
    compiled.encounters.push({ id: prefix, steps: chamber.sequence });
    if (chamber.checkpoint)
      compiled.checkpoints.push({
        ...chamber.checkpoint,
        id: `${prefix}-checkpoint`,
        order: order + 1,
      });
    compiled.hazards.push(
      ...(chamber.hazards ?? []).map((item, index) => ({
        ...item,
        id: `${prefix}-hazard-${index}`,
      })),
    );
    compiled.collectibles.push(
      ...(chamber.collectibles ?? []).map((item, index) => ({
        ...item,
        id: `${prefix}-collectible-${index}`,
      })),
    );
    compiled.decorations.push(...(chamber.decorations ?? []));
    compiled.triggers.push(
      ...(chamber.triggers ?? []).map((item, index) => ({
        ...item,
        id: `${prefix}-trigger-${index}`,
      })),
    );
  }
  validateCompiledSafety(width, height, compiled);
  return compiled;
}
