import assert from "node:assert/strict";
import test from "node:test";

import { createSimulation } from "../src/simulation.ts";

const dt = 1 / 120;
const idle = { left: false, right: false, pulsePressed: false, pulseHeld: false };
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

test("phase-gated downward current persists after retry and checkpoints never regress", () => {
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
          steps: [{ region: { x: 180, y: 280, width: 80, height: 80 }, caption: "route changed" }],
        },
      ],
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
  assert.equal(sim.state.checkpoint.id, "later");
  sim.step(idle, dt);
  assert.ok(sim.state.player.vy > 0);
  sim.retry();
  sim.step(idle, dt);
  assert.ok(sim.state.player.vy > 0);
  sim.state.player.x = 360;
  sim.state.player.y = 300;
  sim.step(idle, dt);
  assert.equal(sim.state.checkpoint.id, "later");
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
      triggers: [
        {
          id: "receptor",
          kind: "receptor",
          x: 190,
          y: 290,
          width: 70,
          height: 70,
          checkpoint: { order: 3, spawn: { x: 100, y: 100 } },
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
      checkpoint: { order: 2, spawn: { x: 120, y: 120 } },
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
