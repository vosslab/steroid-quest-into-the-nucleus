# Cellular discovery quality review

## Source verdict

PASS for the frozen source changes. No blocking correctness, ownership, cleanup, or recovery
finding remains in this review. Built-browser campaign, visual readability, reduced-motion
gameplay, and frame-performance acceptance remain the integration owner's separate lane.
This verdict does not establish first-play difficulty or human enjoyment.

This fresh review follows [chaos_spec.md](chaos_spec.md) and inspects the changed implementation
in its surrounding simulation, renderer, physics, audio, runtime, and level context. It does
not repeat the original baseline review and changes no product source.

## Movement and collisions

- [src/simulation.ts](../../../src/simulation.ts) owns both new interactions. Currents sum their
  acceleration before one speed cap; their force applies only during rectangle overlap.
  Input remains able to oppose the authored fields. Leaving a field retains ordinary momentum.
- Automatic top-contact launches set the authored velocity, clear manual jump-cut eligibility,
  and restore the available bound air jump. Steering with a horizontal boost uses air drag;
  opposite steering retains normal stronger acceleration. Unbound routes remain playable.
- [src/physics.ts](../../../src/physics.ts) supplies moving rectangles to simulation and
  rendering. Required platform motion continues under reduced motion. New molecular artwork
  follows the same moving rectangle and introduces no competing collision surface.
- Section floors, roofs, lower folds, spring landings, and exit joins retain the existing
  rectangle controller. The compiler rejects the reported tall unbound lower baffle and unsafe
  checkpoint placement. Source traversal evidence covers required cell routes; the specification
  review records the nucleus upper-route input probe and biological progression.
- An independent recovery probe clones each level with each authored checkpoint as its spawn.
  At level-time phases 0, 0.8, 1.6, and 2.4 seconds, all 40 checkpoints remain grounded at their
  exact spawn after one second of idle fixed-step motion: 160 runs, zero deaths, and no solid
  penetration. This also samples moving bodies near recovery geometry. It is source evidence.

## Lifecycle and rendering

- [src/runtime.ts](../../../src/runtime.ts) keeps the existing single frame loop and mounted
  runtime. Simulation events fan out to sound, renderer, and UI. No interaction adds a listener,
  timer, observer, Solid store, or second simulation loop. Existing disposal removes owned input,
  resize, motion-preference, and audio resources.
- [src/renderer.ts](../../../src/renderer.ts) bounds pending presentation events to 16. Launch
  effects are keyed by authored platform IDs and expire after 0.8 simulated seconds. Successful
  recruitment effects use the three progression counts. Stage changes clear both pending and
  active effects; Replay clears them through its stage announcement and elapsed-time reset.
  Disposal empties the collections and ignores later draw/event calls. Pause freezes effect age.
- [src/kinetic_art.ts](../../../src/kinetic_art.ts) confines spring recoil inside the platform
  body and preserves its fixed bright collision rim. Reduced motion retains current arrows,
  launch direction, and settled recruitment/RNA while omitting decorative recoil and waves.
  Artwork never changes velocity, checkpoints, or progression.
- A temporary mock-canvas probe draws 92 views across all six stages and their checkpoint
  positions, with both motion settings and queued launch/recruitment events. All numerical draw
  coordinates are finite, every frame balances canvas save/restore calls, and disposal causes
  no further canvas work. A mock context proves these contracts, not rendered appearance or FPS.
- [src/audio.ts](../../../src/audio.ts) consumes the bounded authoritative bounce event through
  the existing synthesized-voice path. The new cue adds no buffers, timers, or audio contexts.
  It shares the existing voice ceiling, node release, pause/mute handling, and disposal.

## Authoring and scope

[src/types/sections.ts](../../../src/types/sections.ts) and
[src/levels/section_specs.ts](../../../src/levels/section_specs.ts) provide a small deterministic
lowering layer into existing level arrays. They preserve level and simulation authority rather
than adding procedural runtime difficulty or another progression system. The compiler runs when
the authored campaign is initialized. Static safety checks are explicitly limited; they do not
claim to solve joins, motion timing, or all routes.

[LEVEL_DESIGN.md](../../LEVEL_DESIGN.md) describes authoring choices and acceptance without
duplicating campaign geometry. Material textures and cellular debris remain presentation;
currents, launches, moving platforms, and branch surfaces are explicit authored mechanics.
The biological gates still require receptor binding before DNA progression and HRE recognition
before transcription. Recruitment holds the complex in place while machinery and one RNA strand
appear. The new CSS changes are bounded wrapping and overlay overflow fixes with no runtime
ownership changes.

Rendering remains bounded by authored content and horizontal platform/decoration culling. Some
long material surfaces and full-width hazard strips still draw detail outside the visible area.
This source review finds no growth or retained-work leak, but makes no frame-time claim; observe
the long cytoplasm and chromatin views in the built artifact before making a performance claim.

## Independent checks

- `node --import tsx --test tests/test_interactions.mjs tests/test_level_sections.mjs`: 9 pass.
  These exercise launch momentum, opposing controls, current exit/order/caps, pause/retry,
  compiler validation, complete unbound cell traversal, required rides/launches, branch returns,
  and safe recovery.
- Temporary checkpoint phase probe: 160 runs across 40 checkpoints, all pass.
- Temporary mock-canvas probe: 92 draws, finite coordinates, balanced state stack, disposed no-op.
- Full repository and browser gates remain the integration owner's acceptance lane; none of the
  focused results above substitutes for those gates.

## Reviewed source snapshot

SHA-256 values bind this verdict to the inspected source. Later product changes require focused
re-review of the affected contract.

```text
src/types/sections.ts 6996a6a2663034d1e698f9a080cad990e6d8d3872f2e8998c07971af88822119
src/levels/section_specs.ts 4b0771f0f4c42516f32c4a778f409678b3291b8f5520b0ae7f71b97faad4ebf9
src/levels/cell.ts 6107a9e211299bbfcc3750d151aa80914dff9ab783cec8c409959d3895003d89
src/levels/nucleus.ts f4eafb2174fef579062094b88f4e5ad4f570e3a41ff1f5674f99b2629d1e393f
src/levels/transcription.ts 5214032234113ad0af221bc7eb354b50eaaf3fbe989321bcd2922fc5cb0eafc7
src/simulation.ts 1290107c1ab5e6dd96b70e60929d942074455569d938de5062fa2d303bacaa37
src/renderer.ts 89bf34ef8e42c05e20d020685b8c1ed40dc9c04822912652faa4c412f06d3f57
src/kinetic_art.ts a66485a29e90010ed1f9c5eb237a7ec26c06547198bc7e56019d82b35b7e25a1
src/runtime.ts d823464c3320402b5a0e0f91002a8f6abd1187d2aff95d40d4535be63ac11d13
src/audio.ts f4d08f3b7d105a649572dd0c148c30782cc3e9153c4923113edf6885ad23df7e
src/style.css 30e6fbe43113cf0bc59308880f34229bcf1e12ffdd62f3c958de96ce35e06dd8
docs/LEVEL_DESIGN.md 145ad7ebdbd44f491ec499e518f3b242fc0018333d17a47bf5179e752c865122
```
