import assert from "node:assert/strict";
import test from "node:test";

import { createSimulation } from "../src/simulation.ts";
import { getEncounterProgress } from "../src/progression.ts";

const dt = 1 / 120;
const idle = {
  left: false,
  right: false,
  up: false,
  down: false,
  pulsePressed: false,
  pulseHeld: false,
};
function level(changes = {}) {
  return {
    id: "membrane",
    name: "Test chamber",
    objective: "Move",
    caption: "",
    width: 1400,
    height: 900,
    spawn: { x: 200, y: 300 },
    palette: { background: "#000", foreground: "#fff", accent: "#f00" },
    obstacles: [],
    flowZones: [],
    transports: [],
    encounters: [],
    requiredEncounterIds: [],
    destination: undefined,
    hazards: [],
    checkpoints: [],
    collectibles: [],
    triggers: [],
    decorations: [],
    ...changes,
  };
}
function started(definition, events = []) {
  const sim = createSimulation([definition], (event) => events.push(event));
  sim.start();
  return sim;
}
function advance(sim, seconds, input = idle) {
  for (let elapsed = 0; elapsed < seconds; elapsed += dt) sim.step(input, dt);
}
function center(sim) {
  return { x: sim.state.player.x + 15, y: sim.state.player.y + 15 };
}

test("fluid controller accelerates, coasts, brakes, and has no gravity", () => {
  const sim = started(level());
  advance(sim, 0.4, { ...idle, right: true });
  const propelled = sim.state.player.vx;
  assert.ok(propelled > 0);
  advance(sim, 0.1);
  assert.ok(sim.state.player.vx > 0 && sim.state.player.vx < propelled);
  advance(sim, 0.5, { ...idle, left: true });
  assert.ok(sim.state.player.vx < 0);
  assert.equal(sim.state.player.y, 300);
});

test("a pressed pulse is singular while held thrust remains continuous", () => {
  const events = [];
  const sim = started(level(), events);
  sim.step({ ...idle, pulsePressed: true, pulseHeld: true }, dt);
  const coasting = started(level());
  coasting.step({ ...idle, pulsePressed: true }, dt);
  advance(sim, 0.2, { ...idle, pulseHeld: true });
  advance(coasting, 0.2);
  assert.equal(events.filter((event) => event.type === "pulse").length, 1);
  assert.ok(sim.state.player.vy < coasting.state.player.vy);
});

test("phase-gated downward current persists after retry and completion checkpoints never regress", () => {
  const sim = started(
    level({
      flowZones: [
        {
          id: "down",
          x: 150,
          y: 250,
          width: 300,
          height: 200,
          acceleration: { x: 0, y: 900 },
          activeWhen: { encounterId: "route", min: 1 },
        },
      ],
      encounters: [
        {
          id: "route",
          objective: "Reach the changed current",
          completionCheckpoint: { id: "route-complete", order: 1, spawn: { x: 190, y: 290 } },
          steps: [
            {
              id: "entry",
              kind: "region",
              region: { x: 180, y: 280, width: 80, height: 80 },
              caption: "route changed",
            },
          ],
        },
      ],
      requiredEncounterIds: ["route"],
      checkpoints: [
        { id: "later", x: 180, y: 280, width: 70, height: 70, order: 2, spawn: { x: 190, y: 290 } },
        {
          id: "earlier",
          x: 350,
          y: 280,
          width: 70,
          height: 70,
          order: 1,
          spawn: { x: 360, y: 290 },
        },
      ],
    }),
  );
  sim.step(idle, dt);
  assert.equal(sim.state.encounterPhases.get("route"), 1);
  assert.equal(sim.state.checkpoint.id, "route-complete");
  sim.step(idle, dt);
  assert.ok(sim.state.player.vy > 0);
  sim.retry();
  sim.step(idle, dt);
  assert.ok(sim.state.player.vy > 0);
  sim.state.player.x = 360;
  sim.state.player.y = 300;
  sim.step(idle, dt);
  assert.equal(sim.state.checkpoint.id, "route-complete");
});

test("rounded boundary contacts redirect from left, right, top, and bottom", () => {
  const obstacle = {
    id: "round",
    shape: { kind: "roundedRect", x: 500, y: 350, width: 160, height: 160, radius: 30 },
    response: { kind: "rebound", restitution: 0.8 },
  };
  const cases = [
    { x: 470, y: 415, vx: 500, vy: 0, axis: "vx", sign: -1 },
    { x: 675, y: 415, vx: -500, vy: 0, axis: "vx", sign: 1 },
    { x: 565, y: 320, vx: 0, vy: 500, axis: "vy", sign: -1 },
    { x: 565, y: 525, vx: 0, vy: -500, axis: "vy", sign: 1 },
  ];
  for (const specimen of cases) {
    const sim = started(level({ obstacles: [obstacle] }));
    Object.assign(sim.state.player, specimen);
    sim.step(idle, 0.04);
    assert.ok(
      sim.state.player[specimen.axis] * specimen.sign > 0,
      `${specimen.axis} redirects on this rounded boundary side`,
    );
  }
});

test("a max-speed circle cannot tunnel through a capsule or moving organelle", () => {
  const capsule = {
    id: "capsule",
    shape: { kind: "capsule", start: { x: 550, y: 300 }, end: { x: 550, y: 600 }, radius: 30 },
    response: { kind: "rebound", restitution: 0.8 },
  };
  const sim = started(level({ obstacles: [capsule] }));
  Object.assign(sim.state.player, { x: 480, y: 400, vx: 720 });
  sim.step(idle, 0.05);
  assert.ok(sim.state.player.vx < 0);
  assert.ok(center(sim).x < 520);
  const moving = started(
    level({
      obstacles: [{ ...capsule, id: "moving", motion: { radiusX: 45, radiusY: 0, period: 2 } }],
    }),
  );
  Object.assign(moving.state.player, { x: 520, y: 400, vx: 720 });
  moving.step(idle, 0.05);
  assert.ok(moving.state.player.vx < 0);

  const swept = started(
    level({
      obstacles: [
        {
          id: "fast-moving",
          shape: { kind: "circle", center: { x: 315, y: 315 }, radius: 30 },
          response: { kind: "rebound", restitution: 0.8 },
          motion: { radiusX: 60, radiusY: 0, period: 0.1, phase: 0.5 },
        },
      ],
    }),
  );
  Object.assign(swept.state.player, { x: 300, y: 300, vx: 0, vy: 0 });
  swept.step(idle, 0.05);
  assert.ok(
    center(swept).x > 400,
    "a fast organelle crossing a stationary steroid is sampled between frame endpoints",
  );
});

test("authored moving obstacles must fit the bounded collision budget", () => {
  assert.throws(
    () =>
      started(
        level({
          obstacles: [
            {
              id: "too-fast",
              shape: { kind: "circle", center: { x: 315, y: 315 }, radius: 30 },
              response: { kind: "rebound", restitution: 0.8 },
              motion: { radiusX: 80, radiusY: 0, period: 0.1 },
            },
          ],
        }),
      ),
    /moving-collision budget/,
  );
});

test("channels release at their authored endpoint and manual breaks find a safe position", () => {
  const sim = started(
    level({
      checkpoints: [
        { id: "calm", x: 80, y: 80, width: 90, height: 80, order: 1, spawn: { x: 100, y: 100 } },
      ],
      transports: [
        {
          id: "channel",
          kind: "channel",
          path: [
            { x: 215, y: 315 },
            { x: 455, y: 315 },
          ],
          duration: 0.08,
          radius: 35,
          wait: 0,
          releaseVelocity: { x: 0, y: 0 },
        },
      ],
    }),
  );
  Object.assign(sim.state.player, { x: 100, y: 100 });
  sim.step(idle, dt);
  assert.equal(sim.state.checkpoint.id, "calm");
  Object.assign(sim.state.player, { x: 200, y: 300, vx: 0, vy: 0 });
  sim.state.levelTime = 0.6;
  sim.step(idle, dt);
  assert.equal(sim.state.player.attachment?.id, "channel");
  assert.equal(sim.state.player.attachment?.progress, 0);
  const transportStart = center(sim);
  sim.step(idle, dt);
  assert.ok(
    Math.hypot(center(sim).x - transportStart.x, center(sim).y - transportStart.y) <=
      720 * dt + 0.01,
    "transported motion respects the shared speed cap",
  );
  let releasedAtEndpoint = false;
  for (let step = 0; step < 100; step += 1) {
    const attached = Boolean(sim.state.player.attachment);
    sim.step(idle, dt);
    if (attached && !sim.state.player.attachment) {
      assert.deepEqual(center(sim), { x: 455, y: 315 });
      releasedAtEndpoint = true;
      break;
    }
  }
  assert.equal(releasedAtEndpoint, true, "the capped route still reaches its authored endpoint");

  const manual = started(
    level({
      obstacles: [
        {
          id: "blocked-exit",
          shape: { kind: "circle", center: { x: 500, y: 400 }, radius: 180 },
          response: { kind: "rebound", restitution: 0.7 },
        },
      ],
      transports: [
        {
          id: "channel",
          kind: "channel",
          path: [
            { x: 215, y: 315 },
            { x: 500, y: 400 },
          ],
          duration: 0.08,
          radius: 35,
          wait: 0,
          releaseVelocity: { x: 20, y: 0 },
        },
      ],
    }),
  );
  Object.assign(manual.state.player, { x: 200, y: 300, vx: 0, vy: 0 });
  manual.step(idle, dt);
  assert.equal(manual.state.player.attachment?.id, "channel");
  Object.assign(manual.state.player, { x: 485, y: 385 });
  manual.step({ ...idle, pulsePressed: true }, dt);
  assert.equal(manual.state.player.attachment, undefined);
  assert.ok(
    Math.hypot(center(manual).x - 500, center(manual).y - 400) > 195,
    "manual release searches away from a newly closed route",
  );
});

test("sticky capture separates during cooldown and can be escaped by pulse or hold", () => {
  const obstacle = {
    id: "sticky",
    shape: { kind: "circle", center: { x: 215, y: 315 }, radius: 35 },
    response: { kind: "sticky", duration: 1 },
  };
  const sim = started(level({ obstacles: [obstacle] }));
  sim.step(idle, dt);
  assert.equal(sim.state.player.attachment?.id, "sticky");
  sim.step({ ...idle, pulsePressed: true }, dt);
  assert.equal(sim.state.player.attachment, undefined);
  Object.assign(sim.state.player, { x: 200, y: 300 });
  sim.step(idle, dt);
  assert.equal(sim.state.player.attachment, undefined);
  assert.notDeepEqual(center(sim), obstacle.shape.center);
  const held = started(level({ obstacles: [obstacle] }));
  held.step(idle, dt);
  advance(held, 0.4, { ...idle, pulseHeld: true });
  assert.equal(held.state.player.attachment, undefined);
  const automatic = started(level({ obstacles: [obstacle] }));
  automatic.step(idle, dt);
  advance(automatic, 1.5);
  assert.equal(automatic.state.player.attachment, undefined);
  assert.ok(
    Math.hypot(center(automatic).x - 215, center(automatic).y - 315) > 60,
    "automatic release drifts away from the adhesive surface",
  );
});

test("acid death resets motion while preserving collection, binding, and authored checkpoint", () => {
  const sim = started(
    level({
      collectibles: [{ id: "fragment", x: 215, y: 315 }],
      hazards: [{ id: "acid", kind: "acid", x: 400, y: 300, width: 70, height: 70 }],
      encounters: [
        {
          id: "binding",
          objective: "Bind receptor",
          steps: [{ id: "binding", kind: "milestone", milestone: "receptor_bound", caption: "" }],
          completionCheckpoint: { id: "binding-complete", order: 1, spawn: { x: 100, y: 100 } },
        },
      ],
      requiredEncounterIds: ["binding"],
      triggers: [
        {
          id: "receptor",
          kind: "receptor",
          x: 190,
          y: 290,
          width: 70,
          height: 70,
        },
      ],
    }),
  );
  sim.step(idle, dt);
  assert.equal(sim.state.receptorBound, true);
  assert.deepEqual(sim.state.checkpoint.spawn, { x: 100, y: 100 });
  Object.assign(sim.state.player, { x: 400, y: 315 });
  sim.step(idle, dt);
  assert.equal(sim.state.phase, "respawning");
  advance(sim, 0.5);
  assert.equal(sim.state.phase, "playing");
  assert.deepEqual({ x: sim.state.player.x, y: sim.state.player.y }, { x: 100, y: 100 });
  assert.ok(sim.state.collectedIds.has("fragment"));
  assert.equal(sim.state.receptorBound, true);
});

test("receptor, HRE, and recruitment retain causal order through pause and retry", () => {
  const triggers = [
    {
      id: "receptor",
      kind: "receptor",
      x: 190,
      y: 290,
      width: 70,
      height: 70,
    },
    { id: "hre", kind: "hre", x: 400, y: 290, width: 70, height: 70 },
    { id: "dock", kind: "transcription", x: 600, y: 290, width: 70, height: 70 },
  ];
  const blocked = started(level({ triggers: triggers.slice(1) }));
  Object.assign(blocked.state.player, { x: 400, y: 300 });
  blocked.step(idle, dt);
  assert.equal(blocked.state.hreBound, false);
  const sim = started(level({ triggers }));
  sim.step(idle, dt);
  assert.equal(sim.state.receptorBound, true);
  Object.assign(sim.state.player, { x: 400, y: 300 });
  sim.step(idle, dt);
  assert.equal(sim.state.hreBound, true);
  Object.assign(sim.state.player, { x: 600, y: 300 });
  sim.step(idle, dt);
  assert.equal(sim.state.phase, "recruiting");
  sim.state.recruitmentClock = 0.5;
  sim.step({ ...idle, pulsePressed: true, pulseHeld: true }, dt);
  assert.equal(sim.state.recruitmentCount, 1);
  advance(sim, 0.5, { ...idle, pulseHeld: true });
  assert.equal(sim.state.recruitmentCount, 1);
  sim.pause();
  const elapsed = sim.state.elapsed;
  advance(sim, 0.2);
  assert.equal(sim.state.elapsed, elapsed);
  sim.retry();
  assert.equal(sim.state.phase, "recruiting");
  assert.equal(sim.state.recruitmentCount, 1);
});

function requiredEncounter(id, steps, order, spawn = { x: 100, y: 100 }) {
  return {
    id,
    objective: `Complete ${id}`,
    steps,
    completionCheckpoint: { id: `${id}-complete`, order, spawn },
  };
}
function region(x, y = 300) {
  return { id: "entry", kind: "region", region: { x, y, width: 70, height: 70 }, caption: "" };
}
function place(sim, x, y = 300) {
  Object.assign(sim.state.player, { x, y, vx: 0, vy: 0 });
}

test("gentle arrows add to fields and Space, cancel opposites, and never pulse", () => {
  const up = started(level());
  const down = started(level());
  const held = started(level());
  const events = [];
  const combined = started(level(), events);
  advance(up, 0.3, { ...idle, up: true });
  advance(down, 0.3, { ...idle, down: true });
  advance(held, 0.3, { ...idle, pulseHeld: true });
  advance(combined, 0.3, { ...idle, up: true, pulseHeld: true });
  assert.ok(up.state.player.vy < 0 && down.state.player.vy > 0);
  assert.ok(Math.abs(up.state.player.vy) < Math.abs(held.state.player.vy));
  assert.ok(combined.state.player.vy < held.state.player.vy);
  assert.equal(events.filter((event) => event.type === "pulse").length, 0);
  const cancelled = started(level());
  const space = started(level());
  cancelled.step({ ...idle, up: true, down: true, pulsePressed: true, pulseHeld: true }, dt);
  space.step({ ...idle, pulsePressed: true, pulseHeld: true }, dt);
  assert.deepEqual(cancelled.state.player, space.state.player);
  const field = {
    id: "flow",
    x: 0,
    y: 0,
    width: 1400,
    height: 900,
    acceleration: { x: 0, y: 100 },
  };
  const flow = started(level({ flowZones: [field] }));
  const adjusted = started(level({ flowZones: [field] }));
  flow.step(idle, dt);
  adjusted.step({ ...idle, up: true }, dt);
  assert.ok(adjusted.state.player.vy > 0 && adjusted.state.player.vy < flow.state.player.vy);
});

test("gentle arrows neither detach sticky riders nor submit recruitment", () => {
  const sim = started(
    level({
      obstacles: [
        {
          id: "sticky",
          shape: { kind: "circle", center: { x: 215, y: 315 }, radius: 35 },
          response: { kind: "sticky", duration: 1 },
        },
      ],
    }),
  );
  sim.step(idle, dt);
  advance(sim, 0.4, { ...idle, up: true, down: true });
  assert.equal(sim.state.player.attachment?.id, "sticky");
  const recruiting = started(
    level({
      triggers: [
        {
          id: "dock",
          kind: "transcription",
          x: 200,
          y: 300,
          width: 70,
          height: 70,
        },
      ],
    }),
  );
  recruiting.state.receptorBound = true;
  recruiting.state.hreBound = true;
  recruiting.step(idle, dt);
  advance(recruiting, 1, { ...idle, up: true });
  assert.equal(recruiting.state.phase, "recruiting");
  assert.equal(recruiting.state.recruitmentCount, 0);
});

test("required ordering rejects bypasses while optional progress remains independent", () => {
  const definition = level({
    encounters: [
      requiredEncounter("first", [region(200)], 1),
      requiredEncounter("second", [region(500)], 2),
      {
        id: "optional",
        objective: "Explore",
        steps: [region(500)],
        completionCheckpoint: { id: "optional-complete", order: 99, spawn: { x: 500, y: 300 } },
      },
    ],
    requiredEncounterIds: ["first", "second"],
    destination: {
      id: "vesicle",
      center: { x: 1000, y: 315 },
      radius: 40,
      motif: "vesicle",
      label: "Ride onward",
    },
    collectibles: [{ id: "fragment", x: 515, y: 315 }],
    checkpoints: [
      {
        id: "shortcut",
        x: 480,
        y: 280,
        width: 90,
        height: 90,
        order: 99,
        spawn: { x: 500, y: 300 },
      },
    ],
  });
  const events = [];
  const sim = createSimulation([definition, level({ id: "cytoplasm" })], (event) =>
    events.push(event),
  );
  sim.start();
  place(sim, 500);
  sim.step(idle, dt);
  assert.equal(sim.state.encounterPhases.get("second"), undefined);
  assert.equal(sim.state.encounterPhases.get("optional"), 1);
  assert.equal(sim.state.collectedIds.has("fragment"), true);
  assert.equal(sim.state.checkpoint.order, 0, "optional marker cannot outrank a completion");
  sim.step(idle, dt);
  assert.equal(events.filter((event) => event.type === "checkpoint").length, 1);
  place(sim, 985);
  sim.step(idle, dt);
  assert.equal(sim.state.phase, "playing");
  assert.ok(center(sim).x < 945, "early destination contact redirects outward");
  assert.equal(events.at(-1).text, "Complete first");
  place(sim, 200);
  sim.step(idle, dt);
  assert.equal(sim.state.checkpoint.id, "first-complete");
  assert.equal(getEncounterProgress(definition, sim.state.encounterPhases).current.id, "second");
  place(sim, 500);
  sim.step(idle, dt);
  assert.equal(sim.state.checkpoint.id, "second-complete");
  assert.equal(getEncounterProgress(definition, sim.state.encounterPhases).ready, true);
  assert.equal(events.filter((event) => event.type === "destination-ready").length, 1);
  sim.retry();
  place(sim, 200);
  sim.step(idle, dt);
  assert.equal(sim.state.checkpoint.id, "second-complete");
  sim.replay();
  assert.equal(sim.state.encounterPhases.size, 0);
  assert.equal(sim.state.collectedIds.size, 0);
  assert.equal(sim.state.checkpoint.order, 0);
});

test("pending transport delivery survives manual escape and retry until a genuine endpoint", () => {
  const ride = {
    id: "ride",
    kind: "channel",
    path: [
      { x: 215, y: 315 },
      { x: 455, y: 315 },
    ],
    duration: 0.5,
    radius: 35,
    wait: 0,
    releaseVelocity: { x: 0, y: 0 },
  };
  const encounter = requiredEncounter(
    "delivery",
    [
      { id: "capture", kind: "transport_capture", transportId: "ride", caption: "Captured" },
      { id: "delivery", kind: "transport_delivery", transportId: "ride", caption: "Delivered" },
    ],
    1,
  );
  const events = [];
  const sim = started(
    level({ transports: [ride], encounters: [encounter], requiredEncounterIds: ["delivery"] }),
    events,
  );
  sim.step(idle, dt);
  assert.equal(sim.state.encounterPhases.get("delivery"), 1);
  sim.step({ ...idle, pulsePressed: true }, dt);
  assert.equal(sim.state.player.attachment, undefined);
  assert.equal(sim.state.encounterPhases.get("delivery"), 1);
  sim.retry();
  assert.equal(sim.state.encounterPhases.get("delivery"), 1);
  sim.step(idle, dt);
  assert.equal(sim.state.player.attachment?.id, "ride");
  advance(sim, 0.1, { ...idle, up: true, down: true });
  assert.equal(sim.state.player.attachment?.id, "ride");
  for (let step = 0; step < 120 && sim.state.player.attachment; step += 1) sim.step(idle, dt);
  assert.deepEqual(center(sim), ride.path.at(-1));
  assert.equal(sim.state.encounterPhases.get("delivery"), 2);
  assert.equal(sim.state.checkpoint.id, "delivery-complete");
  assert.equal(events.filter((event) => event.type === "checkpoint").length, 1);
  const blocked = started(
    level({
      transports: [ride],
      encounters: [encounter],
      requiredEncounterIds: ["delivery"],
      obstacles: [
        {
          id: "block",
          shape: { kind: "circle", center: { x: 360, y: 315 }, radius: 40 },
          response: { kind: "rebound", restitution: 0.8 },
        },
      ],
    }),
  );
  blocked.step(idle, dt);
  for (let step = 0; step < 120 && blocked.state.player.attachment; step += 1)
    blocked.step(idle, dt);
  assert.equal(blocked.state.player.attachment, undefined);
  assert.equal(
    blocked.state.encounterPhases.get("delivery"),
    1,
    "collision release is not delivery",
  );
});

test("biological triggers reject contact before their required milestone step", () => {
  const definition = level({
    encounters: [
      requiredEncounter("approach", [region(400)], 1),
      requiredEncounter(
        "binding",
        [{ id: "binding", kind: "milestone", milestone: "receptor_bound", caption: "" }],
        2,
      ),
      requiredEncounter(
        "recognition",
        [{ id: "docking", kind: "milestone", milestone: "hre_bound", caption: "" }],
        3,
      ),
    ],
    requiredEncounterIds: ["approach", "binding", "recognition"],
    triggers: [
      { id: "receptor", kind: "receptor", x: 200, y: 300, width: 70, height: 70 },
      { id: "hre", kind: "hre", x: 600, y: 300, width: 70, height: 70 },
    ],
  });
  const sim = started(definition);
  sim.step(idle, dt);
  assert.equal(sim.state.receptorBound, false);
  place(sim, 600);
  sim.step(idle, dt);
  assert.equal(sim.state.hreBound, false);
  place(sim, 400);
  sim.step(idle, dt);
  place(sim, 200);
  sim.step(idle, dt);
  assert.equal(sim.state.receptorBound, true);
  assert.equal(sim.state.encounterPhases.get("binding"), 1);
  place(sim, 600);
  sim.step(idle, dt);
  assert.equal(sim.state.hreBound, true);
  sim.retry();
  assert.equal(sim.state.receptorBound, true);
  assert.equal(sim.state.hreBound, true);
  sim.replay();
  assert.equal(sim.state.receptorBound, false);
  assert.equal(sim.state.hreBound, false);
});

test("destination capture freezes, pause preserves transition, retry cancels, and commitment is singular", () => {
  const destination = {
    id: "vesicle",
    center: { x: 215, y: 315 },
    radius: 40,
    motif: "vesicle",
    label: "Ride onward",
  };
  const definition = level({
    encounters: [requiredEncounter("ready", [region(200)], 1)],
    requiredEncounterIds: ["ready"],
    destination,
  });
  const events = [];
  const sim = createSimulation([definition, level({ id: "cytoplasm" })], (event) =>
    events.push(event),
  );
  sim.start();
  sim.step(idle, dt);
  assert.equal(sim.state.phase, "transition");
  assert.deepEqual(center(sim), destination.center);
  assert.equal(events.filter((event) => event.type === "transition-start").length, 1);
  const initialTransition = sim.state.transition;
  sim.step({ ...idle, right: true, pulsePressed: true }, dt);
  assert.notEqual(sim.state.transition, initialTransition);
  assert.equal(initialTransition.elapsed, 0, "published transition snapshots remain immutable");
  assert.deepEqual(center(sim), destination.center);
  const frozen = sim.state.transition;
  sim.pause();
  assert.equal(sim.state.previousPhase, "transition");
  advance(sim, 0.5);
  assert.equal(sim.state.transition, frozen);
  sim.resume();
  sim.step(idle, dt);
  assert.ok(sim.state.transition.elapsed > frozen.elapsed);
  sim.pause();
  sim.retry();
  assert.equal(sim.state.phase, "playing");
  assert.equal(sim.state.transition, undefined);
  assert.deepEqual({ x: sim.state.player.x, y: sim.state.player.y }, { x: 100, y: 100 });
  assert.equal(sim.state.encounterPhases.get("ready"), 1);
  place(sim, 200);
  sim.step(idle, dt);
  advance(sim, 0.4);
  assert.equal(sim.state.levelIndex, 0);
  advance(sim, 0.7);
  assert.equal(sim.state.levelIndex, 1);
  assert.equal(sim.state.transition, undefined);
  advance(sim, 2);
  assert.equal(
    events.filter((event) => event.type === "stage" && event.levelIndex === 1).length,
    1,
  );
  assert.equal(events.filter((event) => event.type === "pulse").length, 0);
});

test("biological destination guards remain authoritative without required encounter metadata", () => {
  const destination = {
    id: "onward",
    center: { x: 215, y: 315 },
    radius: 40,
    motif: "gene",
    label: "Continue",
  };
  const triggers = [
    { id: "receptor", kind: "receptor", x: 500, y: 300, width: 70, height: 70 },
    { id: "hre", kind: "hre", x: 700, y: 300, width: 70, height: 70 },
  ];
  for (const target of ["dna", "transcription"]) {
    const sim = createSimulation(
      [level({ destination, triggers }), level({ id: target })],
      () => {},
    );
    sim.start();
    sim.step(idle, dt);
    assert.equal(sim.state.phase, "playing");
    place(sim, 500);
    sim.step(idle, dt);
    place(sim, 200);
    sim.step(idle, dt);
    assert.equal(sim.state.phase, target === "dna" ? "transition" : "playing");
    if (target === "transcription") {
      place(sim, 700);
      sim.step(idle, dt);
      place(sim, 200);
      sim.step(idle, dt);
      assert.equal(sim.state.phase, "transition");
    }
  }
});
