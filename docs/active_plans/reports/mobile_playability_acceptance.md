# Mobile playability acceptance

Date: 2026-11-15. Owner: steroid implementation agent. Scope: local built artifact, no commits
or publication. See [the implementation ledger](../../archive/mobile_playability_plan.md).

## Implemented contract

Coarse-pointer landscape gets an external relative direction pad and separate Pulse. Direction
uses a 12 CSS pixel axis deadzone; Pulse preserves quick unsampled taps and held thrust. Input
sources remain independent, capture owns explicit IDs, and lifecycle resets clear input/capture.
Portrait pauses behind a rotation prompt and requires explicit Resume after returning sideways.
The simulation, campaign, physics, levels, saves and logical 960 by 540 viewport remain unchanged.

## Final artifact identity

Base checkout: `043005e24ffdc238da55c59f503df5024a1aa23f`, with the documented uncommitted
mobile changes. No dependency declaration or lockfile changes. SHA-256:

| Built asset | SHA-256 |
| --- | --- |
| `dist/main.js` | `4024af8479bff62bc31fe0acd0852936bcc2d1f0541b082ea4e7873ad3457ea4` |
| `dist/style.css` | `8142bfae12712ee86d8214745c620cc61f90f836f111d7963cb943eb8e54c9a6` |
| `dist/index.html` | `d4bfb5967b17a50346e8a782d90cd497a24fbacc10246e5b48fdfb3ed484e273` |

## Verification

- Locked dependency restore, baseline check (38 tests) and build passed.
- `./check_codebase.sh`: 39 Node tests passed, including independent touch/keyboard holds, quick tap,
  deadzone, cancellation, lost capture, release and disposal.
- `./run_playwright_tests.sh --build`: 3 passed, covering the existing laptop movement/focus
  tests and real CDP touch steering/cancel/Pulse, Retry, portrait pause/explicit Resume,
  persistent canvas, external controls and no landscape page scrolling. Portrait Retry and Escape
  retain pause and enabled-menu focus; Tab/Shift+Tab skip disabled Resume.
- `./build_github_pages.sh` passed; the browser gate rebuilt the same asset hashes.
- `source source_me.sh && python3 -m pytest tests/`: 1251 passed, one environment failure:
  `test_podman_disk_usage_stays_under_20_gb` cannot connect to the stopped local Podman VM.
  No app, documentation or hygiene test failed. CSS has the existing line-budget warning at
  957 lines, below the 1000-line gate.
- Focused Markdown links, guidance format, ASCII and whitespace: 453 passed. `git diff --check`
  passed. The whitespace check removed pre-existing trailing spaces in the archived journey plan.
- Shared independent matrix: 22 Chromium/WebKit cases passed against these exact asset hashes.
  Evidence: `/Users/vosslab/nsh/TYPESCRIPT/NOT_MOBILE/tests/mobile/results/steroid-quest-into-the-nucleus.json`.
  Covers four portrait, four landscape and three laptop sizes per engine, native menu taps,
  rotation/explicit Resume, safe-area layout, visible controls and complete camera ratio.
  Chromium is 156.0.8078.4; WebKit is 27.2. Portrait sizes: 320 by 568, 390 by 844,
  480 by 900, 768 by 1024. Landscape sizes: 568 by 320, 667 by 375, 844 by 390,
  1024 by 768. Laptop sizes: 1280 by 720, 1440 by 900, 1920 by 1080.
- Final actual-touch campaign: PASS, exit 0, **531.74 active seconds (8:51.74)** and
  534.115 wall seconds. All six stages, 21 required encounters and 109 authored steps completed;
  zero deaths, bound receptor/HRE and three successful timed recruitment actions. Early cargo
  release left delivery pending; Retry retained progress; reboarding and natural delivery passed.
- Native Replay returned to playing Membrane, reset binding/recruitment/required progress,
  retained the same canvas and the session sound preference. Runtime observations show exactly
  one pending animation frame and maximum one throughout. Errors and source drift are both empty.
- Proof: `test-results/mobile-final-proof/report.json`, `controller_trace.json`, copied `harness/`,
  135 numbered screenshots and recorded `video/`. The report contains before/after hashes for every
  source and harness file, and confirms the HTTP-served asset hashes match the table above.
  The inherited `mode` label is `full-standard-reference`; `touch: true` and trace lane `touch`
  identify this touch route with optional vertical input.

The final campaign command, with the preview serving `dist/` on port 8374:

```sh
PLAYWRIGHT_BROWSERS_PATH=/Users/vosslab/.cache/ms-playwright node --import tsx \
  tests/playwright/campaign_walkthrough.mjs http://127.0.0.1:8374 \
  test-results/mobile-final-proof --touch --standard-only
```

Final recruitment, ending and native Replay captures were visually inspected: the touch prompt,
complete camera, external controls, readable ending and reset world are visible and unobstructed.

## Changes and review

Production changes are limited to App, input, runtime wiring, shared input/runtime types,
coarse-pointer CSS and viewport safe-area metadata. InputFrame, simulation, physics, levels,
camera and saves are unchanged. No packages were added. The App gives focus to enabled menu
buttons, including after portrait Retry/Escape, while runtime retains gameplay focus ownership.

Independent source specification and quality reviews pass. The quality review's material finding
was the portrait paused-to-playing-to-paused focus sequence; enabled-menu selection and explicit
focus restoration correct it, and the final browser test verifies it. The final integration reviewer
has the completed proof, stable source/artifact identity, matrix and this report for closeout.

## Evidence and limits

Browser launches required the standard sandbox escalation because macOS denied Chromium's Mach
port registration inside the sandbox. Tests ran against built HTTP assets. A failed initial touch
controller run is retained at `test-results/mobile-campaign`; the corrected contact lifecycle was
verified against real browser pointerdown/up/capture events before the final campaign. The first
long candidate, `test-results/mobile-campaign-final`, predates the final menu focus fix and is
diagnostic: its gameplay completed in 543.74 active seconds with zero deaths and three recruits,
but the harness correctly rejected changed source/artifact identity. Its movement, transition,
recruitment and ending captures were visually inspected. `test-results/mobile-campaign-accepted`
records a no-drift controller failure: it coasted
in a calm pocket above its vertical target. The final touch-only lane uses the existing gentle
Down direction based on vertical error and velocity; the keyboard standard lane remains unchanged.

The campaign uses actual CDP touch gameplay, including optional vertical pad input, and native
Replay tap. Inherited Start/Resume/Sound use Playwright clicks, and an inherited focus-loss check
uses keyboard Tab. The focused mobile browser test independently uses native taps for Start,
Pulse, Pause, Retry and Resume. This is not a three-key-only touch route. No test writes live
simulation state; canvas datasets supply observations only.

The shared matrix uses viewport screenshots. Chromium full-page screenshots temporarily changed
orientation media callbacks in a 320-pixel test despite restored portrait dimensions; this was
isolated as a capture-tool effect and excluded by using viewport capture for viewport-fit evidence.
Physical Android/iOS hardware, tactile comfort and subjective sound quality were not assessed.
The full final keyboard campaign was not rerun; existing keyboard behavior tests, the shared laptop
matrix, unit checks and unchanged simulation/level/physics/camera code protect the laptop boundary.
`npm ci` reports 10 moderate inherited dependency advisories; dependency changes are outside this
touch-input scope. No publication was attempted, so the live site can still serve the prior build.

Temporary browser probes were removed, `tests/_temp/` contains no task files, and the final docs
and hygiene checks pass. Screenshots/video remain in ignored `test-results/`; official browser
tests were run before the campaign so its proof directory is preserved.


## Cleanup addendum, 2026-11-15

The acceptance and hashes above describe the earlier mobile implementation snapshot. Cleanup
moves the completed implementation ledger to [the archive](../../archive/mobile_playability_plan.md).
The original 957-line stylesheet is split into 786 base lines and a final 171-line mobile and
reduced-motion stylesheet. The HTML loads `style.css` before `mobile.css`, and the canonical
build copies both. Concatenating these two source files in that order is byte-for-byte equal
to the earlier stylesheet, including its final reduced-motion override. The concatenated SHA-256
is `8142bfae12712ee86d8214745c620cc61f90f836f111d7963cb943eb8e54c9a6`.

The rebuilt artifact now has these identities:

| Built asset | SHA-256 |
| --- | --- |
| `dist/main.js` | `4024af8479bff62bc31fe0acd0852936bcc2d1f0541b082ea4e7873ad3457ea4` |
| `dist/style.css` | `66b279dc20956e00b90ac4e5809d2f4467c0e48fe9c17b886b9e2453eef70944` |
| `dist/mobile.css` | `8ff889c0415983b2f3acf7454726e878117685f3ddeb8347c60b23794a832919` |
| `dist/index.html` | `8f3f8fed6d5afe5aa791ade2185a2fc8ce29ac0e487ba3c72744f60ad7c2480b` |

`./check_codebase.sh` passes both type checks, lint, formatting and 34 retained Node tests.
`./build_github_pages.sh` passes. Static checks verify exact ordered CSS equivalence, source-to-dist
HTML/CSS byte equality, stylesheet link order and unchanged browser test sources. The compiled
JavaScript hash remains equal to the earlier accepted snapshot. Scoped Markdown links, guidance
format, ASCII, whitespace, source line limits and README checks pass 613 tests. Cleanup removes the unused legacy
`src/init.ts` build fallback, its redundant entry argument, and eight internal-only exports;
function bodies, authored levels, physics, input, runtime and camera behavior remain unchanged.

Test pruning removes the recipe-wrapper module and three helper/source-shape cases, and narrows
one campaign inventory case to its authored biological guards: 39 tests in six modules become
34 tests in five. This removes recipe fixture duplication and incidental array/name inventories.
Compiler validation, calm saves, transport safety, required biological ordering, open-pore clearance,
collision, Retry/Replay, input ownership, camera framing and actionable transport guidance remain
covered. Direct recipe-output and named-phase reordering assertions are no longer permanent gates.
No dependencies or shared test helpers became unused.

The existing `test-results/` evidence remains unchanged. Browser tests and browser support were
excluded from this cleanup by the user; no browser was launched or test rerun. Earlier browser
campaign and matrix results establish the dated snapshot above, not fresh acceptance of this
changed HTML/CSS asset set. No commits or publication were performed.
