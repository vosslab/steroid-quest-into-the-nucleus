# Campaign specification review

Disposition: authored-stage batch passes static specification review after corrections.
Final campaign acceptance remains pending the built-browser walkthrough, rendered captures,
and an observed human playthrough supporting the 8-12 minute target.

## Requirements checked

- `src/levels.ts:6-10` assembles six ordered stages: membrane, cytoplasm, envelope,
  receptor, DNA, transcription. No collectible count or quiz gates progression.
- `src/levels/cell.ts:19-87` gives membrane obstacles, hazards, optional upper routes, and
  an uninterrupted vertical lipid strip that the player crosses directly. Lipid artwork
  has no collider; `src/drawing.ts:209-233` renders continuous head rows and inward tails.
- `src/levels/cell.ts:90-220` makes cytoplasm the longest stage (10,800 units), with twelve
  ascending, descending, and undulating ledge sections, organelle hazards, optional moving
  vesicle routes, and rest-shelf checkpoints. DNA is 9,250 units and receptor is 4,700.
- `src/levels/cell.ts:222-289` requires passage through an always-open envelope aperture.
  Vertical bilayer artwork aligns with the barrier above and below the pore. Neither input
  nor triggers require a key or opening action. Its caption explicitly describes this route.
- `src/levels/nucleus.ts:98-150` places receptor binding on a wide safe shelf. Simulation
  immediately preserves its supported position as a checkpoint and grants one air jump
  (`src/simulation.ts:197-207`). The next 140-unit rise exceeds a single jump's height.
- `src/drawing.ts:60-127` and `src/drawing.ts:146-177` share a fused-ring silhouette between
  the red steroid and complementary binding cavity; bound rendering retains the red steroid.
  The complex and HRE share the chevron motif, independently of their color.
- `src/levels/nucleus.ts:152-203` authors DNA platforms, optional secrets, moving shelves,
  and a gated HRE. HRE and exit overlap, with recognition ordered first. Simulation requires
  receptor binding for HRE and HRE binding for the transcription transition.
- `src/levels/transcription.ts:4-35` starts the complex docked at its element. Three jump
  actions recruit machinery, unsuccessful attempts repeat, and retry preserves docking.
  `src/renderer.ts:236-274` places promoter, machinery, moving polymerase, and emerging RNA
  in the same view. Completion follows three successes and the four-second RNA animation.
- Short contextual captions identify this generic pathway's nuclear receptor location and
  the platform/air-jump abstractions. Teaching text does not interrupt required controls.

## Corrected findings

1. The original rounded rectangular receptor cavity did not communicate complementary
   shape. Resolved by the shared fused-ring contour in `src/drawing.ts:165-177`.
2. Moving DNA platforms originally had stationary nucleosome artwork. Resolved by drawing
   molecular bodies from `platformRect` in `src/renderer.ts:55-86`; moving vesicles receive
   the same treatment. `src/levels/nucleus.ts:76-96` removes duplicate stationary artwork.
3. The old envelope debug controller repeatedly missed the final descent. This is a probe
   timing issue, not a blocked route: the authored guide specifies jumping 95 units before
   descending edges. The corrected controls-only probe completes with zero deaths.

## Reachability evidence

Reran the authors' temporary probes against current code:

- `npx tsx /private/tmp/cell-probe.ts`: membrane 11.31 simulated seconds / 6 jumps;
  cytoplasm 38.41 / 45; envelope 14.11 / 12. All complete through actual exit triggers
  with zero deaths, beginning at normal spawn without changing simulation state.
- `npx tsx /private/tmp/nucleus-route.ts`: all 28 adjacent mandatory shelf transfers pass.
  This probe initializes each launch position and binding state; it proves local geometry
  feasibility only, not campaign progression or playthrough duration.
- The nucleus author's separate controls-only report records receptor through HRE completion
  in 47.82 simulated seconds, seven collectibles, all checkpoints, and zero deaths. This is
  author-reported evidence, not a rerun by this reviewer.

These probes support platform reachability. They do not establish browser behavior, visual
legibility, enjoyable movement, or the requested duration. The optimized authored routes total
roughly two minutes before transcription, so the 8-12 minute target needs explicit measured
playability evidence and likely pacing work. Do not label that target achieved from route length
or speculative beginner deaths. The manager's full real-controls browser walkthrough remains
the required next acceptance step; its captures must include transformation and ending.
