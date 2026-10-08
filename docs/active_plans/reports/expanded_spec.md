# Expanded campaign specification review

Disposition: the expanded campaign and finish corrections pass this scoped static specification
review. No new material specification blocker was found. Built-artifact campaign acceptance,
rendered acceptance, and the novice 8-12 minute duration target remain separate evidence lanes.

## Scope and evidence

Fresh review covered `src/levels.ts`, the three level modules, `src/simulation.ts`,
`src/renderer.ts`, `src/drawing.ts`, `src/app.tsx`, `src/style.css`, focused simulation and
browser tests, human guidance and design decisions, and the preceding campaign/finish reports.
The expanded lane reports were read as author-reported evidence, not independently reproduced
playthroughs. This reviewer changed only this report and ran a temporary data invariant check.
Final build, repository checks, browser tests, and controls-only campaign walkthrough are owned
by integration acceptance.

The invariant check imported the current campaign and physics overlap predicate through `tsx`.
All **381 entity IDs are unique**. All **64 authored checkpoint spawns** are fully supported by
stationary platforms, within level bounds, and clear of hazards. This verifies authored spawn
geometry; it does not prove checkpoint activation through every actual route.

## Expanded contract coverage

- The campaign still has six ordered stages. Membrane remains 3,200 units and the envelope
  remains 4,000, retaining the compact direct bilayer crossing and always-open pore passage.
- Cytoplasm is the longest stage at 32,565 units. Its six authored districts contain broad
  running shelves, short rises, a vertical garden, optional vesicle ferries and spring branches,
  organelle illustrations, and 25 supported checkpoints. Mandatory progress uses the ordinary
  stationary route; optional branches and collectibles do not gate progress.
- Receptor spans 14,000 units and DNA 26,050. The pre-binding route uses short rises; the later
  staircase and chromatin folds exercise the unlocked air jump. DNA includes four vertically
  moving nucleosome shelves with stationary launch/recovery shelves and checkpoints.
- Receptor binding grants one extra air jump and stores an immediate checkpoint. Its trigger
  is above a broad stationary y650 shelf; the activation position is supported or over safe
  support. Later authored checkpoints preserve binding and discoveries on restoration.
- Receptor binding precedes the DNA transition, and HRE recognition precedes the transcription
  transition. The coincident DNA HRE/exit rectangles are ordered correctly. Docked recruitment
  freezes player motion, accepts three forgiving timing actions, then animates polymerase/RNA
  before ending. Retry preserves the complex's docked state and recruitment progress.

## Earlier findings corrected in source

1. Cytoplasm background organelles now sit 225 units above their nearby shelf floor, including
   the entry shelf. At entry camera y442, its first organelle spans world y555-670 and is inside
   the visible region. The old placement above the camera is removed.
2. Receptor art now centers its pocket near x7155/y634.4; the grounded steroid center is y635.
   The x7143/y623, 24-by-24 trigger overlaps that pocket. The former vertical mismatch is fixed.
3. Moving DNA shelves receive nucleosome bodies from the same `platformRect` as collision.
   The level module excludes stationary decorations for moving shelves, preventing duplicates.
4. Lipid and pore artwork is drawn after opaque platform supports. The co-located HRE exit
   suppresses the redundant CONTINUE label. These corrections preserve collision geometry.
5. Recruitment guidance sits at the top; the timing panel is drawn at the bottom after world
   rendering. Ordinary milestone captions are suppressed while recruiting. Once count reaches
   three, both the timing marker and jump instruction stop, and the UI describes transcription.
6. A focused authored-checkpoint test now covers contact activation, hazard recovery, manual
   retry, and preservation of discoveries. Nine Node cases are present. Browser smoke now
   instruments pending animation frames and asserts one scheduled frame across UI changes,
   in addition to retaining canvas identity. Test passes require the final integration run.
7. Human guidance now records the direct request to implement and verify the approved plan;
   imported design details are represented in design decisions rather than attributed as a
   human quote. The previous combined-provenance entry is gone.

## Truthful acceptance limits

The authors report optimized controls-only timings of 116.20 simulated seconds for cytoplasm
and 140.942 for receptor plus DNA, each with zero deaths. With the short unchanged membrane,
envelope, transitions, and transcription, the practiced route is approximately 4.8 minutes.
This supports the expanded pacing relative to the earlier roughly two-minute campaign; it
does **not** demonstrate the requested novice 8-12 minute experience or enjoyable movement.
Keep that target explicitly unverified until observed first-play evidence exists.

Static artwork placement supports the visual corrections, but final captures must verify the
bilayer, pore, cytoplasm entry/vertical routes, receptor contact/transformation, moving
nucleosomes, response element, recruitment, and ending. The built-artifact walkthrough must
still verify changed collectible and ability HUD values, deaths/checkpoint recovery, complete
ordered progression, and Replay through real controls without mutating simulation state.
