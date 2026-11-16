import assert from "node:assert/strict";
import test from "node:test";

import { createInput } from "../src/input.ts";

class FakeTarget {
  #listeners = new Map();
  #captures = new Set();

  setPointerCapture(id) {
    this.#captures.add(id);
  }

  hasPointerCapture(id) {
    return this.#captures.has(id);
  }

  releasePointerCapture(id) {
    this.#captures.delete(id);
    this.emit("lostpointercapture", { pointerId: id, type: "lostpointercapture" });
  }

  addEventListener(type, listener) {
    const listeners = this.#listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.#listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.#listeners.get(type)?.delete(listener);
  }

  emit(type, event = {}) {
    for (const listener of this.#listeners.get(type) ?? []) listener(event);
  }
}

function keyboard(code, repeat = false) {
  let prevented = false;
  return {
    code,
    repeat,
    preventDefault() {
      prevented = true;
    },
    get prevented() {
      return prevented;
    },
  };
}

test("input accepts only arrows and one pulse per physical Space press", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const windowTarget = new FakeTarget();
  const documentTarget = new FakeTarget();
  const canvas = new FakeTarget();
  documentTarget.activeElement = canvas;
  documentTarget.hidden = false;
  globalThis.window = windowTarget;
  globalThis.document = documentTarget;
  const commands = [];

  try {
    const input = createInput(canvas, (command) => commands.push(command));
    const ignored = keyboard("KeyD");
    windowTarget.emit("keydown", ignored);
    assert.equal(ignored.prevented, false);
    assert.deepEqual(input.sample(), {
      left: false,
      right: false,
      up: false,
      down: false,
      pulseHeld: false,
      pulsePressed: false,
    });

    const right = keyboard("ArrowRight");
    const space = keyboard("Space");
    windowTarget.emit("keydown", right);
    windowTarget.emit("keydown", space);
    windowTarget.emit("keydown", keyboard("Space", true));
    assert.equal(right.prevented, true);
    assert.equal(space.prevented, true);
    assert.deepEqual(input.sample(), {
      left: false,
      right: true,
      up: false,
      down: false,
      pulseHeld: true,
      pulsePressed: true,
    });
    assert.equal(input.sample().pulsePressed, false);

    const up = keyboard("ArrowUp");
    const down = keyboard("ArrowDown");
    windowTarget.emit("keydown", up);
    windowTarget.emit("keydown", keyboard("ArrowUp", true));
    windowTarget.emit("keydown", down);
    assert.equal(up.prevented, true);
    assert.equal(down.prevented, true);
    assert.equal(input.sample().up, true);
    assert.equal(input.sample().down, true);
    assert.equal(input.sample().pulsePressed, false);
    windowTarget.emit("keyup", keyboard("ArrowDown"));
    assert.equal(input.sample().down, false);

    windowTarget.emit("keyup", keyboard("Space"));
    windowTarget.emit("keydown", keyboard("Space"));
    assert.equal(input.sample().pulsePressed, true);
    windowTarget.emit("keydown", keyboard("Escape"));
    windowTarget.emit("keydown", keyboard("Escape", true));
    assert.deepEqual(commands, ["pause"]);
    documentTarget.activeElement = {};
    const unfocused = keyboard("ArrowDown");
    windowTarget.emit("keydown", unfocused);
    assert.equal(unfocused.prevented, false);
    canvas.emit("blur");
    assert.equal(input.sample().up, false);
    assert.equal(input.sample().pulseHeld, false);
    assert.equal(commands.at(-1), "focus-loss");
    documentTarget.activeElement = canvas;
    windowTarget.emit("keydown", keyboard("ArrowDown"));
    input.clear();
    assert.equal(input.sample().down, false);
    windowTarget.emit("keydown", keyboard("ArrowUp"));
    documentTarget.hidden = true;
    documentTarget.emit("visibilitychange");
    assert.equal(input.sample().up, false);
    input.dispose();
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});

test("touch capture composes with keyboard and retains quick taps only until sampled", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const win = new FakeTarget();
  const doc = new FakeTarget();
  const canvas = new FakeTarget();
  const direction = new FakeTarget();
  const pulse = new FakeTarget();
  doc.activeElement = canvas;
  win.matchMedia = () => ({ matches: true });
  globalThis.window = win;
  globalThis.document = doc;
  const pointer = (id, x = 50, y = 50, type = "pointerdown") => ({
    pointerId: id,
    clientX: x,
    clientY: y,
    pointerType: "touch",
    type,
    preventDefault() {},
  });
  const input = createInput(canvas, () => {}, { direction, pulse });
  try {
    direction.emit("pointerdown", { ...pointer(1), pointerType: "mouse" });
    direction.emit("pointerdown", pointer(1, NaN));
    assert.equal(direction.hasPointerCapture(1), false);
    win.matchMedia = () => ({ matches: false });
    pulse.emit("pointerdown", pointer(3));
    assert.equal(pulse.hasPointerCapture(3), false);
    win.matchMedia = () => ({ matches: true });
    direction.emit("pointerdown", pointer(1));
    direction.emit("pointermove", pointer(1, 62, 38));
    assert.equal(input.sample().right, false);
    direction.emit("pointermove", pointer(1, 80, 20));
    assert.equal(input.sample().right, true);
    assert.equal(input.sample().up, true);
    // A second pointer cannot take over an owned direction or Pulse control.
    direction.emit("pointerdown", pointer(2));
    direction.emit("pointerup", pointer(2, 50, 50, "pointerup"));
    assert.equal(input.sample().right, true);
    win.emit("keydown", keyboard("ArrowRight"));
    direction.emit("pointerup", pointer(1, 80, 20, "pointerup"));
    assert.equal(input.sample().right, true);
    direction.emit("pointerdown", pointer(1));
    direction.emit("pointermove", pointer(1, 80));
    win.emit("keyup", keyboard("ArrowRight"));
    assert.equal(input.sample().right, true);
    pulse.emit("pointerdown", pointer(3));
    assert.equal(input.sample().pulseHeld, true);
    pulse.emit("pointerup", pointer(3, 50, 50, "pointerup"));
    assert.equal(input.sample().pulseHeld, false);
    pulse.emit("pointerdown", pointer(3));
    pulse.emit("pointerdown", pointer(4));
    pulse.emit("pointerup", pointer(3, 50, 50, "pointerup"));
    assert.equal(input.sample().pulsePressed, true);
    assert.equal(input.sample().pulsePressed, false);
    win.emit("keydown", keyboard("Space"));
    pulse.emit("pointerdown", pointer(3));
    pulse.emit("pointercancel", pointer(3, 50, 50, "pointercancel"));
    assert.equal(input.sample().pulsePressed, true);
    assert.equal(input.sample().pulseHeld, true);
    win.emit("keyup", keyboard("Space"));
    pulse.emit("pointerdown", pointer(3));
    win.emit("keydown", keyboard("Space"));
    win.emit("keyup", keyboard("Space"));
    assert.equal(input.sample().pulseHeld, true);
    pulse.emit("lostpointercapture", pointer(3, 50, 50, "lostpointercapture"));
    assert.equal(input.sample().pulseHeld, false);
    assert.equal(input.sample().pulsePressed, false);
    pulse.emit("pointerdown", pointer(3));
    input.clear();
    assert.equal(pulse.hasPointerCapture(3), false);
    assert.equal(direction.hasPointerCapture(1), false);
    assert.equal(input.sample().right, false);
    assert.equal(input.sample().pulsePressed, false);
    input.dispose();
    pulse.emit("pointerdown", pointer(3));
    assert.equal(input.sample().pulseHeld, false);
  } finally {
    input.dispose();
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});
