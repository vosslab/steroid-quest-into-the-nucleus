import type { LevelDefinition } from "../types/level";
import { RECEPTOR_LEVEL } from "./receptor";
import { DNA_LEVEL } from "./dna";

export const NUCLEUS_LEVELS: readonly LevelDefinition[] = [RECEPTOR_LEVEL, DNA_LEVEL];
