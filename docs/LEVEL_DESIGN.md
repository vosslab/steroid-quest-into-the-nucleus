# Active cell level design

The governing principle is simple: keep players wondering what strange thing the cell will
throw at them next. Replace predictable stretches with surprising interactions. Keep the
six-stage biological journey, optional exploration, calm checkpoints, and quick recovery.

## Primary and optional controls

Left and Right apply horizontal force. Opposing input brakes and reverses momentum. A Space
press adds one strong upward impulse; held Space adds weaker continuous upward thrust. Releasing
all keys lets the player coast under fluid drag. Auto-repeat does not add tap impulses.

Optional held Up/Down adds gentle vertical acceleration during free movement. Opposing arrows
cancel. This fine control adds to currents and Space thrust, with no tap impulse, attachment
release, or transcription action. Every required route must remain completable using Left, Right,
and Space alone.

There is no global gravity, floor-supported movement, or extra jump after binding.
[src/constants.ts](../src/constants.ts) owns tunable acceleration, thrust, drag, and speed limits.
All forces run in the existing fixed-step simulation. Speed is bounded before collision movement;
bounded substeps prevent fast players from skipping thin obstacles.

## Shared simulation primitives

[src/types/level.ts](../src/types/level.ts) owns the authoring contracts:

| Primitive | Meaning | Authoring responsibility |
| --- | --- | --- |
| Obstacle | Circle, capsule, or rounded rectangle; rebound or temporary sticky response | Keep every contact side readable and leave escape clearance |
| Flow zone | Rectangular directional acceleration, optional vortex and local drag | Show direction before contact and provide a visible way out |
| Transport | Vesicle, motor cargo, or channel following a curved path | Clear path/release space; temporary capture must end automatically |
| Encounter | Named region, contact, capture, delivery, or milestone steps | Advance the current required encounter or an independent optional encounter |
| Phase condition | Inclusive minimum/maximum encounter phase | Finite backward sweeps end when the changed return route becomes available |
| Completion checkpoint | Required encounter order and calm spawn region | Save on completion; keep spawn clear of forces, moving geometry, hazards, and immediate capture |
| Destination | Biological object with center, capture radius, label, and motif | Activate after required encounters and biological prerequisites |
| Hazard | Marked destructive acid | Place principally on optional lysosome branches |

The player collides as a circle; decorative detail never changes that geometry. Obstacle response
has no privileged top surface. Boundary contact is safe. Transport escape uses either a Space
pulse or held thrust; release must resolve to clear space. Captures are arcade interpretations,
not measured molecular transport mechanisms.

## Reusable chamber recipes

[src/types/sections.ts](../src/types/sections.ts) defines chamber specifications.
[src/levels/surprise_patterns.ts](../src/levels/surprise_patterns.ts) provides current-loop,
transport-relay, capture-chamber, and channel-transfer recipes.
[src/levels/section_specs.ts](../src/levels/section_specs.ts) compiles them into stage-prefixed
shared primitives. Levels compose data, not individual runtime scripts.

Each chamber declares local dimensions, entrance and exit, placement origin, objective, named
interaction sequence, a downward recovery field, and whether it is required. Required chambers
declare a calm completion spawn; optional branches and exploration markers remain optional.
Add local obstacles, fields, transports, fragments, triggers, and scenery to shape the encounter.
Changing `placement` moves all authored positions together. Compilation translates ordinary typed
TypeScript data; it introduces no rotation, scaling, automatic layout, or configuration language.

Name obstacles and transports locally. Compilation namespaces primitive IDs once as
`stage-chamber-local`; references resolve to those names rather than array positions. Step IDs
stay local to their encounter. Use `phaseBefore(sequence, stepId)` and
`phaseAfter(sequence, stepId)` from
[src/levels/encounter_phases.ts](../src/levels/encounter_phases.ts) for conditions tied to named
steps. Phase counts completed steps: the first helper returns the threshold before the named step,
and the second includes its completion. Inserting a step then moves the threshold with its meaning.

[src/levels/journey_patterns.ts](../src/levels/journey_patterns.ts) supplies small composition
helpers: `phaseWindow` stays active after one named step through another pending step,
`phaseAfterStep` supplies a permanent changed condition, and `stream`/`rebound` assemble named
fields and surfaces. These assemble ordinary chamber data within the same four recipe families.

Each step has one completion source: region entry, named contact, transport capture, natural
transport delivery, or receptor/HRE milestone. Early escape, blocked release, and other premature
release do not satisfy delivery. Contact and transport references must resolve to authored objects.
The compiler rejects invalid references and unsafe completion spawns. It checks transport paths
against world bounds, hazards, and phase-active static obstacles. Runtime collision handling still
owns moving contacts; compiled chamber data does not establish playable reachability by itself.

A recipe's acceptance is behavioral: the player can enter, experience the interaction, leave,
and recover from a mistake. Compiler validation alone does not prove reachability or enjoyment.

## Required progress and recovery

Each stage supplies ordered `requiredEncounterIds`. Existing encounter phases remain the sole
completion authority; [src/progression.ts](../src/progression.ts) derives the current encounter and
compact completion count. Only the current required encounter can advance. Optional encounters,
collectibles, and travel shortcuts cannot silently satisfy or bypass required actions. Receptor
binding and HRE docking occur only when their required milestone step is current.

Completing a required encounter immediately saves its calm spawn and activates its authored
onward route. Completion checkpoint rank follows encounter order, independent of x or y. Earlier
encounters and exploration markers cannot overwrite a later completion save. Keep phase-controlled
passages, fields, and transport availability in level data; the nuclear pore remains open.

A bottom-only current cannot rescue a player drifting in an upper pocket. Every chamber must
provide a visible descending or returning current reachable by horizontal steering from its
highest accessible region. Check the complete motion envelope of moving organelles and routes.

- Reach the highest pocket with held Space, then escape using only Left/Right and coasting.
- Miss a pore or channel and verify that the return route creates another approach.
- Break each temporary attachment with a pulse, held thrust, and automatic release.
- Retry during a route change and confirm that completed changes persist.
- Travel backward across old checkpoints and verify that route order does not regress.
- Follow an optional branch back before the next required biological milestone.

Retry clears velocity, temporary attachment, and transient effects. It preserves fragments,
receptor/HRE milestones, completed encounter phases, and opened routes. Retry also cancels any
destination transition. Replay resets the campaign.

## Biological destinations

Replace generic exits with recognizable biological objects. Keep a subdued outline and incomplete
progress segments visible before readiness. Early contact gently redirects the player; show the
current action and a readable return route independently of optional biological captions. A compass
indicates target direction; authored currents and geometry must supply the actual navigable route.

The HUD, world marker, and compass share
[src/journey_presentation.ts](../src/journey_presentation.ts). It derives delivery guidance from
actual attachment: aboard the matching ride, target its endpoint; detached, target recapture and
show a reboarding action. Channel recapture uses its mouth; motor/vesicle capture follows the
cargo's current position. Early escape and retry must leave both recapture and its cue available.

| Leaving stage | Destination |
| --- | --- |
| Membrane | Motor-carried vesicle |
| Cytoplasm | Nucleus with visible pores |
| Nuclear envelope | Steroid receptor |
| Receptor | Chromatin coil |
| DNA/HRE | Matching response element and nearby gene locus |

Destination capture advances the stage; it does not substitute for receptor binding or HRE docking.
Those biological milestones remain explicit current-encounter actions.

Completing required encounters activates capture and a sound cue. Capture centers the steroid for
a one-second simulation-timed zoom and blend. Campaign order supplies the next stage. Pause freezes
the transition; Retry cancels it and returns to the saved checkpoint. Reduced motion uses a
crossfade without scaling. Preserve the bound steroid complex and docking continuity at DNA/HRE.

## Campaign signatures

| Stage | Sequence | Recovery and biological boundary |
| --- | --- | --- |
| Membrane | Bilayer crest and lower return; backward sweep and arriving vesicle delivery; linked current loops; natural channel delivery | Four required encounters save calm spawns; visible descents and changed routes persist |
| Cytoplasm | Filament motor delivery; giant mitochondrial rebound; folded ER transfer; countercurrent relay; crowded vesicle transfer | Five required encounters; optional cargo activates after required motor delivery and rejoins before its outlet |
| Nuclear envelope | Circulation approach; continuously open pore crossing; inner return loop and curved connector | Three required encounters; successful crossing saves immediately; a missed pore is optional recovery |
| Receptor | Sticky gallery and escape; matching receptor binding; changed-current passage; bound-complex transfer | Four required encounters; binding saves immediately and enables DNA recognition; onward travel retains the red complex |
| DNA / HRE | Nucleosome loop; broad moving passage; exposure-driven flow rearrangement; rising chromatin channel; matching HRE docking | Five required encounters; permanent descents and broad calm docking retain receptor/HRE ordering |
| Transcription | Docked complex; three forgiving Space actions; assembled machinery and moving polymerase | Holding Space never repeats attempts; one connected RNA grows |

## Readability and pacing

The standard-route target is 8-12 minutes of active campaign time. Both built-artifact pacing runs
pass: the reference measures 525.02 seconds and the independent route 579.57 seconds. All 12
required recovery cases and the final visual assessment also pass. Varied interactions and changed approaches
provide activity in the first five stages; transcription retains three forgiving Space actions and
its short RNA payoff. Preserve movement speed. Compulsory waiting, repeated failures, and empty
corridors do not establish pacing.
Stage allocations are planning estimates. Report the actual transcription duration; efficient
timing actions and RNA payoff may take roughly five seconds. The original 10-20 second allocation
does not authorize delays or transcription timing changes. The hard pacing gate is 480-720 active
seconds for each complete standard-route run.

Show force direction with arrows and particles, collision edges with surface silhouettes, and
capture/release with distinct contact effects and sound. Reduced motion simplifies decoration
while retaining force direction and required moving geometry. The camera follows both axes and
backward travel with modest velocity look-ahead.

Target the first environmental interaction within roughly three seconds of forward play. Aim
for a meaningful change of action every five to eight seconds during ordinary traversal,
excluding rests and exploration. These are playtest targets, not permanent assertions about
specific coordinates or tuning constants. Biological captions remain optional.

## Built-artifact acceptance

Build and serve with `./run_web_server.sh`. Use actual keyboard controls to walk all stages,
including upper-pocket escapes, backward sweeps, sticky contacts, transport rides, an optional
shortcut return, and a marked-hazard death with retained progress. First complete the required route
with Left/Right/Space; assess gentle Up/Down separately. Attempt early destinations, ceiling routes,
and premature delivery exits. Verify each completion save and all five destination transitions.

The expansion's pacing gate requires two complete actual-controls standard-route measurements:
a repeatable reference controller and an independent agent-controlled run. Both must take 8-12
minutes of active campaign time, excluding menus and pauses. Transport travel, ordinary recovery,
transitions, and transcription count. Artificial waits and intentional repeated failure do not.
Optimized replay or optional shortcuts may be faster; no runtime minimum-duration timer exists.
Review recordings and per-encounter timing, then deepen short interactions, shorten repetition,
clarify confusing cues, or repair unreachable and skippable content before retesting.

The accepted standard-route lane results are in
[EXPANSION_WALKTHROUGH.md](active_plans/reports/EXPANSION_WALKTHROUGH.md) and
[EXPANSION_INDEPENDENT.md](active_plans/reports/EXPANSION_INDEPENDENT.md). The reference's 525.02
seconds exclude 0.94 seconds of stationary preflight at the initial spawn; its gross start-to-ending
elapsed is 525.96 seconds. Actual transcription durations are 4.77 and 4.86 seconds. Both routes
complete all six stages and 21 required encounters without deaths or artificial padding.

[EXPANSION_RECOVERY.md](active_plans/reports/EXPANSION_RECOVERY.md) records all 12 required
recovery cases passing, including a deliberate marked-hazard death with a retained fragment,
bound-save Retry, early-target denial, and transition pause/focus cancellation.
[EXPANSION_FINAL_VISUAL.md](active_plans/reports/EXPANSION_FINAL_VISUAL.md) accepts all five normal
transitions, bound-complex continuity, the actual reduced-motion DNA crossfade, and planned narrow
title/pause access. The aggregate
[EXPANSION_ACCEPTANCE.md](active_plans/reports/EXPANSION_ACCEPTANCE.md) tracks final review status.

[fluid_walkthrough.md](active_plans/reports/fluid_walkthrough.md) preserves the historical 121.60
simulation-second walkthrough of the earlier campaign. It does not establish expanded-campaign
acceptance. Preserve new captures, recordings, source/build hashes, and independent findings with
the expansion's final assessment.

Check default-on audio after Start, pre-start mute, pause/focus-loss silence, Replay preference
retention, stable canvas identity, one animation loop, and narrow-screen menus. Keep practiced
route time and automated completion separate from human first-play enjoyment. An understandable
mistake should expose a visible next opportunity, rather than leave the player stranded.

```sh
./check_codebase.sh
./build_github_pages.sh
./run_playwright_tests.sh --build
source source_me.sh && python3 -m pytest tests/
```

A validated local build and preview do not publish remotely.
