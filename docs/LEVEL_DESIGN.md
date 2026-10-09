# Active cell level design

The governing principle is simple: keep players wondering what strange thing the cell will
throw at them next. Replace predictable stretches with surprising interactions. Keep the
six-stage biological journey, optional exploration, calm checkpoints, and quick recovery.

## Three-key movement

Left and Right apply horizontal force. Opposing input brakes and reverses momentum. A Space
press adds one strong upward impulse; held Space adds weaker continuous upward thrust. Releasing
all keys lets the player coast under fluid drag. Auto-repeat does not add tap impulses.

There is no global gravity, downward key, floor-supported movement, or extra jump after binding.
[src/constants.ts](../src/constants.ts) owns tunable acceleration, thrust, drag, and speed limits.
All forces run in the existing fixed-step simulation. Speed is bounded before collision movement;
bounded substeps prevent fast players from skipping thin obstacles.

## Shared simulation primitives

[src/types/level.ts](../src/types/level.ts) owns the authoring contracts:

| Primitive | Meaning | Authoring responsibility |
| --- | --- | --- |
| Obstacle | Circle, capsule, or rounded rectangle; rebound or temporary sticky response | Keep every contact side readable and leave escape clearance |
| Flow zone | Rectangular directional acceleration, optional vortex and local drag | Show direction before contact and provide a visible way out |
| Transport | Vesicle, motor cargo, or channel following a curved path | Clear path/release space; temporary capture must end automatically |
| Encounter | Ordered contact or entry steps | Advance persistent phases that change fields, passages, or transport availability |
| Phase condition | Inclusive minimum/maximum encounter phase | Finite backward sweeps end when the changed return route becomes available |
| Checkpoint | Explicit route order and calm spawn region | Keep spawn clear of forces, moving geometry, hazards, and immediate capture |
| Hazard | Marked destructive acid | Place principally on optional lysosome branches |

The player collides as a circle; decorative detail never changes that geometry. Obstacle response
has no privileged top surface. Boundary contact is safe. Transport escape uses either a Space
pulse or held thrust; release must resolve to clear space. Captures are arcade interpretations,
not measured molecular transport mechanisms.

## Reusable chamber recipes

[src/types/sections.ts](../src/types/sections.ts) defines chamber specifications.
[src/levels/surprise_patterns.ts](../src/levels/surprise_patterns.ts) provides current-loop,
transport-relay, capture-chamber, and channel-transfer recipes.
[src/levels/section_specs.ts](../src/levels/section_specs.ts) compiles them into stage-prefixed
shared primitives. Levels compose data, not individual runtime scripts.

Each chamber declares bounds, an entrance and exit, an interaction sequence, a downward recovery
field, and any optional branch. Add local obstacles, fields, transports, fragments, and scenery
to shape the encounter. Contact steps reference actual authored primitives; entry steps use
regions. IDs and phase conditions must agree with the compiled content.

A recipe's acceptance is behavioral: the player can enter, experience the interaction, leave,
and recover from a mistake. Compiler validation alone does not prove reachability or enjoyment.

## Recover without a downward key

A bottom-only current cannot rescue a player drifting in an upper pocket. Every chamber must
provide a visible descending or returning current reachable by horizontal steering from its
highest accessible region. Check the complete motion envelope of moving organelles and routes.

- Reach the highest pocket with held Space, then escape using only Left/Right and coasting.
- Miss a pore or channel and verify that the return route creates another approach.
- Break each temporary attachment with a pulse, held thrust, and automatic release.
- Retry during a route change and confirm that completed changes persist.
- Travel backward across old checkpoints and verify that route order does not regress.
- Follow an optional branch back before the next required biological milestone.

Retry clears velocity, temporary attachment, and transient effects. It preserves fragments,
receptor/HRE milestones, and completed encounter phases. Replay resets the campaign.

## Campaign signatures

| Stage | Sequence | Recovery and biological boundary |
| --- | --- | --- |
| Membrane | Early bilayer crossing; rebound into circulation; outlet activates backward sweep; arriving vesicle provides new forward route | Downward return is visible; changed route persists |
| Cytoplasm | Motor-carried cargo; giant mitochondrion rebound chamber; fast curved ER channel | Optional cargo shortcut returns before the nucleus |
| Nuclear envelope | Circulation carries the player past an always-open pore | Missing it rebounds into another approach, without death |
| Receptor | Sticky interruptions; matching receptor; onward release of the visible red steroid complex | Binding saves progress and enables DNA recognition |
| DNA / HRE | Moving nucleosomes; passage entry rearranges flow; shorter HRE approach | Calm capture region supports reliable docking |
| Transcription | Docked complex; three forgiving Space actions; assembled machinery and moving polymerase | Holding Space never repeats attempts; one connected RNA grows |

## Readability and pacing

Show force direction with arrows and particles, collision edges with surface silhouettes, and
capture/release with distinct contact effects and sound. Reduced motion simplifies decoration
while retaining force direction and required moving geometry. The camera follows both axes and
backward travel with modest velocity look-ahead.

Target the first environmental interaction within roughly three seconds of forward play. Aim
for a meaningful change of action every five to eight seconds during ordinary traversal,
excluding rests and exploration. These are playtest targets, not permanent assertions about
specific coordinates or tuning constants. Biological captions remain optional.

## Built-artifact acceptance

Build and serve with `./run_web_server.sh`. Use actual keyboard controls to walk all stages,
including upper-pocket escapes, backward sweeps, sticky contacts, transport rides, an optional
shortcut return, and a marked-hazard death with retained progress. Record signature captures
and observed traversal times in [fluid_walkthrough.md](active_plans/reports/fluid_walkthrough.md).

Check default-on audio after Start, pre-start mute, pause/focus-loss silence, Replay preference
retention, stable canvas identity, one animation loop, and narrow-screen menus. Keep practiced
route time and automated completion separate from human first-play enjoyment. An understandable
mistake should expose a visible next opportunity, rather than leave the player stranded.

```sh
./check_codebase.sh
./build_github_pages.sh
./run_playwright_tests.sh --build
source source_me.sh && python3 -m pytest tests/
```

A validated local build and preview do not publish remotely.
