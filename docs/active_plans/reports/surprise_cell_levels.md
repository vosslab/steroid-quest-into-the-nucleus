# Cell-stage surprise handoff

## Authored rhythm

The three stages retain their biological objectives and ordinary unbound controls. Compiled
recipes provide stationary catches and checkpoints. The rare upper cache belongs to cytoplasm
pinball; reading and all fragments remain optional. Source geometry remains in
[src/levels/cell.ts](../../../src/levels/cell.ts).

| Stage | Extent | Signature |
| --- | --- | --- |
| Membrane | 0-4240; floor 600 | Direct permeable bilayer, then a floor-flush pop and reforming shelf |
| Cytoplasm | 0-7160; floor 780 | Gel squeeze opens into giant mitochondrion pinball, then express travel |
| Envelope | 0-5040 | Visible pore current followed by an optional low-gravity nucleoplasm loft |

Membrane keeps its established direct bilayer at x=2460-2650. Its compiled `lipid_pop` begins at
3200, with automatic bumper x=3420 and landing x=3530, y=540. Landing crumble delay is 0.9 s;
reform is 2.5 s. The broad floor catches a fall. The original launch and early optional branch
retain their IDs. The new checkpoint sits at x=3240, before the pop.

Cytoplasm replaces the repeated 13,815-unit route with this sequence:

| Recipe | Extent | Optional entry, reward, return |
| --- | --- | --- |
| Gel squeeze | 0-1200 | Required low hop at x=650; safe opening at 1200 |
| Giant pinball | 1200-2840 | Automatic bumpers at 1420/1720; cache steps 2060-2460; reward 2320,y=575 |
| Ribosome chase | 2840-3980 | Entry steps 3060/3130; crumble bridge 3240-3600,y=660; stable exit shelf |
| ER express | 3980-5020 | Whole-body push 4200-4800,y=440-780; ordinary floor exit |
| Vesicle orbit | 5020-6360 | Steps at 5300/5750; orbiters centered at 5405/5855; both return to floor |
| Open approach | 6360-7160 | Calm wide final floor and continuously open pore landmark |

The cache uses five static ascending/descending steps. The ribosome shortcut has three crumble
tiles, delay 0.65 s and reform 3 s; the entire span sits over a solid gel catch. Orbiters have
40-unit x/y radii and 5 s periods. Pinball and express affect a player on the ordinary floor.

Envelope preserves its required ledge climb and always-open pore at x=2080. A directional field
at x=1680-2070,y=350-480 pushes toward the pore; the approach checkpoint remains outside it.
The compiled `nucleoplasm_loft` occupies 4000-5040. Its field is x=4220-4820,y=440-780,
gravity scale 0.4. Ledges start at 4280/4390/4500/4610, with tops 710/640/570/500. Rewards
are at 4330,y=600 and 4630,y=460. The lower floor permits immediate recovery and optional
bypass. The final checkpoint is x=4040, outside the field.

## Source-control verification

All simulation probes use only `start`, `step`, and ordinary directional/jump input. State is
read for steering and observations; no coordinate assignment, teleport, ability grant, or fake
checkpoint is used.

- `npx tsc --noEmit -p tsconfig.json`: PASS, zero diagnostics.
- `node --import tsx --test tests/test_level_sections.mjs`: PASS, four tests.
- Focused ESLint: PASS; Prettier writes only owned source/test files.
- Standard controller crosses all three complete routes with zero deaths and safe retry.
  The new membrane bumper fires, its contacted shelf collapses, and express speed exceeds 420.
- Cache/chase probe lands all five cache steps, collects its reward, returns, then lands both
  bridge entry steps, all three crumble tiles, and the recovery shelf. It collects the bridge
  lure and observes all three tiles collapse; final x=7060, zero deaths.
- Deliberately waiting on the first crumble tile produces collapse, then catches the player
  on the gel floor in 0.392 s, zero deaths. The tile reforms 3.008 s after collapse. The nearby
  checkpoint is `cytoplasm-ribosome_chase-checkpoint-0`.
- Orbit probe lands both approach steps and both orbiters, waits through a full 5 s cycle on
  the first orbiter, collects both upper fragments, and returns to x=7060 with zero deaths.
- Loft probe lands all four ledges, collects both rewards, reaches y=359, and returns toward
  x=4940 with zero deaths.

These are focused source simulation checks. Built keyboard traversal, intentional hazard death,
pause/resume, reduced-motion presentation, and subjective first-play enjoyment belong to the
integration/browser lane; this report does not claim those checks or remote publication.
