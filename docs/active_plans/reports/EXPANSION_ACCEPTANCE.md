# Expansion acceptance

## Status and authority

ACCEPT. M1-M4 are complete. Both full standard routes pass pacing, all required recovery cases
pass, and final visual assessment is PASS. Fresh M4 specification, separate quality, and final
integration reviews ACCEPT. Final Python/diff checks pass after documentation, temporary-probe
cleanup, and plan archiving. Documentation, local delivery, and closure housekeeping are complete.
No acceptance gate remains open.

The approved [longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md) supplies the gates;
[EXPANSION_LEDGER.md](../EXPANSION_LEDGER.md) records milestone decisions. All acceptance uses
automated checks and fresh agent assessments. There is no human-availability gate.

## Frozen artifact

The evaluated local artifact has these SHA-256 identities:

| Identity | SHA-256 |
| --- | --- |
| Build signature | `802e4c3244bfc2e06df0785d2049f49be13866651fd64ff367a7e41db93f4470` |
| `dist/main.js` | `7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43` |
| Independent source signature | `18e549c7f4633656939f1c7b9f04645257a73f6dcd0427a04c880e43140db0b0` |

Independent and reference before/after source, build, and controller identities match. Reference
served bytes match the build. Recovery 06 source/build/controller hashes also match before/after,
with no drift. Fresh final integration accepts this cross-report provenance, independently checking
43 source/build inputs, five dist hashes, both independent controller hashes, and live HTTP 200
for all five served assets without blocker or architecture drift.
`test-results/expansion/final_gates/served_artifact.json` verifies every current source/build hash
against final independent provenance and confirms HTTP 200 served assets at port 8374.
Ignored captures, recordings, and raw reports below are local evidence paths, not GitHub links.

## Gate and evidence matrix

| Gate | Status | Evidence |
| --- | --- | --- |
| M1 shared contracts | ACCEPT | Fresh specification/quality assessments; 31 Node checks and built smokes. See ledger. |
| M2 membrane behavior and presentation | ACCEPT | Three-key route, bypass/reboarding/retry evidence, corrected zoom; [EXPANSION_WALKTHROUGH.md](EXPANSION_WALKTHROUGH.md). |
| M3 cell and nucleus specification | SOURCE ACCEPT | Fresh `expansion_m3_cell_spec` and `expansion_m3_nucleus_spec`; integrated composition in [EXPANSION_CAMPAIGN_INTEGRATION.md](EXPANSION_CAMPAIGN_INTEGRATION.md). |
| M3 final quality | ACCEPT | Fresh `expansion_m3_quality`: independent all-stage completion and all 21 immediate saves; legal shortcut in recovery 02; rendered sticky contact/escape. |
| Complete independent standard route | PASS | 579.57 active seconds; all six stages and 21 required encounters, three movement keys, zero deaths/errors/drift. [EXPANSION_INDEPENDENT.md](EXPANSION_INDEPENDENT.md). |
| Complete reference standard route | PASS | Reference 02: 525.96 elapsed since Start, 525.02 net active seconds; all 21 required completions, three recruitment actions, zero deaths/errors/drift. [EXPANSION_WALKTHROUGH.md](EXPANSION_WALKTHROUGH.md). |
| Both complete runs take 480-720 seconds | PASS | Independent 579.57; reference gross 525.96 and net 525.02 seconds. Reconciled stage/trace audit identifies no padding. |
| No required progress bypass | PASS | Accepted actual membrane direct/ceiling denial retains 18 unchanged relevant hashes; final actual shortcut/early release/early Receptor/HRE checks pass. [EXPANSION_RECOVERY.md](EXPANSION_RECOVERY.md). |
| Recoveries and retained progress | PASS 12 of 12 required cases | Recovery 06 completes transition pause/focus/Retry, reboarding, shortcut, marked death, missed pore, sticky escape, upper-pocket return, bound-save Retry, early biological targets, reduced bound transition, and held-Space checks. |
| Five normal transitions and continuity | PASS | Reference records five explicit commitments; fresh [EXPANSION_FINAL_VISUAL.md](EXPANSION_FINAL_VISUAL.md) accepts all five normal zoom/blend strips with visible targets and bound-complex continuity. |
| Reduced motion, audio, focus, canvas/loop, narrow menus | PASS | Reference tail probes pass Replay/audio/optional arrows/narrow controls, one pending/max animation frame and one AudioContext. Final visual accepts recovery 06 reduced DNA crossfade and planned narrow title/pause scope. |
| Final M4 specification | ACCEPT | Fresh assessor unconditionally accepts behavior, pacing, recovery, visual/lifecycle evidence, documentation, and local delivery on the frozen artifact; no specification blocker or architecture drift. |
| Final M4 quality | ACCEPT | Separate fresh read-only `expansion_m4_quality` finds no blocker or architecture drift; independently verifies 43 source/build inputs, five dist hashes, live HTTP 200 assets, and source-probe archive. |
| Canonical final integration | ACCEPT | Final codebase/build/two browser smokes pass; rebuilt artifact matches. Fresh Python passes 1,139 checks after final docs/cleanup; diff clean. Fresh read-only `expansion_final_integration` ACCEPTS complete plan coverage and provenance. |
| Documentation and local delivery | COMPLETE | Canonical docs and accepted screenshots describe the expansion; substantive report/ledger complete. Current receipt verifies preview serves built `dist/` at port 8374 through `run_web_server.sh`. |
| Plan archive and closure | COMPLETE | Approved plan archived unchanged; 11 current references updated; 262 link/ASCII checks and fresh post-archive full Python/diff pass. |

## Actual-controls pacing

The hard pacing gate requires both complete actual-controls standard runs to finish in 480-720
active simulation seconds. Normal steering, required rides, recoveries, transitions, and
transcription count. Menus and paused time do not count. Artificial waiting and deliberate repeated
failure cannot establish pacing. These are agent-controlled measurements, not human first-play
timings or enjoyment measurements.

| Run | Ending elapsed since Start | Net standard interval | Outcome |
| --- | ---: | ---: | --- |
| Independent full campaign | 579.57 seconds (9:39.57) | 579.57 seconds from Start | PASS |
| Reference full campaign | 525.96 seconds (8:45.96) | 525.02 seconds (8:45.02) | PASS |

Reference Start preflight includes 0.94 active seconds of unpaused audio sampling and resumed
frames before `standardStart`. The player remains stationary at (36, 1510), with zero required
completions/collectibles; only immediate inlet phase 1 at spawn is recorded. No meaningful traversal
is excluded. `standardEnd` is 525.96 and `standardEnd - standardStart` is 525.02 seconds. Preflight
is active game time, and both values are comfortably within the hard range.

The reference audit covers 2,091 trace records and only Left/Right/Space movement. Stationary
groups longer than one second are motor interception (1.25 seconds) and required expression
(2.07 and 1.53 seconds). No artificial pacing wait is identified. Postrun served hashes and all
exact harness snapshot hashes match; `trace_audit.json` and the postrun receipt preserve the audit.

Independent stage samples follow. The first sampled membrane state is at 0.12 seconds; therefore
the stage rows sum to 579.45 seconds while full elapsed since Start is 579.57 seconds. The full
pacing value includes that initial 0.12 seconds.

| Stage | Independent active seconds | Reference active seconds |
| --- | ---: | ---: |
| Membrane | 107.44 | 103.42 |
| Cytoplasm | 113.54 | 119.77 |
| Nuclear envelope | 83.87 | 80.09 |
| Receptor | 122.70 | 93.63 |
| DNA/HRE | 147.04 | 123.34 |
| Transcription | 4.86 | 4.77 |

Reference rows use reconciled consecutive stage boundaries and sum to its 525.02-second net
interval. Both standard runs include all five transitions and the short transcription finale.

D13 treats the transcription 10-20 second row as a planning allocation. The existing forgiving
three-action sequence and short finale legitimately complete in 4.86 seconds. No added delay is
required. Stage allocations help diagnose the route; both full-run measurements decide pacing.

## Browser proof and corrections

Final independent evidence is under
`test-results/expansion/independent_2026_10_09T17_51_00_905Z/`: `independent_summary.json`, before/after
provenance, key trace, 117 captures, and `independent_video.webm`. The ended observation preserves
all 21 encounter phases, receptor and HRE binding, three recruitment actions, and zero deaths.
Immediate encounter saves are verified by the fresh M3 quality assessor. It also accepts recovery
02's actual optional cargo ride/rejoin without required completion credit and the recorded sticky
contact, purple halo, escape cue, changed current, and Space release at 324.00-324.40 seconds.

Reference 01 and recovery 02 reproduce an ER-junction overflight: the controller settles above the
required contact and misses the existing permanent descent. Their diagnostics remain immutable
under `test-results/expansion/reference_01/` and `test-results/expansion/recovery_02/`; neither failed
or deliberately probed interval supplies standard pacing acceptance. The fresh route-helper
correction uses that physical descent and changes no production source. Reference 02 passes the
frozen artifact, preserving 138 captures, recording, trace, raw report, and four exact harness
snapshots under `test-results/expansion/reference_02/`. It ends transcription with all 21 required
phases, three recruitment actions, receptor/HRE binding, zero deaths/errors, and no
source/build/controller drift. Recovery 04's pickup assertion raced the rendered observation; the
capture already showed one collected fragment. A fresh probe correction uses actual observed
pickup/respawn predicates without product changes. Recovery 05 proves five required cases, including
marked-acid recovery and missed-pore return. Its additional early-envelope-destination approach
overflies the target; it is diagnostic evidence with no actual-contact claim.

Fresh M4 specification review confirms that extra envelope contact is not a plan gate. The
accepted actual M2 direct/ceiling denial, 18 unchanged relevant source hashes, shared progression
authority tests, and all five locked/ready visual states cover that required scope. The recovery
matrix therefore has 12 required cases plus one optional diagnostic, not 13 passing requirements.
Recovery 06 completes all 12 required cases with zero errors or hash drift. Actual early receptor
and HRE contacts are denied; Space releases
sticky attachment before its automatic timer; the highest receptor pocket at (3096.28, 20.83)
returns through the permanent descent to (2170.19, 1407.54) using only three movement keys without
an added death; bound-milestone Retry retains binding, the second encounter save, and two required
completions. Reduced-motion DNA capture/commit retains receptor and HRE docking. Held Space
submits one recruitment action; two later fresh presses complete the finale. Its ended observation
preserves all 21 required phases, binding/HRE, three recruitment actions, one intentional marked
death, and one fragment.

Evidence under `test-results/expansion/recovery_06/` includes `report.json`, 2,452 trace samples,
150 captures, and recorded video. The 633.35-second wall interval includes deliberate probes and
is excluded from standard pacing. The report separately retains accepted M2 direct/ceiling denial,
early cargo/channel release, and backward return with all 18 relevant hashes unchanged. Automatic
sticky release is complementary reference 02 evidence. The optional early-envelope diagnostic
remains outside the 12 required cases with no success claim.
The fresh visual assessor returns PASS for the final presentation, including authentic finalized
recovery 06 reduced-motion DNA frames. The separate `reduced_02` full walkthrough also passes all
five reduced-motion transitions, 21 required encounters, and three recruitment actions with no
errors or drift. It is supplementary evidence; recovery 06 closes the required reduced-motion case.
No game source changes are involved.
The recovery report owns complete failed-attempt diagnostics and their lineage.

The earlier destination-clipping correction belongs to camera projection. Accepted M2 evidence
preserves its before/after context in
[EXPANSION_PRESENTATION_ASSESSMENT.md](EXPANSION_PRESENTATION_ASSESSMENT.md). Final presentation
accepts all five normal transitions and the reduced-motion case on the frozen campaign. Current
action, force, return, reboarding, and destination cues remain understandable without captions.
Minor label/footer overlaps are accepted as low-impact clutter because required cues remain clear.
The visual lane covers planned narrow title/pause access and directly exercised controls; it does
not claim an independently complete Tab sequence, measured WCAG contrast, or human enjoyment.

## Source checks and delivery

Source probes measure Cytoplasm 116.825, Envelope 78.5083, Receptor 91.175, and DNA 119.033
seconds. They support author development and do not replace browser pacing. See
[EXPANSION_CYTOPLASM.md](EXPANSION_CYTOPLASM.md),
[EXPANSION_ENVELOPE.md](EXPANSION_ENVELOPE.md),
[EXPANSION_RECEPTOR.md](EXPANSION_RECEPTOR.md), and [EXPANSION_DNA.md](EXPANSION_DNA.md).
All nine released temporary probes/runners are preserved byte-for-byte under
`test-results/expansion/source_probes/`; its manifest records original/archive paths, hashes, and
restoration instructions. The recovery/reduced runner hashes match their finalized browser
snapshots before deletion. All nine originals are removed, and `tests/_temp/` is empty. The archive
preserves source provenance; finalized browser artifacts supply acceptance.

Final durable codebase/build/browser logs are under `test-results/expansion/final_gates/`:
`check_codebase.log` passes 38 Node tests, types, lint, and formatting; `build_github_pages.log`
passes the Pages build; `run_playwright_tests.log` passes both `--build` smokes. The rebuilt artifact
receipt `artifact_receipt.json` matches the frozen build signature exactly, preserving browser
proof applicability. Fresh `source source_me.sh && python3 -m pytest tests/ -q` passes 1,139 checks
in 1.69 seconds after plan archiving, retained in `python_hygiene_post_archive.log`.
`git diff --check` exits zero; `git_diff_check_post_archive.log` is empty. The five canonical documentation files
also pass 16 focused checks. Fresh M4 specification, separate quality, and final integration all
ACCEPT. Integration independently verifies 43 source/build inputs, five dist hashes, two independent
controller hashes, all five live HTTP 200 assets, 12 recovery cases, 18 retained M2 hashes, all nine
archived temporary sources, empty `tests/_temp/`, and clean diff. The local preview runs through
`./run_web_server.sh`, which builds and serves `dist/`. Local build and preview do not establish
remote publication.

The completed approved plan is archived at
[longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md), preserving SHA-256
`b12c57a2dc996b4c56968d7e0bb1647d805331c3283e24030dee03824bf621b3`. The former active path is
absent, all 11 current references are updated, and the Git index is untouched. Archive/link cleanup
passes 262 link/ASCII checks. The final main bundle hash remains unchanged; source, build, and local
preview remain the accepted artifact.
