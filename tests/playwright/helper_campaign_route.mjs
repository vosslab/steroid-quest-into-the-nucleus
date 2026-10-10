/** Authored standard routes: WORLD player centers, keyed by compiled encounter and local step.
 * Required route guidance only. These functions read observations and never mutate gameplay.
 */
const routes = {
  "membrane-bilayer_outlet": {
    inlet: { x: 125, y: 1510, pulse: false },
    first_rebound: { x: 460, y: 1380, pulse: false },
    left_loft: { x: 460, y: 265 },
    crest_rebound: { x: 1720, y: 280 },
    lower_basin: { x: 450, y: 1500 },
    outlet: {
      x: 1930,
      y: 310,
      via: [{ x: 1830, y: 500, stopWhen: (s) => Number(s.playerX) + 15 >= 1790 }],
    },
  },
  "membrane-backward_arrival": {
    sweep_arm: { x: 1930, y: 310 },
    return_pocket: { x: 285, y: 1560 },
    vesicle_capture: { x: 285, y: 1570 },
    arrival_rim: {
      x: 680,
      y: 330,
      via: [{ x: 1440, y: 350, stopWhen: (s) => Number(s.playerY) + 15 < 480 }],
    },
    arrival_exit: {
      x: 2070,
      y: 1460,
      via: [{ x: 950, y: 1450, pulse: false, stopWhen: (s) => Number(s.playerY) + 15 > 1340 }],
    },
  },
  "membrane-linked_loops": {
    first_entry: { x: 2330, y: 1460 },
    first_rim: {
      x: 3730,
      y: 320,
      via: [{ x: 3540, y: 330, stopWhen: (s) => Number(s.playerY) + 15 < 430 }],
    },
    lower_link: { x: 2460, y: 1500 },
    second_rim: { x: 3800, y: 1430 },
    opposite_loft: {
      x: 2460,
      y: 310,
      via: [{ x: 2460, y: 1050, stopWhen: (s) => Number(s.playerX) + 15 < 2580 }],
    },
    linked_outlet: { x: 3960, y: 500 },
  },
  "membrane-channel_delivery": {
    lower_contact: {
      x: 4390,
      y: 1440,
      via: [{ x: 4260, y: 1440, pulse: false, stopWhen: (s) => Number(s.playerY) + 15 > 1300 }],
    },
    upper_contact: {
      x: 5710,
      y: 300,
      via: [{ x: 5580, y: 330, stopWhen: (s) => Number(s.playerY) + 15 < 420 }],
    },
    channel_mouth: { x: 4345, y: 1480 },
    channel_capture: { x: 4345, y: 1480 },
  },
};

const envelopeTargets = {
  "circulation_approach:inlet": [125, 1510],
  "circulation_approach:left_loft": [460, 300],
  "circulation_approach:moving_deflection": [1720, 300],
  "circulation_approach:low_basin": [460, 1510],
  "circulation_approach:pore_staging": [1950, 310],
  "open_pore_crossing:outer_high": [2530, 300],
  "open_pore_crossing:outer_basin": [2280, 1510],
  "open_pore_crossing:pore_rim": [2710, 350],
  "open_pore_crossing:pore_mouth": [2715, 930],
  "open_pore_crossing:pore_crossing": [3090, 930],
  "inner_return_loop:inner_entry": [3430, 950],
  "inner_return_loop:inner_crest": [4160, 300],
  "inner_return_loop:return_basin": [3490, 1540],
  "inner_return_loop:connector_capture": [3490, 1540],
  "inner_return_loop:connector_delivery": [3490, 1540],
  "inner_return_loop:opposite_loft": [3740, 310],
  "inner_return_loop:lower_turn": [4400, 1510],
  "inner_return_loop:receptor_approach": [5350, 350],
};
function envelopeLeg(key, value) {
  const px = Number(value.playerX) + 15,
    py = Number(value.playerY) + 15;
  let [x, y] = envelopeTargets[key];
  let pulse = key !== "circulation_approach:inlet";
  // The base center lies inside the moving boundary throughout its small orbit.
  if (key === "circulation_approach:low_basin" && py < 1400) pulse = false;
  if (key === "circulation_approach:pore_staging" && px < 1770) [x, y] = [1830, 500];
  if (key === "open_pore_crossing:outer_basin" && py < 1400) pulse = false;
  if (key === "open_pore_crossing:pore_rim" && px < 2520) [x, y] = [2600, 1060];
  if (key === "open_pore_crossing:pore_mouth" && py < 820) pulse = false;
  if (
    ["open_pore_crossing:pore_mouth", "open_pore_crossing:pore_crossing"].includes(key) &&
    px < 2500 &&
    py < 820
  ) {
    [x, y] = [2280, 930];
    pulse = false;
  }
  if (key === "inner_return_loop:inner_crest" && py > 440) [x, y] = [4070, 380];
  if (key === "inner_return_loop:return_basin" && py < 1420) pulse = false;
  if (key === "inner_return_loop:opposite_loft" && px > 3880) [x, y] = [3740, 1060];
  if (key === "inner_return_loop:lower_turn" && py < 1400) pulse = false;
  if (key === "inner_return_loop:receptor_approach" && px < 5150) [x, y] = [5290, 500];
  return { x, y, pulse };
}
const receptorTargets = {
  "sticky_gallery:gallery_entry": [450, 300, true],
  "sticky_gallery:sticky_contact": [1400, 510, true],
  "sticky_gallery:nearby_escape": [1580, 800, false],
  "sticky_gallery:lower_branch": [550, 1460, false],
  "sticky_gallery:gallery_outlet": [1860, 1460, false],
  "matching_binding:binding_entry": [2150, 1450, false],
  "matching_binding:binding_rim": [3450, 280, true],
  "matching_binding:receptor_approach": [2490, 1280, false],
  "matching_binding:receptor_binding": [2510, 1500, false],
  "changed_passage:bound_entry": [4150, 320, true],
  "changed_passage:middle_switch": [5640, 810, false],
  "changed_passage:lower_turn": [4360, 1500, false],
  "changed_passage:passage_outlet": [5850, 350, true],
  "bound_transfer:transfer_loft": [7460, 280, true],
  "bound_transfer:boarding_pocket": [6275, 1450, false],
  "bound_transfer:complex_capture": [6275, 1450, false],
  "bound_transfer:complex_delivery": [6275, 1450, false],
};
function receptorLeg(key, value) {
  const py = Number(value.playerY) + 15;
  let [x, y, pulse] = receptorTargets[key];
  if (key === "matching_binding:receptor_approach" && py < 1200) [x, y] = [2500, 1290];
  if (key === "bound_transfer:boarding_pocket" && py < 1300) [x, y] = [6300, 1450];
  if (
    py > y + 35 &&
    !["bound_transfer:complex_capture", "bound_transfer:complex_delivery"].includes(key)
  )
    pulse = true;
  return { x, y, pulse };
}
for (const [stage, targets, resolve] of [
  ["envelope", envelopeTargets, envelopeLeg],
  ["receptor", receptorTargets, receptorLeg],
]) {
  for (const [key, [x, y]] of Object.entries(targets)) {
    const [encounter, step] = key.split(":");
    const id = `${stage}-${encounter}`;
    routes[id] ??= {};
    routes[id][step] = { x, y, resolve: (value) => resolve(key, value) };
  }
}

const dnaTargets = {
  "nucleosome_loop:loop_entry": { x: 170, y: 1520, pulse: false },
  "nucleosome_loop:left_loft": { x: 440, y: 280, pulse: true },
  "nucleosome_loop:loop_rim": { x: 1490, y: 340, pulse: true },
  "nucleosome_loop:lower_basin": { x: 385, y: 1520, pulse: false },
  "nucleosome_loop:loop_outlet": { x: 1680, y: 370, pulse: true },
  "moving_passage:lower_approach": { x: 1890, y: 1520, pulse: false },
  "moving_passage:middle_clearance": { x: 2530, y: 1070, pulse: true },
  "moving_passage:upper_clearance": { x: 3000, y: 310, pulse: true },
  "moving_passage:opposite_gap": { x: 2160, y: 420, pulse: true },
  "moving_passage:passage_outlet": { x: 3180, y: 1520, pulse: false },
  "flow_rearrangement:exposure": { x: 3550, y: 1520, pulse: true },
  "flow_rearrangement:high_window": { x: 4610, y: 310, pulse: true },
  "flow_rearrangement:return_basin": { x: 3600, y: 1520, pulse: false },
  "flow_rearrangement:changed_rim": { x: 4600, y: 1470, pulse: false },
  "flow_rearrangement:rearranged_outlet": { x: 4880, y: 350, pulse: true },
  "chromatin_channel:high_bank": { x: 5300, y: 330, pulse: true },
  "chromatin_channel:diagonal_weave": { x: 6170, y: 1010, pulse: false },
  "chromatin_channel:counterbend": { x: 5500, y: 310, pulse: true },
  "chromatin_channel:lower_bank": { x: 6220, y: 1460, pulse: false },
  "chromatin_channel:channel_mouth": { x: 5300, y: 1540, pulse: false },
  "chromatin_channel:channel_capture": { x: 5300, y: 1540, pulse: true },
  "chromatin_channel:channel_delivery": { x: 5300, y: 1540, pulse: true },
  "hre_docking:lower_approach": { x: 6660, y: 1450, pulse: false },
  "hre_docking:matching_approach": { x: 7220, y: 830, pulse: true },
  "hre_docking:hre_docking": { x: 7480, y: 500, pulse: true },
  destination: { x: 7480, y: 500, pulse: true },
};

// World-center waypoints enter the authored lift/descent before steering to a distant region.
function dnaLeg(key, px, py) {
  if (key === "moving_passage:middle_clearance" && px < 2000)
    return py < 1250 ? { x: 1890, y: 1520, pulse: false } : { x: 2530, y: 1070, pulse: false };
  if (key === "nucleosome_loop:loop_outlet" && py > 530) return { x: 1490, y: 370, pulse: true };
  if (key === "moving_passage:upper_clearance" && py > 500) return { x: 2590, y: 310, pulse: true };
  if (key === "moving_passage:passage_outlet" && py < 1390)
    return { x: 3020, y: 1520, pulse: false };
  if (key === "flow_rearrangement:high_window" && py > 500) return { x: 4610, y: 310, pulse: true };
  if (key === "flow_rearrangement:return_basin" && py > 1660)
    return { x: 3600, y: 1520, pulse: true };
  if (key === "flow_rearrangement:changed_rim" && py > 1600)
    return { x: 4600, y: 1470, pulse: true };
  if (key === "flow_rearrangement:rearranged_outlet" && py > 510)
    return { x: px > 3780 ? 3600 : 3640, y: 310, pulse: true };
  if (key === "hre_docking:lower_approach" && py < 1320) return { x: 6620, y: 1450, pulse: false };
  if (key === "hre_docking:matching_approach" && px < 6900)
    return py < 1100 ? { x: 6620, y: 1450, pulse: false } : { x: 7220, y: 830, pulse: false };
  return dnaTargets[key];
}

for (const [key, target] of Object.entries(dnaTargets)) {
  if (key === "destination") continue;
  const [encounter, step] = key.split(":");
  const id = `dna-${encounter}`;
  routes[id] ??= {};
  routes[id][step] = {
    ...target,
    resolve: (value) => dnaLeg(key, Number(value.playerX) + 15, Number(value.playerY) + 15),
  };
}

const cytoplasmTargets = {
  "motor_delivery:boarding_loft": [480, 330, true],
  "motor_delivery:motor_capture": [480, 330, true],
  "motor_delivery:motor_delivery": [480, 330, true],
  "motor_delivery:motor_outlet": [1990, 300, true],
  "mitochondrial_rebound:mitochondrial_rebound": [2780, 1360, true],
  "mitochondrial_rebound:spiral_loft": [2610, 300, true],
  "mitochondrial_rebound:far_side": [3790, 1300, false],
  "mitochondrial_rebound:mito_outlet": [4070, 1400, true],
  "er_transfer:first_mouth": [4350, 500, true],
  "er_transfer:first_capture": [4350, 500, true],
  "er_transfer:first_delivery": [4350, 500, true],
  "er_transfer:junction_contact": [5760, 360, true],
  "er_transfer:second_mouth": [4350, 1480, false],
  "er_transfer:second_capture": [4350, 1480, true],
  "er_transfer:second_delivery": [4350, 1480, true],
  "countercurrent_relay:lower_headwind": [7580, 1440, true],
  "countercurrent_relay:upper_headwind": [6480, 300, true],
  "countercurrent_relay:relay_capture": [6480, 300, true],
  "countercurrent_relay:relay_delivery": [6480, 300, true],
  "crowded_transfer:first_bay": [8450, 500, true],
  "crowded_transfer:first_capture": [8450, 500, true],
  "crowded_transfer:first_delivery": [8450, 500, true],
  "crowded_transfer:crowd_deflection": [9580, 1260, true],
  "crowded_transfer:second_bay": [8330, 1500, false],
  "crowded_transfer:second_capture": [8330, 1500, true],
  "crowded_transfer:second_delivery": [8330, 1500, true],
};
function cytoplasmLeg(key, value) {
  const px = Number(value.playerX) + 15,
    py = Number(value.playerY) + 15;
  let [x, y, pulse] = cytoplasmTargets[key];
  if (key === "motor_delivery:boarding_loft" && px < 300 && py > 450) [x, y] = [480, 1250];
  if (key === "motor_delivery:motor_outlet" && py > 450) [x, y] = [1900, 300];
  if (key === "mitochondrial_rebound:mitochondrial_rebound" && py < 1250) {
    [x, y] = [2300, 1400];
    pulse = false;
  }
  if (key === "mitochondrial_rebound:mito_outlet" && px < 3600) {
    [x, y] = [py < 1540 ? 2300 : 3600, 1560];
    pulse = false;
  }
  if (key === "countercurrent_relay:upper_headwind" && py > 580) [x, y] = [7510, 300];
  if (key === "crowded_transfer:second_bay" && py < 1380) {
    [x, y] = [8205, 1500];
    pulse = false;
  }
  return { x, y, pulse };
}
for (const [key, [x, y, pulse]] of Object.entries(cytoplasmTargets)) {
  const [encounter, step] = key.split(":");
  const id = `cytoplasm-${encounter}`;
  routes[id] ??= {};
  routes[id][step] = { x, y, pulse, resolve: (value) => cytoplasmLeg(key, value) };
}

// Continue through the junction before braking. An upward release can pass above contact;
// the next chamber's visible permanent descent then supplies a return from the right.
routes["cytoplasm-er_transfer"].junction_contact = {
  x: 5760,
  y: 360,
  pulse: true,
  via: [
    {
      x: 6210,
      y: 360,
      pulse: false,
      stopWhen: (value) => Number(value.playerX) + 15 >= 6070 && Number(value.playerY) + 15 >= 360,
    },
  ],
};

export function referenceApproach(encounterId, stepId) {
  const approach = routes[encounterId]?.[stepId];
  return approach
    ? {
        authored: true,
        ...approach,
        ...(approach.via ? { via: approach.via.map((leg) => ({ ...leg })) } : {}),
      }
    : undefined;
}

export function referenceDestination(stageId) {
  const target = {
    membrane: { x: 5930, y: 360 },
    cytoplasm: { x: 10110, y: 740 },
    envelope: { x: 5445, y: 350 },
    receptor: { x: 7800, y: 350 },
    dna: dnaTargets.destination,
  }[stageId];
  return target ? { authored: true, ...target } : undefined;
}
