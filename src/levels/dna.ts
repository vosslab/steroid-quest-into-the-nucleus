import type { EncounterStep, LevelDefinition } from "../types/level";
import type { ChamberSpec } from "../types/sections";
import { phaseBefore } from "./encounter_phases";
import { phaseWindow, rebound, stream } from "./journey_patterns";
import { compileChambers } from "./section_specs";
import { channelTransfer, currentLoop } from "./surprise_patterns";

const HEIGHT = 1800;

const loopSteps: readonly EncounterStep[] = [
  {
    id: "loop_entry",
    kind: "region",
    region: { x: 70, y: 1390, width: 240, height: 260 },
    label: "NUCLEOSOME LOOP",
    caption: "The bound complex enters circulation around chromatin.",
  },
  {
    id: "left_loft",
    kind: "region",
    region: { x: 290, y: 170, width: 280, height: 240 },
    label: "LEFT LOFT / TURN RIGHT",
    caption: "The nucleosome loop bends toward the high rim.",
  },
  {
    id: "loop_rim",
    kind: "contact",
    contactId: "rim",
    label: "CHROMATIN RIM",
    caption: "The rim folds circulation back to the lower basin.",
  },
  {
    id: "lower_basin",
    kind: "region",
    region: { x: 240, y: 1400, width: 270, height: 250 },
    label: "LOWER BASIN / NEW LIFT",
    caption: "A new lift carries the complex beyond the loop.",
  },
  {
    id: "loop_outlet",
    kind: "region",
    region: { x: 1580, y: 230, width: 210, height: 270 },
    label: "MOVING PASSAGE",
    caption: "The moving chromatin passage lies ahead.",
  },
];
const loopBase = currentLoop(
  {
    id: "nucleosome_loop",
    placement: { x: 0, y: 0 },
    width: 1800,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1650, y: 620 },
    objective: "Loop through the left loft, rebound from chromatin, and climb the changed outlet.",
    entrance: { x: 45, y: 1510 },
    exit: { x: 1680, y: 370 },
    sequence: loopSteps,
  },
  { x: 0, y: -180 },
);
const loopRise = phaseWindow("nucleosome_loop", loopSteps, "loop_entry", "left_loft");
const loopHigh = phaseWindow("nucleosome_loop", loopSteps, "left_loft", "loop_rim");
const loopReturn = phaseWindow("nucleosome_loop", loopSteps, "loop_rim", "lower_basin");
const loopExit = phaseWindow("nucleosome_loop", loopSteps, "lower_basin", "loop_outlet");
const nucleosomeLoop: ChamberSpec = {
  ...loopBase,
  recovery: {
    x: 120,
    y: 0,
    width: 170,
    height: HEIGHT,
    acceleration: { x: 0, y: 360 },
    label: "permanent nucleosome descent",
  },
  obstacles: [
    rebound("rim", { x: 1490, y: 340 }, 110, { x: -130, y: 160 }),
    {
      ...rebound("moving_spool", { x: 870, y: 840 }, 120, { x: 30, y: 25 }),
      motion: { radiusX: 140, radiusY: 100, period: 4.6 },
    },
    {
      ...rebound("lower_spool", { x: 1160, y: 1290 }, 95, { x: 20, y: -20 }),
      motion: { radiusX: 60, radiusY: 85, period: 5.1, phase: 0.8 },
    },
  ],
  fields: [
    stream(
      "left_lift",
      { x: 300, y: 400, width: 320, height: 1220 },
      { x: 0, y: -230 },
      "rise around nucleosomes",
      loopRise,
    ),
    stream(
      "high_arc",
      { x: 570, y: 80, width: 1030, height: 610 },
      { x: 95, y: 110 },
      "high chromatin arc",
      loopHigh,
    ),
    stream(
      "folded_arc",
      { x: 470, y: 80, width: 1140, height: 650 },
      { x: -190, y: 170 },
      "changed loop / return left",
      loopReturn,
    ),
    stream(
      "basin_descent",
      { x: 270, y: 0, width: 250, height: HEIGHT },
      { x: 0, y: 420 },
      "opened basin descent",
      loopReturn,
    ),
    stream(
      "outlet_diagonal",
      { x: 500, y: 450, width: 1040, height: 1190 },
      { x: 110, y: -130 },
      "new chromatin lift",
      loopExit,
    ),
    stream(
      "outlet_lift",
      { x: 1430, y: 490, width: 170, height: 1030 },
      { x: 0, y: -240 },
      "high passage approach",
      loopExit,
    ),
  ],
  collectibles: [{ id: "loop_fragment", x: 450, y: 90 }],
  decorations: [
    { kind: "dna", x: 580, y: 810, width: 630, height: 80 },
    { kind: "nucleosome", x: 775, y: 750, width: 190, height: 180 },
    { kind: "nucleosome", x: 1080, y: 1205, width: 160, height: 170 },
  ],
};

const passageSteps: readonly EncounterStep[] = [
  {
    id: "lower_approach",
    kind: "region",
    region: { x: 170, y: 1400, width: 300, height: 260 },
    label: "LOW PASSAGE APPROACH",
    caption: "Descend below the moving chromatin spools.",
  },
  {
    id: "middle_clearance",
    kind: "region",
    region: { x: 680, y: 930, width: 310, height: 280 },
    label: "BROAD MOVING GAP",
    caption: "The broad gap lets you read motion without precise contact.",
  },
  {
    id: "upper_clearance",
    kind: "region",
    region: { x: 1160, y: 170, width: 300, height: 300 },
    label: "UPPER CLEARANCE / OPPOSITE GAP",
    caption: "Past the moving spools, return through the opposite gap.",
  },
  {
    id: "opposite_gap",
    kind: "region",
    region: { x: 300, y: 270, width: 320, height: 300 },
    label: "OPPOSITE GAP / NEW DESCENT",
    caption: "The opposite gap opens the far-side descent.",
  },
  {
    id: "passage_outlet",
    kind: "region",
    region: { x: 1400, y: 1400, width: 190, height: 240 },
    label: "EXPOSED CHROMATIN",
    caption: "The passage delivers you beside an exposed chromatin region.",
  },
];
const passageBase = currentLoop(
  {
    id: "moving_passage",
    placement: { x: 1700, y: 0 },
    width: 1600,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1460, y: 1690 },
    objective: "Descend, weave through the broad moving gap, and return down its far side.",
    entrance: { x: 30, y: 620 },
    exit: { x: 1480, y: 1530 },
    sequence: passageSteps,
  },
  { x: 100, y: -100 },
);
const passageLow = phaseWindow(
  "moving_passage",
  passageSteps,
  "lower_approach",
  "middle_clearance",
);
const passageUp = phaseWindow(
  "moving_passage",
  passageSteps,
  "middle_clearance",
  "upper_clearance",
);
const passageAcross = phaseWindow(
  "moving_passage",
  passageSteps,
  "upper_clearance",
  "opposite_gap",
);
const passageDown = phaseWindow("moving_passage", passageSteps, "opposite_gap", "passage_outlet");
const movingPassage: ChamberSpec = {
  ...passageBase,
  recovery: {
    x: 100,
    y: 0,
    width: 180,
    height: HEIGHT,
    acceleration: { x: 0, y: 390 },
    label: "permanent moving-passage descent",
  },
  obstacles: [
    {
      ...rebound("left_spool", { x: 590, y: 990 }, 105, { x: 55, y: -45 }),
      motion: { radiusX: 100, radiusY: 140, period: 4.2 },
    },
    {
      ...rebound("high_spool", { x: 1080, y: 640 }, 105, { x: 55, y: -40 }),
      motion: { radiusX: 120, radiusY: 85, period: 4.8, phase: 0.7 },
    },
    {
      id: "chromatin_edge",
      shape: { kind: "capsule", start: { x: 480, y: 540 }, end: { x: 820, y: 420 }, radius: 32 },
      response: { kind: "rebound", restitution: 0.75 },
    },
  ],
  fields: [
    stream(
      "low_weave",
      { x: 300, y: 1220, width: 690, height: 430 },
      { x: 110, y: -140 },
      "weave below moving chromatin",
      passageLow,
    ),
    stream(
      "middle_lift",
      { x: 740, y: 360, width: 260, height: 970 },
      { x: 0, y: -200 },
      "gap lifts toward the upper clearance",
      passageUp,
    ),
    stream(
      "upper_weave",
      { x: 970, y: 80, width: 480, height: 440 },
      { x: 100, y: 70 },
      "upper moving-passage outlet",
      passageUp,
    ),
    stream(
      "opposite_weave",
      { x: 480, y: 80, width: 990, height: 570 },
      { x: -140, y: 60 },
      "upper clearance / opposite moving gap",
      passageAcross,
    ),
    stream(
      "far_descent",
      { x: 1200, y: 0, width: 240, height: 1590 },
      { x: 0, y: 450 },
      "new far-side descent",
      passageDown,
    ),
    stream(
      "lower_outlet",
      { x: 1400, y: 1340, width: 180, height: 270 },
      { x: 130, y: 0 },
      "exposed chromatin approach",
      passageDown,
    ),
  ],
  decorations: [
    { kind: "dna", x: 420, y: 510, width: 460, height: 45 },
    { kind: "nucleosome", x: 500, y: 905, width: 180, height: 170 },
    { kind: "nucleosome", x: 985, y: 555, width: 190, height: 170 },
  ],
};

const rearrangeSteps: readonly EncounterStep[] = [
  {
    id: "exposure",
    kind: "region",
    region: { x: 170, y: 1400, width: 320, height: 260 },
    label: "EXPOSED REGION / CHANGE FLOW",
    caption: "Entering the exposed region rearranges nearby flow.",
  },
  {
    id: "high_window",
    kind: "region",
    region: { x: 1250, y: 170, width: 330, height: 270 },
    label: "HIGH WINDOW / RETURN LEFT",
    caption: "The exposed passage folds into a lower return.",
  },
  {
    id: "return_basin",
    kind: "region",
    region: { x: 250, y: 1400, width: 290, height: 260 },
    label: "LOW BASIN / CROSS RIGHT",
    caption: "Cross the lower basin to the chromatin rim.",
  },
  {
    id: "changed_rim",
    kind: "contact",
    contactId: "rim",
    label: "RIM / OPPOSITE LIFT",
    caption: "This rim wakes the opposite lift and the high outlet.",
  },
  {
    id: "rearranged_outlet",
    kind: "region",
    region: { x: 1590, y: 210, width: 200, height: 300 },
    label: "CHROMATIN CHANNEL BANK",
    caption: "The rearranged route reaches the channel bank.",
  },
];
const rearrangeBase = currentLoop(
  {
    id: "flow_rearrangement",
    placement: { x: 3200, y: 0 },
    width: 1800,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1650, y: 620 },
    objective:
      "Expose chromatin to change flow, cross the returned basin, and use the opposite lift.",
    entrance: { x: 30, y: 1690 },
    exit: { x: 1680, y: 350 },
    sequence: rearrangeSteps,
  },
  { x: 110, y: -80 },
);
const exposedRise = phaseWindow("flow_rearrangement", rearrangeSteps, "exposure", "high_window");
const exposureReturn = phaseWindow(
  "flow_rearrangement",
  rearrangeSteps,
  "high_window",
  "return_basin",
);
const basinCross = phaseWindow("flow_rearrangement", rearrangeSteps, "return_basin", "changed_rim");
const oppositeLift = phaseWindow(
  "flow_rearrangement",
  rearrangeSteps,
  "changed_rim",
  "rearranged_outlet",
);
const flowRearrangement: ChamberSpec = {
  ...rearrangeBase,
  recovery: {
    x: 120,
    y: 0,
    width: 160,
    height: HEIGHT,
    acceleration: { x: 0, y: 390 },
    label: "permanent exposure-region descent",
  },
  obstacles: [
    rebound("rim", { x: 1400, y: 1470 }, 105, { x: -130, y: -150 }, basinCross),
    {
      ...rebound("moving_coil", { x: 900, y: 870 }, 130, { x: 35, y: 20 }),
      motion: { radiusX: 135, radiusY: 85, period: 5.3 },
    },
    {
      id: "exposed_boundary",
      shape: {
        kind: "capsule",
        start: { x: 1050, y: 1160 },
        end: { x: 1290, y: 1190 },
        radius: 35,
      },
      response: { kind: "rebound", restitution: 0.7 },
      activeWhen: {
        encounterId: "flow_rearrangement",
        max: phaseBefore(rearrangeSteps, "exposure"),
      },
    },
  ],
  fields: [
    stream(
      "exposed_diagonal",
      { x: 470, y: 430, width: 1080, height: 1210 },
      { x: 100, y: -140 },
      "exposure / new rising route",
      exposedRise,
    ),
    stream(
      "high_lift",
      { x: 1300, y: 410, width: 260, height: 1120 },
      { x: 0, y: -220 },
      "exposed high window",
      exposedRise,
    ),
    stream(
      "folded_return",
      { x: 510, y: 80, width: 1050, height: 710 },
      { x: -190, y: 170 },
      "changed flow / return left",
      exposureReturn,
    ),
    stream(
      "return_descent",
      { x: 280, y: 0, width: 270, height: HEIGHT },
      { x: 0, y: 420 },
      "opened lower basin",
      exposureReturn,
    ),
    stream(
      "lower_cross",
      { x: 550, y: 1300, width: 900, height: 350 },
      { x: 95, y: 0 },
      "cross to chromatin rim",
      basinCross,
    ),
    stream(
      "opposite_return",
      { x: 530, y: 1040, width: 990, height: 610 },
      { x: -170, y: -100 },
      "rim / opposite lift",
      oppositeLift,
    ),
    stream(
      "opposite_rise",
      { x: 300, y: 400, width: 270, height: 1250 },
      { x: 0, y: -210 },
      "opposite chromatin lift",
      oppositeLift,
    ),
    stream(
      "opened_high_route",
      { x: 570, y: 80, width: 1030, height: 430 },
      { x: 120, y: 85 },
      "opened channel-bank route",
      oppositeLift,
    ),
  ],
  collectibles: [{ id: "exposure_fragment", x: 415, y: 90 }],
  decorations: [
    { kind: "dna", x: 700, y: 820, width: 760, height: 70 },
    { kind: "nucleosome", x: 790, y: 760, width: 220, height: 220 },
  ],
};

const channelSteps: readonly EncounterStep[] = [
  {
    id: "high_bank",
    kind: "region",
    region: { x: 180, y: 190, width: 320, height: 290 },
    label: "HIGH BANK / DIAGONAL WEAVE",
    caption: "The chromatin bank leads through a diagonal weave.",
  },
  {
    id: "diagonal_weave",
    kind: "region",
    region: { x: 1120, y: 880, width: 300, height: 280 },
    label: "WEAVE / REVERSED COUNTERBEND",
    caption: "The weave reverses into a rising counterbend.",
  },
  {
    id: "counterbend",
    kind: "region",
    region: { x: 450, y: 170, width: 290, height: 270 },
    label: "COUNTERBEND / OPEN LOWER BANK",
    caption: "The counterbend opens a new lower bank on the right.",
  },
  {
    id: "lower_bank",
    kind: "region",
    region: { x: 1180, y: 1320, width: 290, height: 290 },
    label: "LOWER BANK / CHANNEL MOUTH",
    caption: "The lower bank folds back into the rising channel mouth.",
  },
  {
    id: "channel_mouth",
    kind: "region",
    region: { x: 250, y: 1410, width: 300, height: 260 },
    label: "CHROMATIN CHANNEL MOUTH",
    caption: "Enter the rising channel and remain aboard for delivery.",
  },
  {
    id: "channel_capture",
    kind: "transport_capture",
    transportId: "channel",
    label: "RISING CHANNEL CAPTURE",
    caption: "The curved channel carries the bound complex onward.",
  },
  {
    id: "channel_delivery",
    kind: "transport_delivery",
    transportId: "channel",
    label: "NATURAL CHANNEL DELIVERY",
    caption: "Naturally delivered beside the final DNA approach.",
  },
];
const channelBase = channelTransfer(
  {
    id: "chromatin_channel",
    placement: { x: 4900, y: 0 },
    width: 1600,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1440, y: 640 },
    objective:
      "Find the high bank, weave diagonally, then ride the rising chromatin channel to delivery.",
    entrance: { x: 30, y: 620 },
    exit: { x: 1480, y: 520 },
    sequence: channelSteps,
  },
  [
    { x: 400, y: 1540 },
    { x: 730, y: 1230 },
    { x: 1060, y: 1430 },
    { x: 1230, y: 910 },
    { x: 1460, y: 520 },
  ],
);
const bankWeave = phaseWindow("chromatin_channel", channelSteps, "high_bank", "diagonal_weave");
const counterRise = phaseWindow("chromatin_channel", channelSteps, "diagonal_weave", "counterbend");
const lowerBank = phaseWindow("chromatin_channel", channelSteps, "counterbend", "lower_bank");
const mouthReturn = phaseWindow("chromatin_channel", channelSteps, "lower_bank", "channel_mouth");
const pendingChannel = phaseWindow(
  "chromatin_channel",
  channelSteps,
  "channel_mouth",
  "channel_delivery",
);
const chromatinChannel: ChamberSpec = {
  ...channelBase,
  recovery: {
    x: 170,
    y: 0,
    width: 150,
    height: HEIGHT,
    acceleration: { x: 0, y: 400 },
    label: "permanent chromatin-channel descent",
  },
  obstacles: [
    {
      ...rebound("weave_spool", { x: 760, y: 720 }, 120, { x: 40, y: 100 }),
      motion: { radiusX: 80, radiusY: 85, period: 4.4 },
    },
    {
      ...rebound("lower_spool", { x: 940, y: 1640 }, 75, { x: -40, y: -40 }),
      motion: { radiusX: 35, radiusY: 45, period: 3.8 },
    },
  ],
  transports: [
    {
      ...channelBase.transports![0]!,
      duration: 4.2,
      radius: 42,
      releaseVelocity: { x: 60, y: 0 },
      activeWhen: pendingChannel,
      label: "rising chromatin channel",
    },
  ],
  fields: [
    stream(
      "bank_rise",
      { x: 330, y: 440, width: 230, height: 1200 },
      { x: 0, y: -220 },
      "high chromatin bank",
      { encounterId: "chromatin_channel", max: phaseBefore(channelSteps, "high_bank") },
    ),
    stream(
      "diagonal_weave",
      { x: 530, y: 100, width: 890, height: 950 },
      { x: 100, y: 180 },
      "diagonal chromatin weave",
      bankWeave,
    ),
    stream(
      "reversed_weave",
      { x: 720, y: 470, width: 710, height: 740 },
      { x: -170, y: -190 },
      "weave / rising counterbend",
      counterRise,
    ),
    stream(
      "counter_lift",
      { x: 470, y: 410, width: 240, height: 900 },
      { x: 0, y: -220 },
      "opened chromatin counterbend",
      counterRise,
    ),
    stream(
      "new_lower_bank",
      { x: 750, y: 100, width: 680, height: 1420 },
      { x: 100, y: 230 },
      "counterbend / new lower bank",
      lowerBank,
    ),
    stream(
      "lower_fold",
      { x: 550, y: 1170, width: 880, height: 480 },
      { x: -220, y: 150 },
      "weave / changed mouth return",
      mouthReturn,
    ),
    stream(
      "mouth_descent",
      { x: 320, y: 0, width: 240, height: HEIGHT },
      { x: 0, y: 410 },
      "return to rising-channel mouth",
      mouthReturn,
    ),
    stream(
      "boarding_descent",
      { x: 350, y: 440, width: 130, height: 1040 },
      { x: 0, y: 250 },
      "pending channel / descend to reboard",
      pendingChannel,
    ),
    {
      id: "boarding_pocket",
      x: 350,
      y: 1460,
      width: 130,
      height: 230,
      acceleration: { x: 0, y: 0 },
      drag: 4,
      activeWhen: pendingChannel,
      label: "calm channel boarding pocket",
    },
  ],
  decorations: [
    { kind: "dna", x: 520, y: 670, width: 630, height: 65 },
    { kind: "nucleosome", x: 660, y: 620, width: 200, height: 200 },
  ],
};

const dockSteps: readonly EncounterStep[] = [
  {
    id: "lower_approach",
    kind: "region",
    region: { x: 210, y: 1320, width: 290, height: 260 },
    label: "LOW DNA APPROACH",
    caption: "Descend beside the final chromatin coil.",
  },
  {
    id: "matching_approach",
    kind: "region",
    region: { x: 690, y: 700, width: 280, height: 260 },
    label: "MATCHING ELEMENT / CALM POCKET",
    caption: "The matching response element lies in a calm pocket.",
  },
  {
    id: "hre_docking",
    kind: "milestone",
    milestone: "hre_bound",
    label: "DOCK AT MATCHING HRE",
    caption: "The receptor-bound steroid recognizes regulatory DNA beside the gene.",
  },
];
const dockBase = currentLoop(
  {
    id: "hre_docking",
    placement: { x: 6400, y: 0 },
    width: 1200,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1080, y: 615 },
    objective: "Follow the low DNA approach, climb beside the coil, and dock at the matching HRE.",
    entrance: { x: 30, y: 640 },
    exit: { x: 1080, y: 500 },
    sequence: dockSteps,
  },
  { x: 85, y: -120 },
);
const dockRise = phaseWindow("hre_docking", dockSteps, "lower_approach", "matching_approach");
const hreDocking: ChamberSpec = {
  ...dockBase,
  recovery: {
    x: 140,
    y: 0,
    width: 140,
    height: HEIGHT,
    acceleration: { x: 0, y: 390 },
    label: "permanent response-element approach descent",
  },
  obstacles: [
    {
      ...rebound("last_spool", { x: 570, y: 1090 }, 105, { x: 55, y: -35 }),
      motion: { radiusX: 60, radiusY: 55, period: 4.5 },
    },
  ],
  fields: [
    stream(
      "matching_lift",
      { x: 500, y: 890, width: 440, height: 650 },
      { x: 90, y: -160 },
      "matching DNA approach",
      dockRise,
    ),
    {
      id: "calm_dock",
      x: 980,
      y: 370,
      width: 200,
      height: 370,
      acceleration: { x: 0, y: 0 },
      drag: 1.8,
      label: "calm matching response element",
    },
  ],
  triggers: [
    {
      id: "matching_hre",
      kind: "hre",
      x: 1000,
      y: 415,
      width: 165,
      height: 165,
      caption: "Docked at the matching hormone response element beside its regulated gene.",
    },
  ],
  decorations: [
    { kind: "dna", x: 430, y: 1080, width: 280, height: 50 },
    { kind: "nucleosome", x: 480, y: 1000, width: 180, height: 180 },
    { kind: "dna", x: 955, y: 480, width: 230, height: 45 },
  ],
};

const geometry = compileChambers("dna", 7600, HEIGHT, [
  nucleosomeLoop,
  movingPassage,
  flowRearrangement,
  chromatinChannel,
  hreDocking,
]);

export const DNA_LEVEL: LevelDefinition = {
  id: "dna",
  name: "DNA: chromatin currents",
  objective: "Loop, weave, rearrange flow, ride chromatin, and dock at the matching DNA element.",
  caption: "The steroid-receptor complex recognizes a regulatory response element beside a gene.",
  spawn: { x: 45, y: 1510 },
  palette: { background: "#16233e", foreground: "#838fcb", accent: "#8ae5de" },
  destination: {
    id: "dna-gene",
    center: { x: 7480, y: 500 },
    radius: 48,
    label: "Matching response element and gene",
    motif: "gene",
  },
  ...geometry,
};
