# Cellular surprise walkthrough

The frozen built campaign passed a complete real-controls Chromium walkthrough on 2026-10-07.
The accepted run exited 0 with six stages, 13 of 27 fragments, one deliberate death, 58 captures,
no page errors, and no source or built-asset drift. Observed traversal took 111.833 seconds.
This measures the automated route, including interaction captures and a crumble reform wait;
it does not establish human enjoyment or an eight-minute play duration.

## Accepted command and artifact

The manager ran the integration checks and build before releasing the artifact. This lane did
not rebuild it. The existing preview at port 8367 served the released `dist/`.

```bash
node --import tsx tests/playwright/campaign_walkthrough.mjs \
  http://localhost:8367 test-results/surprise_campaign/accepted \
  > test-results/surprise_walkthrough_accepted.log 2>&1
```

The script uses visible Start, Replay, Resume, and Retry buttons and real arrow/Space/Escape
input. Canvas data attributes are read-only observations. Source geometry guides ordinary
controls; no simulation writes, teleports, stage jumps, or progress changes occur.

## What actually played

| Interaction | Accepted observation |
| --- | --- |
| Start and campaign | Membrane, cytoplasm, envelope, receptor, DNA, transcription, ending |
| Deliberate death | Membrane checkpoint death retained the one collected fragment |
| Recovery | Same checkpoint/fragment after 0.42 observed simulation seconds; configured recovery is 0.4 seconds |
| Pinball | Flush membrane and cytoplasm bumper launches; cytoplasm launch played under reduced motion |
| Optional cache | Cytoplasm upper cache-step-2 reached and reward collected; returned to lower catch floor |
| Crumble contact | Ribosome-0 top contact at 30.16 seconds, player y=630 |
| Crumble collapse | Released movement, waited, then fell to stationary catch at 31.17 seconds, y=750 |
| Crumble reform | Waited beyond reform duration, climbed back, contacted the same tile at 36.52 seconds, y=630 |
| Orbit carry | Released both arrows and Space; stayed on orbiter-0 as x changed -21.76 and y changed 4.87 |
| Express | First field travel averaged 347.36 units/second, above ordinary 280-unit running speed |
| Low gravity | Real jumps inside envelope and receptor 0.4-gravity fields rose about 99.5 units in the observation window |
| Biological order | Receptor bound at 68.79 seconds; HRE bound at 106.31 seconds with receptor still bound |
| Recruitment | Three real Space presses advanced counts 0, 1, and 2 to three recruited factors |
| RNA and ending | RNA capture shows stationary bound complex, promoter assembly, polymerase, and transcript; ending reached |
| Replay | Same mounted canvas; membrane playing, zero fragments, receptor/HRE reset |
| Narrow controls | 390-by-844 reduced-motion Start, real movement/jump, Escape, Resume, Escape, Retry all reachable |
| Runtime lifecycle | Same canvas after narrow menu actions; one pending callback, maximum one throughout monitored play |

The 0.42-second observed recovery includes polling and rounded canvas timestamps; the test
checks retained checkpoint and collection state rather than claiming frame-exact timing.
Crumble collapse and restoration are inferred from physical fall/catch and renewed contact,
because crumble state is intentionally absent from the read-only DOM diagnostics.

The walkthrough deliberately exercised the new cytoplasm patterns and its optional cache.
It traversed the updated receptor and DNA stages along the lower route; their additional upper
caches and optional orbit/crumble routes were not played. Armed-crumble pause freezing belongs
to focused source-level tests and is not claimed as browser evidence here.

The complete cytoplasm stage used reduced motion while retaining required launch, crumble,
current, and orbit gameplay. Narrow gameplay had a 372-pixel canvas, a 390-pixel document width,
and no horizontal overflow. The visible fragment HUD matched the completed and Replay tallies.
The RNA screenshot was visually inspected after the accepted run.

## Evidence and hashes

Accepted JSON, screenshots, and log are ignored local evidence:
`test-results/surprise_campaign/accepted/report.json`, the adjacent 58 PNG files, and
`test-results/surprise_walkthrough_accepted.log`. The independent narrow diagnostic is
`test-results/surprise_campaign/narrow_probe.json`; its temporary script was removed.

Every source TS/TSX/CSS/HTML file, the three built assets, and the controller were hashed before
and after the accepted run. `sourceDrift` is empty. HTTP responses for the three built assets
match these `dist/` hashes exactly:

| File | SHA-256 |
| --- | --- |
| `dist/main.js` | `03bab7b15590b851f47642a32d8a0c92fd03e1d7949c33377a087e8272ace9b2` |
| `dist/style.css` | `30e6fbe43113cf0bc59308880f34229bcf1e12ffdd62f3c958de96ce35e06dd8` |
| `dist/index.html` | `08798628dbabac8b356034049ccc07b766245589712152156f847afcedac5704` |
| `tests/playwright/campaign_walkthrough.mjs` | `de076934f1c5e5f569fc5a421fafdf5c91302c0e15be7aad18ed7b807a7b8870` |

## Controller corrections

Two earlier runs completed the full campaign and Replay with unchanged source/build hashes,
but failed the supplementary narrow-menu assertion. They remain distinct under
`test-results/surprise_campaign/rehearsal_01/` and `test-results/surprise_campaign/final/`.

The first asserted immediately after Retry without waiting for the next observed playing frame.
Its report did not retain the individual failing predicate, so a stale phase read was an initial
hypothesis rather than a confirmed product defect. Adding a phase readiness wait exposed a
second test problem: Playwright's default `waitForFunction` RAF polling added its own callback
to the global animation monitor. The isolated probe showed sameCanvas=true, phase=playing,
pending=1, maximum=2. Explicit 50-ms polling removed that observer callback; the same actual
controls then showed pending=maximum=1. The accepted fresh campaign uses that correction.
No product source change or rebuild was needed.
