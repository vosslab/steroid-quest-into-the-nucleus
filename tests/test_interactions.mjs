import assert from "node:assert/strict";
import test from "node:test";

import { MAX_SPEED } from "../src/constants.ts";
import { createSimulation } from "../src/simulation.ts";

const idle = { left: false, right: false, jumpPressed: false, jumpHeld: false };
const dt = 1 / 120;

function level(changes = {}) {
  return {
    id: "cytoplasm",
    name: "Current and launch test",
    objective: "Explore the moving cell",
    caption: "",
    width: 2000,
    height: 2000,
    spawn: { x: 500, y: 500 },
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

function start(definition) {
  const events = [];
  const sim = createSimulation([definition], (event) => events.push(event));
  sim.start();
  return { sim, events };
}

function advance(sim, seconds, input = idle) {
  for (let step = 0; step < Math.ceil(seconds / dt); step += 1) sim.step(input, dt);
}

test("directional moving gel launches retain momentum and allow opposite steering", () => {
  for (const direction of [-1, 1]) {
    const { sim, events } = start(
      level({
        platforms: [
          {
            id: "gel-launch",
            x: 350,
            y: 530,
            width: 300,
            height: 35,
            kind: "bounce",
            material: "gel",
            launch: { x: direction * 420, y: -720 },
            motion: { axis: "x", distance: 20, period: 4 },
          },
        ],
      }),
    );
    sim.step(idle, dt);
    const launch = { x: sim.state.player.x, y: sim.state.player.y };
    advance(sim, 0.15, { ...idle, left: direction < 0, right: direction > 0 });
    assert.ok(direction * (sim.state.player.x - launch.x) > 40);
    assert.ok(
      direction * sim.state.player.vx > MAX_SPEED,
      "Steering with a launch should preserve its useful automatic boost",
    );
    assert.ok(sim.state.player.y < launch.y - 60, "Automatic launches must not be jump-cut");
    assert.deepEqual(
      events.filter((event) => event.type === "bounce"),
      [{ type: "bounce", platformId: "gel-launch" }],
    );
    advance(sim, 0.3, { ...idle, left: direction > 0, right: direction < 0 });
    assert.ok(direction * sim.state.player.vx < 0, "Opposite input should reverse a launch");
    assert.equal(sim.state.phase, "playing");
  }
});

test("updrafts lift without jumping while the player can steer against their drift", () => {
  const { sim } = start(
    level({
      flowZones: [
        {
          id: "gel-current",
          x: 350,
          y: 0,
          width: 600,
          height: 1500,
          acceleration: { x: 800, y: -2100 },
        },
      ],
    }),
  );
  advance(sim, 0.25);
  assert.ok(sim.state.player.y < 500);
  assert.ok(sim.state.player.vy < 0);
  const before = sim.state.player.x;
  advance(sim, 0.3, { ...idle, left: true });
  assert.ok(sim.state.player.x < before);
  assert.ok(sim.state.player.vx < 0);
});

test("leaving a flow rectangle immediately restores ordinary gravity and drag", () => {
  const { sim } = start(
    level({
      spawn: { x: 100, y: 500 },
      flowZones: [
        {
          id: "short-current",
          x: 0,
          y: 0,
          width: 240,
          height: 1500,
          acceleration: { x: 900, y: -2100 },
        },
      ],
    }),
  );
  for (let step = 0; step < 240 && sim.state.player.x < 240; step += 1) {
    sim.step({ ...idle, right: true }, dt);
  }
  assert.ok(sim.state.player.x >= 240, "Normal steering must reach the field exit");
  const before = { vx: sim.state.player.vx, vy: sim.state.player.vy };
  sim.step(idle, dt);
  assert.ok(Math.abs(sim.state.player.vy - before.vy - 1500 * dt) < 1e-9);
  assert.ok(sim.state.player.vx < before.vx, "The former field must not add another push");
  assert.ok(sim.state.player.vx > 0, "Leaving a field retains momentum rather than stopping");
});

test("overlapping currents sum before speed limiting and do not depend on author order", () => {
  const zones = [
    {
      id: "strong-current",
      x: 0,
      y: -1000,
      width: 2000,
      height: 4000,
      acceleration: { x: 10000, y: -10000 },
    },
    {
      id: "opposing-current",
      x: 0,
      y: -1000,
      width: 2000,
      height: 4000,
      acceleration: { x: -3000, y: 2000 },
    },
  ];
  const forward = start(level({ flowZones: zones })).sim;
  const reversed = start(level({ flowZones: [...zones].reverse() })).sim;
  advance(forward, 0.3);
  advance(reversed, 0.3);
  assert.deepEqual(forward.state.player, reversed.state.player);
  assert.ok(Number.isFinite(forward.state.player.vx) && Number.isFinite(forward.state.player.vy));
  assert.ok(forward.state.player.vx <= 720 && forward.state.player.vy >= -720);
  assert.ok(forward.state.player.x > 500 && forward.state.player.y < 500);
});

test("pause freezes currents and retry returns to an ordinary safe spawn", () => {
  const { sim } = start(
    level({
      spawn: { x: 100, y: 270 },
      platforms: [{ id: "floor", x: 0, y: 300, width: 2000, height: 40, kind: "solid" }],
      flowZones: [
        {
          id: "away-from-spawn",
          x: 350,
          y: 0,
          width: 600,
          height: 300,
          acceleration: { x: 800, y: -2100 },
        },
      ],
    }),
  );
  for (let step = 0; step < 240 && sim.state.player.x < 400; step += 1) {
    sim.step({ ...idle, right: true }, dt);
  }
  assert.ok(sim.state.player.x >= 400);
  assert.ok(sim.state.player.vy < 0);
  sim.pause();
  const player = { ...sim.state.player };
  const elapsed = sim.state.elapsed;
  const levelTime = sim.state.levelTime;
  advance(sim, 1, { ...idle, right: true });
  assert.deepEqual(sim.state.player, player);
  assert.equal(sim.state.elapsed, elapsed);
  assert.equal(sim.state.levelTime, levelTime);
  sim.retry();
  sim.step(idle, dt);
  assert.equal(sim.state.phase, "playing");
  assert.equal(sim.state.player.x, 100);
  assert.equal(sim.state.player.y, 270);
  assert.equal(sim.state.player.vx, 0);
  assert.equal(sim.state.player.vy, 0);
  assert.ok(sim.state.player.grounded);
});
