# Design decisions

<!-- VENDORED HEADER: START -->
Record each durable decision about how this code and repository are shaped, once it is settled, with
the reasoning a later reader needs. Guidance Neil Voss states belongs in
[HUMAN_GUIDANCE.md](HUMAN_GUIDANCE.md), dated history in `docs/CHANGELOG.md`, open discussion in
`docs/active_plans/decisions/`. [PROPAGATED HEADER - ENTRIES BELOW ARE YOURS]
<!-- VENDORED HEADER: END -->

### Temporary Graphify Cargo reconciliation

**Decision.** Reconcile exact Cargo aliases with their AST package twins before
reclustering; verify the resulting IDs against Graphify's loaded graph before writing.

**Why.** Graphify 0.9.80 compares normalized candidate counts with raw JSON counts,
and its original-link export otherwise drops links still pointing to removed aliases.

**Consequence.** Preserve all link records and the active shrinkage guard. Keep the
correction in one removable function; already reconciled upstream output is a no-op.

**Owner.** `normalize_cargo_twins` in
[devel/graphify_prune_tests.py](../devel/graphify_prune_tests.py)
and [devel/graphify_map_repo.py](../devel/graphify_map_repo.py).

Write each decision as a level-three heading with these four fields. `Owner` names the
authoritative code or contract document, rather than a person.

```markdown
### <decision title>

**Decision.** <the durable direction>

**Why.** <the reason it was chosen>

**Consequence.** <the constraint a future change preserves>

**Owner.** <the authoritative code or contract doc>
```

### Simulation owns session progression

**Decision.** Keep physics and progression in a fixed-step simulation, with type-only contracts
and authored level data. Solid receives events and owns menus and scalar HUD signals.

**Why.** UI updates must preserve deterministic game behavior and one mounted canvas runtime.

**Consequence.** Retry preserves fragments and milestones; Replay resets the session. UI changes
never recreate the animation loop or mutate progression directly.

**Owner.** [SOLID_MODEL.md](SOLID_MODEL.md) and [src/types/simulation.ts](../src/types/simulation.ts).

### Procedural canvas presentation

**Decision.** Draw the six environments, player, and effects with Canvas 2D; use synthesized
sound that starts with the Start gesture and defaults to on.

**Why.** Procedural artwork gives the first release a complete journey without external assets.

**Consequence.** Decorative geometry stays separate from forgiving collision bounds. Resizing
changes pixels, not physics; reduced decorative motion follows system preference.

**Owner.** [src/renderer.ts](../src/renderer.ts), [src/drawing.ts](../src/drawing.ts), and
[src/audio.ts](../src/audio.ts).

### Generic receptor teaching model

**Decision.** Use one nuclear receptor example with an open pore route and visible red steroid
inside the bound complex. Keep objectives short and learning text optional.

**Why.** A playable pathway communicates receptor activation and regulatory DNA recognition
while preserving the limits of the biological analogy.

**Consequence.** Captions must not imply a universal receptor location or pore requirement.
Transport rides, local forces, and organelle rebounds remain explicitly arcade abstractions.

**Owner.** [SOLID_MODEL.md](SOLID_MODEL.md) and [src/types/level.ts](../src/types/level.ts).

### Preserve shell build interfaces

**Decision.** Compile Solid JSX through the esbuild JavaScript API and keep `dist/` as the
artifact consumed by the existing preview and browser-test scripts.

**Why.** The established shell commands remain the public build and verification entry points.

**Consequence.** Dependency changes include the lockfile. Local preview and artifact validation
remain separate from remote GitHub Pages publication.

**Owner.** [pipeline/build.mjs](../pipeline/build.mjs) and [README.md](../README.md).

### Schematic binding flexibility

**Decision.** Exaggerate schematic steroid and pocket accommodation during binding, preserving the red
identity and four-ring scaffold. Reduced-motion presentation uses the settled bound shape.

**Why.** A visible change can communicate conformational flexibility while keeping the ligand
recognizable inside the active complex.

**Consequence.** Treat the depiction as an illustration, not a chemical reaction, quantified
atomic motion or energy, or a claim that every steroid ligand has equal flexibility. Motion is
deliberately not scale accurate. The
supplied paper concerns particular unsaturated steroids; preserve that scope.

**Owner.** [src/drawing.ts](../src/drawing.ts), [src/renderer.ts](../src/renderer.ts), and
[SOLID_MODEL.md](SOLID_MODEL.md).

### Bounded algorithmic sound

**Decision.** Synthesize regional textures, evolving quiet motifs, and molecular event cues
through the existing runtime frame loop. Sound defaults to on; Start initializes audio unless
the title-screen toggle is muted. Retry and Replay retain the session preference.

**Why.** Procedural audio gives movement and milestones distinct character without audio assets,
network dependencies, or a second timing loop.

**Consequence.** Bound synthesis to 36 primary voices with at most one FM oscillator per voice.
Pause/mute fade-stop scheduled cues immediately, including transition and death tails. Keep the
activated context silently running during pause/mute to avoid suspend/resume races; close it on
disposal. Verify signal/resource behavior separately from listening appeal.

**Owner.** [src/audio.ts](../src/audio.ts), [src/runtime.ts](../src/runtime.ts), and
[SOLID_MODEL.md](SOLID_MODEL.md).


### Gravity-free fluid controller

**Decision.** Use horizontal force, one upward impulse per Space press, weaker held upward thrust,
local forces, and drag on both axes. Circular player collision resolves all sides of circles,
capsules, and rounded rectangles with bounded speed and substeps.

**Why.** Three simple inputs let the environment create unpredictable movement without additional
abilities or a privileged landing surface.

**Consequence.** Receptor binding enables DNA recognition. Upward pocket escape depends on authored
descent routes; test those routes through actual controls. Ordinary collisions redirect rather
than kill. Only marked destructive regions cause death.

**Owner.** [src/physics.ts](../src/physics.ts), [src/simulation.ts](../src/simulation.ts), and
[src/constants.ts](../src/constants.ts).

### Chamber recipes and persistent encounters

**Decision.** Compile reusable current loops, transport relays, capture chambers, and channel
transfers into shared obstacles, fields, transports, and encounter steps. Explicit phases change
routes after contact or entry; levels do not own runtime scripts.

**Why.** Memorable interactions can recur in stranger combinations, adding active campaign
content without predictable travel.

**Consequence.** Recipes describe entrance, exit, sequence, recovery, and optional branch. Temporary
attachment has tap, held-thrust, and automatic release. Completed route changes survive retry,
so finite backward sweeps lead to changed forward opportunities. Replay resets phases.
Automatic sticky release supplies an outward impulse so an idle steroid drifts clear of the
adhesive surface. Transport motion obeys the same speed and collision budget as free movement;
its final path point is the release position. A blocked moving route releases locally.

**Owner.** [src/types/level.ts](../src/types/level.ts),
[src/types/sections.ts](../src/types/sections.ts), and [LEVEL_DESIGN.md](LEVEL_DESIGN.md).

### Ordered calm checkpoints

**Decision.** Checkpoints use explicit route order and calm spawn regions. Retry clears motion,
attachments, and transient effects while preserving fragments, milestones, and encounter phases.

**Why.** Backward travel is part of progression and must not replace a later save point.

**Consequence.** Safe release and spawn positions need clearance from moving obstacles and hazards.
Calm regions allow inspection and braking without requiring floor support.

**Owner.** [src/types/simulation.ts](../src/types/simulation.ts) and
[src/simulation.ts](../src/simulation.ts).

### Gentle optional vertical control

**Decision.** Preserve Left/Right/Space as primary movement and add continuous optional Up/Down
fine control at 80 units/s^2 during free motion. Opposing arrows cancel.

**Why.** Gentle adjustment supports positioning and recovery within the existing fluid model.

**Consequence.** Fine control adds no tap impulse, attachment release, or recruitment action.
Every required route remains completable with the three primary keys. Keep keyboard focus,
repeat suppression, and blur/pause cleanup in the existing input boundary.

**Owner.** [src/input.ts](../src/input.ts), [src/simulation.ts](../src/simulation.ts), and
[src/constants.ts](../src/constants.ts).

### Movable named chamber data

**Decision.** Author the four existing chamber families in local coordinates with an explicit
placement origin. Compile every position and reference together. Use stable local primitive and
step names; derive named-step phase thresholds with `phaseBefore` and `phaseAfter`.

**Why.** Moving chambers and inserting authored objects should preserve geometry and reference
meaning without scattered world-coordinate or array-index edits.

**Consequence.** Namespace primitive IDs once by stage and chamber; retain step IDs within their
encounter. Translate ordinary typed TypeScript data, including paths, vortex centers, regions,
scenery, triggers, and recovery spawns. Rotation, scaling, automatic layout, and a new language
remain outside the authoring contract.

**Owner.** [src/types/sections.ts](../src/types/sections.ts),
[src/levels/section_specs.ts](../src/levels/section_specs.ts), and
[src/levels/encounter_phases.ts](../src/levels/encounter_phases.ts).

### Required encounter completion authority

**Decision.** Derive required progress from encounter phases and the level's ordered required IDs.
Advance only the current required encounter; allow optional encounters to remain independent.

**Why.** Required activity must govern progression while avoiding a competing completion store.

**Consequence.** Named steps observe region entry, contact, capture, natural delivery, or biological
milestones. Premature release never satisfies delivery. A required milestone gates receptor/HRE
binding to its current step. Completion immediately saves the authored calm spawn and opens
phase-controlled onward routes. Save order follows encounter order; collectibles and exploration
markers cannot bypass completion or replace its save. Death/retry retain completed phases,
milestones, fragments, and opened routes; Replay clears them.

**Owner.** [src/types/level.ts](../src/types/level.ts),
[src/progression.ts](../src/progression.ts), and [src/simulation.ts](../src/simulation.ts).

### Biological destination transitions

**Decision.** Gate recognizable destination capture by required completion and biological
prerequisites, then use a one-second simulation-timed transition to the next campaign stage.

**Why.** Visible destinations make the journey's biological continuity and unfinished work readable.

**Consequence.** Early contact gently redirects the player toward the current action. The existing
canvas and loop render readonly transition state and a nonsimulated next-stage preview. Source-stage
HUD authority continues until one stage commitment. Pause/focus loss freeze progress; retry cancels
capture; runtime clears buffered input at the boundary. Reduced motion uses a crossfade without
scaling. Preserve the bound complex and DNA docking continuity.

**Owner.** [src/types/simulation.ts](../src/types/simulation.ts),
[src/simulation.ts](../src/simulation.ts), [src/runtime.ts](../src/runtime.ts), and
[src/renderer.ts](../src/renderer.ts).

### Destination zoom framing

**Decision.** Keep normal and transition camera framing in a pure shared helper. During destination
zoom, interpolate the destination's screen anchor toward center and derive the offset at the current
zoom scale.

**Why.** Captured steroid and destination must remain visible near world edges throughout capture.

**Consequence.** Preserve normal tracking, velocity look-ahead, and world clamps. Reduced motion
retains normal framing with a crossfade only. Invariant tests protect anchor visibility and reduced
motion; actual-controls captures establish rendered acceptance separately.

**Owner.** [src/camera.ts](../src/camera.ts) and [src/renderer.ts](../src/renderer.ts).

### Shared attachment-aware action cues

**Decision.** Derive one current-action cue for the HUD, world marker, and compass from required
progress and actual attachment state.

**Why.** A pending delivery needs a reachable reboarding target after early escape or retry.

**Consequence.** Matching transport attachment retains delivery wording and endpoint guidance.
Detached players see a reboarding action at the channel mouth or moving cargo's current capture
position. Initial motor/vesicle capture tracks that same current position. Presentation never
advances encounter phases.

**Owner.** [src/journey_presentation.ts](../src/journey_presentation.ts),
[src/app.tsx](../src/app.tsx), and [src/renderer.ts](../src/renderer.ts).

### Pacing acceptance through play

**Decision.** Target an 8-12 minute standard-route campaign through varied required interactions,
with the first environmental interaction within roughly three seconds and changes of action
every five to eight seconds of ordinary traversal. These are measured acceptance targets.

**Why.** The governing principle is continuing curiosity about the next strange cellular event.

**Consequence.** Preserve movement speed and the short transcription finale. Measure two complete
actual-controls routes through the built artifact, using a reference controller and an independent
agent. Count active campaign time, including transport, ordinary recovery, transitions, and
transcription; exclude menus, pauses, artificial waiting, and intentional repeated failure. Review
recordings and per-encounter timing before claiming acceptance. Optimized replays may be faster;
no runtime minimum-duration timer exists. Agent acceptance requires no human response. Human
enjoyment remains a separate unmeasured question.
Stage budgets are estimates; report the actual short transcription duration rather than changing
its actions or RNA payoff to fit the original allocation. The complete standard routes own the
480-720 active-second gate.

**Owner.** [LEVEL_DESIGN.md](LEVEL_DESIGN.md) and
[longer_cellular_journeys.md](archive/longer_cellular_journeys.md).
