import assert from "node:assert/strict";
import test from "node:test";
import {
  captureChamber,
  channelTransfer,
  currentLoop,
  transportRelay,
} from "../src/levels/surprise_patterns.ts";
import { compileChambers } from "../src/levels/section_specs.ts";

const base = {
  id: "test",
  placement: { x: 90, y: 60 },
  width: 400,
  height: 300,
  objective: "Take the route",
  required: true,
  completionCheckpoint: { x: 30, y: 250 },
  entrance: { x: 50, y: 120 },
  exit: { x: 320, y: 180 },
  sequence: [
    {
      id: "entry",
      kind: "region",
      region: { x: 60, y: 90, width: 40, height: 40 },
      caption: "Start",
    },
  ],
};
const path = [
  { x: 70, y: 180 },
  { x: 190, y: 150 },
  { x: 320, y: 180 },
];

test("four local recipe families retain full-height downward returns when moved", () => {
  const recipes = [
    currentLoop(base, { x: 120, y: 0 }),
    transportRelay(base, path),
    captureChamber(base, { x: 180, y: 100, width: 60, height: 60 }),
    channelTransfer(base, path),
  ];
  for (const recipe of recipes) {
    assert.equal(recipe.recovery.y, 0);
    assert.equal(recipe.recovery.height, recipe.height);
    assert.ok(recipe.recovery.acceleration.y > 0);
    const compiled = compileChambers("membrane", 600, 500, [recipe]);
    assert.equal(compiled.flowZones[0].y, base.placement.y);
    assert.equal(compiled.flowZones[0].x, base.placement.x + recipe.recovery.x);
  }
});

test("transport recipes retain local player-center paths and named delivery references", () => {
  const relay = transportRelay(
    {
      ...base,
      sequence: [
        { id: "delivery", kind: "transport_delivery", transportId: "cargo", caption: "Delivered" },
      ],
    },
    path,
    "motor",
  );
  const channel = channelTransfer(
    {
      ...base,
      sequence: [
        {
          id: "delivery",
          kind: "transport_delivery",
          transportId: "channel",
          caption: "Delivered",
        },
      ],
    },
    path,
  );
  assert.deepEqual(relay.transports[0].path, path);
  assert.deepEqual(channel.transports[0].path, path);
  assert.equal(channel.transports[0].kind, "channel");
  for (const recipe of [relay, channel]) {
    const compiled = compileChambers("membrane", 600, 500, [recipe]);
    assert.equal(compiled.encounters[0].steps[0].transportId, compiled.transports[0].id);
  }
});
