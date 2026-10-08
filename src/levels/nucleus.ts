import type {
  CheckpointDefinition,
  Decoration,
  Hazard,
  LevelDefinition,
  Platform,
} from "../types/level";

type Shelf = { x: number; y: number; width: number; moving?: number };

/** These shelves are deliberately authored; decorative DNA does not collide. */
const receptorRoute: readonly Shelf[] = [
  // Low terraces with short rises and long running shelves.
  { x: 0, y: 650, width: 520 },
  { x: 610, y: 595, width: 290 },
  { x: 985, y: 540, width: 240 },
  { x: 1320, y: 590, width: 440 },
  { x: 1840, y: 650, width: 350 },
  { x: 2280, y: 595, width: 280 },
  { x: 2640, y: 650, width: 540 },
  // A compact nucleoplasm fold climbs and returns to the lower route.
  { x: 3270, y: 590, width: 240 },
  { x: 3590, y: 520, width: 260 },
  { x: 3930, y: 450, width: 250 },
  { x: 4270, y: 385, width: 380 },
  { x: 4730, y: 450, width: 280 },
  { x: 5090, y: 520, width: 250 },
  { x: 5430, y: 590, width: 390 },
  // Pocket approach: broad rests lead to the complementary receptor.
  { x: 5900, y: 650, width: 400 },
  { x: 6390, y: 595, width: 290 },
  { x: 6770, y: 650, width: 690 },
  // Two safe air-jump teaching shelves lead into a tall staircase arc.
  { x: 7600, y: 520, width: 430 },
  { x: 8190, y: 400, width: 360 },
  { x: 8710, y: 465, width: 450 },
  { x: 9320, y: 335, width: 330 },
  { x: 9810, y: 220, width: 420 },
  { x: 10400, y: 340, width: 460 },
  // Long lateral transfers alternate with calmer low terraces.
  { x: 11040, y: 470, width: 340 },
  { x: 11560, y: 430, width: 400 },
  { x: 12140, y: 550, width: 470 },
  { x: 12780, y: 420, width: 340 },
  { x: 13290, y: 485, width: 580 },
];

const dnaRoute: readonly Shelf[] = [
  // Alternating chromatin terraces introduce varied single- and air-jump arcs.
  { x: 0, y: 650, width: 480 },
  { x: 610, y: 590, width: 380 },
  { x: 1110, y: 520, width: 310 },
  { x: 1550, y: 600, width: 460 },
  { x: 2140, y: 480, width: 350 },
  { x: 2620, y: 550, width: 470 },
  { x: 3230, y: 425, width: 320 },
  { x: 3690, y: 500, width: 440 },
  { x: 4260, y: 620, width: 570 },
  { x: 4970, y: 560, width: 390 },
  // Wide arcs combine tall climbs, long shelves, and descents.
  { x: 5540, y: 425, width: 420 },
  { x: 6140, y: 300, width: 400 },
  { x: 6720, y: 365, width: 490 },
  { x: 7390, y: 490, width: 360 },
  { x: 7930, y: 355, width: 460 },
  { x: 8580, y: 225, width: 430 },
  { x: 9200, y: 345, width: 500 },
  { x: 9890, y: 470, width: 390 },
  { x: 10460, y: 535, width: 550 },
  { x: 11190, y: 420, width: 380 },
  // Moving nucleosomes have stable launch and recovery shelves.
  { x: 11730, y: 500, width: 510 },
  { x: 12400, y: 465, width: 360, moving: 32 },
  { x: 12920, y: 385, width: 440 },
  { x: 13540, y: 345, width: 350, moving: 28 },
  { x: 14050, y: 465, width: 520 },
  { x: 14750, y: 520, width: 350, moving: 30 },
  { x: 15250, y: 415, width: 460 },
  { x: 15890, y: 455, width: 390, moving: 25 },
  { x: 16450, y: 550, width: 570 },
  // A vertical chromatin fold reaches a high plateau, then descends.
  { x: 17180, y: 425, width: 350 },
  { x: 17710, y: 290, width: 370 },
  { x: 18260, y: 165, width: 420 },
  { x: 18870, y: 230, width: 490 },
  { x: 19540, y: 365, width: 400 },
  { x: 20120, y: 495, width: 430 },
  { x: 20730, y: 570, width: 510 },
  // The recognition approach mixes short climbs and quiet running shelves.
  { x: 21400, y: 450, width: 390 },
  { x: 21950, y: 345, width: 450 },
  { x: 22580, y: 415, width: 370 },
  { x: 23130, y: 540, width: 520 },
  { x: 23810, y: 465, width: 400 },
  { x: 24390, y: 530, width: 610 },
  { x: 25130, y: 530, width: 780 },
];

function platforms(stage: "receptor" | "dna", route: readonly Shelf[]): Platform[] {
  return route.map((shelf, index) => ({
    id: `${stage}-shelf-${index}`,
    x: shelf.x,
    y: shelf.y,
    width: shelf.width,
    height: 26,
    kind: "oneway",
    ...(shelf.moving
      ? { motion: { axis: "y" as const, distance: shelf.moving, period: 4.5, phase: index * 0.1 } }
      : {}),
  }));
}

function checkpoints(
  stage: "receptor" | "dna",
  route: readonly Shelf[],
  indices: readonly number[],
): CheckpointDefinition[] {
  return indices.map((index) => {
    const shelf = route[index];
    if (!shelf || shelf.moving) throw new Error("A checkpoint needs a stationary authored shelf.");
    return {
      id: `${stage}-checkpoint-${index}`,
      x: shelf.x,
      y: shelf.y - 65,
      width: shelf.width,
      height: 65,
      spawn: { x: shelf.x + 50, y: shelf.y - 30 },
    };
  });
}

// Low, jumpable protein hurdles occupy the middle of selected stationary terraces.
// Indices deliberately avoid the receptor pocket, air-jump tutorial, moving shelves, and HRE.
function terraceObstacles(
  stage: "receptor" | "dna",
  route: readonly Shelf[],
  indices: readonly number[],
): { blocks: Platform[]; enzymes: Hazard[] } {
  const blocks: Platform[] = [];
  const enzymes: Hazard[] = [];
  for (const index of indices) {
    const shelf = route[index];
    if (!shelf || shelf.moving || shelf.width < 380) {
      throw new Error("Protein hurdles need a broad stationary terrace.");
    }
    const x = shelf.x + shelf.width / 2;
    // Enzymes follow climbs: their landing arc arrives before the center of the terrace.
    // Descents can land farther across a shelf, so those terraces carry harmless solid blocks.
    const previous = route[index - 1];
    if (previous && previous.y - shelf.y >= 60) {
      enzymes.push({
        id: `${stage}-shelf-${index}-enzyme`,
        kind: "enzyme",
        x,
        y: shelf.y - 24,
        width: 40,
        height: 24,
      });
    } else {
      blocks.push({
        id: `${stage}-shelf-${index}-debris`,
        kind: "solid",
        x,
        y: shelf.y - 40,
        width: 60,
        height: 40,
      });
    }
  }
  return { blocks, enzymes };
}

const receptorObstacles = terraceObstacles(
  "receptor",
  receptorRoute,
  [0, 3, 6, 10, 13, 14, 19, 21, 22, 25],
);
const dnaObstacles = terraceObstacles(
  "dna",
  dnaRoute,
  [0, 3, 5, 8, 10, 12, 14, 16, 18, 20, 24, 26, 28, 31, 32, 35, 37, 39],
);

// The renderer attaches a nucleosome and local DNA to each moving platform.
const chromatin: Decoration[] = dnaRoute.flatMap((shelf, index) =>
  shelf.moving
    ? []
    : [
        {
          kind: "nucleosome",
          x: shelf.x + shelf.width / 2 - 65,
          y: shelf.y + 26,
          width: 130,
          height: 80,
        },
        {
          kind: "dna",
          x: shelf.x - 30,
          y: shelf.y + 96,
          width: shelf.width + 230,
          height: 50 + (index % 3) * 10,
        },
      ],
);

const receptorLevel: LevelDefinition = {
  id: "receptor",
  name: "Find your receptor",
  objective: "Explore the nucleoplasm. Bind the steroid to the receptor.",
  caption: "In this pathway, an intracellular receptor binds the steroid in the nucleus.",
  width: 14000,
  height: 900,
  spawn: { x: 80, y: 620 },
  palette: { background: "#281b43", foreground: "#a78abd", accent: "#f2d591" },
  platforms: [
    ...platforms("receptor", receptorRoute),
    ...receptorObstacles.blocks,
    { id: "receptor-secret", x: 950, y: 440, width: 110, height: 20, kind: "oneway" },
    { id: "receptor-secret-high", x: 9910, y: 90, width: 110, height: 20, kind: "oneway" },
  ],
  hazards: [
    { id: "receptor-depths", x: 0, y: 815, width: 14000, height: 85, kind: "acid" },
    ...receptorObstacles.enzymes,
  ],
  checkpoints: checkpoints(
    "receptor",
    receptorRoute,
    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
  ),
  collectibles: [
    { id: "receptor-item-pocket", x: 1020, y: 400 },
    { id: "receptor-item-bound", x: 7750, y: 475 },
    { id: "receptor-item-secret", x: 9950, y: 50 },
    { id: "receptor-item-exit", x: 13640, y: 440 },
  ],
  triggers: [
    {
      id: "receptor-binding",
      kind: "receptor",
      x: 7143,
      y: 623,
      width: 24,
      height: 24,
      caption: "Bound! Steroid and receptor adjust their shapes. Jump again in midair.",
    },
    {
      id: "receptor-air-jump",
      kind: "caption",
      x: 7350,
      y: 520,
      width: 60,
      height: 130,
      caption: "Arcade ability: jump, release, then jump again to reach the high ledge.",
    },
    { id: "receptor-exit", kind: "exit", x: 13690, y: 390, width: 65, height: 95 },
  ],
  decorations: [
    ...receptorRoute
      .filter((_, index) => index % 3 === 1)
      .map((shelf): Decoration => ({
        kind: "filament",
        x: shelf.x + 20,
        y: shelf.y + 60,
        width: shelf.width - 40,
        height: 60,
      })),
    { kind: "receptor", x: 7100, y: 590, width: 110, height: 92 },
    { kind: "dna", x: 100, y: 180, width: 550, height: 90 },
    { kind: "nucleosome", x: 1000, y: 270, width: 150, height: 95 },
    { kind: "filament", x: 1550, y: 300, width: 420, height: 90 },
    { kind: "dna", x: 2550, y: 680, width: 700, height: 80 },
    { kind: "nucleosome", x: 3440, y: 210, width: 120, height: 85 },
    { kind: "dna", x: 4040, y: 630, width: 600, height: 85 },
  ],
};

const dnaLevel: LevelDefinition = {
  id: "dna",
  name: "Read the chromatin landscape",
  objective: "Use your air jump. Find the response element matching the complex's chevron.",
  caption: "The complex recognizes a regulatory DNA region associated with its target gene.",
  width: 26050,
  height: 900,
  spawn: { x: 80, y: 620 },
  palette: { background: "#16233e", foreground: "#838fcb", accent: "#8ae5de" },
  platforms: [
    ...platforms("dna", dnaRoute),
    ...dnaObstacles.blocks,
    { id: "dna-secret-a", x: 3300, y: 270, width: 110, height: 20, kind: "oneway" },
    { id: "dna-secret-b", x: 8660, y: 70, width: 120, height: 20, kind: "oneway" },
    { id: "dna-secret-c", x: 18350, y: 70, width: 110, height: 20, kind: "oneway" },
  ],
  hazards: [
    { id: "dna-depths", x: 0, y: 815, width: 26050, height: 85, kind: "acid" },
    ...dnaObstacles.enzymes,
  ],
  checkpoints: checkpoints(
    "dna",
    dnaRoute,
    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
  ),
  collectibles: [
    { id: "dna-item-a", x: 1070, y: 350 },
    { id: "dna-item-secret-a", x: 3340, y: 225 },
    { id: "dna-item-moving", x: 12570, y: 405 },
    { id: "dna-item-b", x: 3790, y: 290 },
    { id: "dna-item-secret-b", x: 8710, y: 30 },
    { id: "dna-item-c", x: 10680, y: 490 },
    { id: "dna-item-secret-c", x: 18390, y: 30 },
    { id: "dna-item-d", x: 24130, y: 420 },
  ],
  triggers: [
    {
      id: "dna-complex-recognition",
      kind: "caption",
      x: 1000,
      y: 300,
      width: 110,
      height: 100,
      caption: "DNA wraps around nucleosomes. The platforms and air jump are arcade abstractions.",
    },
    {
      id: "dna-hre",
      kind: "hre",
      x: 25700,
      y: 485,
      width: 55,
      height: 45,
      caption:
        "Matching response element found. Stay bound while the nearby promoter assembles machinery.",
    },
    // Identical regions and ordered triggers ensure binding immediately starts the docking transition.
    { id: "dna-exit", kind: "exit", x: 25700, y: 485, width: 55, height: 45 },
  ],
  decorations: chromatin,
};

export const NUCLEUS_LEVELS: readonly LevelDefinition[] = [receptorLevel, dnaLevel];
