# Chaotic campaign walkthrough

The final chaotic-cell build passed a complete real-key Chromium campaign on 2026-10-07.
The run used the visible Start/Replay buttons, Right, and Space. Canvas data attributes were
read-only observations. The controller did not assign coordinates, milestones, or game state.

```sh
node --import tsx tests/playwright/campaign_walkthrough.mjs \
  http://localhost:8367 /Users/vosslab/.cache/steroid-quest-chaos-campaign
```

## Complete campaign evidence

- Campaign wall time: **130.317 seconds**; simulation ending time: **130.15 seconds**.
- All six stages completed; final accessible HUD and ending tally: **26 / 37**.
- One intentional real death occurred at **5.47 seconds**, after membrane checkpoint 0.
  Recovery retained the checkpoint and its one collected fragment.
- The steroid actually stood on `membrane-spring-secret` at **9.77 seconds**, then returned
  to `membrane-floor-after` at **11.15 seconds** through ordinary controls.
- A **450 ms** hold without movement input kept the same vertically moving vesicle support.
  Player y changed from **565.77** to **581.28**, establishing **15.51 pixels** of vertical carry.
  Total world displacement was 29.403 pixels, including residual horizontal braking.
- Cytoplasm used reduced motion while traversing low baffles, the current, and the spring.
  The launch remained functional and its static directional cue stayed visible.
- Receptor binding, a gel launch, an updraft, and actual standing on its upper roof shortcut
  occurred. The bound complex then launched into DNA, crossed the nucleosome wave, entered
  the fold current, and actually stood on the DNA roof shortcut.
- HRE docking preceded exactly three ordinary Space press/release recruitment actions.
  Polymerase/RNA and the ending followed.
- Actual Replay reset stage, tally, binding, and HRE state on the same mounted canvas.
- Animation observation: maximum **1**, pending **1** callback. Page errors: **0**.
- Reduced-motion title and gameplay at **390 x 844** had document width **390** and canvas
  width **372**. Normal movement/jump controls advanced the steroid in the narrow view.
- Served JavaScript, CSS, and HTML matched their local build hashes. Every recorded source
  and build file remained unchanged throughout the campaign.

| Stage | Entry elapsed, seconds |
| --- | ---: |
| Membrane | 0.00 |
| Cytoplasm | 13.63 |
| Nuclear envelope | 63.35 |
| Receptor | 77.35 |
| DNA/HRE | 100.18 |
| Transcription | 125.22 |

The original level-2 obstruction is corrected at its authoring boundary: lower tunnel
baffles are at most 65 units high, and the section compiler rejects larger ones. The built
run passed the squeeze, organelle weave, vesicle crossing, spring chamber, filament garden,
and nuclear approach without a cytoplasm death. Its cytoplasm traversal took 49.72 seconds.

## Evidence locations

The primary run preserves **72 screenshots**, its source/build SHA-256 snapshot, read-only
event observations, and log in `/Users/vosslab/.cache/steroid-quest-chaos-campaign/`.
The ignored repository copy is `test-results/campaign/report.json`.
The primary JSON remains unchanged when supplementary captures are added.

Proximity photos of moving platforms have event type `moving-platform`; they do not by
themselves prove a ride. The primary `moving-ride` event verifies matching support before
and after its no-input hold. Actual roof contact has event type `roof-shortcut`.

A separate ordinary-controls follow-up took **111.5 seconds** and stopped during DNA.
It photographed actual standing on the filament-garden summit, two cytoplasm vesicles,
the envelope drifting vesicle, the receptor ferry and lift, and DNA wave vesicles 0 and 1.
Those moving contacts have event type `actual-moving-support`, with their exact support
IDs and world coordinates. The final DNA wave vesicle was not claimed as an actual ride.
Its source/build hashes match the primary artifact, and its errors/source drift are empty.
The ignored supplementary evidence is `test-results/campaign/followup/report.json`,
with an independent cache copy in `/Users/vosslab/.cache/steroid-quest-chaos-followup/`.
The temporary follow-up probe was removed after completion; the reusable primary walker
remains unchanged, and the follow-up JSON retains the probe's SHA-256 provenance.

The previous exact-build 20-screenshot campaign remains preserved independently in
`/Users/vosslab/.cache/steroid-quest-final-campaign/`. Two aborted controller rehearsals
remain in separate chaos partial-run cache directories. They exposed extra jumps near the
flush spring; the reusable controller now walks from nearby descending support onto the
pad and checks the membrane secret/return before continuing into cytoplasm.

## Exact build snapshot

The primary JSON records every source module and all built assets. Key hashes are:

| File | SHA-256 |
| --- | --- |
| `dist/main.js` | `9de04d81d404912593acb8cd6a3c7b7cd8a9f8c1ee3b48b7bb8524ef467c1383` |
| `dist/style.css` | `30e6fbe43113cf0bc59308880f34229bcf1e12ffdd62f3c958de96ce35e06dd8` |
| `dist/index.html` | `08798628dbabac8b356034049ccc07b766245589712152156f847afcedac5704` |
| `src/levels/cell.ts` | `6107a9e211299bbfcc3750d151aa80914dff9ab783cec8c409959d3895003d89` |
| `src/levels/nucleus.ts` | `f4eafb2174fef579062094b88f4e5ad4f570e3a41ff1f5674f99b2629d1e393f` |
| `src/levels/section_specs.ts` | `4b0771f0f4c42516f32c4a778f409678b3291b8f5520b0ae7f71b97faad4ebf9` |
| `src/kinetic_art.ts` | `a66485a29e90010ed1f9c5eb237a7ec26c06547198bc7e56019d82b35b7e25a1` |
| `tests/playwright/campaign_walkthrough.mjs` | `074f84190b16e2d1db4a41d0f6476796741e29c969152c0f829cd4cbc09b441d` |

## Checks and limits

The manager reports the full code gate passing 19 Node tests plus type, lint, and format
checks; Pages build passing; rebuilt browser smoke passing two tests; and repository
hygiene passing 1,021 tests. Focused ESLint and Prettier checks passed after the controller
corrections. Those gates are distinct from the complete browser traversal above.

Selected primary screenshots across all six stages and all eight added summit/support
photographs received rendered inspection. The level-2 low baffles, current/spring directions,
open pore, bound red complex,
upper fold routes, recruitment states, RNA, ending, and narrow view remained readable.

This optimized controller run establishes reachability, real interactions, and observable
progression. It does not establish novice duration or human enjoyment. Optional branches
were exercised but every secret was not exhausted. Sound remained muted; the run does
not judge audible quality. Local acceptance does not publish the game remotely.
