import type { LevelDefinition } from "./types/level";
import type { EncounterProgress } from "./types/simulation";

/** Requirements supply order; encounter phases remain the sole completion authority. */
export function getEncounterProgress(
  level: LevelDefinition,
  phases: ReadonlyMap<string, number>,
): EncounterProgress {
  let completed = 0;
  let current: EncounterProgress["current"];
  for (const id of level.requiredEncounterIds) {
    const encounter = level.encounters.find((candidate) => candidate.id === id);
    if (!encounter) throw new Error(`${level.id} requires missing encounter '${id}'.`);
    if ((phases.get(id) ?? 0) >= encounter.steps.length) completed += 1;
    else current ??= encounter;
  }
  return { current, completed, total: level.requiredEncounterIds.length, ready: !current };
}
