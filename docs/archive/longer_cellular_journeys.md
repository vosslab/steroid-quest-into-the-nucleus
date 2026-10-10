# Plan: Longer cellular journeys with required encounters

## Context

The existing physics and reusable interactions provide a sound foundation. Level content is already data-driven, but chamber placement uses world coordinates and some interaction references depend on array positions. Moving or expanding chambers therefore requires unnecessary manual edits.

Recovery checkpoints currently save positions without consistently enforcing encounter completion. Most stages can be traversed while skipping substantial content.

## Objectives

- Preserve the current Left, Right, and Space movement.
- Add optional gentle Up and Down thrust.
- Build an 8-12 minute standard-route campaign around required encounters.
- Make chambers easy to move, extend, and recombine.
- Replace exit arrows with biological destinations and zoom transitions.
- Complete implementation and acceptance entirely through the manager, subagents, and automated checks.

## Design philosophy

Apply **Design for adaptability** through movable chamber recipes and stable references. Apply **Fix the design, not the symptom** by making encounter completion authoritative in the simulation.

Length comes from varied interactions, route changes, and recoveries. Keep the existing movement speed; do not add compulsory waits, repeated failures, or empty corridors to meet the duration target.

The first five stages receive the added traversal. Transcription retains its three forgiving Space actions and short RNA payoff.

## Scope

- Extend controls, chamber authoring, progression, destination rendering, and transitions.
- Expand the first five stages while retaining their signature interactions.
- Update objectives, control labels, documentation, tests, and walkthrough evidence.
- Deliver a validated local build through the existing preview script.

## Non-goals

- Change Space strength or existing horizontal movement.
- Add Shift combinations, mandatory Up/Down use, or required collectibles.
- Build a visual level editor, procedural campaign generator, or general scripting system.
- Add persistent accounts, saved campaigns, or remote publication.

## Architecture boundaries and ownership

### Controls

Add held `up` and `down` fields to the shared input contract.

- Up and Down apply continuous vertical acceleration without a tap impulse.
- Start with **80 units/s^2**, compared with the existing 200 units/s^2 Space hold.
- Opposing arrows cancel. Arrow thrust adds to currents and Space thrust through the existing fixed-step physics.
- Space retains its current tap, hold, attachment-release, and transcription behavior.
- Gentle arrows affect free movement; they do not break attachments or submit timing actions.
- Preserve focus ownership, repeat suppression, and blur/pause cleanup.
- Present Up/Down as "Optional fine control" in controls and pause help.

Keep every required route completable using Left, Right, and Space alone. The additional controls are available for adjustment and recovery.

Retain the explicit keyboard allowlist and simulation-owned progression checks, consistent with ASVS 2.2.1 and 2.3.1. These are local gameplay contracts, not an anti-cheat system.

### Chamber authoring

Retain the four existing recipe families: current loops, transport relays, capture chambers, and channel transfers.

Change authoring to chamber-local coordinates with an explicit placement origin. The compiler translates geometry, paths, vortex centers, encounter regions, decorations, and recovery spawns together.

Give referenced obstacles, transports, and encounter steps stable local names. Compilation namespaces them by stage and chamber; references must no longer depend on array positions.

A chamber declares:

- Its dimensions, entrance, exit, and placement.
- Its interaction sequence and completion condition.
- A calm recovery spawn and visible return route.
- Optional branches and any passage that opens on completion.

Keep these as ordinary typed TypeScript data. Translation is sufficient; rotation, scaling, automatic layout, and a new configuration language are outside scope.

### Required progress and recovery

Each traversal stage declares an ordered list of required encounters.

- Advance only the current required encounter. Optional encounters remain independent.
- Support explicit steps for entering a region, contacting a named surface, transport capture/delivery, and biological milestones.
- Derive completion from existing encounter phase state, avoiding a second competing completion store.
- Completing an encounter immediately saves its authored calm spawn and opens its onward passage.
- Additional exploration and collectibles do not advance required progress.
- Completed encounters and opened passages persist through retry and death. Replay resets them.
- Checkpoint ordering follows encounter order, independent of world coordinates. Remove the special hard-coded receptor checkpoint rank.

Use existing phase-controlled obstacles, currents, and transports for passage changes. The nuclear pore remains continuously open.

Show the current encounter objective and compact completion indicators. Near an unfinished destination, show the remaining objective and a readable return route. Required actions must be identifiable without reading biological captions.

Optional shortcuts can bypass travel or offer an alternate approach. They cannot silently satisfy or bypass required encounters.

### Biological destinations and transitions

Replace generic exit triggers with a typed destination containing a center, capture radius, label, and biological motif. The next stage comes from campaign order.

| Leaving stage | Destination object |
| --- | --- |
| Membrane | Motor-carried vesicle |
| Cytoplasm | Nucleus with visible pores |
| Nuclear envelope | Steroid receptor |
| Receptor | Chromatin coil |
| DNA/HRE | Matching response element and nearby gene locus |

Destinations remain visible before completion, with a subdued outline and incomplete progress segments. Completion activates their capture region and a distinct sound cue. Early contact gently redirects the player and identifies the unfinished encounter.

Use a **one-second simulation-timed transition**:

1. Capture and center the steroid at the destination.
2. Zoom toward the biological object.
3. Blend into the next stage's entrance view.
4. Commit the stage change exactly once and clear buffered movement pulses.

The renderer receives readonly transition state and the next level definition. It uses the existing canvas and animation loop; the preview does not run another simulation.

Pause and focus loss freeze the transition. Retry cancels it and restores the completed encounter's checkpoint. Reduced motion uses a crossfade without scaling. At the DNA transition, preserve the bound complex and docking continuity.

### Mapping (milestones -> components)

| Milestone | Component | Review boundary |
| --- | --- | --- |
| M1 | Input, compiler, progression contracts | Stable references, completion authority, recovery |
| M2 | Membrane and destination presentation | Complete playable example |
| M3 | Remaining campaign content | Shared recipes and biological sequence |
| M4 | Integration and independent assessment | Built behavior, pacing, presentation, lifecycle |

### File scope

- `src/types/`: input, chamber, encounter, destination, and transition contracts.
- `src/levels/`: local-coordinate compilation, named references, and expanded stage composition.
- Simulation, input, runtime, renderer, audio, and Solid HUD modules: implement those contracts within their current ownership boundaries.
- Existing Node and browser tests: protect meaningful behavior and update the actual-controls walkthrough.
- README and design/model/guidance/changelog documentation: describe the settled behavior.
- Regenerate `dist/` from source; preserve captures, recordings, and measurements as acceptance evidence.

## Milestone plan

| M | Title | Summary | Goal |
| --- | --- | --- | --- |
| M1 | Movement and authoring foundation | Gentle thrust, movable chambers, required progress | Prove the shared contracts |
| M2 | Complete membrane expansion | Four encounters, destination object, zoom | Establish the reusable example |
| M3 | Expand the campaign | Convert the remaining traversal stages | Deliver the longer journey |
| M4 | Autonomous acceptance | Independent assessments, timing, corrections, full gates | Finish with a validated local build |

**M1 - Entry:** current implementation and rules inspected.  
**Deliverables:** input extension, local-coordinate compiler, stable references, encounter completion and checkpoint behavior.  
**Exit:** focused behavior tests pass; moving a sample chamber requires only changing its placement; skipping its encounter cannot unlock its destination.  
**Parallel-plan ready: no** until shared contracts are settled.

**M2 - Depends on M1:** author and verify the complete membrane route below, including the first biological destination and transition.  
**Exit:** actual-controls traversal proves all four completions, early-exit rejection, backward-sweep recovery, retry persistence, and three-key-only completion.  
**Parallel-plan ready: yes** for presentation and content after the contracts are fixed.

**M3 - Depends on M2:** expand the remaining stages using the proven authoring model.

The intended encounter sequence and pacing allocation are:

| Stage | Required encounters | Standard-route target |
| --- | --- | --- |
| Membrane | Bilayer/rebound outlet; backward sweep and arriving vesicle; linked current loops; channel delivery | 80-115 seconds |
| Cytoplasm | Motor delivery; mitochondrial rebound; ER transfer; countercurrent relay; crowded vesicle transfer | 110-155 seconds |
| Nuclear envelope | Circulation approach; open-pore crossing; inner-envelope return loop | 75-110 seconds |
| Receptor | Temporary sticky contact and escape; matching receptor binding; changed-current passage; bound-complex transfer | 90-130 seconds |
| DNA/HRE | Nucleosome loop; moving passage; flow rearrangement; chromatin channel; reliable HRE docking | 115-165 seconds |
| Transcription | Existing three recruitment actions and RNA finale | 10-20 seconds |

Missing the pore remains an optional recovery, never a required mistake. Each new chamber combines existing mechanics and provides a permanent descent or return route.

**M3 Exit:** every stage completes with actual controls, every required encounter saves progress, and shortcuts rejoin correctly.  
**Parallel-plan ready: yes** for independent stage groups using the accepted shared contracts.

**M4 - Depends on M3:** run the acceptance process below and correct failures until it passes.  
**Exit:** all behavior gates, independent agent assessments, pacing evidence, documentation, and local delivery are complete.  
**Parallel-plan ready: yes** for independent behavior, presentation, and pacing assessments.

## Test and verification strategy

### Permanent behavior coverage

Extend focused tests to protect:

- Gentle upward/downward acceleration, cancellation, and unchanged Space behavior.
- Keyboard focus, repeat handling, and input cleanup.
- Placement translation and stable references after inserting or reordering authored objects.
- Rejection of missing references and unsafe recovery spawns.
- Required encounter ordering and rejection of early destination entry.
- Transport delivery distinguished from premature release.
- Completion/checkpoint persistence through death and retry; Replay reset.
- Receptor, HRE, and transcription ordering.
- Single stage commitment, transition pause/resume, and retry cancellation.

Avoid permanent assertions for exact coordinates, chamber counts, tuning constants, screenshots, or campaign duration.

### Autonomous built-artifact acceptance

The manager assigns fresh assessment agents who did not author the evaluated content.

1. **Behavior assessment:** complete all six stages with actual keyboard controls, first using only Left/Right/Space, then exercising gentle Up/Down in targeted cases.
2. **Bypass assessment:** attempt direct exits, ceiling routes, early ride releases, and optional shortcuts. None may bypass required completion.
3. **Recovery assessment:** exercise upper pockets, sticky contacts, backward sweeps, missed pores, and marked-hazard death. Verify retained progress and safe recovery.
4. **Presentation assessment:** inspect recordings and captures for current-objective clarity, recognizable destinations, understandable locked states, readable returns, and all five zoom transitions.
5. **Lifecycle assessment:** verify reduced motion, narrow menus, sound preferences, pause/focus silence, stable canvas identity, and one animation loop.

Assessors use rendered gameplay and readonly observations; they do not inject progress or reposition the player.

### Pacing gate and correction path

Record two complete standard-route runs using actual controls: a repeatable reference controller and an independent agent-controlled run. Both must finish in **8-12 minutes of active campaign time**, excluding menus and pauses.

Required transport travel, normal recoveries, transitions, and transcription count. Artificial waiting, intentional repeated failure, and controller delays added to reach the target do not count.

Review per-encounter timing alongside the recordings:

- Too short: add or deepen active interaction sequences in the underdeveloped chambers.
- Too long: shorten repetitive travel, improve cues, or simplify redundant encounter steps.
- Confusing: revise the visible objective, force cues, or return route.
- Unreachable or skippable: correct authored geometry or simulation progression before retesting.

Optimized replay and optional shortcuts may finish faster. No runtime timer enforces a minimum duration.

These are agent-assessed campaign measurements. No milestone requires a human playtest, response, approval, or availability.

### Integration gates

Run:

```sh
./check_codebase.sh
./build_github_pages.sh
./run_playwright_tests.sh --build
source source_me.sh && python3 -m pytest tests/ -q
git diff --check
```

Keep one-time pacing and visual probes separate from permanent tests. Preserve final recordings, captures, source/build hashes, and assessment reports.

## Risk register

| Risk | Trigger and impact | Owner and correction |
| --- | --- | --- |
| Required encounters become chores | Repeated actions or waits dominate recordings | Content owner replaces repetition with route changes or combined mechanics |
| Progression traps the player | Incomplete encounter cannot be resumed after retry | Simulation/content owners restore reachable steps and permanent return routes |
| Optional thrust becomes necessary | Three-key walkthrough cannot escape or complete | Level owner repairs currents and recovery geometry |
| Zoom disrupts controls or lifecycle | Buffered actions, duplicate transitions, motion problems | Runtime/presentation owners fix transition state and rerun lifecycle checks |
| Expansion becomes hard to maintain | Moving chambers requires scattered coordinate edits | Compiler owner completes local-coordinate and reference ownership |

## Documentation close-out requirements

Record the confirmed controls, 8-12 minute target, required encounters, and biological destinations in human guidance. Supersede the earlier compact-campaign instruction where it conflicts.

Document local-coordinate authoring, completion semantics, checkpoint lifecycle, and transition ownership as settled design decisions. Update player instructions and retain the explanation that transport and forces are exaggerated arcade interpretations.

Maintain milestone status and an acceptance report with measured traversal times, independent agent findings, and corrections. Finish by serving the validated `dist/` through `./run_web_server.sh`. Remote publication remains separate.
