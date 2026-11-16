import type { InputCommand, InputController, InputFrame, TouchControls } from "./types/input";

const LEFT = new Set(["ArrowLeft"]);
const RIGHT = new Set(["ArrowRight"]);
const UP = new Set(["ArrowUp"]);
const DOWN = new Set(["ArrowDown"]);
const PULSE = new Set(["Space"]);
const COMMANDS: Readonly<Record<string, InputCommand>> = { Escape: "pause", KeyR: "retry" };

export function createInput(
  canvas: HTMLCanvasElement,
  onCommand: (command: InputCommand) => void,
  touchControls?: TouchControls,
): InputController {
  const held = new Set<string>();
  let pulsePressed = false;
  let touchPulsePressed = false;
  let directionId: number | undefined;
  let pulseId: number | undefined;
  let originX = 0;
  let originY = 0;
  let dx = 0;
  let dy = 0;
  const releaseCapture = (element: HTMLButtonElement | undefined, id: number | undefined): void => {
    if (id !== undefined && element?.hasPointerCapture(id)) element.releasePointerCapture(id);
  };
  const clear = (): void => {
    held.clear();
    pulsePressed = false;
    touchPulsePressed = false;
    const previousDirection = directionId;
    const previousPulse = pulseId;
    directionId = pulseId = undefined;
    dx = dy = 0;
    releaseCapture(touchControls?.direction, previousDirection);
    releaseCapture(touchControls?.pulse, previousPulse);
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
  const touchAllowed = (): boolean =>
    window.matchMedia("(pointer: coarse) and (orientation: landscape)").matches && ownsFocus();
  const directionDown = (event: PointerEvent): void => {
    event.preventDefault();
    // ASVS 2.2.1: accept one touch pointer per control and finite CSS coordinates only.
    if (
      event.pointerType !== "touch" ||
      directionId !== undefined ||
      !touchAllowed() ||
      !Number.isFinite(event.clientX) ||
      !Number.isFinite(event.clientY)
    )
      return;
    directionId = event.pointerId;
    originX = event.clientX;
    originY = event.clientY;
    dx = dy = 0;
    touchControls?.direction.setPointerCapture(event.pointerId);
  };
  const directionMove = (event: PointerEvent): void => {
    if (
      event.pointerId !== directionId ||
      !Number.isFinite(event.clientX) ||
      !Number.isFinite(event.clientY)
    )
      return;
    dx = event.clientX - originX;
    dy = event.clientY - originY;
  };
  const directionEnd = (event: PointerEvent): void => {
    if (event.pointerId !== directionId) return;
    directionId = undefined;
    dx = dy = 0;
    releaseCapture(touchControls?.direction, event.pointerId);
  };
  const pulseDown = (event: PointerEvent): void => {
    event.preventDefault();
    if (event.pointerType !== "touch" || pulseId !== undefined || !touchAllowed()) return;
    pulseId = event.pointerId;
    touchPulsePressed = true;
    touchControls?.pulse.setPointerCapture(event.pointerId);
  };
  const pulseEnd = (event: PointerEvent): void => {
    if (event.pointerId !== pulseId) return;
    pulseId = undefined;
    // A normal quick tap must survive until the next fixed-step sample.
    if (event.type !== "pointerup") touchPulsePressed = false;
    releaseCapture(touchControls?.pulse, event.pointerId);
  };
  touchControls?.direction.addEventListener("pointerdown", directionDown);
  touchControls?.direction.addEventListener("pointermove", directionMove);
  touchControls?.pulse.addEventListener("pointerdown", pulseDown);
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"] as const) {
    touchControls?.direction.addEventListener(type, directionEnd);
    touchControls?.pulse.addEventListener(type, pulseEnd);
  }
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
  window.addEventListener("blur", loseFocus);
  canvas.addEventListener("blur", loseFocus);
  canvas.addEventListener("pointerdown", focusCanvas);
  document.addEventListener("visibilitychange", visibility);
  return {
    sample(): InputFrame {
      const frame = {
        left: held.has("ArrowLeft") || dx < -12,
        right: held.has("ArrowRight") || dx > 12,
        up: held.has("ArrowUp") || dy < -12,
        down: held.has("ArrowDown") || dy > 12,
        pulseHeld: held.has("Space") || pulseId !== undefined,
        pulsePressed: pulsePressed || touchPulsePressed,
      };
      pulsePressed = false;
      touchPulsePressed = false;
      return frame;
    },
    clear,
    dispose(): void {
      clear();
      touchControls?.direction.removeEventListener("pointerdown", directionDown);
      touchControls?.direction.removeEventListener("pointermove", directionMove);
      touchControls?.pulse.removeEventListener("pointerdown", pulseDown);
      for (const type of ["pointerup", "pointercancel", "lostpointercapture"] as const) {
        touchControls?.direction.removeEventListener(type, directionEnd);
        touchControls?.pulse.removeEventListener(type, pulseEnd);
      }
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", loseFocus);
      canvas.removeEventListener("blur", loseFocus);
      canvas.removeEventListener("pointerdown", focusCanvas);
      document.removeEventListener("visibilitychange", visibility);
    },
  };
}
