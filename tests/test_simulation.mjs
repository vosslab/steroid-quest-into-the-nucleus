import assert from "node:assert/strict";
import test from "node:test";

import { createSimulation } from "../src/simulation.ts";

const idle = { left: false, right: false, jumpPressed: false, jumpHeld: false };
const jump = { ...idle, jumpPressed: true, jumpHeld: true };
const right = { ...idle, right: true };
const dt = 1 / 120;

function level(changes = {}) {
  return {
    id: "membrane",
    name: "Movement test",
    objective: "Reach the far side",
    caption: "",
    width: 1000,
    height: 700,
    spawn: { x: 40, y: 270 },
    palette: { background: "#000", foreground: "#fff", accent: "#f00" },
    platforms: [{ id: "floor", x: 0, y: 300, width: 1000, height: 40, kind: "solid" }],
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
  sim.step(idle, dt);
  return { sim, events };
}

function advance(sim, seconds, input = idle) {
  for (let i = 0; i < Math.ceil(seconds / dt); i += 1) sim.step(input, dt);
}

function until(sim, condition, input = idle, seconds = 3) {
  for (let i = 0; i < Math.ceil(seconds / dt) && !condition(); i += 1) sim.step(input, dt);
  assert.ok(condition(), "Expected gameplay state was reachable with normal simulation steps");
}

function trigger(id, kind, x = 0, width = 120) {
  return { id, kind, x, y: 220, width, height: 80 };
}

test("holding jump reaches higher than tapping and both land safely", () => {
  const held = start(level()).sim;
  const tapped = start(level()).sim;
  held.step(jump, dt);
  tapped.step(jump, dt);
  advance(held, 0.2, { ...idle, jumpHeld: true });
  advance(tapped, 0.2);
  assert.ok(held.state.player.y < tapped.state.player.y);
  assert.ok(held.state.player.y < 270);
  advance(held, 1);
  advance(tapped, 1);
  assert.ok(held.state.player.grounded && tapped.state.player.grounded);
  assert.equal(held.state.deathCount, 0);
});

test("late ledge jumps and buffered landing jumps remain forgiving", () => {
  const ledge = start(
    level({
      spawn: { x: 60, y: 270 },
      platforms: [{ id: "ledge", x: 0, y: 300, width: 110, height: 40, kind: "solid" }],
    }),
  ).sim;
  until(ledge, () => !ledge.state.player.grounded, right);
  advance(ledge, 0.025, right);
  ledge.step({ ...jump, right: true }, dt);
  assert.ok(ledge.state.player.vy < 0, "A jump just after leaving a ledge should still work");

  const falling = start(level({ spawn: { x: 40, y: 240 } })).sim;
  until(falling, () => falling.state.player.y > 262);
  falling.step(jump, dt);
  until(falling, () => falling.state.player.vy < 0, { ...idle, jumpHeld: true });
  assert.ok(falling.state.player.y < 270, "A buffered jump should launch after landing");
});

test("standing players ride moving platforms on either axis", () => {
  for (const axis of ["x", "y"]) {
    const moving = {
      id: "vesicle",
      x: 0,
      y: 300,
      width: 500,
      height: 40,
      kind: "oneway",
      motion: { axis, distance: 60, period: 4 },
    };
    const sim = start(level({ platforms: [moving] })).sim;
    until(sim, () => sim.state.player.grounded);
    const before = { x: sim.state.player.x, y: sim.state.player.y };
    advance(sim, 0.3);
    assert.ok(sim.state.player[axis] > before[axis] + 5, `${axis} platform should carry its rider`);
    assert.ok(sim.state.player.grounded);
    assert.equal(sim.state.player.standingOnId, "vesicle");
  }
});

test("bounce surfaces launch without pressing jump or cutting the automatic bounce", () => {
  const sim = start(
    level({
      platforms: [{ id: "spring", x: 0, y: 300, width: 500, height: 40, kind: "bounce" }],
    }),
  ).sim;
  assert.ok(sim.state.player.vy < 0);
  const launchY = sim.state.player.y;
  advance(sim, 0.15);
  assert.ok(sim.state.player.y < launchY - 60);
  assert.equal(sim.state.deathCount, 0);
});

test("hazard recovery restores the checkpoint and preserves discoveries and binding", () => {
  const { sim, events } = start(
    level({
      collectibles: [{ id: "membrane-item", x: 40, y: 270 }],
      triggers: [trigger("membrane-bound", "receptor"), trigger("membrane-discovery", "caption")],
      hazards: [{ id: "acid", kind: "acid", x: 180, y: 250, width: 80, height: 50 }],
    }),
  );
  const checkpoint = { ...sim.state.checkpoint.spawn };
  until(sim, () => sim.state.phase === "respawning", right);
  assert.equal(sim.state.deathCount, 1);
  advance(sim, 0.2);
  assert.equal(sim.state.phase, "respawning");
  advance(sim, 0.3);
  assert.equal(sim.state.phase, "playing");
  assert.equal(sim.state.player.x, checkpoint.x);
  assert.ok(sim.state.collectedIds.has("membrane-item"));
  assert.ok(sim.state.activatedTriggerIds.has("membrane-discovery"));
  assert.ok(sim.state.receptorBound);
  assert.equal(sim.state.player.airJumpsRemaining, 1);
  assert.equal(events.filter((event) => event.type === "collect").length, 1);
});

test("authored checkpoints activate on contact and restore after hazards or manual retries", () => {
  const spawn = { x: 140, y: 270 };
  const { sim, events } = start(
    level({
      checkpoints: [{ id: "safe-ledge", x: 120, y: 250, width: 60, height: 50, spawn }],
      collectibles: [{ id: "route-item", x: 200, y: 270 }],
      triggers: [trigger("route-discovery", "caption", 200, 40)],
      hazards: [{ id: "acid", kind: "acid", x: 300, y: 250, width: 80, height: 50 }],
    }),
  );
  assert.notEqual(sim.state.checkpoint.id, "safe-ledge");
  until(sim, () => sim.state.checkpoint.id === "safe-ledge", right);
  assert.deepEqual(sim.state.checkpoint.spawn, spawn);
  assert.equal(sim.state.checkpoint.levelIndex, 0);
  until(sim, () => sim.state.phase === "respawning", right);
  assert.ok(sim.state.collectedIds.has("route-item"));
  assert.ok(sim.state.activatedTriggerIds.has("route-discovery"));
  until(sim, () => sim.state.phase === "playing");
  assert.equal(sim.state.player.x, spawn.x);
  assert.equal(sim.state.player.y, spawn.y);
  assert.equal(sim.state.player.vx, 0);
  assert.equal(sim.state.player.vy, 0);
  assert.equal(sim.state.deathCount, 1);

  until(sim, () => sim.state.player.x > spawn.x + 50, right);
  sim.retry();
  assert.equal(sim.state.phase, "playing");
  assert.equal(sim.state.player.x, spawn.x);
  assert.equal(sim.state.player.y, spawn.y);
  assert.equal(sim.state.deathCount, 1, "Manual retry should not count as a hazard death");
  assert.ok(sim.state.collectedIds.has("route-item"));
  assert.ok(sim.state.activatedTriggerIds.has("route-discovery"));
  assert.equal(events.filter((event) => event.type === "checkpoint").length, 1);
  assert.equal(events.filter((event) => event.type === "collect").length, 1);
});

test("receptor binding grants one air jump and landing replenishes it", () => {
  const { sim, events } = start(level({ triggers: [trigger("receptor-bind", "receptor")] }));
  assert.ok(sim.state.receptorBound);
  sim.step(jump, dt);
  advance(sim, 0.15, { ...idle, jumpHeld: true });
  sim.step(jump, dt);
  assert.ok(sim.state.player.vy < 0);
  assert.equal(sim.state.player.airJumpsRemaining, 0);
  advance(sim, 0.1, { ...idle, jumpHeld: true });
  const beforeThirdJump = sim.state.player.vy;
  sim.step(jump, dt);
  assert.ok(sim.state.player.vy >= beforeThirdJump, "A third jump cannot create another boost");
  until(sim, () => sim.state.player.grounded);
  assert.equal(sim.state.player.airJumpsRemaining, 1);
  assert.equal(events.filter((event) => event.type === "bound").length, 1);
});

test("HRE docking requires receptor binding before transcription can begin", () => {
  for (const triggers of [
    [trigger("hre", "hre"), trigger("dock", "transcription")],
    [trigger("receptor", "receptor"), trigger("dock", "transcription")],
  ]) {
    const { sim } = start(level({ triggers }));
    advance(sim, 0.2);
    assert.equal(sim.state.hreBound, false);
    assert.equal(sim.state.phase, "playing");
    assert.equal(sim.state.recruitmentCount, 0);
  }
});

test("ordered recruitment retries stay docked, pause freezes time, and replay clears progress", () => {
  const { sim, events } = start(
    level({
      collectibles: [{ id: "item", x: 40, y: 270 }],
      triggers: [
        trigger("receptor", "receptor", 0, 100),
        trigger("hre", "hre", 150, 60),
        trigger("dock", "transcription", 270, 80),
      ],
    }),
  );
  until(sim, () => sim.state.hreBound, right);
  until(sim, () => sim.state.phase === "recruiting", right);
  const docked = { x: sim.state.player.x, y: sim.state.player.y };
  sim.step(jump, dt);
  assert.equal(sim.state.recruitmentCount, 0, "An early attempt can miss without ending play");
  sim.retry();
  assert.equal(sim.state.phase, "recruiting");
  sim.pause();
  const elapsed = sim.state.elapsed;
  advance(sim, 1, right);
  assert.equal(sim.state.elapsed, elapsed);
  sim.resume();
  assert.equal(sim.state.phase, "recruiting");
  sim.pause();
  sim.retry();
  assert.equal(sim.state.phase, "recruiting");
  advance(sim, 0.4, right);
  for (let i = 0; i < 3; i += 1) {
    sim.step(jump, dt);
    advance(sim, 0.08);
  }
  assert.equal(sim.state.recruitmentCount, 3);
  assert.equal(sim.state.player.x, docked.x);
  assert.equal(sim.state.player.y, docked.y);
  advance(sim, 4.2);
  assert.equal(sim.state.phase, "ended");
  assert.equal(events.filter((event) => event.type === "ended").length, 1);
  sim.replay();
  assert.equal(sim.state.phase, "playing");
  assert.equal(sim.state.receptorBound, false);
  assert.equal(sim.state.hreBound, false);
  assert.equal(sim.state.collectedIds.size, 0);
  assert.equal(sim.state.activatedTriggerIds.size, 0);
  assert.equal(sim.state.recruitmentCount, 0);
  assert.equal(sim.state.elapsed, 0);
});
