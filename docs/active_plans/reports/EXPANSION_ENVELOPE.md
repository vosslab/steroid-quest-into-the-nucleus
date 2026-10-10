# Nuclear envelope expansion

## Scope and ownership

[envelope.ts](../../../src/levels/envelope.ts) exports `ENVELOPE_LEVEL`. It contains three required
encounters in a 5600 by 1800 world. All chamber geometry uses local coordinates, with placements
at (0,0), (2000,0), and (3200,0). Named helpers resolve phase thresholds. Shared simulation,
contracts, helpers, campaign wrappers, and permanent tests remain with their assigned owners.

The successful crossing finishes encounter two and saves immediately. The membrane boundaries and
open-pore stream are unconditional; phase changes never close the gap. Missing it is optional
recovery. The destination is the steroid receptor, without binding the player before the next stage.

## Active interaction sequence

| Encounter | Interaction and route change | Calm save, player top-left |
| --- | --- | --- |
| `circulation_approach` | Left loft, moving deflection, finite folded current, low basin opening a new diagonal staging approach | (1940,250) |
| `open_pore_crossing` | Outside high turn, low basin, rising outer rim, changed descent into the continuously open pore, successful crossing | (3200,1060) |
| `inner_return_loop` | Inner crest, finite backward sweep, return basin, short curved connector, opposing loft, changed lower turn, receptor rise | (5335,270) |

The curved channel is a short arcade connector, not a claim about molecular transport. The biological
caption keeps pore location and forces within the authored-example limits in
[SOLID_MODEL.md](../../SOLID_MODEL.md). Optional fragments do not complete required work.

## Source control evidence

The temporary `tests/_temp/envelope_control_probe.mjs` starts the new level through the ordinary
simulation API. It supplies Left, Right, and Space `InputFrame` values at 120 Hz. Up and Down are
always false. Its synthetic successor provides a destination commitment check without changing
campaign source. No player position, velocity, phases, checkpoints, or milestones are injected.

| Probe | Active simulation seconds |
| --- | ---: |
| Circulation approach completion | 25.6333 |
| Open-pore crossing encounter duration | 19.9000 |
| Inner return encounter duration | 31.3667 |
| All required work complete | 76.9000 |
| Destination approach and one-second transition | 1.6083 |
| Standard next-stage commitment | 78.5083 |
| Retry at all 18 pending steps, plus delivery escape/reboarding | 81.3500 |
| Actual upper-envelope collision, outside return, successful crossing and completion | 85.7667 |
| Highest inner pocket, permanent right descent, then completion | 95.4000 |

Standard timing has no intentional failure, waiting, pause, or added controller delay. Recovery
probes are separate measurements. Every retry preserves all existing phases and clears velocity
and attachment. Delivery escape remains pending until natural delivery after reboarding. Both
crossing-completion and its checkpoint event occur at 45.5333 seconds in the standard source run.

Development corrected two findings: a basin entry originally stopped above the boarding pocket,
so the pending connector now retains its entrance descent; a controller recovering the already
observed pore mouth needs the permanent outside descent before approaching the gap. The latter
changes the recovery guide, rather than simulation behavior.

This is source-level tuning and recovery evidence. Independent actual-key browser acceptance,
rendered presentation, campaign integration, and full release gates remain manager-owned.

## Actual-key route guide

All coordinates below are WORLD player centers. `YES` means ordinary upward Space correction:
pulse only when y is more than 35 below the target, vertical velocity is above -65, and the prior
pulse is at least 0.5 seconds old. `NO` means release Space throughout that leg. No held Space is
used in the standard route. Brake horizontal movement with the opposite arrow. While attached,
release all movement keys until natural delivery. All steps and targets are also present in the
temporary probe's `envelopeTargets` and `envelopeLeg` functions.

| Encounter: pending named step | WORLD center and intermediate waypoints | Pulse flags |
| --- | --- | --- |
| `circulation_approach:inlet` | (125,1510); inlet is observed immediately at the start edge | NO |
| `circulation_approach:left_loft` | (460,300) | YES |
| `circulation_approach:moving_deflection` | Moving surface center, base (1720,300); orbit radii (35,55), period 5 seconds | YES |
| `circulation_approach:low_basin` | (460,1510) | NO until y>=1400, then YES for overshoot correction |
| `circulation_approach:pore_staging` | (1830,500) until x>=1770, then (1950,310) | YES, YES |
| `open_pore_crossing:outer_high` | (2530,300) | YES |
| `open_pore_crossing:outer_basin` | (2280,1510) | NO until y>=1400, then YES |
| `open_pore_crossing:pore_rim` | (2600,1060) until x>=2520, then (2710,350) | YES, YES |
| `open_pore_crossing:pore_mouth` | (2715,930); after retry, if x<2500 and y<820, first descend at (2280,930) | NO on descent; YES once y>=820 |
| `open_pore_crossing:pore_crossing` | (3090,930); after retry, if x<2500 and y<820, first descend at (2280,930) | NO on recovery descent; YES through gap |
| `inner_return_loop:inner_entry` | (3430,950) | YES |
| `inner_return_loop:inner_crest` | (4070,380) until y<=440, then (4160,300) | YES, YES |
| `inner_return_loop:return_basin` | (3490,1540) | NO until y>=1420, then YES |
| `inner_return_loop:connector_capture` | (3490,1540), channel entrance; descent continues into boarding pocket | YES only for vertical overshoot correction |
| `inner_return_loop:connector_delivery` | Remain aboard to (4740,1360); if detached, return to entrance (3490,1540) | NO aboard; YES only for reboarding overshoot correction |
| `inner_return_loop:opposite_loft` | (3740,1060) until x<=3880, then (3740,310) | YES, YES |
| `inner_return_loop:lower_turn` | (4400,1510) | NO until y>=1400, then YES |
| `inner_return_loop:receptor_approach` | (5290,500) until x>=5150, then (5350,350) | YES, YES |
| Destination | (5445,350) | YES |

Missed-pore recovery: attempt (2860,300) until actual contact with the upper envelope, then steer
left to (2280,1510) with Space released. Once x<2400 and y>1400, resume the mouth/crossing guide.
The miss does not advance required crossing or cause death.

Highest inner pocket recovery: hold Space until y<25, then release it and steer to the full-height
right descent at x=5530. Descend toward y=1510, then resume the pending crest approach. The ordinary
inner return at x=3250 through 3350 supplies another full-height descent after crossing. The outer
approach has its right return at x=2145 through 2200; the outside pore return spans x=2170 through
2390. Every upper pocket can reach a full-height descent without Down.

## Checks and identity

Passed compiler import, `npx tsc --noEmit -p tsconfig.json`, scoped ESLint including the temporary
probe with `--no-ignore`, Prettier, 13 existing compiler/recipe tests, and `git diff --check`.
No build was run; the manager retains the existing diagnostic artifact.

SHA-256 source identity:

```text
1e024b0b8371430f4a87537f57735ce6ef877320e6edce71f9c1e3edc56a8b64  src/levels/envelope.ts
d2a4fd875a857f41e078260d97358a5ae4ce37e4fcf41919f87f8a97a12f3235  tests/_temp/envelope_control_probe.mjs
```

Changelog input for the documentation owner: Added three required nuclear-envelope encounters,
continuous pore crossing with immediate calm save, a finite inner return and curved connector,
permanent recoveries, and a receptor destination; source three-key route measures 78.51 seconds.
