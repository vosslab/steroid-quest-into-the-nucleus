import type {
  EncounterStep,
  FlowZone,
  Obstacle,
  PhaseCondition,
  Point,
  Rect,
} from "../types/level";
import { phaseAfter, phaseBefore } from "./encounter_phases";

/** A field stays available through a pending named step, including escape and retry. */
export function phaseWindow(
  id: string,
  steps: readonly EncounterStep[],
  after: string,
  before: string,
): PhaseCondition {
  return { encounterId: id, min: phaseAfter(steps, after), max: phaseBefore(steps, before) };
}

export function phaseAfterStep(
  id: string,
  steps: readonly EncounterStep[],
  step: string,
): PhaseCondition {
  return { encounterId: id, min: phaseAfter(steps, step) };
}

/** Local rectangles keep each lobe's force, cue, and activation together. */
export function stream(
  id: string,
  rect: Rect,
  acceleration: Point,
  label: string,
  activeWhen?: PhaseCondition,
): FlowZone {
  return { id, ...rect, acceleration, label, activeWhen };
}

export function rebound(
  id: string,
  center: Point,
  radius: number,
  impulse: Point,
  activeWhen?: PhaseCondition,
): Obstacle {
  return {
    id,
    shape: { kind: "circle", center, radius },
    material: "gel",
    response: { kind: "rebound", restitution: 0.82, impulse },
    activeWhen,
  };
}
