# Expansion presentation assessment

## Status and scope

Independent rendered membrane assessment, 2026-10-09. Final campaign acceptance is pending.
The assessor did not author the evaluated content, controller, or presentation implementation.
This report follows [longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md) and evaluates
visible action clarity, route changes, recovery, destinations, transitions, and menu readability.
Source and automated completion claims are kept separate from rendered observations.

Repository guidance reviewed: AGENTS, repository, Markdown, TypeScript, Python, and Solid model
rules. The UI/UX Engineer skill supplies the clarity, feedback, and recovery review method.
Apply **Focus on important issues**: recommendations concern understanding and reachable recovery,
not decorative preferences. Apply **Use the scientific method**: passing a controller run alone
does not prove understandable first play, an enjoyable campaign, or target pacing.

## Evidence and lineage

- Current finalized capture set: `test-results/expansion/m2_reference_02/`, screenshots 00-59,
  report, controller trace, recording, and exact harness snapshots. Report mode is membrane-prefix,
  `finished: true`, `errors: []`, and `sourceDrift: []`.
- Run02 artifact hash: `dist/main.js =
  aaa259ed2d8abe8154749b947c30d809db9dd99536a0cf08a985d4fa3c862ac5`.
  Before/after hashes agree; served-hashes observation agrees with local artifacts.
  CSS hash is `a9e01f5566f7450b1decbb15674a343f145c0f04ad2cd317635418e9def6e3a4`;
  index hash is `08798628dbabac8b356034049ccc07b766245589712152156f847afcedac5704`.
- Reported standard active membrane time is 104.55 seconds, within the plan's 80-115 seconds.
  The report's `pacingWithinTarget: false` compares this prefix against the full campaign target;
  it is not a membrane timing failure. Final campaign timing remains unmeasured here.
- `test-results/expansion/m2_reference_01/report.json` records a failed membrane-prefix run with
  `finished: false`; it is diagnostic evidence only. It reports no source drift and artifact hash
  `dist/main.js = b1f0a90552454ccacc1f0610d9771072df65d5134f1828fe0ff951790c490404`.
  That hash does not establish the lineage of run02.
- Manager reports a source membrane probe near 101 seconds. It supplies no rendered movement or
  complete campaign pacing proof and is not used as a presentation pass.
- Images are inspected directly at their 1280-by-900 desktop capture size. Bottom biological
  captions are excluded as the sole basis for action-clarity findings.
- FFprobe confirms a 283.24-second 1280-by-900, 25 fps recording. The normal-route transition is
  inspected through a 5 fps strip from video 104.6-107.6 seconds and full-size extracted frames.

## Rendered observations

The persistent top HUD shows stage, encounter summary, required count, four completion segments,
and the current gold action label. Inside the canvas, the current target receives a gold outline;
an offscreen target receives a gold edge compass and action label. Cyan arrows indicate field
direction. Green outlined regions identify checkpoint or calm-return pockets. The red four-ring
player remains visibly distinct from the muted background decoration.

| Evidence in run02 | Observed fact | Criterion judgment |
| --- | --- | --- |
| 02 membrane start | REBOUND labels a large gold outlined target; current arrows point upward through the inlet. | Immediate first action is identifiable without the bottom caption. |
| 03 first rebound; 05 crest rebound | Action changes from LOFT / TURN RIGHT to BASIN / NEW OUTLET; arrows change from up to down-left. | An interaction visibly produces a new route rather than an identical repeat. |
| 07 outlet; 08 return pocket | Action becomes RETURN / ARRIVING VESICLE, then BOARD VESICLE; leftward and downward currents lead to a labeled pocket. | Backward travel has explicit new opportunity and return cues. |
| 09 capture; 10 delivery ride | Visible vesicle contains the red player; HUD changes to VESICLE DELIVERY and dotted cargo path remains visible. | Boarding and pending delivery have distinguishable states. |
| 13 arrival exit; 14 first entry | Required count reaches 2/4; new target is FIRST LOOP / FIRST RIM / REVERSE; downward return channel and calm pocket remain visible. | Completion and onward direction are readable without caption reliance. |
| 15 first rim; 16 lower link | Rim contact changes action to LOWER LINK / TURN RIGHT and then SECOND RIM / RISE LEFT; the next field points right. | Linked lobes require a changed approach, with cues for the next target. |
| 00 title; 01 pause | Start and Resume dominate their overlays; Left/Right/Space and optional Up/Down fine control are labeled. | Desktop menus communicate primary controls and optional thrust clearly. |
| 20 lower contact; 22 channel mouth; 24 channel ride | HIGH RIM / TURN BACK changes to CHANNEL CAPTURE, then CHANNEL DELIVERY; a large curved channel path becomes visible. | The final encounter combines reversal with a visually different channel transport. |
| 25 channel delivery; 26 destination capture | Required count reaches 4/4; mint compass and READY - ENTER THE RING replace the gold action; the red player is centered inside the ring on capture. | Readiness and capture are explicit. A single image cannot establish smooth zoom/blend behavior. |
| 28 early destination contact | Motor-carried vesicle has a subdued segmented ring, 0 / 4 REQUIRED text, and Return to: REBOUND compass. | Locked state explains the unmet requirement and supplies a return action. |
| 39 detached pending cargo delivery | Player is in a CALM RETURN pocket; both HUD and edge compass read Reboard the marked ride for delivery; a downward return stream remains visible. | Premature cargo escape leads to an explicit recovery opportunity independent of optional captions. |
| 55 escaped channel; 56 detached after retry | HUD and gold marker say Reboard the marked ride for delivery; the channel entrance is highlighted in 55 and pointed to from calm return in 56. | Channel recovery is actionable and consistent with cargo recovery. |

## Criterion findings

| Criterion | Current call | Basis or missing evidence |
| --- | --- | --- |
| Current action without biological captions | Preliminary pass, observed membrane portion | Persistent HUD, gold target, and edge compass agree with the changing phase. |
| Return/descent cues | Preliminary pass, observed membrane portion | Cyan arrows, labeled return channels, and calm pockets are visible. Geometry reachability still belongs to behavior assessment. |
| Reboarding after premature escape | Membrane pass | 39, 55, and 56 point toward reboarding while delivery remains pending. |
| Meaningful changes versus chores | Preliminary support | Rebound, reversal, new cargo ride, and linked lobe approaches change the visible route. Complete recording remains necessary to assess time spent repeating or waiting. |
| Recognizable biological destinations | Membrane supported; four later objects pending | Circular vesicle sits above a visible motor/track motif in 26 and 28. |
| Locked versus ready destination | Membrane preliminary pass | 28 shows subdued segments and required count; 25-26 show bright mint ring and explicit entry instruction. |
| Five zoom transitions | Membrane needs correction; remaining four pending | Recorded zoom partly clips captured destination and player at right edge; see finding P1. |
| DNA bound-complex continuity | Pending | No expanded DNA-to-transcription evidence yet. |
| Reduced motion | Pending | Need recorded crossfade with no scaling, especially bound-complex continuity. |
| Narrow menu readability | Pending | Desktop menus are readable; narrow title, pause, and ending captures remain necessary. |

## Actionable transition finding

**P1 - Keep the captured destination in view during zoom.** Presentation owner, shared
`src/renderer.ts` camera/transition behavior; medium impact on destination tracking.

Observed: the vesicle contains the captured red steroid in screenshot 26. At video 105.95 seconds,
the ring, destination label, and steroid move against the right edge and are partly clipped.
The large neighboring lobe occupies the center. At 106.25 seconds, the blended vesicle is mostly
visible but remains near the right edge. The contact strip shows this outward movement preceding
the final centering/blend. This weakens the visual promise of zooming into the biological object.

Evidence: `test-results/expansion/visual_assessment/m2_transition_mid.png`,
`m2_transition_blend.png`, and `m2_transition_strip.png`. The strip is row-major at 0.2-second
intervals from video 104.6 seconds. The last row includes the probe's subsequent Replay and must
not be interpreted as a failed stage commitment.

Judgment: action and state cues pass for membrane; focal stability of its transition needs
correction. Suggested owner action: recenter the destination while changing scale so the capture
ring and steroid remain inside the canvas throughout the one-second transition. Inspect the
corrected sequence on the final artifact; the same shared camera owns later transitions.

Source inspection suggests that scale changes while camera offset only partially interpolates
toward the new center. This is a diagnostic hypothesis, separate from the observed clipping.

## Recommendations and limitations

Membrane action, return, locked/ready, and cargo/channel recovery cues pass this rendered review.
Keep transition presentation and final campaign acceptance open for P1 and complete evidence.

1. Presentation/runtime owner: correct and recapture P1. Exact moving-target correctness and
   successful recapture remain behavior evidence rather than a fact measured from one image.
2. Browser evidence owner: provide remaining destination locked/ready states, all five transition
   sequences, reduced-motion sequence, and narrow menus. Reuse the current artifact;
   this assessor does not rebuild or mutate it.
3. Content/pacing owner: pair complete per-encounter timing with recordings. Repeated loops are
   only justified by changed actions and opportunities; required waits or controller delays
   cannot establish the 8-12 minute goal.

Live keyboard, sound, pause timing, screen-reader, and contrast compliance are outside this static
image pass. No axe or pixel contrast audit is performed; visual readability is not WCAG proof.
FFmpeg and FFprobe are available and used for finalized transition extraction. A full frame-by-frame
campaign review is pending; no enjoyment claim follows from source probes or successful completion.
No production, controller, test, or configuration files are changed by this assessment.
