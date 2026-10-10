import { batch, createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import type { JSX } from "solid-js";
import { CAMPAIGN } from "./levels";
import { currentAction as getCurrentAction } from "./journey_presentation";
import { getEncounterProgress } from "./progression";
import { createRuntime } from "./runtime";
import type { Runtime } from "./types/runtime";
import type { LevelDefinition } from "./types/level";
import type { GameEvent, GamePhase } from "./types/simulation";

/** The canvas and runtime live for the component's entire lifetime. */
export function App(): JSX.Element {
  let canvas!: HTMLCanvasElement;
  let runtime: Runtime | undefined;
  let menu: HTMLElement | undefined;
  let captionTimeout: ReturnType<typeof setTimeout> | undefined;
  const [phase, setPhase] = createSignal<GamePhase>("title");
  const [stageIndex, setStageIndex] = createSignal(0);
  const [collected, setCollected] = createSignal(0);
  const [bound, setBound] = createSignal(false);
  const [checkpoint, setCheckpoint] = createSignal(false);
  const [recruitment, setRecruitment] = createSignal(0);
  const [caption, setCaption] = createSignal("");
  // Sound is on by default, but runtime waits for the Start gesture before creating audio.
  const [muted, setMuted] = createSignal(false);
  const [elapsed, setElapsed] = createSignal(0);
  const [requiredCompleted, setRequiredCompleted] = createSignal(0);
  const [requiredTotal, setRequiredTotal] = createSignal(0);
  const [currentObjective, setCurrentObjective] = createSignal("");
  const [currentAction, setCurrentAction] = createSignal("");
  const [destinationLabel, setDestinationLabel] = createSignal("");
  const [destinationReady, setDestinationReady] = createSignal(false);
  const stage = (): LevelDefinition | undefined => CAMPAIGN[stageIndex()];
  const totalCollectibles = CAMPAIGN.reduce((total, level) => total + level.collectibles.length, 0);
  const overlay = (): boolean => phase() === "title" || phase() === "paused" || phase() === "ended";
  const transcriptionUnderway = (): boolean =>
    stage()?.id === "transcription" && recruitment() >= 3;

  function syncState(): void {
    const state = runtime?.getState();
    if (!state) return;
    const level = CAMPAIGN[state.levelIndex];
    if (!level) return;
    const progress = getEncounterProgress(level, state.encounterPhases);
    const action = getCurrentAction(
      level,
      state.encounterPhases,
      state.levelTime,
      state.player.attachment,
    );
    batch(() => {
      setPhase(state.phase);
      setStageIndex(state.levelIndex);
      setCollected(state.collectedIds.size);
      setBound(state.receptorBound);
      setCheckpoint(state.checkpoint.id !== "start");
      setRecruitment(state.recruitmentCount);
      setElapsed(state.elapsed);
      setRequiredCompleted(progress.completed);
      setRequiredTotal(progress.total);
      setCurrentObjective(progress.current?.objective ?? level.objective);
      setCurrentAction(action?.text ?? "");
      setDestinationLabel(level.destination?.label ?? "");
      setDestinationReady(progress.ready);
    });
  }

  function receiveEvent(event: GameEvent): void {
    if (event.type === "caption") {
      setCaption(event.text);
      if (captionTimeout !== undefined) clearTimeout(captionTimeout);
      captionTimeout = setTimeout(() => setCaption(""), 6500);
    }
    syncState();
  }

  function play(action: "start" | "resume" | "retry" | "replay"): void {
    runtime?.[action]();
    syncState();
    canvas.focus();
  }

  function toggleSound(): void {
    const nextMuted = !muted();
    runtime?.setMuted(nextMuted);
    setMuted(nextMuted);
  }

  // Dialog focus is a DOM effect; it never creates or restarts the runtime.
  createEffect(() => {
    const currentPhase = phase();
    if (currentPhase === "title" || currentPhase === "paused" || currentPhase === "ended") {
      queueMicrotask(() => {
        if (phase() === currentPhase) menu?.querySelector<HTMLButtonElement>("button")?.focus();
      });
    }
  });

  function containMenuFocus(event: KeyboardEvent): void {
    if (event.key === "Escape" && phase() === "paused") {
      event.preventDefault();
      event.stopPropagation();
      play("resume");
      return;
    }
    if (event.key !== "Tab" || !menu) return;
    const buttons = menu.querySelectorAll<HTMLButtonElement>("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  onMount(() => {
    runtime = createRuntime({ canvas, levels: CAMPAIGN, onEvent: receiveEvent });
    syncState();
  });
  onCleanup(() => {
    runtime?.dispose();
    if (captionTimeout !== undefined) clearTimeout(captionTimeout);
  });

  return (
    <main class="quest-shell" data-phase={phase()} data-stage={stage()?.id}>
      <header class="masthead">
        <div class="wordmark">
          <span class="steroid-mark" aria-hidden="true">
            S
          </span>
          <div>
            <h1>Steroid Quest</h1>
            <p>Into the nucleus</p>
          </div>
        </div>
        <span class="edition">A molecular arcade adventure</span>
      </header>
      <section class="game-frame" aria-label="Steroid Quest adventure">
        <div class="hud" aria-hidden={phase() === "title"}>
          <div class="stage-label">
            <span class="eyebrow">
              Stage {stageIndex() + 1} / {CAMPAIGN.length}
            </span>
            <h2>
              {transcriptionUnderway() ? "Transcription underway" : (stage()?.name ?? "Membrane")}
            </h2>
            <p>
              {transcriptionUnderway()
                ? "RNA polymerase is producing RNA while the complex stays bound."
                : currentObjective()}
            </p>
            <Show when={requiredTotal() > 0}>
              <div class="required-objective" role="status" aria-live="polite" aria-atomic="true">
                <span class="required-count">
                  Required {requiredCompleted()} / {requiredTotal()}
                </span>
                <span class="encounter-segments" aria-hidden="true">
                  <For each={Array.from({ length: requiredTotal() })}>
                    {(_, index) => <i classList={{ complete: index() < requiredCompleted() }} />}
                  </For>
                </span>
                <span class="required-action">
                  {phase() === "transition"
                    ? `Entering ${destinationLabel()}`
                    : destinationReady()
                      ? `Ready: enter ${destinationLabel()}`
                      : currentAction()}
                </span>
              </div>
            </Show>
          </div>
          <div class="hud-tools">
            <span
              class="collection"
              aria-label={`${collected()} of ${totalCollectibles} fragments collected`}
            >
              <span aria-hidden="true">&#9671;</span> {collected()}
              <span class="dim"> / {totalCollectibles}</span>
            </span>
            <button
              class="small-button"
              onPointerDown={(event) => event.preventDefault()}
              onClick={toggleSound}
              aria-pressed={!muted()}
              disabled={overlay()}
            >
              Sound {muted() ? "off" : "on"}
            </button>
            <button
              class="small-button"
              disabled={overlay()}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => {
                runtime?.pause();
                syncState();
              }}
            >
              Pause
            </button>
          </div>
        </div>
        <div class="viewport">
          <canvas
            ref={(element) => {
              canvas = element;
            }}
            width="960"
            height="540"
            tabindex={overlay() ? -1 : 0}
            aria-label="Steroid Quest game world. Arrow Left and Arrow Right steer. Space pulses upward; hold Space for upward thrust. Optional fine control: Arrow Up and Arrow Down provide gentle thrust."
          />
          <Show when={phase() === "title"}>
            <section
              ref={(element) => {
                menu = element;
              }}
              class="overlay title-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-heading"
              onKeyDown={containMenuFocus}
            >
              <div class="menu-card">
                <p class="eyebrow">Small molecule. Big mission.</p>
                <h2 id="welcome-heading">
                  A cell awaits.
                  <br />
                  Make your way inside.
                </h2>
                <p class="intro">
                  Cross the membrane, find your receptor,
                  <br class="wide-only" /> and activate a gene.
                </p>
                <button class="primary-button" onClick={() => play("start")}>
                  Start adventure <span aria-hidden="true">&#8594;</span>
                </button>
                <p class="session-note">
                  Six stages &middot; Unlimited retries &middot; Optional fragments
                </p>
                <button class="text-button" onClick={toggleSound} aria-pressed={!muted()}>
                  Sound {muted() ? "off" : "on"}
                </button>
                <div class="start-controls">
                  <span>
                    <kbd>Left</kbd>
                    <kbd>Right</kbd> <b>Steer</b>
                  </span>
                  <span>
                    <kbd>Space</kbd> <b>Pulse / hold to rise</b>
                  </span>
                  <span class="optional-controls">
                    <kbd>Up</kbd>
                    <kbd>Down</kbd> <b>Optional fine control</b>
                  </span>
                </div>
              </div>
            </section>
          </Show>
          <Show when={phase() === "paused"}>
            <section
              ref={(element) => {
                menu = element;
              }}
              class="overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pause-heading"
              onKeyDown={containMenuFocus}
            >
              <div class="menu-card compact">
                <p class="eyebrow">Take a breath</p>
                <h2 id="pause-heading">Journey paused</h2>
                <p>Your checkpoint and fragments are safe.</p>
                <p class="pause-controls">
                  <kbd>Left</kbd>
                  <kbd>Right</kbd> steer; <kbd>Space</kbd> pulse / hold to rise.
                  <br />
                  Optional fine control: <kbd>Up</kbd>
                  <kbd>Down</kbd> gentle thrust.
                </p>
                <button class="primary-button" onClick={() => play("resume")}>
                  Resume
                </button>
                <button class="secondary-button" onClick={() => play("retry")}>
                  Retry checkpoint
                </button>
                <button class="text-button" onClick={toggleSound} aria-pressed={!muted()}>
                  Sound {muted() ? "off" : "on"}
                </button>
              </div>
            </section>
          </Show>
          <Show when={phase() === "ended"}>
            <section
              ref={(element) => {
                menu = element;
              }}
              class="overlay ending-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ending-heading"
              onKeyDown={containMenuFocus}
            >
              <div class="menu-card compact">
                <p class="eyebrow">Mission complete</p>
                <h2 id="ending-heading">
                  GENE EXPRESSION
                  <br />
                  ACTIVATED
                </h2>
                <p>The complex stays bound as an RNA transcript emerges.</p>
                <div class="end-tally">
                  <strong>
                    {collected()} / {totalCollectibles}
                  </strong>
                  <span>fragments collected</span>
                </div>
                <p class="session-note">
                  Journey time {Math.floor(elapsed() / 60)}:
                  {String(Math.floor(elapsed() % 60)).padStart(2, "0")}
                </p>
                <button class="primary-button" onClick={() => play("replay")}>
                  Replay
                </button>
              </div>
            </section>
          </Show>
          <Show when={phase() === "recruiting"}>
            <div class="recruitment-guide">
              <Show
                when={!transcriptionUnderway()}
                fallback={
                  <>
                    <strong>Transcription underway</strong>
                    <span>RNA polymerase is producing RNA.</span>
                    <span class="recruitment-count">3 / 3 recruited</span>
                  </>
                }
              >
                <strong>Assemble the machinery</strong>
                <span>Press Space when the marker enters the bright zone.</span>
                <span class="recruitment-count">
                  {recruitment()} / 3 recruited &middot; Miss? Try again.
                </span>
              </Show>
            </div>
          </Show>
          <Show when={caption() && !overlay() && phase() !== "recruiting"}>
            <p class="milestone" role="status">
              {caption()}
            </p>
          </Show>
          <Show when={phase() === "respawning"}>
            <span class="respawn-label">Back to your checkpoint...</span>
          </Show>
        </div>
        <footer class="game-footer">
          <div class="progress-track" aria-label="Journey stages">
            <For each={CAMPAIGN}>
              {(level, index) => (
                <span
                  classList={{
                    current: index() === stageIndex(),
                    complete: index() < stageIndex(),
                  }}
                  title={level.name}
                >
                  <span class="stage-dot" />
                  <span class="stage-name">{level.name}</span>
                </span>
              )}
            </For>
          </div>
          <span class="ability-status">
            {bound()
              ? "Complex active / DNA recognition enabled"
              : "Red steroid / Find your receptor"}
          </span>
        </footer>
      </section>
      <div class="below-game">
        <p class="control-line">
          <kbd>Esc</kbd> Pause <span>·</span> <kbd>R</kbd> Retry checkpoint <span>·</span>{" "}
          <span>{checkpoint() ? "Checkpoint saved" : "Progress stays in this session"}</span>
        </p>
        <details>
          <summary>About this journey</summary>
          <p>
            This generic nuclear steroid-receptor pathway is an arcade model. Fluid forces, pulses,
            transport, and obstacles are exaggerated game abstractions. The open pore is this
            level's route; steroids do not universally require pores for nuclear entry, and receptor
            locations vary.
          </p>
          <p>
            Binding involves small shape adjustments in the steroid and receptor. The moving
            four-ring scaffold and settling pocket are schematic views of flexibility; they do not
            show a chemical conversion or predict receptor specificity.
          </p>
        </details>
      </div>
    </main>
  );
}
