import type { CheckpointDefinition, LevelDefinition, Platform } from "../types/level";
import type { CompiledSections, SectionSpec } from "../types/sections";
import { compileSections } from "./section_specs";

const checkpoint = (stage: string, id: number, x: number, floor: number): CheckpointDefinition => ({
  id: `${stage}-checkpoint-${id}`,
  x,
  y: floor - 85,
  width: 65,
  height: 85,
  spawn: { x: x + 10, y: floor - 30 },
});

/** Append a compiled encounter without duplicating its local recipe geometry. */
function shifted(geometry: CompiledSections, offset: number): CompiledSections {
  return {
    width: geometry.width + offset,
    platforms: geometry.platforms.map((item) => ({ ...item, x: item.x + offset })),
    flowZones: geometry.flowZones.map((item) => ({ ...item, x: item.x + offset })),
    hazards: geometry.hazards.map((item) => ({ ...item, x: item.x + offset })),
    checkpoints: geometry.checkpoints.map((item) => ({
      ...item,
      x: item.x + offset,
      spawn: { ...item.spawn, x: item.spawn.x + offset },
    })),
    collectibles: geometry.collectibles.map((item) => ({ ...item, x: item.x + offset })),
    decorations: geometry.decorations.map((item) => ({ ...item, x: item.x + offset })),
    triggers: geometry.triggers.map((item) => ({ ...item, x: item.x + offset })),
  };
}

// After the direct bilayer crossing, a flush spring introduces launch over a safe catch floor.
const membraneSurprise = shifted(
  compileSections("membrane", [
    {
      id: "lipid_pop",
      kind: "organelle_pinball",
      width: 1040,
      floor: 600,
      bumperCount: 1,
      launch: { x: 240, y: -660 },
      landingRise: 60,
      caption: "POP! The crossed membrane gives you a playful send-off. The small shelf reforms.",
      checkpoints: [{ x: 40, floor: 600 }],
      collectibles: [{ x: 390, y: 480 }],
    },
  ]),
  3200,
);

const membrane: LevelDefinition = {
  id: "membrane",
  name: "Across the membrane",
  objective: "Roll right, jump over proteins, and pass directly through the lipid strip.",
  caption: "A steroid is lipid-soluble: it can cross the membrane directly.",
  width: membraneSurprise.width,
  height: 760,
  spawn: { x: 80, y: 570 },
  palette: { background: "#102b37", foreground: "#87d8bd", accent: "#f9d989" },
  platforms: [
    ...membraneSurprise.platforms.map((platform): Platform =>
      platform.id.endsWith("pinball-landing-0")
        ? { ...platform, crumble: { delay: 0.9, reformAfter: 2.5 } }
        : platform,
    ),
    { id: "membrane-floor-before", x: 0, y: 600, width: 1860, height: 160, kind: "solid" },
    { id: "membrane-floor-after", x: 2000, y: 600, width: 1200, height: 160, kind: "solid" },
    ...[
      [430, 55, 100],
      [800, 65, 150],
      [1260, 50, 130],
      [1720, 60, 120],
      [2050, 55, 150],
      [2830, 35, 60],
    ].map(([x = 0, rise = 0, width = 0], i): Platform => ({
      id: `membrane-protein-${i}`,
      x,
      y: 600 - rise,
      width,
      height: rise,
      kind: "solid",
    })),
    { id: "membrane-secret-step", x: 990, y: 490, width: 150, height: 18, kind: "oneway" },
    { id: "membrane-secret-top", x: 1160, y: 430, width: 150, height: 18, kind: "oneway" },
    {
      id: "membrane-spring",
      x: 1860,
      y: 600,
      width: 140,
      height: 15,
      kind: "bounce",
      launch: { x: 420, y: -720 },
    },
    { id: "membrane-spring-secret", x: 1950, y: 435, width: 180, height: 18, kind: "oneway" },
    { id: "membrane-loft-return", x: 2180, y: 500, width: 180, height: 18, kind: "oneway" },
  ],
  hazards: [
    { id: "membrane-enzyme-a", x: 660, y: 574, width: 42, height: 26, kind: "enzyme" },
    { id: "membrane-enzyme-b", x: 1580, y: 574, width: 45, height: 26, kind: "enzyme" },
    { id: "membrane-enzyme-c", x: 2590, y: 578, width: 36, height: 22, kind: "enzyme" },
  ],
  checkpoints: [
    ...membraneSurprise.checkpoints,
    checkpoint("membrane", 0, 1060, 600),
    checkpoint("membrane", 1, 2300, 600),
  ],
  collectibles: [
    ...membraneSurprise.collectibles,
    { id: "membrane-item-0", x: 460, y: 502 },
    { id: "membrane-item-1", x: 1220, y: 392 },
    { id: "membrane-item-2", x: 2040, y: 397 },
    { id: "membrane-item-3", x: 2760, y: 554 },
  ],
  triggers: [
    ...membraneSurprise.triggers,
    {
      id: "membrane-launch-caption",
      kind: "caption",
      x: 1840,
      y: 390,
      width: 120,
      height: 210,
      caption: "A spring membrane! Ride the loft, then drop back toward the lipid strip.",
    },
    {
      id: "membrane-crossed",
      kind: "caption",
      x: 2690,
      y: 0,
      width: 60,
      height: 600,
      caption: "You crossed the continuous lipid bilayer. Head for the nucleus.",
    },
    {
      id: "membrane-exit",
      kind: "exit",
      x: membraneSurprise.width - 100,
      y: 460,
      width: 100,
      height: 140,
    },
  ],
  decorations: [
    ...membraneSurprise.decorations,
    // Both uninterrupted head rows span the entire crossing. This is permeable art, not a door.
    { kind: "lipid", x: 2460, y: 30, width: 190, height: 680 },
    { kind: "vesicle", x: 620, y: 190, width: 150, height: 130 },
    { kind: "filament", x: 1040, y: 150, width: 620, height: 110 },
    { kind: "vesicle", x: 1890, y: 180, width: 210, height: 140 },
  ],
};

// Rhythm: squeeze -> giant pinball -> voluntary crumble chase -> express -> orbit -> open exit.
export const CYTOPLASM_SECTIONS: readonly SectionSpec[] = [
  {
    id: "gel_squeeze",
    kind: "tunnel",
    width: 1200,
    floor: 780,
    ceiling: 540,
    material: "reticulum",
    caption: "Squeeze under gel folds, then the crowded passage opens wide.",
    checkpoints: [
      { x: 40, floor: 780 },
      { x: 1020, floor: 780 },
    ],
    baffles: [
      { x: 300, side: "upper", width: 140, depth: 155, material: "reticulum" },
      { x: 650, side: "lower", width: 110, depth: 60, material: "mitochondrion" },
    ],
    collectibles: [{ x: 695, y: 680 }],
  },
  {
    id: "giant_pinball",
    kind: "organelle_pinball",
    width: 1640,
    floor: 780,
    bumperCount: 2,
    launch: { x: 240, y: -720 },
    landingRise: 100,
    secret: "high_cache",
    caption: "A giant mitochondrion pinball! Its bright shelf hides a little upper cache.",
    checkpoints: [{ x: 40, floor: 780 }],
  },
  {
    id: "ribosome_chase",
    kind: "ribosome_bridge",
    width: 1140,
    floor: 780,
    bridgeRise: 120,
    span: 360,
    count: 3,
    crumble: { delay: 0.65, reformAfter: 3 },
    caption: "The upper ribosome shortcut crumbles after contact. Gel catches every missed hop.",
    checkpoints: [{ x: 40, floor: 780 }],
  },
  {
    id: "er_express",
    kind: "vesicle_express",
    width: 1040,
    floor: 780,
    ceiling: 440,
    acceleration: { x: 850, y: 0 },
    drag: 0.12,
    caption: "WHOOSH! The vesicle express sweeps right through the reticulum folds.",
    checkpoints: [{ x: 40, floor: 780 }],
    collectibles: [{ x: 550, y: 730 }],
  },
  {
    id: "vesicle_orbit",
    kind: "orbit_chamber",
    width: 1340,
    floor: 780,
    orbitRise: 140,
    radiusX: 40,
    radiusY: 40,
    period: 5,
    platformCount: 2,
    caption: "Orbiting vesicles circle above the safe floor. Hop up for a drifting ride.",
    checkpoints: [{ x: 40, floor: 780 }],
    collectibles: [
      { x: 445, y: 600 },
      { x: 895, y: 600 },
    ],
  },
  {
    id: "nuclear_approach",
    kind: "terraces",
    material: "gel",
    route: [{ width: 800, floor: 780, gap: 0 }],
    caption: "Open space at last. The nuclear pore ahead is always open.",
    checkpoints: [{ x: 40, floor: 780 }],
    decorations: [{ kind: "pore", x: 600, y: 380, width: 130, height: 260 }],
  },
];

const cytoplasmGeometry = compileSections("cytoplasm", CYTOPLASM_SECTIONS);
const cytoplasm: LevelDefinition = {
  id: "cytoplasm",
  name: "Through the crowded cytoplasm",
  objective: "Squeeze, spring, and follow the vesicle express toward the nucleus.",
  caption:
    "The cell is a crowded, moving environment. Follow the bright path through its organelle passages.",
  height: 1100,
  spawn: { x: 70, y: 750 },
  palette: { background: "#142940", foreground: "#8ccadf", accent: "#aee6c9" },
  ...cytoplasmGeometry,
  triggers: [
    ...cytoplasmGeometry.triggers,
    {
      id: "cytoplasm-exit",
      kind: "exit",
      x: cytoplasmGeometry.width - 100,
      y: 600,
      width: 80,
      height: 180,
    },
  ],
};

// A final optional loft changes gravity after the pore while leaving a stationary lower route.
const envelopeLoft = shifted(
  compileSections("envelope", [
    {
      id: "nucleoplasm_loft",
      kind: "low_gravity_shaft",
      width: 1040,
      floor: 780,
      rise: 280,
      gravityScale: 0.4,
      ledgeCount: 4,
      caption: "Light as a feather! Hop up the loft for a bright reward, or roll beneath it.",
      checkpoints: [{ x: 40, floor: 780 }],
      collectibles: [
        { x: 330, y: 600 },
        { x: 630, y: 460 },
      ],
    },
  ]),
  4000,
);

const envelope: LevelDefinition = {
  id: "envelope",
  name: "The nuclear envelope",
  objective: "Climb the envelope ledges and roll through the continuously open pore.",
  caption: "This level follows an open nuclear pore into the nucleoplasm.",
  width: envelopeLoft.width,
  height: 900,
  spawn: { x: 60, y: 750 },
  palette: { background: "#172f35", foreground: "#ade1ca", accent: "#d8c1f3" },
  flowZones: [
    ...envelopeLoft.flowZones,
    {
      id: "envelope-pore-suction",
      x: 1680,
      y: 350,
      width: 390,
      height: 130,
      acceleration: { x: 650, y: 0 },
      drag: 0.15,
    },
  ],
  platforms: [
    ...envelopeLoft.platforms,
    { id: "envelope-start", x: 0, y: 780, width: 400, height: 40, kind: "solid" },
    ...[720, 660, 600, 540, 480, 480].map((y, i): Platform => ({
      id: `envelope-climb-${i}`,
      x: 450 + i * 175,
      y,
      width: 140,
      height: 22,
      kind: "oneway",
    })),
    { id: "envelope-approach", x: 1510, y: 480, width: 720, height: 28, kind: "solid" },
    {
      id: "envelope-pore-spring",
      x: 2230,
      y: 480,
      width: 90,
      height: 28,
      kind: "bounce",
      launch: { x: 440, y: -720 },
    },
    { id: "envelope-pore-recovery", x: 2320, y: 480, width: 90, height: 28, kind: "solid" },
    {
      id: "envelope-drifting-vesicle",
      x: 2450,
      y: 365,
      width: 190,
      height: 22,
      kind: "oneway",
      motion: { axis: "y", distance: 20, period: 3.8 },
    },
    { id: "envelope-vesicle-return", x: 2670, y: 445, width: 180, height: 22, kind: "oneway" },
    // Collision fills the envelope above/below its open 130-unit passage, never the passage.
    { id: "envelope-wall-top", x: 2080, y: 0, width: 100, height: 350, kind: "solid" },
    { id: "envelope-wall-bottom", x: 2080, y: 508, width: 100, height: 392, kind: "solid" },
    ...[540, 600, 660, 720].map((y, i): Platform => ({
      id: `envelope-descent-${i}`,
      x: 2470 + i * 175,
      y,
      width: 140,
      height: 22,
      kind: "oneway",
    })),
    { id: "envelope-finish", x: 3190, y: 780, width: 810, height: 50, kind: "solid" },
    { id: "envelope-secret", x: 3380, y: 715, width: 150, height: 18, kind: "oneway" },
  ],
  hazards: [{ id: "envelope-enzyme", x: 3620, y: 754, width: 42, height: 26, kind: "enzyme" }],
  checkpoints: [
    ...envelopeLoft.checkpoints,
    checkpoint("envelope", 0, 1540, 480),
    checkpoint("envelope", 1, 2360, 480),
    checkpoint("envelope", 2, 3250, 780),
  ],
  collectibles: [
    ...envelopeLoft.collectibles,
    { id: "envelope-item-0", x: 860, y: 562 },
    { id: "envelope-item-1", x: 1970, y: 440 },
    { id: "envelope-item-2", x: 2720, y: 562 },
    { id: "envelope-secret-item", x: 3440, y: 675 },
    { id: "envelope-vesicle-item", x: 2520, y: 315 },
  ],
  triggers: [
    ...envelopeLoft.triggers,
    {
      id: "envelope-entered",
      kind: "caption",
      x: 2200,
      y: 0,
      width: 60,
      height: 900,
      caption: "Inside the nucleus. Seek the intracellular receptor.",
    },
    {
      id: "envelope-launch-caption",
      kind: "caption",
      x: 2230,
      y: 200,
      width: 120,
      height: 300,
      caption: "The pore stays open. Its spring lip tosses you onto drifting vesicles!",
    },
    {
      id: "envelope-exit",
      kind: "exit",
      x: envelopeLoft.width - 100,
      y: 620,
      width: 90,
      height: 160,
    },
  ],
  decorations: [
    ...envelopeLoft.decorations,
    { kind: "lipid", x: 2080, y: 0, width: 45, height: 350 },
    { kind: "lipid", x: 2135, y: 0, width: 45, height: 350 },
    { kind: "pore", x: 2070, y: 350, width: 120, height: 130 },
    { kind: "lipid", x: 2080, y: 508, width: 45, height: 392 },
    { kind: "lipid", x: 2135, y: 508, width: 45, height: 392 },
    { kind: "filament", x: 200, y: 520, width: 720, height: 150 },
    { kind: "vesicle", x: 560, y: 160, width: 180, height: 135 },
    { kind: "dna", x: 3110, y: 320, width: 750, height: 110 },
  ],
};

export const CELL_LEVELS: readonly LevelDefinition[] = [membrane, cytoplasm, envelope];
