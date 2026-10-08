# Level design spec sheet

Author a sequence of surprising movement situations. Give each section one clear action, one
recognizable twist, and a safe place to recover. The player should wonder what comes next while
understanding where to move now.

## Source of truth

Authored TypeScript in [src/levels/](../src/levels/) owns geometry, routes, and objectives.
Shared contracts live in [src/types/level.ts](../src/types/level.ts). This sheet explains how to
choose and combine situations; it is not a second editable copy of the campaign geometry.
Simulation and biology boundaries follow [SOLID_MODEL.md](SOLID_MODEL.md).

## Author typed sections

[src/types/sections.ts](../src/types/sections.ts) defines `SectionSpec`.
[src/levels/section_specs.ts](../src/levels/section_specs.ts) provides
`compileSections(stage, sections)`: it joins local section coordinates horizontally and produces
the existing level arrays plus total width. IDs gain stage and section prefixes. Keep each
section ID unique within its stage; use lowercase names with underscores.

Minimal tunnel example inside a level source file:

```typescript
import type { SectionSpec } from "../types/sections";
import { compileSections } from "./section_specs";

const sections: readonly SectionSpec[] = [
  {
    id: "gel_squeeze",
    kind: "tunnel",
    caption: "Roll through the crowded gel.",
    width: 1800,
    floor: 780,
    ceiling: 540,
    material: "reticulum",
    checkpoints: [{ x: 40, floor: 780 }],
    baffles: [
      { x: 300, side: "upper", width: 140, depth: 160, material: "reticulum" },
      { x: 650, side: "lower", width: 110, depth: 60, material: "mitochondrion" },
    ],
  },
];
const geometry = compileSections("cytoplasm", sections);
```

Use `geometry` for the level's authored arrays and width; the level still owns its spawn, name,
palette, biological objective, and exit trigger. Coordinates are world units with positive y
downward. Adjacent sections must also agree on reachable entry and exit elevations.

| Section kind | Required shape fields | Optional variation |
| --- | --- | --- |
| `tunnel` | `width`, `floor`, `ceiling`, `material`, `baffles` | Upper and lower masses with different materials |
| `terraces` | `route` entries: `width`, `floor`, `gap` | `material`; moving `vesicles` with x, floor, width, axis, distance, period |
| `bounce_chamber` | `width`, `floor`, `springX`, `springWidth`, `landingX`, `landingWidth`, `landingRise`, `material` | `launch` velocity; sparks and hazards around recovery |

Every section has `id`, `caption`, and `checkpoints`; optional `hazards`, `collectibles`, and
`decorations`, and `flowZones` use local coordinates. Tunnel baffles descend from the ceiling or rise from the
floor. The compiler checks spacing, clearance, platform bounds, and safe stationary checkpoint
support. Bounce chambers include a high solid landing and descending exit. These guardrails do
not prove traversal; test joins and all required moves in the built game.

## Compile semantic encounters

Five semantic recipes in [src/types/sections.ts](../src/types/sections.ts) use the same
`compileSections` entry point. [src/levels/surprise_patterns.ts](../src/levels/surprise_patterns.ts)
owns their generated geometry. Choose an encounter and its controls before placing individual
rectangles; the result remains ordinary platforms, fields, decorations, and collectibles.

All five require `id`, `kind`, `caption`, `checkpoints`, `width`, and `floor`. They accept the
same optional local content arrays as other sections. `approachWidth` and `recoveryWidth` default
to 220 and must each be at least 180. `secret` is `"none"` or `"high_cache"`; omission adds no
cache. A cache reserves 600 units after the encounter and supplies five static steps, one reward,
and a descent to the catch floor. Empty `checkpoints` generates a checkpoint at x=40 on the floor.

| Recipe | Required controls | Generated action and recovery |
| --- | --- | --- |
| `ribosome_bridge` | `bridgeRise`, `span`, `count`, `crumble: { delay, reformAfter }` | Static entry steps, contact-armed upper tiles, stable end shelf, catch floor |
| `organelle_pinball` | `bumperCount`, `launch: { x, y }`, `landingRise` | Floor-level directional springs, upper landing ledges, giant decorative mitochondrion |
| `vesicle_express` | `ceiling`, `acceleration: { x, y }`; optional `drag` | ER roof/folds and rightward field, clear stationary ends |
| `orbit_chamber` | `orbitRise`, `radiusX`, `radiusY`, `period`, `platformCount` | Phased elliptical ledges and static access steps above a catch floor |
| `low_gravity_shaft` | `rise`, `gravityScale`, `ledgeCount` | Ascending static ledges inside a marked low-gravity region, catch floor below |

A compact optional bridge recipe needs only encounter controls and a floor:

```typescript
const bridge: SectionSpec = {
  id: "ribosome_detour", kind: "ribosome_bridge", width: 1800, floor: 780,
  bridgeRise: 120, span: 720, count: 6,
  crumble: { delay: 0.8, reformAfter: 3 },
  caption: "Try the upper shortcut; gel catches a missed hop.",
  checkpoints: [], secret: "none",
};
const geometry = compileSections("cytoplasm", [bridge]);
```

The lower floor supplies the ordinary route; the upper lure invites voluntary timing pressure.
This example compiles geometry, not evidence of a successfully played route.

### Recipe validation limits

All numeric controls must be finite. Floors are 400-2000; encounter extent, after subtracting
approach, recovery, and any cache reserve, is 600-8000. Counts are integers. Bounds are inclusive:

- Bridge: rise 60-180, count 1-20, span 180 through extent minus 320, stride `span / count`
  75-180; collapse delay 0.25-4 seconds and reform delay 0.5-20 seconds.
- Pinball: bumper count 1-8; launch x 120-380 and y -800 through -620; landing rise 60-120;
  bumper spacing `extent / bumperCount` 240-1200.
- Express: ceiling 60 through floor minus 240; acceleration x 350-1000 and y -150 through 150;
  drag 0-1.5, default 0.
- Orbit: platform count 1-8; radii x 15-80 and y 15-65; rise radiusY plus 55 through 180;
  period 3-12 seconds; spacing `extent / platformCount` at least `160 + 2 * radiusX` and at most 1200.
- Shaft: ledge count 1-8; gravity scale 0.2-0.65; rise 120 through the smaller of floor minus 100
  and `ledgeCount * 70`.

The compiler additionally checks full moving-platform envelopes, generated field and content
bounds, and safe checkpoint bodies. Checkpoints require clear stationary support that neither
bounces nor crumbles; clearance includes entire motion envelopes. Hazard checks use a margin
around the spawn, and both generated and authored fields must exclude the body. These guards
reject unsafe compiled inputs; geometry appended by a level requires its own final recovery
audit. Built keyboard play still verifies joins and traversal.

## Fill out one recipe

Write this short recipe before placing rectangles. These are authoring questions, not executable
fields. Keep the finished geometry and any useful recipe comments together in the level source.

```text
Section: name / stage / approximate extent
Movement verb: weave, rise, drop, ride, launch, squeeze, or choose
Entry -> exit: visible landmarks, approach direction, and landing surface
Required route: moves and abilities needed; continuous path to the exit
Twist: one change to the preceding section's shape, timing, or direction
Recovery: safe landing, checkpoint spawn, and where a missed jump goes
Optional branch: secret or shortcut, reward, and return to the required route
Escalation: taught demands combined here; unfamiliar demand introduced alone
Theme: cellular material and landmark silhouette
Signature moment: memorable reveal or movement payoff
Obstacles: collision bounds, hazards, moving surfaces, and available clearance
```

Example recipe:

```text
Section: vesicle gallery / cytoplasm
Movement verb: ride, then choose
Entry -> exit: broad filament shelf -> open chamber -> broad recovery shelf
Required route: stationary lower shelves; ordinary jump only
Twist: a moving upper crossing offers a shorter route through the chamber
Recovery: falling from the ferry lands on the lower route; checkpoint before entry
Optional branch: upper spark; upper and lower routes rejoin before the next tunnel
Theme: gel walls frame a vesicle silhouette; clear edges mark collision surfaces
Signature moment: narrow approach opens into a large chamber with two visible routes
Obstacles: moving one-way ledge, clear lower landing, no hazard under the ferry
```

## Build a movement rhythm

Use `calm setup -> twist -> payoff -> recovery` within a section or across adjacent sections.
A long level needs changes in space and movement, not just more rectangles.

- Setup: show the next mechanic on a forgiving surface.
- Twist: change direction, timing, enclosure, or route choice.
- Payoff: reward the learned move with a reveal, branch, or satisfying landing.
- Recovery: give the player space to stop, inspect, and try again.

Avoid repeating the same pattern twice without a meaningful twist. A different organelle texture
does not change a staircase's movement. Alternate narrow and open spaces, horizontal and vertical
travel, stationary and moving routes, and direct and optional paths. Introduce one unfamiliar
demand at a time; combine familiar demands later.

## Tune the surprise

These design knobs describe choices, not a random difficulty slider. Use explicit authored values
so every surprise has a reachable exit and a recoverable failure.

| Design knob | Authoring choice | Supported geometry |
| --- | --- | --- |
| Enclosure | Tunnel opens into chamber; wide route narrows briefly | Solid roofs, floors, and baffles |
| Direction | Rise, fall, turn back briefly, then rejoin | Platform positions and level height |
| Timing | Ride across a gap or watch a moving opening | Linear or orbit platform `motion`; seconds for period, turns for phase |
| Collapse | Race across temporary footing, then drop onto support | Platform `crumble: { delay, reformAfter }` in seconds |
| Launch | A bounce carries the player upward or sideways | Bounce platform `launch: { x, y }` velocity |
| Current | A visible region lifts or pushes the player | `flowZones` acceleration, local `gravityScale`, and `drag` |
| Branching | Lower safe route and upper secret or shortcut | Separate platforms and optional collectibles |
| Pressure | Short hazard challenge followed by rest | Explicit hazard rectangles and checkpoints |
| Scale | Squeeze, broad chamber, then tall climb | Authored rectangle dimensions and spacing |
| Spectacle | New silhouette, reveal, or biological event | Decorations, caption and objective triggers |
| Material | Gel, membrane, reticulum, or mitochondrion | Platform `material` changes artwork only |

Moving decorations do not create a rideable surface. A ride needs a platform with `motion`.
Gel artwork does not change friction. A secret is an optional authored route, not a hidden-wall
system. A squeeze uses existing movement controls; there is no crouch control.

`launch` uses units per second: negative y launches upward. Omitting it gives the usual upward
bounce and preserves horizontal velocity. `flowZones` use units per second squared; overlapping
accelerations add, and gravity still acts. A vertical acceleration of -2100 counters gravity
1500 and lifts the player; a horizontal acceleration around 650-1000 adds a push while steering
remains available. These are starting values to test, not reachability guarantees. Keep current
zones clear of checkpoint spawns and provide a visible way out. Acceleration ends on exit;
existing momentum then follows ordinary movement and gravity.

Linear motion uses `axis`, `distance`, `period`, and optional `phase`. Orbit motion uses
`kind: "orbit"`, `radiusX`, `radiusY`, `period`, and optional `phase`: authored x/y locate the
orbit center of the platform's top-left corner. Collision rectangles stay axis aligned while
that corner follows cosine in x and sine in y. A rotating visual does not rotate collision bounds.

The first top contact arms `crumble`; leaving does not restart or cancel its `delay`. A collapsed
platform stops colliding. After `reformAfter`, restoration waits until the player clears its
rectangle. Retry, stage changes, and Replay clear collapse state; pause freezes its timer. Retry
retains the stage motion phase, so a restored tile can still be moving.

Within fields, nonnegative `gravityScale` multiplies gravity. Overlaps take the minimum with
the normal value of 1; accelerations still add. Nonnegative `drag` values add and damp velocity
by `exp(-drag * dt)` per step. Field exit restores ordinary gravity and damping while preserving
momentum. Keep entry, landing, and exit visible; low gravity is a local movement rule, not a
new player control.

## Current campaign beat map

The level sources own these delivered compositions; this map describes their order without
copying coordinates. Membrane and envelope combine generated recipes with hand-authored routes.

| Stage | Authored sequence | Recovery and biological boundary |
| --- | --- | --- |
| Membrane | Protein weave -> direct lipid crossing -> small pinball pop and reforming shelf | Stationary floors; crossing precedes the pop |
| Cytoplasm | Gel squeeze -> giant pinball/cache -> ribosome crumble shortcut -> ER express -> vesicle orbits -> nuclear approach | Broad catch floors and static ends; ordinary route uses the existing jump |
| Envelope | Stair ascent -> open pore suction and spring -> drifting vesicle -> descent and low-gravity loft | Pore stays open; loft detour returns to the floor |
| Receptor | Binding pocket -> impossible float -> vesicle moons -> fold express -> chromatin threshold | Binding saves progress; air jump unlocks after binding |
| DNA | Nucleosome orbits -> crumbling chromatin -> gel launch/high shortcut -> recognition basin | Catch floors and checkpoints; both routes reach the matching HRE |
| Transcription | Docked complex -> three recruitment windows -> polymerase and connected RNA payoff | Immediate recruitment retry; complex remains at HRE near promoter |

High caches appear in selected encounters, not every recipe instance. Neither caches nor the
high DNA shortcut skip binding, HRE docking, or recruitment. Rendering makes orbit silhouettes,
armed/absent tiles, and field boundaries visible; objective captions remain optional reading.

## Respect actual movement

[src/constants.ts](../src/constants.ts) owns tuning. The player collision box is 30 by 30 world
units. With gravity 1500, jump speed 560, and bounce speed 720, the ideal ballistic rises are
about 105 and 173 units respectively (`speed * speed / (2 * gravity)`). These are derived
estimates, not safe landing guarantees: fixed stepping, release-cut jumps, ceilings, and motion
change actual reach. Verify each required move in the built game.

- Leave clearance beyond the player's box in squeezes; avoid exact-fit collision passages.
- Test ceiling clearance through the full jump arc, not just at the takeoff and landing.
- Give checkpoints stationary support and unobstructed spawn room.
- Keep an ordinary route before receptor binding; use required air jumps only after its unlock.
- Give launch and moving-route failures a lower landing or a nearby checkpoint.
- Keep exits and biological interaction zones reachable from the required route.

## Keep chaos readable

Use consistent collision silhouettes and distinguish hazards with shape as well as color.
Show the landing or an approach landmark before commitment. Telegraph moving routes through
visible travel and space to wait. Keep foreground motion from obscuring the player or route.
Reduced motion limits decoration; required motion must remain understandable and playable.
Use the same left, right, and jump controls throughout. Secrets add discovery without blocking
completion, and captions explain biology without becoming navigation requirements.

Author secrets as deterministic discoveries. Mark an optional entry with a visible moving surface,
launcher, current boundary, or collectible. Provide a reward and a visible return before the next
required objective. An express route or absurd shortcut may skip local obstacles while preserving
the receptor, HRE, and recruitment sequence. Rare branches let the ordinary path establish
expectations before an unusual detour changes them.

Use collapsing footing for voluntary chase pressure over a safe catch floor. The player chooses
when to start; stable approach and recovery shelves allow waiting. A lethal pursuer, rotating
solid collision body, enclosed vesicle passenger, and falling rigid-body ribosome cascade each
need a separate runtime design; the current compositions do not imply those systems.

## Accept the built route

Build and serve with `./run_web_server.sh`, then play the changed sections using keyboard input.
Check the required route, optional branch return, moving surfaces, narrow collision passages,
intentional death, checkpoint recovery, pause/resume, and the reduced-motion presentation.
Record which routes were actually played; a screenshot alone does not prove reachability.

For each new surprise, record entry, required crossing, optional reward and return, and a missed
move. Observe recovery elapsed time and checkpoint retries. Exercise waiting through a full
motion cycle and restoration of temporary surfaces; compare normal and reduced-motion cues.
Keep practiced traversal time, route coverage, and human first-play enjoyment separate.

Run the repository integration checks:

```bash
./check_codebase.sh
./build_github_pages.sh
./run_playwright_tests.sh --build
```

A local build and preview do not publish remotely. Runtime and rendered evidence should show
that the geometry is varied, recovery is quick, controls stay readable, and the biological
objectives still happen in the intended order.
