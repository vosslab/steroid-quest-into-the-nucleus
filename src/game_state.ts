import { PLAYER_HEIGHT, PLAYER_WIDTH } from "./constants";
import type { LevelDefinition, Point } from "./types/level";
import type { PlayerState, SimulationState } from "./types/simulation";

export function createPlayer(spawn: Point): PlayerState {
  return {
    ...spawn,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 1,
    standingOnId: undefined,
    coyoteRemaining: 0,
    jumpBufferRemaining: 0,
    airJumpsRemaining: 0,
  };
}

export function createGameState(levels: readonly LevelDefinition[]): SimulationState {
  const first = levels[0];
  if (!first) throw new Error("A campaign requires at least one level.");
  return {
    phase: "title",
    levelIndex: 0,
    player: createPlayer(first.spawn),
    checkpoint: { id: "start", levelIndex: 0, spawn: { ...first.spawn } },
    collectedIds: new Set<string>(),
    activatedTriggerIds: new Set<string>(),
    crumbleStates: new Map(),
    receptorBound: false,
    hreBound: false,
    recruitmentCount: 0,
    recruitmentClock: 0,
    elapsed: 0,
    levelTime: 0,
    deathCount: 0,
    phaseRemaining: 0,
    previousPhase: "playing",
  };
}
