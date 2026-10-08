# Changelog

## 2026-10-07

### Additions and New Features

- Add five bounded semantic encounter recipes: ribosome bridge, organelle pinball, vesicle
  express, orbit chamber, and low-gravity shaft. Compile them into existing level arrays with
  static recovery, generated checkpoints, and selected deterministic upper caches.
- Reauthor the surprise campaign with a post-bilayer pinball pop, giant cytoplasm pinball,
  contact-armed crumble shortcuts, ER express fields, vesicle/nucleosome orbits, pore suction,
  low-gravity loft and required receptor hurdles, and a high DNA launch shortcut.
- Draw readable armed/absent platform states, field boundaries, and orbit silhouettes; advance
  polymerase and grow one connected RNA backbone after recruitment.
- Document exact recipe controls and validation, current stage beats, deferred physical systems,
  and separate source/integration/built-route evidence. Refresh stale README route descriptions.

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
- Add current direction cues, gel launch ripples, a binding wave, and recruitment/RNA assembly
  artwork driven by simulation events. Reduced motion uses settled/static presentation.
- Recompose cytoplasm into six typed districts: gel squeeze, organelle weave, drifting vesicles
  and a lifting current, a directional spring chamber, a vertical filament canopy, and a nuclear
  approach tunnel. Add a membrane launch loft and a post-pore vesicle launch.
- Recompose receptor and DNA stages into nucleoplasm squeezes, gel eruptions, current-assisted
  roof secrets, a moving nucleosome wave, chromatin underpasses, and a recognition basin.
  Keep the final recruitment scene readable in one camera view.

### Behavior or Interface Changes

- Compile Solid JSX through the esbuild JavaScript API while preserving the shell build interfaces
  and `dist/` output. Add Solid/compiler dependencies and the generated dependency lockfile.
- Keep campaign progress in the current session, with unlimited retries that retain fragments and
  completed milestones. Pause and clear input when gameplay loses focus.
- Add authored acceleration fields and directional bounce launches. Holding the travel direction
  preserves excess launch/current speed with gradual relaxation; opposite input retains stronger
  steering for recovery.
- Favor varied movement and discovery over padded travel: the revised cytoplasm is 13,815
  world units wide, with required and optional launch routes and nearby recovery.

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
- Wrap the frame's controls and allow menu overlays to scroll at narrow widths and enlarged
  text sizes, preserving access to the Start action.

### Decisions and Failures

- Use a generic nuclear steroid-receptor example and a continuously open pore route; movement
  abilities and obstacle geometry are arcade abstractions.
- Install the missing Playwright Chromium browser. macOS MachPort restrictions require elevated
  browser execution in this sandbox.

### Developer Tests and Notes

- Final surprise source-spec and quality reviews pass infrastructure and authored scopes. Fresh
  integration commands pass 36 Node behavior tests, the explicit Pages build, and two rebuilt
  browser smoke tests; full Python hygiene passes 1033 tests.
- Accepted surprise keyboard walk completes in 111.833 wall seconds / 111.66 simulation seconds,
  with one deliberate hazard death and 13/27 fragments. It exercises all six stages, five encounter
  mechanics, optional cache return, checkpoint recovery/retention, recruitment/RNA/ending, and Replay.
  The 390-pixel reduced-motion route checks Start/movement/Pause/Resume/Retry, stable canvas, and
  at most one pending animation callback. Full-cycle orbit and armed-timer pause belong to source
  fixed-step checks; the built walk observes a 450 ms no-input ride. Human enjoyment remains unmeasured.
- Accepted walk records 58 captures, no browser errors or source drift, and matching served/build
  hashes. Independent final integration passes, matching all 32 recorded hashes and inspecting
  eight accepted captures within its explicit selected-route and viewport scope.

- Begin the surprise escalation revision with a design investigation separating existing
  primitives, candidate compositions, and deferred mechanics. Document deterministic optional
  discoveries and collapse-chain chase pressure with safe recovery. Infrastructure reviews pass;
  final authored and built-route acceptance is recorded separately.
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
- CSS frame styling was implemented before the subsequent responsive acceptance below.
- Frame-only rendered acceptance now passes 18 states, including actual doubled font size at
  a 320-pixel viewport. See [frame_visual_acceptance.md](active_plans/reports/frame_visual_acceptance.md).
  Fresh campaign geometry and JavaScript acceptance remain separate and pending.
- User-requested crowded organelles and gel/tunnel movement are in progress. Prior walkthrough
  evidence describes the earlier accepted artifact; new corridor acceptance remains pending.
- Begin the cellular discovery revision with separate level, interaction, presentation, frame,
  specification, walkthrough, and documentation owners. Prior 293.286-second walkthrough and
  integration results remain evidence for the earlier artifact; fresh revision acceptance is pending.
- Focused kinetic audio probes produce finite bounce output with peak 0.02473; a 500-event burst
  peaks at 0.28679. Pause, mute, and Replay measurements reach zero; disposal closes the context.
  See [kinetic_cell_art.md](active_plans/reports/kinetic_cell_art.md). Campaign rendered acceptance
  and human enjoyment are measured separately.
- Revised artifact gates pass: both typechecks, lint, formatting, 19 Node behavior tests,
  GitHub Pages build, two rebuilt browser smoke tests (2.2 seconds), and 1,021 repository tests
  (1.90 seconds). Fresh static review verifies six stage moments, 241 unique entity IDs, and
  40 safe checkpoints. Complete built-browser traversal and final integration pass below.
- Fresh [chaos_quality.md](active_plans/reports/chaos_quality.md) passes source review, nine
  focused tests, 160 checkpoint idle probes across four motion phases, and 92 mock-canvas draws
  in normal/reduced motion with finite coordinates and balanced drawing state.
- The revised built campaign completes through real keyboard controls in 130.317 wall seconds
  (130.15 simulation seconds), with one deliberate checkpoint death, 26/37 fragments, all six
  stages, ordered milestones, three recruitment actions, emerging RNA, ending, and Replay.
  No browser errors or source drift were reported. This practiced automated route does not
  establish human first-play duration or enjoyment.
- Fresh [chaos_integration.md](active_plans/reports/chaos_integration.md) and
  [chaos_walkthrough.md](active_plans/reports/chaos_walkthrough.md) accept the current built
  campaign and rendered readability, including the corrected cytoplasm baffles, actual moving
  vesicle carry, launches, roof routes, filament summit, recovery, reduced motion, and Replay.
- Final documentation hygiene passes 212 focused README, Markdown-link, and ASCII tests;
  `git diff --check` passes. After final reports, the full repository suite passes 1,024 tests
  in 1.59 seconds; the repeated codebase gate again passes all 19 Node tests, typechecks,
  lint, and formatting.
