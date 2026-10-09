import assert from "node:assert/strict";
import test from "node:test";
import {
  captureChamber,
  channelTransfer,
  currentLoop,
  transportRelay,
} from "../src/levels/surprise_patterns.ts";

const base = {
  id: "test",
  bounds: { x: 20, y: 30, width: 400, height: 260 },
  entrance: { x: 70, y: 120 },
  exit: { x: 360, y: 180 },
  sequence: [{ region: { x: 80, y: 90, width: 40, height: 40 }, caption: "Start" }],
};

test("all reusable chamber recipes expose a full-height downward escape route", () => {
  const recipes = [
    currentLoop(base, { x: 120, y: 0 }),
    transportRelay(base, [
      { x: 70, y: 120 },
      { x: 360, y: 180 },
    ]),
    captureChamber(base, { x: 180, y: 100, width: 60, height: 60 }),
    channelTransfer(base, [
      { x: 70, y: 120 },
      { x: 360, y: 180 },
    ]),
  ];
  for (const recipe of recipes) {
    assert.equal(recipe.recovery.y, recipe.bounds.y);
    assert.equal(recipe.recovery.height, recipe.bounds.height);
    assert.ok(recipe.recovery.acceleration.y > 0);
    assert.ok(recipe.entrance.x < recipe.recovery.x);
  }
});

test("transport recipes preserve authored player-center paths", () => {
  const path = [
    { x: 70, y: 120 },
    { x: 190, y: 90 },
    { x: 360, y: 180 },
  ];
  const relay = transportRelay(base, path, "motor");
  const channel = channelTransfer(base, path);
  assert.deepEqual(relay.transports[0].path, path);
  assert.deepEqual(channel.transports[0].path, path);
  assert.equal(channel.transports[0].kind, "channel");
});
