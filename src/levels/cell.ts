import type { LevelDefinition } from "../types/level";
import { MEMBRANE_LEVEL } from "./membrane";
import { CYTOPLASM_LEVEL } from "./cytoplasm";
import { ENVELOPE_LEVEL } from "./envelope";

export const CELL_LEVELS: readonly LevelDefinition[] = [
  MEMBRANE_LEVEL,
  CYTOPLASM_LEVEL,
  ENVELOPE_LEVEL,
];
