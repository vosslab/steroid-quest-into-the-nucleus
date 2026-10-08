import assert from "node:assert/strict";
import test from "node:test";

import { GRAVITY } from "../src/constants.ts";
import { platformRect } from "../src/physics.ts";
import { createSimulation } from "../src/simulation.ts";

const idle = { left: false, right: false, jumpPressed: false, jumpHeld: false };
const dt = 1 / 120;
const bridge = {
  id: "bridge",
  kind: "solid",
  x: 100,
  y: 300,
  width: 200,
  height: 30,
  crumble: { delay: 0.08, reformAfter: 0.08 },
};

function level(changes = {}) {
  return {
    id: "membrane",
    name: "Mechanics",
    objective: "Explore",
    caption: "",
    width: 2000,
    height: 2000,
    spawn: { x: 150, y: 270 },
    palette: { background: "#000", foreground: "#fff", accent: "#f00" },
    platforms: [],
    hazards: [],
    checkpoints: [],
    collectibles: [],
    triggers: [],
    decorations: [],
    ...changes,
  };
}

function start(...levels) {
  const sim = createSimulation(levels, () => {});
  sim.start();
  return sim;
}

function advance(sim, seconds, input = idle) {
  for (let i = 0; i < Math.ceil(seconds / dt); i += 1) sim.step(input, dt);
}

function until(sim, condition, input = idle) {
  for (let i = 0; i < 360 && !condition(); i += 1) sim.step(input, dt);
  assert.ok(condition(), "Expected mechanic state should be reached through simulation steps");
}

test("top contact arms once, leaving and recontact keep its timer, collapse removes support", () => {
  const sim = start(level({ platforms: [bridge] }));
  sim.step(idle, dt);
  const armed = sim.state.crumbleStates.get(bridge.id);
  assert.equal(armed.phase, "armed");
  sim.state.player.x = 400;
  advance(sim, 0.025);
  const remaining = armed.remaining;
  sim.state.player.x = 150;
  sim.state.player.y = 270;
  sim.state.player.vy = 0;
  sim.step(idle, dt);
  assert.ok(armed.remaining < remaining, "Recontact must continue the original countdown");
  until(sim, () => armed.phase === "collapsed");
  assert.equal(sim.state.player.grounded, false);
  assert.equal(sim.state.player.standingOnId, undefined);
  assert.ok(sim.state.player.y > bridge.y - sim.state.player.height);
});

test("collapse waits for clear reform space and then top contact can arm a new cycle", () => {
  const sim = start(level({ platforms: [bridge] }));
  sim.step(idle, dt);
  until(sim, () => sim.state.crumbleStates.get(bridge.id)?.phase === "collapsed");
  // Keep a player inside the absent collision rectangle as its reform countdown expires.
  for (let i = 0; i < 30; i += 1) {
    sim.state.player.y = 290;
    sim.state.player.vy = 0;
    sim.step(idle, dt);
  }
  assert.equal(sim.state.crumbleStates.get(bridge.id).remaining, 0);
  assert.equal(sim.state.player.grounded, false);
  sim.state.player.x = 400;
  sim.step(idle, dt);
  assert.equal(sim.state.crumbleStates.has(bridge.id), false);
  sim.state.player.x = 150;
  sim.state.player.y = 270;
  sim.state.player.vy = 0;
  sim.step(idle, dt);
  assert.equal(sim.state.crumbleStates.get(bridge.id)?.phase, "armed");
  assert.equal(sim.state.player.standingOnId, bridge.id);
});

test("side and underside contact never arm crumble, and collapse has no side or ceiling collision", () => {
  const solid = { ...bridge, crumble: { delay: 0.04, reformAfter: 2 } };
  const sim = start(level({ platforms: [solid], spawn: { x: 69, y: 305 } }));
  sim.state.player.vx = 240;
  sim.step({ ...idle, right: true }, dt);
  assert.equal(sim.state.player.vx, 0, "Intact solid sides still collide");
  assert.equal(sim.state.crumbleStates.size, 0);
  sim.state.player.x = 150;
  sim.state.player.y = 331;
  sim.state.player.vy = -240;
  sim.step(idle, dt);
  assert.equal(sim.state.player.vy, 0, "Intact underside still collides");
  assert.equal(sim.state.crumbleStates.size, 0);
  sim.state.player.y = 270;
  sim.step(idle, dt);
  until(sim, () => sim.state.crumbleStates.get(solid.id)?.phase === "collapsed");
  sim.state.player.x = 69;
  sim.state.player.y = 305;
  sim.state.player.vx = 240;
  sim.step({ ...idle, right: true }, dt);
  assert.ok(sim.state.player.x > 70);
  assert.ok(sim.state.player.vx > 0);
  sim.state.player.x = 150;
  sim.state.player.y = 331;
  sim.state.player.vy = -240;
  sim.step(idle, dt);
  assert.ok(sim.state.player.y < 330);
  assert.ok(sim.state.player.vy < 0);
});

test("pause freezes crumble and retry/death reset it while preserving discoveries and milestones", () => {
  const sim = start(
    level({
      platforms: [bridge],
      collectibles: [{ id: "item", x: 150, y: 270 }],
      triggers: [
        { id: "bind", kind: "receptor", x: 140, y: 250, width: 60, height: 50 },
        { id: "hre", kind: "hre", x: 140, y: 250, width: 60, height: 50 },
      ],
    }),
  );
  sim.step(idle, dt);
  const timer = { ...sim.state.crumbleStates.get(bridge.id) };
  const time = sim.state.levelTime;
  sim.pause();
  advance(sim, 1);
  assert.deepEqual(sim.state.crumbleStates.get(bridge.id), timer);
  assert.equal(sim.state.levelTime, time);
  sim.retry();
  assert.equal(sim.state.crumbleStates.size, 0);
  assert.equal(sim.state.levelTime, time);
  assert.ok(sim.state.collectedIds.has("item"));
  assert.ok(sim.state.activatedTriggerIds.has("hre"));
  assert.ok(sim.state.receptorBound && sim.state.hreBound);
  sim.step(idle, dt);
  assert.equal(sim.state.crumbleStates.size, 1);
  sim.state.player.y = 2200;
  sim.step(idle, dt);
  assert.equal(sim.state.phase, "respawning");
  until(sim, () => sim.state.phase === "playing");
  assert.equal(sim.state.crumbleStates.size, 0);
  assert.ok(sim.state.collectedIds.has("item"));
  assert.ok(sim.state.receptorBound && sim.state.hreBound);
  sim.step(idle, dt);
  sim.replay();
  assert.equal(sim.state.crumbleStates.size, 0);
  assert.equal(sim.state.collectedIds.size, 0);
  assert.equal(sim.state.receptorBound, false);
});

test("stage entry clears transient crumble state", () => {
  const sim = start(
    level({
      platforms: [bridge],
      triggers: [{ id: "exit", kind: "exit", x: 140, y: 250, width: 60, height: 50 }],
    }),
    level({ id: "cytoplasm" }),
  );
  sim.step(idle, dt);
  assert.equal(sim.state.crumbleStates.size, 1);
  until(sim, () => sim.state.levelIndex === 1);
  assert.equal(sim.state.crumbleStates.size, 0);
});

test("orbit geometry carries a standing player on both axes without drift", () => {
  const platform = {
    id: "orbit",
    kind: "oneway",
    x: 100,
    y: 300,
    width: 300,
    height: 30,
    motion: { kind: "orbit", radiusX: 45, radiusY: 30, period: 4 },
  };
  const sim = start(level({ platforms: [platform], spawn: { x: 180, y: 260 } }));
  until(sim, () => sim.state.player.standingOnId === platform.id);
  const before = { x: sim.state.player.x, y: sim.state.player.y };
  const rectBefore = platformRect(platform, sim.state.levelTime);
  advance(sim, 0.3);
  const rectAfter = platformRect(platform, sim.state.levelTime);
  assert.ok(Math.abs(rectAfter.x - rectBefore.x) > 1);
  assert.ok(Math.abs(rectAfter.y - rectBefore.y) > 1);
  assert.ok(Math.abs(sim.state.player.x - before.x - rectAfter.x + rectBefore.x) < 1e-8);
  assert.ok(Math.abs(sim.state.player.y - before.y - rectAfter.y + rectBefore.y) < 1e-8);
  assert.equal(sim.state.player.standingOnId, platform.id);
  assert.equal(sim.state.player.grounded, true);
});

test("an orbiting crumble stops carrying its rider on the collapse step", () => {
  const platform = {
    ...bridge,
    kind: "oneway",
    motion: { kind: "orbit", radiusX: 45, radiusY: 30, period: 4 },
    crumble: { delay: 0.08, reformAfter: 2 },
  };
  const sim = start(level({ platforms: [platform] }));
  until(sim, () => sim.state.player.standingOnId === platform.id);
  until(sim, () => sim.state.crumbleStates.get(platform.id).remaining <= dt);
  const beforeX = sim.state.player.x;
  sim.step(idle, dt);
  assert.equal(sim.state.crumbleStates.get(platform.id).phase, "collapsed");
  assert.equal(sim.state.player.x, beforeX);
  assert.equal(sim.state.player.grounded, false);
  assert.equal(sim.state.player.standingOnId, undefined);
});

const fields = [
  {
    id: "a",
    x: 100,
    y: 100,
    width: 600,
    height: 700,
    acceleration: { x: 120, y: -40 },
    gravityScale: 0.4,
    drag: 1,
  },
  {
    id: "b",
    x: 100,
    y: 100,
    width: 600,
    height: 700,
    acceleration: { x: -30, y: 20 },
    gravityScale: 0.2,
    drag: 2,
  },
];

test("overlapping fields combine gravity, drag and acceleration independent of zone order", () => {
  const first = start(level({ flowZones: fields }));
  const reversed = start(level({ flowZones: [...fields].reverse() }));
  for (const sim of [first, reversed]) {
    sim.state.player.vy = 100;
    sim.step(idle, dt);
  }
  assert.deepEqual(first.state.player, reversed.state.player);
  const damping = Math.exp(-3 * dt);
  assert.ok(Math.abs(first.state.player.vx - 90 * dt * damping) < 1e-8);
  assert.ok(Math.abs(first.state.player.vy - (100 + (GRAVITY * 0.2 - 20) * dt) * damping) < 1e-8);
});

test("fields act only inside, leaving restores baseline and opposing steering remains responsive", () => {
  const sim = start(level({ flowZones: fields }));
  sim.state.player.vx = 350;
  sim.step({ ...idle, left: true }, dt);
  assert.ok(sim.state.player.vx < 350);
  const baseline = start(level());
  for (const run of [sim, baseline]) {
    run.state.player.x = 900;
    run.state.player.y = 270;
    run.state.player.vx = 100;
    run.state.player.vy = -100;
    run.state.player.grounded = false;
    run.state.player.facing = 1;
    run.step(idle, dt);
  }
  assert.deepEqual(sim.state.player, baseline.state.player);
  const increased = start(
    level({
      flowZones: [{ ...fields[0], acceleration: { x: 0, y: 0 }, gravityScale: 2, drag: 0 }],
    }),
  );
  increased.step(idle, dt);
  assert.equal(
    increased.state.player.vy,
    GRAVITY * dt,
    "Gravity scale takes a minimum with normal gravity",
  );
});
