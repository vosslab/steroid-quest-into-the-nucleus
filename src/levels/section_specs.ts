import { circleRectOverlap, circleShapeContact, pathPoint, shapeAt } from "../physics";
import { validateChambers } from "./chamber_validation";
import { PLAYER_RADIUS } from "../constants";
import type {
  FlowZone,
  PhaseCondition,
  Point,
  Rect,
  Shape,
  Transport,
  EncounterStep,
} from "../types/level";
import type { ChamberSpec, CompiledChambers } from "../types/sections";

const TRANSPORT_SAMPLES = 200;
const MOVING_OBSTACLE_SAMPLES = 24;

const finite = (value: number): boolean => Number.isFinite(value);

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
  // Inflate each sample by the maximum movement to the nearest sampled time.
  // This covers the continuous orbit, including contacts between sample instants.
  const clearance =
    PLAYER_RADIUS +
    (Math.PI * Math.max(obstacle.motion.radiusX, obstacle.motion.radiusY)) /
      MOVING_OBSTACLE_SAMPLES;
  for (let index = 0; index <= MOVING_OBSTACLE_SAMPLES; index += 1) {
    const time = (period * index) / MOVING_OBSTACLE_SAMPLES;
    if (circleShapeContact(center, clearance, shapeAt(obstacle, time))) return true;
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
  for (const encounter of compiled.encounters) {
    const checkpoint = encounter.completionCheckpoint;
    if (checkpoint) {
      validateSpawn(
        checkpoint.id,
        checkpoint.spawn,
        { encounterId: encounter.id, min: encounter.steps.length },
        width,
        height,
        compiled,
      );
    }
  }
  for (const transport of compiled.transports)
    validateTransport(transport, width, height, compiled);
}

function translatePoint(point: Point, placement: Point): Point {
  return { x: point.x + placement.x, y: point.y + placement.y };
}

function translateRect<T extends Rect>(rect: T, placement: Point): T {
  return { ...rect, ...translatePoint(rect, placement) };
}

function translateShape(shape: Shape, placement: Point): Shape {
  switch (shape.kind) {
    case "circle":
      return { ...shape, center: translatePoint(shape.center, placement) };
    case "capsule":
      return {
        ...shape,
        start: translatePoint(shape.start, placement),
        end: translatePoint(shape.end, placement),
      };
    case "roundedRect":
      return translateRect(shape, placement);
  }
}

function translateCondition(
  condition: PhaseCondition | undefined,
  stage: string,
): PhaseCondition | undefined {
  return condition && { ...condition, encounterId: `${stage}-${condition.encounterId}` };
}

function translateStep(step: EncounterStep, placement: Point, prefix: string): EncounterStep {
  switch (step.kind) {
    case "region":
      return { ...step, region: translateRect(step.region, placement) };
    case "contact":
      return { ...step, contactId: `${prefix}-${step.contactId}` };
    case "transport_capture":
    case "transport_delivery":
      return { ...step, transportId: `${prefix}-${step.transportId}` };
    case "milestone":
      return { ...step };
  }
}

/** Translate ordinary chamber-local recipes, namespacing IDs exactly once. */
export function compileChambers(
  stage: string,
  width: number,
  height: number,
  chambers: readonly ChamberSpec[],
): CompiledChambers {
  validateChambers(stage, width, height, chambers);
  const compiled: CompiledChambers = {
    width,
    height,
    obstacles: [],
    flowZones: [],
    transports: [],
    encounters: [],
    requiredEncounterIds: [],
    hazards: [],
    checkpoints: [],
    collectibles: [],
    decorations: [],
    triggers: [],
  };
  for (const chamber of chambers) {
    const prefix = `${stage}-${chamber.id}`;
    const placement = chamber.placement;
    compiled.obstacles.push(
      ...(chamber.obstacles ?? []).map((item) => ({
        ...item,
        id: `${prefix}-${item.id}`,
        shape: translateShape(item.shape, placement),
        activeWhen: translateCondition(item.activeWhen, stage),
      })),
    );
    const fields = [{ ...chamber.recovery, id: "return" }, ...(chamber.fields ?? [])];
    compiled.flowZones.push(
      ...fields.map((item) => ({
        ...translateRect(item, placement),
        id: `${prefix}-${item.id}`,
        vortex: item.vortex && {
          ...item.vortex,
          center: translatePoint(item.vortex.center, placement),
        },
        activeWhen: translateCondition(item.activeWhen, stage),
      })),
    );
    compiled.transports.push(
      ...(chamber.transports ?? []).map((item) => ({
        ...item,
        id: `${prefix}-${item.id}`,
        path: item.path.map((point) => translatePoint(point, placement)),
        activeWhen: translateCondition(item.activeWhen, stage),
      })),
    );
    if (chamber.required) compiled.requiredEncounterIds.push(prefix);
    compiled.encounters.push({
      id: prefix,
      objective: chamber.objective,
      steps: chamber.sequence.map((step) => translateStep(step, placement, prefix)),
      completionCheckpoint: chamber.required
        ? {
            id: `${prefix}-complete`,
            order: compiled.requiredEncounterIds.length,
            spawn: translatePoint(chamber.completionCheckpoint, placement),
          }
        : undefined,
    });
    if (chamber.checkpoint)
      compiled.checkpoints.push({
        ...translateRect(chamber.checkpoint, placement),
        id: `${prefix}-checkpoint`,
        order: 0,
        spawn: translatePoint(chamber.checkpoint.spawn, placement),
        activeWhen: translateCondition(chamber.checkpoint.activeWhen, stage),
      });
    compiled.hazards.push(
      ...(chamber.hazards ?? []).map((item) => ({
        ...translateRect(item, placement),
        id: `${prefix}-${item.id}`,
      })),
    );
    compiled.collectibles.push(
      ...(chamber.collectibles ?? []).map((item) => ({
        ...item,
        ...translatePoint(item, placement),
        id: `${prefix}-${item.id}`,
      })),
    );
    compiled.decorations.push(
      ...(chamber.decorations ?? []).map((item) => translateRect(item, placement)),
    );
    compiled.triggers.push(
      ...(chamber.triggers ?? []).map((item) => ({
        ...translateRect(item, placement),
        id: `${prefix}-${item.id}`,
        activeWhen: translateCondition(item.activeWhen, stage),
      })),
    );
  }
  validateCompiledSafety(width, height, compiled);
  return compiled;
}
