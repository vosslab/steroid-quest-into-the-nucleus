# Chaotic cell level design

## Outcome

The cytoplasm is authored through six reusable, typed sections rather than repeated shelf
profiles with tunnel rectangles layered over them. The draft 130-unit floor baffle that trapped
the unbound player is removed. Lower tunnel baffles are at most 65 units high, with clear
approach and recovery space; solid ceilings and organelle masses define the actual passage.

Source ownership for this batch:

- [Cell stages](../../../src/levels/cell.ts).
- [Shared section contracts](../../../src/types/sections.ts).
- [Section compiler](../../../src/levels/section_specs.ts).
- [Focused level tests](../../../tests/test_level_sections.mjs).

## Authored route

| Cytoplasm section | World x range | Physical rhythm |
| --- | --- | --- |
| Gel squeeze | 0-1800 | Low folds alternate with hanging reticulum masses. |
| Organelle weave | 1800-4050 | Staggered mitochondrion and reticulum masses, a small enzyme hazard, safe landings. |
| Vesicle crossing | 4050-6535 | Rising terraces, moving upper vesicles, and a buoyant current that reaches a shortcut. |
| Spring chamber | 6535-8135 | A floor-flush automatic spring clears a 135-unit solid organelle, followed by a descending recovery ledge. |
| Filament garden | 8135-11715 | A vertical canopy climb to y=430, then generous descending terraces. |
| Nuclear approach | 11715-13815 | A final organelle tunnel with low baffles and quiet recovery before the envelope. |

The 13,815-unit cytoplasm replaces 32,565 units of repetitive shelf sequences. The latest goal
prioritizes distinct squeezes, launches, moving environments, shortcuts, and quick recovery;
route length is not used as a substitute for variety or evidence of human playtime.

The membrane's floor-flush spring at x=1860-2000 launches onto the upper optional shelf at
y=435. A second shelf at y=500 leads back to the main membrane route. The envelope keeps its
open pore at x=2080-2180 and adds a spring immediately afterward at x=2230-2320. This launch
reaches a vertically drifting vesicle and a descending return shelf. The post-pore checkpoint
is on stationary support at x=2360, outside the spring.

## Authoring boundary

`compileSections(stage, sections)` deterministically lowers `SectionSpec` data into the existing
platform, checkpoint, hazard, collectible, decoration, current, and caption contracts. IDs have
stable stage and section prefixes. Authored data chooses tunnel baffles, terrace dimensions,
moving vesicles, spring landings, hazards, currents, and recovery points. Compilation changes
neither the simulation controller nor progression rules.

Validation rejects nonfinite or invalid dimensions, repeated section IDs, low-body-clearance
passages, floor baffles beyond the unbound allowance, missing approach/recovery space, blocked
checkpoint support, hazards near checkpoint spawns, and checkpoints inside currents. These
guards identify specific authoring errors. They do not certify arbitrary route reachability or
every join between independently authored sections.

## Verification

Focused commands passed after the source freeze:

```bash
node --import tsx --test tests/test_level_sections.mjs
npx tsc --noEmit -p tsconfig.json
npx eslint --max-warnings 0 src/levels/cell.ts src/levels/section_specs.ts src/types/sections.ts tests/test_level_sections.mjs
npx prettier --check src/levels/cell.ts src/levels/section_specs.ts src/types/sections.ts tests/test_level_sections.mjs
```

All four permanent tests passed. Their controls-only simulation walk supplies ordinary movement
and jump inputs while treating simulation state as read-only. Each of the three cell routes was
completed unbound with zero deaths. Observed simulation times were 10.958 seconds for the
membrane, 48.708 seconds for the cytoplasm, and 13.667 seconds for the envelope.

The walk observed actual standing-platform contacts on the membrane's spring secret, loft return,
and main floor; on the cytoplasm's mandatory high bounce landing and moving vesicle; and on the
envelope's drifting vesicle. It observed a bounce event and checkpoint contact in each stage,
then verified safe manual checkpoint recovery. A regression test rejects the original 130-unit
floor baffle. These are simulation and authoring results; the built browser walkthrough and
rendered-artifact acceptance belong to the integration lane. Human enjoyment and an 8-12 minute
first play remain unmeasured by these focused tests.
