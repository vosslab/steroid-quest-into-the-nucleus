import type { LevelDefinition } from "../types/level";

/** A calm final pocket preserves the three forgiving timing actions after HRE docking. */
export const TRANSCRIPTION_LEVEL: LevelDefinition = {
  id: "transcription",
  name: "Transcription: release the RNA",
  objective: "While docked, press Space in the bright window three times to recruit machinery.",
  caption: "The complex stays at its response element while polymerase moves and RNA grows.",
  width: 1600,
  height: 620,
  spawn: { x: 705, y: 430 },
  palette: { background: "#221b3c", foreground: "#a99dcf", accent: "#8ae5de" },
  obstacles: [],
  flowZones: [],
  transports: [],
  encounters: [],
  requiredEncounterIds: [],
  destination: undefined,
  hazards: [],
  checkpoints: [
    {
      id: "transcription-calm",
      x: 670,
      y: 400,
      width: 115,
      height: 85,
      order: 0,
      spawn: { x: 705, y: 430 },
    },
  ],
  collectibles: [],
  triggers: [
    { id: "transcription-docked-hre", kind: "hre", x: 680, y: 405, width: 95, height: 75 },
    {
      id: "transcription-recruit",
      kind: "transcription",
      x: 680,
      y: 405,
      width: 95,
      height: 75,
      caption:
        "Three forgiving Space timing actions recruit the machinery. Watch polymerase travel and RNA emerge.",
    },
  ],
  decorations: [
    { kind: "nucleosome", x: 105, y: 145, width: 160, height: 100 },
    { kind: "dna", x: 85, y: 295, width: 1390, height: 62 },
    { kind: "nucleosome", x: 1245, y: 145, width: 155, height: 100 },
    { kind: "filament", x: 790, y: 385, width: 390, height: 45 },
  ],
};
