import { createAudio } from "./audio";
import { FIXED_STEP } from "./constants";
import { createInput } from "./input";
import { createRenderer } from "./renderer";
import { createSimulation } from "./simulation";
import type { Runtime, RuntimeOptions } from "./types/runtime";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;

/** One animation loop owns the simulation and canvas for the lifetime of the mounted UI. */
export function createRuntime(options: RuntimeOptions): Runtime {
  const { canvas, levels, onEvent } = options;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is required to play Steroid Quest.");
  const audio = createAudio();
  const simulation = createSimulation(levels, (event) => {
    audio.play(event);
    onEvent(event);
  });
  const renderer = createRenderer(canvas);
  let disposed = false;
  let animationFrame = 0;
  let lastTime: number | undefined;
  let accumulator = 0;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionPreference.matches;
  const preferenceChanged = (): void => {
    reducedMotion = motionPreference.matches;
  };
  motionPreference.addEventListener("change", preferenceChanged);
  const pause = (): void => {
    if (disposed) return;
    input.clear();
    simulation.pause();
    const level = levels[simulation.state.levelIndex];
    if (level) audio.update(simulation.state, level.id);
    accumulator = 0;
  };
  const input = createInput(canvas, (command) => {
    if (command === "retry") {
      input.clear();
      simulation.retry();
    } else if (command === "focus-loss") pause();
    else if (simulation.state.phase === "paused") resume();
    else pause();
  });
  const focus = (): void => {
    canvas.focus({ preventScroll: true });
  };
  const resume = (): void => {
    if (disposed) return;
    input.clear();
    simulation.resume();
    focus();
  };
  const resize = (): void => {
    const box = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round((box.width || VIEW_WIDTH) * ratio));
    const height = Math.max(1, Math.round((box.height || VIEW_HEIGHT) * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener("resize", resize);
  resize();

  const observeState = (): void => {
    const state = simulation.state;
    // Read-only browser observations. The simulation never reads these attributes.
    canvas.dataset.phase = state.phase;
    canvas.dataset.stage = levels[state.levelIndex]?.id ?? "";
    canvas.dataset.playerX = state.player.x.toFixed(2);
    canvas.dataset.playerY = state.player.y.toFixed(2);
    canvas.dataset.grounded = String(state.player.grounded);
    canvas.dataset.standingPlatform = state.player.standingOnId ?? "";
    canvas.dataset.receptorBound = String(state.receptorBound);
    canvas.dataset.hreBound = String(state.hreBound);
    canvas.dataset.recruitmentClock = state.recruitmentClock.toFixed(4);
    canvas.dataset.recruitmentCount = String(state.recruitmentCount);
    canvas.dataset.elapsed = state.elapsed.toFixed(2);
    canvas.dataset.deaths = String(state.deathCount);
    canvas.dataset.checkpoint = state.checkpoint.id;
    canvas.dataset.collected = String(state.collectedIds.size);
  };
  const frame = (time: number): void => {
    if (disposed) return;
    const elapsed = lastTime === undefined ? 0 : Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    accumulator += elapsed;
    if (accumulator >= FIXED_STEP) {
      const sampled = input.sample();
      let firstStep = true;
      while (accumulator >= FIXED_STEP) {
        simulation.step({ ...sampled, jumpPressed: firstStep && sampled.jumpPressed }, FIXED_STEP);
        firstStep = false;
        accumulator -= FIXED_STEP;
      }
    }
    context.setTransform(canvas.width / VIEW_WIDTH, 0, 0, canvas.height / VIEW_HEIGHT, 0, 0);
    const level = levels[simulation.state.levelIndex];
    if (level) audio.update(simulation.state, level.id);
    if (level)
      renderer.draw({
        state: simulation.state,
        level,
        canvasWidth: VIEW_WIDTH,
        canvasHeight: VIEW_HEIGHT,
        reducedMotion,
      });
    observeState();
    animationFrame = requestAnimationFrame(frame);
  };
  animationFrame = requestAnimationFrame(frame);
  return {
    start(): void {
      if (!disposed) {
        input.clear();
        simulation.start();
        focus();
      }
    },
    pause,
    resume,
    retry(): void {
      if (!disposed) {
        input.clear();
        simulation.retry();
        focus();
      }
    },
    replay(): void {
      if (!disposed) {
        input.clear();
        simulation.replay();
        focus();
      }
    },
    setMuted(muted: boolean): void {
      audio.setMuted(muted);
    },
    getState: () => simulation.state,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(animationFrame);
      input.dispose();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      motionPreference.removeEventListener("change", preferenceChanged);
      renderer.dispose();
      audio.dispose();
    },
  };
}
