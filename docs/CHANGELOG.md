# Changelog

## 2026-10-07

### Additions and New Features

- Add TypeScript simulation contracts, Solid menus/HUD, a Canvas 2D runtime, forgiving movement,
  checkpoints, optional fragments, receptor activation, and transcription recruitment.
- Add procedural regional illustrations, reduced decorative motion, and optional synthesized sound.
- Author all six stages, including six cytoplasm districts, nucleoplasm exploration, chromatin
  routes, and three forgiving transcription recruitment actions followed by emerging RNA.
- Document local preview, controls, lifecycle ownership, and biological model limits.
- Refresh the README with the confirmed live Play link, six-region learner activity, controls,
  concise setup, and documentation routes using the requested README documentation skill.

### Behavior or Interface Changes

- Compile Solid JSX through the esbuild JavaScript API while preserving the shell build interfaces
  and `dist/` output. Add Solid/compiler dependencies and the generated dependency lockfile.
- Keep campaign progress in the current session, with unlimited retries that retain fragments and
  completed milestones. Pause and clear input when gameplay loses focus.

### Fixes and Maintenance

- Correct seven infrastructure lint findings and prevent menu Escape from bubbling into a second
  pause after resume.
- Align the complementary receptor pocket with binding contact; move nucleosome artwork with
  its platforms; keep lipid bilayers visible and HRE/recruitment labels readable.
- Expand short campaign routes after the initial controls-only walkthrough measured 122.752
  wall seconds. Preserve fast movement and unlimited checkpoint retries.
- Cover authored checkpoint activation and restoration, and instrument browser animation frames
  to verify one scheduled loop through UI changes.

### Decisions and Failures

- Use a generic nuclear steroid-receptor example and a continuously open pore route; movement
  abilities and obstacle geometry are arcade abstractions.
- Install the missing Playwright Chromium browser. macOS MachPort restrictions require elevated
  browser execution in this sandbox.

### Developer Tests and Notes

- Expanded static specification review verifies 381 unique entity IDs and 64 supported,
  hazard-free authored checkpoint spawns. Final quality and rendered campaign review are pending.
- Fresh `./check_codebase.sh` passes both typechecks, lint, formatting, and nine Node behavior
  tests; `./build_github_pages.sh` passes. Rebuilt browser smoke passes two tests, including
  keyboard focus, pause/retry, stable canvas identity, and animation-loop observations.
- Fresh repository hygiene: `source source_me.sh && python3 -m pytest -q` passes 964 tests;
  `git diff --check` passes. These checks precede the final documentation closeout.
- The expanded built-artifact walkthrough is pending. The 8-12 minute first-play target and
  human enjoyment remain unverified. Temporary browser artifacts stay under ignored
  `test-results/`. Agents performed local build/verification without a remote deployment
  action; the user confirms an existing live GitHub Pages site.
- User-requested progressive obstacles and cellular debris are in progress; final closeout
  waits for those changes and their rebuilt-artifact verification.
- User-requested schematic binding flexibility is in progress. Preserve the steroid's red
  identity and four-ring scaffold; document the specific paper's limited scope.
- User-requested algorithmic sound design is in progress; keep audio optional and initially muted.
- User-requested stronger visible steroid motion is in progress; document its deliberately
  exaggerated schematic scale while retaining the connected ring scaffold.
