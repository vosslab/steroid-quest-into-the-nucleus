import assert from "node:assert/strict";
import test from "node:test";
import { compileChambers } from "../src/levels/section_specs.ts";
import { CAMPAIGN } from "../src/levels.ts";

function loop(id = "loop") {
  return {
    id,
    kind: "current_loop",
    bounds: { x: 20, y: 20, width: 300, height: 240 },
    entrance: { x: 60, y: 100 },
    exit: { x: 270, y: 130 },
    sequence: [{ region: { x: 80, y: 80, width: 50, height: 50 }, caption: "Enter current" }],
    recovery: { x: 280, y: 20, width: 40, height: 240, acceleration: { x: 0, y: 300 } },
    fields: [{ x: 130, y: 50, width: 100, height: 90, acceleration: { x: 120, y: 0 } }],
    checkpoint: { x: 60, y: 180, width: 60, height: 50, spawn: { x: 90, y: 205 } },
  };
}

test("chamber compiler gives every recipe unique primitives and ordered calm checkpoints", () => {
  const second = {
    ...loop("second"),
    bounds: { x: 140, y: 30, width: 280, height: 250 },
    entrance: { x: 170, y: 160 },
    exit: { x: 380, y: 150 },
    recovery: { x: 380, y: 30, width: 40, height: 250, acceleration: { x: 0, y: 300 } },
    fields: [{ x: 220, y: 60, width: 100, height: 90, acceleration: { x: 120, y: 0 } }],
    checkpoint: { x: 165, y: 190, width: 45, height: 50, spawn: { x: 185, y: 215 } },
  };
  const compiled = compileChambers("membrane", 480, 320, [loop(), second]);
  assert.deepEqual(compiled, compileChambers("membrane", 480, 320, [loop(), second]));
  assert.deepEqual(
    compiled.checkpoints.map((point) => point.order),
    [1, 2],
  );
  assert.equal(
    new Set(compiled.flowZones.map((field) => field.id)).size,
    compiled.flowZones.length,
  );
  assert.equal(compiled.encounters[0].steps[0].caption, "Enter current");
});

test("chamber compiler rejects duplicated ids, unsafe spawns, and incomplete returns", () => {
  assert.throws(() => compileChambers("membrane", 480, 320, [loop(), loop()]), /repeated/);
  assert.throws(
    () =>
      compileChambers("membrane", 480, 320, [
        {
          ...loop(),
          recovery: { x: 280, y: 60, width: 40, height: 180, acceleration: { x: 0, y: 300 } },
        },
      ]),
    /upper pocket/,
  );
  assert.throws(
    () =>
      compileChambers("membrane", 480, 320, [
        {
          ...loop(),
          fields: [{ x: 90, y: 205, width: 30, height: 30, acceleration: { x: 120, y: 0 } }],
        },
      ]),
    /spawn must be calm/,
  );
  assert.throws(
    () =>
      compileChambers("membrane", 480, 320, [
        {
          ...loop(),
          obstacles: [
            {
              shape: { kind: "circle", center: { x: 105, y: 220 }, radius: 12 },
              response: { kind: "rebound", restitution: 1 },
            },
          ],
        },
      ]),
    /spawn overlaps an obstacle/,
  );
  assert.throws(
    () =>
      compileChambers("membrane", 480, 320, [
        {
          ...loop(),
          checkpoint: undefined,
          obstacles: [
            {
              shape: { kind: "circle", center: { x: 85, y: 220 }, radius: 12 },
              response: { kind: "rebound", restitution: 1 },
              motion: { radiusX: 20, radiusY: 0, period: 1 },
            },
          ],
          triggers: [
            {
              kind: "receptor",
              x: 240,
              y: 180,
              width: 40,
              height: 40,
              checkpoint: { order: 2, spawn: { x: 90, y: 205 } },
            },
          ],
        },
      ]),
    /receptor checkpoint: spawn overlaps an obstacle/,
  );
  assert.throws(
    () =>
      compileChambers("membrane", 480, 320, [
        {
          ...loop(),
          transports: [
            {
              kind: "channel",
              path: [
                { x: 150, y: 100 },
                { x: 270, y: 100 },
              ],
              duration: 1,
              radius: 20,
              wait: 0,
              releaseVelocity: { x: 0, y: 0 },
            },
          ],
          obstacles: [
            {
              shape: { kind: "circle", center: { x: 210, y: 100 }, radius: 20 },
              response: { kind: "rebound", restitution: 1 },
            },
          ],
        },
      ]),
    /transport path overlaps an obstacle/,
  );
});

test("calm spawn validation ignores drag and phase-disjoint forces", () => {
  const disjoint = {
    encounterId: "membrane-loop",
    min: 2,
  };
  assert.doesNotThrow(() =>
    compileChambers("membrane", 480, 320, [
      {
        ...loop(),
        checkpoint: {
          x: 60,
          y: 180,
          width: 60,
          height: 50,
          spawn: { x: 90, y: 205 },
          activeWhen: disjoint,
        },
        fields: [
          { x: 90, y: 205, width: 30, height: 30, acceleration: { x: 0, y: 0 }, drag: 6 },
          {
            x: 90,
            y: 205,
            width: 30,
            height: 30,
            acceleration: { x: 120, y: 0 },
            activeWhen: { encounterId: "membrane-loop", max: 1 },
          },
        ],
      },
    ]),
  );
});

test("campaign chambers keep their authored fluid surprises instead of replacing recipe data", () => {
  assert.ok(CAMPAIGN.every((level) => level.width >= 1500 && level.height >= 600));
  for (const level of CAMPAIGN.slice(0, 5)) {
    assert.ok(
      level.flowZones.some(
        (field) => field.acceleration.y > 0 && field.y === 0 && field.height === level.height,
      ),
      `${level.id} has a full-height return stream`,
    );
  }
  const membrane = CAMPAIGN[0];
  assert.ok(
    membrane.flowZones.some(
      (field) => field.label === "visible inlet current" && field.acceleration.y < -500,
    ),
  );
  assert.deepEqual(
    membrane.flowZones.find((field) => field.label === "finite backward sweep")?.activeWhen,
    { encounterId: "membrane-membrane_loop", min: 3, max: 3 },
  );
  assert.equal(
    membrane.transports.find((transport) => transport.label === "new arrival vesicle")?.activeWhen
      ?.min,
    4,
  );
  const cytoplasm = CAMPAIGN[1];
  assert.deepEqual(
    new Set(cytoplasm.transports.map((transport) => transport.kind)),
    new Set(["motor", "vesicle", "channel"]),
  );
  const receptor = CAMPAIGN[3];
  const receptorTrigger = receptor.triggers.find((trigger) => trigger.kind === "receptor");
  assert.ok(receptorTrigger?.checkpoint && receptorTrigger.x > 1000);
  assert.ok(receptor.obstacles.some((obstacle) => obstacle.response.kind === "sticky"));
  const dna = CAMPAIGN[4];
  assert.equal(dna.obstacles.filter((obstacle) => obstacle.motion).length, 2);
  assert.equal(
    dna.flowZones.find((field) => field.label === "rearranged short approach")?.activeWhen?.min,
    2,
  );
});
