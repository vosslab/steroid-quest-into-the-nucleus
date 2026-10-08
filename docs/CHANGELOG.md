# Changelog

## 2026-10-07

### Additions and New Features

- Add TypeScript simulation contracts, Solid menus/HUD, a Canvas 2D runtime, forgiving movement,
  checkpoints, optional fragments, receptor activation, and transcription recruitment.
- Add procedural regional illustrations, reduced decorative motion, and optional synthesized sound.
- Document local preview, controls, lifecycle ownership, and biological model limits.

### Behavior or Interface Changes

- Compile Solid JSX through the esbuild JavaScript API while preserving the shell build interfaces
  and `dist/` output. Add Solid/compiler dependencies and the generated dependency lockfile.
- Keep campaign progress in the current session, with unlimited retries that retain fragments and
  completed milestones. Pause and clear input when gameplay loses focus.

### Fixes and Maintenance

- Correct seven infrastructure lint findings and prevent menu Escape from bubbling into a second
  pause after resume.

### Decisions and Failures

- Use a generic nuclear steroid-receptor example and a continuously open pore route; movement
  abilities and obstacle geometry are arcade abstractions.
- Install the missing Playwright Chromium browser. macOS MachPort restrictions require elevated
  browser execution in this sandbox.

### Developer Tests and Notes

- Foundation and infrastructure pass fresh specification and quality review. The manager's
  infrastructure checks, build, and two browser smoke tests pass.
- Final campaign integration, focused simulation tests, built-artifact walkthrough, and full
  repository hygiene checks are pending. The 8-12 minute target and human playability remain
  unverified. Temporary browser artifacts stay under ignored `test-results/`.
