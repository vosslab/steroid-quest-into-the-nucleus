# Changelog

## 2026-10-07

### Additions and New Features

- Add TypeScript simulation contracts, Solid menus/HUD, a Canvas 2D runtime, forgiving movement,
  checkpoints, optional fragments, receptor activation, and transcription recruitment.
- Add procedural regional illustrations, reduced decorative motion, and optional synthesized sound.
- Author all six stages, including six cytoplasm districts, nucleoplasm exploration, chromatin
  routes, and three forgiving transcription recruitment actions followed by emerging RNA.
- Document local preview, controls, lifecycle ownership, and biological model limits.
- Refresh the README with the confirmed live Play link, six-region learner activity, controls,
  concise setup, and documentation routes using the requested README documentation skill.
- Add 55 authored obstacles and increasing procedural cellular debris. Exaggerate schematic
  steroid/pocket flexibility while preserving the connected four-ring scaffold and red identity.
- Replace simple sound cues with optional algorithmic regional textures, evolving motifs,
  movement cues, converging binding tones, and transcription/ending phrases.
- Style the game as a molecular instrument with a layered bezel, specimen rails, coordinated
  HUD/footer surfaces, responsive controls, and reduced-motion hover/press feedback.

### Behavior or Interface Changes

- Compile Solid JSX through the esbuild JavaScript API while preserving the shell build interfaces
  and `dist/` output. Add Solid/compiler dependencies and the generated dependency lockfile.
- Keep campaign progress in the current session, with unlimited retries that retain fragments and
  completed milestones. Pause and clear input when gameplay loses focus.

### Fixes and Maintenance

- Correct seven infrastructure lint findings and prevent menu Escape from bubbling into a second
  pause after resume.
- Align the complementary receptor pocket with binding contact; move nucleosome artwork with
  its platforms; keep lipid bilayers visible and HRE/recruitment labels readable.
- Expand short campaign routes after the initial controls-only walkthrough measured 122.752
  wall seconds. Preserve fast movement and unlimited checkpoint retries.
- Cover authored checkpoint activation and restoration, and instrument browser animation frames
  to verify one scheduled loop through UI changes.
- Allow the camera to follow high air jumps above the original world origin.
- Silence algorithmic audio immediately on pause, including death and transition tails, and
  bound resource use while preserving initial mute and gesture-only audio activation.

### Decisions and Failures

- Use a generic nuclear steroid-receptor example and a continuously open pore route; movement
  abilities and obstacle geometry are arcade abstractions.
- Install the missing Playwright Chromium browser. macOS MachPort restrictions require elevated
  browser execution in this sandbox.

### Developer Tests and Notes

- Earlier expanded static specification review verifies 381 unique entity IDs and 64 supported,
  hazard-free authored checkpoint spawns. Subsequent steering reviews accept the added obstacles;
  fresh final game integration and rendered campaign review pass.
- Fresh `./check_codebase.sh` passes both typechecks, lint, formatting, and nine Node behavior
  tests; `./build_github_pages.sh` passes. Rebuilt browser smoke passes two tests, including
  keyboard focus, pause/retry, stable canvas identity, and animation-loop observations.
- Fresh repository hygiene: `source source_me.sh && python3 -m pytest -q` passes 997 tests;
  `git diff --check` passes. These checks precede the final documentation closeout.
- The expanded real-controls walkthrough completes in 293.286 wall seconds (293.15 simulation
  seconds), with two deaths and 37/64 fragments, ordered milestones, ending, and Replay.
  The 8-12 minute first-play target and human enjoyment remain unverified.
  Temporary browser artifacts stay under ignored
  `test-results/`. Agents performed local build/verification without a remote deployment
  action; the user confirms an existing live GitHub Pages site.
- Fresh steering specification and quality reviews pass the obstacle, debris, amplified binding,
  camera, README, and audio changes. Focused built-browser audio/motion acceptance passes:
  gesture activation, one reused context, silence after pause/blur/mute, visible amplified
  motion, pixel-stable pause, and reduced-motion suppression.
- Audio probes produce finite, nonzero output in all six regions; a 500-event burst stays within
  72 oscillators and peak 0.3104 without clipping. Pause/mute measurements reach zero after
  100 ms, and disposal closes the context. Subjective sound appeal remains unverified.
- CSS frame styling is implemented; final responsive rendered acceptance remains pending.
- User-requested crowded organelles and gel/tunnel movement are in progress. Prior walkthrough
  evidence describes the earlier accepted artifact; new corridor acceptance remains pending.
