import assert from "node:assert/strict";
import test from "node:test";
import { compileSections } from "../src/levels/section_specs.ts";
import { createSimulation } from "../src/simulation.ts";
import { platformRect } from "../src/physics.ts";

const common = {
  id: "encounter",
  caption: "Try this",
  width: 1640,
  floor: 780,
  checkpoints: [],
  secret: "high_cache",
};
const recipes = [
  {
    ...common,
    kind: "ribosome_bridge",
    width: 1740,
    bridgeRise: 120,
    span: 360,
    count: 3,
    crumble: { delay: 0.65, reformAfter: 3 },
  },
  {
    ...common,
    kind: "organelle_pinball",
    bumperCount: 2,
    launch: { x: 240, y: -720 },
    landingRise: 100,
  },
  { ...common, kind: "vesicle_express", ceiling: 440, acceleration: { x: 850, y: 0 }, drag: 0.12 },
  {
    ...common,
    width: 1940,
    kind: "orbit_chamber",
    orbitRise: 140,
    radiusX: 40,
    radiusY: 40,
    period: 5,
    platformCount: 2,
  },
  { ...common, kind: "low_gravity_shaft", rise: 280, gravityScale: 0.4, ledgeCount: 4 },
];

for (const recipe of recipes) {
  test(`${recipe.kind} produces deterministic geometry and safe reset support`, () => {
    const geometry = compileSections("cytoplasm", [recipe]);
    assert.deepEqual(geometry, compileSections("cytoplasm", [recipe]));
    const cp = geometry.checkpoints[0];
    assert.ok(cp);
    assert.ok(
      geometry.platforms.some(
        (p) =>
          !p.motion &&
          !p.crumble &&
          p.kind === "solid" &&
          p.y === cp.spawn.y + 30 &&
          cp.spawn.x >= p.x &&
          cp.spawn.x + 30 <= p.x + p.width,
      ),
    );
    assert.ok(
      geometry.flowZones.every((f) => cp.spawn.x + 30 <= f.x || cp.spawn.x >= f.x + f.width),
    );
    assert.ok(geometry.collectibles.some((c) => c.id.endsWith("cache-reward")));
    const steps = geometry.platforms.filter((p) => p.id.includes("cache-step"));
    assert.ok(steps.every((p) => p.kind === "oneway" && !p.motion && !p.crumble));
    for (let i = 1; i < steps.length; i++) {
      assert.ok(Math.abs(steps[i].y - steps[i - 1].y) <= 60);
      assert.ok(steps[i].x - steps[i - 1].x <= 100);
    }
    for (const p of geometry.platforms) {
      for (const time of [0, 1.25, 2.5, 3.75, 5]) {
        const rect = platformRect(p, time);
        assert.ok(rect.x >= 0 && rect.x + rect.width <= geometry.width && rect.y >= 0);
      }
    }
    const shifted = compileSections("cytoplasm", [{ ...recipe, id: "first" }, recipe]);
    assert.equal(shifted.checkpoints[1].spawn.x, cp.spawn.x + recipe.width);
    assert.equal(new Set(shifted.platforms.map((p) => p.id)).size, shifted.platforms.length);
  });
}

const input = {
  left: false,
  right: true,
  jumpPressed: false,
  jumpHeld: false,
  pausePressed: false,
  retryPressed: false,
};
function simulation(recipe, events) {
  const geometry = compileSections("cytoplasm", [recipe]);
  const level = {
    ...geometry,
    id: "cytoplasm",
    name: "Test",
    caption: "",
    objective: "",
    height: 1100,
    spawn: { x: 50, y: 750 },
    palette: { background: "#000", foreground: "#fff", accent: "#f00" },
  };
  const sim = createSimulation([level], (e) => events.push(e));
  sim.start();
  return sim;
}

test("holding right enters flush pinball spring and exits its automatic launch", () => {
  const events = [];
  const sim = simulation(recipes[1], events);
  for (let i = 0; i < 1200; i++) sim.step(input, 1 / 120);
  assert.ok(events.some((e) => e.type === "bounce"));
  assert.ok(sim.state.player.x > 900);
  assert.equal(sim.state.deathCount, 0);
});

test("ground travel experiences express acceleration and returns to normal floor", () => {
  const sim = simulation(recipes[2], []);
  let boosted = false;
  for (let i = 0; i < 700; i++) {
    sim.step(input, 1 / 120);
    boosted ||= sim.state.player.vx > 320;
  }
  assert.ok(boosted);
  assert.ok(sim.state.player.x > 1000);
  assert.equal(sim.state.deathCount, 0);
});

test("trapping and nonfinite recipes are rejected", () => {
  const invalid = [
    { ...recipes[0], count: 2.5 },
    { ...recipes[0], bridgeRise: 250 },
    { ...recipes[0], crumble: { delay: 0, reformAfter: 3 } },
    { ...recipes[1], launch: { x: -200, y: -720 } },
    { ...recipes[1], bumperCount: 8 },
    { ...recipes[2], ceiling: 750 },
    { ...recipes[2], drag: -1 },
    { ...recipes[3], radiusX: Infinity },
    { ...recipes[3], period: 0 },
    { ...recipes[4], rise: 500 },
    { ...recipes[4], gravityScale: 0 },
    { ...recipes[2], checkpoints: [{ x: 300, floor: 780 }] },
    { ...recipes[3], approachWidth: 100 },
  ];
  for (const recipe of invalid) assert.throws(() => compileSections("cytoplasm", [recipe]));
});
