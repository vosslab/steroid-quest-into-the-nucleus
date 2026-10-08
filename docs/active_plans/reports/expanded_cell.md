# Expanded cytoplasm implementation

The cytoplasm now contains six separately authored districts and 32,565 world units of
mandatory horizontal route. Membrane and nuclear-envelope geometry is unchanged. The
controller, movement speed, stage count, and optional-collectible policy are unchanged.

| District | Route x range | Shelf elevations | Rhythm |
| --- | --- | --- | --- |
| Entry filaments | 0-5315 | 585-780 | Low climbs, broad terraces, a short upper arc |
| Organelle weave | 5355-10665 | 590-780 | Organelles beside high and low corridors |
| Vesicle crossing | 10700-16215 | 610-790 | Three upper ferries over stable lower shelves |
| Filament garden | 16255-21510 | 360-780 | Six-step ascent, summit recovery, staggered descent |
| Spring grove | 21545-27010 | 640-780 | Three optional spring branches among short stair pairs |
| Nuclear approach | 27045-32565 | 640-780 | Paired climbs, then broad quiet final shelves |

The 96 required shelves use explicit widths, elevations, and preceding gaps. Required rises
are at most 70 units and uncovered gaps at most 100 units. Broad recovery shelves vary in
width and spacing rather than reproducing the previous four-shelf module. Every district has
a short optional caption. Main-route progression requires no collectible or moving platform.
Three moving upper ferries have 40-unit horizontal motion and upper stationary landing
shelves, with complete lower stationary shelves beneath them. Springs occupy upper branches;
ordinary travel under them remains available.

There are 25 stationary checkpoints. The largest interval between authored checkpoints is
1830 units (about 6.5 seconds at maximum horizontal speed). Checkpoints sit on wide shelves,
including the entrance to the vertical garden. Acid lies well below selected route gaps and
never overlaps required platforms. All platform, checkpoint, item, hazard, and caption IDs
remain unique and stage-prefixed.

Mitochondria and decorative vesicles are positioned 225 units above their nearby shelf floor,
including the first cytoplasm shelf. They therefore enter the normal player camera view
instead of remaining at the old fixed y=210. These organelles are decorative geometry.

## Controls-only proof and walkthrough guide

A temporary Node probe imported the actual level and `createSimulation`, started normally,
and sent only input frames at 120 Hz. It reached the envelope in **116.20 simulation seconds**
with **zero deaths** and **96 jumps**. It did not assign or mutate simulation state. This is an
optimized route measurement, not a human first-play duration or enjoyment claim.

For a reproducible main-route controller, select shelves with IDs matching
`cytoplasm-<district>-<number>`; exclude IDs ending in `-spring` or `-spring-secret`, and IDs
containing `-ferry`. Hold Right and hold jump through each flight. When grounded on a main
shelf and another shelf follows, press jump as the player's right edge reaches 55 units
before that shelf's right edge. The main shelf widths, gaps, and rises were verified with
that rule. A broadly matched exclusion for the word `spring` would incorrectly remove the
entire spring-grove district from route selection.

Verification passed: `npx tsc --noEmit`, focused ESLint with zero warnings, and Prettier for
[src/levels/cell.ts](../../../src/levels/cell.ts). The final whole-repository static checks and
built-browser campaign rerun are owned by the parent integration lane after both expanded
content files land. The built-browser run must confirm these upper branches, visible
organelles, garden climb, checkpoint recovery, and ending through normal keyboard input.
