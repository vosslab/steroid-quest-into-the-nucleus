# Cellular surprise final integration review

## Verdict

PASS for the approved delivered revision, with the evidence limits below. No blocking source,
composition, lifecycle, or selected rendered-scene finding remains. This independent reviewer
edited only this report, inspected source and accepted evidence, and did not rebuild, rerun the
campaign, mutate gameplay, or publish remotely.

Acceptance uses `test-results/surprise_campaign/accepted/report.json` and its 58 captures.
The `final/` and `rehearsal_01/` directories contain earlier failed harness runs and do not
establish final acceptance. The clean accepted run finished in 111.833 wall seconds and 111.66
simulation seconds, with one intentional hazard death and 13 of 27 optional fragments.

## Request and composition coverage

The human guidance asks for varied, escalating cellular surprises, readable controls, quick
recovery, six signature moments, and occasional discoveries. The approved investigation in
[surprise_design.md](surprise_design.md) separates implemented compositions from deferred systems.
The delivered five recipes are reusable contracts in `src/types/sections.ts`, lowered by
`src/levels/section_specs.ts` and `src/levels/surprise_patterns.ts` into the existing arrays.
They add no competing collision model, progression authority, or random campaign generator.

| Stage | Distinct delivered signature and ordinary-route change |
| --- | --- |
| Membrane | Direct lipid crossing followed by an automatic pinball pop and reforming shelf |
| Cytoplasm | Gel squeeze opens into giant mitochondrion pinball, optional crumble, required express current, and orbit chamber |
| Envelope | Stair climb meets a continuously open pore and approach current, then an optional low-gravity loft |
| Receptor | Visible binding opens the air jump; required gel hurdles sit inside low gravity before moons/cache and express folds |
| DNA | Nucleosome orbit and optional chromatin crumble precede a required launch over a solid fold and a calm HRE basin |
| Transcription | Docked complex recruits three times, then polymerase advances and one connected RNA transcript grows |

`src/levels/cell.ts`, `src/levels/nucleus.ts`, and `src/levels/transcription.ts` own these joins,
objectives, and signatures. Changes affect ordinary travel rather than relying entirely on distant
decoration. Selected caches, crumble/orbit routes, the envelope loft, and high DNA shortcut offer
detours above stationary recovery. Discoveries are deterministic and optional; rarity is an
authored composition choice, not a measured probability or randomized hidden-wall mechanism.

Express is delivered as ordinary corridor acceleration. Optional enclosed vesicle passenger
capture/express shortcuts, pursuing lethal AI, rotated solid collision bodies, and rigid-body
ribosome domino impacts remain investigated deferred ideas. Orbiting ledges translate
axis-aligned rectangles; giant organelle art does not enclose the player. This approved scope
does not claim every illustrative candidate as delivered.

## Independent accepted-artifact verification

I recomputed every one of the accepted report's 32 recorded source, dist, and controller hashes
against the current filesystem: zero mismatches. The report records zero source drift and matches
all three served assets to `dist/`. The accepted JavaScript SHA-256 is:

```text
03bab7b15590b851f47642a32d8a0c92fd03e1d7949c33377a087e8272ace9b2
```

The accepted report has `finished: true`, `errors: []`, six ordered stages, all five mechanics
true, actual cache collection and return, actual orbit carry, and a reduced-motion launch.
Its observations establish:

- Checkpoint death retains the collected fragment and checkpoint; recovery is observed after
  0.42 simulation seconds. This is one measured death/recovery, not a universal timing bound.
- Cytoplasm cache reward is collected on its upper steps and the route returns to support.
- Contact on the first crumble tile is followed by a lower-floor catch and reformed contact.
- No-input orbit riding changes x and y while retaining support; the recorded displacement is
  22.30 units during the short observation.
- Express samples exceed ordinary 280-unit run speed: 347.36 in cytoplasm and 350.15 in receptor.
  They also exceed the controller's separate 320-unit acceptance threshold.
- A marked low-gravity field supports an actual upward jump; normal controls continue to work.
- Binding precedes HRE activation; three recruitment actions precede RNA and ending.
- Replay clears fragments and milestones while preserving canvas identity. The 390-pixel
  reduced-motion title/gameplay stays within the viewport; Resume and Retry restore playing
  state with the same canvas and exactly one pending/maximum animation callback.

Reading `tests/playwright/campaign_walkthrough.mjs` confirms real keyboard/menu controls and
read-only observations. Source geometry guides steering; no player coordinates, checkpoints,
abilities, progression, or timers are assigned. `src/runtime.ts` writes observation attributes
after rendering; simulation never reads them. The harness wraps animation scheduling solely
to observe callback counts. Its final timer-polling wait avoids contaminating that monitor.

The earlier narrow failure came from the harness's default animation-frame polling adding a
second callback to the monitor. The accepted rerun uses timer polling; product source and the
accepted JavaScript hash are unchanged. A failed report is not relabeled as passing evidence.

## Source, documentation, and rendered assessment

Simulation owns crumble timing/collision, field forces, orbit carry, binding, HRE, and recruitment.
Renderer rectangles use authoritative `levelTime`, including reduced motion; decoration never
creates support. `src/renderer.ts` uses pause-aware `elapsed` for recruitment particle phases,
while RNA length/polymerase advancement use payoff progress. Reduced motion uses settled art.
This closes the infrastructure quality review's frozen-particle observation without changing
progression or docking.

The fresh infrastructure and authored specification/quality reports all pass their source scopes:
[surprise_infra_spec.md](surprise_infra_spec.md),
[surprise_infra_quality.md](surprise_infra_quality.md),
[surprise_levels_spec.md](surprise_levels_spec.md), and
[surprise_levels_quality.md](surprise_levels_quality.md).
The authored specification checks all 30 ordinary checkpoint bodies, including final appended
geometry. The manager separately reports passing `./check_codebase.sh` with 36 Node tests,
explicit `./build_github_pages.sh`, rebuilt browser smoke with two tests, and 1031 Python hygiene
tests. The later documentation closeout records 1033 full Python tests. These are attributed
fresh manager gates; this reviewer did not execute them again. My Markdown-link and ASCII
checks pass 216 tests, and `git diff --check` passes.

README, [LEVEL_DESIGN.md](../../LEVEL_DESIGN.md), [SOLID_MODEL.md](../../SOLID_MODEL.md), human
guidance, and design decisions match the source authority and delivered/deferred distinction.
The guide documents recipe bounds, recovery ownership, temporary movement rules, six signatures,
optional reading, and biological limits. It distinguishes required express corridors from
optional discoveries and keeps measured traversal separate from human first-play enjoyment.

I visually inspected these eight captures from the accepted directory: `crumble-fall-catch.png`,
`cytoplasm-giant_pinball-bumper-0.png`, `orbit-no-input-ride.png`, `low-gravity-jump.png`,
`open-pore.png`, `binding-settled.png`, `rna.png`, and `ending.png`. The collapsed tile has an
empty dashed ghost above an obvious catch; giant pinball has visible directional launch cues
and collision lips; orbit/loft scenes show lower recovery and marked movement regions. The pore
looks continuously open. Binding preserves the red steroid in the complex. RNA is one connected
strand emerging at polymerase, with the complex still at the response element. The ending and
Replay action are readable. No blocking readability issue was found in this selected scope.

## Limits

Full motion-cycle waiting, armed-timer pause, and clearance-based restoration are measured by
focused fixed-step/source controls evidence in the linked reviews and author reports. The built
campaign demonstrates a 450 ms no-input orbit ride, crumble/catch/reformed contact, and ordinary
membrane pause-menu lifecycle. It does not claim a browser full-cycle wait or armed-tile pause.

The accepted route covers the main campaign and selected optional cache/return, collapse miss,
and orbit ride. It does not play every receptor/DNA cache, every optional high shortcut, every
possible failure, or every viewport/theme state. Eight selected captures were inspected rather
than all 58. Reports of additional source detours remain separately attributed. No exhaustive
parameter, runtime performance, human first-play duration, enjoyment, or remote-publication
acceptance is asserted. Those limits do not block the approved delivered revision.
