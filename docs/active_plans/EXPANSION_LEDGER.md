# Expansion ledger

This ledger tracks execution of [longer_cellular_journeys.md](../archive/longer_cellular_journeys.md).
The manager routes decisions and assigns fresh agents for implementation, correction, review, and
acceptance. All gates use independent agent assessments or automated behavior tests; no milestone
depends on human availability.

| Milestone | Status | Dependency | Evidence |
| --- | --- | --- | --- |
| M1: Movement and authoring foundation | Complete; accepted | None | Fresh specification review and separate quality review both ACCEPT. D10 named-step correction is implemented and verified. Manager integration: 31 Node tests, types, lint, and format pass; build and two browser smokes pass. First-contact Right-key input: 2.8 simulation seconds / 3.06 wall seconds; screenshot: `test-results/expansion/m1/first_contact.png`. |
| M2: Complete membrane expansion | Complete; accepted | M1 accepted | Fresh `expansion_m2_respec`, zoom `expansion_zoom_spec`, and `expansion_zoom_quality` ACCEPT. Actual-key reference runs 02 and 03 pass behavior and membrane pacing; run 03 closes corrected zoom presentation. See [EXPANSION_WALKTHROUGH.md](reports/EXPANSION_WALKTHROUGH.md). |
| M3: Expand the campaign | Complete; accepted | M2 accepted | Frozen Cytoplasm 5, Envelope 3, Receptor 4, and DNA 5 (membrane 4) modules. Fresh cell/nucleus source specification reviews and final `expansion_m3_quality` ACCEPT: actual all-stage completion, all 21 immediate saves, legal shortcut rejoin, and rendered sticky contact/escape. |
| M4: Autonomous acceptance | Complete; accepted | M3 accepted | Independent full campaign passes in 579.57 active seconds; reference 02 passes in 525.96 since Start / 525.02 net. Both meet 480-720 seconds with all six stages/21 required encounters and zero deaths/errors/drift. Recovery 06 passes all 12 required cases; final visual PASS. Final Python passes 1,139; diff clean. Fresh M4 specification, separate quality, and final integration ACCEPT. See [EXPANSION_ACCEPTANCE.md](reports/EXPANSION_ACCEPTANCE.md). |

## Readiness map

1. Settle shared contracts first.
2. Implement isolated simulation and chamber compiler work.
3. Build the membrane route and destination presentation.
4. Expand the other stages against the proven contracts.
5. Run autonomous acceptance and correct findings to closure.

Use gpt-6.1-sol for complex implementation and contract work. Use gpt-6-luna for bounded
documentation work. The manager owns integration and routes design decisions to affected agents.

## M1 ownership and decisions

M1 is accepted by fresh specification and quality reviews. The original specification review found
one D10 gap; `expansion_named_steps_fix` implemented that correction, and the owners restated the
resulting contract. A fresh specification review (`expansion_m1_respec`) and separate quality review
(`expansion_m1_quality`) both ACCEPT. The quality reviewer independently reran all 31 Node tests.
Canonical manager integration passed 31 Node tests, types, lint, and format; the build and two browser
smokes passed. Actual first-contact Right-key input took 2.8 simulation seconds and 3.06 wall seconds.
The screenshot is `test-results/expansion/m1/first_contact.png`. These results close M1; they do not
prove the expanded campaign or its 8-12 minute pacing.

| Owner | Scope | Status |
| --- | --- | --- |
| `expansion_core` | Input, constants, state, simulation, runtime, progression, and focused tests | Implemented and tested; D8 owner restatement received |
| `expansion_compiler` | Local recipe compiler, current-level migration, and focused tests | Implemented and verified; D10 correction accepted |
| `expansion_presentation` | Renderer, art, app, audio, and style | Implemented and included in accepted M1 integration |

Decision propagation records the owner restatements received so far. A pending row is not treated as
verified or implemented.

| Decision | Settled direction | Owner restatement |
| --- | --- | --- |
| D1 | Keep the current `Readonly<SimulationState>` wrapper; do not migrate to a broad `SimulationView`. | Contract owner confirmed |
| D2 | Completion checkpoints are authoritative; optional markers do not complete encounters. | Contract owner confirmed |
| D3 | Use local coordinates, stable IDs, and simple types. | Contract owner confirmed |
| D4 | Keep the source level active until one transition commit; `nextLevel` is a readonly preview. | Contract owner confirmed |
| D5 | Optional saves are markers allowed only before the first required completion; generated required saves rank 1 through n. | Core and compiler confirmed |
| D6 | Overlapping chamber extents are allowed during the mechanical M1 migration and must remain truthfully bounded. | Compiler confirmed |
| D7 | Keep source HUD until commit; compass direction is not solid-safe straight-line navigation. | Presentation confirmed |
| D8 | Bind the initial biological milestone only when the matching required step is current; preserve existing flags and transcription. | Core restated, implemented, and tested with an early-biology guard |
| D9 | M2 may use two named rebound contacts if each visibly changes force or passage; do not impose an arbitrary touch order. | Released after M1 acceptance; M2 author restated |
| D10 | Add stable `EncounterStep.id` unique per encounter and named `phaseAfter`/`phaseBefore` references (`sequence`, `stepId`); retain numeric runtime phases. | `expansion_named_steps_fix` implemented the correction; compiler owner restated it; fresh M1 specification and quality reviews ACCEPT |
| D11 | For pending transport delivery, show a detached player the capture/reboard cue; show the endpoint only to a rider attached to that transport. | Presentation owner applied the shared `currentAction` derivation to the HUD and renderer callers; four focused tests pass; fresh M2 review accepts |
| D12 | Keep destination zoom framing in the camera projection with screen-anchor interpolation. | Presentation owner corrected `camera.ts`; two focused tests pass; fresh zoom specification and quality reviews ACCEPT |
| D13 | Treat the transcription 10-20 second allocation as planning guidance, not a minimum. Preserve its forgiving three Space actions and short existing finale; an independent run may finish in about five seconds. Do not add forced waiting or slow the finale. The hard pacing gate is that both complete-campaign reference and independent actual-controls runs take 480-720 active seconds. | Settled; applies to M4 pacing review |

## M2 design boundary

D9 is released for M2. M2 authors may use two named rebound contacts when each changes visible force
or passage, without requiring an arbitrary contact order.

## M2 acceptance

M2 is accepted after fresh `expansion_m2_respec` and, following the camera correction, fresh
`expansion_zoom_spec` and `expansion_zoom_quality`; all three verdicts ACCEPT. In run 02, the
standard actual-key membrane route completed all four required encounters in 104.55 active seconds,
with zero deaths and no denied locked-roof exits (0/4). The route exercised highest-pocket backward
return and early release from both cargo and channel transports, followed by Retry, retained phase,
reboarding, and natural delivery. Retry retained all four completions. Its raw `pacingWithinTarget`
is false because it compares the membrane prefix with the full-campaign 480-720 second range; the
measured 104.55 seconds meets the membrane target of 80-115 seconds. The frozen run-02 prefix
metadata reports `pacingWithinTarget=false`, so it is not full-campaign pacing evidence.

The initial reboard cue defect was corrected in `journey_presentation`, HUD, and renderer; four
focused tests pass. Run 02 also exposed destination clipping during zoom. The camera-only correction
uses screen-anchor interpolation and has two focused tests. Run 03, with that correction, completes
in 104.02 active seconds, within the membrane target, with explicit cytoplasm commit and cleared
transition, encounter phases 6/6/6/5, and no errors, deaths, drift, or extra animation frame. Review
of 32 video frames confirms the destination/steroid remains visible through zoom and blend. Between
runs 02 and 03, only `camera.ts` and renderer changed; simulation and content match, preserving run
02's independent recovery evidence. Evidence and the historical clipping assessment are linked in
[EXPANSION_WALKTHROUGH.md](reports/EXPANSION_WALKTHROUGH.md),
[EXPANSION_MEMBRANE.md](reports/EXPANSION_MEMBRANE.md), and
[EXPANSION_PRESENTATION_ASSESSMENT.md](reports/EXPANSION_PRESENTATION_ASSESSMENT.md); captures and
reports are under `test-results/expansion/m2_reference_02`, `m2_reference_03`, and `zoom_quality`.
At M2 close, 37 Node tests pass and full M4 gates remain open; the accepted M4 evidence below
supersedes that intermediate status.

## M3 integration status

The authored Cytoplasm 5, Envelope 3, Receptor 4, and DNA 5 modules (membrane 4) are integrated
and frozen at `dist/main.js` SHA-256
`7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43`, with build signature
`802e4c3244bfc2e06df0785d2049f49be13866651fd64ff367a7e41db93f4470`. Typed wrappers were removed,
deleting 464 obsolete lines. Canonical checks pass: 38 Node tests, types, lint, and format; build and
two Playwright smokes pass; 1,136 Python tests pass; `git diff --check` is clean. The generated
artifact ESLint ignore was narrowly corrected by a fresh agent.

Fresh `expansion_m3_cell_spec` and `expansion_m3_nucleus_spec` return SOURCE ACCEPT. Fresh
`expansion_m3_quality` final verdict is ACCEPT. It verifies the independent actual-controls
all-stage route and all 21 immediate completion saves, recovery 02's legal optional shortcut
rejoin without required credit, and recorded sticky contact/Space escape with visible halo, HUD,
and changed current. M3 is accepted. Source timing samples remain separate: Cytoplasm 116.825,
Envelope 78.5083, Receptor 91.175, and DNA 119.033 seconds are development measurements, not
browser walkthrough or full-campaign pacing evidence.

## M4 current evidence and decision

The independent actual-controls run completes all six stages and 21 required encounters in
579.57 active seconds (9:39.57), with zero deaths, report/capture errors, or source/build/controller
drift. Its 117 captures, video, raw summary, and provenance live under
`test-results/expansion/independent_2026_10_09T17_51_00_905Z/`. See
[EXPANSION_INDEPENDENT.md](reports/EXPANSION_INDEPENDENT.md).

Reference 01 and recovery 02 reproduce an ER-junction overflight caused by the controller approach.
The fresh route-helper correction uses the existing permanent physical descent without changing
production source. Preserve both immutable failed diagnostics; their timings do not establish
standard pacing. Reference 02 completes in 525.96 elapsed seconds since Start and 525.02 net active
seconds after 0.94 seconds of unpaused Start preflight. Both reference values and the independent
579.57 seconds meet the full 480-720 second gate. The reference records all 21 required phases,
three recruitment actions, five explicit stage commitments, and zero deaths/errors/drift. Its
Replay/audio/optional-arrow/reduced-narrow tail probes pass. Recovery 06 passes all 12 required
cases after controller/probe-only corrections, preserving marked-death progress, biological ordering,
three-key returns, and reduced-motion bound continuity. Its 633.35-second deliberate-probe wall
interval is excluded from standard pacing. Final rendered assessment is PASS for all five normal
transitions, authentic reduced-motion DNA crossfade/bound continuity, changing action/return cues,
and planned narrow title/pause access. Supplementary reduced 02 passes all five transitions and the
full campaign with no errors/drift. Substantive documentation and local delivery are complete;
fresh M4 specification/quality verdicts and final integration all ACCEPT. Durable final
codebase/build/two-browser-smoke logs pass
under `test-results/expansion/final_gates/`; the rebuild receipt preserves the exact frozen artifact.
Fresh final Python after plan archiving passes 1,139 checks in 1.69 seconds; diff check
exits zero. `python_hygiene_post_archive.log` and `git_diff_check_post_archive.log` are retained in
that directory. The five canonical docs pass 16 focused
checks. Fresh M4 specification review unconditionally ACCEPTS all planned behavior, pacing,
recovery, visual/lifecycle, documentation, and local delivery, with no blocker or architecture
drift. Separate fresh `expansion_m4_quality` ACCEPTS, independently verifying 43 source/build inputs,
five dist hashes, live HTTP 200 assets, and archived probes with no blocker or architecture drift.
Fresh read-only `expansion_final_integration` ACCEPTS, independently verifying 43 source/build
inputs, five dist hashes, two independent controller hashes, all five live HTTP 200 assets, 12
required recovery cases, 18 retained M2 hashes, all nine archived temporary sources, empty
`tests/_temp/`, and clean diff. No blocker or architecture drift remains. M1-M4 are complete.
The approved plan is archived unchanged at
[longer_cellular_journeys.md](../archive/longer_cellular_journeys.md); 11 current references are
updated, the former active path is absent, and the Git index is untouched. Archive/link cleanup
passes 262 link/ASCII checks. Final source/build/preview remain unchanged. Closure housekeeping is
complete; no acceptance gate remains open.
[EXPANSION_ACCEPTANCE.md](reports/EXPANSION_ACCEPTANCE.md) tracks the aggregate gates.

D13 settles the transcription allocation: 10-20 seconds is a planning allocation, not a required
minimum. Preserve the forgiving three-action transcription sequence and short existing finale;
an independent run may finish it in approximately five seconds. No forced waiting or slowdown is
required. The hard pacing gate remains both complete actual-controls campaign runs (reference and
independent) finishing within 480-720 active seconds. Reference timing reports both ending elapsed
since Start and its net standard interval, identifying any actual traversal during unpaused Start
preflight. The plan has no human dependencies; no human
playtest, response, approval, or availability is an acceptance gate.

## M3 authoring contract

M3 was released to the authors `expansion_cytoplasm`, `expansion_envelope`,
`expansion_receptor`, and `expansion_dna`, with exclusive ownership of their new stage files. Their
standard-route targets are respectively 110-155, 75-110, 90-130, and 115-165 seconds. Envelope pore
crossing saves immediately; receptor binding saves immediately. Optional shortcuts must save legal
travel while leaving required ride completion uncredited. Both full routes meet the 8-12 minute
gate; fresh specification, quality, and final integration accept the complete M4 exit.
