import assert from "node:assert/strict";
import test from "node:test";

import { CELL_LEVELS } from "../src/levels/cell.ts";
import { compileSections } from "../src/levels/section_specs.ts";
import { createSimulation } from "../src/simulation.ts";

function tunnel(changes = {}) {
  return {
    id: "gel_squeeze",
    kind: "tunnel",
    width: 1200,
    floor: 780,
    ceiling: 540,
    material: "reticulum",
    caption: "Follow the open passage.",
    checkpoints: [{ x: 40, floor: 780 }],
    baffles: [{ x: 450, side: "lower", width: 110, depth: 60, material: "mitochondrion" }],
    ...changes,
  };
}

test("section lowering is deterministic, offsets geometry, and keeps IDs unique", () => {
  const sections = [tunnel(), tunnel({ id: "organelle_weave" })];
  const first = compileSections("cytoplasm", sections);
  assert.deepEqual(first, compileSections("cytoplasm", sections));
  const secondBaffle = first.platforms.find(
    (platform) => platform.id === "cytoplasm-organelle_weave-baffle-0",
  );
  assert.equal(secondBaffle.x, 1650);
  assert.equal(first.width, 2400);
  const ids = [...first.platforms, ...first.checkpoints, ...first.triggers].map(
    (entry) => entry.id,
  );
  assert.equal(new Set(ids).size, ids.length);
  assert.throws(() => compileSections("cytoplasm", [tunnel(), tunnel()]), /repeated section ID/);
});

test("the compiler rejects the tall floor baffle that trapped unbound players", () => {
  assert.throws(
    () =>
      compileSections("cytoplasm", [
        tunnel({
          baffles: [{ x: 450, side: "lower", width: 110, depth: 130, material: "mitochondrion" }],
        }),
      ]),
    /unbound jump allowance/,
  );
  assert.throws(
    () =>
      compileSections("cytoplasm", [
        tunnel({
          baffles: [{ x: 450, side: "upper", width: 110, depth: 200, material: "reticulum" }],
        }),
      ]),
    /body clearance/,
  );
  assert.throws(
    () =>
      compileSections("cytoplasm", [
        tunnel({
          baffles: [{ x: 50, side: "lower", width: 110, depth: 60, material: "mitochondrion" }],
        }),
      ]),
    /approach and recovery/,
  );
});

test("checkpoints recover on clear stationary support outside hazards and currents", () => {
  assert.throws(
    () =>
      compileSections("cytoplasm", [
        tunnel({
          checkpoints: [{ x: 455, floor: 780 }],
        }),
      ]),
    /clear stationary support/,
  );
  assert.throws(
    () =>
      compileSections("cytoplasm", [
        tunnel({
          hazards: [{ kind: "enzyme", x: 80, y: 758, width: 36, height: 22 }],
        }),
      ]),
    /too close to a hazard/,
  );
  assert.throws(
    () =>
      compileSections("cytoplasm", [
        tunnel({
          flowZones: [{ x: 30, y: 680, width: 100, height: 100, acceleration: { x: 0, y: -2100 } }],
        }),
      ]),
    /outside currents/,
  );
  assert.throws(() => compileSections("cytoplasm", [tunnel({ width: Number.NaN })]), /finite/);
});

/** This controller only presses the ordinary movement/jump inputs; state remains read-only. */
function walkCell(level) {
  const events = [];
  const sim = createSimulation([level], (event) => events.push(event));
  sim.start();
  const landed = new Set();
  const crumbled = new Set();
  let expressSpeed = 0;
  const expressField = level.flowZones?.find((field) => field.id.endsWith("express-field"));
  const dt = 1 / 120;
  let jumpUntil = 0;
  let lastJump = -10;
  for (let step = 0; step < 120 / dt; step += 1) {
    const player = sim.state.player;
    const seconds = step * dt;
    const baffle = level.platforms.find((platform) => {
      const lowObstacle =
        (platform.id.includes("protein") && platform.height <= 65) ||
        (platform.id.includes("-baffle-") && platform.y > 600);
      return lowObstacle && platform.x > player.x + 20 && platform.x - player.x < 100;
    });
    const hazard = level.hazards.find(
      (entry) => entry.x > player.x + 20 && entry.x - player.x < 100,
    );
    const current = level.platforms.find((platform) => platform.id === player.standingOnId);
    const climbEdge =
      current &&
      (current.id.includes("-route-") ||
        current.id.includes("-climb-") ||
        current.id === "envelope-start") &&
      player.x > current.x + current.width - 45;
    const pressJump =
      player.grounded && seconds - lastJump > 0.25 && Boolean(baffle || hazard || climbEdge);
    if (pressJump) {
      jumpUntil = seconds + 0.8;
      lastJump = seconds;
    }
    sim.step(
      { left: false, right: true, jumpPressed: pressJump, jumpHeld: seconds < jumpUntil },
      dt,
    );
    if (sim.state.player.standingOnId) landed.add(sim.state.player.standingOnId);
    for (const [id, state] of sim.state.crumbleStates) {
      if (state.phase === "collapsed") crumbled.add(id);
    }
    if (
      expressField &&
      player.x > expressField.x &&
      player.x < expressField.x + expressField.width
    ) {
      expressSpeed = Math.max(expressSpeed, player.vx);
    }
    assert.equal(
      sim.state.deathCount,
      0,
      `${level.id}: normal route caused a death at x=${player.x}`,
    );
    if (sim.state.player.x >= level.width - 100)
      return { sim, events, landed, crumbled, expressSpeed };
  }
  assert.fail(
    `${level.id}: normal controls stalled at x=${sim.state.player.x}, y=${sim.state.player.y}`,
  );
}

test("all three cell routes are traversable with ordinary unbound controls and quick recovery", () => {
  for (const level of CELL_LEVELS) {
    const { sim, events, landed, crumbled, expressSpeed } = walkCell(level);
    assert.equal(sim.state.receptorBound, false);
    assert.ok(events.some((event) => event.type === "checkpoint"));
    assert.ok(
      events.some((event) => event.type === "bounce"),
      `${level.id} needs its launch moment`,
    );
    if (level.id === "membrane") {
      assert.ok(
        events.some(
          (event) => event.type === "bounce" && event.platformId === "membrane-lipid_pop-bumper-0",
        ),
      );
      assert.ok(
        crumbled.has("membrane-lipid_pop-pinball-landing-0"),
        "The send-off shelf must collapse after contact over its safe floor",
      );
      assert.ok(
        landed.has("membrane-spring-secret"),
        "The spring should reach the optional upper route",
      );
      assert.ok(
        landed.has("membrane-loft-return"),
        "The optional route should return toward the membrane",
      );
      assert.ok(landed.has("membrane-floor-after"), "The player must return to the main route");
    }
    if (level.id === "cytoplasm") {
      assert.ok(
        expressSpeed > 420,
        "The regular route must actually experience the express current",
      );
      assert.ok(
        landed.has("cytoplasm-giant_pinball-pinball-landing-0"),
        "The first flush bumper must launch onto its organelle shelf",
      );
      assert.ok(
        landed.has("cytoplasm-er_express-catch"),
        "The express route must return to its stationary floor",
      );
    }
    if (level.id === "envelope") {
      assert.ok(
        landed.has("envelope-drifting-vesicle"),
        "The open pore launch should reach a drifting vesicle",
      );
    }
    sim.retry();
    for (let step = 0; step < 60; step += 1) {
      sim.step({ left: false, right: false, jumpPressed: false, jumpHeld: false }, 1 / 120);
    }
    assert.equal(sim.state.deathCount, 0, "The last authored checkpoint must recover safely");
    assert.equal(sim.state.phase, "playing");
  }
});
