import type { LevelDefinition } from "../types/level";
import type { ChamberSpec } from "../types/sections";
import { compileChambers } from "./section_specs";
import { channelTransfer, currentLoop, transportRelay } from "./surprise_patterns";

const membraneLoop = currentLoop(
  {
    id: "membrane_loop",
    bounds: { x: 0, y: 0, width: 960, height: 620 },
    entrance: { x: 36, y: 510 },
    exit: { x: 885, y: 420 },
    sequence: [
      {
        region: { x: 65, y: 425, width: 125, height: 105 },
        caption:
          "The continuous bilayer is permeable. The first current pulls you into circulation.",
      },
      {
        contactId: "membrane-membrane_loop-obstacle-0",
        caption: "That cellular boundary redirects you toward the high outlet.",
      },
      {
        region: { x: 760, y: 140, width: 120, height: 290 },
        label: "OUTLET",
        caption: "The outlet wakes a finite backward sweep.",
      },
      {
        region: { x: 180, y: 430, width: 200, height: 190 },
        label: "RETURN / VESICLE",
        caption: "Back at the return pocket, a newly arrived vesicle offers a different route.",
      },
    ],
  },
  { x: 190, y: -90 },
);
const membraneFinish = channelTransfer(
  {
    id: "membrane_finish",
    bounds: { x: 940, y: 0, width: 1060, height: 620 },
    entrance: { x: 980, y: 470 },
    exit: { x: 1900, y: 300 },
    sequence: [
      {
        region: { x: 955, y: 425, width: 120, height: 110 },
        caption: "The channel entrance captures the steroid in a fast curved route.",
      },
    ],
  },
  [
    { x: 1010, y: 475 },
    { x: 1210, y: 205 },
    { x: 1510, y: 420 },
    { x: 1880, y: 300 },
  ],
);
const membraneChambers: readonly ChamberSpec[] = [
  {
    ...membraneLoop,
    obstacles: [
      {
        shape: { kind: "circle", center: { x: 460, y: 380 }, radius: 85 },
        material: "membrane",
        response: { kind: "rebound", restitution: 0.92, impulse: { x: 0, y: -220 } },
      },
      {
        shape: { kind: "capsule", start: { x: 710, y: 80 }, end: { x: 835, y: 135 }, radius: 28 },
        response: { kind: "rebound", restitution: 0.78 },
      },
    ],
    fields: [
      ...(membraneLoop.fields ?? []),
      {
        x: 180,
        y: 400,
        width: 240,
        height: 170,
        acceleration: { x: 90, y: -610 },
        label: "visible inlet current",
        activeWhen: { encounterId: "membrane-membrane_loop", max: 1 },
      },
      {
        x: 80,
        y: 70,
        width: 760,
        height: 330,
        acceleration: { x: -900, y: 125 },
        activeWhen: { encounterId: "membrane-membrane_loop", min: 3, max: 3 },
        label: "finite backward sweep",
      },
      {
        x: 180,
        y: 0,
        width: 130,
        height: 620,
        acceleration: { x: 0, y: 650 },
        activeWhen: { encounterId: "membrane-membrane_loop", min: 3, max: 3 },
        label: "backward return descent",
      },
      {
        x: 150,
        y: 440,
        width: 200,
        height: 170,
        acceleration: { x: 0, y: 0 },
        drag: 6,
        activeWhen: { encounterId: "membrane-membrane_loop", min: 4 },
        label: "vesicle waiting pocket",
      },
    ],
    transports: [
      {
        kind: "vesicle",
        path: [
          { x: 255, y: 560 },
          { x: 510, y: 500 },
          { x: 865, y: 455 },
        ],
        duration: 2,
        radius: 38,
        wait: 0.7,
        releaseVelocity: { x: 160, y: 30 },
        activeWhen: { encounterId: "membrane-membrane_loop", min: 4 },
        label: "new arrival vesicle",
      },
    ],
    checkpoint: {
      x: 180,
      y: 465,
      width: 280,
      height: 145,
      spawn: { x: 410, y: 575 },
      activeWhen: { encounterId: "membrane-membrane_loop", min: 4 },
    },
    collectibles: [{ x: 280, y: 30 }],
    decorations: [
      { kind: "lipid", x: 112, y: 0, width: 42, height: 620 },
      { kind: "lipid", x: 160, y: 0, width: 42, height: 620 },
      { kind: "vesicle", x: 205, y: 455, width: 120, height: 90 },
      { kind: "filament", x: 360, y: 475, width: 300, height: 40 },
    ],
  },
  {
    ...membraneFinish,
    fields: [
      ...(membraneFinish.fields ?? []),
      {
        x: 1080,
        y: 80,
        width: 620,
        height: 260,
        acceleration: { x: 120, y: 90 },
        vortex: { center: { x: 1390, y: 220 }, strength: 155 },
        label: "channel approach",
      },
    ],
    checkpoint: { x: 1740, y: 490, width: 105, height: 70, spawn: { x: 1792, y: 525 } },
    hazards: [{ x: 1450, y: 575, width: 120, height: 28, kind: "acid" }],
    decorations: [
      { kind: "filament", x: 1050, y: 90, width: 720, height: 75 },
      { kind: "vesicle", x: 1170, y: 400, width: 120, height: 82 },
    ],
    triggers: [
      {
        kind: "exit",
        x: 1885,
        y: 250,
        width: 95,
        height: 110,
        activeWhen: { encounterId: "membrane-membrane_loop", min: 4 },
        caption: "Across the membrane. The active cytoplasm is next.",
      },
    ],
  },
];
const membraneGeometry = compileChambers("membrane", 2000, 620, membraneChambers);
const membrane: LevelDefinition = {
  id: "membrane",
  name: "Membrane: the first strange current",
  objective:
    "Cross the permeable bilayer, survive the backward sweep, and catch the arriving vesicle.",
  caption:
    "Currents and collisions are exaggerated arcade interpretations of a continuous permeable bilayer.",
  spawn: { x: 36, y: 510 },
  palette: { background: "#102b37", foreground: "#87d8bd", accent: "#f9d989" },
  ...membraneGeometry,
};

const motorMito = transportRelay(
  {
    id: "motor_mito",
    bounds: { x: 0, y: 0, width: 1000, height: 620 },
    entrance: { x: 45, y: 510 },
    exit: { x: 900, y: 260 },
    sequence: [
      {
        region: { x: 85, y: 440, width: 150, height: 110 },
        caption: "A motor-carried vesicle arrives through the crowded cytoplasm.",
      },
      {
        contactId: "cytoplasm-motor_mito-obstacle-0",
        caption: "The giant mitochondrion rebounds your cargo toward the ER.",
      },
    ],
  },
  [
    { x: 150, y: 485 },
    { x: 370, y: 390 },
    { x: 620, y: 390 },
  ],
  "motor",
);
const erChannel = channelTransfer(
  {
    id: "er_channel",
    bounds: { x: 980, y: 0, width: 1020, height: 620 },
    entrance: { x: 1020, y: 370 },
    exit: { x: 1890, y: 320 },
    sequence: [
      {
        region: { x: 1000, y: 315, width: 135, height: 110 },
        caption: "A fast ER channel carries the rebound into the nuclear approach.",
      },
    ],
  },
  [
    { x: 1050, y: 370 },
    { x: 1220, y: 140 },
    { x: 1510, y: 435 },
    { x: 1880, y: 320 },
  ],
);
const cytoplasmChambers: readonly ChamberSpec[] = [
  {
    ...motorMito,
    obstacles: [
      {
        shape: { kind: "circle", center: { x: 790, y: 285 }, radius: 126 },
        material: "mitochondrion",
        response: { kind: "rebound", restitution: 1, impulse: { x: 115, y: -105 } },
      },
    ],
    fields: [
      {
        x: 600,
        y: 145,
        width: 260,
        height: 300,
        acceleration: { x: 250, y: -70 },
        label: "mitochondrial intake swirl",
      },
    ],
    transports: [
      ...(motorMito.transports ?? []),
      {
        kind: "vesicle",
        path: [
          { x: 245, y: 560 },
          { x: 420, y: 145 },
          { x: 650, y: 155 },
          { x: 900, y: 80 },
          { x: 950, y: 310 },
          { x: 960, y: 360 },
        ],
        duration: 2.1,
        radius: 32,
        wait: 0.45,
        releaseVelocity: { x: 185, y: 0 },
        label: "ridiculous cargo shortcut",
      },
    ],
    checkpoint: { x: 440, y: 515, width: 105, height: 65, spawn: { x: 492, y: 547 } },
    collectibles: [{ x: 480, y: 145 }],
    decorations: [
      { kind: "mitochondrion", x: 650, y: 150, width: 280, height: 260 },
      { kind: "filament", x: 75, y: 445, width: 410, height: 45 },
    ],
  },
  {
    ...erChannel,
    obstacles: [
      {
        shape: {
          kind: "capsule",
          start: { x: 1310, y: 75 },
          end: { x: 1480, y: 90 },
          radius: 30,
        },
        material: "reticulum",
        response: { kind: "rebound", restitution: 0.76 },
      },
    ],
    checkpoint: { x: 1720, y: 500, width: 105, height: 70, spawn: { x: 1772, y: 535 } },
    decorations: [{ kind: "filament", x: 1110, y: 105, width: 620, height: 75 }],
    triggers: [
      {
        kind: "exit",
        x: 1880,
        y: 265,
        width: 100,
        height: 110,
        caption: "The crowded cytoplasm gives way to the nuclear envelope.",
      },
    ],
  },
];
const cytoplasmGeometry = compileChambers("cytoplasm", 2000, 620, cytoplasmChambers);
const cytoplasm: LevelDefinition = {
  id: "cytoplasm",
  name: "Cytoplasm: cargo and rebound",
  objective: "Ride motor cargo into a giant mitochondrial rebound, then take the ER channel.",
  caption:
    "Motor transport and organelle collisions are exaggerated arcade interpretations of a crowded cell.",
  spawn: { x: 45, y: 510 },
  palette: { background: "#142940", foreground: "#8ccadf", accent: "#aee6c9" },
  ...cytoplasmGeometry,
};

const poreLoop = currentLoop(
  {
    id: "pore_return",
    bounds: { x: 0, y: 0, width: 2000, height: 620 },
    entrance: { x: 42, y: 510 },
    exit: { x: 1900, y: 280 },
    sequence: [
      {
        region: { x: 70, y: 435, width: 140, height: 110 },
        caption: "Circulation sweeps past the continuously open pore.",
      },
      {
        contactId: "envelope-pore_return-obstacle-0",
        caption: "Missing the pore rebounds you into a return loop for another approach.",
      },
    ],
  },
  { x: 175, y: -55 },
);
const envelopeChambers: readonly ChamberSpec[] = [
  {
    ...poreLoop,
    obstacles: [
      {
        shape: { kind: "roundedRect", x: 1030, y: 0, width: 120, height: 225, radius: 45 },
        material: "membrane",
        response: { kind: "rebound", restitution: 0.85 },
      },
      {
        shape: { kind: "roundedRect", x: 1030, y: 355, width: 120, height: 265, radius: 45 },
        material: "membrane",
        response: { kind: "rebound", restitution: 0.85 },
      },
    ],
    fields: [
      ...(poreLoop.fields ?? []),
      {
        x: 875,
        y: 0,
        width: 70,
        height: 620,
        acceleration: { x: -100, y: 480 },
        label: "pore return descent",
      },
      {
        x: 1115,
        y: 225,
        width: 460,
        height: 130,
        acceleration: { x: 390, y: 0 },
        label: "open pore stream",
      },
      {
        x: 1260,
        y: 380,
        width: 420,
        height: 160,
        acceleration: { x: 70, y: -115 },
        vortex: { center: { x: 1430, y: 430 }, strength: 140 },
        label: "return circulation",
      },
    ],
    checkpoint: { x: 780, y: 520, width: 110, height: 65, spawn: { x: 835, y: 552 } },
    collectibles: [{ x: 740, y: 100 }],
    decorations: [
      { kind: "lipid", x: 1045, y: 0, width: 42, height: 225 },
      { kind: "lipid", x: 1092, y: 0, width: 42, height: 225 },
      { kind: "pore", x: 1025, y: 225, width: 130, height: 130 },
      { kind: "lipid", x: 1045, y: 355, width: 42, height: 265 },
      { kind: "lipid", x: 1092, y: 355, width: 42, height: 265 },
    ],
    triggers: [
      {
        kind: "exit",
        x: 1885,
        y: 225,
        width: 95,
        height: 115,
        caption: "Inside the nucleus, find the steroid receptor.",
      },
    ],
  },
];
const envelopeGeometry = compileChambers("envelope", 2000, 620, envelopeChambers);
const envelope: LevelDefinition = {
  id: "envelope",
  name: "Nuclear envelope: another approach",
  objective:
    "Use circulation to reach the open pore. A miss creates another approach, never a death.",
  caption: "This continuously open pore is an authored arcade route through the nuclear envelope.",
  spawn: { x: 42, y: 510 },
  palette: { background: "#172f35", foreground: "#ade1ca", accent: "#d8c1f3" },
  ...envelopeGeometry,
};

export const CELL_LEVELS: readonly LevelDefinition[] = [membrane, cytoplasm, envelope];
