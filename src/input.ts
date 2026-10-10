import type { InputCommand, InputController, InputFrame } from "./types/input";

const LEFT = new Set(["ArrowLeft"]);
const RIGHT = new Set(["ArrowRight"]);
const UP = new Set(["ArrowUp"]);
const DOWN = new Set(["ArrowDown"]);
const PULSE = new Set(["Space"]);
const COMMANDS: Readonly<Record<string, InputCommand>> = { Escape: "pause", KeyR: "retry" };

export function createInput(
  canvas: HTMLCanvasElement,
  onCommand: (command: InputCommand) => void,
): InputController {
  const held = new Set<string>();
  let pulsePressed = false;
  const clear = (): void => {
    held.clear();
    pulsePressed = false;
  };
  const ownsFocus = (): boolean => document.activeElement === canvas;
  const keydown = (event: KeyboardEvent): void => {
    // ASVS 2.2.1: only explicit game keys are accepted, while the canvas owns focus.
    if (
      !ownsFocus() ||
      (!LEFT.has(event.code) &&
        !RIGHT.has(event.code) &&
        !UP.has(event.code) &&
        !DOWN.has(event.code) &&
        !PULSE.has(event.code) &&
        !Object.prototype.hasOwnProperty.call(COMMANDS, event.code))
    )
      return;
    event.preventDefault();
    const command = COMMANDS[event.code];
    if (command) {
      if (!event.repeat) onCommand(command);
      return;
    }
    // ASVS 2.2.1: one physical Space press creates one pulse, regardless of auto-repeat.
    if (PULSE.has(event.code) && !event.repeat && !held.has(event.code)) pulsePressed = true;
    held.add(event.code);
  };
  const keyup = (event: KeyboardEvent): void => {
    held.delete(event.code);
  };
  const loseFocus = (): void => {
    clear();
    onCommand("focus-loss");
  };
  const visibility = (): void => {
    if (document.hidden) loseFocus();
  };
  const focusCanvas = (): void => {
    canvas.focus();
  };
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  window.addEventListener("blur", loseFocus);
  canvas.addEventListener("blur", loseFocus);
  canvas.addEventListener("pointerdown", focusCanvas);
  document.addEventListener("visibilitychange", visibility);
  return {
    sample(): InputFrame {
      const frame = {
        left: [...LEFT].some((key) => held.has(key)),
        right: [...RIGHT].some((key) => held.has(key)),
        up: [...UP].some((key) => held.has(key)),
        down: [...DOWN].some((key) => held.has(key)),
        pulseHeld: [...PULSE].some((key) => held.has(key)),
        pulsePressed,
      };
      pulsePressed = false;
      return frame;
    },
    clear,
    dispose(): void {
      clear();
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", loseFocus);
      canvas.removeEventListener("blur", loseFocus);
      canvas.removeEventListener("pointerdown", focusCanvas);
      document.removeEventListener("visibilitychange", visibility);
    },
  };
}
