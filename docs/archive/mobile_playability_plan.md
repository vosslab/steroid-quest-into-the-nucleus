# Mobile playability ledger

Status: implementation and automated acceptance complete, 2026-11-15.

Owner: steroid implementation agent. Scope: this repository only. Approval: manager-dispatched
mobile plan, with autonomous agent acceptance and no publication or commits.

## Required outcomes

- M1/2: use the existing locked dependencies; establish a passing check/build baseline.
- M7-10: typed app/runtime/input touch refs; independent keyboard and touch sources; a relative
  direction pad with a 12 CSS pixel deadzone; separate Pulse with a pending tap edge and held
  thrust; owned pointer capture and complete release/reset/disposal.
- M17: external landscape controls, full logical 960 by 540 camera, safe-area/dynamic-viewport
  fit, current objective and Pause visible; portrait pause and explicit landscape Resume;
  focused tests, actual-touch campaign, required integration gates and updated documentation.

## Architecture and limits

Keep the simulation, physics, levels, checkpoints, session saves and InputFrame unchanged.
Keep one mounted canvas/runtime. Sample one pulse edge on only the first fixed catch-up step.
ASVS 2.2.1 applies at the DOM boundary: accept touch pointers only, one ID per control, finite
coordinates and coarse landscape input while the canvas owns focus. Pointer cleanup never
changes the other input source's held state. Normal Pulse release retains a pending edge;
cancellation, lost capture and resets discard it.

## Completion evidence

- Baseline: `npm ci --cache /Users/vosslab/.cache/npm`, `./check_codebase.sh` (38 tests),
  and `./build_github_pages.sh` passed before edits. The default home npm cache was unwritable.
- Implementation and focused input checks: complete; final acceptance recorded in
  [the acceptance report](../active_plans/reports/mobile_playability_acceptance.md).
- Full campaign: CDP touch backend reuses the existing reference navigation and campaign
  route, records observations and screenshots, verifies served artifact hashes, and rejects drift.
- Final exact-artifact campaign: 531.74 active seconds, zero deaths, all 21 required encounters
  and 109 steps, three timed recruits and native Replay reset; no errors or source drift.
- Final gates: 39 Node tests, 3 browser tests and 22 independent browser matrix cases pass.
  Pytest has 1251 passes and one unavailable-Podman-VM guard failure; focused docs/hygiene pass.
- Source specification and quality reviews pass; final integration has the complete evidence.
  The acceptance report records exact final hashes, commands, cross-browser findings and limits.
  Temporary probes are removed, and final proof remains under `test-results/mobile-final-proof`.
