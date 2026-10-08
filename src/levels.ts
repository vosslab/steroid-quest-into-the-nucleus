import { CELL_LEVELS } from "./levels/cell";
import { NUCLEUS_LEVELS } from "./levels/nucleus";
import { TRANSCRIPTION_LEVEL } from "./levels/transcription";
import type { LevelDefinition } from "./types/level";

export const CAMPAIGN: readonly LevelDefinition[] = [
  ...CELL_LEVELS,
  ...NUCLEUS_LEVELS,
  TRANSCRIPTION_LEVEL,
];
