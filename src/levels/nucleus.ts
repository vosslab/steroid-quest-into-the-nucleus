import type { LevelDefinition } from "../types/level";
import type { ChamberSpec } from "../types/sections";
import { compileChambers } from "./section_specs";
import { captureChamber, currentLoop } from "./surprise_patterns";

const bindingFlow = captureChamber(
  {
    id: "binding_flow",
    bounds: { x: 0, y: 0, width: 2000, height: 620 },
    entrance: { x: 45, y: 510 },
    exit: { x: 1880, y: 300 },
    sequence: [
      {
        region: { x: 100, y: 430, width: 130, height: 105 },
        caption:
          "Temporary sticky contacts interrupt the flowing chamber. Pulse free or hold Space to escape.",
      },
      {
        region: { x: 1040, y: 430, width: 150, height: 115 },
        caption: "The matching receptor forms a lasting complex and saves progress.",
      },
    ],
  },
  { x: 550, y: 200, width: 105, height: 105 },
);
const receptorChambers: readonly ChamberSpec[] = [
  {
    ...bindingFlow,
    obstacles: [
      ...(bindingFlow.obstacles ?? []),
      {
        shape: { kind: "circle", center: { x: 820, y: 290 }, radius: 55 },
        response: { kind: "sticky", duration: 0.85 },
      },
    ],
    fields: [
      {
        x: 145,
        y: 90,
        width: 1570,
        height: 300,
        acceleration: { x: 180, y: -35 },
        vortex: { center: { x: 860, y: 250 }, strength: 135 },
        label: "nuclear flow",
      },
    ],
    checkpoint: { x: 760, y: 520, width: 105, height: 65, spawn: { x: 812, y: 552 } },
    collectibles: [{ x: 350, y: 100 }],
    decorations: [
      { kind: "receptor", x: 1030, y: 420, width: 170, height: 135 },
      { kind: "filament", x: 170, y: 105, width: 420, height: 55 },
    ],
    triggers: [
      {
        kind: "receptor",
        x: 1040,
        y: 400,
        width: 160,
        height: 200,
        checkpoint: { order: 20, spawn: { x: 1100, y: 550 } },
        caption: "Bound. The red steroid remains visible as the receptor complex flows onward.",
      },
      {
        kind: "exit",
        x: 1880,
        y: 245,
        width: 100,
        height: 120,
        caption: "The complex can now recognize a matching DNA response element.",
      },
    ],
  },
];
const receptorGeometry = compileChambers("receptor", 2000, 620, receptorChambers);
const receptorLevel: LevelDefinition = {
  id: "receptor",
  name: "Receptor: sticky, then bound",
  objective: "Pulse free of temporary contacts and enter the matching receptor in its calm pocket.",
  caption: "The matching receptor gives the steroid complex the ability to recognize DNA.",
  spawn: { x: 45, y: 510 },
  palette: { background: "#281b43", foreground: "#a78abd", accent: "#f2d591" },
  ...receptorGeometry,
};

const nucleosomeFlow = currentLoop(
  {
    id: "nucleosome_flow",
    bounds: { x: 0, y: 0, width: 2000, height: 620 },
    entrance: { x: 45, y: 510 },
    exit: { x: 1880, y: 300 },
    sequence: [
      {
        region: { x: 90, y: 430, width: 135, height: 105 },
        caption: "Flow loops around moving nucleosomes.",
      },
      {
        region: { x: 780, y: 190, width: 135, height: 125 },
        label: "FLOW SWITCH",
        caption:
          "This chromatin passage rearranges the nearby current and opens a shorter approach.",
      },
    ],
  },
  { x: 170, y: -60 },
);
const dnaChambers: readonly ChamberSpec[] = [
  {
    ...nucleosomeFlow,
    obstacles: [
      {
        shape: { kind: "circle", center: { x: 540, y: 220 }, radius: 64 },
        response: { kind: "rebound", restitution: 0.8 },
        motion: { radiusX: 68, radiusY: 35, period: 3.4 },
      },
      {
        shape: { kind: "circle", center: { x: 870, y: 275 }, radius: 58 },
        response: { kind: "rebound", restitution: 0.8 },
        motion: { radiusX: 44, radiusY: 52, period: 4.1, phase: 0.4 },
      },
      {
        shape: {
          kind: "capsule",
          start: { x: 1210, y: 135 },
          end: { x: 1370, y: 195 },
          radius: 30,
        },
        response: { kind: "rebound", restitution: 0.76 },
      },
    ],
    fields: [
      ...(nucleosomeFlow.fields ?? []),
      {
        x: 940,
        y: 150,
        width: 510,
        height: 230,
        acceleration: { x: 320, y: -15 },
        activeWhen: { encounterId: "dna-nucleosome_flow", min: 2 },
        label: "rearranged short approach",
      },
    ],
    checkpoint: { x: 1480, y: 510, width: 105, height: 70, spawn: { x: 1532, y: 545 } },
    collectibles: [{ x: 1080, y: 95 }],
    decorations: [{ kind: "dna", x: 120, y: 435, width: 1500, height: 45 }],
    triggers: [
      {
        kind: "hre",
        x: 1760,
        y: 455,
        width: 115,
        height: 80,
        caption: "A calm capture region makes the matching hormone response element easy to dock.",
      },
      { kind: "exit", x: 1760, y: 455, width: 115, height: 80 },
    ],
  },
];
const dnaGeometry = compileChambers("dna", 2000, 620, dnaChambers);
const dnaLevel: LevelDefinition = {
  id: "dna",
  name: "DNA: moving chromatin",
  objective:
    "Use the rearranged current around moving nucleosomes and dock in the calm response-element pocket.",
  caption: "The steroid-receptor complex recognizes a regulatory DNA response element.",
  spawn: { x: 45, y: 510 },
  palette: { background: "#16233e", foreground: "#838fcb", accent: "#8ae5de" },
  ...dnaGeometry,
};

export const NUCLEUS_LEVELS: readonly LevelDefinition[] = [receptorLevel, dnaLevel];
