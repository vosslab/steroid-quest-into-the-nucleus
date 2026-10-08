import type { LevelDefinition, Platform } from "../types/level";
import type { SectionSpec } from "../types/sections";
import { compileSections } from "./section_specs";

// Calm contact teaches binding before local gravity changes the familiar jump arc.
const receptorSections: readonly SectionSpec[] = [
  {
    id: "binding_pocket",
    kind: "terraces",
    route: [{ width: 700, floor: 690, gap: 0 }],
    caption: "Touch the receptor pocket. Binding saves your place and unlocks an air jump.",
    checkpoints: [{ x: 90, floor: 690 }],
    decorations: [
      { kind: "receptor", x: 480, y: 630, width: 110, height: 92 },
      { kind: "dna", x: 40, y: 290, width: 590, height: 70 },
    ],
  },
  {
    id: "impossible_float",
    kind: "low_gravity_shaft",
    width: 1640,
    floor: 690,
    rise: 280,
    gravityScale: 0.4,
    ledgeCount: 4,
    caption:
      "The jump suddenly floats! Clear the gel folds inside the marked field; climb for a spark.",
    checkpoints: [
      { x: 70, floor: 690 },
      { x: 1480, floor: 690 },
    ],
    collectibles: [{ x: 670, y: 370 }],
    decorations: [{ kind: "filament", x: 920, y: 180, width: 470, height: 130 }],
  },
  {
    id: "vesicle_moons",
    kind: "orbit_chamber",
    width: 1940,
    floor: 690,
    orbitRise: 140,
    radiusX: 40,
    radiusY: 40,
    period: 5,
    platformCount: 2,
    secret: "high_cache",
    caption:
      "Two vesicle moons circle above a safe floor. Ride one, then explore the little gel crown.",
    checkpoints: [
      { x: 60, floor: 690 },
      { x: 1800, floor: 690 },
    ],
    collectibles: [{ x: 800, y: 455 }],
    decorations: [{ kind: "nucleosome", x: 1110, y: 265, width: 240, height: 145 }],
  },
  {
    id: "fold_express",
    kind: "vesicle_express",
    width: 1040,
    floor: 690,
    ceiling: 390,
    acceleration: { x: 850, y: 0 },
    drag: 0.12,
    caption:
      "The open chamber folds into an express chute. Steer against the current to slow down.",
    checkpoints: [
      { x: 60, floor: 690 },
      { x: 900, floor: 690 },
    ],
    decorations: [{ kind: "dna", x: 100, y: 260, width: 800, height: 70 }],
  },
  {
    id: "chromatin_threshold",
    kind: "terraces",
    route: [{ width: 450, floor: 690, gap: 0 }],
    caption: "The red steroid remains inside your receptor complex. Follow the DNA into chromatin.",
    checkpoints: [{ x: 120, floor: 690 }],
    decorations: [{ kind: "dna", x: 30, y: 380, width: 380, height: 90 }],
  },
];

const receptorGeometry = compileSections("receptor", receptorSections);
// These two folds put the changed jump rule on the required path, over the recipe's catch floor.
const receptorPlatforms: Platform[] = [
  ...receptorGeometry.platforms,
  // The tall pocket canopy keeps an unbound jumping player in contact with the visible receptor.
  {
    id: "receptor-pocket-canopy",
    x: 400,
    y: 140,
    width: 250,
    height: 490,
    kind: "solid",
    material: "gel",
  },
  {
    id: "receptor-float-fold-0",
    x: 1310,
    y: 630,
    width: 85,
    height: 60,
    kind: "solid",
    material: "gel",
  },
  {
    id: "receptor-float-fold-1",
    x: 1740,
    y: 595,
    width: 85,
    height: 95,
    kind: "solid",
    material: "gel",
  },
];

const receptorLevel: LevelDefinition = {
  id: "receptor",
  name: "Binding, then impossible float",
  objective: "Touch your receptor, float over gel folds, and follow chromatin beyond the chute.",
  caption: "In this pathway, an intracellular receptor binds the steroid in the nucleus.",
  width: receptorGeometry.width,
  height: 900,
  spawn: { x: 80, y: 660 },
  palette: { background: "#281b43", foreground: "#a78abd", accent: "#f2d591" },
  platforms: receptorPlatforms,
  flowZones: receptorGeometry.flowZones,
  hazards: [
    ...receptorGeometry.hazards,
    {
      id: "receptor-depths",
      x: 0,
      y: 850,
      width: receptorGeometry.width,
      height: 50,
      kind: "acid",
    },
  ],
  checkpoints: receptorGeometry.checkpoints,
  collectibles: receptorGeometry.collectibles,
  triggers: [
    ...receptorGeometry.triggers,
    {
      id: "receptor-binding",
      kind: "receptor",
      x: 500,
      y: 645,
      width: 70,
      height: 45,
      caption: "Bound! Steroid and receptor adjust their shapes. Jump again in midair.",
    },
    {
      id: "receptor-air-jump",
      kind: "caption",
      x: 630,
      y: 0,
      width: 50,
      height: 900,
      caption:
        "Arcade ability: jump, release, then jump again. Marked fields change local gravity.",
    },
    {
      id: "receptor-exit",
      kind: "exit",
      x: receptorGeometry.width - 120,
      y: 570,
      width: 85,
      height: 120,
    },
  ],
  decorations: receptorGeometry.decorations,
};

// Ride, race, launch, then stop: each new timing demand has a quiet catch beneath it.
const dnaSections: readonly SectionSpec[] = [
  {
    id: "nucleosome_orbits",
    kind: "orbit_chamber",
    width: 1940,
    floor: 650,
    orbitRise: 150,
    radiusX: 50,
    radiusY: 45,
    period: 5.5,
    platformCount: 2,
    secret: "high_cache",
    caption:
      "Chromatin turns the vesicle ride into a nucleosome orbit. Air jump for the upper DNA spark.",
    checkpoints: [
      { x: 60, floor: 650 },
      { x: 1800, floor: 650 },
    ],
    collectibles: [{ x: 820, y: 395 }],
    decorations: [
      { kind: "dna", x: 100, y: 750, width: 1600, height: 65 },
      { kind: "nucleosome", x: 270, y: 290, width: 180, height: 110 },
      { kind: "nucleosome", x: 720, y: 270, width: 220, height: 130 },
    ],
  },
  {
    id: "chromatin_crumble",
    kind: "ribosome_bridge",
    width: 1740,
    floor: 650,
    bridgeRise: 120,
    span: 360,
    count: 3,
    crumble: { delay: 0.65, reformAfter: 3 },
    secret: "high_cache",
    caption:
      "The upper chromatin footholds crumble after contact. Keep moving, or drop and try again.",
    checkpoints: [
      { x: 60, floor: 650 },
      { x: 1600, floor: 650 },
    ],
    decorations: [{ kind: "dna", x: 270, y: 440, width: 600, height: 60 }],
  },
  {
    id: "chromatin_launch",
    kind: "bounce_chamber",
    width: 1040,
    floor: 650,
    springX: 180,
    springWidth: 180,
    landingX: 420,
    landingWidth: 260,
    landingRise: 135,
    launch: { x: 490, y: -720 },
    material: "gel",
    caption: "A last gel launch clears the fold. Release, then air jump for the high DNA shortcut.",
    checkpoints: [
      { x: 60, floor: 650 },
      { x: 460, floor: 515 },
      { x: 930, floor: 650 },
    ],
    collectibles: [{ x: 590, y: 470 }],
    decorations: [{ kind: "dna", x: 40, y: 240, width: 940, height: 90 }],
  },
  {
    id: "recognition_basin",
    kind: "terraces",
    route: [{ width: 700, floor: 650, gap: 0 }],
    caption: "Settle beside the DNA. Match your complex's chevron to the response element.",
    checkpoints: [{ x: 100, floor: 650 }],
    decorations: [{ kind: "dna", x: 30, y: 700, width: 640, height: 80 }],
  },
];

const dnaGeometry = compileSections("dna", dnaSections);
const dnaPlatforms: Platform[] = [
  ...dnaGeometry.platforms,
  // The launch branch rejoins the quiet basin; missing it returns to the broad recipe floor.
  { id: "dna-launch-shortcut", x: 4360, y: 400, width: 220, height: 22, kind: "oneway" },
];

const dnaLevel: LevelDefinition = {
  id: "dna",
  name: "Orbit, crumble, recognize",
  objective:
    "Ride chromatin, cross its temporary footholds, and dock at the matching response element.",
  caption: "The complex recognizes a regulatory DNA region associated with its target gene.",
  width: dnaGeometry.width,
  height: 900,
  spawn: { x: 80, y: 620 },
  palette: { background: "#16233e", foreground: "#838fcb", accent: "#8ae5de" },
  platforms: dnaPlatforms,
  flowZones: dnaGeometry.flowZones,
  hazards: [
    ...dnaGeometry.hazards,
    { id: "dna-depths", x: 0, y: 850, width: dnaGeometry.width, height: 50, kind: "acid" },
  ],
  checkpoints: dnaGeometry.checkpoints,
  collectibles: [...dnaGeometry.collectibles, { id: "dna-launch-shortcut-spark", x: 4450, y: 360 }],
  triggers: [
    ...dnaGeometry.triggers,
    {
      id: "dna-hre",
      kind: "hre",
      x: dnaGeometry.width - 190,
      y: 605,
      width: 55,
      height: 45,
      caption:
        "Matching response element found. Stay bound while the nearby promoter assembles machinery.",
    },
    // Identical ordered regions make docking the transition to stationary recruitment.
    { id: "dna-exit", kind: "exit", x: dnaGeometry.width - 190, y: 605, width: 55, height: 45 },
  ],
  decorations: dnaGeometry.decorations,
};

export const NUCLEUS_LEVELS: readonly LevelDefinition[] = [receptorLevel, dnaLevel];
