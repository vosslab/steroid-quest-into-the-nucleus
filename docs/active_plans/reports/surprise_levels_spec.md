# Surprise campaign source review

## Verdict

PASS for authored source contracts and the payoff-clock correction. No blocking source-spec
findings remain. This fresh review edits only this report. Built keyboard traversal, rendered
readability, fresh quality review, and integration acceptance remain separate gates.

The authored campaign combines reusable recipes into six different stage signatures. Source
checks establish a route hypothesis and recovery contracts; they do not establish first-play
enjoyment or global reachability of every optional route.

## Contract evidence

- `src/levels/cell.ts:36` adds a floor-flush membrane pop and a temporary shelf over a catch
  after the permeable bilayer. `src/levels/cell.ts:126` retains the direct-crossing caption;
  the lipid decoration does not add a collision door.
- `src/levels/cell.ts:174` composes giant organelle pinball, optional ribosome collapse,
  express travel, and an orbit chamber after the opening squeeze. Pinball springs and the
  express field affect ordinary floor travel; new encounters are not solely distant decoration.
  The large cache is a deterministic optional branch rather than a progression requirement.
- `src/levels/cell.ts:295` adds a directional approach current while the walls at lines
  337-338 leave the pore passage continuously open. The optional low-gravity loft adds a
  later change in movement without obstructing the ordinary exit.
- `src/levels/nucleus.ts:19` introduces required gel hurdles within a low-gravity field,
  then opens into orbit/cache space and narrows into the express recipe at line 56.
  The canopy at line 85 leaves 60 units above the floor, exceeding the 30-unit player body;
  its top is beyond unbound jump reach. The visible receptor trigger at line 142 remains
  local to the artwork. This prevents repeated jumping from skipping contact and reaching
  the receptor exit unbound.
- `src/levels/nucleus.ts:173` combines orbit, voluntary crumble race, required launch across
  a solid fold, and a quiet recognition basin. The lower orbit/bridge routes deliberately
  remain safe alternatives; their upper timing challenges are optional. The launch is a new
  mandatory encounter, rather than extending the entire DNA stage as an empty floor walk.
- `src/levels/nucleus.ts:275` places HRE before the identical exit region at line 285.
  `src/simulation.ts:266` requires binding for HRE activation; lines 277-282 gate entry to
  DNA/transcription on the corresponding biological milestones. Collectibles and captions
  never gate those transitions.
- `src/levels/transcription.ts:14` keeps the complex docked at its HRE beside recruitment.
  `src/simulation.ts:270` requires both milestones and clears velocity on recruitment;
  recruiting steps do not move the player. The generic authored nuclear receptor location,
  direct bilayer crossing, open pore, and nearby-promoter/RNA model remain intact.
- `src/types/sections.ts:81`, `src/levels/section_specs.ts:185`, and
  `src/levels/surprise_patterns.ts:16` keep recipe controls, lowering, and generated local
  geometry separate from level composition. Levels reuse the same named recipes with varied
  floor heights, fields, orbit extents, and optional caches. The small canopy, required gel
  hurdles, and launch shortcut are authored connective geometry, not new runtime mechanisms.

## Recovery scope

A fresh read-only audit imports the final six authored definitions and checks all 30 ordinary
checkpoint spawn bodies. Every body has full stationary support that is neither bouncing,
moving, nor crumbling; no body overlaps a hazard, field, solid rectangle, or full platform
motion envelope. This includes manual membrane/envelope checkpoints and final geometry added
after compilation. It is an audit of this authored campaign, not a new global validator.

`src/levels/section_specs.ts:263` separately validates compiled local checkpoint recovery.
Compilation cannot validate arbitrary geometry appended afterward. Binding's event-created
checkpoint is a distinct simulation contract; the focused repeated-jump probes observe safe
binding at y=660, and the nuclear author reports retry preservation of that checkpoint.

Catch floors keep cache, orbit, collapse, and loft misses recoverable. The source layout and
focused authoring probes support that claim for the recorded encounters; built-route coverage
must still exercise intentional hazard death and actual keyboard recovery.

## Payoff timing

`src/renderer.ts:366` now passes `state.elapsed` to `transcriptionPayoff`. The nucleotide and
molecular phases at `src/surprise_art.ts:182` and line 191 therefore advance during recruiting,
when platform motion time stays fixed. RNA length/polymerase progress still use the four-second
payoff countdown. Reduced motion receives zero decorative time and settled progress.

`src/simulation.ts:302` returns before elapsed advancement while paused; recruitment advances
elapsed and its clock at lines 303/311. A fresh fixture probe reaches three successful windows,
observes elapsed advance over 60 recruiting steps while level motion time stays fixed, then
pauses for 120 steps. Elapsed, recruitment clock, and payoff countdown all remain unchanged.
Resume advances elapsed again, and the docked player coordinates remain unchanged throughout.
The fixture isolates timing; it is not authored-campaign or rendered acceptance.

## Fresh focused checks

Executed for this review:

```bash
npx tsc --noEmit -p tsconfig.json
node --import tsx --test tests/test_surprise_mechanics.mjs tests/test_simulation.mjs tests/test_level_sections.mjs tests/test_surprise_patterns.mjs
```

Type checking exits 0 with no diagnostics. The focused Node run exits 0 with 31 passed tests,
0 failed, and 0 skipped. It includes the controls-only ordinary cell traversal test, recipe
lowering and recovery checks, crumble/orbit/field behavior, docking, recruitment retry, pause,
and Replay.

Additional ephemeral probes run through standard simulation commands and ordinary input:

- Final-definition audit: 30 ordinary checkpoint spawn bodies pass the support/clearance audit.
- Repeated-jump approach: periods of 45, 70, and 100 fixed steps all bind at x470-471, y660,
  proceed past x700, and record zero deaths. Player state is observed, never assigned.
- Payoff fixture: elapsed progression, pause freeze, fixed motion time, and docking pass.

The authoring handoffs in [surprise_cell_levels.md](surprise_cell_levels.md) and
[surprise_nuclear_levels.md](surprise_nuclear_levels.md) additionally report controls-only
source probes for cache returns, full ordinary progression, cell orbit riding, collapse/reform,
and the loft. Those reports remain separately attributed evidence, not fresh rendered checks
by this reviewer. No dist build, browser test, full integration run, or remote publication was
performed in this source review. Built coverage must resolve optional DNA branches, motion-cycle
waiting, reduced-motion cues, pause/retry presentation, and visual route clarity.
