# Expanded nucleus route

## Implemented content

Following **Fix the design, not the symptom**, the route adds authored geometry while preserving
controller speed and retries. Receptor spans 14,000 units with 28 main shelves; DNA spans 26,050
units with 43. Required travel is about 39,300 units across this lane.

| Stage | District | Route x | Rhythm |
| --- | --- | --- | --- |
| Receptor | Low terraces | 0-3270 | Short rises, changing running lengths |
| Receptor | Nucleoplasm fold | 3270-5900 | Compact climb to y385 and descent |
| Receptor | Pocket approach | 5900-7600 | Broad rests and continuous binding shelf |
| Receptor | Ability staircase | 7600-11040 | Safe teaching pair, tall arc to y220 |
| Receptor | Lateral transfers | 11040-13870 | Wider gaps mixed with low terraces |
| DNA | Chromatin terraces | 0-5540 | Alternating low and tall launches |
| DNA | Wide arcs | 5540-11730 | Tall climbs, wide shelves, descents |
| DNA | Nucleosome transfers | 11730-17180 | Four moving shelves bracketed by stable rests |
| DNA | Vertical fold | 17180-21400 | Climb to y165, plateau, long descent |
| DNA | Recognition approach | 21400-25910 | Smaller fold, quiet final run, matching HRE |

The moving nucleosomes oscillate vertically by 25-32 units. Main-route rises before binding stay
at or below 70 units, with uncovered gaps at or below 100. After binding, stationary rises stay
at or below 135 and gaps at or below 200. Optional secrets branch above the route. Checkpoints
sit on stationary shelves every two main shelves, including each moving-section launch shelf.
Their separation varies with shelf length and is usually about 900-1300 units.

## Binding geometry correction

The receptor artwork sits at x7100/y590 with its visible pocket centered near x7155/y634. The
binding rectangle is x7143/y623, 24 by 24 units. A grounded steroid center is y635 on the broad
y650 shelf; activation therefore occurs inside the visible pocket. The pocket is sufficiently
deep into the shelf that a normal jump from the preceding terrace lands before entering it.
The binding checkpoint retains the actual current position, with this broad shelf underneath.

The HRE and exit remain coincident and ordered at x25700/y485, 55 by 45 units, on the final y530
shelf. Walkthrough capture thresholds should use this location rather than the prior x8960.
Main shelf IDs end in receptor-shelf-27 and dna-shelf-42. Source-based walkthrough helpers should
select the final shelf from geometry rather than retaining the old -9/-19 termination exception.

## Verification evidence

A controls-only simulation starts at the receptor spawn and advances the real fixed-step
controller through every required transition, binding, DNA, HRE, and the following stage. It uses
right movement, grounded ledge launches, and a released/repressed jump after 0.34 seconds. It
reads player position and platform geometry; it does not teleport, alter progress flags, or
mutate simulation state. The temporary probe is outside the repository.

- Receptor completion: 49.025 simulated seconds.
- DNA completion: 91.917 simulated seconds.
- Combined lane completion: 140.942 seconds; zero deaths; receptor and HRE milestones both true.
- `npx tsc --noEmit -p tsconfig.json`: passes.
- `npx eslint src/levels/nucleus.ts`: passes.
- `npx prettier --check src/levels/nucleus.ts`: passes.

These timings describe an optimized controls-only lane run. Full built-artifact walkthrough,
rendered pocket/moving-platform/vertical-route review, and human first-play pacing remain owned
by integration acceptance. They do not establish the 8-12 minute novice target or enjoyment.
