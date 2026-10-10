# Reduced-motion campaign evidence

## Result

PASS: the second attempt completes all six stages, 21 required encounters, five reduced-motion
transitions, and three recruitments, ending in `transcription/ended` with zero deaths, browser
errors, or source/build/harness drift. This supplements the independently accepted standard
routes and reduced-motion recovery evidence; it adds no campaign-pacing gate.

The measured time is 527.17 active seconds including the 0.97-second audio lifecycle preflight,
or 526.20 seconds from the standard-route start. Movement uses actual Left, Right, and Space
input. Escape and Tab occur only in the initial menu/focus preflight. There are no state writes,
teleports, forced progress, skipped stages, or waits inserted to lengthen the route.

## Evidence and provenance

Final raw evidence lives in `test-results/expansion/reduced_02/`: `report.json`,
`controller_trace.json` (2,096 records), `actual_key_events.json` (1,167 events), 132 numbered
captures, and finalized video `video/page@69b12c9a7f5b50f34f01c22a074052e2.webm`.
`hashes_before.json`, `hashes_after.json`, `prerun_served_hashes.json`,
`postrun_served_hashes.json`, `media_preference.json`, and `receipt_verification.json`
preserve and check lineage. All 40 source files, five built assets, and five harness files have
identical before/after hashes; every served asset matches the approved local build both times.
Each preserved harness snapshot matches its recorded hash.

- Approved build signature: `802e4c3244bfc2e06df0785d2049f49be13866651fd64ff367a7e41db93f4470`.
- Main bundle SHA256: `7955bb681e4766837b7df584f5f0baa0136454cd5bb763929001c372bbd04a43`.
- Actual runner SHA256: `37aaa51049540f0f6e82413def879ed742c3e0fd059ce421cf65b0e987ca80eb`.
- Readonly route helper SHA256: `dc6702edc2cd6981b4988f7a9fc0615c92d5a4d6444a2d2001432e6e6aba6d8f`.

The exact temporary runner is preserved at `harness/_temp_expansion_reduced.mjs`, alongside its
four imported test helpers. It copies the successful reference controller, enables
`reducedMotion: "reduce"` before navigation, and asserts the actual media preference before Start.
Only its crowded lower-vesicle capture approach changes: it remains in the existing permanent
x=8205 descent until player-center y=1480, then resumes the normal boarding approach. This
corrects an observation-sensitive premature lateral departure; production and shared controllers
remain unchanged. Syntax, scoped ESLint, and Prettier checks pass before the run.

## Transition receipts

The scene observer forwards original Canvas methods with their original receivers, arguments,
and return values. It measures the first camera scale following each 960-by-540 scene background,
excluding subsequent sprite-local scales. Because runtime observation follows rendering, its
phase fields describe the preceding rendered observation, with at most one frame of lag.
Rendered video and captures remain the presentation evidence; scale measurements support them.

`reduced_scale_observations.json` records 31,889 scene scales, all exactly 1 on both axes. Each
of the five transitions contains 96 scene samples spanning observed transition elapsed
0.0083-0.9917 seconds, covering source and blended preview scenes. Source-stage authority remains
in the transition observations until a single recorded commitment to the next stage.

These capture numbers and controller wall times locate each retained transition in the film:

| Leaving stage | Destination capture | Committed capture | Wall seconds, entry/commit |
| --- | --- | --- | --- |
| Membrane | 26 | 27 | 105.201 / 106.245 |
| Cytoplasm | 55 | 56 | 224.821 / 225.811 |
| Nuclear envelope | 75 | 76 | 305.371 / 306.337 |
| Receptor | 97 | 98 | 398.967 / 399.982 |
| DNA/HRE | 124 | 125 | 522.811 / 523.767 |

DNA transition samples retain `receptorBound: true` and `hreBound: true` throughout, followed by
`transcription/recruiting` with both bindings retained. Captures 124-126 show the bound red steroid
and gold receptor at the matching element before and after commitment. Captures 127-129 record
three recruitments, 130 records the RNA scene, and 131 records the ending. The DNA capture and
committed view were directly inspected; final independent visual acceptance is owned by
[EXPANSION_FINAL_VISUAL.md](EXPANSION_FINAL_VISUAL.md).

## Earlier diagnostic

`test-results/expansion/reduced_01/` remains unchanged. Its copied reference controller completes
the membrane transition but stalls above the second crowded vesicle at elapsed 250.66 seconds,
with no deaths. The lower-bay entry disables a phase-limited return current; early lateral braking
can leave insufficient downward momentum. The permanent descent used in attempt two remains
available. This is a controller approach failure, not established unreachable game geometry.

That attempt preserves 54 captures, video, actual key events, post-run served hashes, scene-scale
observations, and exact harness snapshots. Its runner hash is
`e48a137ac7bc1c70e98330b8c9b207c491633e73bc2417854bd8c7ecbfddb76e`.
An all-five assertion ran before report finalization, obscuring the original caught navigation
error and losing the in-memory source hashes and controller trace. Those missing receipts are
not reconstructed or claimed as proved. Attempt one is diagnostic visual evidence only; the
fully finalized second attempt supplies acceptance lineage. The corrected temporary runner saves
raw hashes and served/media receipts immediately and finalizes its report, trace, and browser
before checking the five-transition count.
