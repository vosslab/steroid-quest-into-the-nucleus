# Independent expansion assessment

## Status

PASS for this independent standard-route lane: the frozen built campaign completed all six stages
and 21 required encounters in **579.57 active seconds (9:39.57)**. The only gameplay keys were
Left, Right, and Space. No failed diagnostic contributes to that time.

The final evidence is the ignored raw file
`../../../test-results/expansion/independent_2026_10_09T17_51_00_905Z/independent_summary.json`,
including a continuous video, 117 signature captures, 4,952 readonly observations, 1,614 actual
key events, immutable controller snapshots, and before/after provenance. There were zero deaths,
browser errors, or capture errors. This result establishes this lane's completion and pacing;
the reference, recovery, lifecycle, and broader presentation lanes have separate acceptance duties.

The manager explicitly released the final artifact at port 8374. Its build signature was
`802e4c3244bfc2e06df0785d2049f49be13866651fd64ff367a7e41db93f4470`,
and main.js SHA256 was
`7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43`.
The runtime source signature was
`18e549c7f4633656939f1c7b9f04645257a73f6dcd0427a04c880e43140db0b0`.
Every source, build, served asset, and controller hash stayed identical before and after the run.
Served assets matched the approved local build.

## Complete campaign timing

| Stage | Active seconds | Planning allocation |
| --- | --- | --- |
| Membrane | 107.56 | 80-115 |
| Cytoplasm | 113.54 | 110-155 |
| Nuclear envelope | 83.87 | 75-110 |
| Receptor | 122.70 | 90-130 |
| DNA/HRE | 147.04 | 115-165 |
| Transcription | 4.86 | 10-20 |
| Complete campaign | 579.57 | Required gate: 480-720 |

Membrane includes the initial 0.12 seconds before the first readonly sample. The JSON interval
table begins at that sample and therefore lists 107.44 seconds for membrane. Other stages include
their destination approaches and normal transitions.

Transcription actions were pressed promptly in the existing forgiving window. The three
recruitments were observed at 575.21, 575.44, and 575.67 seconds; the RNA payoff ended at 579.57.
The manager clarified that 10-20 seconds is a planning allocation, not permission to add waits;
the hard acceptance gate is the complete 480-720-second campaign. The shorter transcription
measurement is reported without changing its behavior or padding the recording.

| Stage | Required encounter | Active seconds |
| --- | --- | --- |
| Membrane | Bilayer/rebound outlet | 26.65 |
| Membrane | Backward sweep and arriving vesicle | 23.74 |
| Membrane | Linked current loops | 33.87 |
| Membrane | Channel delivery | 20.80 |
| Cytoplasm | Motor delivery | 19.23 |
| Cytoplasm | Mitochondrial rebound | 23.40 |
| Cytoplasm | ER transfer | 25.27 |
| Cytoplasm | Countercurrent relay | 22.11 |
| Cytoplasm | Crowded vesicle transfer | 22.08 |
| Nuclear envelope | Circulation approach | 25.98 |
| Nuclear envelope | Open-pore crossing | 22.69 |
| Nuclear envelope | Inner return loop | 33.23 |
| Receptor | Sticky gallery and escape | 40.58 |
| Receptor | Matching receptor binding | 21.52 |
| Receptor | Changed-current passage | 37.26 |
| Receptor | Bound-complex transfer | 20.93 |
| DNA/HRE | Nucleosome loop | 31.85 |
| DNA/HRE | Moving passage | 25.90 |
| DNA/HRE | Flow rearrangement | 35.64 |
| DNA/HRE | Chromatin channel | 38.50 |
| DNA/HRE | HRE docking | 13.91 |

The full per-step intervals remain in `independent_summary.json`. First lasting receptor binding
was observed at 367.07 seconds and HRE binding at 573.47. Every required phase was checked against
the authored definitions, followed by receptor/HRE binding and three recruitments; reaching the
ending screen alone was not the completion assertion.

## Active controls and resource use

Sampled movement contains 35.24 seconds of transport attachment and 0.14 seconds of sticky
attachment. Free playing occupies 534.28 seconds and transitions 4.93 seconds. Unattached,
near-stationary, no-key samples total 0.82 seconds, all while legitimately boarding the motor or
first crowded-transfer vesicle. They are not artificial pacing. Actual inputs continued during
camera movement and asynchronous screenshots; no controller cadence was slowed for the gate.

Simulation and wall advancement matched to approximately 1.000 over 579.29 measured wall seconds.
Concurrent assessment contexts did not produce material performance contention in this run.
The video lasts 580.92 seconds because it includes browser setup and the ending capture;
campaign timing uses the game's active elapsed observation instead of video length.

## Prefix diagnostics

The first two attempts used frozen build signature
`a8b587438be5714356a9d9981cc13ed022545827c1ffacc3f359a1db5a66dc85`.
The third and fourth used corrected build signature
`4b1b16f3b7f9d6011dfe68cd7c7bffbceea091583f22248c13de792ec428eb29`, with main.js SHA256
`8c248239f0549fa2bcc67ce855d11bd8afed8d929693f646c1242c89e4981546`.
Source knowledge did not prevent navigation errors. No prefix attempt contributes to final campaign
pacing acceptance.

| Evidence directory suffix | Active seconds | Required complete | Outcome |
| --- | --- | --- | --- |
| `independent_2026_10_09T17_18_15_995Z` | 0 | 0/4 | Chromium launch denied by the macOS sandbox; no gameplay |
| `independent_2026_10_09T17_18_24_699Z` | 75.03 | 0/4 | Grid edge assumed an inaccessible descent |
| `independent_2026_10_09T17_20_36_273Z` | 146.43 | 2/4 | Controller stopped outside a current |
| `independent_2026_10_09T17_27_02_097Z` | 100.63 | 3/4 | Contact aiming left the descent too early |
| `independent_2026_10_09T17_29_37_095Z` | 110.47 | 4/4 | PASS: natural deliveries and stage transition |

Artifacts live beneath `test-results/expansion/`; each retains video, captures, actual key events,
trace, failure cause, and hashes. Build and controller stayed unchanged in all four runs, and
served hashes matched build hashes. All source remained stable in the first and third. The second
source changed during authorized camera work. The fourth source signature changed only because
new `src/levels/envelope.ts` and `src/levels/receptor.ts` files appeared during M3 authoring; every
existing source file remained unchanged. This was permitted for prefix diagnostics and prevents
treating them as final frozen-source acceptance.

The second attempt completed the bilayer/outlet and backward-arrival encounters, including natural
vesicle delivery. Its initial rebound was delayed by waypoint braking that lost momentum in the
inlet current, followed by a real trip through the permanent far-right descent. This supports
recovery reachability but does not establish enjoyable first-play pacing. It later stopped with
linked-loop phase 2 retained, before entering the lower link.

Controller corrections sample narrow return fields at 40-unit resolution, require downward
force at both ends of a descent edge, simplify straight grid paths, maintain speed toward nearby
contact centers, and allow an upward correction while finding a downward return. A contact below
the player retains the descent until its surface can be reached before aiming toward the center.
The corrected policy passed the fourth diagnostic. A manager-stop signal releases keys at an
observation boundary and
preserves explicit stopped-run evidence before a rebuild.

The examined initial and stopped captures show a readable current-step HUD, a highlighted rebound,
an offscreen lower-link pointer, and nearby downward-current arrows. The controller's failure does
not demonstrate missing geometry or an unreadable return. The initial launch attempt has hashes
and a diagnostic summary but no video because Chromium never opened.

## Passed membrane evidence

The passed prefix retains 24 signature captures, a complete video, 944 observations, 356 actual key
events, controller source snapshots, and provenance. The actual key set is exactly Left, Right,
and Space. It has zero deaths, browser errors, failed captures, and unattached near-stationary
no-key seconds. The first rebound completes at 1.73 seconds. The stage commits at 110.47 active
seconds, inside its 80-115 second target.

These intervals begin at the first 0.10-second observation:

| Segment | Active seconds |
| --- | --- |
| Bilayer/rebound outlet | 27.08 |
| Backward sweep and arriving vesicle | 25.02 |
| Linked current loops | 33.73 |
| Channel delivery | 22.15 |
| Destination approach and transition | 2.39 |

Inspected captures show the locked motor-carried vesicle with `3 / 4 REQUIRED` while the channel
mouth remains the current objective, followed by `Ready: enter Motor-carried vesicle` after natural
delivery. The return pointer directs back toward the mouth, and arrows show the changed current.
The destination's vesicle, motor track, capture ring, and label remain recognizable during capture.

Movement alternates climbs, lateral transfers, backward sweeps, and descents. Delivery opens a
new loft; contact changes the current; the linked loops introduce another opposing route. These
changes provide new routes and interactions after success. The earlier diagnostic misses used a
real permanent return rather than death, but mostly repeated the incomplete approach: they do not
independently demonstrate that mistakes always create new opportunities. Circulation and return
travel dominate this membrane stage; the vesicle and channel deliveries provide brief changes in
control. The complete campaign assessment below checks whether later stages vary that pattern.
Prefix completion does not establish human enjoyment.

## Assessment ownership

This assessor authored neither the evaluated level content nor the reference controller.
The independent controller does not import, copy, or read the reference navigation policy or
its route trace. It uses the ordinary compiled level definitions and readonly canvas observations
allowed by [longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md).

Only actual Playwright keyboard events move the player. The standard route's allowlist is
`ArrowLeft`, `ArrowRight`, and `Space`. The visible Start button begins the session. There are no
state writes, position injection, hidden gameplay controls, forced failures, or required optional
arrow keys.

## Independent steering method

- Resolve the current required step from the observed encounter ID and authoritative phase.
- Identify its region, named contact, transport, or biological trigger from authored data.
- Plan a grid route around current collision shapes and marked hazards, preferring active descent
  fields for downward returns because the game has no global gravity.
- Steer horizontally using observed velocity and target distance. Use Space for upward correction
  and sticky-contact escape. Release all keys while naturally riding a transport to delivery.
- Recalculate after progress changes or meaningful elapsed movement. Recruitment taps use the
  observed forgiving clock window without added delays.

The response cadence is 0.10 seconds of advancing simulation. Existing keys remain active between
observations. Captures run alongside the control loop. Neither cadence nor capture work is changed
to attain the 8-12 minute target. Required transport travel and the RNA payoff count naturally;
menus and pauses do not advance the game's elapsed observation.

Source knowledge helps the controller choose a route, but does not establish visual clarity.
The recording and captures are separately inspected for target recognition, direction cues, locked
destinations, return readability, and whether mistakes expose new opportunities or simply repeat
tasks. Completion alone does not establish enjoyable movement.

## Evidence and corrections

Each run preserves an independently named directory under `test-results/expansion/`, containing:

- A continuous recording and numbered signature captures.
- Readonly observations and the control reason for each sample.
- Every actual key down/up event, with active time and stage.
- Per-stage, per-encounter, and per-step timing intervals.
- Source, controller, build, and served file hashes before and after.
- Explicit failure cause, last observation, and browser errors for incomplete diagnostics.

Every failed attempt stays diagnostic. A correction starts a new complete standard run; failed
attempts are excluded from final pacing. The report distinguishes navigation-policy errors
from geometry, progression, and presentation defects, including what the controller learned.

## Preparation checks

Scoped ESLint and Prettier checks pass for both independent harness files. The no-browser prepare
mode successfully compiles the current level definitions and calculates build provenance. These
checks establish harness readiness, not gameplay acceptance.

The final run command is:

```sh
PW_BASE_URL=http://127.0.0.1:8374 node --import tsx \
  tests/playwright/independent_walkthrough.mjs --approved-build BUILD_SIGNATURE \
  --approved-main MAIN_JS_SHA256
```

The manager supplied both hashes after freezing and serving the final artifact. No browser
execution occurs merely because preparation printed an intermediate artifact signature.

## Rendered movement assessment

This assessment inspected signature captures from each stage, all five destination captures,
the recruitment and ending captures, and twelve extracted video frames across ER transfer,
sticky escape, and moving chromatin. The derived video frames remain in the final evidence
directory as `independent_review_er_*`, `independent_review_sticky_*`, and
`independent_review_chromatin_*`. This is targeted rendered inspection, not a human play study
or exhaustive frame-by-frame review of every zoom animation.

The chambers have identifiable differences in action. Membrane alternates climbs, backward sweeps,
linked loops, and two natural deliveries. Cytoplasm introduces a motor ride, a large mitochondrial
rebound, two ER folds connected by a junction contact, a headwind relay, and a moving crowded
surface between vesicle rides. The ER sequence visibly carries the steroid on a curved path;
after delivery, the permanent descent remains available while the junction is still highlighted.
Contacting the junction changes the arrows and opens the route toward the second fold.

The envelope's pore is visibly open, with flow through a broad gap and an inner return route;
there is no compulsory missed-pore event or wait for a closed gate. Receptor adds temporary capture
and Space release, then lasting binding: the gold complex keeps the red steroid visible through
the changed-current passage and DNA stage. DNA's moving spool geometry, opposite gap, rearranged
flow, diagonal channel, and calm HRE pocket differ from the earlier straight motor route.
Recruitment presents a distinct bright timing bar followed by RNA production and a completion
screen. These are visible mechanics rather than six copies of a membrane encounter.

Current-guided travel still dominates this recording: roughly 92% of active time is free playing,
and many steps share a climb, lateral transfer, descent, and return pattern. The 40.58-second
sticky gallery, 37.26-second bound passage, and 38.50-second chromatin channel are the clearest
places to watch for fatigue. They advance through different required steps rather than replaying
an already-completed prerequisite, but a practiced controller's efficient progress cannot establish
that a student will enjoy those loops. The observed variety supports the expansion's movement
goal; repetition remains a usability concern, not a demonstrated progression defect in this run.

## Targets, returns, and recoveries

The HUD consistently states the encounter and current step. Gold target regions or contact outlines
and offscreen pointers retain the same task wording. Cyan arrows expose current direction, including
permanent descents. Captures at the ER junction, escape pocket, and opposite moving gap show both
the task direction and nearby return flow. Source-aware navigation used those fields, so this
assessment does not infer first-play discoverability merely from reaching every target.

All five destination captures show the steroid inside a recognizable vesicle, nucleus, receptor,
chromatin coil, or matching response-element ring. The locked nucleus displays `4 / 5 REQUIRED`
during crowded transfer; completed destinations display `READY - ENTER THE RING` and the HUD
changes to `Entering ...`. Receptor binding and HRE docking retain the biological sequence.
No target disappeared, became unreachable, or required hidden controls in this independent route.

There are minor presentation concerns. The moving-crowd capture has overlapping target labels near
the lower edge and a teaching message over part of them. The matching receptor has overlapping
object and pocket labels, while the bottom biological-status text overlaps the stage strip in
several captures. The HUD preserves the exact current instruction, and pointers and highlighted
surfaces remain visible; these observations do not establish an ambiguous required action, but
the overlaps deserve the presentation lane's attention.

Earlier genuine controller misses found permanent returns without dying, including the far-right
descent after missing the rebound and the descent used to approach a lower contact. They preserved
completed phases. The complete campaign similarly navigated back from upper approaches and ER
delivery through active return currents; no failure was forced to lengthen the run. The evidence
supports recoverability. It only partly supports the stronger claim that mistakes create new
opportunities: missed approaches usually repeat an unfinished target, whereas successful contacts,
delivery, and binding visibly create new flows or passages. Optional rewards and deliberately
provoked recovery routes were not assessed here; those belong to the separate recovery lane.

## Final finding and limits

Independent standard-route completion, biological ordering, frozen-artifact provenance, and
8-12-minute pacing pass. The final movement policy needed no stage-specific correction after the
successful membrane diagnostic. All prior failures remain available as controller diagnostics;
they are excluded from acceptance timing and do not become game-defect claims.

Rendered evidence supports distinct stage mechanics, identifiable destinations, readable current
tasks, and usable returns. It records local label clutter and the predominance of circulation
travel. It does not establish human first-play timing, enjoyment, comprehensive recovery behavior,
optional Up/Down behavior, or lifecycle acceptance. This report completes the independent movement
and pacing assessment, not the whole M4 milestone or remote publication.
