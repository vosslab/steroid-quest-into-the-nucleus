# Campaign quality review

Disposition: movement geometry, checkpoint placement, and ordered biological progression
pass this static review. One visible environment issue needs correction; one binding-art
alignment issue needs a rendered check. The manager owns the active controls-only walkthrough.

## Evidence scope

Reviewed `src/levels.ts`, all three `src/levels/*.ts` modules, `src/renderer.ts`,
`src/drawing.ts`, `src/physics.ts`, `src/simulation.ts`, and
[campaign_spec.md](campaign_spec.md). Inspected the built-browser captures
`test-results/campaign/cytoplasm.png` and `test-results/campaign/bilayer-crossing.png`.
Those captures precede the latest fused-ring and moving-body drawing corrections.
This review does not claim a human playthrough, final browser acceptance, or timing acceptance.

Ran a temporary Node/tsx data invariant check against the current campaign: all 216 entity
IDs are globally unique, and all 29 authored checkpoint spawns are supported by stationary
platforms and clear of hazards. The dynamic receptor-binding checkpoint is outside that
authored-spawn check. Existing route probes establish mandatory shelf feasibility as scoped
in the specification report; this review does not relabel local launch probes as a campaign run.

## Findings

1. **Medium: cytoplasm organelles sit above the main view.** At stage entry, player y750
   produces camera y442 (`src/renderer.ts:29`). Nonhazard mitochondria occupy y210-305
   (`src/levels/cell.ts:174-181`), and background vesicles occupy y220-365
   (`src/levels/cell.ts:156`). The built entry capture consequently shows empty particle
   space, shelves, and filaments while its caption describes a crowded cytoplasm. Low
   routes continue to clip much of this biological context. Place existing background
   organelles relative to nearby shelf heights, and add a restrained entry silhouette if
   needed. Keep the platform tops and hazard boundaries clear. This is a placement issue;
   arbitrary increased saturation or decoration counts are unnecessary.
2. **Rendered follow-up: binding and pocket centers differ.** The receptor decoration at
   y557 with height92 centers its pocket near y601.4 (`src/levels/nucleus.ts:142`,
   `src/drawing.ts:160`). A grounded steroid on the y650 shelf centers at y635.
   The binding trigger y621-650 (`src/levels/nucleus.ts:122-127`) therefore activates while
   rolling below the cavity. The cavity contour is complementary, but the actual contact
   should visually read as fitting the pocket. Inspect the incoming and binding captures;
   align the pocket with grounded player artwork if the offset remains visible. This is
   not a progression or checkpoint blocker.

## Accepted details

- Mandatory routes have broad supported rests and forgiving short transfers. Air-jump
  dependent high shelves follow binding; receptor and HRE gates prevent skipping milestones.
- Optional upper ledges and moving-vesicle routes provide plausible collectible access.
  Collectibles never gate progression; secrets use the same available jump envelope.
- Bilayer artwork is continuous and permeable. The envelope's wall colliders leave an
  always-open passage, with supported approach and a checkpoint on each side.
- Bound rendering retains the red steroid, and the complex and HRE share a shape cue.
  Moving molecular bodies derive positions from the same platform rectangle as collisions.
- Transcription keeps the complex bound while assembling machinery at the nearby promoter,
  then draws polymerase movement and emerging RNA. Generic-pathway wording and arcade
  abstraction captions avoid universal receptor-location or pore-requirement claims.

The known pacing follow-up remains owned by the manager. No duplicate duration finding is
added here. Final rendered captures and controls-only completion remain separate acceptance
evidence from the static checks above.
