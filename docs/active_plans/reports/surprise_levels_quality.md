# Surprise campaign quality review

## Verdict

PASS for the finalized authored-source scope. No concrete blocking or nonblocking quality
findings remain. This fresh review changes only this report. Final built keyboard traversal
and integration acceptance remain separate manager gates.

## Source assessment

- `src/levels/cell.ts:14` translates the compiled membrane and envelope encounters once,
  including checkpoint spawn coordinates. Their recipes remain local and reusable; final
  level arrays retain ownership of the existing geometry and biological objectives.
- `src/levels/cell.ts:154` makes the cytoplasm rhythm readable as named sections with explicit
  movement parameters. Flush pinball springs and the express field affect ordinary travel;
  optional caches, orbit riding, and the crumble crossing retain stationary catches.
- `src/levels/nucleus.ts:81` confines the receptor canopy and required field hurdles to
  authored connective geometry. Binding remains visible and simulation-owned. The canopy
  channels contact without introducing another ability or progression authority.
- `src/levels/nucleus.ts:173` composes orbit, optional crumble, required launch, and recognition
  into distinct encounters. `src/levels/nucleus.ts:219` uses a directional launch for the solid
  fold; the ordinary route actually lands on it in the fresh probe below.
- `src/levels/nucleus.ts:275` places the HRE before its identical exit region. The trigger
  loop at `src/simulation.ts:245` resolves binding and HRE before their gated transitions.
  Rewards and captions do not supply progression authority.
- `src/levels/surprise_patterns.ts:253` gives high caches a static ascent/descent branch.
  Encounter mechanics and authored identities remain separate: the DNA crumble caption
  describes chromatin even though it reuses the bridge recipe. Internal recipe IDs do not
  appear as instructional claims.
- `tests/test_level_sections.mjs:102` steers through ordinary controls and observes state.
  Assertions protect actual launch, crumble, express, optional return, and retry behavior
  rather than merely matching recipe names. The cell test's recovery assertion covers its
  final reached checkpoint; the broader checkpoint audit belongs to the specification review.
- `src/renderer.ts:366` supplies simulation elapsed time to payoff decoration. The correction
  is narrow: progress remains tied to the payoff countdown, reduced motion receives settled
  progress and zero decorative time, and simulation pause freezes elapsed time.

## Fresh verification

```bash
npx tsc --noEmit -p tsconfig.json
node --import tsx --test tests/test_level_sections.mjs tests/test_surprise_patterns.mjs tests/test_surprise_mechanics.mjs tests/test_simulation.mjs
```

Both commands exit 0. Type checking produces no diagnostics; the focused suite passes all
31 tests, with zero failures or skips.

A fresh ephemeral probe runs `node --import tsx --input-type=module` and imports the final
`NUCLEUS_LEVELS` and `createSimulation`. It starts naturally at receptor spawn, holds right,
and presses/holds jump for nearby solid folds. State is read for steering and observations;
no coordinates, ability, checkpoint, or milestone are assigned. It traverses receptor into
DNA, binds the receptor, reaches HRE at x=5200.94/y=620, and records zero deaths. Contact
observations include `dna-chromatin_launch-landing`, its descent, and the recognition basin.
An initial controller with a shorter lookahead stalled before the first fold; increasing
ordinary jump anticipation from 95 to 130 units resolves that controller limitation.

The handoffs [surprise_cell_levels.md](surprise_cell_levels.md) and
[surprise_nuclear_levels.md](surprise_nuclear_levels.md) supply separately attributed optional
branch probes. The fresh [surprise_levels_spec.md](surprise_levels_spec.md) supplies the final
checkpoint-body audit and payoff/pause fixture evidence. This review does not relabel those
checks as its own fresh execution.

Two existing rehearsal captures were visually inspected:
`test-results/surprise_campaign/rehearsal_01/low-gravity-jump.png` and
`test-results/surprise_campaign/rehearsal_01/dna.png`. They show a marked field with readable
ascending ledges and a visible stationary floor beneath the DNA orbit route. They are limited
rehearsal observations, not final built acceptance or coverage of every viewport/state.

No dist build, browser execution, full-suite run, or remote publication was performed by this
reviewer. The controls-only manager walk owns final optional-route recovery, intentional death,
waiting, pause/retry/Replay, and reduced-motion presentation evidence. The deferred situations
in [surprise_design.md](surprise_design.md) are outside this delivered revision's quality gate.
