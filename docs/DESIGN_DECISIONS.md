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
sound that starts muted.

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
Air jumps, gravity, and platform geometry remain explicitly arcade abstractions.

**Owner.** [SOLID_MODEL.md](SOLID_MODEL.md) and [src/types/level.ts](../src/types/level.ts).

### Preserve shell build interfaces

**Decision.** Compile Solid JSX through the esbuild JavaScript API and keep `dist/` as the
artifact consumed by the existing preview and browser-test scripts.

**Why.** The established shell commands remain the public build and verification entry points.

**Consequence.** Dependency changes include the lockfile. Local preview and artifact validation
remain separate from remote GitHub Pages publication.

**Owner.** [pipeline/build.mjs](../pipeline/build.mjs) and [README.md](../README.md).

### Authored campaign pacing

**Decision.** Expand cytoplasm, receptor, and DNA routes with distinct authored districts while
preserving the controller and compact membrane, pore, and transcription milestones.

**Why.** The initial real-controls route finished in roughly two minutes. Longer routes with
different elevations and recovery shelves provide more play without slowing movement.

**Consequence.** Checkpoints stay on supported safe shelves, and optional branches never gate
progress. Keep measured expert-route time separate from the unverified 8-12 minute first-play
target and human enjoyment.

**Owner.** [src/levels/cell.ts](../src/levels/cell.ts),
[src/levels/nucleus.ts](../src/levels/nucleus.ts), and
[walkthrough.md](active_plans/reports/walkthrough.md).

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
through the existing runtime frame loop. Sound starts muted and requires an unmute gesture.

**Why.** Procedural audio gives movement and milestones distinct character without audio assets,
network dependencies, or a second timing loop.

**Consequence.** Bound synthesis to 36 primary voices with at most one FM oscillator per voice.
Pause/mute fade-stop scheduled cues immediately, including transition and death tails. Keep the
activated context silently running during pause/mute to avoid suspend/resume races; close it on
disposal. Verify signal/resource behavior separately from listening appeal.

**Owner.** [src/audio.ts](../src/audio.ts), [src/runtime.ts](../src/runtime.ts), and
[SOLID_MODEL.md](SOLID_MODEL.md).

### Cellular corridor materials

**Decision.** Use optional platform materials for membrane, mitochondrion, reticulum, and gel
art on solid collision rectangles. Clip cellular masses to those authored rectangles.

**Why.** Crowded organelles and gel/tunnel passages should communicate traversable empty space
and physical boundaries while retaining one collision authority.

**Consequence.** Material changes only Canvas presentation. Existing platforms without a
material retain their appearance; movement and collisions continue to use rectangle geometry.

**Owner.** [src/types/level.ts](../src/types/level.ts), [src/drawing.ts](../src/drawing.ts), and
[src/renderer.ts](../src/renderer.ts).

### Explicit cellular movement fields

**Decision.** Author optional rectangular acceleration fields and bounce launch velocities in
level data. The fixed-step simulation applies their movement and emits top-contact bounce events.

**Why.** Currents and directional launches give cellular obstacles a physical role while keeping
one owner for collision and player motion. Visual materials retain their presentation-only role.

**Consequence.** Sum overlapping accelerations before limiting velocity. Leaving a field preserves
ordinary momentum; steering remains available. Pause stops simulation, and retry clears velocity.
Holding the travel direction gradually relaxes speed above the normal running limit; opposite
input keeps stronger steering so launches carry forward while remaining controllable.
Rendering and sound consume bounce events without advancing physics. Authors keep checkpoints
outside fields and verify launches, recovery, and route joins in the built game.

**Owner.** [src/types/level.ts](../src/types/level.ts),
[src/types/simulation.ts](../src/types/simulation.ts), and
[src/simulation.ts](../src/simulation.ts).

### Typed cellular section authoring

**Decision.** Compile authored tunnel, terrace, bounce-chamber, and five semantic surprise specifications into the existing
level arrays with local coordinates and stage-prefixed IDs.

**Why.** Sections make route variation easier to compose while keeping geometry in TypeScript.

**Consequence.** Compiler checks support authoring but do not prove traversal. Level sources own
objectives, joins, optional paths, and recovery. The specification sheet describes composition
without becoming a second editable campaign.

**Owner.** [src/types/sections.ts](../src/types/sections.ts),
[src/levels/section_specs.ts](../src/levels/section_specs.ts), and
[LEVEL_DESIGN.md](LEVEL_DESIGN.md).

### Authored escalating surprises

**Decision.** Compose deterministic optional discoveries and distinct stage signatures from shared
motion, collapse, launch, and field primitives. Teach an unfamiliar demand on safe support before
combining familiar demands; preserve left, right, and jump throughout.

**Why.** Surprise comes from changing spatial and movement expectations while preserving readable
actions and quick recovery.

**Consequence.** Collapse-chain timing supplies voluntary chase pressure above a safe catch floor.
Optional express routes and shortcuts rejoin before required biological objectives. Orbiting ledges
retain axis-aligned collision rectangles; passenger capture, lethal pursuing AI, rotated solid
bodies, and falling rigid-body ribosomes remain separate deferred systems. Keep human enjoyment
distinct from measured automated traversal.

**Owner.** [src/types/level.ts](../src/types/level.ts),
[src/types/sections.ts](../src/types/sections.ts), and [LEVEL_DESIGN.md](LEVEL_DESIGN.md).

### Recipe-owned safe encounters

**Decision.** Use five explicit semantic recipes with bounded controls and generated recovery:
ribosome bridge, organelle pinball, vesicle express, orbit chamber, and low-gravity shaft.

**Why.** Authors can choose a movement situation without repeating rectangle placement or creating
another runtime entity system. Shared arrays retain one simulation and collision authority.

**Consequence.** Static ends and catch floors support recovery. Checkpoints exclude moving,
bouncing, and crumbling support, full motion envelopes, hazards, and generated/authored fields.
Selected high caches use deterministic static steps and a return. Level data owns objectives
and joins; built controls-only traversal remains necessary after compiler acceptance.

**Owner.** [src/types/sections.ts](../src/types/sections.ts),
[src/levels/surprise_patterns.ts](../src/levels/surprise_patterns.ts), and
[src/levels/section_specs.ts](../src/levels/section_specs.ts).
