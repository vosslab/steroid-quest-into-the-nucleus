# Changelog

## 2026-10-09

### Additions and New Features

- Add optional held Up/Down fine control during free movement while preserving primary
  Left/Right/Space behavior, attachment release, and transcription actions.
- Add chamber-local placement translation, stable primitive and step names, and named-step
  phase helpers across the four existing recipe families.
- Add ordered required encounter progress, natural transport-delivery steps, completion saves,
  and biological destination capture with a one-second simulation-timed transition.
- Author three nuclear-envelope encounters around the continuously open pore, immediate crossing
  save, inner return, curved connector, and receptor destination. Author four receptor encounters
  around sticky escape, immediate matching-binding save, changed passage, and bound-complex transfer.
- Author five cytoplasm encounters around motor delivery, giant mitochondrial rebound, folded ER
  channels, countercurrent relay, and crowded vesicles. Author five DNA/HRE encounters around moving
  chromatin, changed passage/flow, a rising channel, and broad calm matching-HRE docking.
- Add README screenshots of the giant mitochondrial flank and ready nuclear destination from
  the accepted independent full-campaign browser run.
- Add an independently authored actual-keyboard controller, evidence harness, and assessment
  for full-campaign standard-route completion and pacing.

### Behavior or Interface Changes

- Advance only the current required encounter; optional exploration cannot bypass completion.
  Receptor/HRE milestones respect current-step ordering. Retry/death retain completed phases,
  biological milestones, fragments, and opened routes; Replay clears campaign progress.
- Keep the source stage authoritative through destination presentation until stage commitment.
  Pause freezes transitions, Retry cancels capture, and reduced motion uses a crossfade.
- Update player instructions, chamber authoring, runtime ownership, and settled decisions for
  the expanded journey. Preserve the confirmed live link and managed visual block in README.

### Fixes and Maintenance

- Derive pending delivery guidance from actual attachment state through one shared HUD/world/
  compass cue. Detached players see a recapture target; matching attachment keeps delivery
  guidance. Initial motor/vesicle capture follows the moving cargo's current position.
- Extract membrane composition and shared named-phase/stream/rebound authoring helpers while
  retaining the four existing chamber recipe families.
- Extract pure normal/transition framing into the camera helper and interpolate destination
  anchors in screen space during zoom. Preserve normal tracking and keep captured targets visible
  near world edges. Reduced motion retains normal framing and a crossfade only.
- Exclude generated `test-results/` and `playwright-report/` artifacts in the consumer ESLint
  configuration. Authored tests retain their lint coverage; immutable controller snapshots remain
  evidence artifacts.
- Replace the temporary browser harness's fixed encounter-count assertion with required-ID
  completion guards, and render ignored development-probe paths as inline code in author reports.
- Archive nine released temporary sources, including recovery preflight and finalized recovery/
  reduced-motion browser runners, byte-for-byte under
  `test-results/expansion/source_probes/`
  with a hash manifest and restore instructions, then remove their temporary originals. The archive
  preserves source provenance separately from finalized browser acceptance. Runner hashes match
  their finalized snapshots; all nine originals are removed and `tests/_temp/` is empty.

### Decisions and Failures

- Supersede the earlier compact-campaign direction with the 8-12 minute standard-route target.
  Add active encounters while preserving movement speed; compulsory waits, repeated failures,
  and empty travel do not establish pacing.
- Keep the 121.60-second fluid walkthrough identified as historical evidence for the earlier
  campaign. It does not establish expanded-campaign acceptance.
- Retain the unchanged short transcription finale. Its 10-20 second planning allocation is an
  estimate, separate from the hard 480-720 active-second gate for each complete standard route.
  Report actual timing; efficient recruitment does not justify inserted delays.

### Developer Tests and Notes

- The movement/authoring foundation passes 31 focused Node behavior tests and both browser smoke
  tests after independent specification and quality assessment. These checks do not establish
  expanded campaign pacing or final integration acceptance.
- The intermediate frozen membrane source passes `./check_codebase.sh` (31 behavior tests,
  type checks, lint, and formatting), `./build_github_pages.sh`, and 1,126 Python checks.
  Preserve these intermediate checks separately from the final integrated results below.
- The five edited documentation files pass ten scoped Markdown-link/ASCII checks, and README
  passes all six landing-paragraph checks.
- Add four focused helper tests for delivery/reboarding cue semantics. The membrane's four
  required encounters have source development measurements in
  [EXPANSION_MEMBRANE.md](active_plans/reports/EXPANSION_MEMBRANE.md); source timing remains
  separate from final built-artifact pacing acceptance.
- Add two camera invariant tests for captured-target visibility and reduced-motion framing.
  All 37 Node behavior tests pass independently. Fresh rendered assessment accepts the corrected
  membrane transition across 32 capture/zoom/blend/commit frames: steroid and destination remain
  visible, source HUD commits once, and canvas/animation-loop identity stays stable. The other four
  transitions and reduced-motion campaign evidence have separate assessment ownership.
- Accept the membrane actual-controls measurement at 104.02 active seconds; an independent
  diagnostic route takes 110.47 seconds without idle padding. These are earlier prefix measurements.
- Source-only three-key probes measure 78.5083 seconds for the envelope and 91.175 seconds for
  the receptor, including destination commitment. See
  [EXPANSION_ENVELOPE.md](active_plans/reports/EXPANSION_ENVELOPE.md) and
  [EXPANSION_RECEPTOR.md](active_plans/reports/EXPANSION_RECEPTOR.md). These development measurements
  do not establish actual-key browser acceptance or full campaign pacing.
- Source-only three-key probes measure 116.825 seconds for cytoplasm and 119.033 seconds for
  DNA/HRE, including destination commitment. See
  [EXPANSION_CYTOPLASM.md](active_plans/reports/EXPANSION_CYTOPLASM.md) and
  [EXPANSION_DNA.md](active_plans/reports/EXPANSION_DNA.md). Source development measurements remain
  separate from integrated browser behavior and full campaign pacing.
- The frozen integrated artifact passes `./check_codebase.sh` with 38 Node tests and type/lint/
  format checks, the Pages build, both `./run_playwright_tests.sh --build` smoke tests, 1,136 Python
  checks, and `git diff --check`. Final Python/diff and fresh integration review after documentation
  closure are tracked in [EXPANSION_ACCEPTANCE.md](active_plans/reports/EXPANSION_ACCEPTANCE.md).
- The independent full-campaign route completes in 579.57 active seconds with no report or
  capture errors, within the 480-720 second pacing gate. Screenshot bytes match their accepted
  captures and source/build provenance is unchanged. All six stages and 21 required encounters
  complete without death or artificial padding; retain 117 captures, 4,952 readonly observations,
  1,614 key events, and actual 4.86-second transcription timing in
  [EXPANSION_INDEPENDENT.md](active_plans/reports/EXPANSION_INDEPENDENT.md).
- The reference route completes all six stages and 21 required encounters in 525.02 active seconds
  (8:45.02), without death, errors, drift, or artificial padding. Gross start-to-ending elapsed is
  525.96 seconds, including 0.94 seconds of initial stationary audio preflight. Retain 138 captures,
  controller traces, provenance, all completion saves, and actual 4.77-second transcription timing
  in [EXPANSION_WALKTHROUGH.md](active_plans/reports/EXPANSION_WALKTHROUGH.md). Both full standard-route
  pacing gates pass.
- Recovery 06 passes all 12 required actual-controls cases with zero browser errors or hash drift,
  including early biological target denial, premature delivery recovery, bound-save Retry,
  pause/focus transition freezing, and held-Space behavior. One deliberate marked-acid death retains
  the collected fragment; the separate bound-save Retry preserves receptor binding. The final run
  completes all 21 required encounters and three recruitment actions. Its deliberate probes do
  not establish standard pacing. See
  [EXPANSION_RECOVERY.md](active_plans/reports/EXPANSION_RECOVERY.md); the optional early-envelope
  contact diagnostic remains outside the required case count and carries no success claim.
- Fresh rendered assessment passes all five normal transitions, bound-complex continuity,
  authentic reduced-motion DNA crossfade, and planned narrow title/pause access in
  [EXPANSION_FINAL_VISUAL.md](active_plans/reports/EXPANSION_FINAL_VISUAL.md). Human first-play
  enjoyment remains unmeasured. The supplementary reduced-motion route also completes all five
  transitions and 21 encounters without errors or drift; it does not replace the required recovery
  case. Final milestone review status remains in
  [EXPANSION_ACCEPTANCE.md](active_plans/reports/EXPANSION_ACCEPTANCE.md).
- Final M1-M4 integration is accepted. Archive the completed journey plan byte-for-byte at `docs/archive/longer_cellular_journeys.md` and update its current documentation links. The frozen integrated checks passed 38 Node tests, both browser smoke tests, and 1,139 Python checks.

## 2026-10-08

### Additions and New Features

- Add gravity-free viscous movement using horizontal force, upward Space pulses, held thrust,
  local stream/vortex fields, exponential drag, and a bounded total speed.
- Add circular player collision against circles, capsules, and rounded rectangles; temporary
  sticky capture, curved transport paths, and contact/entry encounter phases.
- Replace floor-based sections with reusable chamber recipes, explicit downward recovery,
  persistent changed routes, and ordered calm checkpoints across the six-stage journey.
- Show readable force directions, transport paths, rounded contact surfaces, and two-axis
  camera tracking while preserving the red receptor complex and growing RNA finale.

### Behavior or Interface Changes

- Use Left, Right, and Space as the three gameplay keys. Keyboard repeat cannot add tap pulses
  or recruitment attempts; pause and retry retain their existing menu and keyboard controls.
- Default sound to on, initialize it through Start, and expose an accessible title sound toggle.
  Retry and Replay retain the session preference; focus loss, pause, and mute clear sound.
- Preserve fragments, biological milestones, and completed encounter phases through retry.
  Checkpoint order is independent of horizontal position. Replay resets the campaign.
- Receptor binding enables DNA recognition and saves an authored calm checkpoint.
- Refresh README, level design, runtime ownership, human guidance, and design decisions for the
  active-cell model. Forces and transport remain exaggerated arcade interpretations.

### Fixes and Maintenance

- Replace obsolete platform tests with behavior coverage of fluid movement, collision,
  attachment release, progression, and lifecycle boundaries.
- Retain build-artifact walkthrough observations and audio/frame lifecycle instrumentation.
- Validate transport path clearance and actual checkpoint footprints, cap transport speed,
  and include moving organelle speed in the collision substep budget.
- Add an outward automatic sticky release, a pre-pore descent stream, and forgiving receptor
  capture. Put the changed-route checkpoint outside immediate vesicle recapture.

### Removals and Deprecations

- Remove gravity, floor-supported jumping, coyote time, air-jump limits, crumble ledges, and
  the earlier platform recipe contracts.

### Decisions and Failures

- Reject the initial level draft after authoring review found overwritten recipe forces,
  unreachable receptor contact, and a backward sweep without a completion phase.
- Make downward return routes reachable from upper pockets; a bottom-only current cannot
  rescue a player in gravity-free fluid.

### Developer Tests and Notes

- Pass strict type checks, lint, formatting, 17 Node behavior tests, both built-artifact browser
  smoke tests, and 1,112 Python repository hygiene checks.
- Complete the actual-controls six-stage walkthrough in 121.60 simulation seconds, including
  deliberate recovery probes, one acid death, optional cargo, and binding checkpoint retry.
  The opening rebound occurs within three seconds of forward play.
- Record 49 captures, a video, source/build hashes, audio output/silence, Replay preference
  retention, one animation loop, stable canvas identity, and reduced-motion narrow menus in
  [fluid_walkthrough.md](active_plans/reports/fluid_walkthrough.md). Human first-play enjoyment
  remains unmeasured. Deliver the validated local preview; remote publication stays separate.

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
