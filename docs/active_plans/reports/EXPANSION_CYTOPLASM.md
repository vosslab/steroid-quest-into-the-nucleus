# Cytoplasm expansion handoff

Source is frozen for fresh review and integration. Built-artifact acceptance remains pending.

## Ownership and outcome

- New [cytoplasm.ts](../../../src/levels/cytoplasm.ts) exports `CYTOPLASM_LEVEL`.
- Temporary `tests/_temp/cytoplasm_control_probe.mjs` drives ordinary input frames. It never
  changes player coordinates or encounter progress.
- This report is the third owned file. Campaign wrappers, shared helpers, core, browser tests,
  build output, changelog, and index state are untouched by this owner.
- The approved [longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md) supplies the stage
  sequence and 110-155 second target. M2 acceptance released implementation.

Five required encounters use distinct movement problems: filament motor delivery, one giant
mitochondrial rebound/circulation, two folded ER channel legs, opposing flow lanes and a motor
interception, then two vesicles separated by a moving crowded-surface deflection.

All geometry is chamber-local, translated at x=0/2000/4000/6000/8000. World size is 10200 by
1800. Named steps and shared `phaseWindow`, `phaseAfterStep`, `stream`, and `rebound` helpers
retain ordinary typed recipe authoring. The giant mitochondrion's material artwork comes from
its actual circular collision shape. No receptor binding occurs here; the destination is the
nucleus motif with visible pores.

## Source checks

Every required encounter saves an ordered calm checkpoint. Named mitochondrial, ER-junction,
and crowded-surface contacts immediately change visible force fields. Required transports stay
available through pending delivery, including early escape and retry. No physics constants,
idle waits, compulsory misses, or required Up/Down actions were introduced.

Commands passed:

```sh
npx tsc --noEmit --pretty false
npx tsc --noEmit -p tsconfig.lint.json --pretty false
npx eslint src/levels/cytoplasm.ts
npx prettier --check src/levels/cytoplasm.ts
git diff --check
node --import tsx tests/_temp/cytoplasm_control_probe.mjs
node --import tsx tests/_temp/cytoplasm_control_probe.mjs --retry-steps
node --import tsx tests/_temp/cytoplasm_control_probe.mjs --retry-delivery
node --import tsx tests/_temp/cytoplasm_control_probe.mjs --highest-pocket
node --import tsx tests/_temp/cytoplasm_control_probe.mjs --shortcut
```

The source import runs chamber validation, sampled transport clearance, and calm-spawn checks.
Authored TypeScript is 809 physical lines. The temporary probe is excluded from permanent gates;
it was formatted separately with `--ignore-path /dev/null`.

## Timing hypothesis measured

These are simulation-input development measurements. They do not establish browser acceptance,
independent pacing, or full-campaign 8-12 minute acceptance.

| Standard route segment | Active seconds |
| --- | ---: |
| Motor delivery and far lift | 26.20 |
| Giant mitochondrial rebound and far-side circulation | 21.66 |
| Two ER folds and opened junction return | 23.81 |
| Countercurrent lanes and motor relay | 21.45 |
| Crowded vesicle transfers | 21.70 |
| Nucleus approach and capture | 1.01 |
| Destination transition to next-stage commitment | 1.00 |
| Total, including commitment | 116.83 |

Destination capture occurs at 115.825 seconds. Full commitment occurs at 116.825 seconds.
The standard run uses no optional cargo and no retry. The pulse controller taps Space only when
below a target with insufficient upward speed; it adds no delay to reach the pacing target.

| Recovery probe | Result | Capture / commitment seconds |
| --- | --- | ---: |
| Retry once at every pending step | All 26 resumed; five completions retained | 194.23 / 195.23 |
| Escape each required ride, then retry | All six resumed; early escape credited no delivery | 157.83 / 158.83 |
| Highest crowded pocket then permanent descent | Returned through lower bay; all five complete | 129.83 / 130.83 |
| Optional ridiculous cargo | Legal separate ride after motor delivery | 115.83 / 116.83 |

The optional ride saves motor-encounter travel: completion at 22.967 seconds versus 26.200,
a 3.233 second saving. Later moving-cargo schedules absorb that gain in this particular full
source run. It offers a useful legal alternate approach to the pending motor outlet; it cannot
credit `motor_capture` or `motor_delivery` because its ID is separate and it activates only
after required motor delivery. It rejoins at (1900,560), below the same required outlet.

## Keyboard route guide

All coordinates below are WORLD PLAYER CENTERS, not top-left positions. Prefix each encounter
with `cytoplasm-` when reading compiled observations. `pulse=yes` allows ordinary Space taps
for ascent; `pulse=no` allows descent and coasting. Up/Down are always false. Release all keys
while attached and let the ride deliver naturally. After escape or retry, pending delivery
uses the capture row's boarding point, not the endpoint.

| Encounter | Named step | World center | Pulse |
| --- | --- | --- | --- |
| motor_delivery | boarding_loft | (480,330) | yes |
| motor_delivery | motor_capture | (480,330) | yes |
| motor_delivery | motor_delivery | (480,330), then hands off | yes when detached |
| motor_delivery | motor_outlet | (1990,300) | yes |
| mitochondrial_rebound | mitochondrial_rebound | (2780,1360) | yes |
| mitochondrial_rebound | spiral_loft | (2610,300) | yes |
| mitochondrial_rebound | far_side | (3790,1300) | no |
| mitochondrial_rebound | mito_outlet | (4070,1400) | yes |
| er_transfer | first_mouth | (4350,500) | yes |
| er_transfer | first_capture | (4350,500) | yes |
| er_transfer | first_delivery | (4350,500), then hands off | yes when detached |
| er_transfer | junction_contact | (5760,360) | yes |
| er_transfer | second_mouth | (4350,1480) | no |
| er_transfer | second_capture | (4350,1480) | yes |
| er_transfer | second_delivery | (4350,1480), then hands off | yes when detached |
| countercurrent_relay | lower_headwind | (7580,1440) | yes |
| countercurrent_relay | upper_headwind | (6480,300) | yes |
| countercurrent_relay | relay_capture | (6480,300) | yes |
| countercurrent_relay | relay_delivery | (6480,300), then hands off | yes when detached |
| crowded_transfer | first_bay | (8450,500) | yes |
| crowded_transfer | first_capture | (8450,500) | yes |
| crowded_transfer | first_delivery | (8450,500), then hands off | yes when detached |
| crowded_transfer | crowd_deflection | (9580,1260) | yes |
| crowded_transfer | second_bay | (8330,1500) | no |
| crowded_transfer | second_capture | (8330,1500) | yes |
| crowded_transfer | second_delivery | (8330,1500), then hands off | yes when detached |
| complete | destination | (10110,740) | yes |

Apply these intermediate waypoint rules before the final target:

| Pending step and condition | Intermediate target | Pulse |
| --- | --- | --- |
| boarding_loft: x<300 and y>450 | (480,1250), enter left lift | yes |
| motor_outlet: y>450 | (1900,300), enter far lift | yes |
| mitochondrial_rebound: y<1250 | (2300,1400), enter permanent descent | no |
| mito_outlet after retry: x<3600 and y<1540 | (2300,1560), descend below giant | no |
| mito_outlet after retry: x<3600 and y>=1540 | (3600,1560), pass below giant | no |
| upper_headwind: y>580 | (7510,300), enter far lift before turning left | yes |
| second_bay: y<1380 | (8205,1500), enter permanent descent | no |

The temporary probe's `targets` object and waypoint block are the executable development guide.
The browser controller should use read-only observations and actual keyboard events.

## Recovery and optional branches

Permanent downward strips cover the complete height, at world x=100-270 (motor), 2180-2410
(mitochondrion), 4200-4300 (ER), 6100-6320 (relay), and 8150-8260 (crowding). Move into a strip
with pulse disabled; steer back out at the height needed by the pending action. Calm completion
spawns are authored top-left positions and differ from the center targets above.

The highest-pocket development detour occurs with `crowded_transfer:second_bay` pending:
reach (9800,40) with pulses, then steer to (8205,1500) with pulses disabled. The lower bay remains
reachable after its crowded-surface contact changes the flow.

For optional cargo after required `motor_delivery`, steer to (450,1550) with pulses disabled
unless below y=1590. The authored drop cue and drag pocket align boarding. Its transport ID is
`cytoplasm-motor_delivery-shortcut`. Natural rejoin is (1900,560), then pulse toward the outlet.

The optional marked lysosome spans world x=8930-9190, y=1730-1780. An accessible destructive
contact target is (9060,1745): descend at x=8205 to the lower world edge, then steer right with
pulses disabled. This branch is unnecessary for required completion. Fresh built assessment
should verify death retains completed encounters and the currently pending phase.

## Frozen hashes and limits

```text
src/levels/cytoplasm.ts
5c36fb36dad1821123cd79c1761222bee6db6f1e638639da977643578cfe3544
tests/_temp/cytoplasm_control_probe.mjs
032d7e2adbf2e163021fb7daa93b05299eb743d3045fecb86424cbee08fe3d87
```

Fresh SPEC and QUALITY reviews, wrapper integration, actual-controls browser reachability,
readable force/return cues, marked-hazard recovery, source/build hash binding, and full-campaign
pacing remain with the manager and independent assessors. No browser rebuild or remote publication
was performed by this owner.
