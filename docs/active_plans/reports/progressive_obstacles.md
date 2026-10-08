# Progressive obstacle implementation

Owned files: `src/levels/cell.ts`, `src/levels/nucleus.ts`.

Added two membrane hurdles, 25 cytoplasm hurdles, ten receptor hurdles, and eighteen DNA
hurdles. Low solid protein/debris blocks alternate with narrow visible enzyme hazards.
Cytoplasm density rises from three selected terraces in the entry district to five in each
of the last two districts. Nucleus obstacles use broad stationary shelves; enzyme hazards
follow climbs, while descents use blocks that can safely receive a landing.

Selected shelves retain at least 100 world units beyond each obstacle for the next launch.
Checkpoint recovery positions remain clear. The receptor binding shelf, its air-jump
teaching shelves, moving platforms, optional upper routes, and final HRE shelf remain open.
Lengths, checkpoints, collectibles, and progression mechanics were preserved.

The receptor objective and binding caption now describe binding and shape adjustment,
following the user's flexibility request.

## Verification

- Strict TypeScript check, ESLint on owned sources, and Prettier passed.
- All nine existing simulation tests passed.
- A temporary controls-only campaign probe reached all six stages and the ending in
  288.31 simulated seconds. It read state to select ordinary input frames and never mutated
  player, milestone, checkpoint, or phase state. One cytoplasm death recovered through the
  authored checkpoint. This is a simulation reachability check, not browser or human
  playability acceptance.
- The first probe exposed an enzyme landing collision after an unconditional downhill
  air jump. Restricting nucleus enzymes to uphill arrivals corrected the placement;
  the complete probe then passed.

## Walkthrough integration

Jump over `-debris` platforms and enzyme hazards when approaching them on the same floor.
Use a single ordinary jump for small hurdles and the existing air jump for long shelf
transfers. Anchor nucleus shelf matching with `shelf-\d+$`, because debris IDs include the
parent shelf ID. The membrane additions are a protein at x=2830 and enzyme at x=2590.

Built-artifact browser acceptance remains with the walkthrough owner. These changes do not
publish remotely, and simulation time does not establish the human 8-12 minute target.
