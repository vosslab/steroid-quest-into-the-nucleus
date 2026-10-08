# Final integration review

## Scope and result

This fresh, independent integration review accepts the current game implementation and its
verified built artifact. It covers the six-stage campaign, authoritative simulation/Solid/canvas
boundaries, progressive obstacles and debris, amplified schematic steroid movement, optional
algorithmic audio, lifecycle cleanup, documentation, and test-output isolation.

The CSS-only frame styling request began after this review's exact-build walkthrough. Its focused
rendered review is the remaining presentation gate for the eventual release verdict; it cannot
change physics or campaign progression. The game-integration verdict below applies to the
SHA-identified built artifact recorded in the final walkthrough.

## Exact built-artifact evidence

`test-results/campaign/report.json` records an ordinary-key Chromium journey through the current
build. The controller only presses real keys and observes public canvas data attributes; it does
not assign player state, milestones, or progression.

- The full journey ended in 293.286 wall seconds and 293.15 simulation seconds. It entered all
  six stages in order, formed the receptor complex, reached DNA/HRE, completed three recruitment
  inputs, showed RNA, reached the ending, and replayed onto the same canvas.
- Two real recoveries occurred: a deliberate early membrane death after collecting one fragment,
  then a cytoplasm death at checkpoint 12 while retaining 16 fragments. The ending showed 37 of
  64 fragments, confirming optional collection does not gate completion.
- The run captured membrane/bilayer, cytoplasm/filament garden, envelope/open pore, receptor and
  three binding states, DNA/moving nucleosomes/chromatin fold/HRE, transcription/timing/RNA,
  ending/replay, and a 390-pixel reduced-motion title. The walkthrough owner visually inspected
  all 20 captures.
- No page errors occurred. Animation instrumentation observed exactly one maximum and one pending
  request-animation-frame callback. Replay retained the canvas and reset the stage to membrane.
- The artifact hash is `727c34a68ed51c28e2c90b5d07f909ea7abe003db9f8a1ad764b910d6467d091` for
  `dist/main.js`, matching the current disk build at review. The report also records exact hashes
  for campaign source, renderer, runtime, application, and walkthrough helper.

The completed route is an optimized automated control run, not evidence that a first-time human
will take 8--12 minutes or find the movement enjoyable. Those human acceptance criteria remain
unverified and are documented as such in the README and project records.

## Source and lifecycle review

- Simulation remains the only authority for collisions, checkpoints, receptor binding, HRE
  docking, recruitment, and replay. Render-only flex, pocket settling, debris, and camera behavior
  cannot alter progression.
- The red steroid retains one connected four-ring contour throughout its exaggerated flex and bound
  pose. Reduced motion freezes decoration while leaving gameplay and moving collision geometry
  authoritative.
- Debris has deterministic world-cell placement behind collision/trigger artwork, increases across
  regions and within long regions, and clears enough space for the transcription climax.
- Audio is initially muted and creates its context only on the explicit Sound control. Its single
  runtime-frame scheduler has no separate timer/loop, bounds active primary voices at 36, and
  clears cues on pause, mute, replay, transition, death, and disposal. Built-app measurements
  show zero contexts before activation, finite nonzero sound after activation, and zero analyser
  signal after pause, blur, and mute. The independent bounded probe reports finite non-clipping
  output across all regional/event variants and a closed context after disposal.
- Input remains allowlisted and canvas-focus-scoped. Runtime disposal cancels the frame,
  disconnects observers/listeners, disposes input/renderer, and closes any created audio context.
- `playwright.config.ts` now uses `test-results/playwright` as its `outputDir`. Playwright cleanup
  therefore does not delete the distinct durable campaign/audio evidence folders. This is a narrow
  configuration correction and preserves normal test discovery and ignored temporary probes.

## Documentation and checks

The README accurately offers the user-confirmed live GitHub Pages link, setup and controls,
session-only progress, the generic biological model's limits, optional sound, and the unresolved
human-playthrough qualification. `SOLID_MODEL.md`, `DESIGN_DECISIONS.md`,
`HUMAN_GUIDANCE.md`, and `CHANGELOG.md` consistently record the authority boundary, biological
scope, lifecycle behavior, user steering, and validation status.

Manager-run final gates passed on the reviewed source/build:

- `./check_codebase.sh`: TypeScript, lint, formatting, and 9 simulation tests.
- `./build_github_pages.sh`: production `dist/` build.
- `./run_playwright_tests.sh --build`: 2 browser smoke tests.
- `source source_me.sh && python3 -m pytest -q`: 997 hygiene tests.
- `git diff --check`: clean.

## Verdict

**Game integration passes.** No material campaign, lifecycle, documentation, or evidence defect
was found. Complete the isolated CSS-frame rendered acceptance after its CSS-only change, then
retain the stated limitation that human first-play timing and subjective enjoyment have not yet
been observed.
