import assert from "node:assert/strict";
import test from "node:test";
import { compileChambers } from "../src/levels/section_specs.ts";
import { phaseAfter, phaseBefore } from "../src/levels/encounter_phases.ts";
import { CAMPAIGN } from "../src/levels.ts";
import { PLAYER_RADIUS } from "../src/constants.ts";
import { circleRectOverlap, circleShapeContact, shapeAt } from "../src/physics.ts";
import { createSimulation } from "../src/simulation.ts";

function loop(id = "loop", placement = { x: 20, y: 30 }) {
  return {
    id,
    kind: "current_loop",
    placement,
    width: 400,
    height: 300,
    objective: "Enter the current",
    required: true,
    completionCheckpoint: { x: 30, y: 245 },
    entrance: { x: 40, y: 100 },
    exit: { x: 330, y: 160 },
    sequence: [
      {
        id: "entry",
        kind: "region",
        region: { x: 50, y: 80, width: 50, height: 50 },
        caption: "Enter current",
      },
    ],
    recovery: { x: 350, y: 0, width: 50, height: 300, acceleration: { x: 0, y: 300 } },
    fields: [
      {
        id: "swirl",
        x: 130,
        y: 50,
        width: 120,
        height: 100,
        acceleration: { x: 120, y: -30 },
        vortex: { center: { x: 185, y: 90 }, strength: 80 },
      },
    ],
    checkpoint: { x: 25, y: 235, width: 70, height: 60, spawn: { x: 30, y: 245 } },
  };
}
const compile = (chambers) => compileChambers("membrane", 1000, 700, chambers);

function detailedChamber() {
  const sequence = [
    {
      id: "entry",
      kind: "region",
      region: { x: 50, y: 80, width: 50, height: 50 },
      caption: "Enter",
    },
    { id: "rebound", kind: "contact", contactId: "round", caption: "Bounce" },
    { id: "capture", kind: "transport_capture", transportId: "cargo", caption: "Board" },
    { id: "delivery", kind: "transport_delivery", transportId: "cargo", caption: "Deliver" },
    { id: "binding", kind: "milestone", milestone: "receptor_bound", caption: "Bind" },
  ];
  return {
    ...loop(),
    obstacles: [
      {
        id: "round",
        shape: { kind: "circle", center: { x: 180, y: 180 }, radius: 15 },
        response: { kind: "rebound", restitution: 1, impulse: { x: 10, y: -40 } },
        motion: { radiusX: 10, radiusY: 8, period: 2, phase: 0.4 },
      },
      {
        id: "capsule",
        shape: { kind: "capsule", start: { x: 240, y: 180 }, end: { x: 280, y: 180 }, radius: 8 },
        response: { kind: "rebound", restitution: 1 },
      },
      {
        id: "sticky",
        shape: { kind: "roundedRect", x: 290, y: 50, width: 35, height: 40, radius: 8 },
        response: { kind: "sticky", duration: 1 },
      },
    ],
    transports: [
      {
        id: "cargo",
        kind: "vesicle",
        path: [
          { x: 120, y: 210 },
          { x: 300, y: 210 },
        ],
        duration: 2,
        wait: 0.3,
        radius: 25,
        releaseVelocity: { x: 60, y: -20 },
        activeWhen: { encounterId: "loop", min: phaseAfter(sequence, "entry") },
      },
    ],
    hazards: [{ id: "acid", kind: "acid", x: 240, y: 255, width: 30, height: 25 }],
    collectibles: [{ id: "fragment", x: 30, y: 20 }],
    decorations: [{ kind: "vesicle", x: 120, y: 160, width: 40, height: 30 }],
    triggers: [
      {
        id: "caption",
        kind: "caption",
        x: 80,
        y: 170,
        width: 30,
        height: 30,
        activeWhen: { encounterId: "loop", min: phaseAfter(sequence, "entry") },
      },
    ],
    optionalBranch: { x: 20, y: 20, width: 50, height: 40 },
    sequence,
  };
}

test("placement translates every position together without changing vectors, motion, or time", () => {
  const authored = detailedChamber();
  const before = structuredClone(authored);
  const result = compile([authored]);
  assert.deepEqual(authored, before);
  assert.deepEqual(result.obstacles[0].shape.center, { x: 200, y: 210 });
  assert.deepEqual(result.obstacles[1].shape.start, { x: 260, y: 210 });
  assert.deepEqual(result.obstacles[1].shape.end, { x: 300, y: 210 });
  assert.equal(result.obstacles[2].shape.x, 310);
  assert.equal(result.obstacles[2].shape.y, 80);
  assert.deepEqual(result.obstacles[0].motion, authored.obstacles[0].motion);
  assert.deepEqual(result.obstacles[0].response, authored.obstacles[0].response);
  assert.deepEqual(result.flowZones[1].vortex.center, { x: 205, y: 120 });
  assert.deepEqual(result.flowZones[1].acceleration, authored.fields[0].acceleration);
  assert.equal(result.flowZones[0].x, 370);
  assert.deepEqual(result.transports[0].path, [
    { x: 140, y: 240 },
    { x: 320, y: 240 },
  ]);
  assert.deepEqual(result.transports[0].releaseVelocity, { x: 60, y: -20 });
  assert.equal(result.transports[0].duration, 2);
  assert.deepEqual(result.transports[0].activeWhen, { encounterId: "membrane-loop", min: 1 });
  assert.deepEqual(result.encounters[0].steps[0].region, { x: 70, y: 110, width: 50, height: 50 });
  assert.equal(result.encounters[0].steps[1].contactId, "membrane-loop-round");
  assert.equal(result.encounters[0].steps[2].transportId, "membrane-loop-cargo");
  assert.equal(result.encounters[0].steps[3].transportId, "membrane-loop-cargo");
  assert.deepEqual(result.encounters[0].steps[4], authored.sequence[4]);
  assert.deepEqual(result.encounters[0].completionCheckpoint.spawn, { x: 50, y: 275 });
  assert.deepEqual(result.checkpoints[0].spawn, { x: 50, y: 275 });
  assert.equal(result.checkpoints[0].x, 45);
  assert.equal(result.hazards[0].x, 260);
  assert.equal(result.collectibles[0].y, 50);
  assert.equal(result.decorations[0].x, 140);
  assert.equal(result.triggers[0].y, 200);
  assert.deepEqual(result.triggers[0].activeWhen, { encounterId: "membrane-loop", min: 1 });
  const moved = compile([{ ...authored, placement: { x: 90, y: 70 } }]);
  assert.deepEqual(moved.obstacles[0].shape.center, { x: 270, y: 250 });
  assert.equal(moved.obstacles[0].id, result.obstacles[0].id);
});

test("inserting and reordering primitives preserves named references", () => {
  const chamber = detailedChamber();
  const original = compile([chamber]);
  const inserted = {
    id: "extra",
    shape: { kind: "circle", center: { x: 90, y: 180 }, radius: 10 },
    response: { kind: "rebound", restitution: 1 },
  };
  const changed = compile([
    { ...chamber, obstacles: [inserted, ...chamber.obstacles.toReversed()] },
  ]);
  assert.deepEqual(changed.encounters, original.encounters);
  assert.deepEqual(
    changed.obstacles.find((item) => item.id === "membrane-loop-round"),
    original.obstacles[0],
  );
});

test("named phase windows follow step insertion and reordering while IDs remain local", () => {
  const chamber = detailedChamber();
  const extra = { ...chamber.sequence[0], id: "detour" };
  const sequences = [
    chamber.sequence,
    [extra, ...chamber.sequence],
    [
      extra,
      chamber.sequence[2],
      chamber.sequence[0],
      chamber.sequence[1],
      ...chamber.sequence.slice(3),
    ],
  ];
  for (const sequence of sequences) {
    const activeWhen = {
      encounterId: "loop",
      min: phaseAfter(sequence, "rebound"),
      max: phaseBefore(sequence, "delivery"),
    };
    const compiled = compile([
      {
        ...chamber,
        sequence,
        fields: [{ ...chamber.fields[0], activeWhen }],
        triggers: [{ ...chamber.triggers[0], activeWhen }],
      },
    ]);
    const encounter = compiled.encounters[0];
    assert.equal(encounter.id, "membrane-loop");
    assert.deepEqual(
      encounter.steps.map((step) => step.id),
      sequence.map((step) => step.id),
    );
    for (const condition of [compiled.flowZones[1].activeWhen, compiled.triggers[0].activeWhen]) {
      assert.equal(condition.encounterId, encounter.id);
      for (let phase = 0; phase <= sequence.length; phase += 1) {
        const completedIds = sequence.slice(0, phase).map((step) => step.id);
        const enabled = phase >= condition.min && phase <= condition.max;
        assert.equal(
          enabled,
          completedIds.includes("rebound") && !completedIds.includes("delivery"),
        );
      }
    }
  }
});

test("phase helpers cover first and last steps and reject unknown named references", () => {
  const { sequence } = detailedChamber();
  assert.equal(phaseBefore(sequence, "entry"), 0);
  assert.equal(phaseAfter(sequence, "binding"), sequence.length);
  assert.throws(() => phaseAfter(sequence, "missing"), /Unknown encounter step reference: missing/);
  assert.throws(
    () => phaseBefore(sequence, "missing"),
    /Unknown encounter step reference: missing/,
  );
});

test("compiler rejects missing, empty, or duplicate encounter step IDs within each encounter", () => {
  const chamber = loop();
  for (const id of [undefined, "", " ", "membrane-loop-entry"]) {
    assert.throws(
      () => compile([{ ...chamber, sequence: [{ ...chamber.sequence[0], id }] }]),
      /loop: invalid or repeated encounter step ID/,
    );
  }
  assert.throws(
    () => compile([{ ...chamber, sequence: [chamber.sequence[0], chamber.sequence[0]] }]),
    /loop: invalid or repeated encounter step ID: entry/,
  );
  assert.doesNotThrow(() => compile([chamber, loop("second", { x: 500, y: 0 })]));
});

test("required order follows chamber sequence rather than world position or optional markers", () => {
  const optional = { ...loop("optional", { x: 500, y: 300 }), required: false };
  delete optional.completionCheckpoint;
  const first = loop("first", { x: 500, y: 0 });
  const last = loop("last", { x: 0, y: 0 });
  const result = compile([first, optional, last]);
  assert.deepEqual(result.requiredEncounterIds, ["membrane-first", "membrane-last"]);
  assert.deepEqual(
    result.encounters.map((item) => item.completionCheckpoint?.order),
    [1, undefined, 2],
  );
  assert.ok(result.checkpoints.every((checkpoint) => checkpoint.order === 0));
});

test("compiler rejects missing or already-namespaced references and duplicated stable names", () => {
  const chamber = detailedChamber();
  assert.throws(() => compile([chamber, chamber]), /repeated chamber/);
  assert.throws(
    () => compile([{ ...chamber, obstacles: [...chamber.obstacles, chamber.obstacles[0]] }]),
    /repeated primitive/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          sequence: [{ id: "contact", kind: "contact", contactId: "missing", caption: "No" }],
        },
      ]),
    /unknown contact/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          sequence: [
            {
              id: "delivery",
              kind: "transport_delivery",
              transportId: "membrane-loop-cargo",
              caption: "No",
            },
          ],
        },
      ]),
    /unknown transport/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          fields: [{ ...chamber.fields[0], activeWhen: { encounterId: "missing", min: 1 } }],
        },
      ]),
    /Unknown encounter/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          fields: [{ ...chamber.fields[0], activeWhen: { encounterId: "loop", min: 8 } }],
        },
      ]),
    /invalid phase/,
  );
  assert.throws(() => compile([{ ...chamber, objective: " " }]), /objective/);
});

test("local positions, fields, and moving obstacle extents stay within truthful chamber bounds", () => {
  const chamber = detailedChamber();
  assert.throws(() => compile([{ ...chamber, placement: { x: 800, y: 0 } }]), /inside the world/);
  assert.throws(
    () => compile([{ ...chamber, fields: [{ ...chamber.fields[0], x: 350 }] }]),
    /field leaves/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          obstacles: [{ ...chamber.obstacles[0], motion: { radiusX: 300, radiusY: 0, period: 2 } }],
        },
      ]),
    /motion leaves/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          sequence: [
            {
              id: "outside",
              kind: "region",
              region: { x: -10, y: 10, width: 20, height: 20 },
              caption: "No",
            },
          ],
        },
      ]),
    /region leaves/,
  );
  assert.throws(
    () => compile([{ ...chamber, recovery: { ...chamber.recovery, y: 60, height: 240 } }]),
    /upper pocket/,
  );
});

test("required completion and optional marker spawns are calm and clear of swept obstacles and hazards", () => {
  const chamber = loop();
  const center = { x: 45, y: 260 };
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          fields: [
            { id: "force", x: 20, y: 240, width: 70, height: 50, acceleration: { x: 100, y: 0 } },
          ],
        },
      ]),
    /spawn must be calm/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          hazards: [{ id: "acid", kind: "acid", x: 30, y: 245, width: 30, height: 30 }],
        },
      ]),
    /spawn overlaps a hazard/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          obstacles: [
            {
              id: "solid",
              shape: { kind: "circle", center, radius: 12 },
              response: { kind: "rebound", restitution: 1 },
            },
          ],
        },
      ]),
    /spawn overlaps an obstacle/,
  );
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          checkpoint: undefined,
          obstacles: [
            {
              id: "moving",
              shape: { kind: "circle", center: { x: 75, y: 260 }, radius: 10 },
              response: { kind: "rebound", restitution: 1 },
              motion: { radiusX: 30, radiusY: 0, period: 1 },
            },
          ],
        },
      ]),
    /spawn overlaps an obstacle/,
  );
  assert.doesNotThrow(() =>
    compile([
      {
        ...chamber,
        checkpoint: undefined,
        fields: [
          {
            id: "drag",
            x: 20,
            y: 240,
            width: 70,
            height: 50,
            acceleration: { x: 0, y: 0 },
            drag: 6,
          },
          {
            id: "past",
            x: 20,
            y: 240,
            width: 70,
            height: 50,
            acceleration: { x: 100, y: 0 },
            activeWhen: { encounterId: "loop", max: 0 },
          },
        ],
      },
    ]),
  );
});

test("transport paths cannot carry a player through static solids", () => {
  const chamber = detailedChamber();
  assert.throws(
    () =>
      compile([
        {
          ...chamber,
          obstacles: [
            ...chamber.obstacles,
            {
              id: "blocked",
              shape: { kind: "circle", center: { x: 220, y: 210 }, radius: 15 },
              response: { kind: "rebound", restitution: 1 },
            },
          ],
        },
      ]),
    /transport path overlaps an obstacle/,
  );
});

test("campaign has ordered required encounters, explicit milestones, and biological destinations", () => {
  assert.deepEqual(
    CAMPAIGN.map((level) => level.id),
    ["membrane", "cytoplasm", "envelope", "receptor", "dna", "transcription"],
  );
  const traversal = CAMPAIGN.filter((level) => level.id !== "transcription");
  for (const level of traversal) {
    assert.ok(level.destination);
    assert.ok(level.requiredEncounterIds.length > 0);
    assert.equal(new Set(level.requiredEncounterIds).size, level.requiredEncounterIds.length);
    for (const [index, id] of level.requiredEncounterIds.entries()) {
      const encounter = level.encounters.find((item) => item.id === id);
      assert.ok(encounter?.completionCheckpoint, `${id} has a completion save`);
      assert.equal(encounter.completionCheckpoint.order, index + 1);
      assert.ok(encounter.objective.trim());
    }
    assert.ok(
      level.flowZones.some(
        (field) => field.acceleration.y > 0 && field.y === 0 && field.height === level.height,
      ),
    );
  }
  assert.deepEqual(
    traversal.map((level) => level.destination.motif),
    ["vesicle", "nucleus", "receptor", "chromatin", "gene"],
  );
  for (const [stageId, milestone, triggerKind] of [
    ["receptor", "receptor_bound", "receptor"],
    ["dna", "hre_bound", "hre"],
  ]) {
    const level = CAMPAIGN.find((item) => item.id === stageId);
    const encounter = level.encounters.find((item) =>
      item.steps.some((step) => step.kind === "milestone" && step.milestone === milestone),
    );
    assert.ok(encounter && level.requiredEncounterIds.includes(encounter.id));
    const milestonePhase = encounter.steps.findIndex(
      (step) => step.kind === "milestone" && step.milestone === milestone,
    );
    const trigger = level.triggers.find((item) => item.kind === triggerKind);
    assert.ok(trigger);
    const sim = createSimulation([level], () => {});
    const input = {
      left: false,
      right: false,
      up: false,
      down: false,
      pulsePressed: false,
      pulseHeld: false,
    };
    sim.start();
    if (stageId === "dna") sim.state.receptorBound = true;
    const bindingKey = stageId === "receptor" ? "receptorBound" : "hreBound";
    const position = {
      x: trigger.x + trigger.width / 2 - PLAYER_RADIUS,
      y: trigger.y + trigger.height / 2 - PLAYER_RADIUS,
      vx: 0,
      vy: 0,
    };
    Object.assign(sim.state.player, position);
    sim.step(input, 1 / 120);
    assert.equal(sim.state[bindingKey], false, "early biological contact cannot bypass the route");

    // Unit setup isolates the authored trigger's guard; this is not traversal evidence.
    for (const id of level.requiredEncounterIds) {
      if (id === encounter.id) break;
      const prior = level.encounters.find((item) => item.id === id);
      sim.state.encounterPhases.set(id, prior.steps.length);
    }
    sim.state.encounterPhases.set(encounter.id, milestonePhase);
    Object.assign(sim.state.player, position);
    sim.step(input, 1 / 120);
    assert.equal(sim.state[bindingKey], true, "the current biological milestone can bind");
    assert.equal(sim.state.encounterPhases.get(encounter.id), milestonePhase + 1);
    if (milestonePhase + 1 === encounter.steps.length) {
      assert.equal(sim.state.checkpoint.id, encounter.completionCheckpoint.id);
    }
  }
  const transcription = CAMPAIGN.find((level) => level.id === "transcription");
  assert.equal(transcription.destination, undefined);
  assert.deepEqual(transcription.requiredEncounterIds, []);
});

test("the required pore crossing finishes with an always-clear player corridor", () => {
  const envelope = CAMPAIGN.find((level) => level.id === "envelope");
  const crossing = envelope.encounters.find((encounter) =>
    encounter.steps.some((step) => step.id === "pore_crossing"),
  );
  assert.ok(crossing && envelope.requiredEncounterIds.includes(crossing.id));
  const mouth = crossing.steps.find((step) => step.id === "pore_mouth");
  const crossed = crossing.steps.find((step) => step.id === "pore_crossing");
  assert.equal(mouth?.kind, "region");
  assert.equal(crossed?.kind, "region");
  assert.ok(crossing.steps.indexOf(mouth) < crossing.steps.indexOf(crossed));
  assert.equal(crossing.steps.at(-1), crossed, "successful crossing immediately saves progress");

  const top = Math.max(mouth.region.y, crossed.region.y);
  const bottom = Math.min(
    mouth.region.y + mouth.region.height,
    crossed.region.y + crossed.region.height,
  );
  assert.ok(bottom - top > PLAYER_RADIUS * 2);
  const y = (top + bottom) / 2;
  const startX = mouth.region.x + mouth.region.width / 2;
  const endX = crossed.region.x + crossed.region.width / 2;
  assert.ok(endX > startX);
  const intervals = Math.ceil((endX - startX) / PLAYER_RADIUS);
  const spacing = (endX - startX) / intervals;
  // Inflated samples cover the continuous corridor and every moving obstacle orbit.
  const motionSamples = 24;
  for (let index = 0; index <= intervals; index += 1) {
    const center = { x: startX + index * spacing, y };
    const clearance = PLAYER_RADIUS + spacing / 2;
    for (const hazard of envelope.hazards) {
      assert.equal(circleRectOverlap(center, clearance, hazard), false, hazard.id);
    }
    for (const obstacle of envelope.obstacles) {
      const motion = obstacle.motion;
      const sweep = motion
        ? (Math.PI * Math.max(motion.radiusX, motion.radiusY)) / motionSamples
        : 0;
      for (let sample = 0; sample <= (motion ? motionSamples : 0); sample += 1) {
        const time = motion ? (motion.period * sample) / motionSamples : 0;
        assert.equal(
          Boolean(circleShapeContact(center, clearance + sweep, shapeAt(obstacle, time))),
          false,
          `${obstacle.id} never closes the pore`,
        );
      }
    }
  }
});
