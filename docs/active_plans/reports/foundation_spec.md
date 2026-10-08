# Foundation specification review

Verdict: ACCEPT for the scoped contracts and Solid build foundation. No material specification
finding remains in this scope. This is not gameplay or final release acceptance.

## Reviewed evidence

- `src/types/level.ts:2` defines all six authored regions. Lines 5-17 provide solid, one-way,
  bounce, moving-platform, hazard, checkpoint, and milestone trigger geometry. Lines 18-23 keep
  decoration separate from collision and require stage-prefixed content IDs.
- `src/types/simulation.ts:3-14` covers velocity, buffered/coyote jumping, air-jump capacity,
  platform carry identity, and checkpoint restoration. Lines 17-32 retain campaign collections,
  activated triggers, receptor/HRE binding, recruitment progress, and phase clocks.
- `src/types/simulation.ts:34-54` gives UI events and an authoritative simulation command
  boundary. Recruiting and bound state support the held-binding transcription sequence; the
  future simulation must enforce receptor/HRE/recruitment ordering.
- `src/types/input.ts:1-8` separates sampled movement/jump state from explicit pause, retry,
  and focus-loss commands. Actual key ownership, scroll suppression, and focus clearing remain
  implementation acceptance checks.
- `src/types/runtime.ts:3-13` includes start/pause/resume/retry/replay, mute control, read access,
  and disposal. `src/types/render.ts:3-10` separates render inputs, viewport dimensions, reduced
  motion, and renderer disposal from simulation behavior.
- `src/game_state.ts:21-40` initializes session-only campaign progress; `src/constants.ts:2-15`
  establishes a fixed step and forgiving movement/respawn defaults.
- `pipeline/build.mjs:1-17` uses esbuild's JavaScript API with the Solid compiler plugin.
  `build_github_pages.sh:63-72` retains the shell front door and `dist/` output contract.
  `tsconfig.json:27-32` adds Solid JSX without weakening strict compiler settings. The dependency
  lockfile is present.
- `src/app.tsx:18-28` keeps the canvas outside conditional menus, permitting a single runtime
  mount when gameplay arrives. `src/main.ts:4-10` supplies one Solid mount entry.

## Clarifications resolved

The reviewer asked foundation to clarify campaign-wide ID uniqueness and retry milestone
preservation. These are now recorded in the level and checkpoint contract comments. Foundation
also handed off that receptor binding establishes an immediate checkpoint; retry preserves
collections, trigger activations, binding, HRE progress, and recruitment progress.

Foundation explicitly handed off UI ownership of `onMount`/`onCleanup` and runtime ownership of
animation frame, input listener, and observer disposal. No runtime exists yet, so actual lifecycle
correctness and the planned `docs/SOLID_MODEL.md` remain later implementation evidence.

## Verification limits

The reviewer independently ran `npx tsc --noEmit -p tsconfig.json`: PASS. Foundation reports PASS
for dependency installation, `./check_codebase.sh`, and `./build_github_pages.sh`. Foundation's
first browser command stopped before app launch because Chromium was missing. After installing
Chromium, the manager reports PASS for `./check_codebase.sh`, `./build_github_pages.sh`, and
`./run_playwright_tests.sh` (one test, 2.1 seconds). There are no Node gameplay tests yet. This
establishes the foundation browser gate, not the later full campaign browser acceptance.

Physics behavior, continuous membrane/pore presentation, transformed-player visibility, real
keyboard progression, transcription timing, accessibility, sound, playability, and the 8-12 minute
target are outside this foundation review. They remain required campaign acceptance evidence.
