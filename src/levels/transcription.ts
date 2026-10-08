import type { LevelDefinition } from "../types/level";

/** A single camera view keeps the docked complex, promoter, and emerging RNA together. */
export const TRANSCRIPTION_LEVEL: LevelDefinition = {
  id: "transcription",
  name: "Assemble the machinery. Release the RNA.",
  objective: "Stay bound. Press jump in the bright timing window three times to recruit machinery.",
  caption:
    "The complex remains at the response element while machinery assembles at a nearby promoter.",
  width: 960,
  height: 540,
  spawn: { x: 210, y: 360 },
  palette: { background: "#221b3c", foreground: "#a99dcf", accent: "#8ae5de" },
  platforms: [{ id: "transcription-floor", x: 0, y: 390, width: 960, height: 150, kind: "solid" }],
  hazards: [],
  checkpoints: [],
  collectibles: [],
  triggers: [
    // The complex arrives on its matching element; no movement is needed after DNA docking.
    { id: "transcription-docked-hre", kind: "hre", x: 190, y: 335, width: 68, height: 55 },
    {
      id: "transcription-recruit",
      kind: "transcription",
      x: 190,
      y: 335,
      width: 68,
      height: 55,
      caption:
        "Three bright-window jumps assemble the machinery. Watch the RNA emerge! Misses repeat immediately.",
    },
  ],
  decorations: [
    { kind: "nucleosome", x: 65, y: 100, width: 140, height: 85 },
    { kind: "dna", x: 85, y: 205, width: 770, height: 55 },
    { kind: "nucleosome", x: 745, y: 105, width: 135, height: 85 },
  ],
};
