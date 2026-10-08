# Surprise infrastructure specification review

## Verdict

PASS for the reusable infrastructure contract. No blocking source-spec findings remain.
This review refreshed compiler and art sources after the manager's completion messages.
Campaign authoring, rendered readability, secret-route traversal, and integration acceptance
remain separate gates. Only this report was edited by this reviewer.

## Contract evidence

- `src/types/level.ts:13` and `src/physics.ts:13`: discriminated orbit motion uses seconds and
  phase turns, with cosine x and sine y translation. Rectangle width/height remain unchanged;
  legacy axis motion keeps its sinusoidal behavior.
- `src/simulation.ts:81`: contact-armed crumble countdown continues after leaving. Collapse
  clears standing support before carrying the rider, and reform waits for clearance of the
  current moving rectangle. `src/simulation.ts:173` and `src/simulation.ts:190` omit collapsed
  platforms from horizontal and vertical collision; `src/simulation.ts:195` arms only top contact.
- `src/simulation.ts:110`: both motion axes carry the standing player through the shared
  geometry helper. Retry and stage entry clear the map; Replay replaces session state.
  Pause returns before timer advancement, and checkpoint restoration preserves motion time.
- `src/simulation.ts:154`: only overlapping fields contribute. Gravity uses the minimum with
  normal scale 1; drag adds before exponential damping; acceleration sums independently.
  Existing opposing steering and field velocity bounds remain in effect.
- `src/types/sections.ts:81`: five named recipes expose encounter-specific controls and common
  recovery/cache controls. `src/levels/section_specs.ts:185` handles every discriminant explicitly.
  `src/levels/surprise_patterns.ts:18` owns generated local geometry and bounded recipe inputs.
  Compilation lowers to the existing platform/field arrays rather than introducing another
  simulation entity system or a coordinate language.
- `src/levels/section_specs.ts:263`: checkpoint recovery requires stationary support that is
  neither moving, bouncing, nor crumbling. Player body clearance uses full platform motion
  envelopes. Recovery excludes hazards and both generated and authored fields.
- `src/levels/surprise_patterns.ts:100`: pinball springs replace short catch-floor portions at
  the same floor height; floor travel can actually reach top-contact launch. The remaining
  catch floor stays broad. `src/levels/surprise_patterns.ts:124` supplies one giant mitochondrion
  spanning the encounter and optional cache; its outline remains decoration.
- `src/renderer.ts:131`: visual platform rectangles use authoritative motion time even with
  reduced motion. `src/surprise_art.ts:73` presents collapsed tiles as empty dashed outlines;
  armed tiles retain a continuous collision lip. Field rings/mesh and labels in
  `src/kinetic_art.ts:48` remain visible when decorative time is zero.
- `src/renderer.ts:361` and `src/surprise_art.ts:145`: successful recruitment advances polymerase
  and grows one connected RNA backbone. Reduced motion shows the settled payoff. Simulation
  recruitment changes timing/count state without moving the docked player; retry repeats the
  timing attempt while preserving docking.

## Fresh focused checks

Executed after compiler/art completion:

```bash
npx tsc --noEmit -p tsconfig.json
node --import tsx --test tests/test_surprise_mechanics.mjs tests/test_simulation.mjs tests/test_level_sections.mjs tests/test_surprise_patterns.mjs
```

Type checking exits 0 with zero diagnostics. The focused Node run exits 0: 31 tests, 31 pass,
0 fail, 0 skipped. This includes 9 surprise-mechanics tests and 8 surprise-pattern tests.
Existing simulation tests cover docking, ordered recruitment, pause/retry, and Replay.
Pattern tests establish deterministic lowering, safe checkpoint support, cache geometry,
offset/ID behavior, invalid-input rejection, actual pinball launch, and express acceleration.

No dist build, browser test, full integration check, rendered acceptance, or remote publication
was performed in this source-spec review. Upper routes and cache returns need the subsequent
built controls-only authoring review; their source geometry alone is insufficient play evidence.
