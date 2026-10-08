# Built campaign walkthrough

## Expanded route snapshot, before obstacle and binding-art revisions

The real-key Chromium walkthrough passed on 2026-10-07 against the already loaded
`http://localhost:8053` build. This is a preserved intermediate snapshot, not acceptance
of the later obstacle, debris, camera, or binding-art revisions.

Command: `node --import tsx tests/playwright/campaign_walkthrough.mjs http://localhost:8053`.
The browser used ordinary Right and Space input, read-only canvas observations, and the
visible Start/Replay buttons. No game state, milestones, or player coordinates were assigned.

- Wall duration: 290.281 seconds; simulation elapsed at ending: 290.16 seconds.
- Stage entry elapsed: membrane 0.03; cytoplasm 14.10; envelope 130.38;
  receptor 144.50; DNA 193.52; transcription 285.44 seconds.
- One deliberate membrane hazard death at 2.17 seconds; its collected fragment survived.
- Completed receptor binding, extra air jumps, HRE docking, and three recruitment actions.
- Ending showed 50 / 64 fragments. Replay reset flags and tally on the same canvas.
- Animation instrumentation observed exactly one maximum and pending callback.
- No browser page errors. A 390 x 844 reduced-motion title had no horizontal overflow.

Evidence is preserved under ignored `test-results/campaign-expanded/`: JSON report,
real-time log, and 18 screenshots. All screenshots were visually inspected. Lipid continuity,
open pore, prominent cytoplasm mitochondria, red steroid inside the complex, matching HRE,
polymerase/RNA, ending, and small-screen title were readable. The chromatin-fold capture
exposed a camera issue: a double jump above the high shelf briefly put the player above the
viewport. This finding was escalated for correction before the final run.

This optimized automated route is not a human first-play timing or enjoyment assessment.
The requested 8-12 minute novice target remains unverified.

### SHA-256 snapshot

| File | SHA-256 |
| --- | --- |
| `dist/main.js` | `762b922800ee33d01d969a04d77993e36d6b70e048bd84ed3f66ab5ce3184c39` |
| `dist/style.css` | `6e1b1f36a85909c25ef67f574e0779376be1438dd6f0f981c6fae84ea5229de6` |
| `dist/index.html` | `08798628dbabac8b356034049ccc07b766245589712152156f847afcedac5704` |
| `src/levels/cell.ts` | `59e35d6ec9e62fcbbc20ac8ee1b390c0e40a26f7e2424cebdbac69ba1ce5b1f7` |
| `src/levels/nucleus.ts` | `92b58c7d540c24cb2c5a9e4747cf2926e734970cff34b0423d5ab40974185557` |
| `src/simulation.ts` | `61db06f7ff0026c787eaf2ac2c0285242ce84ff24e7a6baa47f8b07ecc1017d9` |
| `src/runtime.ts` | `5649b51dbcc1b8589ddbcc3c5afa21d5d40e083b5daae86f5ececf4fa31f11ae` |
| `src/renderer.ts` | `89e64892e74ace652d570149e0cd621b199156730efb50e43bea5f939122f3bf` |
| `src/app.tsx` | `edc08ade6a5149f4f165c82eef01e3e519d0cf0199282bc07bb0bbfade3b0130` |

The walkthrough helper passed TypeScript, ESLint, and Prettier before this run. Whole-repo
checks and rebuilt two-test browser smoke passed in the manager lane before launch.
