/** Independent source-aware route policy. It imports no walkthrough controller or trace. */
import { isActive, shapeAt, circleShapeContact, transportPosition } from "../../src/physics.ts";

// The narrowest permanent return is 55 units wide; every field needs a sampled column.
const GRID = 40;

function activeFields(level, observation) {
  const phases = new Map(Object.entries(observation.phases));
  return level.flowZones.filter((field) => isActive(field.activeWhen, phases));
}

function fieldForce(fields, point) {
  let ax = 0;
  let ay = 0;
  for (const field of fields) {
    if (
      point.x < field.x ||
      point.x > field.x + field.width ||
      point.y < field.y ||
      point.y > field.y + field.height
    )
      continue;
    ax += field.acceleration.x;
    ay += field.acceleration.y;
    if (field.vortex) {
      const dx = point.x - field.vortex.center.x;
      const dy = point.y - field.vortex.center.y;
      const length = Math.max(60, Math.hypot(dx, dy));
      ax -= (dy / length) * field.vortex.strength;
      ay += (dx / length) * field.vortex.strength;
    }
  }
  return { ax, ay };
}

export function currentTarget(level, observation, levelTime) {
  const encounter = level.encounters.find((item) => item.id === observation.encounter);
  const phase = encounter ? (observation.phases[encounter.id] ?? 0) : 0;
  const step = encounter?.steps[phase];
  if (!step) {
    if (level.destination)
      return { ...level.destination.center, id: "destination", kind: "region" };
    const trigger = level.triggers.find((item) => item.kind === "transcription");
    if (!trigger) throw new Error(`No actionable target in ${level.id}`);
    return {
      x: trigger.x + trigger.width / 2,
      y: trigger.y + trigger.height / 2,
      id: trigger.id,
      kind: "region",
    };
  }
  const id = `${encounter.id}:${step.id}`;
  if (step.kind === "region") {
    return {
      x: step.region.x + step.region.width / 2,
      y: step.region.y + step.region.height / 2,
      id,
      kind: "region",
    };
  }
  if (step.kind === "contact") {
    const obstacle = level.obstacles.find((item) => item.id === step.contactId);
    if (!obstacle) throw new Error(`Missing contact ${step.contactId}`);
    const shape = shapeAt(obstacle, levelTime);
    const center =
      shape.kind === "circle"
        ? shape.center
        : shape.kind === "capsule"
          ? { x: (shape.start.x + shape.end.x) / 2, y: (shape.start.y + shape.end.y) / 2 }
          : { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
    return { ...center, id, kind: "contact", contactId: step.contactId };
  }
  if (step.kind === "transport_capture" || step.kind === "transport_delivery") {
    const transport = level.transports.find((item) => item.id === step.transportId);
    if (!transport) throw new Error(`Missing transport ${step.transportId}`);
    const carrier = transportPosition(transport, levelTime);
    const nearby = Math.hypot(carrier.x - observation.x - 15, carrier.y - observation.y - 15) < 140;
    return {
      ...(nearby ? carrier : transport.path[0]),
      id,
      kind: step.kind,
      transportId: transport.id,
    };
  }
  const triggerKind = step.milestone === "receptor_bound" ? "receptor" : "hre";
  const trigger = level.triggers.find((item) => item.kind === triggerKind);
  if (!trigger) throw new Error(`Missing ${triggerKind} trigger`);
  return {
    x: trigger.x + trigger.width / 2,
    y: trigger.y + trigger.height / 2,
    id,
    kind: "milestone",
  };
}

/** Cost map follows active descent corridors rather than assuming global gravity. */
export function planRoute(level, observation, target, levelTime) {
  const fields = activeFields(level, observation);
  const phases = new Map(Object.entries(observation.phases));
  const obstacles = level.obstacles
    .filter((item) => item.id !== target.contactId && isActive(item.activeWhen, phases))
    .map((item) => shapeAt(item, levelTime));
  const columns = Math.ceil(level.width / GRID);
  const rows = Math.ceil(level.height / GRID);
  function point(index) {
    return {
      x: Math.min(level.width - 20, (index % columns) * GRID + GRID / 2),
      y: Math.min(level.height - 20, Math.floor(index / columns) * GRID + GRID / 2),
    };
  }
  function indexFor(value) {
    const x = Math.max(0, Math.min(columns - 1, Math.floor(value.x / GRID)));
    const y = Math.max(0, Math.min(rows - 1, Math.floor(value.y / GRID)));
    return y * columns + x;
  }
  const start = indexFor({ x: observation.x + 15, y: observation.y + 15 });
  const goal = indexFor(target);
  const blocked = new Set();
  for (let index = 0; index < columns * rows; index += 1) {
    const position = point(index);
    const hazard = level.hazards.some(
      (item) =>
        position.x >= item.x - 25 &&
        position.x <= item.x + item.width + 25 &&
        position.y >= item.y - 25 &&
        position.y <= item.y + item.height + 25,
    );
    if (hazard || obstacles.some((shape) => circleShapeContact(position, 20, shape))) {
      blocked.add(index);
    }
  }
  blocked.delete(start);
  blocked.delete(goal);
  const open = new Set([start]);
  const costs = new Map([[start, 0]]);
  const parent = new Map();
  function estimate(index) {
    const here = point(index);
    return Math.hypot(here.x - target.x, here.y - target.y) / 450;
  }
  while (open.size) {
    let current = -1;
    let best = Infinity;
    for (const index of open) {
      const score = costs.get(index) + estimate(index);
      if (score < best) {
        best = score;
        current = index;
      }
    }
    if (current === goal) {
      const route = [target];
      while (parent.has(current)) {
        route.unshift(point(current));
        current = parent.get(current);
      }
      return route.filter((position, index) => {
        if (index === 0 || index === route.length - 1) return true;
        const before = route[index - 1];
        const after = route[index + 1];
        return !(
          (before.x === position.x && position.x === after.x) ||
          (before.y === position.y && position.y === after.y)
        );
      });
    }
    open.delete(current);
    const x = current % columns;
    const y = Math.floor(current / columns);
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      if (x + dx < 0 || x + dx >= columns || y + dy < 0 || y + dy >= rows) continue;
      const next = current + dx + dy * columns;
      if (blocked.has(next)) continue;
      const force = fieldForce(fields, point(next));
      const previousForce = fieldForce(fields, point(current));
      const speed = dx
        ? Math.max(45, (500 + dx * force.ax) / 1.6)
        : dy < 0
          ? Math.max(20, (200 - force.ay) / 1.6)
          : force.ay > 25 && previousForce.ay > 25
            ? Math.min(force.ay, previousForce.ay) / 1.6
            : 1;
      const cost = costs.get(current) + GRID / Math.min(500, speed);
      if (cost >= (costs.get(next) ?? Infinity)) continue;
      costs.set(next, cost);
      parent.set(next, current);
      open.add(next);
    }
  }
  throw new Error(`No independent route to ${target.id}`);
}

export function chooseKeys(level, observation, target, route) {
  if (observation.phase !== "playing") return { keys: [], reason: observation.phase };
  if (observation.attachmentKind === "transport") {
    return { keys: [], reason: "natural transport delivery" };
  }
  if (observation.attachmentKind === "sticky") {
    return { keys: ["Space"], reason: "escape temporary contact" };
  }
  const center = { x: observation.x + 15, y: observation.y + 15 };
  while (route.length > 1 && Math.hypot(route[0].x - center.x, route[0].y - center.y) < 85) {
    route.shift();
  }
  const nearContact =
    target.kind === "contact" &&
    target.y - center.y <= 120 &&
    Math.hypot(target.x - center.x, target.y - center.y) < 600;
  const waypoint = nearContact ? target : (route[0] ?? target);
  const dx = waypoint.x - center.x;
  const dy = waypoint.y - center.y;
  const desiredX = Math.max(-480, Math.min(480, dx * 2.2));
  const desiredY = Math.max(-145, Math.min(200, dy * 1.3));
  const keys = [];
  if (desiredX - observation.vx > 28) keys.push("ArrowRight");
  if (desiredX - observation.vx < -28) keys.push("ArrowLeft");
  const force = fieldForce(activeFields(level, observation), center);
  // A pulse cannot be withdrawn. Nearby contacts keep their natural approach momentum.
  const needsClimb = nearContact ? dy < -180 : dy < -70;
  if (needsClimb && observation.vy > desiredY + 20 && force.ay > -220) keys.push("Space");
  return { keys, reason: `steer to ${target.id}`, waypoint, force };
}
