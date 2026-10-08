# Final built campaign walkthrough

The final built artifact passed a complete real-key Chromium walkthrough on 2026-10-07.
This build includes the expanded six-stage route, added obstacles and cellular debris,
amplified steroid/receptor settling, corrected camera, and algorithmic audio. Sound stayed
muted during this campaign run; audible synthesis has separate acceptance evidence.

Command:

```sh
node --import tsx tests/playwright/campaign_walkthrough.mjs \
  http://localhost:8053 /Users/vosslab/.cache/steroid-quest-final-campaign
```

The helper used ordinary Right/Space controls and visible Start/Replay buttons. Canvas data
was read only. No coordinates, milestones, progress flags, or simulation state were assigned.
It stopped briefly on the safe binding shelf to capture settling at approximately 0, 0.8,
and 1.65 seconds. It otherwise followed an optimized route through every stage.

## Acceptance result

- Wall duration: **293.286 seconds**. Simulation ending elapsed: **293.15 seconds**.
- Real deaths: **2**. The intentional membrane hazard killed the steroid at 2.14 seconds;
  its one collected fragment survived. A cytoplasm gap killed it at 72.39 seconds;
  checkpoint 12 restored the route and retained 16 collected fragments.
- End tally: **37 / 64**, matched by the visible accessible HUD and ending.
- Receptor binding, extra air jumps, HRE docking, three recruitment actions, polymerase/RNA,
  and the ending occurred in order through normal controls.
- Actual Replay reset stage, tally, binding flags, and HRE flags on the same mounted canvas.
- Animation instrumentation: maximum **1**, pending **1** callback. Browser page errors: **0**.
- Reloaded title at **390 x 844** under reduced motion: document width **390**, no overflow.

| Stage | Entry elapsed, seconds |
| --- | ---: |
| Membrane | 0.02 |
| Cytoplasm | 13.86 |
| Nuclear envelope | 130.89 |
| Receptor | 145.01 |
| DNA/HRE | 196.09 |
| Transcription | 288.42 |

All 20 screenshots were visually inspected: `membrane`, `bilayer-crossing`, `cytoplasm`,
`filament-garden`, `envelope`, `open-pore`, `receptor`, `binding`, `binding-settling`,
`binding-settled`, `dna`, `moving-nucleosomes`, `chromatin-fold`, `hre`, `transcription`,
`recruitment-timing`, `rna`, `ending`, `replay`, and `small-title-reduced-motion`.

The continuous lipid strip, open pore, cytoplasm organelles, quiet cellular debris, real
platform hurdles/hazards, and objectives were readable. The three binding captures show
both shapes settling while preserving the red fused steroid scaffold. The high chromatin
jump keeps the red complex visible after the camera correction. HRE shape correspondence,
polymerase/RNA, tally, replay, and narrow title presentation were visible.

Durable copies of all screenshots, `report.json`, and `run.log` are in ignored
`test-results/campaign/`, with an independent copy in
`/Users/vosslab/.cache/steroid-quest-final-campaign/`. The helper saves its launch-time
source/build hashes in JSON. The served JavaScript hash was also checked against current
`dist/main.js` after completion and matched.

## Exact SHA-256 snapshot

| File | SHA-256 |
| --- | --- |
| `dist/main.js` | `727c34a68ed51c28e2c90b5d07f909ea7abe003db9f8a1ad764b910d6467d091` |
| `dist/style.css` | `6e1b1f36a85909c25ef67f574e0779376be1438dd6f0f981c6fae84ea5229de6` |
| `dist/index.html` | `08798628dbabac8b356034049ccc07b766245589712152156f847afcedac5704` |
| `src/levels/cell.ts` | `fb44b95e12725dd1a9bbcefaa4e6f638f4ea65df1f6242a1a65528c506512c89` |
| `src/levels/nucleus.ts` | `b2277f357cb4fa736f76c04a7719c8e4532963b779bf8f59b8cafcb42a8ae7c1` |
| `src/simulation.ts` | `61db06f7ff0026c787eaf2ac2c0285242ce84ff24e7a6baa47f8b07ecc1017d9` |
| `src/runtime.ts` | `d3ef0d6da651dbff24561fff0d9444a7e64450b4cf431ec54752b66115dd4f6e` |
| `src/renderer.ts` | `73abc094cb2cdccbda9276e0b3a6a6725ee2ec067ee9f189c5ec5abde3178d88` |
| `src/audio.ts` | `7bf4c2809b1617e8c89b1a0aa7631fcb77f27ea47ea5ed208df0fe6f992450f2` |
| `src/app.tsx` | `f45163e59ab4a642a171c9ddf98436183486f6e98a179d9d382029248dfc7907` |
| `tests/playwright/campaign_walkthrough.mjs` | `cba3ac468aecae48463946d26f1c960e901fbb49c7526ff480d135e441f10923` |

## Checks and limits

The helper passed TypeScript, ESLint, and Prettier. The manager lane reports final
`./check_codebase.sh` passing nine simulation tests plus type/lint/format checks,
`./build_github_pages.sh` passing, rebuilt browser smoke passing two tests, and repository
hygiene passing 997 tests. Those checks are distinct from this full traversal.

This optimized controls-only run establishes reachability and observable progression. It
does not certify the requested 8-12 minute novice duration or human enjoyment. Optional
branches were visible, but this run did not exhaust every secret or moving-platform route.
It did not assess actual audible sound quality because sound stayed muted. Remote
publication was outside this walkthrough.

Earlier expanded-route and pre-audio walkthroughs passed at 290.281 and 293.486 seconds.
Their intermediate screenshot directories were removed by a broad browser-runner cleanup;
they are superseded by the complete preserved final evidence above.
