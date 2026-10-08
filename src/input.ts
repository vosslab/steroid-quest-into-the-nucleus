import type { InputCommand, InputController, InputFrame } from "./types/input";

const LEFT = new Set(["ArrowLeft", "KeyA"]);
const RIGHT = new Set(["ArrowRight", "KeyD"]);
const JUMP = new Set(["Space", "KeyW", "ArrowUp"]);
const COMMANDS: Readonly<Record<string, InputCommand>> = { Escape: "pause", KeyR: "retry" };

export function createInput(
  canvas: HTMLCanvasElement,
  onCommand: (command: InputCommand) => void,
): InputController {
  const held = new Set<string>();
  let jumpPressed = false;
  const clear = (): void => {
    held.clear();
    jumpPressed = false;
  };
  const ownsFocus = (): boolean => document.activeElement === canvas;
  const keydown = (event: KeyboardEvent): void => {
    // ASVS 2.2.1: only explicit game keys are accepted, while the canvas owns focus.
    if (
      !ownsFocus() ||
      (!LEFT.has(event.code) &&
        !RIGHT.has(event.code) &&
        !JUMP.has(event.code) &&
        !Object.prototype.hasOwnProperty.call(COMMANDS, event.code))
    )
      return;
    event.preventDefault();
    const command = COMMANDS[event.code];
    if (command) {
      if (!event.repeat) onCommand(command);
      return;
    }
    if (JUMP.has(event.code) && !event.repeat && !held.has(event.code)) jumpPressed = true;
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
        jumpHeld: [...JUMP].some((key) => held.has(key)),
        jumpPressed,
      };
      jumpPressed = false;
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
