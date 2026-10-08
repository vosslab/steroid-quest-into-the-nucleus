# Cell routes

Owner: cell content agent. Edited only `src/levels/cell.ts` and this report.

## Route guide

- Membrane: continuous floor y600. Protein obstacles at x430, 800, 1260, 1720,
  and 2050; jump before their leading face. Enzymes x660 and x1580 are short jump
  hazards. Checkpoints x1060 and2300. Optional upper ledges x990/1160 and bounce
  secret x1860/1950. Cross the entire lipid strip x2460-2650 directly on the floor;
  it has no collider, door, opening, or required input. Exit x3080.
- Cytoplasm: initial shelf x0-380 y780. Twelve short climbing/descent rooms begin
  x420, then every850 units. Within a room, the next ledge starts165 units after
  the previous ledge. Widths130/145 leave20-35 unit gaps, rises at most60.
  Jump near the right edge (approximately60 units before it). Broad rest shelves
  and checkpoints occur at x1070,1920,2770,...,10420, immediately after each room.
  Alternate rooms climb, descend, and undulate; the highest route reaches y430.
  Vesicles are optional moving routes above sections1,4,7,10; organelle hazards
  remain below the required route in sections2,5,8,11. Exit x10700 on the final shelf.
- Envelope: climb six ledges starting x450,625,800,975,1150,1325; rises60.
  Arrive at the y480 shelf x1510. Checkpoint x1540. Roll through the permanently
  open130-unit passage at x2080-2180, y350-480; the two vertical bilayers above and
  below it align with the wall colliders. Checkpoint x2270 immediately afterward.
  Descend ledges x2470,2645,2820,2995 (y540,600,660,720), jumping from approximately
  95 units before each edge to maintain horizontal progress. Final shelf x3190,
  checkpoint3250, optional secret3380, short enzyme3620. Exit3890.

## Feasibility evidence

Temporary TypeScript probe used the shipped `createSimulation`, fixed1/120 steps,
right movement, and full held jumps. It started normally, never changed coordinates,
progress, velocity, or checkpoints, and advanced via actual exit triggers. Each
stage included a successor only so the probe could observe its exit. All three
completed with zero deaths: membrane11.31s/6 jumps; cytoplasm38.41s/45 jumps;
envelope14.11s/12 jumps. This is a fastest automated route, not a human playability
or 8-12 minute acceptance claim. Human exploration and recovery still need measurement.

The first probe exposed poor recovery spacing between the1260 protein and the second
membrane enzyme; moved that enzyme from1500 to1580, then the complete probe passed.
The probe also confirmed that a single jump timing policy is unsuitable for both
ascending cyto routes and descending envelope ledges; use the route guide above.

`npx tsc --noEmit -p tsconfig.json`, `npx eslint src/levels/cell.ts`, and
`npx prettier --write src/levels/cell.ts` passed.
