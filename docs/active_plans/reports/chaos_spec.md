# Cellular discovery specification review

## Source verdict

PASS for the frozen source contracts, authored six-stage moment coverage, and controls-only
reachability evidence. No blocking source finding remains. Built-browser route, presentation,
and reduced-motion gameplay acceptance are pending with the integration owner. These checks do
not establish human enjoyment or first-play difficulty.

The review reads product source without changing it. The source snapshot includes the final
cell-stage spring routes and widened receptor lift, rather than the earlier interim profiles.

## Reusable design contract

- [src/types/sections.ts](../../../src/types/sections.ts) defines local tunnel, terrace, and
  bounce-chamber specifications. Section data retains captions, checkpoints, hazards, optional
  rewards, decoration, currents, and launch choices.
- [src/levels/section_specs.ts](../../../src/levels/section_specs.ts) deterministically lowers
  those specifications into the existing level arrays, offsets local coordinates, and assigns
  stage/section-prefixed IDs. It does not create a competing progression or physics model.
- [LEVEL_DESIGN.md](../../LEVEL_DESIGN.md) gives an executable minimal example, short authoring
  recipe, movement rhythm, varied-space knobs, six-stage target map, biological limits, and
  controls-based acceptance. It explicitly distinguishes artwork from physical interactions
  and composition targets from implemented claims.
- The compiler validates body clearance, approach/recovery spacing, finite geometry, and
  stationary checkpoint support outside solids, nearby hazards, and currents. It leaves
  section joins and traversal to play evidence, as the documentation states.

The reported level-two lower baffle is corrected at its owner: all authored lower baffles
are 65 units or less, and compilation rejects the former 130-unit obstacle. The source test
also traverses the complete unbound cytoplasm route, including the spring needed to clear its
135-unit organelle wall. The tall obstacle remains intentional where an automatic launch
supplies the required movement.

## Six signature moments

Every stage has an authored physical or molecular payoff in the final source.

| Stage | Implemented moment | Controls-only evidence |
| --- | --- | --- |
| Membrane | Directional spring throws the steroid onto the upper loft before the lipid strip | Lands on `membrane-spring-secret`, then `membrane-loft-return`, then the main floor |
| Cytoplasm | Tight organelle passages open into a vesicle gallery, spring chamber, and tall filament climb | Ordinary unbound controls traverse all six sections, ride a moving vesicle, and clear the spring wall |
| Envelope | Open pore crossing leads directly to a directional spring and drifting vesicle | Crosses the open passage and lands on `envelope-drifting-vesicle` |
| Receptor | Binding reveal unlocks air jump; gel eruption/updraft supplies a roof shortcut | Binds normally, launches, rides ferry/lift, crosses underpass roof, and returns to the exit |
| DNA | Moving nucleosome wave feeds an upper chromatin-fold route before HRE recognition | Rides all three moving bodies, uses high-step/roof transfer, crosses fold roof, and docks |
| Transcription | Three recruitment arrivals assemble machinery, then polymerase and one RNA strand appear | Three ordinary timing presses end the campaign while the complex remains stationary |

The campaign combines solid organelle baffles, enclosed tunnels, one-way terraces, moving
molecular bodies, automatic diagonal launches, bounded lifting currents, broad chambers,
vertical travel, optional upper routes, and descending recovery paths. It is materially more
varied than the preceding repeated platform profiles. Decorative debris and material textures
are accurately documented as presentation rather than extra collision mechanics.

## Motion and biology boundaries

[src/simulation.ts](../../../src/simulation.ts) remains authoritative. Overlapping currents
sum acceleration, steering can oppose them, leaving a current ends its force, and automatic
launches preserve useful momentum without release-cutting the bounce. Retry clears velocity;
pause freezes simulation time. Moving support carries the player through shared
[src/physics.ts](../../../src/physics.ts) geometry.

[src/renderer.ts](../../../src/renderer.ts) draws actual moving platform positions from
simulation time even under reduced motion. Molecular bodies use those same rectangles.
[src/kinetic_art.ts](../../../src/kinetic_art.ts) retains static directional current/spring
cues while disabling optional recoil, ripples, and binding waves. Source correctness here
still needs rendered gameplay confirmation for readability.

The membrane remains a permeable continuous bilayer. The envelope passage stays open; its
spring is beyond the pore. Receptor binding happens in the nucleus and gates the DNA stage.
The red steroid remains inside its bound complex. Ordered HRE/exit triggers gate transcription,
and recruitment stops player motion near the response element and promoter. RNA production
leads to the ending and Replay retains the mounted runtime while resetting session progress.

## Independent verification

- Re-ran `node --import tsx --test tests/test_level_sections.mjs`: four tests pass. They cover
  deterministic lowering/IDs, the reported baffle failure, recovery validation, and all three
  unbound cell routes with their required launch/ride moments and safe Retry.
- Inspected and re-ran the nucleus owner's temporary input-only upper-route probe against the
  frozen source. It reaches the ending in 53.175 simulated seconds with zero deaths, normal
  binding/HRE progression, and three successful recruitment inputs. Its recorded support IDs
  prove the receptor ferry/lift/roof and all three DNA wave bodies/upper roof returns.
- Independently inventoried the final campaign: 241 unique entity IDs and 40 authored
  checkpoints. Every checkpoint has stationary support, clear body space, no immediate hazard
  overlap, and no current overlap. This is static geometry evidence rather than browser proof.
- Existing focused interaction evidence is recorded in
  [cell_interactions.md](cell_interactions.md). Full integration gates remain the manager's
  separate acceptance lane.

## Pending built acceptance

Play the exact rebuilt artifact through all six stages, and record actual moving-platform
support and branch returns. A screenshot near a moving platform proves proximity only.
Play currents, launches, and a moving body with reduced motion active; a reduced-motion title
screen alone does not validate those gameplay cues. Verify death/checkpoint recovery,
pause/resume, binding/HRE order, all three recruitment actions, RNA, ending, and Replay.
Inspect the new reveals and landing visibility in rendered captures. Distinguish automated
completion from the subjective judgment that the journey feels chaotic, surprising, and fun.

## Reviewed source snapshot

SHA-256 values bind this source verdict to the inspected files. Later changes need focused
re-review of the affected contract or route.

```text
src/types/sections.ts 6996a6a2663034d1e698f9a080cad990e6d8d3872f2e8998c07971af88822119
src/levels/section_specs.ts 4b0771f0f4c42516f32c4a778f409678b3291b8f5520b0ae7f71b97faad4ebf9
src/levels/cell.ts 6107a9e211299bbfcc3750d151aa80914dff9ab783cec8c409959d3895003d89
src/levels/nucleus.ts f4eafb2174fef579062094b88f4e5ad4f570e3a41ff1f5674f99b2629d1e393f
src/levels/transcription.ts 5214032234113ad0af221bc7eb354b50eaaf3fbe989321bcd2922fc5cb0eafc7
src/simulation.ts 1290107c1ab5e6dd96b70e60929d942074455569d938de5062fa2d303bacaa37
src/renderer.ts 89bf34ef8e42c05e20d020685b8c1ed40dc9c04822912652faa4c412f06d3f57
src/kinetic_art.ts a66485a29e90010ed1f9c5eb237a7ec26c06547198bc7e56019d82b35b7e25a1
docs/LEVEL_DESIGN.md 145ad7ebdbd44f491ec499e518f3b242fc0018333d17a47bf5179e752c865122
```
