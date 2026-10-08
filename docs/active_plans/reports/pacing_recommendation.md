# Campaign pacing recommendation

## Finding and recommendation

The current route is a good movement demonstration but is too short to support the planned
8-12 minute first playthrough. Keep the controller fast and forgiving. Expand authored challenges
in the cytoplasm, receptor, and DNA stages; retain the compact membrane, pore, and transcription
milestones. Treat 8-12 minutes as a first-play target that still needs human timing evidence.

This consult changes no game source. It applies the repository principles **Use the scientific
method**, **Fix the design, not the symptom**, and **Focus on important issues**.

## Measured geometry

`MAX_SPEED` is 280 world units/second. A full held jump reaches approximately 105 units above its
launch surface and remains airborne approximately 0.75 seconds on level ground. The route already
uses forgiving rises of 60-65 units before binding and 110-140 units after binding.

| Stage | Width | Approximate required horizontal travel | Current structure |
| --- | ---: | ---: | --- |
| Membrane | 3200 | 3000 | Continuous floor, five proteins, two hazards |
| Cytoplasm | 10800 | 10630 | Twelve sections with four shelves and a rest shelf each |
| Envelope | 4000 | 3830 | Six climbing shelves, open pore, four descending shelves |
| Receptor | 4700 | 4400 | Four pre-binding transitions, five post-binding transitions |
| DNA | 9250 | 8880 | Twenty shelves; three move vertically by only ten units |
| Transcription | 960 | 0 | Three short forgiving timing actions |

The approximate mandatory horizontal travel is 30,740 units, giving a 110-second travel floor.
Existing controls-only simulation reports total about 112 seconds before transcription. The
parent reports a complete optimized run around 115 seconds. The current game cannot plausibly
rely on a fourfold to sixfold novice slowdown when checkpoints and retries are generous.

Cytoplasm shelves alternate width 145/130 at fixed 165-unit spacing. Its twelve sections vary
height, but retain the same four-jump rhythm. DNA repeats a rise/rise/descent rhythm with widths
250-280 and gaps near 190 units. Its moving platforms barely affect the route. Tripling these
arrays changes duration much more than it changes play: it would magnify the existing repetition.

## Bounded implementation

Own the correction in [src/levels/cell.ts](../../../src/levels/cell.ts) and
[src/levels/nucleus.ts](../../../src/levels/nucleus.ts). Preserve shared contracts, runtime,
simulation constants, and stage count. An authored route table can store each shelf's x/y/width,
kind, and optional motion; retain the existing small helpers for IDs and checkpoints.

Target 70,000-85,000 units of mandatory traversed route, giving 4.2-5.1 minutes of horizontal
travel at maximum speed. Additional vertical launches and modest adjustments should place a
practiced clean run around 4.5-6 minutes. This is a content budget, not an acceptance claim.
Normal first play can then plausibly reach 8-12 minutes through learning, decisions, and retries.

| Stage | Suggested required travel | Authored sections |
| --- | ---: | --- |
| Membrane | 3000 | Preserve existing tutorial and continuous crossing |
| Cytoplasm | 28,000-33,000 | Six distinct districts, each about 4500-5500 units |
| Envelope | 3800 | Preserve compact climb, visible open pore, descent |
| Receptor | 12,000-15,000 | Three exploration districts, binding, two ability districts |
| DNA | 23,000-30,000 | Five distinct chromatin districts |
| Transcription | 0 | Preserve three actions and brief completion animation |

### Cytoplasm districts

Replace `shelfProfiles` with six named authored groups rather than repeating the same module.
Each district should contain 10-16 meaningful transitions and broad recovery platforms.

- Entry filaments: low ascending steps mixed with wide running shelves and a few short gaps.
- Organelle weave: alternate high and low passages around visible mitochondria; place hazards
  below the route, with safe broad landing shelves after each descent.
- Vesicle crossing: several moving platforms with 30-45 unit motion and broad stable launch
  and landing shelves. Platform arrival should offer frequent opportunities, never a long wait.
- Vertical filament garden: staircase climbs over 300-420 units, short lateral transfers,
  then descent. Required rises stay at 60-75 units. This gives camera variation already supported
  by the renderer; keep the next landing surface visible before launch.
- Spring district: two or three bounce surfaces with wide landing shelves; include a regular
  staircase route nearby so a spring teaches enjoyable movement without trapping novices.
- Nuclear approach: combine earlier ideas in short pairs, then finish with a quiet approach.

Avoid twelve consecutive copies of any motif. Change spacing, widths, and elevation as well as
decorations. Optional upper collectible routes can branch and rejoin within one screen; required
play duration must come from the main route. Put checkpoints on broad stable shelves every
1200-1800 units and before new mechanics, keeping typical death recovery below ten seconds.

### Receptor districts

Expand `receptorRoute` before binding into three recognizable nucleoplasm areas: broad low
terraces, a compact climb/descent, and a pocket approach. Give the receptor an unmistakable
silhouette and short safe final landing. Relocate the binding trigger and receptor art together.
Do not hide the receptor behind optional branches or ambiguous dead ends.

After binding, provide a safe air-jump teaching pair before two authored districts: tall
staircase arcs, then long but forgiving lateral transfers. Preserve the immediate binding
checkpoint. Keep initial required rises at 130-140 units and uncovered gaps below 210 units;
stronger challenges can combine these dimensions after the ability has been demonstrated.

### DNA districts

Replace the repeated `dnaRoute` cycle with five individually authored groups: short alternating
chromatin terraces; wide double-jump arcs; moving nucleosome transfers; vertical chromatin folds;
and a final recognition approach. Mix low single-jump transitions between larger air-jump
transitions so the new ability has a rhythm instead of becoming an identical action at every gap.

Moving-platform motion may rise from ten to 25-40 units, but keep reachable windows frequent and
launch/landing shelves broad. Place checkpoints on stationary shelves before moving sections and
after vertical ascents. Keep HRE and exit trigger rectangles coincident and ordered at the end;
relocate their coordinates with the final shelf. Keep the matching motif visible on approach.

## Verification and tradeoff

Expand and measure one district per principal stage first. Run the real controller through each
new required transition, then rebuild and traverse through actual keyboard controls. A route
probe must choose jumps from visible geometry; coordinate teleporting is useful only for isolated
feasibility checks and cannot prove campaign completion. Retain existing checkpoint and ordered
milestone tests. Capture moving-platform, vertical-route, and final HRE scenes in the built game.

A clean run below four minutes indicates insufficient main-route content. A clean run above six
minutes, frequent unavoidable waits, or repeated identical ten-jump sequences indicates excess
padding. Record optimized timing separately from first-play timing. A first-play observation
with normal deaths is required to assert the 8-12 minute target; automation cannot establish fun.

The cost is substantially more authored geometry. This is preferable to slowing the player,
increasing death penalties, requiring collectibles, adding quizzes, or lengthening transcription.
If the content budget cannot be delivered and verified now, describe the release honestly as a
short first playable game with the planned duration still unmet. Keep the original duration
requirement visible rather than silently redefining it around the current two-minute route.
