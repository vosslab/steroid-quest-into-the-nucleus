import assert from "node:assert/strict";
import test from "node:test";

import { cameraFor } from "../src/camera.ts";

const width = 960;
const height = 540;
const worldWidth = 2400;
const worldHeight = 1600;
const centers = [
  { x: 80, y: worldHeight / 2 },
  { x: worldWidth - 80, y: worldHeight / 2 },
  { x: worldWidth / 2, y: 80 },
  { x: worldWidth / 2, y: worldHeight - 80 },
  { x: 80, y: 80 },
  { x: worldWidth - 80, y: worldHeight - 80 },
];

function capturedSnapshot(center, fraction, reducedMotion = false) {
  return {
    level: { width: worldWidth, height: worldHeight, destination: { center, radius: 52 } },
    state: {
      player: { x: center.x - 15, y: center.y - 15, width: 30, height: 30, vx: 0, vy: 0 },
      transition: { elapsed: fraction, duration: 1 },
    },
    reducedMotion,
  };
}

test("captured destinations stay visible and move toward center throughout zoom at world edges", () => {
  for (const center of centers) {
    let previousX = Infinity;
    let previousY = Infinity;
    let previousScale = 1;
    for (let index = 0; index <= 100; index++) {
      const snapshot = capturedSnapshot(center, index / 100);
      const camera = cameraFor(snapshot);
      const screenX = (center.x - camera.x) * camera.scale;
      const screenY = (center.y - camera.y) * camera.scale;
      const distanceX = Math.abs(screenX - width / 2);
      const distanceY = Math.abs(screenY - height / 2);
      const radius = (snapshot.level.destination.radius + 9) * camera.scale;
      // The destination ring contains the centered steroid; neither leaves the viewport.
      assert.ok(screenX - radius >= 0 && screenX + radius <= width);
      assert.ok(screenY - radius >= 0 && screenY + radius <= height);
      assert.ok(distanceX <= previousX + 1e-9);
      assert.ok(distanceY <= previousY + 1e-9);
      assert.ok(camera.scale >= previousScale);
      previousX = distanceX;
      previousY = distanceY;
      previousScale = camera.scale;
    }
    assert.ok(previousX < 1e-9 && previousY < 1e-9);
    assert.ok(previousScale > 1);
  }
});

test("reduced motion keeps normal camera framing throughout destination transitions", () => {
  for (const center of centers) {
    const snapshot = capturedSnapshot(center, 0, true);
    const normal = cameraFor({ ...snapshot, state: { ...snapshot.state, transition: undefined } });
    for (const fraction of [0, 0.2, 0.5, 0.8, 1]) {
      assert.deepEqual(cameraFor(capturedSnapshot(center, fraction, true)), normal);
    }
    assert.equal(normal.scale, 1);
  }
});
