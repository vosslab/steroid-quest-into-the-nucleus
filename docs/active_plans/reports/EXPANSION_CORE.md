# Expansion core handoff

## Outcome and ownership

M1 simulation, input, progression, and runtime consumers implement the shared expansion contracts.
No renderer, application, audio, level, or type files were changed by this owner. Source remains
within the 999-line limit; `src/simulation.ts` is 813 lines. The manager owns the coordinated
changelog entry and subsequent fresh specification, quality, and built-artifact acceptance.

| Requirement | Implementation |
| --- | --- |
| Optional held Up/Down, opposing cancellation, existing Space/horizontal movement | `src/input.ts`, `src/constants.ts`, `src/simulation.ts` |
| One shared derived current/completed/total/readiness observation | `src/progression.ts` |
| Required order, independent optional steps, region/contact/capture/delivery/milestone sources | `src/simulation.ts` |
| Endpoint delivery excludes manual, held, collision, or missing-route release | `src/simulation.ts` |
| Completion autosaves and preserved phases; Replay resets | `src/simulation.ts`, `src/game_state.ts` |
| Biological ordering and missing-objective destination redirect | `src/simulation.ts` |
| One-second capture/transition, immutable replacement snapshots, pause/resume/retry/single commit | `src/simulation.ts`, `src/game_state.ts`, `src/constants.ts` |
| Buffered input clear, next-level render preview, readonly browser observations, existing single RAF | `src/runtime.ts` |
| Focus, movement, ordering, recovery, biology, and transition behavioral checks | `tests/test_input.mjs`, `tests/test_simulation.mjs` |

`getEncounterProgress(level, phases)` finds the first incomplete required encounter, counts completed
required encounters, and derives ready status from the existing phase map. It throws for a missing
required ID, rather than treating invalid authored metadata as ready. It stores no completion state.

## Settled manager decisions

- D5: Exploration markers save only before the first required completion, at order zero regardless
  of their authored order. Continuous contact with the same marker emits one save event. Optional
  encounter completion does not autosave. Neither optional source can replace or block a required
  completion checkpoint.
- Required capture/delivery partial phases persist through retry and early escape. Recapture
  leaves the already-observed capture step intact, allowing endpoint delivery to finish its pending
  step. Transport availability and return routes must remain authored for that pending phase.
- D8: If a stage declares a required step for an unachieved biological milestone, simulation accepts
  its trigger only while that exact milestone is the current required step. Existing achieved flags
  persist. Synthetic stages without a required milestone retain the causal receptor/HRE guard.
- Completing an encounter changes recovery state without teleporting the moving player. Attached
  movement still observes regions and obstacle contact; endpoint delivery is a distinct observation.

## Runtime observations

The canvas exposes `data-required-completed`, `data-required-total`, `data-current-encounter-id`,
`data-current-objective`, `data-destination-id`, `data-destination-ready`, `data-destination-x`,
`data-destination-y`, `data-transition-elapsed`, `data-transition-duration`, and
`data-transition-destination-id`. Destination readiness includes an actual onward destination,
campaign successor, and biological guards. These extend existing readonly browser observations;
simulation never consumes DOM attributes. No writable browser test API or second animation loop
was introduced. Render snapshots receive `nextLevel` without running a preview simulation.

## Verification

Commands run after implementation:

```sh
node --import tsx --test tests/test_input.mjs tests/test_simulation.mjs
npx tsc --noEmit -p tsconfig.json
npx eslint src/input.ts src/constants.ts src/game_state.ts src/progression.ts \
  src/simulation.ts src/runtime.ts tests/test_input.mjs tests/test_simulation.mjs --max-warnings 0
npx prettier --write --ignore-path .gitignore --ignore-path .prettierignore \
  --ignore-path .prettierignore.local src/input.ts src/constants.ts src/game_state.ts \
  src/progression.ts src/simulation.ts src/runtime.ts tests/test_input.mjs tests/test_simulation.mjs
git diff --check
```

- Focused tests: exit zero, 18 tests passed, zero failures.
- Integrated project TypeScript check: exit zero, zero diagnostics after concurrent consumer
  migration landed. An earlier check had expected level/compiler/renderer migration errors and
  zero diagnostics in core-owned files; it is superseded by the passing project check.
- Scoped ESLint: exit zero, no warnings.
- Only owned source/test files were formatted. Whitespace check: exit zero.

The existing collision, bounded transport movement, safe manual release, sticky escape, acid
recovery, and transcription tests pass alongside the new behavior. The security-guidance skill's
ASVS 2.2.1 keyboard allowlist/finite timestep checks and ASVS 2.3.1 sequential progression apply to
local gameplay contracts, not an anti-cheat service.

## Remaining acceptance boundary

These are focused behavior and integrated type/lint checks. The owner has not claimed expanded
campaign traversal, three-key reachability, 8-12 minute pacing, renderer/audio acceptance, remote
publication, or the complete M4 gates. Fresh reviewers and the manager must assess the built
artifact and authored routes. Authored transports must remain capturable through a pending
delivery phase, and completed checkpoint spawns must remain calm with permanent return routes.
