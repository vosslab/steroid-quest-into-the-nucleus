import type { EncounterStep, LevelDefinition } from "../types/level";
import type { ChamberSpec } from "../types/sections";
import { phaseBefore } from "./encounter_phases";
import { phaseAfterStep, phaseWindow, rebound, stream } from "./journey_patterns";
import { compileChambers } from "./section_specs";
import { captureChamber, currentLoop, transportRelay } from "./surprise_patterns";

const HEIGHT = 1800;

const gallerySteps: readonly EncounterStep[] = [
  {
    id: "gallery_entry",
    kind: "region",
    region: { x: 240, y: 180, width: 260, height: 220 },
    label: "STICKY GALLERY / TURN RIGHT",
    caption: "The upper gallery leads to a temporary sticky contact. Steer right.",
  },
  {
    id: "sticky_contact",
    kind: "contact",
    contactId: "temporary_patch",
    label: "TEMPORARY CONTACT",
    caption:
      "A temporary contact catches the steroid. Space releases it; it also lets go automatically.",
  },
  {
    id: "nearby_escape",
    kind: "region",
    region: { x: 1460, y: 680, width: 270, height: 250 },
    label: "ESCAPE POCKET / TURN LEFT",
    caption: "Free of the sticky patch. A nearby downward branch opens to the left.",
  },
  {
    id: "lower_branch",
    kind: "region",
    region: { x: 420, y: 1350, width: 270, height: 250 },
    label: "LOWER BRANCH / TURN RIGHT",
    caption: "The lower branch opens the onward route toward the matching receptor.",
  },
  {
    id: "gallery_outlet",
    kind: "region",
    region: { x: 1740, y: 1340, width: 240, height: 250 },
    label: "GALLERY OUTLET",
    caption: "The temporary contact is behind you. A lasting matching receptor awaits.",
  },
];
const galleryBase = captureChamber(
  {
    id: "sticky_gallery",
    placement: { x: 0, y: 0 },
    width: 2000,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1830, y: 1460 },
    objective:
      "Rise through the gallery, touch the sticky patch, escape nearby, and follow its lower branch.",
    entrance: { x: 45, y: 1460 },
    exit: { x: 1850, y: 1460 },
    sequence: gallerySteps,
  },
  { x: 1350, y: 430, width: 115, height: 160 },
);
const galleryApproach = {
  encounterId: "sticky_gallery",
  max: phaseBefore(gallerySteps, "sticky_contact"),
};
const galleryEscape = phaseWindow(
  "sticky_gallery",
  gallerySteps,
  "sticky_contact",
  "nearby_escape",
);
const galleryDown = phaseWindow("sticky_gallery", gallerySteps, "nearby_escape", "lower_branch");
const galleryExit = phaseWindow("sticky_gallery", gallerySteps, "lower_branch", "gallery_outlet");
const gallery: ChamberSpec = {
  ...galleryBase,
  recovery: {
    x: 220,
    y: 0,
    width: 150,
    height: HEIGHT,
    acceleration: { x: 0, y: 360 },
    label: "permanent gallery descent",
  },
  obstacles: [
    {
      ...galleryBase.obstacles![0]!,
      id: "temporary_patch",
      response: { kind: "sticky", duration: 0.9 },
      activeWhen: galleryApproach,
    },
    {
      id: "gallery_branch_surface",
      shape: { kind: "capsule", start: { x: 840, y: 1070 }, end: { x: 1250, y: 1110 }, radius: 40 },
      response: { kind: "rebound", restitution: 0.7 },
      activeWhen: galleryApproach,
    },
  ],
  fields: [
    stream(
      "gallery_lift",
      { x: 380, y: 350, width: 300, height: 1240 },
      { x: 0, y: -190 },
      "gallery lift",
      galleryApproach,
    ),
    stream(
      "gallery_turn",
      { x: 380, y: 130, width: 1060, height: 450 },
      { x: 120, y: 35 },
      "upper sticky gallery",
      galleryApproach,
    ),
    stream(
      "nearby_release",
      { x: 1220, y: 350, width: 590, height: 650 },
      { x: 160, y: 150 },
      "nearby escape pocket",
      galleryEscape,
    ),
    stream(
      "opened_lower_branch",
      { x: 540, y: 500, width: 1280, height: 580 },
      { x: -170, y: 130 },
      "opened lower branch",
      galleryDown,
    ),
    stream(
      "branch_descent",
      { x: 420, y: 700, width: 310, height: 900 },
      { x: 0, y: 280 },
      "lower branch descent",
      galleryDown,
    ),
    stream(
      "gallery_onward",
      { x: 680, y: 1270, width: 1100, height: 300 },
      { x: 90, y: 0 },
      "matching receptor approach",
      galleryExit,
    ),
  ],
  decorations: [
    { kind: "filament", x: 430, y: 700, width: 540, height: 55 },
    { kind: "receptor", x: 1340, y: 420, width: 130, height: 175 },
  ],
};

const bindingSteps: readonly EncounterStep[] = [
  {
    id: "binding_entry",
    kind: "region",
    region: { x: 100, y: 1330, width: 260, height: 260 },
    label: "MATCHING RECEPTOR / RISE RIGHT",
    caption: "The matching receptor sits in a calm pocket. Follow the high approach first.",
  },
  {
    id: "binding_rim",
    kind: "contact",
    contactId: "matching_rim",
    label: "RECEPTOR RIM / RETURN LEFT",
    caption: "The rim opens the descending return to the matching receptor pocket.",
  },
  {
    id: "receptor_approach",
    kind: "region",
    region: { x: 460, y: 1190, width: 280, height: 190 },
    label: "CALM RECEPTOR POCKET",
    caption: "Descend into the receptor's calm pocket. Binding grants DNA recognition.",
  },
  {
    id: "receptor_binding",
    kind: "milestone",
    milestone: "receptor_bound",
    label: "MATCHING RECEPTOR / BIND",
    caption:
      "Bound. The steroid remains visible in the lasting receptor complex; progress is saved.",
  },
];
const bindingBase = captureChamber(
  {
    id: "matching_binding",
    placement: { x: 1900, y: 0 },
    width: 2000,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 595, y: 1460 },
    objective:
      "Rebound at the high rim, return to the calm pocket, and bind the matching receptor.",
    entrance: { x: 100, y: 1460 },
    exit: { x: 1840, y: 1450 },
    sequence: bindingSteps,
  },
  { x: 1010, y: 900, width: 100, height: 110 },
);
const bindingRise = phaseWindow("matching_binding", bindingSteps, "binding_entry", "binding_rim");
const bindingReturn = phaseWindow(
  "matching_binding",
  bindingSteps,
  "binding_rim",
  "receptor_approach",
);
const bindingPending = phaseWindow(
  "matching_binding",
  bindingSteps,
  "receptor_approach",
  "receptor_binding",
);
const binding: ChamberSpec = {
  ...bindingBase,
  recovery: {
    x: 210,
    y: 0,
    width: 140,
    height: HEIGHT,
    acceleration: { x: 0, y: 360 },
    label: "permanent receptor-pocket return",
  },
  obstacles: [
    rebound("matching_rim", { x: 1550, y: 280 }, 105, { x: -180, y: 120 }),
    { ...bindingBase.obstacles![0]!, id: "optional_decoy" },
  ],
  fields: [
    stream(
      "matching_rise",
      { x: 390, y: 450, width: 1320, height: 1140 },
      { x: 65, y: -180 },
      "high matching-receptor approach",
      bindingRise,
    ),
    stream(
      "receptor_return",
      { x: 520, y: 100, width: 1210, height: 830 },
      { x: -160, y: 150 },
      "changed receptor return",
      bindingReturn,
    ),
    stream(
      "pocket_descent",
      { x: 460, y: 680, width: 290, height: 650 },
      { x: 0, y: 250 },
      "matching pocket descent",
      bindingReturn,
    ),
    stream(
      "binding_descent",
      { x: 460, y: 1190, width: 280, height: 180 },
      { x: 0, y: 220 },
      "calm binding approach",
      bindingPending,
    ),
    {
      id: "matching_pocket",
      x: 430,
      y: 1390,
      width: 360,
      height: 230,
      acceleration: { x: 0, y: 0 },
      drag: 5,
      label: "matching receptor calm pocket",
    },
  ],
  triggers: [
    {
      id: "matching_receptor",
      kind: "receptor",
      x: 490,
      y: 1400,
      width: 240,
      height: 200,
      activeWhen: bindingPending,
      caption:
        "The steroid-receptor complex can recognize DNA. Its movement controls remain the same.",
    },
  ],
  decorations: [
    { kind: "receptor", x: 490, y: 1390, width: 240, height: 210 },
    { kind: "filament", x: 950, y: 620, width: 360, height: 65 },
  ],
};

const passageSteps: readonly EncounterStep[] = [
  {
    id: "bound_entry",
    kind: "region",
    region: { x: 200, y: 180, width: 280, height: 260 },
    label: "BOUND COMPLEX / UPPER PASSAGE",
    caption: "The bound complex travels onward. This upper pocket turns the current right.",
  },
  {
    id: "middle_switch",
    kind: "region",
    region: { x: 1700, y: 690, width: 280, height: 250 },
    label: "MIDDLE SWITCH / TURN LEFT",
    caption: "The middle passage redirects its current left toward the lower turn.",
  },
  {
    id: "lower_turn",
    kind: "region",
    region: { x: 420, y: 1370, width: 280, height: 240 },
    label: "LOWER TURN / RISE RIGHT",
    caption: "The lower turn opens a new rising passage to the far outlet.",
  },
  {
    id: "passage_outlet",
    kind: "region",
    region: { x: 1880, y: 220, width: 280, height: 270 },
    label: "CHANGED PASSAGE OUTLET",
    caption: "The receptor complex crosses the changed passage toward its final transfer.",
  },
];
const passageBase = currentLoop(
  {
    id: "changed_passage",
    placement: { x: 3800, y: 0 },
    width: 2200,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 2020, y: 340 },
    objective:
      "Carry the bound complex through the upper passage, middle switch, lower turn, and new outlet.",
    entrance: { x: 80, y: 1450 },
    exit: { x: 2040, y: 350 },
    sequence: passageSteps,
  },
  { x: 90, y: -90 },
);
const passageEntry = {
  encounterId: "changed_passage",
  max: phaseBefore(passageSteps, "bound_entry"),
};
const passageMiddle = phaseWindow("changed_passage", passageSteps, "bound_entry", "middle_switch");
const passageLower = phaseWindow("changed_passage", passageSteps, "middle_switch", "lower_turn");
const passageExit = phaseWindow("changed_passage", passageSteps, "lower_turn", "passage_outlet");
const passage: ChamberSpec = {
  ...passageBase,
  recovery: {
    x: 90,
    y: 0,
    width: 130,
    height: HEIGHT,
    acceleration: { x: 0, y: 380 },
    label: "permanent passage descent",
  },
  obstacles: [
    {
      id: "middle_partition",
      shape: { kind: "capsule", start: { x: 1050, y: 600 }, end: { x: 1450, y: 680 }, radius: 40 },
      response: { kind: "rebound", restitution: 0.75 },
      activeWhen: passageEntry,
    },
    {
      id: "lower_partition",
      shape: {
        kind: "capsule",
        start: { x: 1090, y: 1110 },
        end: { x: 1530, y: 1070 },
        radius: 40,
      },
      response: { kind: "rebound", restitution: 0.75 },
      activeWhen: passageMiddle,
    },
  ],
  fields: [
    stream(
      "bound_entry_lift",
      { x: 260, y: 350, width: 310, height: 1220 },
      { x: 0, y: -190 },
      "bound-complex upper passage",
      passageEntry,
    ),
    stream(
      "middle_opening",
      { x: 470, y: 180, width: 1500, height: 760 },
      { x: 100, y: 100 },
      "opened middle passage",
      passageMiddle,
    ),
    stream(
      "lower_opening",
      { x: 540, y: 690, width: 1450, height: 800 },
      { x: -130, y: 110 },
      "changed lower passage",
      passageLower,
    ),
    stream(
      "lower_descent",
      { x: 420, y: 910, width: 310, height: 720 },
      { x: 0, y: 270 },
      "lower-turn descent",
      passageLower,
    ),
    stream(
      "new_outlet_rise",
      { x: 760, y: 410, width: 1190, height: 1200 },
      { x: 70, y: -170 },
      "new rising outlet passage",
      passageExit,
    ),
  ],
  collectibles: [{ id: "passage_fragment", x: 1180, y: 140 }],
  decorations: [
    { kind: "dna", x: 730, y: 520, width: 720, height: 65 },
    { kind: "nucleosome", x: 1180, y: 1150, width: 230, height: 180 },
  ],
};

const transferSteps: readonly EncounterStep[] = [
  {
    id: "transfer_loft",
    kind: "region",
    region: { x: 1430, y: 150, width: 280, height: 260 },
    label: "TRANSFER LOFT / RETURN LEFT",
    caption: "The loft opens the curved transfer. Return left into its boarding descent.",
  },
  {
    id: "boarding_pocket",
    kind: "region",
    region: { x: 250, y: 1300, width: 260, height: 260 },
    label: "BOARDING POCKET",
    caption: "Enter the returning vesicle's pocket. Stay aboard until natural delivery.",
  },
  {
    id: "complex_capture",
    kind: "transport_capture",
    transportId: "cargo",
    label: "BOUND-COMPLEX CAPTURE",
    caption: "The bound complex is aboard. Early Space release leaves delivery unfinished.",
  },
  {
    id: "complex_delivery",
    kind: "transport_delivery",
    transportId: "cargo",
    label: "BOUND-COMPLEX DELIVERY",
    caption: "Naturally delivered. Steer the bound complex toward the chromatin coil.",
  },
];
const transferBase = transportRelay(
  {
    id: "bound_transfer",
    placement: { x: 5900, y: 0 },
    width: 2000,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1660, y: 690 },
    objective:
      "Reach the transfer loft, return to its boarding pocket, and remain aboard through delivery.",
    entrance: { x: 160, y: 350 },
    exit: { x: 1675, y: 700 },
    sequence: transferSteps,
  },
  [
    { x: 375, y: 1450 },
    { x: 800, y: 970 },
    { x: 1130, y: 1160 },
    { x: 1675, y: 700 },
  ],
);
const transferApproach = {
  encounterId: "bound_transfer",
  max: phaseBefore(transferSteps, "transfer_loft"),
};
const transferReturn = phaseWindow(
  "bound_transfer",
  transferSteps,
  "transfer_loft",
  "boarding_pocket",
);
const transferPending = phaseWindow(
  "bound_transfer",
  transferSteps,
  "boarding_pocket",
  "complex_delivery",
);
const transfer: ChamberSpec = {
  ...transferBase,
  recovery: {
    x: 250,
    y: 0,
    width: 140,
    height: HEIGHT,
    acceleration: { x: 0, y: 360 },
    label: "permanent transfer boarding descent",
  },
  fields: [
    stream(
      "transfer_high_feed",
      { x: 390, y: 100, width: 1340, height: 420 },
      { x: 100, y: 0 },
      "bound-complex transfer loft",
      transferApproach,
    ),
    stream(
      "transfer_fold",
      { x: 400, y: 100, width: 1350, height: 860 },
      { x: -140, y: 120 },
      "opened boarding return",
      transferReturn,
    ),
    stream(
      "boarding_down",
      { x: 390, y: 730, width: 140, height: 810 },
      { x: 0, y: 270 },
      "boarding descent",
      transferReturn,
    ),
    {
      id: "boarding_calm",
      x: 250,
      y: 1300,
      width: 270,
      height: 310,
      acceleration: { x: 0, y: 0 },
      drag: 4,
      label: "curved-transfer boarding pocket",
      activeWhen: transferPending,
    },
    stream(
      "chromatin_rise",
      { x: 1770, y: 480, width: 220, height: 530 },
      { x: 0, y: -160 },
      "chromatin coil approach",
      phaseAfterStep("bound_transfer", transferSteps, "complex_delivery"),
    ),
  ],
  transports: [
    {
      ...transferBase.transports![0]!,
      duration: 2.2,
      wait: 0.25,
      radius: 48,
      activeWhen: transferPending,
      label: "bound-complex vesicle transfer",
    },
  ],
  decorations: [
    { kind: "vesicle", x: 290, y: 1360, width: 170, height: 135 },
    { kind: "dna", x: 1560, y: 300, width: 330, height: 85 },
  ],
};

export const RECEPTOR_LEVEL: LevelDefinition = {
  id: "receptor",
  name: "Receptor: temporary, then lasting",
  objective:
    "Escape the sticky gallery, bind the matching receptor, and carry the complex through changed currents to chromatin.",
  caption:
    "Temporary contacts interrupt the journey. Matching receptor binding enables DNA recognition.",
  spawn: { x: 45, y: 1460 },
  palette: { background: "#281b43", foreground: "#a78abd", accent: "#f2d591" },
  destination: {
    id: "receptor-chromatin",
    center: { x: 7800, y: 350 },
    radius: 55,
    label: "Chromatin coil",
    motif: "chromatin",
  },
  ...compileChambers("receptor", 7900, HEIGHT, [gallery, binding, passage, transfer]),
};
