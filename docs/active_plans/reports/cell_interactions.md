# Cell interaction implementation

## Settled contract

- [src/types/level.ts](../../../src/types/level.ts) adds optional `Platform.launch: Point`.
  On a bounce platform's top contact, the vector sets velocity in pixels/second. Authors use a
  negative y component for lift. Omission preserves horizontal momentum and the previous vertical
  bounce speed. Materials remain visual treatments; moving gel uses explicit bounce and motion.
- Optional `LevelDefinition.flowZones` holds rectangles with an ID and `acceleration: Point` in
  pixels/second squared. The player receives their summed acceleration during overlap. Fields are
  bounded geometry, not persisted effects. Leaving one stops its force while ordinary momentum
  remains. Authors keep checkpoint spawns outside active currents.
- [src/simulation.ts](../../../src/simulation.ts) applies fields after steering and jump handling,
  then gravity. Overlapping fields sum before one speed limit: horizontal speed stays between
  -720 and 720 pixels/second, and vertical speed between -720 and 1000 while in a field.
- Steering with horizontal overspeed uses the normal air drag rather than the stronger movement
  acceleration. Opposite steering keeps its stronger acceleration. Ordinary movement at or below
  maximum running speed is unchanged. A 420 pixels/second launch retains 345 pixels/second after
  0.15 seconds with input held in its direction, and opposite input reverses it within 0.3 seconds.
- [src/types/simulation.ts](../../../src/types/simulation.ts) adds
  `{ type: "bounce", platformId: string }`. The event fires on top-contact launch, including
  ordinary bounce platforms. Renderer and sound owners can consume this authoritative event.

## Verification

[tests/test_interactions.mjs](../../../tests/test_interactions.mjs) adds five stable behavior checks:
directional launches on moving gel with steering, updraft lift and opposing input, immediate force
exit with retained momentum, bounded overlapping currents independent of their authored order,
and pause/retry restoring an ordinary safe spawn.

- `node --import tsx --test tests/test_interactions.mjs tests/test_simulation.mjs`: 15 pass.
- `npx tsc --noEmit -p tsconfig.json`: pass after concurrent renderer integration completed.
- Focused ESLint and Prettier checks on all four owned source/test files: pass.
- `git diff --check`: pass at the implementation checkpoint.

These are focused simulation checks. The manager owns full repository checks, rebuilt browser
campaign acceptance, rendered telegraphing, and publication decisions.

## Rules receipt

Applied the repository orientation skill and read `AGENTS.md`, `docs/*_STYLE.md`,
`docs/SOLID_MODEL.md`, and the latest dated changelog entry. Python uses
`source source_me.sh && python3`. Permanent tests protect stable behavior; transient inventories,
tunable incidental values, real-time delays, and unseeded outcomes are fragile tests. The latest
changelog explicitly marks fresh corridor acceptance as pending, so these focused tests do not
replace campaign acceptance.
