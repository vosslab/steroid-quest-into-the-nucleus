# DNA expansion source handoff

The DNA/HRE stage exports `DNA_LEVEL` from
[src/levels/dna.ts](../../../src/levels/dna.ts). Five ordered required encounters use ordinary
chamber-local data, named primitives and steps, and the accepted compiler and phase helpers.
The campaign wrapper remains owned by the integration agent.

## Source evidence and limits

The temporary `tests/_temp/dna_control_probe.mjs` supplies Left/Right/Space `InputFrame` values at
the fixed 1/120-second simulation step. Optional Up/Down remain false. Its sole fixture mutation
sets initial `receptorBound = true`, representing legal entry after the preceding receptor stage.
It injects no positions, phases, HRE binding, checkpoints, or transition state.

| Source run | Active simulation time | Result |
| --- | --- | --- |
| Standard route | 119.03 seconds | Five completions, five completion saves, HRE binding and stage commitment |
| Early channel release and retry | 126.10 seconds | Early release does not credit delivery; reboarding and natural delivery succeed |
| Retry at all 25 pending steps plus early channel release | 137.68 seconds | Every pending step resumes from its prior completion save; phases and biology persist |

Times include the one-second DNA destination transition. They exclude no controller waits because
the controller adds none. The retry runs are recovery evidence, separate from standard pacing.
The source probe confirms completed receptor/HRE flags and encounter phases survive a final retry.

Commands:

```sh
node --import tsx tests/_temp/dna_control_probe.mjs
node --import tsx tests/_temp/dna_control_probe.mjs --early-channel-release
node --import tsx tests/_temp/dna_control_probe.mjs --retry-every-step --early-channel-release
npx tsc --noEmit -p tsconfig.json
npx eslint --max-warnings 0 src/levels/dna.ts
npx eslint --no-ignore --max-warnings 0 tests/_temp/dna_control_probe.mjs
```

The compiler import accepts all five calm completion spawns, including the continuous swept motion
envelopes of moving obstacles, and the rising channel path. Strict typecheck and scoped source/probe
lint pass. No build or browser acceptance is claimed here; the independent assessor owns actual
keyboard traversal of the integrated built artifact and final pacing acceptance.

Frozen source SHA-256:

```text
src/levels/dna.ts
5e38cb7537ff584ca9104f3b1ec65c004965a342ae8c090ba9ea710956f56c73
tests/_temp/dna_control_probe.mjs
8a0a31f97aaf7b68d5cffa45ea3a1c7727df66094b41af36890d0d74606018ac
```

## Encounter character

- `nucleosome_loop`: climb around moving chromatin, cross its high arc, rebound into a changed
  lower return, and climb the opposite outlet.
- `moving_passage`: enter broad regions while weaving around moving spools, reverse through the
  opposite upper gap, then descend through a newly available far-side route. Moving contact
  precision is never required.
- `flow_rearrangement`: entering the exposed chromatin region changes flow; the high window
  folds it into a basin, and a later rim wakes the opposite lift.
- `chromatin_channel`: high bank, diagonal weave, rising counterbend, new lower bank, mouth,
  capture, and natural S-shaped delivery. This differs from the membrane channel's rim sequence.
- `hre_docking`: lower DNA approach, matching coil approach, then broad calm HRE docking. The
  response-element trigger and gene destination share the pocket around world center `(7480, 500)`.

All five chambers retain a visible, permanent full-height descent. Pending-step flow windows and
channel activation remain available after retry; the channel boarding descent ends inside its
drag pocket so a detached complex can reboard. Completion saves sit clear of active force footprints,
moving geometry, and immediate recapture. Existing simulation authority guards HRE binding to the
current required milestone and receptor-bound entry; no biological shortcut or extra ability is added.

## Reference route guide

Coordinates below are WORLD player centers, not top-left positions. Full encounter IDs prefix the
names below with `dna-`. Pulse `yes` means use ordinary Space taps only while below the target:
the source reference uses `center_y > target_y + 35`, `vy > -65`, and at least 0.5 seconds since the
last tap. Pulse `no` means steer horizontally and coast in the authored current. No held Space is
needed. While attached, clear all movement and await natural delivery. Horizontal reference control
uses `target_x - center_x - vx * 0.28`, with a 14-unit dead band.

| Encounter | Pending step | Center target | Pulse |
| --- | --- | --- | --- |
| nucleosome_loop | loop_entry | (170, 1520) | no |
| nucleosome_loop | left_loft | (440, 280) | yes |
| nucleosome_loop | loop_rim | (1490, 340) | yes |
| nucleosome_loop | lower_basin | (385, 1520) | no |
| nucleosome_loop | loop_outlet | (1680, 370) | yes |
| moving_passage | lower_approach | (1890, 1520) | no |
| moving_passage | middle_clearance | (2530, 1070) | yes |
| moving_passage | upper_clearance | (3000, 310) | yes |
| moving_passage | opposite_gap | (2160, 420) | yes |
| moving_passage | passage_outlet | (3180, 1520) | no |
| flow_rearrangement | exposure | (3550, 1520) | yes |
| flow_rearrangement | high_window | (4610, 310) | yes |
| flow_rearrangement | return_basin | (3600, 1520) | no |
| flow_rearrangement | changed_rim | (4600, 1470) | no |
| flow_rearrangement | rearranged_outlet | (4880, 350) | yes |
| chromatin_channel | high_bank | (5300, 330) | yes |
| chromatin_channel | diagonal_weave | (6170, 1010) | no |
| chromatin_channel | counterbend | (5500, 310) | yes |
| chromatin_channel | lower_bank | (6220, 1460) | no |
| chromatin_channel | channel_mouth | (5300, 1540) | no |
| chromatin_channel | channel_capture | (5300, 1540) | yes if below mouth |
| chromatin_channel | channel_delivery, detached | (5300, 1540) | yes if below mouth |
| hre_docking | lower_approach | (6660, 1450) | no |
| hre_docking | matching_approach | (7220, 830) | yes |
| hre_docking | hre_docking | (7480, 500) | yes |
| destination | after all required steps | (7480, 500) | yes |

Apply these intermediate legs before the table target:

| Pending step | Condition | Intermediate center | Pulse |
| --- | --- | --- | --- |
| nucleosome_loop:loop_outlet | y > 530 | (1490, 370) | yes |
| moving_passage:middle_clearance | x < 2000 and y < 1250 | (1890, 1520), permanent descent | no |
| moving_passage:middle_clearance | x < 2000 and y >= 1250 | (2530, 1070), depart descent horizontally | no |
| moving_passage:upper_clearance | y > 500 | (2590, 310), enter lift | yes |
| moving_passage:passage_outlet | y < 1390 | (3020, 1520), enter far descent | no |
| flow_rearrangement:high_window | y > 500 | (4610, 310), enter high lift | yes |
| flow_rearrangement:return_basin | y > 1660 after retry | (3600, 1520), rise from below basin | yes |
| flow_rearrangement:changed_rim | y > 1600 after retry | (4600, 1470), rise toward lower rim | yes |
| flow_rearrangement:rearranged_outlet | y > 510 and x > 3780 | (3600, 310), enter opposite lift | yes |
| flow_rearrangement:rearranged_outlet | y > 510 and x <= 3780 | (3640, 310), continue ascent | yes |
| hre_docking:lower_approach | y < 1320 | (6620, 1450), permanent descent | no |
| hre_docking:matching_approach | x < 6900 and y < 1100 | (6620, 1450), descend to low approach | no |
| hre_docking:matching_approach | x < 6900 and y >= 1100 | (7220, 830), depart descent horizontally | no |

For early HRE testing, the broad trigger occupies world `x=7400..7565`, `y=415..580`, and the
destination center is `(7480, 500)`. Early approach is physically possible because the content
does not seal the world behind progress. HRE binding must remain false until `hre_docking` is
current; early destination contact redirects toward the pending action. After docking, the
transition preserves the bound complex into transcription. Transcription remains separately owned.

## Corrections during source probing

The initial route was too short, so the moving passage gained an opposite-gap return and the
channel gained a counterbend/new lower-bank sequence. These are active changes of route and flow,
not waiting or mandatory failure. A missing downward feed initially stranded a detached player
above the channel mouth; the bounded feed now terminates inside the calm pocket. Pending-step retry
testing identified lower approaches from saved checkpoints that need descent/ascent legs; the
reference guide records those explicit legs. Final browser review still needs to assess cue clarity,
all upper-pocket recoveries, biological presentation, and complete-campaign timing.
