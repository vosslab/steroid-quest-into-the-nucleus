# Expanded recovery assessment

Status: all twelve required actual-controls recovery cases PASS in attempt 06. The campaign reaches
its ending with all 21 required encounters complete, receptor/HRE binding retained, three recruitment
actions, one deliberate marked death, and one collected fragment. Browser errors and hash drift are
both zero. The fresh visual assessor also accepts the actual reduced-motion crossfade without
scaling and with bound-complex/docking continuity. Overall M4 acceptance remains a separate review.

The deliberate run is excluded from standard campaign pacing. Optional Envelope contact attempt 05
remains an honest failed navigation diagnostic, outside the twelve required cases.

## Scope and method

The independent assessor uses actual keyboard controls and readonly canvas observations in
the served `dist/`. The temporary harness owns deliberate probes, trace, screenshots, video,
source/build/served hashes, and before/after state. Deliberate detours never contribute to the
standard 8-12 minute gate. Shared route data supplies navigation waypoints only.

The assessor read `AGENTS.md`, repository/language/Markdown rules, the current changelog,
[SOLID_MODEL.md](../../SOLID_MODEL.md), and
[longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md). Python, if needed, uses
`source source_me.sh && python3`. No production or shared-harness files belong to this assessor.

## Final built matrix

| Case | Actual observation | Evidence |
| --- | --- | --- |
| Direct destination and ceiling bypass | Required work stays incomplete; locked destination cannot commit | RETAINED PASS: accepted M2 run02, all 18 relevant final behavior/source hashes match |
| Optional cargo shortcut | Actual ride rejoins at (1902.06,554.93); required motor outlet stays phase 3 | PASS: `optional_shortcut_rejoin` |
| Marked acid death | Observed pickup then marked death then playing respawn; fragment 1, required 4/5, pending phase 5, checkpoint and opened routes retained | PASS: `marked_acid_retains_progress` |
| Missed open pore | Actual upper-wall miss (2765.36,391.64), return (2279.27,1410.62), no added death; crossing then completes | PASS: `missed_open_pore_return` |
| Sticky automatic release | Attached at 321.30, detached at 322.23 with no Space while attached | PASS: final reference02 on identical source/build hashes |
| Sticky Space escape | Actual attachment releases 0.01 seconds after Space, 0.13 seconds after contact, before 0.9-second automatic expiry | PASS: `sticky_space_escape` |
| Upper pocket return | Highest center (3096.28,20.83) returns through permanent descent to (2170.19,1407.54), no added death, three core keys | PASS: `receptor_upper_pocket_return` plus retained M2 |
| Early receptor binding | Actual trigger overlap (2375.04,1566.96); trigger inactive while gallery remains current; receptor binding stays false | PASS: `early_receptor_denied` |
| Early HRE docking | Actual active-trigger overlap (7395.07,453.45), receptor bound but DNA encounter one current; HRE stays false | PASS: `early_hre_denied` |
| Premature transport release | Actual Space release leaves phase 2 pending; Retry retains it; actual reboard/natural delivery follows | PASS: `motor_early_release_retry` plus retained M2 |
| Bound milestone Retry | Binding true, ordered matching-binding save, required count 2 persist | PASS: `bound_milestone_retry` |
| Transition pause/focus/Retry | Source stays Membrane; both pauses freeze at 0.1417; Retry cancels capture and retains four completions/save | PASS: `transition_pause_focus_retry` |
| Reduced-motion bound transition | Preference enabled at DNA entry; entry 0.1583/middle 0.5750; Transcription commitment retains receptor/HRE docking; fresh video review accepts crossfade without scaling | PASS: `reduced_motion_bound_transition` plus fresh final visual review |
| Held Space recruitment | Three-second hold credits exactly one; two distinct later presses reach three and the ending | PASS: `held_space_single_attempt` |
| Optional Envelope destination contact | Overflight prevents actual contact; no successful redirect claim | FAILED DIAGNOSTIC: attempt05; excluded by fresh M4 specification scope |

## Acceptance provenance

`test-results/expansion/recovery_06/report.json` contains all twelve case records with precise
expected/observed results and full before/after readonly datasets. `controller_trace.json` contains
2,452 keyboard/controller observations. The run preserves 150 captures, frozen harness/helper
copies, and `video/page@210c3a042f535ff5f2971839a4e3ab77.webm`. It exits zero. Its 633.35 wall seconds
and 631.96 active ending time include deliberate probes and establish no standard-route timing.

Source/build/controller hashes match before and after; served assets match built bytes:

```text
7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43  dist/main.js
beb820ad92c1ccf121848d0f37912472d934363c6e5644b44175d93769528a9e  recovery harness
dc6702edc2cd6981b4988f7a9fc0615c92d5a4d6444a2d2001432e6e6aba6d8f  campaign route helper
28581eb513b1fbd69a58c26e64b6f0f99091417c501233675256887dd39041fd  navigation helper
```

The accepted M2 behavior evidence is explicitly separate under `retainedM2Proof`; all eighteen
simulation/input/runtime/physics/progression/membrane/compiler/type paths still match accepted
M2 run02. Its direct/ceiling denial, highest-pocket backward return, and both early transport
release/Retry/reboarding proofs remain valid. The final reference02 automatic-sticky evidence has
identical hashes for every `src/` and `dist/` path compared with recovery06, and no errors/drift.

Death occurs before binding, so its milestone observations retain false values. The separate bound
Retry case establishes preservation of a true receptor milestone. Post-death actual recapture and
natural delivery verify the retained pending route remains usable. No bound-stage acid hazard is
invented, and no gameplay state or player position is injected.

Reduced frames 142-146 show before capture, entry, middle, commitment, and after. The fresh visual
assessor directly inspects the exact final captures and continuous video, accepting actual crossfade
without scaling, bound-complex/docking continuity, and readable forces. See
[EXPANSION_FINAL_VISUAL.md](EXPANSION_FINAL_VISUAL.md) for the separate rendered verdict.

## Prior diagnostic attempts

The following sections preserve the status at each earlier stop; they are historical diagnostics,
not the final acceptance status above. Fresh owners corrected temporary probe conditions and routes;
no production change was needed for these assessment failures.

## Recovery attempt 02

The final artifact used `dist/main.js` SHA-256
`7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43`.
Source, build, and controller hashes match before/after with no drift; served assets match build
bytes. The readonly dataset is never written. Gameplay uses only Left, Right, and Space, with
Escape, Tab, Retry, and menu buttons for lifecycle probes.

| Case | Result | Actual observation |
| --- | --- | --- |
| Transition pause/focus/Retry | PASS | Capture freezes at 0.1250 seconds through both pauses; Retry clears capture and retains all four membrane completions/save |
| Motor early release/Retry | PASS | Space detaches while delivery remains phase 2; Retry retains pending phase and checkpoint; actual recapture/natural delivery follows |
| Optional cargo shortcut | PASS | Actual shortcut ride rejoins at (1904.10,549.91); required motor outlet remains phase 3, with no completion credit |
| Membrane bypass/backward/reboarding | RETAINED PASS | Accepted run02 behavior evidence; all 18 relevant core/membrane/compiler/type hashes still match |
| ER junction navigation | DIAGNOSTIC FAIL | Target (5760,360) stalls above contact at center (5756.18,182.10), zero velocity/no attachment, ER phase 3 pending |
| Remaining recovery cases | PENDING | Envelope, Receptor, DNA, acid death, and Transcription are not reached in this attempt |

The ER result is a controller-route failure, not evidence that gameplay is physically trapped.
A permanent descent exists and was not attempted before the navigation deadline. The manager
released shared helper ownership for correction after this attempt stopped. No production files
changed in this assessment. The run took 209.79 wall seconds and ended at 208.47 active seconds;
these deliberate timings do not contribute to the standard pacing gate.

Evidence is preserved under `test-results/expansion/recovery_02`: `report.json`,
`controller_trace.json` (745 samples), 46 captures, frozen harness copies, and
`video/page@05a075907f4870a4d77c26ea06b8bfe1.webm`. Capture 045 records the failed ER state.
The initial default-sandbox browser launch failed before gameplay; approved unsandboxed Chromium
starts successfully. Attempt 01 is discarded partial evidence because the manager's added
reduced-motion transition request required a new frozen harness; attempt 02 supersedes it.

The pending reduced-motion case will record final DNA transition entry/middle/commit frames,
retain receptor/HRE docking, and supply presentation evidence to the fresh visual assessor.

## Recovery attempt 03

The helper correction is actual-browser confirmed: its permanent right descent reaches the ER
junction and both subsequent required captures/deliveries. The build/source stay unchanged.
The same three deliberate cases pass. All five Cytoplasm encounters complete naturally.

The acid probe was scheduled after final completion, and natural release plus the ready nucleus
approach captured the player before the backward detour. This is valid destination behavior and
a probe scheduling failure, not an acid/death failure. Evidence is preserved under
`test-results/expansion/recovery_03` with no hash drift. The manager approved moving the acid
probe to `crowded_transfer:crowd_deflection`: four completed encounters, current phase 4, and the
opened lower return. Attempt 04 is now running that corrected probe against the same artifact.

## Recovery attempt 04

The rescheduled acid detour reaches the optional fragment before final delivery. The probe stops
on geometric arrival before the next collection frame, then asserts too early. Its preserved
failure capture already shows `collected: 1`, compared with zero before the probe, with no death.
The player center is (8864.17,1654.81), and four encounters remain completed. The current encounter
naturally advances from phase 4 to phase 5 while passing its second bay during the detour.

This is an observation-condition race in the temporary probe. It establishes neither acid death
nor a collection defect. The manager stopped further assessor edits and assigned a fresh bounded
corrector. The correction will require observed collection and an actual playing respawn after
marked death before retention assertions. Attempt 04 remains immutable under
`test-results/expansion/recovery_04`; remaining stage and reduced-motion cases remain pending.

## Recovery attempt 05

Fresh correctors changed only the temporary harness: collection waits for observed count, death
waits for actual playing respawn, the locked-destination probe waits for an observed inward
approach followed by outward redirect, and DNA enables reduced motion before its early HRE probe.
The artifact and shared route remain frozen. The complete attempted run has no source/build/
controller drift.

Five deliberate cases pass. Marked Cytoplasm acid death now observes a collected fragment before
contact and a playing checkpoint respawn afterward: fragment count 1, four completed encounters,
pending crowded phase 5, no attachment, and the countercurrent completion save all remain.
The subsequent actual second-vesicle capture and natural delivery complete Cytoplasm normally.

The missed-pore case observes the actual upper-envelope bounce at (2769.09,392.28), followed by
the permanent outside return at (2271.18,1402.42) with no additional death. The normal pending
mouth and pore crossing then complete, including their immediate checkpoint save.

The additional early Envelope destination probe overflies its target and settles at
(5454.63,212.91), above the (5445,350) destination, with no vertical force. Required progress stays
locked at two of three, but no actual locked-destination redirect is established. This is another
temporary navigation-route failure. Its nearby permanent right descent at x=5530 provides the
candidate correction. Receptor, DNA, reduced transition, and held-Space cases remain unexecuted.

Attempt 05 preserves 79 captures, report, trace, video, and frozen harness under
`test-results/expansion/recovery_05`; it takes 340.58 wall seconds and has zero hash drift.
The assessor makes no further harness edits pending the manager's fresh correction workflow.

The fresh M4 specification review classifies the additional Envelope destination contact as an
optional diagnostic, rather than a required per-stage contact gate. Attempt 05 remains failed
diagnostic evidence, and no contact success is claimed. Final coverage consists of twelve required
cases plus this optional failed diagnostic. A fresh worker will remove its blocking execution and
preflight the remaining biological/sticky/pocket routes before attempt 06. An independent full
reduced-motion walkthrough supplies complementary transition evidence on the same artifact.
