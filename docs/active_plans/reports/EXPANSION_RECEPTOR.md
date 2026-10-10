# Receptor expansion handoff

## Scope and status

`src/levels/receptor.ts` exports `RECEPTOR_LEVEL`. Four chamber-local recipes compose a 7900 by
1800 world: sticky gallery, matching receptor binding, changed passage, and bound-complex transfer.
Stable named primitive and step references use the shared compiler and journey helpers. The matching
receptor trigger uses the existing current-milestone guard and a named phase window. Binding completes
encounter two and saves immediately; encounters three and four carry the bound complex onward.

No shared simulation, wrapper, build, or `dist/` files were edited by this owner. Integration,
fresh specification/quality review, and independent built-artifact assessment remain separate.

## Source verification

The temporary `tests/_temp/receptor_control_probe.mjs` starts an unbound simulation with the real level
and supplies `InputFrame` values. It never injects phases, milestones, player position, or checkpoint
state. Up and Down remain false throughout. A second stage exists solely to observe completed
destination commitment.

| Probe | Result | Active seconds |
| --- | --- | --- |
| Standard Left/Right/Space route | Four encounters, zero deaths, destination transition committed | 91.175 |
| Retry at every pending step and destination | All 18 recovery cases finish; phases and binding retained | 109.367 |
| Automatic sticky release | Finite release without a Space escape; campaign finishes | 91.175 |
| Early transport release and Retry | Delivery phase does not advance; recapture and natural delivery finish | 98.708 |
| Four upper-pocket returns | Reach y below 25, release thrust, descend past y 1400, resume and finish | 145.325 |

The last three recovery rows are deliberate detours, not standard pacing evidence. Standard completion
events occur at 30.758 seconds (gallery), 46.950 (binding), 72.842 (changed passage), and 88.417
(natural transfer delivery). Destination capture begins at 90.175; its existing one-second transition
commits at 91.175. Binding and its completion checkpoint fire at the same simulation step.

Compiler import, `npx tsc --noEmit -p tsconfig.json`, scoped ESLint, and source Prettier checks pass.
No browser/build acceptance is claimed by these source probes. The source SHA-256 is
`1281ec72fed912b031552d914aa34e4b452333dc0932ab2e6e949581131366c9`.

Run the probes with `node --import tsx tests/_temp/receptor_control_probe.mjs`, adding
`--retry-all`, `--automatic-release`, `--early-release`, or `--upper-return` individually.
This one-time probe remains temporary and is reviewed for removal at plan closeout.

## World-center route guide

These are player-center targets in WORLD coordinates, not chamber-local coordinates or player
top-left positions. Prefix each encounter name with `receptor-` for compiled encounter IDs.

`Pulse YES` means ordinary ascent pulses when below the target: pulse only while y exceeds target y
by 35, vertical velocity exceeds -65, no attachment exists, and at least 0.5 seconds has elapsed since
the last pulse. `Pulse NO` means let the authored descent/current carry the normal leg. Left/Right
steers toward target x with normal velocity braking. Space hold is not required on the standard route.
If Retry restores a lower checkpoint, enable ascent pulses on a non-transport leg while below its
target by 35. This recovery rule keeps a pending former descent pocket reachable from below.

| Encounter / pending step | WORLD center target | Pulse | Route detail |
| --- | --- | --- | --- |
| sticky_gallery / gallery_entry | (450, 300) | YES | Enter the lift at x 450 and rise into the gallery. |
| sticky_gallery / sticky_contact | (1400, 510) | YES | Steer right into the named sticky patch. |
| sticky_gallery / nearby_escape | (1580, 800) | NO | Pulse once while sticky, or let automatic release occur; descend right to the nearby pocket. |
| sticky_gallery / lower_branch | (550, 1460) | NO | Turn left into the opened branch and its x 550 descent lane. |
| sticky_gallery / gallery_outlet | (1860, 1460) | NO | Cross the lower onward current to the gallery outlet. |
| matching_binding / binding_entry | (2150, 1450) | NO | Continue right along the low approach. |
| matching_binding / binding_rim | (3450, 280) | YES | Rise right through the receptor approach and touch the high rim. |
| matching_binding / receptor_approach | (2490, 1280) | NO | While y < 1200, first aim (2500, 1290), NO pulses, to enter the descent lane. |
| matching_binding / receptor_binding | (2510, 1500) | NO | Descend into the calm matching receptor; binding completes and saves immediately. |
| changed_passage / bound_entry | (4150, 320) | YES | Carry the bound complex right into the x 4150 lift and upper passage. |
| changed_passage / middle_switch | (5640, 810) | NO | Follow the opened middle current right/down to its switch. |
| changed_passage / lower_turn | (4360, 1500) | NO | Turn left; while y < 1380, aim (4360, 1500), NO pulses, into its descent lane. |
| changed_passage / passage_outlet | (5850, 350) | YES | Turn right/up through the changed rising passage. |
| bound_transfer / transfer_loft | (7460, 280) | YES | Continue right into the transfer loft. |
| bound_transfer / boarding_pocket | (6275, 1450) | NO | While y < 1300, first aim (6300, 1450), NO pulses, to enter the boarding descent. |
| bound_transfer / complex_capture | (6275, 1450) | NO | Steer into the vesicle's start pocket. |
| bound_transfer / complex_delivery | (6275, 1450) | NO | Once attached, release all movement; natural delivery is required. |
| destination | (7800, 350) | YES | Steer right/up through the chromatin approach and enter its capture radius. |

For `nearby_escape`, a Space escape pulse is distinct from ascent pulses; automatic release also
works. For transport capture and delivery, pulses stay disabled even after Retry. The continuing
transport window permits recapture while delivery is pending. Early Space release never satisfies it.

## Permanent upper returns

Every recovery stream spans the full chamber height and stays available independently of phases.
The upper-return probe ascends with held Space, then releases Space and steers to these WORLD x
coordinates until y exceeds 1400:

| Upper pocket | Ascent x | Permanent descent x |
| --- | --- | --- |
| Gallery | 450 | 295 |
| Receptor approach | 3100 | 2180 |
| Changed passage | 4150 | 3955 |
| Transfer | 7460 | 6220 |

The receptor ascent x avoids the high rim; touching that rim is the normal required route instead.
The matching pocket, all completion spawns, and the transfer path pass compiler safety checks.
Temporary and optional sticky contacts always support automatic or Space release. The chromatin
destination retains its biological motif and the existing transition behavior.
