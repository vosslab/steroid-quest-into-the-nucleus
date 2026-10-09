import {
  ATTACHMENT_ESCAPE_TIME,
  COLLISION_ITERATIONS,
  COLLISION_SUBSTEP_DISTANCE,
  FLUID_DRAG,
  HELD_THRUST,
  HORIZONTAL_ACCELERATION,
  MAX_SPEED,
  PULSE_IMPULSE,
  RESPAWN_TIME,
  TRANSITION_TIME,
} from "./constants";
import { createGameState, createPlayer } from "./game_state";
import {
  circleRectOverlap,
  circleShapeContact,
  isActive,
  pathPoint,
  playerCenter,
  shapeAt,
  transportPosition,
  transportProgress,
  transportVelocity,
} from "./physics";
import type { InputFrame } from "./types/input";
import type { LevelDefinition, Obstacle, Point } from "./types/level";
import type { EventHandler, GamePhase, Simulation } from "./types/simulation";

const idleInput: InputFrame = { left: false, right: false, pulsePressed: false, pulseHeld: false };
const MAX_COLLISION_SUBSTEPS = 32;
const MAX_STEP_DURATION = 0.05;

function magnitude(x: number, y: number): number {
  return Math.hypot(x, y);
}
function boundedVelocity(player: { vx: number; vy: number }): void {
  const speed = magnitude(player.vx, player.vy);
  if (speed <= MAX_SPEED) return;
  player.vx = (player.vx * MAX_SPEED) / speed;
  player.vy = (player.vy * MAX_SPEED) / speed;
}
function setCenter(
  player: { x: number; y: number; width: number; height: number },
  center: Point,
): void {
  player.x = center.x - player.width / 2;
  player.y = center.y - player.height / 2;
}

/** Maximum speed of the sinusoidal obstacle offset, independent of its phase. */
function obstacleMotionSpeed(obstacle: Obstacle): number {
  const motion = obstacle.motion;
  if (!motion || !Number.isFinite(motion.period) || motion.period <= 0) return 0;
  return (
    ((Math.PI * 2) / motion.period) * Math.max(Math.abs(motion.radiusX), Math.abs(motion.radiusY))
  );
}

function collisionSubsteps(
  level: LevelDefinition,
  phases: ReadonlyMap<string, number>,
  movingDistance: number,
  dt: number,
): number {
  const movingObstacleDistance = Math.max(
    0,
    ...level.obstacles
      .filter((obstacle) => isActive(obstacle.activeWhen, phases))
      .map((obstacle) => obstacleMotionSpeed(obstacle) * dt),
  );
  return Math.min(
    MAX_COLLISION_SUBSTEPS,
    Math.max(1, Math.ceil((movingDistance + movingObstacleDistance) / COLLISION_SUBSTEP_DISTANCE)),
  );
}

function validateCollisionTraversal(levels: readonly LevelDefinition[]): void {
  for (const level of levels) {
    for (const obstacle of level.obstacles) {
      const maximumRelativeDistance =
        (MAX_SPEED + obstacleMotionSpeed(obstacle)) * MAX_STEP_DURATION;
      const requiredSteps = Math.ceil(maximumRelativeDistance / COLLISION_SUBSTEP_DISTANCE);
      if (requiredSteps > MAX_COLLISION_SUBSTEPS) {
        throw new Error(
          `${level.id}:${obstacle.id} exceeds the ${MAX_COLLISION_SUBSTEPS}-step moving-collision budget. ` +
            "Reduce its motion radius or increase its period.",
        );
      }
    }
  }
}

function pathDistance(path: readonly Point[], from: number, to: number): number {
  if (to <= from) return 0;
  const samples = Math.max(1, Math.ceil((to - from) * Math.max(1, path.length - 1) * 24));
  let previous = pathPoint(path, from);
  let distance = 0;
  for (let index = 1; index <= samples; index += 1) {
    const next = pathPoint(path, from + ((to - from) * index) / samples);
    distance += magnitude(next.x - previous.x, next.y - previous.y);
    previous = next;
  }
  return distance;
}

/** Advance an authored route no farther than the player speed cap permits. */
function transportProgressWithinSpeedLimit(
  path: readonly Point[],
  start: number,
  requested: number,
  dt: number,
): number {
  const maximumDistance = MAX_SPEED * dt;
  if (pathDistance(path, start, requested) <= maximumDistance) return requested;
  let lower = start;
  let upper = requested;
  for (let iteration = 0; iteration < 24; iteration += 1) {
    const middle = (lower + upper) / 2;
    if (pathDistance(path, start, middle) <= maximumDistance) lower = middle;
    else upper = middle;
  }
  return lower;
}

export function createSimulation(
  levels: readonly LevelDefinition[],
  onEvent: EventHandler,
): Simulation {
  validateCollisionTraversal(levels);
  const state = createGameState(levels);
  let suspendedPhase: GamePhase = "playing";
  const currentLevel = (): LevelDefinition => {
    const level = levels[state.levelIndex];
    if (!level) throw new Error("Campaign stage index is out of range.");
    return level;
  };
  const notify = (): void => onEvent({ type: "state" });
  const announce = (): void => {
    const level = currentLevel();
    onEvent({
      type: "stage",
      levelIndex: state.levelIndex,
      name: level.name,
      objective: level.objective,
    });
    onEvent({ type: "caption", text: level.caption });
    notify();
  };
  const placeSafely = (): void => {
    const level = currentLevel();
    const player = state.player;
    const clear = (candidate: Point): boolean =>
      candidate.x >= player.radius &&
      candidate.x <= level.width - player.radius &&
      candidate.y >= player.radius &&
      candidate.y <= level.height - player.radius &&
      !level.hazards.some((hazard) => circleRectOverlap(candidate, player.radius, hazard)) &&
      level.obstacles.every(
        (obstacle) =>
          !isActive(obstacle.activeWhen, state.encounterPhases) ||
          !circleShapeContact(candidate, player.radius, shapeAt(obstacle, state.levelTime)),
      );
    const findNear = (start: Point, maximumDistance: number): Point | undefined => {
      if (clear(start)) return start;
      for (
        let distance = player.radius / 2;
        distance <= maximumDistance;
        distance += player.radius / 2
      ) {
        const samples = Math.max(16, Math.ceil((Math.PI * 2 * distance) / (player.radius / 2)));
        for (let index = 0; index < samples; index += 1) {
          const angle = (index / samples) * Math.PI * 2;
          const candidate = {
            x: start.x + Math.cos(angle) * distance,
            y: start.y + Math.sin(angle) * distance,
          };
          if (clear(candidate)) return candidate;
        }
      }
      return undefined;
    };
    const nearby = findNear(playerCenter(player), player.radius * 8);
    const checkpoint = findNear(
      { x: state.checkpoint.spawn.x + player.radius, y: state.checkpoint.spawn.y + player.radius },
      player.radius * 8,
    );
    const stageStart = findNear(
      { x: level.spawn.x + player.radius, y: level.spawn.y + player.radius },
      player.radius * 8,
    );
    const safe = nearby ?? checkpoint ?? stageStart;
    if (!safe)
      throw new Error(`${level.id} has no safe release position near its authored checkpoint.`);
    setCenter(player, safe);
  };
  const release = (
    id: string,
    { velocity, safe = true }: { velocity?: Point; safe?: boolean } = {},
  ): void => {
    state.player.attachment = undefined;
    state.player.captureCooldown = 0.18;
    if (safe) placeSafely();
    if (velocity) {
      state.player.vx = velocity.x;
      state.player.vy = velocity.y;
    }
    boundedVelocity(state.player);
    onEvent({ type: "release", id });
  };
  const transportReleaseVelocity = (
    transport: LevelDefinition["transports"][number],
    progress: number,
  ): Point => {
    const tangent = transportVelocity(transport, progress);
    return {
      x: tangent.x + transport.releaseVelocity.x,
      y: tangent.y + transport.releaseVelocity.y,
    };
  };
  const restoreCheckpoint = (): void => {
    state.levelIndex = state.checkpoint.levelIndex;
    state.player = createPlayer(state.checkpoint.spawn);
    state.phase = "playing";
    state.phaseRemaining = 0;
    onEvent({ type: "reset" });
    notify();
  };
  const die = (): void => {
    if (state.phase !== "playing") return;
    state.deathCount += 1;
    state.player.attachment = undefined;
    state.phase = "respawning";
    state.phaseRemaining = RESPAWN_TIME;
    onEvent({ type: "death", total: state.deathCount });
    notify();
  };
  const nextStage = (): void => {
    if (state.levelIndex + 1 >= levels.length) return;
    state.levelIndex += 1;
    const level = currentLevel();
    state.levelTime = 0;
    state.player = createPlayer(level.spawn);
    state.checkpoint = {
      id: `${level.id}-start`,
      levelIndex: state.levelIndex,
      order: 0,
      spawn: { ...level.spawn },
    };
    state.phase = "playing";
    announce();
  };
  const advanceEncounter = (id: string, caption: string): void => {
    const phase = (state.encounterPhases.get(id) ?? 0) + 1;
    state.encounterPhases.set(id, phase);
    onEvent({ type: "encounter", id, phase });
    if (caption) onEvent({ type: "caption", text: caption });
  };
  const contactEncounter = (contactId: string): void => {
    for (const encounter of currentLevel().encounters) {
      const phase = state.encounterPhases.get(encounter.id) ?? 0;
      const step = encounter.steps[phase];
      if (step?.contactId === contactId) advanceEncounter(encounter.id, step.caption);
    }
  };
  const resolveObstacle = (obstacle: Obstacle, time: number, dt: number): boolean => {
    const player = state.player;
    const contact = circleShapeContact(
      playerCenter(player),
      player.radius,
      shapeAt(obstacle, time),
    );
    if (!contact) return false;
    contactEncounter(obstacle.id);
    if (obstacle.response.kind === "sticky") {
      if (!player.attachment && player.captureCooldown <= 0) {
        player.x += contact.normal.x * (contact.depth + 0.01);
        player.y += contact.normal.y * (contact.depth + 0.01);
        player.attachment = {
          kind: "sticky",
          id: obstacle.id,
          progress: 0,
          remaining: obstacle.response.duration,
          heldTime: 0,
        };
        player.vx = 0;
        player.vy = 0;
        onEvent({ type: "capture", id: obstacle.id });
      } else {
        player.x += contact.normal.x * (contact.depth + 0.01);
        player.y += contact.normal.y * (contact.depth + 0.01);
        const intoSurface = player.vx * contact.normal.x + player.vy * contact.normal.y;
        if (intoSurface < 0) {
          player.vx -= intoSurface * contact.normal.x;
          player.vy -= intoSurface * contact.normal.y;
        }
      }
      return true;
    }
    player.x += contact.normal.x * (contact.depth + 0.01);
    player.y += contact.normal.y * (contact.depth + 0.01);
    const before = shapeAt(obstacle, Math.max(0, time - dt));
    const now = shapeAt(obstacle, time);
    const beforeCenter = shapeCenter(before);
    const nowCenter = shapeCenter(now);
    const bodyVx = (nowCenter.x - beforeCenter.x) / Math.max(dt, 0.0001);
    const bodyVy = (nowCenter.y - beforeCenter.y) / Math.max(dt, 0.0001);
    const relative =
      (player.vx - bodyVx) * contact.normal.x + (player.vy - bodyVy) * contact.normal.y;
    if (relative < 0) {
      const restitution = Math.max(0, Math.min(1.2, obstacle.response.restitution));
      player.vx -= (1 + restitution) * relative * contact.normal.x;
      player.vy -= (1 + restitution) * relative * contact.normal.y;
      if (obstacle.response.impulse) {
        player.vx += obstacle.response.impulse.x;
        player.vy += obstacle.response.impulse.y;
      }
      onEvent({ type: "bounce", obstacleId: obstacle.id });
    }
    return true;
  };
  const moveAttached = (input: InputFrame, dt: number, level: LevelDefinition): boolean => {
    const attachment = state.player.attachment;
    if (!attachment) return false;
    attachment.heldTime = input.pulseHeld ? attachment.heldTime + dt : 0;
    attachment.remaining -= dt;
    if (input.pulsePressed || (input.pulseHeld && attachment.heldTime >= ATTACHMENT_ESCAPE_TIME)) {
      const transport = currentLevel().transports.find((item) => item.id === attachment.id);
      release(
        attachment.id,
        transport
          ? { velocity: transportReleaseVelocity(transport, attachment.progress), safe: true }
          : undefined,
      );
      return false;
    }
    if (attachment.kind === "transport") {
      const transport = currentLevel().transports.find((item) => item.id === attachment.id);
      if (!transport) {
        release(attachment.id);
        return false;
      }
      const startProgress = attachment.progress;
      const requestedProgress = Math.min(
        1,
        startProgress + dt / Math.max(0.001, transport.duration),
      );
      const endProgress = transportProgressWithinSpeedLimit(
        transport.path,
        startProgress,
        requestedProgress,
        dt,
      );
      const steps = collisionSubsteps(
        level,
        state.encounterPhases,
        pathDistance(transport.path, startProgress, endProgress),
        dt,
      );
      let previousPoint = pathPoint(transport.path, startProgress);
      for (let step = 0; step < steps; step += 1) {
        const fraction = (step + 1) / steps;
        attachment.progress = startProgress + (endProgress - startProgress) * fraction;
        const point = pathPoint(transport.path, attachment.progress);
        const slice = dt / steps;
        state.player.vx = (point.x - previousPoint.x) / slice;
        state.player.vy = (point.y - previousPoint.y) / slice;
        setCenter(state.player, point);
        const collisionTime = state.levelTime - dt + dt * fraction;
        let blocked = false;
        for (let pass = 0; pass < COLLISION_ITERATIONS; pass += 1) {
          for (const obstacle of level.obstacles) {
            if (isActive(obstacle.activeWhen, state.encounterPhases))
              blocked = resolveObstacle(obstacle, collisionTime, slice) || blocked;
          }
        }
        if (blocked) {
          // A transport route should be authored clear. If a moving body closes it anyway,
          // preserve the local rebound rather than snapping the rider through the obstruction.
          release(attachment.id, { safe: false });
          return true;
        }
        if (
          level.hazards.some((hazard) =>
            circleRectOverlap(playerCenter(state.player), state.player.radius, hazard),
          )
        ) {
          die();
          return true;
        }
        previousPoint = point;
      }
      if (attachment.progress >= 1) {
        release(attachment.id, { velocity: transportReleaseVelocity(transport, 1), safe: false });
        // The authored final point is the release position. The next frame owns its drift.
        return true;
      }
    } else if (attachment.remaining <= 0) {
      const obstacle = level.obstacles.find((item) => item.id === attachment.id);
      const contact =
        obstacle &&
        circleShapeContact(
          playerCenter(state.player),
          state.player.radius + 1,
          shapeAt(obstacle, state.levelTime),
        );
      // Automatic release must separate the player from the adhesive surface.
      // Otherwise an idle player can be captured again as soon as cooldown expires.
      release(
        attachment.id,
        contact
          ? {
              velocity: { x: contact.normal.x * 180, y: contact.normal.y * 180 },
            }
          : undefined,
      );
    }
    return Boolean(state.player.attachment);
  };
  const applyFields = (level: LevelDefinition, dt: number): void => {
    const player = state.player;
    const center = playerCenter(player);
    let ax = 0;
    let ay = 0;
    let drag = FLUID_DRAG;
    for (const field of level.flowZones) {
      if (
        !isActive(field.activeWhen, state.encounterPhases) ||
        !circleRectOverlap(center, player.radius, field)
      )
        continue;
      ax += field.acceleration.x;
      ay += field.acceleration.y;
      drag += field.drag ?? 0;
      if (field.vortex) {
        const dx = center.x - field.vortex.center.x;
        const dy = center.y - field.vortex.center.y;
        const length = Math.max(1, magnitude(dx, dy));
        ax += (-dy / length) * field.vortex.strength;
        ay += (dx / length) * field.vortex.strength;
      }
    }
    player.vx += ax * dt;
    player.vy += ay * dt;
    const damping = Math.exp(-drag * dt);
    player.vx *= damping;
    player.vy *= damping;
  };
  const captureTransport = (level: LevelDefinition): void => {
    const player = state.player;
    if (player.attachment || player.captureCooldown > 0) return;
    const center = playerCenter(player);
    for (const transport of level.transports) {
      if (!isActive(transport.activeWhen, state.encounterPhases)) continue;
      const point =
        transport.kind === "channel"
          ? transport.path[0]!
          : transportPosition(transport, state.levelTime);
      if (magnitude(center.x - point.x, center.y - point.y) > player.radius + transport.radius)
        continue;
      const progress =
        transport.kind === "channel" ? 0 : transportProgress(transport, state.levelTime);
      player.attachment = {
        kind: "transport",
        id: transport.id,
        progress,
        remaining: transport.duration * (1 - progress),
        heldTime: 0,
      };
      const velocity = transportReleaseVelocity(transport, progress);
      player.vx = velocity.x;
      player.vy = velocity.y;
      boundedVelocity(player);
      onEvent({ type: "capture", id: transport.id });
      contactEncounter(transport.id);
      break;
    }
  };
  const updateProgress = (level: LevelDefinition): void => {
    const player = state.player;
    const center = playerCenter(player);
    for (const encounter of level.encounters) {
      const phase = state.encounterPhases.get(encounter.id) ?? 0;
      const step = encounter.steps[phase];
      if (step?.region && circleRectOverlap(center, player.radius, step.region))
        advanceEncounter(encounter.id, step.caption);
    }
    for (const checkpoint of level.checkpoints) {
      if (
        !isActive(checkpoint.activeWhen, state.encounterPhases) ||
        checkpoint.order <= state.checkpoint.order
      )
        continue;
      if (!circleRectOverlap(center, player.radius, checkpoint)) continue;
      state.checkpoint = {
        id: checkpoint.id,
        levelIndex: state.levelIndex,
        order: checkpoint.order,
        spawn: { ...checkpoint.spawn },
      };
      onEvent({ type: "checkpoint", id: checkpoint.id });
    }
    for (const item of level.collectibles) {
      if (
        !state.collectedIds.has(item.id) &&
        magnitude(center.x - item.x, center.y - item.y) <= player.radius + 12
      ) {
        state.collectedIds.add(item.id);
        onEvent({ type: "collect", total: state.collectedIds.size });
      }
    }
    for (const trigger of level.triggers) {
      if (
        !isActive(trigger.activeWhen, state.encounterPhases) ||
        !circleRectOverlap(center, player.radius, trigger)
      )
        continue;
      if (
        state.activatedTriggerIds.has(trigger.id) &&
        trigger.kind !== "transcription" &&
        trigger.kind !== "exit"
      )
        continue;
      if (trigger.kind === "receptor") {
        state.receptorBound = true;
        if (trigger.checkpoint && trigger.checkpoint.order > state.checkpoint.order) {
          state.checkpoint = {
            id: trigger.id,
            levelIndex: state.levelIndex,
            order: trigger.checkpoint.order,
            spawn: { ...trigger.checkpoint.spawn },
          };
          onEvent({ type: "checkpoint", id: trigger.id });
        }
        onEvent({ type: "bound" });
      } else if (trigger.kind === "hre") {
        if (!state.receptorBound) continue;
        state.hreBound = true;
        onEvent({ type: "hre" });
      } else if (trigger.kind === "transcription") {
        if (!state.hreBound || !state.receptorBound) continue;
        state.phase = "recruiting";
        state.recruitmentClock = 0;
        player.vx = 0;
        player.vy = 0;
      } else if (trigger.kind === "exit") {
        const next = levels[state.levelIndex + 1];
        if (
          !next ||
          (next.id === "dna" && !state.receptorBound) ||
          (next.id === "transcription" && !state.hreBound)
        )
          continue;
        state.phase = "transition";
        state.phaseRemaining = TRANSITION_TIME;
      }
      state.activatedTriggerIds.add(trigger.id);
      if (trigger.caption) onEvent({ type: "caption", text: trigger.caption });
      notify();
      if (state.phase !== "playing") break;
    }
  };
  const move = (input: InputFrame, dt: number): void => {
    const level = currentLevel();
    const player = state.player;
    state.levelTime += dt;
    player.captureCooldown = Math.max(0, player.captureCooldown - dt);
    if (moveAttached(input, dt, level)) {
      if (state.phase === "playing") updateProgress(level);
      return;
    }
    const horizontal = Number(input.right) - Number(input.left);
    player.vx += horizontal * HORIZONTAL_ACCELERATION * dt;
    if (input.pulsePressed) {
      player.vy -= PULSE_IMPULSE;
      onEvent({ type: "pulse" });
    }
    if (input.pulseHeld) player.vy -= HELD_THRUST * dt;
    applyFields(level, dt);
    boundedVelocity(player);
    const steps = collisionSubsteps(
      level,
      state.encounterPhases,
      magnitude(player.vx, player.vy) * dt,
      dt,
    );
    for (let step = 0; step < steps; step += 1) {
      const slice = dt / steps;
      const collisionTime = state.levelTime - dt + slice * (step + 1);
      player.x += player.vx * slice;
      player.y += player.vy * slice;
      if (player.x < 0 || player.x > level.width - player.width) player.vx = -player.vx * 0.55;
      if (player.y < 0 || player.y > level.height - player.height) player.vy = -player.vy * 0.55;
      player.x = Math.max(0, Math.min(level.width - player.width, player.x));
      player.y = Math.max(0, Math.min(level.height - player.height, player.y));
      for (let pass = 0; pass < COLLISION_ITERATIONS; pass += 1) {
        for (const obstacle of level.obstacles)
          if (isActive(obstacle.activeWhen, state.encounterPhases))
            resolveObstacle(obstacle, collisionTime, slice);
      }
      if (
        level.hazards.some((hazard) =>
          circleRectOverlap(playerCenter(player), player.radius, hazard),
        )
      ) {
        die();
        return;
      }
    }
    boundedVelocity(player);
    captureTransport(level);
    updateProgress(level);
  };
  const simulation: Simulation = {
    state,
    start(): void {
      if (state.phase === "title") {
        state.phase = "playing";
        announce();
      }
    },
    step(input: InputFrame = idleInput, dt: number): void {
      if (
        !Number.isFinite(dt) ||
        dt <= 0 ||
        dt > 0.05 ||
        state.phase === "title" ||
        state.phase === "paused" ||
        state.phase === "ended"
      )
        return;
      state.elapsed += dt;
      if (state.phase === "respawning" || state.phase === "transition") {
        state.phaseRemaining -= dt;
        if (state.phaseRemaining <= 0) {
          if (state.phase === "respawning") restoreCheckpoint();
          else nextStage();
        }
      } else if (state.phase === "recruiting") {
        state.recruitmentClock += dt;
        if (state.recruitmentCount >= 3) {
          state.phaseRemaining -= dt;
          if (state.phaseRemaining <= 0) {
            state.phase = "ended";
            onEvent({ type: "ended", elapsed: state.elapsed, collected: state.collectedIds.size });
            notify();
          }
        } else if (input.pulsePressed) {
          const fraction = (state.recruitmentClock % 1.4) / 1.4;
          const success = fraction >= 0.2 && fraction <= 0.8;
          if (success) state.recruitmentCount += 1;
          if (state.recruitmentCount >= 3) state.phaseRemaining = 4;
          onEvent({ type: "recruitment", count: state.recruitmentCount, success });
          notify();
        }
      } else move(input, dt);
    },
    pause(): void {
      if (state.phase !== "title" && state.phase !== "ended" && state.phase !== "paused") {
        suspendedPhase = state.phase;
        state.previousPhase = state.phase === "recruiting" ? "recruiting" : "playing";
        state.phase = "paused";
        notify();
      }
    },
    resume(): void {
      if (state.phase === "paused") {
        state.phase = suspendedPhase;
        notify();
      }
    },
    retry(): void {
      if (state.phase === "title" || state.phase === "ended") return;
      if (
        state.phase === "recruiting" ||
        (state.phase === "paused" && suspendedPhase === "recruiting")
      ) {
        state.phase = "recruiting";
        if (state.recruitmentCount < 3) state.recruitmentClock = 0;
        notify();
      } else restoreCheckpoint();
    },
    replay(): void {
      Object.assign(state, createGameState(levels));
      simulation.start();
    },
  };
  return simulation;
}

function shapeCenter(shape: ReturnType<typeof shapeAt>): Point {
  if (shape.kind === "circle") return shape.center;
  if (shape.kind === "capsule")
    return { x: (shape.start.x + shape.end.x) / 2, y: (shape.start.y + shape.end.y) / 2 };
  return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
}
