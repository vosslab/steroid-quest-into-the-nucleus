import { createAudio } from "./audio";
import { FIXED_STEP } from "./constants";
import { createInput } from "./input";
import { createRenderer } from "./renderer";
import { getEncounterProgress } from "./progression";
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
  const renderer = createRenderer(canvas);
  const simulation = createSimulation(levels, (event) => {
    if (event.type === "transition-start") input.clear();
    audio.play(event);
    renderer.play(event);
    onEvent(event);
  });
  let disposed = false;
  let animationFrame = 0;
  let lastTime: number | undefined;
  let accumulator = 0;
  // Keep the title preference in memory without creating AudioContext before Start.
  let soundMuted = false;
  let started = false;
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
    const level = levels[state.levelIndex];
    const progress = level && getEncounterProgress(level, state.encounterPhases);
    const nextLevel = levels[state.levelIndex + 1];
    // Read-only browser observations. The simulation never reads these attributes.
    canvas.dataset.phase = state.phase;
    canvas.dataset.stage = levels[state.levelIndex]?.id ?? "";
    canvas.dataset.playerX = state.player.x.toFixed(2);
    canvas.dataset.playerY = state.player.y.toFixed(2);
    canvas.dataset.playerVx = state.player.vx.toFixed(2);
    canvas.dataset.playerVy = state.player.vy.toFixed(2);
    canvas.dataset.attachmentId = state.player.attachment?.id ?? "";
    canvas.dataset.attachmentKind = state.player.attachment?.kind ?? "";
    canvas.dataset.encounterPhases = JSON.stringify(Object.fromEntries(state.encounterPhases));
    canvas.dataset.receptorBound = String(state.receptorBound);
    canvas.dataset.hreBound = String(state.hreBound);
    canvas.dataset.recruitmentClock = state.recruitmentClock.toFixed(4);
    canvas.dataset.recruitmentCount = String(state.recruitmentCount);
    canvas.dataset.elapsed = state.elapsed.toFixed(2);
    canvas.dataset.deaths = String(state.deathCount);
    canvas.dataset.checkpoint = state.checkpoint.id;
    canvas.dataset.checkpointOrder = String(state.checkpoint.order);
    canvas.dataset.collected = String(state.collectedIds.size);
    canvas.dataset.requiredCompleted = String(progress?.completed ?? 0);
    canvas.dataset.requiredTotal = String(progress?.total ?? 0);
    canvas.dataset.currentEncounterId = progress?.current?.id ?? "";
    canvas.dataset.currentObjective = progress?.current?.objective ?? level?.objective ?? "";
    canvas.dataset.destinationId = level?.destination?.id ?? "";
    canvas.dataset.destinationReady = String(
      Boolean(level?.destination && nextLevel && progress?.ready) &&
        (nextLevel?.id !== "dna" || state.receptorBound) &&
        (nextLevel?.id !== "transcription" || (state.receptorBound && state.hreBound)),
    );
    canvas.dataset.destinationX = level?.destination?.center.x.toFixed(2) ?? "";
    canvas.dataset.destinationY = level?.destination?.center.y.toFixed(2) ?? "";
    canvas.dataset.transitionElapsed = state.transition?.elapsed.toFixed(4) ?? "";
    canvas.dataset.transitionDuration = state.transition?.duration.toFixed(4) ?? "";
    canvas.dataset.transitionDestinationId = state.transition?.destinationId ?? "";
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
        simulation.step(
          { ...sampled, pulsePressed: firstStep && sampled.pulsePressed },
          FIXED_STEP,
        );
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
        nextLevel: levels[simulation.state.levelIndex + 1],
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
        started = true;
        audio.setMuted(soundMuted);
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
      soundMuted = muted;
      if (started) audio.setMuted(muted);
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
