import type {
  CheckpointDefinition,
  Collectible,
  Decoration,
  Hazard,
  LevelDefinition,
  Platform,
} from "../types/level";

const checkpoint = (stage: string, id: number, x: number, floor: number): CheckpointDefinition => ({
  id: `${stage}-checkpoint-${id}`,
  x,
  y: floor - 85,
  width: 65,
  height: 85,
  spawn: { x: x + 10, y: floor - 30 },
});

const membrane: LevelDefinition = {
  id: "membrane",
  name: "Across the membrane",
  objective: "Roll right, jump over proteins, and pass directly through the lipid strip.",
  caption: "A steroid is lipid-soluble: it can cross the membrane directly.",
  width: 3200,
  height: 760,
  spawn: { x: 80, y: 570 },
  palette: { background: "#102b37", foreground: "#87d8bd", accent: "#f9d989" },
  platforms: [
    { id: "membrane-floor", x: 0, y: 600, width: 3200, height: 160, kind: "solid" },
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
    { id: "membrane-spring", x: 1860, y: 585, width: 75, height: 15, kind: "bounce" },
    { id: "membrane-spring-secret", x: 1950, y: 435, width: 180, height: 18, kind: "oneway" },
  ],
  hazards: [
    { id: "membrane-enzyme-a", x: 660, y: 574, width: 42, height: 26, kind: "enzyme" },
    { id: "membrane-enzyme-b", x: 1580, y: 574, width: 45, height: 26, kind: "enzyme" },
    { id: "membrane-enzyme-c", x: 2590, y: 578, width: 36, height: 22, kind: "enzyme" },
  ],
  checkpoints: [checkpoint("membrane", 0, 1060, 600), checkpoint("membrane", 1, 2300, 600)],
  collectibles: [
    { id: "membrane-item-0", x: 460, y: 502 },
    { id: "membrane-item-1", x: 1220, y: 392 },
    { id: "membrane-item-2", x: 2040, y: 397 },
    { id: "membrane-item-3", x: 2760, y: 554 },
  ],
  triggers: [
    {
      id: "membrane-crossed",
      kind: "caption",
      x: 2690,
      y: 0,
      width: 60,
      height: 600,
      caption: "You crossed the continuous lipid bilayer. Head for the nucleus.",
    },
    { id: "membrane-exit", kind: "exit", x: 3080, y: 460, width: 100, height: 140 },
  ],
  decorations: [
    // Both uninterrupted head rows span the entire crossing. This is permeable art, not a door.
    { kind: "lipid", x: 2460, y: 30, width: 190, height: 680 },
    { kind: "vesicle", x: 620, y: 190, width: 150, height: 130 },
    { kind: "filament", x: 1040, y: 150, width: 620, height: 110 },
    { kind: "vesicle", x: 1890, y: 180, width: 210, height: 140 },
  ],
};

// Shelf profiles are authored as [running width, elevation, gap before shelf].
// Long organelle corridors alternate with compact climbs and generous recovery terraces.
type CytoplasmDistrict = {
  id: string;
  caption: string;
  shelves: readonly (readonly [number, number, number])[];
};
const cytoplasmDistricts: readonly CytoplasmDistrict[] = [
  {
    id: "entry_filaments",
    caption: "Follow the cytoskeleton: short climbs connect broad resting ledges.",
    shelves: [
      [370, 780, 0],
      [230, 720, 35],
      [180, 660, 40],
      [330, 660, 55],
      [210, 720, 80],
      [430, 780, 65],
      [240, 715, 35],
      [190, 650, 45],
      [220, 585, 40],
      [400, 585, 60],
      [230, 650, 70],
      [280, 715, 75],
      [420, 780, 60],
      [210, 720, 40],
      [220, 780, 80],
      [340, 780, 35],
    ],
  },
  {
    id: "organelle_weave",
    caption: "Weave around the organelles. The wide ledges offer room to recover.",
    shelves: [
      [390, 780, 40],
      [200, 715, 45],
      [210, 650, 40],
      [460, 650, 70],
      [240, 715, 95],
      [330, 780, 80],
      [200, 715, 35],
      [180, 650, 40],
      [240, 590, 50],
      [410, 590, 60],
      [200, 650, 85],
      [230, 710, 75],
      [350, 775, 85],
      [210, 715, 45],
      [240, 780, 80],
      [290, 780, 45],
    ],
  },
  {
    id: "vesicle_crossing",
    caption: "Vesicles drift above a safe filament route. Either path leads onward.",
    shelves: [
      [350, 780, 35],
      [250, 725, 40],
      [270, 670, 45],
      [360, 670, 55],
      [230, 730, 90],
      [430, 790, 80],
      [240, 730, 40],
      [240, 670, 45],
      [320, 670, 60],
      [240, 610, 40],
      [320, 610, 50],
      [250, 670, 90],
      [220, 730, 80],
      [340, 790, 70],
      [240, 730, 45],
      [320, 780, 65],
    ],
  },
  {
    id: "filament_garden",
    caption: "Climb the filament garden, then follow its terraces back down.",
    shelves: [
      [320, 780, 40],
      [180, 710, 35],
      [180, 640, 35],
      [230, 570, 40],
      [190, 500, 35],
      [180, 430, 35],
      [470, 360, 40],
      [260, 420, 100],
      [220, 480, 90],
      [380, 540, 85],
      [220, 605, 80],
      [230, 670, 70],
      [420, 735, 80],
      [220, 675, 40],
      [230, 735, 85],
      [400, 780, 75],
    ],
  },
  {
    id: "spring_grove",
    caption: "Spring branches lead to optional sparks. The lower ledges stay open.",
    shelves: [
      [430, 780, 35],
      [220, 715, 35],
      [230, 650, 40],
      [320, 650, 65],
      [240, 715, 90],
      [420, 780, 85],
      [200, 720, 35],
      [200, 660, 40],
      [370, 660, 55],
      [230, 720, 85],
      [380, 780, 90],
      [200, 710, 35],
      [230, 640, 40],
      [310, 640, 55],
      [240, 710, 85],
      [320, 780, 90],
    ],
  },
  {
    id: "nuclear_approach",
    caption: "The nucleus is ahead. Follow the quiet final terraces to its envelope.",
    shelves: [
      [370, 780, 35],
      [200, 715, 40],
      [230, 650, 40],
      [330, 650, 55],
      [200, 710, 85],
      [310, 770, 80],
      [220, 705, 35],
      [240, 640, 40],
      [370, 640, 65],
      [230, 700, 90],
      [330, 760, 80],
      [220, 700, 35],
      [250, 760, 90],
      [390, 780, 65],
      [320, 780, 40],
      [470, 780, 0],
    ],
  },
];
const cytoplasmPlatforms: Platform[] = [];
const cytoplasmCheckpoints: CheckpointDefinition[] = [];
const cytoplasmItems: Collectible[] = [];
const cytoplasmDecorations: Decoration[] = [];
const cytoplasmHazards: Hazard[] = [];
const cytoplasmCaptions: LevelDefinition["triggers"][number][] = [];
// Broad authored terraces carry small hurdles; narrow climbs and optional ferries stay clear.
// Later districts use more of their broad terraces, rather than shrinking safe landings.
const cytoplasmObstacles: Readonly<Record<string, readonly number[]>> = {
  entry_filaments: [0, 5, 12],
  organelle_weave: [0, 3, 9, 12],
  vesicle_crossing: [0, 5, 13, 15],
  filament_garden: [0, 6, 9, 12],
  spring_grove: [0, 3, 5, 8, 10],
  nuclear_approach: [0, 3, 8, 10, 13],
};
let cytoplasmX = 0;
let lastCheckpointX = -1400;

for (const district of cytoplasmDistricts) {
  const districtX = cytoplasmX;
  cytoplasmCaptions.push({
    id: `cytoplasm-${district.id}-caption`,
    kind: "caption",
    x: districtX + 100,
    y: 0,
    width: 65,
    height: 1100,
    caption: district.caption,
  });
  for (const [index, [width, floor, gap]] of district.shelves.entries()) {
    cytoplasmX += gap;
    const x = cytoplasmX;
    const id = `cytoplasm-${district.id}-${index}`;
    cytoplasmPlatforms.push({ id, x, y: floor, width, height: 30, kind: "oneway" });
    cytoplasmDecorations.push({
      kind: "filament",
      x,
      y: floor + 22,
      width: Math.min(width + 70, 650),
      height: 100,
    });
    // Checkpoints belong to stationary, broad landings, before the next short climb.
    if (width >= 300 && (x - lastCheckpointX >= 1000 || index === 0)) {
      cytoplasmCheckpoints.push(
        checkpoint("cytoplasm", cytoplasmCheckpoints.length, x + 50, floor),
      );
      lastCheckpointX = x + 50;
    }
    if (width >= 300) {
      cytoplasmItems.push({ id: `${id}-spark`, x: x + width * 0.65, y: floor - 42 });
      // Nearby organelles remain within the camera view at every route elevation.
      cytoplasmDecorations.push({
        kind: index % 3 === 0 ? "mitochondrion" : "vesicle",
        x: x + width * 0.3,
        y: floor - 225,
        width: 240,
        height: 115,
      });
    }
    if (cytoplasmObstacles[district.id]?.includes(index)) {
      // Checkpoint spawn is x + 60. Keeping hurdles after x + 170 preserves recovery room;
      // every selected shelf leaves at least 100 units beyond the obstacle for the next jump.
      const obstacleX = x + Math.max(170, width / 2);
      if (index % 3 === 0 && district.id !== "entry_filaments") {
        cytoplasmHazards.push({
          id: `${id}-enzyme`,
          kind: "enzyme",
          x: obstacleX,
          y: floor - 22,
          width: 36,
          height: 22,
        });
      } else {
        cytoplasmPlatforms.push({
          id: `${id}-debris`,
          kind: "solid",
          x: obstacleX,
          y: floor - 35,
          width: 50,
          height: 35,
        });
      }
    }
    if (district.id === "vesicle_crossing" && [3, 8, 10].includes(index)) {
      // The upper ferry is a shortcut; the complete lower shelf is a stable fallback.
      cytoplasmPlatforms.push({
        id: `${id}-ferry`,
        x: x + 60,
        y: floor - 65,
        width: 160,
        height: 20,
        kind: "oneway",
        motion: { axis: "x", distance: 40, period: 3.2, phase: index / 16 },
      });
      cytoplasmPlatforms.push({
        id: `${id}-ferry-landing`,
        x: x + 250,
        y: floor - 65,
        width: 160,
        height: 20,
        kind: "oneway",
      });
      cytoplasmItems.push({ id: `${id}-ferry-spark`, x: x + 315, y: floor - 106 });
    }
    if (district.id === "spring_grove" && [0, 5, 10].includes(index)) {
      // Springs sit on an optional upper ledge, leaving the ordinary floor untouched.
      cytoplasmPlatforms.push({
        id: `${id}-spring`,
        x: x + 260,
        y: floor - 60,
        width: 70,
        height: 18,
        kind: "bounce",
      });
      cytoplasmPlatforms.push({
        id: `${id}-spring-secret`,
        x: x + 320,
        y: floor - 200,
        width: 170,
        height: 20,
        kind: "oneway",
      });
      cytoplasmItems.push({ id: `${id}-spring-spark`, x: x + 395, y: floor - 240 });
    }
    if (gap >= 80 && index % 2 === 0) {
      cytoplasmHazards.push({
        id: `${id}-acid`,
        kind: "acid",
        x: x - gap,
        y: floor + 155,
        width: gap,
        height: 55,
      });
    }
    cytoplasmX += width;
  }
}

type CytoplasmTunnel = {
  id: string;
  x: number;
  width: number;
  upperBaffleX: number;
  lowerBaffleX: number;
  material: Platform["material"];
};

// These are real collision passages, rather than a painted ceiling over the old shelf route.
// The 255-pixel open lumen gives a low, cellular "gel tunnel" rhythm, while staggered
// organelle masses leave 125-155 pixel openings that remain comfortably wider than the player.
const cytoplasmTunnels: readonly CytoplasmTunnel[] = [
  {
    id: "entry_gel",
    x: 0,
    width: 1250,
    upperBaffleX: 485,
    // It sits below the high recovery shelf, so a runner never meets a full-height trap.
    lowerBaffleX: 1100,
    material: "gel",
  },
  {
    id: "organelle_weave",
    x: 5355,
    width: 1415,
    upperBaffleX: 5700,
    lowerBaffleX: 5850,
    material: "mitochondrion",
  },
  {
    id: "vesicle_lane",
    x: 14915,
    width: 1300,
    upperBaffleX: 15200,
    lowerBaffleX: 15860,
    material: "reticulum",
  },
  {
    id: "spring_grove",
    x: 24705,
    width: 720,
    upperBaffleX: 24890,
    lowerBaffleX: 25170,
    material: "mitochondrion",
  },
  {
    id: "nuclear_approach",
    x: 30355,
    width: 2210,
    upperBaffleX: 30670,
    lowerBaffleX: 31500,
    material: "reticulum",
  },
];

for (const tunnel of cytoplasmTunnels) {
  const roofY = 520;
  const roofHeight = 45;
  const floorY = 820;
  const tunnelEnd = tunnel.x + tunnel.width;
  cytoplasmPlatforms.push(
    {
      id: `cytoplasm-${tunnel.id}-corridor-roof`,
      x: tunnel.x,
      y: roofY,
      width: tunnel.width,
      height: roofHeight,
      kind: "solid",
      material: "gel",
    },
    {
      id: `cytoplasm-${tunnel.id}-corridor-floor`,
      x: tunnel.x,
      y: floorY,
      width: tunnel.width,
      height: 280,
      kind: "solid",
      material: "gel",
    },
    {
      id: `cytoplasm-${tunnel.id}-corridor-upper-mass`,
      x: tunnel.upperBaffleX,
      y: roofY + roofHeight,
      width: 130,
      height: 100,
      kind: "solid",
      material: tunnel.material,
    },
    {
      id: `cytoplasm-${tunnel.id}-corridor-lower-mass`,
      x: tunnel.lowerBaffleX,
      y: 690,
      width: 145,
      height: floorY - 690,
      kind: "solid",
      material: tunnel.material,
    },
  );
  cytoplasmDecorations.push({
    kind: "vesicle",
    x: tunnel.x + 90,
    y: 300,
    width: Math.min(230, tunnel.width - 180),
    height: 125,
  });
  cytoplasmDecorations.push({
    kind: "filament",
    x: tunnel.x + 80,
    y: 845,
    width: Math.max(160, tunnelEnd - tunnel.x - 160),
    height: 90,
  });
}

const cytoplasm: LevelDefinition = {
  id: "cytoplasm",
  name: "Through the crowded cytoplasm",
  objective:
    "Move through gel corridors and six cytoskeletal districts. Upper routes hide optional sparks.",
  caption:
    "The cytoplasm is crowded: organelle passages alternate with open cytoskeletal chambers.",
  width: cytoplasmX,
  height: 1100,
  spawn: { x: 70, y: 750 },
  palette: { background: "#142940", foreground: "#8ccadf", accent: "#aee6c9" },
  platforms: cytoplasmPlatforms,
  hazards: cytoplasmHazards,
  checkpoints: cytoplasmCheckpoints,
  collectibles: cytoplasmItems,
  decorations: cytoplasmDecorations,
  triggers: [
    ...cytoplasmCaptions,
    { id: "cytoplasm-exit", kind: "exit", x: cytoplasmX - 100, y: 600, width: 80, height: 180 },
  ],
};

const envelope: LevelDefinition = {
  id: "envelope",
  name: "The nuclear envelope",
  objective: "Climb the envelope ledges and roll through the continuously open pore.",
  caption: "This level follows an open nuclear pore into the nucleoplasm.",
  width: 4000,
  height: 900,
  spawn: { x: 60, y: 750 },
  palette: { background: "#172f35", foreground: "#ade1ca", accent: "#d8c1f3" },
  platforms: [
    { id: "envelope-start", x: 0, y: 780, width: 400, height: 40, kind: "solid" },
    ...[720, 660, 600, 540, 480, 480].map((y, i): Platform => ({
      id: `envelope-climb-${i}`,
      x: 450 + i * 175,
      y,
      width: 140,
      height: 22,
      kind: "oneway",
    })),
    { id: "envelope-approach", x: 1510, y: 480, width: 900, height: 28, kind: "solid" },
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
    checkpoint("envelope", 0, 1540, 480),
    checkpoint("envelope", 1, 2270, 480),
    checkpoint("envelope", 2, 3250, 780),
  ],
  collectibles: [
    { id: "envelope-item-0", x: 860, y: 562 },
    { id: "envelope-item-1", x: 1970, y: 440 },
    { id: "envelope-item-2", x: 2720, y: 562 },
    { id: "envelope-secret-item", x: 3440, y: 675 },
  ],
  triggers: [
    {
      id: "envelope-entered",
      kind: "caption",
      x: 2200,
      y: 0,
      width: 60,
      height: 900,
      caption: "Inside the nucleus. Seek the intracellular receptor.",
    },
    { id: "envelope-exit", kind: "exit", x: 3890, y: 620, width: 90, height: 160 },
  ],
  decorations: [
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
