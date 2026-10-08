# Surprise infrastructure quality review

## Verdict

PASS for source infrastructure correctness, with one nonblocking presentation observation.
No concrete runtime, compiler, type-contract, or geometry blocker was reproduced.
Only this report was edited. Campaign authoring and built controls-only acceptance remain
separate gates; this review does not establish human enjoyment or rendered readability.

## Independent evidence

- Reviewed shared level/section/simulation contracts, game-state initialization, physics,
  simulation, section compilation, all five pattern recipes, renderer, kinetic art,
  surprise art, and their focused tests against
  [surprise_ledger.md](../workstreams/surprise_ledger.md).
- Crumble expiry removes standing support before platform carry. Absent platforms are
  excluded from both collision passes. Reform checks current moving geometry. Countdown
  survives departure/recontact, pauses freeze it, and reset paths clear the authoritative map.
- Orbit carry uses the same geometry as collision and rendering. An independent fixed-step
  probe rode maximum recipe radii (80 by 65), minimum period (3 seconds), for 1,080 steps
  after landing: three full cycles, continuous support, no relative x drift, and exact feet/top
  alignment. Runtime uses this same `1 / 120` step.
- Compiler checkpoint clearance includes moving-platform envelopes and generated fields.
  An independent parameter sweep compiled 990 recipe combinations across floors 400/780/2000,
  encounter widths 600/800/1200/2400/8000, both secret modes, and boundary counts/radii/rises.
  It accepted 462 and rejected 528. Every accepted checkpoint body was clear at sampled
  platform times from 0 through 12 seconds in 0.125-second increments. Generated cache
  coordinates and platform bounds passed compilation throughout the accepted sweep.
  This is sampled numeric evidence, not traversal proof or exhaustive parameter coverage.
- A Canvas context probe checked finite numeric arguments, nonnegative arc/ellipse radii,
  and positive rounded-rectangle dimensions while drawing accepted orbit/crumble/field
  geometry and transcription progress 0/0.001/0.25/0.999/1 in both motion modes.
  It completed 521,084 drawing calls without invalid numeric geometry. This mock does
  not establish browser rendering, visual quality, or frame performance.
- Type contracts retain explicit discriminants and shared simulation authority. No broad
  cast, duplicated collision model, timer owner, or strict-flag weakening was introduced.
  Recipe count/size limits keep simulation arrays bounded; existing camera culling remains.

## Presentation observation

`src/renderer.ts:366` supplies `state.levelTime` to transcription payoff. During recruitment,
`src/simulation.ts:310` advances recruitment/elapsed clocks but leaves level time frozen.
Consequently, the incoming nucleotide phases and background silhouettes in
`src/surprise_art.ts:190` retain their relative positions during the four-second payoff.
Polymerase still advances and the connected RNA strand grows because both use progress.
If independently circulating particles are intended, use a pause-aware advancing clock such
as elapsed time for this presentation argument. This does not affect docking, progression,
or the accepted connected-transcript contract.

## Fresh checks and scope

Executed:

```bash
npx tsc --noEmit -p tsconfig.json
node --import tsx --test tests/test_surprise_mechanics.mjs tests/test_simulation.mjs tests/test_level_sections.mjs tests/test_surprise_patterns.mjs
node --import tsx --input-type=module # Inline parameter, Canvas, and full-cycle orbit probe.
```

Type checking exits 0 with zero diagnostics. Focused tests exit 0: 31 tests, 31 pass,
0 fail, 0 skipped. The inline probe exits 0 with the counts recorded above. Its first attempt
failed because the mock lacked `measureText().width`; adding that mock method resolved the
harness error. No source correction was needed. Existing old-level controls-only simulation
coverage passes in the focused run.

No build, dist preview, browser execution, fresh full suite, integration acceptance,
optional-route controls traversal, subjective assessment, or remote publication was performed.
