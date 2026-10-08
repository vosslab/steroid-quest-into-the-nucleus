import {
  AIR_FRICTION,
  BOUNCE_SPEED,
  COYOTE_TIME,
  GRAVITY,
  GROUND_FRICTION,
  JUMP_BUFFER_TIME,
  JUMP_SPEED,
  MAX_SPEED,
  MOVE_ACCELERATION,
  RESPAWN_TIME,
  TRANSITION_TIME,
} from "./constants";
import { createGameState, createPlayer } from "./game_state";
import { overlaps, platformRect } from "./physics";
import type { InputFrame } from "./types/input";
import type { LevelDefinition } from "./types/level";
import type { EventHandler, GamePhase, Simulation } from "./types/simulation";

const approach = (value: number, target: number, amount: number): number =>
  value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);

export function createSimulation(
  levels: readonly LevelDefinition[],
  onEvent: EventHandler,
): Simulation {
  const state = createGameState(levels);
  let suspendedPhase: GamePhase = "playing";
  let jumpCutEligible = false;
  const notify = (): void => onEvent({ type: "state" });
  const currentLevel = (): LevelDefinition => {
    const level = levels[state.levelIndex];
    if (!level) throw new Error("Campaign stage index is out of range.");
    return level;
  };
  const announceLevel = (): void => {
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
  const restoreCheckpoint = (): void => {
    state.levelIndex = state.checkpoint.levelIndex;
    state.player = createPlayer(state.checkpoint.spawn);
    jumpCutEligible = false;
    state.player.airJumpsRemaining = state.receptorBound ? 1 : 0;
    state.phase = "playing";
    state.phaseRemaining = 0;
    notify();
  };
  const die = (): void => {
    state.deathCount += 1;
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
    jumpCutEligible = false;
    state.player.airJumpsRemaining = state.receptorBound ? 1 : 0;
    state.checkpoint = {
      id: `${level.id}-start`,
      levelIndex: state.levelIndex,
      spawn: { ...level.spawn },
    };
    state.phase = "playing";
    announceLevel();
  };
  const move = (input: InputFrame, dt: number): void => {
    const level = currentLevel();
    const player = state.player;
    const previousTime = state.levelTime;
    state.levelTime += dt;
    const standing = level.platforms.find((platform) => platform.id === player.standingOnId);
    if (standing) {
      const before = platformRect(standing, previousTime);
      const after = platformRect(standing, state.levelTime);
      player.x += after.x - before.x;
      player.y += after.y - before.y;
    }
    player.coyoteRemaining = player.grounded
      ? COYOTE_TIME
      : Math.max(0, player.coyoteRemaining - dt);
    player.jumpBufferRemaining = input.jumpPressed
      ? JUMP_BUFFER_TIME
      : Math.max(0, player.jumpBufferRemaining - dt);
    const direction = Number(input.right) - Number(input.left);
    player.vx = approach(
      player.vx,
      direction * MAX_SPEED,
      (direction ? MOVE_ACCELERATION : player.grounded ? GROUND_FRICTION : AIR_FRICTION) * dt,
    );
    if (direction) player.facing = direction < 0 ? -1 : 1;
    if (
      player.jumpBufferRemaining > 0 &&
      (player.coyoteRemaining > 0 || player.airJumpsRemaining > 0)
    ) {
      if (player.coyoteRemaining <= 0) player.airJumpsRemaining -= 1;
      player.vy = -JUMP_SPEED;
      jumpCutEligible = true;
      player.grounded = false;
      player.standingOnId = undefined;
      player.coyoteRemaining = 0;
      player.jumpBufferRemaining = 0;
    }
    if (jumpCutEligible && !input.jumpHeld && player.vy < -JUMP_SPEED * 0.45) {
      player.vy = -JUMP_SPEED * 0.45;
      jumpCutEligible = false;
    }
    player.vy = Math.min(1000, player.vy + GRAVITY * dt);
    const previousX = player.x;
    player.x = Math.max(0, Math.min(level.width - player.width, player.x + player.vx * dt));
    for (const platform of level.platforms) {
      if (platform.kind === "oneway") continue;
      const rect = platformRect(platform, state.levelTime);
      if (!overlaps(player, rect)) continue;
      if (previousX + player.width <= rect.x + 2) {
        player.x = rect.x - player.width;
        player.vx = 0;
      } else if (previousX >= rect.x + rect.width - 2) {
        player.x = rect.x + rect.width;
        player.vx = 0;
      }
    }
    const previousY = player.y;
    player.y += player.vy * dt;
    player.grounded = false;
    player.standingOnId = undefined;
    for (const platform of level.platforms) {
      const rect = platformRect(platform, state.levelTime);
      if (!overlaps(player, rect)) continue;
      if (player.vy >= 0 && previousY + player.height <= rect.y + 3) {
        player.y = rect.y - player.height;
        if (platform.kind === "bounce") {
          player.vy = -BOUNCE_SPEED;
          jumpCutEligible = false;
          player.coyoteRemaining = 0;
          player.airJumpsRemaining = state.receptorBound ? 1 : 0;
        } else {
          player.vy = 0;
          jumpCutEligible = false;
          player.grounded = true;
          player.standingOnId = platform.id;
          player.airJumpsRemaining = state.receptorBound ? 1 : 0;
        }
      } else if (
        platform.kind !== "oneway" &&
        player.vy < 0 &&
        previousY >= rect.y + rect.height - 3
      ) {
        player.y = rect.y + rect.height;
        player.vy = 0;
      }
    }
    if (player.y > level.height + 100 || level.hazards.some((hazard) => overlaps(player, hazard))) {
      die();
      return;
    }
    for (const checkpoint of level.checkpoints) {
      if (overlaps(player, checkpoint) && state.checkpoint.id !== checkpoint.id) {
        state.checkpoint = {
          id: checkpoint.id,
          levelIndex: state.levelIndex,
          spawn: { ...checkpoint.spawn },
        };
        onEvent({ type: "checkpoint", id: checkpoint.id });
        notify();
      }
    }
    for (const item of level.collectibles) {
      if (
        !state.collectedIds.has(item.id) &&
        overlaps(player, { ...item, width: 24, height: 24 })
      ) {
        state.collectedIds.add(item.id);
        onEvent({ type: "collect", total: state.collectedIds.size });
      }
    }
    for (const trigger of level.triggers) {
      if (!overlaps(player, trigger)) continue;
      if (
        state.activatedTriggerIds.has(trigger.id) &&
        trigger.kind !== "exit" &&
        trigger.kind !== "transcription"
      )
        continue;
      if (trigger.kind === "receptor") {
        state.receptorBound = true;
        player.airJumpsRemaining = 1;
        state.checkpoint = {
          id: trigger.id,
          levelIndex: state.levelIndex,
          spawn: { x: player.x, y: player.y },
        };
        onEvent({ type: "bound" });
        onEvent({ type: "checkpoint", id: trigger.id });
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
  const simulation: Simulation = {
    state,
    start(): void {
      if (state.phase !== "title") return;
      state.phase = "playing";
      announceLevel();
    },
    step(input: InputFrame, dt: number): void {
      if (!Number.isFinite(dt) || dt <= 0 || dt > 0.05) return;
      if (state.phase === "title" || state.phase === "paused" || state.phase === "ended") return;
      state.elapsed += dt;
      if (state.phase === "respawning" || state.phase === "transition") {
        state.phaseRemaining -= dt;
        if (state.phaseRemaining <= 0) {
          if (state.phase === "respawning") restoreCheckpoint();
          else nextStage();
        }
      } else if (state.phase === "recruiting") {
        state.recruitmentClock += dt;
        if (state.recruitmentCount === 3) {
          state.phaseRemaining -= dt;
          if (state.phaseRemaining <= 0) {
            state.phase = "ended";
            onEvent({ type: "ended", elapsed: state.elapsed, collected: state.collectedIds.size });
            notify();
          }
        } else if (input.jumpPressed) {
          const fraction = (state.recruitmentClock % 1.4) / 1.4;
          const success = fraction >= 0.2 && fraction <= 0.8;
          if (success) state.recruitmentCount += 1;
          onEvent({ type: "recruitment", count: state.recruitmentCount, success });
          if (state.recruitmentCount === 3) state.phaseRemaining = 4;
          notify();
        }
      } else move(input, dt);
    },
    pause(): void {
      if (state.phase === "title" || state.phase === "ended" || state.phase === "paused") return;
      suspendedPhase = state.phase;
      state.previousPhase = state.phase === "recruiting" ? "recruiting" : "playing";
      state.phase = "paused";
      notify();
    },
    resume(): void {
      if (state.phase !== "paused") return;
      state.phase = suspendedPhase;
      notify();
    },
    retry(): void {
      if (state.phase === "title" || state.phase === "ended") return;
      // A bound complex remains docked; retry repeats its current timing attempt.
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
      jumpCutEligible = false;
      simulation.start();
    },
  };
  return simulation;
}
