# M2 membrane authoring handoff

## Result and ownership

The membrane now contains four required encounters in a 6000 by 1800 world. Its source lives in
[membrane.ts](../../../src/levels/membrane.ts), imported by
[cell.ts](../../../src/levels/cell.ts). The other cell stages retain their M1 geometry and sequence.
No simulation, type, input, runtime, or presentation source changed in this batch.

[journey_patterns.ts](../../../src/levels/journey_patterns.ts) supplies four small composition
helpers: `phaseWindow`, `phaseAfterStep`, `stream`, and `rebound`. The existing four chamber families
remain the authoring model. There is no additional runtime or configuration language.

All interaction steps have stable local IDs. Authored conditions use the named thresholds from
[encounter_phases.ts](../../../src/levels/encounter_phases.ts). All positions are chamber-local;
placement translates each complete chamber. The compiler validates references, geometry, transport
clearance, and calm completion footprints at import.

## Requirements and encounters

| Required encounter | Active approach and change | Follow-through and save |
| --- | --- | --- |
| `bilayer_outlet` | Original inlet/rebound, left loft, high crest contact | Crest reverses its current; lower basin opens a rising outlet; calm high-outlet save |
| `backward_arrival` | Outlet arms finite sweep; low-left return wakes a vesicle | Capture and natural delivery open a loft; rim opens lower descent/right route; calm lower-exit save |
| `linked_loops` | First high rim opens lower return; lower link enters the second lobe | Second rim opens opposite loft; loft joins upper outlet; calm upper-exit save |
| `channel_delivery` | Low rim wakes high approach; high rim folds current toward mouth | Mouth opens capture; natural delivery completes required work; calm delivery save and nearby destination |

The first biological destination remains a motor-carried vesicle. Its capture needs all four
encounters. Optional fragments and the marked acid branch do not satisfy required work. Exploration
has an initial rank-zero calm marker; required saves cannot be replaced by it.

The bilayer artwork remains two continuous, permeable lipid columns. The initial rebound's local
geometry, forces, vortex center, and spawn are the earlier proven opening translated down by 1000
units. After contact its temporary collision surface clears so the lower return remains navigable.
The biological caption identifies all currents, collisions, rides, and channels as exaggerations.

## Source control evidence

The temporary `tests/_temp/membrane_control_probe.mjs` starts
the real campaign simulation and advances only `InputFrame` values. Its only recovery action is the
public `retry()` method. It reads state for feedback; it never changes position, velocity, phases,
collectibles, or checkpoints directly. All movement uses Left, Right, and Space. Rides complete
naturally with no Space held while attached.

Observed development results:

| Measure | Simulation seconds |
| --- | ---: |
| First bilayer rebound, Right alone | 1.5333 |
| Bilayer/outlet completion | 24.7750 |
| Backward sweep/arrival duration | 26.4750 |
| Linked loops duration | 28.0750 |
| Channel delivery duration | 19.6417 |
| Four encounters complete | 98.9667 |
| Destination entry and next-stage commit | 101.3667 |
| Early release and retry at both pending delivery steps, then stage commit | 116.2917 |

The initial route hypothesis was approximately 24/22/27/18 seconds. Observed source duration is
separate from browser pacing acceptance. No pause, controller delay, artificial wait, intentional
death, or repeated failure was inserted in the standard source run. The roughly two-second rides
connect control segments; their actual bounded-speed traversal remains simulation-owned.

Source logs, the executed probe snapshot, and SHA-256 identities are retained under
`test-results/expansion/membrane/source/`. These are ignored development artifacts, not permanent
tests. The source probe remains temporary until plan closeout.

## Three-key return routes

| Encounter | Permanent full-height descent in world coordinates |
| --- | --- |
| Bilayer | x=2145 through 2200 |
| Arriving vesicle | x=190 through 340, available after bilayer completion |
| Linked loops | x=4045 through 4100 |
| Channel | x=4160 through 4360 |

Changed basin, arrival, and channel descents also reach the world's highest pocket. Completion
spawns sit outside every force footprint and outside immediate capture. Returning to either
pending delivery retains its transport through the named delivery threshold. Space escape does
not credit delivery, and retry preserves capture progress for recapture.

The highest-pocket source probe holds Space until y<25 in both bilayer and linked loops, then
steers with Space released into the relevant permanent descent and resumes the standard route.
Detailed timestamps are in `source/highest.jsonl`; this is additional recovery development evidence,
separate from the standard timing gate.

## Actual-key route guide

Coordinates below are world player centers. Steering uses opposite horizontal input to brake.
Use no held Space on descents, then pulse to correct overshoot below the final target. The source
controller pulses when center y is more than 35 below its target, vertical velocity is above -65,
and the previous pulse is at least 0.5 seconds old. It suppresses pulses only for the initial inlet
and rebound, or while attached. Release all keys aboard either transport. Optional Up/Down are
unnecessary. Descending via points have a lower y target, so ordinary correction does not pulse
during their downward approach; after switching to the final point, correction becomes active.

| Encounter and pending step | Center or approach |
| --- | --- |
| Bilayer inlet and first rebound | Right only to (460,1380); first inlet is crossed automatically |
| Left loft | (460,265), Space pulses |
| Crest rebound | (1720,280) |
| Lower basin | (450,1500), Space released |
| Outlet | (1830,500), then (1930,310) |
| Sweep arm and return | (1930,310), then (285,1560), Space released |
| Vesicle capture and delivery | (285,1570), then remain aboard |
| Arrival rim | (1440,350) until y<480, then (680,330) |
| Arrival exit | Descend at (950,1450) until y>1340, then (2070,1460) with upward overshoot correction |
| First linked entry/rim | (2330,1460), then (3540,330) until y<430, then (3730,320) |
| Lower link and second rim | (2460,1500), then (3800,1430), release Space on descent |
| Opposite loft | (2460,1050) until x<2580, then (2460,310) |
| Linked outlet | (3960,500) |
| Low channel contact | Descend at (4260,1440) until y>1300, then (4390,1440) with upward overshoot correction |
| High channel contact | (5580,330) until y<420, then (5710,300) |
| Channel mouth/capture | (4345,1480), Space released |
| Delivery and destination | Remain aboard to (5790,750), then steer toward (5930,360) |

## Reuse for M3

Use the four existing constructors for chamber identity, recovery, and primary transport. Extend
them with explicit local arrays. A named contact should change a visible force or passage; an
ordered touch with no environmental consequence is insufficient.

`phaseWindow(id, steps, after, before)` activates after the named first step through the pending
named second step. Use it for capture/delivery availability, including early escape and retry.
`phaseAfterStep` supplies permanent changed routes. `stream` keeps a local rectangle, force, cue,
and phase condition together; `rebound` creates a named circular switch surface. Other obstacle
shapes remain ordinary authored data. Compiler/step-helper tests already protect these contracts;
no permanent coordinate or duration assertions were added.

The two overlapping opening chambers demonstrate a sequence arm: the second encounter first
observes an outlet region, then its finite sweep becomes active. This prevents an upcoming
encounter's phase-zero fields from interfering with current work, without an AND condition or
runtime script. Its permanent recovery references the previous encounter's named completion.

Allocate roughly 1800-2200 local width and 1800 height per pair of active lobes as an initial
budget, then measure the route. The membrane's world width is 6000 because its first two chambers
share their reversal space. Width alone supplies no pacing evidence. Calm save pockets must avoid
all field rectangles, including other chambers whose independent conditions the compiler treats
conservatively as overlapping.

## Verification and remaining gates

- Project TypeScript check: zero diagnostics.
- Scoped ESLint: zero warnings.
- Prettier applied to the three owned source files.
- Compiler and recipe checks: 13 tests pass.
- `git diff --check`: clean.
- Source sizes: membrane 663 lines, helpers 54, cell composition 261.

Manager-owned canonical checks/build, independent fresh specification/quality review, and
built-artifact actual-controls acceptance remain separate. Source froze before that build;
documentation and ignored probe artifacts may continue changing. No Git index operations occurred.

A pending-delivery presentation concern was reported and resolved by the shared presentation owner.
`currentAction` now requires the current attachment: detached or mismatched players receive the
current capture point and a reboard label; matching riders receive the endpoint. The HUD and both
renderer callers use the same derivation. Four focused presentation tests pass. Geometry recovery
already succeeds without a content workaround. Independent browser run 02 remains pending.
