# Expansion reference walkthrough

## Scope and method

This is the repeatable reference controller for
[longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md), initially covering M2.
It is authored acceptance evidence, not the independent assessment or a human playtest.

The current full-campaign run passes: all 21 required encounters and five stage transitions
complete, with zero deaths, runtime errors, or source/build/served/harness drift. It ends in
`transcription/ended` after 525.96 active seconds (525.02 seconds net of the 0.94-second audio
preflight), within the 480-720 second pacing gate. See [M4 reference acceptance](#m4-reference-acceptance)
for the timing breakdown and provenance. This reference result does not close the separately owned
recovery assessment.

The controller serves the built artifact over HTTP and uses actual keyboard input. Required
movement uses Left, Right, and Space. Named source encounter steps guide approaches; only the
runtime's read-only canvas observations determine completion. It never injects player position,
progress, or simulation state. Menus use their accessible visible buttons.

The report records source/build SHA-256 hashes before and after each run and checks that all
served assets match the local `dist/` bytes. Production source is frozen by the manager during
the evidence window. Controller traces record the action goal, actual held keys, tap pulses,
coasting, automatic rides, observed position/velocity, and active simulation time.

The historical `--membrane-prefix` mode stops standard timing at the membrane's next-stage
commitment; it applies only to the earlier M2 prefix runs documented below. The current full-campaign
run times through the transcription ending. Recovery probes use a subsequent fresh Start and are
excluded from standard timing. Normal traversal uses immediate steering,
opposing-input braking, upward tap correction, authored downward streams, and natural transport
delivery. Polling samples observations; it does not add waits to meet a duration target.

The existing observer measures real synthesized AudioContext output/RMS and pending animation
frames. The walkthrough checks pause/focus silence, frozen pause time, one animation loop, and
stable canvas identity through stage commitment.

## M2 execution

```sh
node --import tsx tests/playwright/campaign_walkthrough.mjs \
  http://127.0.0.1:8374 test-results/expansion/m2_reference_02 --membrane-prefix
```

Chromium runs with the authorized macOS sandbox escalation. The manager owns rebuilding and
serving `dist/` through the canonical scripts.

- Run 01: source hashes stayed unchanged. The controller incorrectly kept Space off after
  descending into the arrival exit, then drifted below its region. The author confirmed that
  ordinary tap correction must resume after the descent segment. This was a reference-controller
  mistake; the run is failed evidence under `test-results/expansion/m2_reference_01/`.
- Run 02: PASS, exit 0. Standard prefix completes in **104.55 active seconds**, within the M2
  **80-115 second target**, with no deaths. All four encounters complete and the biological
  destination commits once to the cytoplasm. Ancillary recovery also passes.

Presentation review subsequently identifies destination clipping during the zoom. The manager
assigns a separate projection correction, followed by run 03 below. Run 02 supplies behavior,
pacing, and recovery evidence; its initial projection does not close the presentation gate.

| Required encounter | Active seconds |
| --- | ---: |
| Bilayer/outlet | 25.65 |
| Backward sweep/arrival | 26.83 |
| Linked loops | 29.42 |
| Channel delivery | 20.23 |

The remaining standard time includes the initial capture and destination approach/transition.
Recovery results are separate:

- Ceiling travel reaches the locked destination with zero required completions. Contact redirects
  the steroid and preserves the membrane stage.
- Retry retains the first completed encounter and its calm checkpoint. Held Space reaches the
  highest pocket at player y=3.69; three-key steering then returns through the backward sweep.
- Premature vesicle release preserves pending phase 3. Retry preserves that phase and the prior
  completion/checkpoint. The revised "Reboard the marked ride for delivery" HUD and compass are
  visible in capture 39; actual reboarding and natural delivery succeed.
- Premature channel release preserves pending phase 4. Retry preserves that phase and the prior
  completion/checkpoint. The same reboard guidance is visible in capture 56; actual reboarding and
  natural delivery succeed.
- Retry after all four completions preserves all completed phases, the final calm checkpoint,
  and the activated destination (capture 59).

`test-results/expansion/m2_reference_02/` contains the immutable `report.json`,
`controller_trace.json`, 60 numbered captures, a WebM recording, and exact copies of the three
harness/helper files under `harness/`. Before/after source hashes match (`sourceDrift: []`), served
assets match `dist/`, and errors are empty. Main bundle SHA-256:

```text
aaa259ed2d8abe8154749b947c30d809db9dd99536a0cf08a985d4fa3c862ac5
```

The raw run-02 `pacingWithinTarget` field is **false because it incorrectly compares this prefix
against the full-campaign 480-720 second target**. It does not classify M2 pacing correctly.
The report is preserved unchanged; the measured 104.55 seconds passes the actual 80-115 second
M2 allocation. The next harness revision uses a mode-specific target.

Run 02 awaits the read-only stage change before recording its stage end at elapsed 105.50
(snapshot `harness/campaign_walkthrough.mjs`, lines 285-286). Its matched commitment observation
was not saved in the trace. The next revision records and captures that matched state explicitly.
The unchanged raw timing includes the full one-second transition; it does not stop at zoom start.

## Corrected zoom verification

Run 03 executes the corrected frozen projection artifact:

```sh
node --import tsx tests/playwright/campaign_walkthrough.mjs \
  http://127.0.0.1:8374 test-results/expansion/m2_reference_03 \
  --membrane-prefix --standard-only
```

It passes in **104.02 active seconds** against the explicit 80-115 second target. All four required
encounters complete with no deaths. The matched stage-commit observation records cytoplasm in
the playing phase at elapsed 104.88, with transition fields cleared. The committed screenshot
records elapsed 105.00, and the run ends in cytoplasm. The trace now saves the exact matching
commit state; the raw report's mode-specific `pacingWithinTarget` is true.

`test-results/expansion/m2_reference_03/` contains 28 numbered captures, WebM video, report,
controller trace, and exact harness snapshots. Errors and source drift are empty; served hashes
match the built bytes. The zoom capture occurs at wall 105.271 seconds and the committed capture
at wall 106.284 seconds. Main bundle SHA-256:

```text
8c248239f0549fa2bcc67ce855d11bd8afed8d929693f646c1242c89e4981546
```

The fresh zoom QUALITY reviewer accepted all 32 recorded transition frames, including full zoom,
blend, and committed cytoplasm; the destination and steroid remain inside the canvas. The earlier
run-02 recovery evidence is
retained for unchanged simulation/content; this standard-only run repeats no ancillary probes.

Real audio is audible after Start and silent during pause/focus loss. Pause freezes elapsed time.
The standard and final observers each report one pending frame and maximum one frame. Canvas
identity survives the standard destination transition. This does not establish subjective sound
quality or human enjoyment.

## Focused harness checks

Prettier, ESLint, Node syntax checks, and `git diff --check` passed for the owned browser files.
These checks do not replace the manager's canonical integration gates or rendered acceptance.

## First integrated reference attempt

The manager releases the frozen integrated artifact with main bundle SHA-256
`7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43`.
The following attempt exits 1 and remains immutable failed evidence:

```sh
node --import tsx tests/playwright/campaign_walkthrough.mjs \
  http://127.0.0.1:8374 test-results/expansion/reference_01
```

All four membrane encounters commit to cytoplasm, and the motor and mitochondrial encounters
complete there. After the first ER fold's natural delivery, pending `junction_contact` begins at
WORLD center (5546.27,303.19) with vertical velocity -195.04. Aiming directly at (5760,360) lets
that upward momentum carry the steroid above the circle and horizontal approach field. It settles
at (5766.52,182.10), without attachment or velocity; phase 3 remains pending until the 35-second
controller timeout. Final elapsed time is 198.13, with zero deaths, no errors beyond this timeout,
and no source/harness/build drift. No full campaign pacing result is established.

`test-results/expansion/reference_01/` preserves 41 captures, recording, report, controller trace,
and exact harness snapshots. Capture `40_failure.png` shows the steroid above the ER junction and
a visible permanent countercurrent descent on the right. The separate recovery attempt reproduces
the same pending junction stall. The manager assigns a fresh route-helper correction owner; this
reference agent supplies the reproduction and waits without editing the frozen controllers.

## M4 reference acceptance

The corrected frozen helper is exercised against the same integrated build:

```sh
node --import tsx tests/playwright/campaign_walkthrough.mjs \
  http://127.0.0.1:8374 test-results/expansion/reference_02
```

The command passes, exit 0. All six stages finish, all 21 required encounter phases remain complete,
receptor binding and HRE docking are retained, and exactly three fresh Space presses recruit the
machinery. The final standard state is `transcription/ended`, with zero deaths. Errors and source,
build, served, and harness drift are empty. Every transition has a matched committed-stage state
with cleared transition fields, a screenshot, and video evidence; canvas identity survives all five.

Two pacing measurements are reported explicitly:

- **525.96 active seconds (8:45.96)** from the actual Start action through ending. Simulation elapsed
  excludes pauses and menus; it includes the deliberate active audio preflight.
- **525.02 active seconds (8:45.02)** from `standardStart=0.94` through `standardEnd=525.96`.
  Both measures independently pass the manager's **480-720 second gate**.

The 0.94-second active preflight measures real audio, then verifies pause/focus silence and frozen
elapsed. It already observes the immediate inlet region as membrane phase 1, while the player stays
at top-left (36,1510), velocity zero, checkpoint start, zero required completions and no fragments.
No steering traversal occurs before the net timer. The first `membrane_start` screenshot is at
elapsed 1.05 because capture continues after timer start. This preflight is disclosed separately;
it is not described as menu time or hidden traversal. The whole standard run includes all ordinary
transport cycles, necessary physical returns, transitions, recruitment, and the four-second mandatory
expression scene. Replay and deliberate lifecycle checks begin after the standard end.

Stage intervals below use the matched prior commitment as each next stage's boundary. Therefore
all boundary captures are included once; transcription runs from the actual DNA commitment through
ending. The intervals sum to 525.02 seconds.

| Stage | Active start | Active end | Seconds |
| --- | ---: | ---: | ---: |
| membrane | 0.94 | 104.36 | 103.42 |
| cytoplasm | 104.36 | 224.13 | 119.77 |
| envelope | 224.13 | 304.22 | 80.09 |
| receptor | 304.22 | 397.85 | 93.63 |
| dna | 397.85 | 521.19 | 123.34 |
| transcription | 521.19 | 525.96 | 4.77 |

Per-encounter durations include ordinary navigation, captures, and the authored physical return.
Destination approaches and transitions account for the remaining stage time.

| Required encounter | Seconds |
| --- | ---: |
| `membrane-bilayer_outlet` | 25.71 |
| `membrane-backward_arrival` | 26.80 |
| `membrane-linked_loops` | 28.43 |
| `membrane-channel_delivery` | 20.09 |
| `cytoplasm-motor_delivery` | 26.17 |
| `cytoplasm-mitochondrial_rebound` | 22.65 |
| `cytoplasm-er_transfer` | 23.76 |
| `cytoplasm-countercurrent_relay` | 23.32 |
| `cytoplasm-crowded_transfer` | 21.78 |
| `envelope-circulation_approach` | 26.00 |
| `envelope-open_pore_crossing` | 20.38 |
| `envelope-inner_return_loop` | 32.00 |
| `receptor-sticky_gallery` | 31.53 |
| `receptor-matching_binding` | 16.55 |
| `receptor-changed_passage` | 26.60 |
| `receptor-bound_transfer` | 16.12 |
| `dna-nucleosome_loop` | 23.89 |
| `dna-moving_passage` | 27.98 |
| `dna-flow_rearrangement` | 29.76 |
| `dna-chromatin_channel` | 24.70 |
| `dna-hre_docking` | 15.52 |

## Activity audit and lifecycle evidence

`trace_audit.json` is a derived artifact; raw `report.json` and `controller_trace.json` remain
unchanged. It examines 2091 standard trace records. The only observed standard gameplay inputs are
ArrowLeft, ArrowRight, and Space. The trace records 910 steering samples, 115 pulse samples,
66 automatic-ride samples, 760 coast samples, and explicit action goals and route targets.
Coasting includes moving through currents and slowing momentum, not a stationary timer delay.

The sampled stationary/no-input segments longer than one second are:

| Goal | Active interval | Explanation |
| --- | --- | --- |
| Required motor capture | 116.29-117.54 (1.25s) | Wait in the calm boarding pocket for actual moving motor cargo to arrive; capture follows at 117.63 |
| Automatic expression scene | 522.09-524.16 (2.07s) | Three recruitment presses already completed; capture occurs within the simulation's mandatory expression interval |
| Expression finale | 524.16-525.69 (1.53s) | Same mandatory scene finishes normally; ending screenshot records 525.96 |

No stationary control-padding segment is found. The corrected ER junction route physically enters
the visible permanent countercurrent descent at x6210 before returning to the contact. It contains
no timeout or deliberate failure. The standard uses no optional shortcut or Up/Down input. Sample
mode-duration estimates are approximate between observations; the raw trace and video provide the
full evidence. The failed reference attempt's 35-second stall is excluded from acceptance.

Automatic receptor sticky release is captured attached at elapsed 321.30 and released at 322.23,
without Space while attached. Receptor binding saves at 352.50. HRE docking is observed at 519.92.
Fresh recruitment counts 1, 2, and 3 are captured at 521.77, 521.94, and 522.09. The mid-expression
RNA/machinery capture is at 523.94; the expression scene's duration is unchanged.

Real audio is measured after Start. Pause and focus loss silence it and freeze elapsed. Sound is
muted during the mandatory expression scene before ending; Replay resets phases, binding, HRE,
recruitment, and fragments while retaining that choice and the same canvas. Optional Up and Down
inputs produce opposing vertical movement after Replay, outside standard timing. A separate reload
at 390 by 844 with reduced motion exercises prestart mute (zero AudioContexts), Start, movement,
checkpoint retry, pause/resume, sound enable (one real context), and retained canvas focus. Both
standard and final observers report one pending animation frame and maximum one frame. Narrow
Start, Resume, and Retry remain operable; no horizontal page overflow is observed. Reduced-motion destination-transition evidence is separately
owned by the recovery assessor; this reference lane establishes narrow lifecycle and active forces.

## Final provenance and remaining ownership

`test-results/expansion/reference_02/` contains 138 numbered PNGs, `report.json`, raw controller
trace, derived activity audit, post-run served-hash verification,
`video/page@7f6621e9e6344a2bd33077fcb9ba29fa.webm`, and exact copies of
all four browser harness/helper files under `harness/`. Final bundle SHA-256:

```text
7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43
```

Corrected route helper SHA-256:

```text
dc6702edc2cd6981b4988f7a9fc0615c92d5a4d6444a2d2001432e6e6aba6d8f
```

Full source and built asset hashes are saved before and after; they match. Served assets match
before launch and in the separately saved `postrun_served_hashes.json` after completion. Every
harness snapshot digest is also verified against its raw run fingerprint. The reference
controller and its observation/navigation helpers are likewise unchanged during the run. No build,
source correction, state injection, or index change is performed by this agent.

The separate recovery assessor owns deliberate shortcut, acid-death, missed-pore, manual sticky
escape, upper-pocket, early biological-target, transition pause/focus/retry, held-Space recruitment,
and detached-delivery cases. The independent standard pacing controller uses a distinct policy.
Those assessments and final rendered/specification review remain separately owned; this result
is reference-agent acceptance, not independent acceptance or human play.
