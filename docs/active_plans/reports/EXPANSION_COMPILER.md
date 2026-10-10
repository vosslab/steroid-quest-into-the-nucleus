# M1 compiler handoff

## Result

The four recipe families now author chamber-local positions under one `placement` origin.
Compilation moves shapes, rectangular regions, vortex centers, transport paths, decorations,
collectibles, triggers, and both kinds of recovery spawn together. Force vectors, release
velocities, impulses, orbital motion radii, phase values, and timings remain unchanged.

Stable local names compile as `stage-chamber-primitive`. Phase conditions name a local chamber
and compile as `stage-chamber`. Inserting or reordering primitives does not change references.
Required encounter IDs follow the chamber array order; completion checkpoint ranks start at 1.
Exploratory markers have rank 0 and optional encounters have no completion save.

## Authoring example

Use `currentLoop(base, acceleration)`, `transportRelay(base, path, kind)`,
`captureChamber(base, stickyRect)`, or `channelTransfer(base, path)`. The base supplies local
entrance/exit, dimensions, placement, objective, sequence, and required/optional status.
Required recipes also supply the player top-left `completionCheckpoint`.

```ts
const recipe = channelTransfer(
  {
    id: "delivery",
    placement: { x: 600, y: 0 },
    width: 600,
    height: 620,
    required: true,
    objective: "Ride the channel to its delivery pocket.",
    entrance: { x: 40, y: 420 },
    exit: { x: 500, y: 320 },
    completionCheckpoint: { x: 440, y: 530 },
    sequence: [
      { id: "capture", kind: "transport_capture", transportId: "channel", caption: "Board the channel." },
      { id: "delivery", kind: "transport_delivery", transportId: "channel", caption: "Delivered." },
    ],
  },
  [{ x: 70, y: 420 }, { x: 270, y: 250 }, { x: 500, y: 320 }],
);
```

Recipe-generated names are `circulation`, `cargo`, `sticky`, and `channel`; the compiler owns
`return`, `checkpoint`, and `complete`. Author additional primitives with distinct local names.
Extend a recipe with an object spread and explicit array additions; all positions remain local.
The example uses a calm completion spawn outside the recovery strip. Moving this chamber requires
only a new placement origin and enough world space for its unchanged dimensions.

## M1 content migration

- Membrane retains its four original loop phases, initial rebound, backward sweep, return descent,
  and arriving vesicle. The finish channel completes on delivery.
- Cytoplasm requires motor delivery followed by the existing giant mitochondrial contact, then
  ER channel delivery. The optional vesicle remains separate from required motor delivery.
- Envelope completes on successful pore crossing. A missed pore remains recovery behavior.
- Receptor explicitly completes on `receptor_bound`; its matching trigger opens after the first
  encounter step. The special trigger checkpoint rank 20 is removed.
- DNA retains its flow-switch phase and completes on `hre_bound`; matching HRE capture opens after
  the flow-switch work. No preceding step requires binding.
- The five destinations are a motor-carried vesicle, nucleus, receptor, chromatin coil, and response
  element/gene. Transcription has no onward destination.
- World geometry and timing remain mechanically unchanged; M2/M3 expansion is outstanding.

Overlapping chamber extents are accepted. Each chamber must truthfully contain its local geometry,
moving-shape envelope, and all translated bounds inside the world. Validation rejects duplicate
names, invalid phase/contact/transport references, out-of-bounds positions, unsafe completion and
marker spawns, and transport routes through static solids or hazards. Moving spawn safety inflates
samples by the maximum travel to a sample so continuous orbital contacts are covered.

## Owned changes

Source:

- [section_specs.ts](../../../src/levels/section_specs.ts): compilation and world safety checks.
- [chamber_validation.ts](../../../src/levels/chamber_validation.ts): focused local author checks.
- [surprise_patterns.ts](../../../src/levels/surprise_patterns.ts): four local recipe constructors.
- [cell.ts](../../../src/levels/cell.ts): membrane, cytoplasm, and envelope migration.
- [nucleus.ts](../../../src/levels/nucleus.ts): receptor and DNA migration.
- [transcription.ts](../../../src/levels/transcription.ts): empty required list and destination.

Tests:

- [test_level_sections.mjs](../../../tests/test_level_sections.mjs): translation, references,
  insertion/reordering, required order, local bounds, calm spawns, paths, campaign contracts.
- [test_surprise_patterns.mjs](../../../tests/test_surprise_patterns.mjs): local return streams,
  transport paths, and named delivery steps. Exact campaign tuning/geometry assertions are removed.

## Verification

- `node --import tsx --test tests/test_level_sections.mjs tests/test_surprise_patterns.mjs`:
  10 tests pass.
- `npx tsc --noEmit -p tsconfig.json`: exit 0 after all shared consumers landed.
- `npx eslint` on the eight owned source/test files: exit 0.
- `npx prettier --write` on the eight owned source/test files: complete.
- `git diff --check` restricted to owned files: exit 0.
- One-time `/tmp/compare_level_geometry.mjs`: all six stages match HEAD world geometry, forces,
  motion, timing, palette, initial spawns, and exploration-marker geometry after removing identity,
  phase-gate, and order metadata. This probe is outside permanent tests.

No shared contract/runtime/simulation/render/app files were edited. No Git index operations were
performed. No remaining owned compiler errors are known. The named-step D10 correction is
implemented and verified; fresh M1 specification and quality reviews both ACCEPT, and integrated
build/browser checks pass. This compiler handoff and M1 acceptance do not establish completion of
the active M2 route, M3 campaign expansion, or M4 pacing and final acceptance gates.
