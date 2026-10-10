import type { EncounterStep, LevelDefinition, PhaseCondition } from "../types/level";
import type { ChamberSpec } from "../types/sections";
import { phaseBefore } from "./encounter_phases";
import { phaseAfterStep, phaseWindow, rebound, stream } from "./journey_patterns";
import { compileChambers } from "./section_specs";
import { channelTransfer, currentLoop, transportRelay } from "./surprise_patterns";

const HEIGHT = 1800;
const WIDTH = 2200;

const motorSteps: readonly EncounterStep[] = [
  {
    id: "boarding_loft",
    kind: "region",
    region: { x: 340, y: 220, width: 280, height: 240 },
    label: "MOTOR BAY / RISE LEFT",
    caption: "The motor bay sits above the filament. Rise on the left to meet its cargo.",
  },
  {
    id: "motor_capture",
    kind: "transport_capture",
    transportId: "cargo",
    label: "BOARD MOTOR CARGO",
    caption: "The motor follows the bent filament. Space escapes, but delivery remains pending.",
  },
  {
    id: "motor_delivery",
    kind: "transport_delivery",
    transportId: "cargo",
    label: "MOTOR DELIVERY",
    caption: "Natural motor delivery wakes the forward current and the far-side lift.",
  },
  {
    id: "motor_outlet",
    kind: "region",
    region: { x: 1830, y: 180, width: 310, height: 240 },
    label: "FAR LIFT / MITOCHONDRION",
    caption: "The far lift reaches the giant mitochondrion's descent approach.",
  },
];
const motorBase = transportRelay(
  {
    id: "motor_delivery",
    placement: { x: 0, y: 0 },
    width: WIDTH,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1950, y: 275 },
    entrance: { x: 65, y: 1510 },
    exit: { x: 1990, y: 300 },
    sequence: motorSteps,
    objective: "Rise to the motor bay, ride to natural delivery, then cross to the far lift.",
  },
  [
    { x: 480, y: 330 },
    { x: 1600, y: 300 },
    { x: 1800, y: 900 },
    { x: 1100, y: 1300 },
    { x: 320, y: 1490 },
  ],
  "motor",
);
const motorBoard = phaseWindow("motor_delivery", motorSteps, "boarding_loft", "motor_delivery");
const motorExit = phaseWindow("motor_delivery", motorSteps, "motor_delivery", "motor_outlet");
const motor: ChamberSpec = {
  ...motorBase,
  recovery: {
    x: 100,
    y: 0,
    width: 170,
    height: HEIGHT,
    acceleration: { x: 0, y: 420 },
    label: "permanent motor-bay return",
  },
  fields: [
    stream(
      "boarding_lift",
      { x: 300, y: 440, width: 340, height: 1190 },
      { x: 0, y: -185 },
      "motor bay / rise left",
      { encounterId: "motor_delivery", max: phaseBefore(motorSteps, "boarding_loft") },
    ),
    {
      id: "boarding_pocket",
      x: 385,
      y: 245,
      width: 190,
      height: 210,
      acceleration: { x: 0, y: 0 },
      drag: 4,
      label: "motor boarding pocket",
      activeWhen: motorBoard,
    },
    stream(
      "delivered_feed",
      { x: 350, y: 1280, width: 1460, height: 300 },
      { x: 100, y: 0 },
      "motor delivered / forward filament",
      motorExit,
    ),
    stream(
      "far_lift",
      { x: 1750, y: 430, width: 340, height: 1130 },
      { x: 0, y: -200 },
      "motor delivered / far-side lift",
      motorExit,
    ),
    stream(
      "optional_cargo_descent",
      { x: 400, y: 1460, width: 130, height: 80 },
      { x: 0, y: 200 },
      "optional ridiculous cargo / drop into bay",
      motorExit,
    ),
    {
      id: "optional_cargo_pocket",
      x: 400,
      y: 1530,
      width: 130,
      height: 180,
      acceleration: { x: 0, y: 0 },
      drag: 4,
      label: "optional cargo boarding bay",
      activeWhen: motorExit,
    },
  ],
  transports: [
    {
      ...motorBase.transports![0]!,
      duration: 4.2,
      radius: 46,
      wait: 0.2,
      releaseVelocity: { x: 70, y: 0 },
      activeWhen: motorBoard,
      label: "filament motor cargo",
    },
    {
      id: "shortcut",
      kind: "vesicle",
      path: [
        { x: 450, y: 1550 },
        { x: 1050, y: 1530 },
        { x: 1600, y: 1150 },
        { x: 1900, y: 560 },
      ],
      duration: 1.8,
      radius: 34,
      wait: 0.2,
      releaseVelocity: { x: 0, y: -120 },
      activeWhen: motorExit,
      label: "optional ridiculous cargo / far lift shortcut",
    },
  ],
  collectibles: [{ id: "cargo_fragment", x: 450, y: 1630 }],
  decorations: [
    { kind: "filament", x: 480, y: 275, width: 1110, height: 45 },
    { kind: "filament", x: 1030, y: 1280, width: 600, height: 50 },
    { kind: "vesicle", x: 920, y: 670, width: 240, height: 160 },
  ],
};

const mitoSteps: readonly EncounterStep[] = [
  {
    id: "mitochondrial_rebound",
    kind: "contact",
    contactId: "giant_mitochondrion",
    label: "GIANT MITOCHONDRION / LOWER FLANK",
    caption: "The giant mitochondrial flank wakes a rising circulation around its left side.",
  },
  {
    id: "spiral_loft",
    kind: "region",
    region: { x: 470, y: 180, width: 290, height: 250 },
    label: "ABOVE THE GIANT / TURN RIGHT",
    caption: "Above the giant, the circulation turns downward around its far side.",
  },
  {
    id: "far_side",
    kind: "region",
    region: { x: 1660, y: 1150, width: 260, height: 320 },
    label: "FAR SIDE / ER APPROACH",
    caption: "The far side opens a short lower current into the ER approach.",
  },
  {
    id: "mito_outlet",
    kind: "region",
    region: { x: 1960, y: 1280, width: 210, height: 260 },
    label: "ENDOPLASMIC RETICULUM",
    caption: "The ER's folded channels begin just beyond the giant mitochondrion.",
  },
];
const mitoApproach: PhaseCondition = {
  encounterId: "mitochondrial_rebound",
  max: phaseBefore(mitoSteps, "mitochondrial_rebound"),
};
const mitoRise = phaseWindow(
  "mitochondrial_rebound",
  mitoSteps,
  "mitochondrial_rebound",
  "spiral_loft",
);
const mitoFar = phaseWindow("mitochondrial_rebound", mitoSteps, "spiral_loft", "far_side");
const mitoExit = phaseWindow("mitochondrial_rebound", mitoSteps, "far_side", "mito_outlet");
const mitoBase = currentLoop(
  {
    id: "mitochondrial_rebound",
    placement: { x: 2000, y: 0 },
    width: WIDTH,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 2070, y: 1570 },
    entrance: { x: 40, y: 300 },
    exit: { x: 2070, y: 1400 },
    sequence: mitoSteps,
    objective:
      "Descend to the giant's lower flank, rebound above it, and follow its changed far-side current.",
  },
  { x: 100, y: -90 },
);
const mito: ChamberSpec = {
  ...mitoBase,
  recovery: {
    x: 180,
    y: 0,
    width: 230,
    height: HEIGHT,
    acceleration: { x: 0, y: 440 },
    label: "permanent mitochondrial descent",
  },
  obstacles: [
    {
      ...rebound("giant_mitochondrion", { x: 1000, y: 1170 }, 275, { x: -160, y: -240 }),
      material: "mitochondrion",
    },
  ],
  fields: [
    stream(
      "lower_flank_feed",
      { x: 420, y: 1280, width: 550, height: 450 },
      { x: 90, y: -75 },
      "giant lower-flank approach",
      mitoApproach,
    ),
    stream(
      "opened_spiral",
      { x: 440, y: 430, width: 350, height: 1100 },
      { x: 0, y: -215 },
      "rebound / opened mitochondrial spiral",
      mitoRise,
    ),
    stream(
      "changed_far_turn",
      { x: 780, y: 130, width: 1070, height: 470 },
      { x: 150, y: 100 },
      "above giant / changed far-side circulation",
      mitoFar,
    ),
    stream(
      "changed_far_descent",
      { x: 1640, y: 0, width: 310, height: 1510 },
      { x: 0, y: 370 },
      "above giant / far-side descent",
      mitoFar,
    ),
    stream(
      "er_feed",
      { x: 1900, y: 1230, width: 290, height: 280 },
      { x: 90, y: 0 },
      "opened ER approach",
      mitoExit,
    ),
  ],
  collectibles: [{ id: "giant_fragment", x: 610, y: 100 }],
  decorations: [
    { kind: "filament", x: 420, y: 1610, width: 1060, height: 65 },
    { kind: "vesicle", x: 1130, y: 490, width: 180, height: 120 },
  ],
};

const erSteps: readonly EncounterStep[] = [
  {
    id: "first_mouth",
    kind: "region",
    region: { x: 220, y: 380, width: 280, height: 250 },
    label: "FIRST ER MOUTH / RISE LEFT",
    caption: "Rise to the first folded ER channel's upper mouth.",
  },
  {
    id: "first_capture",
    kind: "transport_capture",
    transportId: "channel",
    label: "FIRST ER CAPTURE",
    caption: "The first ER fold bends upward. Remain aboard until delivery.",
  },
  {
    id: "first_delivery",
    kind: "transport_delivery",
    transportId: "channel",
    label: "FIRST ER DELIVERY",
    caption: "The first fold delivers below a reticulum junction. Contact it to open the return.",
  },
  {
    id: "junction_contact",
    kind: "contact",
    contactId: "fold_junction",
    label: "ER JUNCTION / OPEN RETURN",
    caption: "The reticulum junction opens a return current toward a second channel mouth.",
  },
  {
    id: "second_mouth",
    kind: "region",
    region: { x: 230, y: 1380, width: 260, height: 240 },
    label: "SECOND ER MOUTH",
    caption: "The second ER fold is available at the lower return mouth.",
  },
  {
    id: "second_capture",
    kind: "transport_capture",
    transportId: "return_channel",
    label: "SECOND ER CAPTURE",
    caption: "Follow the second fold toward the countercurrent relay.",
  },
  {
    id: "second_delivery",
    kind: "transport_delivery",
    transportId: "return_channel",
    label: "SECOND ER DELIVERY",
    caption: "Natural delivery reaches opposing currents beyond the reticulum.",
  },
];
const firstEr = phaseWindow("er_transfer", erSteps, "first_mouth", "first_delivery");
const junctionApproach = phaseWindow("er_transfer", erSteps, "first_delivery", "junction_contact");
const erReturn = phaseWindow("er_transfer", erSteps, "junction_contact", "second_mouth");
const secondEr = phaseWindow("er_transfer", erSteps, "second_mouth", "second_delivery");
const erBase = channelTransfer(
  {
    id: "er_transfer",
    placement: { x: 4000, y: 0 },
    width: WIDTH,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 2010, y: 1620 },
    entrance: { x: 60, y: 1400 },
    exit: { x: 1990, y: 1440 },
    sequence: erSteps,
    objective:
      "Ride the first ER fold, open its return at the junction, and ride the second fold to delivery.",
  },
  [
    { x: 350, y: 500 },
    { x: 650, y: 1080 },
    { x: 1000, y: 1210 },
    { x: 1200, y: 650 },
    { x: 1500, y: 330 },
  ],
);
const er: ChamberSpec = {
  ...erBase,
  recovery: {
    x: 200,
    y: 0,
    width: 100,
    height: HEIGHT,
    acceleration: { x: 0, y: 380 },
    label: "permanent ER-mouth return",
  },
  obstacles: [
    {
      ...rebound("fold_junction", { x: 1760, y: 360 }, 115, { x: -170, y: 130 }, junctionApproach),
      material: "reticulum",
    },
    {
      id: "lower_er_surface",
      shape: { kind: "capsule", start: { x: 640, y: 1560 }, end: { x: 1300, y: 1530 }, radius: 35 },
      material: "reticulum",
      response: { kind: "rebound", restitution: 0.76 },
    },
    {
      id: "upper_er_surface",
      shape: { kind: "capsule", start: { x: 680, y: 730 }, end: { x: 980, y: 650 }, radius: 45 },
      material: "reticulum",
      response: { kind: "rebound", restitution: 0.76 },
    },
  ],
  transports: [
    {
      ...erBase.transports![0]!,
      duration: 2.7,
      radius: 38,
      activeWhen: firstEr,
      label: "first folded ER channel",
    },
    {
      id: "return_channel",
      kind: "channel",
      path: [
        { x: 350, y: 1480 },
        { x: 760, y: 1150 },
        { x: 1110, y: 1260 },
        { x: 1630, y: 1100 },
        { x: 1980, y: 1440 },
      ],
      duration: 2.7,
      radius: 38,
      wait: 0,
      releaseVelocity: { x: 100, y: 0 },
      activeWhen: secondEr,
      label: "second folded ER channel",
    },
  ],
  fields: [
    stream(
      "first_mouth_lift",
      { x: 330, y: 630, width: 270, height: 990 },
      { x: 0, y: -180 },
      "first ER mouth / rise left",
      { encounterId: "er_transfer", max: phaseBefore(erSteps, "first_delivery") },
    ),
    stream(
      "junction_approach",
      { x: 1470, y: 220, width: 390, height: 420 },
      { x: 100, y: 0 },
      "first delivery / reticulum junction",
      junctionApproach,
    ),
    stream(
      "junction_return",
      { x: 490, y: 120, width: 1340, height: 680 },
      { x: -220, y: 145 },
      "junction opened / second-mouth return",
      erReturn,
    ),
    stream(
      "junction_down",
      { x: 230, y: 0, width: 300, height: 1480 },
      { x: 0, y: 200 },
      "junction opened / lower ER mouth",
      erReturn,
    ),
  ],
  decorations: [
    { kind: "filament", x: 440, y: 1010, width: 650, height: 60 },
    { kind: "vesicle", x: 1430, y: 780, width: 180, height: 130 },
  ],
};

const relaySteps: readonly EncounterStep[] = [
  {
    id: "lower_headwind",
    kind: "region",
    region: { x: 1430, y: 1320, width: 290, height: 240 },
    label: "LOWER HEADWIND / STEER RIGHT",
    caption:
      "Cross the lower headwind. Its far end opens a rising return against the upper current.",
  },
  {
    id: "upper_headwind",
    kind: "region",
    region: { x: 330, y: 160, width: 300, height: 270 },
    label: "UPPER HEADWIND / STEER LEFT",
    caption: "The upper headwind reaches a motor interception bay. Hold position to board.",
  },
  {
    id: "relay_capture",
    kind: "transport_capture",
    transportId: "cargo",
    label: "COUNTERCURRENT MOTOR",
    caption: "The relay motor cuts diagonally across the opposing currents.",
  },
  {
    id: "relay_delivery",
    kind: "transport_delivery",
    transportId: "cargo",
    label: "RELAY DELIVERY",
    caption: "Natural relay delivery reaches the crowded vesicle approaches.",
  },
];
const relayLower: PhaseCondition = {
  encounterId: "countercurrent_relay",
  max: phaseBefore(relaySteps, "lower_headwind"),
};
const relayUpper = phaseWindow(
  "countercurrent_relay",
  relaySteps,
  "lower_headwind",
  "upper_headwind",
);
const relayRide = phaseWindow(
  "countercurrent_relay",
  relaySteps,
  "upper_headwind",
  "relay_delivery",
);
const relayBase = transportRelay(
  {
    id: "countercurrent_relay",
    placement: { x: 6000, y: 0 },
    width: WIDTH,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 2050, y: 1590 },
    entrance: { x: 40, y: 1440 },
    exit: { x: 1990, y: 1340 },
    sequence: relaySteps,
    objective:
      "Steer right against the lower flow, climb back left against the upper flow, and ride the relay motor.",
  },
  [
    { x: 480, y: 300 },
    { x: 1000, y: 500 },
    { x: 1340, y: 860 },
    { x: 1980, y: 1340 },
  ],
  "motor",
);
const relay: ChamberSpec = {
  ...relayBase,
  recovery: {
    x: 100,
    y: 0,
    width: 220,
    height: HEIGHT,
    acceleration: { x: 0, y: 450 },
    label: "permanent countercurrent descent",
  },
  fields: [
    stream(
      "lower_opposition",
      { x: 340, y: 1240, width: 1350, height: 340 },
      { x: -165, y: 0 },
      "lower headwind / steer right",
      relayLower,
    ),
    stream(
      "headwind_rise",
      { x: 1310, y: 420, width: 430, height: 1120 },
      { x: 0, y: -205 },
      "lower crossing / rising relay return",
      relayUpper,
    ),
    stream(
      "upper_opposition",
      { x: 640, y: 120, width: 1030, height: 520 },
      { x: 205, y: 0 },
      "upper headwind / steer left",
      relayUpper,
    ),
    stream(
      "interception_lift",
      { x: 340, y: 430, width: 300, height: 1050 },
      { x: 0, y: -150 },
      "upper interception approach",
      relayUpper,
    ),
    stream(
      "interception_settle",
      { x: 330, y: 0, width: 300, height: 235 },
      { x: 0, y: 230 },
      "motor bay / settle into interception",
      relayRide,
    ),
    {
      id: "relay_pocket",
      x: 375,
      y: 210,
      width: 200,
      height: 230,
      acceleration: { x: 0, y: 0 },
      drag: 4,
      label: "countercurrent motor bay",
      activeWhen: relayRide,
    },
  ],
  transports: [
    {
      ...relayBase.transports![0]!,
      duration: 2.8,
      radius: 46,
      wait: 0.2,
      activeWhen: relayRide,
      label: "countercurrent relay motor",
    },
  ],
  collectibles: [{ id: "headwind_fragment", x: 1750, y: 120 }],
  decorations: [
    { kind: "filament", x: 420, y: 1170, width: 1150, height: 45 },
    { kind: "filament", x: 660, y: 680, width: 850, height: 55 },
  ],
};

const crowdedSteps: readonly EncounterStep[] = [
  {
    id: "first_bay",
    kind: "region",
    region: { x: 320, y: 380, width: 280, height: 250 },
    label: "FIRST VESICLE BAY / RISE LEFT",
    caption: "Rise between the crowded bodies to intercept the first vesicle.",
  },
  {
    id: "first_capture",
    kind: "transport_capture",
    transportId: "cargo",
    label: "FIRST VESICLE",
    caption: "The first vesicle bends through the crowded upper passage.",
  },
  {
    id: "first_delivery",
    kind: "transport_delivery",
    transportId: "cargo",
    label: "FIRST VESICLE DELIVERY",
    caption: "First delivery opens a descent toward a moving crowded surface.",
  },
  {
    id: "crowd_deflection",
    kind: "contact",
    contactId: "moving_crowd",
    label: "MOVING CROWD / DEFLECT LEFT",
    caption: "The crowded surface deflects you left and opens the lower vesicle return.",
  },
  {
    id: "second_bay",
    kind: "region",
    region: { x: 210, y: 1380, width: 280, height: 230 },
    label: "LOWER VESICLE BAY",
    caption: "A second vesicle carries the lower return toward the nucleus.",
  },
  {
    id: "second_capture",
    kind: "transport_capture",
    transportId: "second_cargo",
    label: "SECOND VESICLE",
    caption: "Remain aboard the second vesicle until its natural delivery.",
  },
  {
    id: "second_delivery",
    kind: "transport_delivery",
    transportId: "second_cargo",
    label: "SECOND VESICLE DELIVERY",
    caption: "Both transfers are complete. The nucleus is ready above the outlet.",
  },
];
const firstBay: PhaseCondition = {
  encounterId: "crowded_transfer",
  max: phaseBefore(crowdedSteps, "first_bay"),
};
const firstVesicle = phaseWindow("crowded_transfer", crowdedSteps, "first_bay", "first_delivery");
const deflection = phaseWindow(
  "crowded_transfer",
  crowdedSteps,
  "first_delivery",
  "crowd_deflection",
);
const lowerReturn = phaseWindow("crowded_transfer", crowdedSteps, "crowd_deflection", "second_bay");
const secondVesicle = phaseWindow(
  "crowded_transfer",
  crowdedSteps,
  "second_bay",
  "second_delivery",
);
const crowdedBase = transportRelay(
  {
    id: "crowded_transfer",
    placement: { x: 8000, y: 0 },
    width: WIDTH,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 2050, y: 1020 },
    entrance: { x: 40, y: 1340 },
    exit: { x: 1980, y: 920 },
    sequence: crowdedSteps,
    objective:
      "Ride the upper vesicle, deflect from the moving crowd, and transfer through the lower vesicle bay.",
  },
  [
    { x: 450, y: 500 },
    { x: 870, y: 450 },
    { x: 1300, y: 740 },
    { x: 1650, y: 850 },
  ],
);
const crowded: ChamberSpec = {
  ...crowdedBase,
  recovery: {
    x: 150,
    y: 0,
    width: 110,
    height: HEIGHT,
    acceleration: { x: 0, y: 420 },
    label: "permanent crowded-bay descent",
  },
  obstacles: [
    {
      ...rebound(
        "moving_crowd",
        { x: 1580, y: 1260 },
        150,
        { x: -170, y: 120 },
        { encounterId: "crowded_transfer", max: phaseBefore(crowdedSteps, "crowd_deflection") },
      ),
      motion: { radiusX: 65, radiusY: 45, period: 6 },
      material: "gel",
    },
    rebound("lower_crowd", { x: 900, y: 1080 }, 85, { x: 0, y: -70 }),
    rebound("upper_crowd", { x: 1160, y: 240 }, 75, { x: -60, y: 0 }),
  ],
  fields: [
    stream(
      "first_bay_lift",
      { x: 360, y: 630, width: 280, height: 1000 },
      { x: 0, y: -180 },
      "crowded upper bay / rise left",
      firstBay,
    ),
    {
      id: "upper_boarding_pocket",
      x: 355,
      y: 405,
      width: 200,
      height: 220,
      acceleration: { x: 0, y: 0 },
      drag: 4,
      label: "upper vesicle bay",
      activeWhen: firstVesicle,
    },
    stream(
      "moving_surface_descent",
      { x: 1380, y: 870, width: 430, height: 730 },
      { x: 0, y: 300 },
      "first delivery / moving crowded surface",
      deflection,
    ),
    stream(
      "opened_lower_return",
      { x: 380, y: 1090, width: 1250, height: 540 },
      { x: -200, y: 60 },
      "deflection / changed lower return",
      lowerReturn,
    ),
    {
      id: "lower_boarding_pocket",
      x: 255,
      y: 1430,
      width: 150,
      height: 200,
      acceleration: { x: 0, y: 0 },
      drag: 4,
      label: "lower vesicle bay",
      activeWhen: secondVesicle,
    },
    stream(
      "nuclear_approach",
      { x: 2090, y: 820, width: 100, height: 430 },
      { x: 0, y: -140 },
      "delivered / nuclear approach",
      phaseAfterStep("crowded_transfer", crowdedSteps, "second_delivery"),
    ),
  ],
  transports: [
    {
      ...crowdedBase.transports![0]!,
      duration: 2.1,
      radius: 45,
      wait: 0.2,
      activeWhen: firstVesicle,
      label: "crowded upper vesicle",
    },
    {
      id: "second_cargo",
      kind: "vesicle",
      path: [
        { x: 330, y: 1500 },
        { x: 890, y: 1450 },
        { x: 1260, y: 1110 },
        { x: 1980, y: 920 },
      ],
      duration: 2.6,
      radius: 45,
      wait: 0.2,
      releaseVelocity: { x: 90, y: -60 },
      activeWhen: secondVesicle,
      label: "crowded lower vesicle",
    },
  ],
  hazards: [{ id: "optional_lysosome", x: 930, y: 1730, width: 260, height: 50, kind: "acid" }],
  collectibles: [{ id: "lysosome_fragment", x: 870, y: 1680 }],
  decorations: [
    { kind: "vesicle", x: 690, y: 800, width: 160, height: 115 },
    { kind: "filament", x: 580, y: 1660, width: 920, height: 50 },
  ],
};

export const CYTOPLASM_LEVEL: LevelDefinition = {
  id: "cytoplasm",
  name: "Cytoplasm: five crowded transfers",
  objective:
    "Ride motor cargo, rebound around the giant mitochondrion, fold through the ER, cross headwinds, and transfer between vesicles.",
  caption:
    "Motor transport, organelle rebounds, folded channels, and currents exaggerate a crowded cellular journey.",
  spawn: { x: 65, y: 1510 },
  palette: { background: "#142940", foreground: "#8ccadf", accent: "#aee6c9" },
  destination: {
    id: "cytoplasm-nucleus",
    center: { x: 10110, y: 740 },
    radius: 55,
    label: "Nucleus with visible pores",
    motif: "nucleus",
  },
  ...compileChambers("cytoplasm", 10200, HEIGHT, [motor, mito, er, relay, crowded]),
};
