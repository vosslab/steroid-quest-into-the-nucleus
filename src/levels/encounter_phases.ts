import type { EncounterStep } from "../types/level";

/** Phase counts completed steps, so this threshold precedes completion of the named step. */
export function phaseBefore(sequence: readonly EncounterStep[], stepId: string): number {
  const index = sequence.findIndex((step) => step.id === stepId);
  if (index < 0) throw new Error(`Unknown encounter step reference: ${stepId}`);
  return index;
}

/** The threshold includes completion of the named step and follows its current sequence position. */
export function phaseAfter(sequence: readonly EncounterStep[], stepId: string): number {
  return phaseBefore(sequence, stepId) + 1;
}
