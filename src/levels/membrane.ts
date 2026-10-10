import type { EncounterStep, LevelDefinition } from "../types/level";
import type { ChamberSpec } from "../types/sections";
import { phaseBefore } from "./encounter_phases";
import { phaseAfterStep, phaseWindow, rebound, stream } from "./journey_patterns";
import { compileChambers } from "./section_specs";
import { channelTransfer, currentLoop, transportRelay } from "./surprise_patterns";

const HEIGHT = 1800;

const bilayerSteps: readonly EncounterStep[] = [
  {
    id: "inlet",
    kind: "region",
    region: { x: 65, y: 1425, width: 125, height: 105 },
    label: "PERMEABLE BILAYER",
    caption: "The continuous bilayer is permeable. Its inlet pulls you into circulation.",
  },
  {
    id: "first_rebound",
    kind: "contact",
    contactId: "bilayer_rebound",
    label: "REBOUND",
    caption: "The rebound wakes the loft current. Rise on the left.",
  },
  {
    id: "left_loft",
    kind: "region",
    region: { x: 350, y: 180, width: 240, height: 180 },
    label: "LOFT / TURN RIGHT",
    caption: "The loft bends into a high current. Steer toward the far rim.",
  },
  {
    id: "crest_rebound",
    kind: "contact",
    contactId: "crest",
    label: "CREST / SWITCH CURRENT",
    caption: "The crest reverses its current. Return to the lower-left basin.",
  },
  {
    id: "lower_basin",
    kind: "region",
    region: { x: 310, y: 1420, width: 260, height: 170 },
    label: "BASIN / NEW OUTLET",
    caption: "The basin opens a new rising route toward the right outlet.",
  },
  {
    id: "outlet",
    kind: "region",
    region: { x: 1820, y: 180, width: 260, height: 260 },
    label: "HIGH OUTLET",
    caption: "The outlet is reached. A backward sweep is waiting beyond it.",
  },
];
const bilayerBase = currentLoop(
  {
    id: "bilayer_outlet",
    placement: { x: 0, y: 0 },
    width: 2200,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1960, y: 225 },
    objective: "Rebound through the left loft, switch the crest current, and climb to the outlet.",
    entrance: { x: 36, y: 1510 },
    exit: { x: 1950, y: 310 },
    sequence: bilayerSteps,
  },
  { x: 190, y: -90 },
);
const loft = phaseWindow("bilayer_outlet", bilayerSteps, "first_rebound", "left_loft");
const crestApproach = phaseWindow("bilayer_outlet", bilayerSteps, "left_loft", "crest_rebound");
const basinReturn = phaseWindow("bilayer_outlet", bilayerSteps, "crest_rebound", "lower_basin");
const outletRise = phaseWindow("bilayer_outlet", bilayerSteps, "lower_basin", "outlet");
const bilayer: ChamberSpec = {
  ...bilayerBase,
  obstacles: [
    {
      ...rebound("bilayer_rebound", { x: 460, y: 1380 }, 85, { x: 0, y: -220 }),
      material: "membrane",
      response: { kind: "rebound", restitution: 0.92, impulse: { x: 0, y: -220 } },
      activeWhen: {
        encounterId: "bilayer_outlet",
        max: phaseBefore(bilayerSteps, "first_rebound"),
      },
    },
    rebound("crest", { x: 1720, y: 280 }, 105, { x: -140, y: 160 }),
    {
      id: "opened_crest",
      shape: { kind: "capsule", start: { x: 1250, y: 980 }, end: { x: 1620, y: 1090 }, radius: 35 },
      response: { kind: "rebound", restitution: 0.7 },
      activeWhen: {
        encounterId: "bilayer_outlet",
        max: phaseBefore(bilayerSteps, "crest_rebound"),
      },
    },
  ],
  // Keep the old opening's current footprint and vortex center exactly translated downward.
  fields: [
    {
      id: "opening_circulation",
      x: 60,
      y: 1000,
      width: 840,
      height: 434,
      acceleration: { x: 190, y: -90 },
      vortex: { center: { x: 480, y: 1310 }, strength: 220 },
      label: "opening circulation",
      activeWhen: {
        encounterId: "bilayer_outlet",
        max: phaseBefore(bilayerSteps, "first_rebound"),
      },
    },
    stream(
      "inlet",
      { x: 180, y: 1400, width: 240, height: 170 },
      { x: 90, y: -610 },
      "bilayer inlet",
      { encounterId: "bilayer_outlet", max: phaseBefore(bilayerSteps, "first_rebound") },
    ),
    stream(
      "loft",
      { x: 300, y: 340, width: 340, height: 1200 },
      { x: 0, y: -230 },
      "left loft",
      loft,
    ),
    stream(
      "crest_approach",
      { x: 560, y: 0, width: 1300, height: 650 },
      { x: 85, y: 90 },
      "high crest current",
      crestApproach,
    ),
    stream(
      "crest_reverse",
      { x: 560, y: 130, width: 1240, height: 520 },
      { x: -250, y: 180 },
      "changed crest / return left",
      basinReturn,
    ),
    stream(
      "basin_descent",
      { x: 300, y: 0, width: 320, height: HEIGHT },
      { x: 0, y: 450 },
      "changed basin descent",
      basinReturn,
    ),
    stream(
      "outlet_diagonal",
      { x: 560, y: 400, width: 1340, height: 1200 },
      { x: 75, y: -180 },
      "new rising outlet",
      outletRise,
    ),
    stream(
      "outlet_lift",
      { x: 1770, y: 430, width: 320, height: 1130 },
      { x: 0, y: -280 },
      "outlet lift",
      outletRise,
    ),
  ],
  checkpoint: { x: 20, y: 1640, width: 120, height: 110, spawn: { x: 55, y: 1690 } },
  collectibles: [{ id: "loft_fragment", x: 470, y: 95 }],
  decorations: [
    { kind: "lipid", x: 112, y: 0, width: 42, height: HEIGHT },
    { kind: "lipid", x: 160, y: 0, width: 42, height: HEIGHT },
    { kind: "vesicle", x: 1110, y: 730, width: 150, height: 100 },
    { kind: "filament", x: 700, y: 740, width: 480, height: 65 },
  ],
};

const arrivalSteps: readonly EncounterStep[] = [
  {
    id: "sweep_arm",
    kind: "region",
    region: { x: 1800, y: 150, width: 310, height: 330 },
    label: "BACKWARD SWEEP",
    caption: "The outlet wakes a finite backward sweep. Turn left into its return.",
  },
  {
    id: "return_pocket",
    kind: "region",
    region: { x: 170, y: 1460, width: 260, height: 190 },
    label: "RETURN / ARRIVING VESICLE",
    caption: "The backward sweep is finished. A new vesicle arrives at the return pocket.",
  },
  {
    id: "vesicle_capture",
    kind: "transport_capture",
    transportId: "cargo",
    label: "BOARD VESICLE",
    caption: "Ride the arriving vesicle. Space can escape; delivery remains pending.",
  },
  {
    id: "vesicle_delivery",
    kind: "transport_delivery",
    transportId: "cargo",
    label: "VESICLE DELIVERY",
    caption: "Delivered into a new rising lobe. Steer up to its rim.",
  },
  {
    id: "arrival_rim",
    kind: "contact",
    contactId: "arrival_rim",
    label: "RIM / OPEN LOWER ROUTE",
    caption: "That rim opens a lower route into the linked current loops.",
  },
  {
    id: "arrival_exit",
    kind: "region",
    region: { x: 1960, y: 1350, width: 230, height: 230 },
    label: "LINKED LOOPS",
    caption: "The changed route reaches the linked circulation lobes.",
  },
];
const arrivalBase = transportRelay(
  {
    id: "backward_arrival",
    placement: { x: 0, y: 0 },
    width: 2200,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 2100, y: 1540 },
    objective:
      "Return with the sweep, ride the new vesicle to delivery, then rebound into the lower route.",
    entrance: { x: 1950, y: 310 },
    exit: { x: 2080, y: 1470 },
    sequence: arrivalSteps,
  },
  [
    { x: 285, y: 1570 },
    { x: 760, y: 1500 },
    { x: 1470, y: 1440 },
  ],
);
const sweep = phaseWindow("backward_arrival", arrivalSteps, "sweep_arm", "return_pocket");
const arriving = phaseWindow("backward_arrival", arrivalSteps, "return_pocket", "vesicle_delivery");
const arrivalLoft = phaseWindow(
  "backward_arrival",
  arrivalSteps,
  "vesicle_delivery",
  "arrival_rim",
);
const arrivalExit = phaseWindow("backward_arrival", arrivalSteps, "arrival_rim", "arrival_exit");
const arrival: ChamberSpec = {
  ...arrivalBase,
  recovery: {
    x: 190,
    y: 0,
    width: 150,
    height: HEIGHT,
    acceleration: { x: 0, y: 450 },
    label: "permanent vesicle return",
    activeWhen: phaseAfterStep("bilayer_outlet", bilayerSteps, "outlet"),
  },
  obstacles: [
    rebound("arrival_rim", { x: 680, y: 330 }, 115, { x: 170, y: 150 }, arrivalLoft),
    {
      id: "delivery_loft_surface",
      shape: {
        kind: "capsule",
        start: { x: 1430, y: 1210 },
        end: { x: 1770, y: 1250 },
        radius: 35,
      },
      response: { kind: "rebound", restitution: 0.7 },
      activeWhen: {
        encounterId: "backward_arrival",
        max: phaseBefore(arrivalSteps, "vesicle_delivery"),
      },
    },
  ],
  transports: [
    {
      ...arrivalBase.transports![0]!,
      duration: 1.8,
      wait: 0.25,
      radius: 45,
      activeWhen: arriving,
      label: "new arrival vesicle",
    },
  ],
  fields: [
    stream(
      "finite_sweep",
      { x: 340, y: 80, width: 1520, height: 700 },
      { x: -450, y: 170 },
      "finite backward sweep",
      sweep,
    ),
    stream(
      "sweep_descent",
      { x: 170, y: 0, width: 270, height: HEIGHT },
      { x: 0, y: 300 },
      "backward return descent",
      sweep,
    ),
    {
      id: "boarding_pocket",
      x: 230,
      y: 1500,
      width: 150,
      height: 210,
      acceleration: { x: 0, y: 0 },
      drag: 5,
      label: "vesicle boarding pocket",
      activeWhen: arriving,
    },
    stream(
      "arrival_rise",
      { x: 1260, y: 470, width: 360, height: 1070 },
      { x: -65, y: -190 },
      "new vesicle loft",
      arrivalLoft,
    ),
    stream(
      "arrival_high_turn",
      { x: 760, y: 170, width: 860, height: 360 },
      { x: -150, y: 0 },
      "turn left to rebound rim",
      arrivalLoft,
    ),
    stream(
      "arrival_changed_down",
      { x: 790, y: 0, width: 380, height: 1530 },
      { x: 0, y: 380 },
      "opened lower descent",
      arrivalExit,
    ),
    stream(
      "arrival_changed_right",
      { x: 1070, y: 1320, width: 970, height: 220 },
      { x: 130, y: 0 },
      "opened lower route",
      arrivalExit,
    ),
  ],
  hazards: [{ id: "optional_acid", x: 960, y: 1710, width: 220, height: 50, kind: "acid" }],
  collectibles: [{ id: "acid_fragment", x: 905, y: 1650 }],
  decorations: [
    { kind: "vesicle", x: 230, y: 1510, width: 115, height: 95 },
    { kind: "filament", x: 700, y: 1450, width: 490, height: 45 },
    { kind: "mitochondrion", x: 900, y: 860, width: 270, height: 175 },
  ],
};

const linkedSteps: readonly EncounterStep[] = [
  {
    id: "first_entry",
    kind: "region",
    region: { x: 100, y: 1320, width: 240, height: 270 },
    label: "FIRST LOOP",
    caption: "Two circulation lobes are linked. Climb toward the first rim.",
  },
  {
    id: "first_rim",
    kind: "contact",
    contactId: "first_rim",
    label: "FIRST RIM / REVERSE",
    caption: "The first rim reverses its lobe and opens the lower return.",
  },
  {
    id: "lower_link",
    kind: "region",
    region: { x: 220, y: 1380, width: 280, height: 230 },
    label: "LOWER LINK / TURN RIGHT",
    caption: "The lower link feeds the second lobe. Turn right into its rebound.",
  },
  {
    id: "second_rim",
    kind: "contact",
    contactId: "second_rim",
    label: "SECOND RIM / RISE LEFT",
    caption: "The second rim opens an opposing loft. Climb left through the changed current.",
  },
  {
    id: "opposite_loft",
    kind: "region",
    region: { x: 220, y: 200, width: 280, height: 230 },
    label: "OPPOSITE LOFT",
    caption: "Both loops now feed the upper outlet. Steer right.",
  },
  {
    id: "linked_outlet",
    kind: "region",
    region: { x: 1750, y: 380, width: 220, height: 240 },
    label: "CHANNEL APPROACH",
    caption: "The linked loops deliver a new approach to the final channel.",
  },
];
const linkedBase = currentLoop(
  {
    id: "linked_loops",
    placement: { x: 2100, y: 0 },
    width: 2000,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1850, y: 670 },
    objective:
      "Rebound from both linked rims, return through their changed currents, and find the upper outlet.",
    entrance: { x: 120, y: 1460 },
    exit: { x: 1860, y: 500 },
    sequence: linkedSteps,
  },
  { x: 120, y: -70 },
);
const firstApproach = phaseWindow("linked_loops", linkedSteps, "first_entry", "first_rim");
const firstReturn = phaseWindow("linked_loops", linkedSteps, "first_rim", "lower_link");
const secondApproach = phaseWindow("linked_loops", linkedSteps, "lower_link", "second_rim");
const oppositeRise = phaseWindow("linked_loops", linkedSteps, "second_rim", "opposite_loft");
const linkedExit = phaseWindow("linked_loops", linkedSteps, "opposite_loft", "linked_outlet");
const linked: ChamberSpec = {
  ...linkedBase,
  obstacles: [
    rebound("first_rim", { x: 1630, y: 320 }, 110, { x: -150, y: 140 }),
    rebound("second_rim", { x: 1700, y: 1430 }, 110, { x: -160, y: -160 }),
    {
      id: "first_link_surface",
      shape: { kind: "capsule", start: { x: 980, y: 1000 }, end: { x: 1330, y: 1060 }, radius: 40 },
      response: { kind: "rebound", restitution: 0.72 },
      activeWhen: { encounterId: "linked_loops", max: phaseBefore(linkedSteps, "first_rim") },
    },
    {
      id: "second_link_surface",
      shape: { kind: "capsule", start: { x: 770, y: 720 }, end: { x: 1160, y: 690 }, radius: 35 },
      response: { kind: "rebound", restitution: 0.72 },
      activeWhen: { encounterId: "linked_loops", max: phaseBefore(linkedSteps, "second_rim") },
    },
  ],
  fields: [
    stream(
      "first_lower_feed",
      { x: 330, y: 1270, width: 1090, height: 290 },
      { x: 110, y: -110 },
      "first circulation lobe",
      firstApproach,
    ),
    stream(
      "first_rise",
      { x: 1300, y: 400, width: 360, height: 1130 },
      { x: 0, y: -210 },
      "first rim rise",
      firstApproach,
    ),
    stream(
      "first_reverse",
      { x: 510, y: 120, width: 1240, height: 590 },
      { x: -210, y: 190 },
      "first rim / changed circulation",
      firstReturn,
    ),
    stream(
      "first_down",
      { x: 220, y: 0, width: 300, height: HEIGHT },
      { x: 0, y: 380 },
      "opened first return",
      firstReturn,
    ),
    stream(
      "second_lower_feed",
      { x: 490, y: 1270, width: 1190, height: 310 },
      { x: 90, y: 0 },
      "second circulation lobe",
      secondApproach,
    ),
    stream(
      "second_reverse",
      { x: 520, y: 1050, width: 1220, height: 540 },
      { x: -180, y: -90 },
      "second rim / changed circulation",
      oppositeRise,
    ),
    stream(
      "second_loft",
      { x: 220, y: 410, width: 300, height: 1170 },
      { x: 0, y: -220 },
      "opened opposite loft",
      oppositeRise,
    ),
    stream(
      "linked_exit",
      { x: 510, y: 160, width: 1340, height: 440 },
      { x: 110, y: 80 },
      "linked upper outlet",
      linkedExit,
    ),
  ],
  collectibles: [{ id: "opposite_fragment", x: 355, y: 100 }],
  decorations: [
    { kind: "vesicle", x: 760, y: 480, width: 160, height: 110 },
    { kind: "vesicle", x: 1080, y: 1110, width: 140, height: 100 },
    { kind: "filament", x: 590, y: 830, width: 860, height: 85 },
  ],
};

const channelSteps: readonly EncounterStep[] = [
  {
    id: "lower_contact",
    kind: "contact",
    contactId: "lower_rim",
    label: "LOWER RIM / WAKE CHANNEL",
    caption: "The lower rim wakes the channel's high approach current.",
  },
  {
    id: "upper_contact",
    kind: "contact",
    contactId: "upper_rim",
    label: "HIGH RIM / TURN BACK",
    caption: "The high rim folds the current back to the channel mouth.",
  },
  {
    id: "channel_mouth",
    kind: "region",
    region: { x: 210, y: 1350, width: 270, height: 260 },
    label: "CHANNEL MOUTH",
    caption: "The channel is open. Enter its mouth and remain aboard until delivery.",
  },
  {
    id: "channel_capture",
    kind: "transport_capture",
    transportId: "channel",
    label: "CHANNEL CAPTURE",
    caption: "Captured by the channel. Early escape leaves delivery pending.",
  },
  {
    id: "channel_delivery",
    kind: "transport_delivery",
    transportId: "channel",
    label: "CHANNEL DELIVERY",
    caption: "Naturally delivered. The motor-carried vesicle is ready above the exit.",
  },
];
const channelBase = channelTransfer(
  {
    id: "channel_delivery",
    placement: { x: 4000, y: 0 },
    width: 2000,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1780, y: 800 },
    objective:
      "Wake the lower rim, turn at the high rim, then ride the opened channel to delivery.",
    entrance: { x: 70, y: 500 },
    exit: { x: 1810, y: 750 },
    sequence: channelSteps,
  },
  [
    { x: 345, y: 1480 },
    { x: 720, y: 1190 },
    { x: 1260, y: 1360 },
    { x: 1790, y: 750 },
  ],
);
const channelRise = phaseWindow("channel_delivery", channelSteps, "lower_contact", "upper_contact");
const mouthReturn = phaseWindow("channel_delivery", channelSteps, "upper_contact", "channel_mouth");
const pendingChannel = phaseWindow(
  "channel_delivery",
  channelSteps,
  "channel_mouth",
  "channel_delivery",
);
const channel: ChamberSpec = {
  ...channelBase,
  recovery: {
    x: 160,
    y: 0,
    width: 200,
    height: HEIGHT,
    acceleration: { x: 0, y: 360 },
    label: "permanent channel-mouth descent",
  },
  obstacles: [
    rebound(
      "lower_rim",
      { x: 390, y: 1440 },
      105,
      { x: 140, y: -170 },
      {
        encounterId: "channel_delivery",
        max: phaseBefore(channelSteps, "lower_contact"),
      },
    ),
    rebound("upper_rim", { x: 1710, y: 300 }, 110, { x: -160, y: 150 }),
    {
      id: "opened_channel_surface",
      shape: { kind: "capsule", start: { x: 680, y: 930 }, end: { x: 1160, y: 980 }, radius: 40 },
      response: { kind: "rebound", restitution: 0.7 },
      activeWhen: {
        encounterId: "channel_delivery",
        max: phaseBefore(channelSteps, "upper_contact"),
      },
    },
  ],
  transports: [
    {
      ...channelBase.transports![0]!,
      duration: 1.8,
      radius: 38,
      activeWhen: pendingChannel,
      label: "opened membrane channel",
    },
  ],
  fields: [
    stream(
      "high_approach",
      { x: 560, y: 500, width: 1180, height: 1060 },
      { x: 90, y: -190 },
      "channel high approach",
      channelRise,
    ),
    stream(
      "high_lift",
      { x: 1440, y: 420, width: 360, height: 1090 },
      { x: 0, y: -210 },
      "high rim lift",
      channelRise,
    ),
    stream(
      "folded_return",
      { x: 390, y: 110, width: 1400, height: 640 },
      { x: -210, y: 150 },
      "changed channel return",
      mouthReturn,
    ),
    stream(
      "mouth_descent",
      { x: 200, y: 0, width: 300, height: HEIGHT },
      { x: 0, y: 300 },
      "opened channel descent",
      mouthReturn,
    ),
    stream(
      "vesicle_approach",
      { x: 1840, y: 400, width: 155, height: 950 },
      { x: 0, y: -140 },
      "motor-vesicle approach",
      phaseAfterStep("channel_delivery", channelSteps, "channel_delivery"),
    ),
  ],
  decorations: [
    { kind: "filament", x: 550, y: 1200, width: 850, height: 85 },
    { kind: "vesicle", x: 1800, y: 340, width: 180, height: 130 },
  ],
};

export const MEMBRANE_LEVEL: LevelDefinition = {
  id: "membrane",
  name: "Membrane: four strange currents",
  objective:
    "Cross the permeable bilayer, return for a vesicle, link the loops, and reach channel delivery.",
  caption:
    "Currents, rebounds, vesicle rides, and channels exaggerate movement across a continuous permeable bilayer.",
  spawn: { x: 36, y: 1510 },
  palette: { background: "#102b37", foreground: "#87d8bd", accent: "#f9d989" },
  destination: {
    id: "membrane-vesicle",
    center: { x: 5930, y: 360 },
    radius: 55,
    label: "Motor-carried vesicle",
    motif: "vesicle",
  },
  ...compileChambers("membrane", 6000, HEIGHT, [bilayer, arrival, linked, channel]),
};
