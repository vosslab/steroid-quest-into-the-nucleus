# Nucleus level handoff

Owned implementation: [src/levels/nucleus.ts](../../../src/levels/nucleus.ts).

## Route and biology

Receptor exploration uses four single-jump transitions before binding. Reach x1960 on the
650-high shelf to bind; the trigger overlaps the supported player and immediately creates a safe
checkpoint. The first post-binding shelf at x2290/y510 rises 140 units and requires the new air
jump. Required gaps after binding are 120-210 units; the greatest climb is 140 units.
The steroid remains visible inside the complex through the renderer's bound-player illustration.

DNA uses chromatin shelves with 170-190-unit gaps and climbs no greater than 140 units.
Moving shelves oscillate vertically by only 10 units, preserving the route envelope. Stationary
checkpoints span each safe shelf every two transitions (roughly 880-940 horizontal units).
Optional high shelves hold extra collectibles and do not intercept the required descent route.

The HRE and exit share x8960/y435/55x45, with HRE first in trigger order. Binding therefore
starts the transcription transition on the same simulation step. The generic pathway's caption
states that the receptor is intracellular and binds in the nucleus in this example. A caption
identifies DNA platforms and the air jump as arcade abstractions.

## Browser route positions

World x/y values below identify the left edge and top of each mandatory shelf. Move right near
its edge, hold the first jump, release near its apex, then press jump again after binding.
A second jump about 0.34 seconds after the first works for every required double-jump transition.
Before binding, holding a single jump works. Optional secrets need a deliberate detour.

| Stage | Shelf positions x/y |
| --- | --- |
| Receptor before binding | 0/650, 490/590, 820/525, 1150/590, 1490/650 |
| Receptor after binding | 2290/510, 2800/405, 3270/530, 3750/390, 4210/460 |
| DNA section 1 | 0/650, 560/510, 1000/400, 1440/520, 1910/380 |
| DNA section 2 | 2350/470 moving, 2790/600, 3260/460, 3700/340, 4140/450 |
| DNA section 3 | 4610/590, 5050/460 moving, 5490/330, 5960/460, 6400/600 |
| DNA section 4 | 6840/460, 7310/340, 7750/460 moving, 8190/590, 8640/480 |

Receptor checkpoint shelves: indices 2, 6, 8. DNA checkpoints: indices 2, 4, 6, 8, 10,
12, 14, 16, 18. Exit receptor at x4480/y365; dock DNA at x8960/y435.

## Verification evidence

- `npx tsc --noEmit -p tsconfig.json`: passed.
- `npx eslint src/levels/nucleus.ts`: passed.
- `npx prettier --write src/levels/nucleus.ts`: clean.
- A temporary step-level feasibility probe checked all 28 adjacent required shelf transitions
  against the actual simulation and moving-platform geometry; all landed on their next shelf.
  This probe initialized launch positions and is geometry evidence only.
- A separate temporary controls-only controller started at the receptor stage's normal spawn,
  traversed both stages, bound the receptor, collected seven items, activated all checkpoints,
  and reached HRE plus exit in 47.82 simulated seconds with zero deaths. It never changed player
  state or progression. An appended transcription stub allowed the final exit trigger to fire.
- The initial controls-only probe exposed an optional secret intercepting a required descent;
  moving that secret above the previous shelf fixed the route. Shelf-wide checkpoint regions
  also fixed missed checkpoints when landing beyond a narrow flag region.

These probes are focused simulation evidence. They do not replace a built-browser walkthrough,
screenshots, or human playability assessment. The observed expert route is under one minute for
these two stages; it does not support claiming an 8-12 minute campaign duration.
