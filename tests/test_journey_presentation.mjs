import assert from "node:assert/strict";
import test from "node:test";

import { currentAction } from "../src/journey_presentation.ts";
import { transportPosition } from "../src/physics.ts";

function route(kind) {
  const transport = {
    id: "ride",
    kind,
    path: [
      { x: 100, y: 200 },
      { x: 500, y: 400 },
    ],
    duration: 4,
    wait: 1,
    radius: 20,
    releaseVelocity: { x: 0, y: 0 },
  };
  const level = {
    transports: [transport],
    encounters: [
      {
        id: "relay",
        steps: [
          {
            id: "capture",
            kind: "transport_capture",
            transportId: "ride",
            label: "Catch the cargo",
          },
          {
            id: "delivery",
            kind: "transport_delivery",
            transportId: "ride",
            label: "Stay aboard through the bend",
          },
        ],
      },
    ],
    requiredEncounterIds: ["relay"],
  };
  return { level, transport };
}

function attachment(kind = "transport", id = "ride") {
  return { kind, id, progress: 0.5, remaining: 2, heldTime: 0 };
}

test("channel capture and detached delivery target its entrance", () => {
  const { level, transport } = route("channel");
  const capture = currentAction(level, new Map(), 3, undefined);
  assert.deepEqual(capture.center, transport.path[0]);
  assert.equal(capture.text, "Catch the cargo");
  const reboard = currentAction(level, new Map([["relay", 1]]), 3, undefined);
  assert.deepEqual(reboard.center, transport.path[0]);
  assert.match(reboard.text, /Reboard/);
});

test("motor and vesicle capture and reboarding track moving cargo", () => {
  for (const kind of ["motor", "vesicle"]) {
    const { level, transport } = route(kind);
    for (const time of [2, 3]) {
      const capture = currentAction(level, new Map(), time, undefined);
      const reboard = currentAction(level, new Map([["relay", 1]]), time, undefined);
      assert.deepEqual(capture.center, transportPosition(transport, time));
      assert.deepEqual(reboard.center, capture.center);
      assert.notDeepEqual(capture.center, transport.path[0]);
      assert.equal(capture.text, "Catch the cargo");
      assert.match(reboard.text, /Reboard/);
    }
  }
});

test("matching transport attachment targets delivery and retains the authored action", () => {
  for (const kind of ["channel", "motor", "vesicle"]) {
    const { level, transport } = route(kind);
    const cue = currentAction(level, new Map([["relay", 1]]), 3, attachment());
    assert.deepEqual(cue.center, transport.path.at(-1));
    assert.equal(cue.text, "Stay aboard through the bend");
  }
});

test("unrelated transport or sticky attachment does not count as aboard the required ride", () => {
  const { level, transport } = route("vesicle");
  for (const other of [attachment("transport", "another_ride"), attachment("sticky")]) {
    const cue = currentAction(level, new Map([["relay", 1]]), 3, other);
    assert.deepEqual(cue.center, transportPosition(transport, 3));
    assert.match(cue.text, /Reboard/);
  }
});
