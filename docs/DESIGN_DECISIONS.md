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
