import type { EncounterStep, LevelDefinition } from "../types/level";
import type { ChamberSpec } from "../types/sections";
import { phaseBefore } from "./encounter_phases";
import { phaseAfterStep, phaseWindow, rebound, stream } from "./journey_patterns";
import { compileChambers } from "./section_specs";
import { channelTransfer, currentLoop } from "./surprise_patterns";

const HEIGHT = 1800;

const approachSteps: readonly EncounterStep[] = [
  {
    id: "inlet",
    kind: "region",
    region: { x: 65, y: 1420, width: 180, height: 200 },
    label: "OUTER CIRCULATION",
    caption: "The outer circulation rises toward a moving deflection surface.",
  },
  {
    id: "left_loft",
    kind: "region",
    region: { x: 330, y: 180, width: 270, height: 250 },
    label: "LOFT / TURN RIGHT",
    caption: "The loft feeds the moving boundary. Turn right into its deflection.",
  },
  {
    id: "moving_deflection",
    kind: "contact",
    contactId: "moving_boundary",
    label: "MOVING BOUNDARY / RETURN",
    caption: "The deflection folds this finite current back toward the low basin.",
  },
  {
    id: "low_basin",
    kind: "region",
    region: { x: 310, y: 1400, width: 310, height: 250 },
    label: "BASIN / NEW APPROACH",
    caption: "The basin redirects circulation into a new diagonal pore approach.",
  },
  {
    id: "pore_staging",
    kind: "region",
    region: { x: 1820, y: 180, width: 280, height: 260 },
    label: "PORE STAGING",
    caption: "The outside staging pocket is reached. The pore remains continuously open.",
  },
];
const approachBase = currentLoop(
  {
    id: "circulation_approach",
    placement: { x: 0, y: 0 },
    width: 2200,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1940, y: 250 },
    objective:
      "Rise to the loft, deflect from the moving boundary, and follow the changed basin to pore staging.",
    entrance: { x: 42, y: 1510 },
    exit: { x: 1950, y: 310 },
    sequence: approachSteps,
  },
  { x: 175, y: -90 },
);
const approachRise = phaseWindow("circulation_approach", approachSteps, "inlet", "left_loft");
const approachHigh = phaseWindow(
  "circulation_approach",
  approachSteps,
  "left_loft",
  "moving_deflection",
);
const approachReturn = phaseWindow(
  "circulation_approach",
  approachSteps,
  "moving_deflection",
  "low_basin",
);
const stagingRise = phaseWindow("circulation_approach", approachSteps, "low_basin", "pore_staging");
const approach: ChamberSpec = {
  ...approachBase,
  obstacles: [
    {
      ...rebound("moving_boundary", { x: 1720, y: 300 }, 105, { x: -150, y: 170 }),
      motion: { radiusX: 35, radiusY: 55, period: 5 },
      activeWhen: {
        encounterId: "circulation_approach",
        max: phaseBefore(approachSteps, "moving_deflection"),
      },
    },
  ],
  fields: [
    stream(
      "inlet_feed",
      { x: 65, y: 1360, width: 580, height: 320 },
      { x: 140, y: -100 },
      "outer circulation inlet",
      { encounterId: "circulation_approach", max: phaseBefore(approachSteps, "inlet") },
    ),
    stream(
      "loft_rise",
      { x: 300, y: 430, width: 340, height: 1200 },
      { x: 0, y: -220 },
      "outer loft rise",
      approachRise,
    ),
    stream(
      "boundary_approach",
      { x: 580, y: 130, width: 1280, height: 580 },
      { x: 120, y: 40 },
      "moving boundary approach",
      approachHigh,
    ),
    stream(
      "folded_circulation",
      { x: 580, y: 130, width: 1280, height: 620 },
      { x: -210, y: 180 },
      "changed finite circulation",
      approachReturn,
    ),
    stream(
      "basin_descent",
      { x: 310, y: 0, width: 330, height: HEIGHT },
      { x: 0, y: 380 },
      "changed basin descent",
      approachReturn,
    ),
    stream(
      "staging_diagonal",
      { x: 620, y: 430, width: 1240, height: 1190 },
      { x: 95, y: -180 },
      "new diagonal pore approach",
      stagingRise,
    ),
    stream(
      "staging_lift",
      { x: 1710, y: 490, width: 370, height: 1120 },
      { x: 0, y: -250 },
      "pore staging lift",
      stagingRise,
    ),
  ],
  collectibles: [{ id: "outer_fragment", x: 460, y: 95 }],
  decorations: [
    { kind: "filament", x: 760, y: 790, width: 710, height: 80 },
    { kind: "vesicle", x: 950, y: 1210, width: 160, height: 110 },
  ],
};

const crossingSteps: readonly EncounterStep[] = [
  {
    id: "outer_high",
    kind: "region",
    region: { x: 480, y: 170, width: 270, height: 290 },
    label: "OUTSIDE / TURN BACK",
    caption: "The outside high current turns toward the lower pore approach.",
  },
  {
    id: "outer_basin",
    kind: "region",
    region: { x: 170, y: 1400, width: 270, height: 260 },
    label: "OUTER BASIN / RISE TO PORE",
    caption: "Rise along the membrane's outside face to the open mouth.",
  },
  {
    id: "pore_rim",
    kind: "region",
    region: { x: 640, y: 230, width: 130, height: 230 },
    label: "OUTER RIM / TURN DOWN",
    caption: "The outside rim folds the approach down toward the continuously open pore.",
  },
  {
    id: "pore_mouth",
    kind: "region",
    region: { x: 665, y: 840, width: 125, height: 180 },
    label: "OPEN PORE / CROSS RIGHT",
    caption: "The pore is continuously open. Steer right through its visible gap.",
  },
  {
    id: "pore_crossing",
    kind: "region",
    region: { x: 980, y: 825, width: 170, height: 210 },
    label: "PORE CROSSED",
    caption: "Successful pore crossing is saved immediately. The inner return loop begins.",
  },
];
const crossingBase = currentLoop(
  {
    id: "open_pore_crossing",
    placement: { x: 2000, y: 0 },
    width: 1550,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 1200, y: 1060 },
    objective:
      "Turn at the outside high pocket, rise from its basin, and cross the continuously open pore.",
    entrance: { x: 35, y: 310 },
    exit: { x: 1080, y: 930 },
    sequence: crossingSteps,
  },
  { x: 100, y: 0 },
);
const outerReturn = phaseWindow("open_pore_crossing", crossingSteps, "outer_high", "outer_basin");
const mouthRise = phaseWindow("open_pore_crossing", crossingSteps, "outer_basin", "pore_rim");
const mouthDescent = phaseWindow("open_pore_crossing", crossingSteps, "pore_rim", "pore_mouth");
const crossing: ChamberSpec = {
  ...crossingBase,
  recovery: {
    x: 170,
    y: 0,
    width: 220,
    height: HEIGHT,
    acceleration: { x: 0, y: 360 },
    label: "permanent outside pore return",
  },
  // These two unconditional surfaces leave the same open gap in every encounter phase.
  obstacles: [
    {
      id: "upper_envelope",
      shape: { kind: "roundedRect", x: 800, y: 0, width: 140, height: 820, radius: 45 },
      material: "membrane",
      response: { kind: "rebound", restitution: 0.85 },
    },
    {
      id: "lower_envelope",
      shape: { kind: "roundedRect", x: 800, y: 1040, width: 140, height: 760, radius: 45 },
      material: "membrane",
      response: { kind: "rebound", restitution: 0.85 },
    },
  ],
  fields: [
    stream(
      "outside_high_approach",
      { x: 400, y: 130, width: 350, height: 480 },
      { x: 110, y: -80 },
      "outside high approach",
      { encounterId: "open_pore_crossing", max: phaseBefore(crossingSteps, "outer_high") },
    ),
    stream(
      "outer_fold",
      { x: 430, y: 130, width: 340, height: 620 },
      { x: -170, y: 180 },
      "outside finite return",
      outerReturn,
    ),
    stream(
      "outer_basin_down",
      { x: 390, y: 0, width: 110, height: HEIGHT },
      { x: -70, y: 360 },
      "outside basin descent",
      outerReturn,
    ),
    stream(
      "pore_mouth_rise",
      { x: 445, y: 460, width: 310, height: 1160 },
      { x: 60, y: -170 },
      "outside rim approach",
      mouthRise,
    ),
    stream(
      "pore_mouth_descent",
      { x: 640, y: 0, width: 140, height: 825 },
      { x: 0, y: 360 },
      "changed open mouth descent",
      mouthDescent,
    ),
    stream(
      "open_pore_stream",
      { x: 750, y: 820, width: 400, height: 220 },
      { x: 280, y: 0 },
      "continuously open pore stream",
    ),
  ],
  collectibles: [{ id: "pore_fragment", x: 680, y: 85 }],
  decorations: [
    { kind: "lipid", x: 815, y: 0, width: 42, height: 820 },
    { kind: "lipid", x: 870, y: 0, width: 42, height: 820 },
    { kind: "pore", x: 792, y: 820, width: 155, height: 220 },
    { kind: "lipid", x: 815, y: 1040, width: 42, height: 760 },
    { kind: "lipid", x: 870, y: 1040, width: 42, height: 760 },
  ],
};

const innerSteps: readonly EncounterStep[] = [
  {
    id: "inner_entry",
    kind: "region",
    region: { x: 100, y: 830, width: 270, height: 270 },
    label: "INNER CIRCULATION / RISE",
    caption: "Inner circulation rises to a crest that changes the return flow.",
  },
  {
    id: "inner_crest",
    kind: "contact",
    contactId: "inner_crest",
    label: "CREST / FINITE RETURN",
    caption: "The crest starts a finite backward sweep toward the inner basin.",
  },
  {
    id: "return_basin",
    kind: "region",
    region: { x: 150, y: 1420, width: 280, height: 240 },
    label: "RETURN BASIN / CHANNEL",
    caption: "The sweep ends here. A curved connector carries you into a new inner lobe.",
  },
  {
    id: "connector_capture",
    kind: "transport_capture",
    transportId: "channel",
    label: "BOARD CURVED CONNECTOR",
    caption: "Board the short curved connector. Space escapes; delivery remains pending.",
  },
  {
    id: "connector_delivery",
    kind: "transport_delivery",
    transportId: "channel",
    label: "CONNECTOR DELIVERY",
    caption: "Delivery opens an opposing loft. Turn left into its rising current.",
  },
  {
    id: "opposite_loft",
    kind: "region",
    region: { x: 420, y: 200, width: 280, height: 260 },
    label: "OPPOSITE LOFT / LOWER TURN",
    caption: "The loft folds this lobe downward into its new lower turn.",
  },
  {
    id: "lower_turn",
    kind: "region",
    region: { x: 1050, y: 1400, width: 300, height: 260 },
    label: "LOWER TURN / RECEPTOR RISE",
    caption: "The lower turn opens the final rising route toward the steroid receptor.",
  },
  {
    id: "receptor_approach",
    kind: "region",
    region: { x: 2010, y: 240, width: 260, height: 260 },
    label: "STEROID RECEPTOR",
    caption: "The inner return loop is complete. The steroid receptor is ready.",
  },
];
const innerBase = channelTransfer(
  {
    id: "inner_return_loop",
    placement: { x: 3200, y: 0 },
    width: 2400,
    height: HEIGHT,
    required: true,
    completionCheckpoint: { x: 2135, y: 270 },
    objective:
      "Turn at the inner crest, return through the finite sweep, ride the curved connector, and follow the changed loft to the receptor.",
    entrance: { x: 115, y: 930 },
    exit: { x: 2160, y: 350 },
    sequence: innerSteps,
  },
  [
    { x: 290, y: 1540 },
    { x: 740, y: 1300 },
    { x: 1160, y: 1550 },
    { x: 1540, y: 1360 },
  ],
);
const innerRise = phaseWindow("inner_return_loop", innerSteps, "inner_entry", "inner_crest");
const finiteReturn = phaseWindow("inner_return_loop", innerSteps, "inner_crest", "return_basin");
const connectorPending = phaseWindow(
  "inner_return_loop",
  innerSteps,
  "return_basin",
  "connector_delivery",
);
const oppositeRise = phaseWindow(
  "inner_return_loop",
  innerSteps,
  "connector_delivery",
  "opposite_loft",
);
const lowerReturn = phaseWindow("inner_return_loop", innerSteps, "opposite_loft", "lower_turn");
const receptorRise = phaseWindow(
  "inner_return_loop",
  innerSteps,
  "lower_turn",
  "receptor_approach",
);
const inner: ChamberSpec = {
  ...innerBase,
  recovery: {
    x: 2280,
    y: 0,
    width: 120,
    height: HEIGHT,
    acceleration: { x: 0, y: 360 },
    label: "permanent inner-envelope descent",
  },
  obstacles: [
    rebound(
      "inner_crest",
      { x: 960, y: 300 },
      105,
      { x: -170, y: 150 },
      { encounterId: "inner_return_loop", max: phaseBefore(innerSteps, "inner_crest") },
    ),
  ],
  transports: [
    {
      ...innerBase.transports![0]!,
      duration: 2,
      radius: 45,
      wait: 0.25,
      activeWhen: connectorPending,
      label: "curved inner-envelope connector",
    },
  ],
  fields: [
    stream(
      "inner_crest_feed",
      { x: 350, y: 450, width: 700, height: 1120 },
      { x: 80, y: -180 },
      "inner crest circulation",
      innerRise,
    ),
    stream(
      "inner_crest_lift",
      { x: 750, y: 410, width: 320, height: 1190 },
      { x: 0, y: -220 },
      "inner crest lift",
      innerRise,
    ),
    stream(
      "finite_backward_sweep",
      { x: 430, y: 100, width: 700, height: 650 },
      { x: -270, y: 170 },
      "finite inner backward sweep",
      finiteReturn,
    ),
    stream(
      "inner_basin_descent",
      { x: 150, y: 0, width: 280, height: HEIGHT },
      { x: 0, y: 380 },
      "inner basin descent",
      finiteReturn,
    ),
    stream(
      "connector_descent",
      { x: 150, y: 0, width: 280, height: 1460 },
      { x: 0, y: 300 },
      "connector entrance descent",
      connectorPending,
    ),
    {
      id: "boarding_pocket",
      x: 225,
      y: 1460,
      width: 150,
      height: 240,
      acceleration: { x: 0, y: 0 },
      drag: 5,
      label: "curved connector boarding pocket",
      activeWhen: connectorPending,
    },
    stream(
      "opposite_feed",
      { x: 700, y: 1050, width: 1120, height: 560 },
      { x: -160, y: -120 },
      "opposing delivered lobe",
      oppositeRise,
    ),
    stream(
      "opposite_lift",
      { x: 420, y: 460, width: 320, height: 1100 },
      { x: 0, y: -230 },
      "opposite inner loft",
      oppositeRise,
    ),
    stream(
      "changed_lower_descent",
      { x: 1050, y: 0, width: 300, height: HEIGHT },
      { x: 0, y: 380 },
      "changed inner lower turn",
      lowerReturn,
    ),
    stream(
      "receptor_diagonal",
      { x: 1330, y: 490, width: 930, height: 1140 },
      { x: 95, y: -190 },
      "opened receptor approach",
      receptorRise,
    ),
    stream(
      "receptor_lift",
      { x: 1930, y: 490, width: 330, height: 1120 },
      { x: 0, y: -230 },
      "receptor lift",
      receptorRise,
    ),
    stream(
      "permanent_left_return",
      { x: 50, y: 0, width: 100, height: HEIGHT },
      { x: 0, y: 360 },
      "permanent inner basin return",
      phaseAfterStep("open_pore_crossing", crossingSteps, "pore_crossing"),
    ),
  ],
  collectibles: [{ id: "inner_fragment", x: 540, y: 100 }],
  decorations: [
    { kind: "filament", x: 500, y: 800, width: 950, height: 90 },
    { kind: "vesicle", x: 1150, y: 1150, width: 160, height: 110 },
    { kind: "receptor", x: 2160, y: 285, width: 140, height: 140 },
  ],
};

export const ENVELOPE_LEVEL: LevelDefinition = {
  id: "envelope",
  name: "Nuclear envelope: open pore and inner return",
  objective:
    "Follow outer circulation, cross the open pore, and return through the inner lobes to a steroid receptor.",
  caption:
    "This continuously open pore and its exaggerated arcade currents illustrate an authored nuclear-envelope route.",
  spawn: { x: 42, y: 1510 },
  palette: { background: "#172f35", foreground: "#ade1ca", accent: "#d8c1f3" },
  destination: {
    id: "envelope-receptor",
    center: { x: 5445, y: 350 },
    radius: 55,
    label: "Steroid receptor",
    motif: "receptor",
  },
  ...compileChambers("envelope", 5600, HEIGHT, [approach, crossing, inner]),
};
