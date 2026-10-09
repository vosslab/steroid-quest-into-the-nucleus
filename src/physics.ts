import type { Obstacle, Point, Rect, Shape, Transport } from "./types/level";

const EPSILON = 0.0001;
export type Contact = { normal: Point; depth: number };

export function playerCenter(player: Rect): Point {
  return { x: player.x + player.width / 2, y: player.y + player.height / 2 };
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function pointInRect(point: Point, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function add(point: Point, offset: Point): Point {
  return { x: point.x + offset.x, y: point.y + offset.y };
}
function shapeOffset(obstacle: Obstacle, time: number): Point {
  const motion = obstacle.motion;
  if (!motion || motion.period <= 0) return { x: 0, y: 0 };
  const angle = (time / motion.period + (motion.phase ?? 0)) * Math.PI * 2;
  return { x: Math.cos(angle) * motion.radiusX, y: Math.sin(angle) * motion.radiusY };
}

/** Collision shape at time, separate from decorative drawing geometry. */
export function shapeAt(obstacle: Obstacle, time: number): Shape {
  const offset = shapeOffset(obstacle, time);
  const shape = obstacle.shape;
  if (shape.kind === "circle") return { ...shape, center: add(shape.center, offset) };
  if (shape.kind === "capsule")
    return { ...shape, start: add(shape.start, offset), end: add(shape.end, offset) };
  return { ...shape, x: shape.x + offset.x, y: shape.y + offset.y };
}

export function isActive(
  condition: { encounterId: string; min?: number; max?: number } | undefined,
  encounterPhases: ReadonlyMap<string, number>,
): boolean {
  if (!condition) return true;
  const phase = encounterPhases.get(condition.encounterId) ?? 0;
  return (
    (condition.min === undefined || phase >= condition.min) &&
    (condition.max === undefined || phase <= condition.max)
  );
}

function cubic(a: number, b: number, c: number, d: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
  );
}
export function pathPoint(path: readonly Point[], progress: number): Point {
  if (!path.length) return { x: 0, y: 0 };
  if (path.length === 1) {
    const only = path[0]!;
    return { x: only.x, y: only.y };
  }
  const scaled = Math.max(0, Math.min(1, progress)) * (path.length - 1);
  const index = Math.min(path.length - 2, Math.floor(scaled));
  const a = path[Math.max(0, index - 1)]!;
  const b = path[index]!;
  const c = path[index + 1]!;
  const d = path[Math.min(path.length - 1, index + 2)]!;
  const t = scaled - index;
  const minX = Math.min(a.x, b.x, c.x, d.x);
  const maxX = Math.max(a.x, b.x, c.x, d.x);
  const minY = Math.min(a.y, b.y, c.y, d.y);
  const maxY = Math.max(a.y, b.y, c.y, d.y);
  // Catmull-Rom keeps authored turns smooth. Clamp to the local control hull so a sharp
  // corner cannot bow a cargo route through an obstacle the level author left clear.
  return {
    x: Math.max(minX, Math.min(maxX, cubic(a.x, b.x, c.x, d.x, t))),
    y: Math.max(minY, Math.min(maxY, cubic(a.y, b.y, c.y, d.y, t))),
  };
}

/** A transport waits at its entrance before one visible traversal, then repeats. */
export function transportProgress(transport: Transport, time: number): number {
  const duration = Math.max(EPSILON, transport.duration);
  const cycle = Math.max(EPSILON, transport.wait + duration);
  const phase = ((time % cycle) + cycle) % cycle;
  return phase <= transport.wait ? 0 : Math.min(1, (phase - transport.wait) / duration);
}
export function transportPosition(transport: Transport, time: number): Point {
  return pathPoint(transport.path, transportProgress(transport, time));
}

/**
 * Tangent velocity of an authored transport route.  This intentionally uses a
 * centered finite difference of the same clamped curve used for placement, so
 * a rider leaves with the route's actual direction even at a curved exit.
 */
export function transportVelocity(transport: Transport, progress: number): Point {
  const span = 0.001;
  const before = Math.max(0, progress - span);
  const after = Math.min(1, progress + span);
  if (after <= before) return { x: 0, y: 0 };
  const a = pathPoint(transport.path, before);
  const b = pathPoint(transport.path, after);
  const seconds = (after - before) * Math.max(EPSILON, transport.duration);
  return { x: (b.x - a.x) / seconds, y: (b.y - a.y) / seconds };
}

function closestOnSegment(point: Point, start: Point, end: Point): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const denominator = dx * dx + dy * dy;
  if (denominator <= EPSILON) return { ...start };
  const t = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / denominator),
  );
  return { x: start.x + dx * t, y: start.y + dy * t };
}
function circularContact(
  point: Point,
  radius: number,
  center: Point,
  otherRadius: number,
): Contact | undefined {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const distance = Math.hypot(dx, dy);
  const overlap = radius + otherRadius - distance;
  if (overlap <= 0) return undefined;
  if (distance <= EPSILON) return { normal: { x: 0, y: -1 }, depth: overlap };
  return { normal: { x: dx / distance, y: dy / distance }, depth: overlap };
}
function roundedRectContact(
  point: Point,
  radius: number,
  shape: Extract<Shape, { kind: "roundedRect" }>,
): Contact | undefined {
  const corner = Math.max(0, Math.min(shape.radius, shape.width / 2, shape.height / 2));
  const core = {
    x: shape.x + corner,
    y: shape.y + corner,
    width: Math.max(0, shape.width - corner * 2),
    height: Math.max(0, shape.height - corner * 2),
  };
  if (pointInRect(point, core)) {
    const distances = [
      { distance: point.x - shape.x, normal: { x: -1, y: 0 } },
      { distance: shape.x + shape.width - point.x, normal: { x: 1, y: 0 } },
      { distance: point.y - shape.y, normal: { x: 0, y: -1 } },
      { distance: shape.y + shape.height - point.y, normal: { x: 0, y: 1 } },
    ];
    const nearest = distances.reduce((a, b) => (a.distance < b.distance ? a : b));
    return { normal: nearest.normal, depth: radius + nearest.distance };
  }
  const closest = {
    x: Math.max(core.x, Math.min(core.x + core.width, point.x)),
    y: Math.max(core.y, Math.min(core.y + core.height, point.y)),
  };
  const contact = circularContact(point, radius, closest, corner);
  if (contact) return contact;
  if (!pointInRect(point, shape)) return undefined;
  const distances = [
    { distance: point.x - shape.x, normal: { x: -1, y: 0 } },
    { distance: shape.x + shape.width - point.x, normal: { x: 1, y: 0 } },
    { distance: point.y - shape.y, normal: { x: 0, y: -1 } },
    { distance: shape.y + shape.height - point.y, normal: { x: 0, y: 1 } },
  ];
  const nearest = distances.reduce((a, b) => (a.distance < b.distance ? a : b));
  return { normal: nearest.normal, depth: radius + nearest.distance };
}

/** Contact normal points out of the obstacle; undefined means clear. */
export function circleShapeContact(
  center: Point,
  radius: number,
  shape: Shape,
): Contact | undefined {
  if (shape.kind === "circle") return circularContact(center, radius, shape.center, shape.radius);
  if (shape.kind === "capsule")
    return circularContact(
      center,
      radius,
      closestOnSegment(center, shape.start, shape.end),
      shape.radius,
    );
  return roundedRectContact(center, radius, shape);
}
export function circleRectOverlap(center: Point, radius: number, rect: Rect): boolean {
  const closest = {
    x: Math.max(rect.x, Math.min(rect.x + rect.width, center.x)),
    y: Math.max(rect.y, Math.min(rect.y + rect.height, center.y)),
  };
  return Math.hypot(center.x - closest.x, center.y - closest.y) <= radius;
}
