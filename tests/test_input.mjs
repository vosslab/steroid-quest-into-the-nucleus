import assert from "node:assert/strict";
import test from "node:test";

import { createInput } from "../src/input.ts";

class FakeTarget {
  #listeners = new Map();

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
      pulseHeld: true,
      pulsePressed: true,
    });
    assert.equal(input.sample().pulsePressed, false);

    windowTarget.emit("keyup", keyboard("Space"));
    windowTarget.emit("keydown", keyboard("Space"));
    assert.equal(input.sample().pulsePressed, true);
    windowTarget.emit("keydown", keyboard("Escape"));
    windowTarget.emit("keydown", keyboard("Escape", true));
    assert.deepEqual(commands, ["pause"]);
    input.dispose();
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});
