# Expansion presentation handoff

## Scope and status

Presentation source is ready for integrated build and fresh review. This handoff implements the
presentation requirements in [longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md) against
the settled destination, transition, and ordered encounter contracts. Built visual acceptance
belongs to the manager's integrated batch; no independent campaign acceptance is claimed here.

## Requirements and implementation

| Requirement | Source and behavior |
| --- | --- |
| Recognizable destinations | `src/destination_art.ts` draws a motor-carried vesicle, porous nucleus, receptor pocket, chromatin coil, and response element beside a gene locus. Generic exit-chevron rendering is removed. |
| Locked and ready states | Destination bodies remain subdued before completion. Outer segments show required encounters completed; the capture ring and readiness label brighten on completion. |
| Required action clarity | `src/app.tsx` displays the ordered current encounter objective, current gameplay action, compact segments, and required count independently of optional captions. |
| Active target and return cue | `src/journey_presentation.ts` resolves explicit step kinds to their region, surface, transport entrance/delivery, or biological milestone. `src/renderer.ts` highlights the current target and supplies an offscreen compass. Near an unfinished destination the cue says `Return to:` with the missing action. |
| Calm recovery | Completion checkpoint markers surround authored calm spawns. Completed encounters show `CALM RETURN`; future calm areas remain subdued. Existing independent checkpoint markers remain supported. |
| Simulation-timed transition | The source scene zooms and centers toward its destination using only `state.transition.elapsed / duration`, then blends a readonly next-level entrance preview. Source stage HUD remains until the authoritative simulation commits (D7). |
| Reduced motion and pause | Reduced motion crossfades with no transition scaling or camera pan. Drawing uses simulation elapsed/level time, so paused transition composition and effect ages freeze. No timers or second simulation drive the preview. |
| Biological continuity | Both source and entrance preview draw the existing steroid or bound receptor complex. The receptor renderer retains its red steroid scaffold, and the existing HRE/promoter/polymerase/connected-RNA payoff stays intact. |
| Audio feedback | `src/audio.ts` adds a rising three-tone ready cue and a longer rising airy transition-start cue through the existing bounded synthesis helpers. Existing pause, focus-loss, mute, retry, and disposal cleanup applies. |
| Optional thrust help | Title, pause, and canvas accessible name identify Up/Down as optional fine control. Left/Right/Space retain the primary controls positions. |
| Larger-world rendering | Layers cull geometry outside a padded camera viewport; broad straight-current arrow grids draw only their visible rows and columns. Transition channel-route opacity respects scene blending. |

The return compass communicates direction, not a guaranteed collision-safe straight route. No line
crosses solids. Content owns the permanent descent and return geometry and its visible currents.
This implements the manager's clarified return-cue boundary.

## Ownership and lifecycle

Edited `src/app.tsx`, `src/audio.ts`, `src/renderer.ts`, `src/kinetic_art.ts`,
`src/surprise_art.ts`, and `src/style.css`. Added `src/journey_presentation.ts` and
`src/destination_art.ts`. No core, runtime, level, type, test, or Git index edits belong to this lane.

The persistent canvas, existing runtime mount/cleanup, one animation loop, focus containment,
simulation progression authority, and session-only progress remain in their existing owners.
The HUD stores scalar derived values updated by the existing event-driven batch. It never writes
encounter phases, destination state, or transition time.

## Exact checks

- `npx tsc --noEmit -p tsconfig.json`: PASS, exit 0, no diagnostics after implementation.
- `npx eslint --max-warnings 0 src/app.tsx src/audio.ts src/renderer.ts src/kinetic_art.ts src/surprise_art.ts src/journey_presentation.ts src/destination_art.ts`: PASS, exit 0, no diagnostics.
- `npx prettier --check --ignore-path .gitignore --ignore-path .prettierignore --ignore-path .prettierignore.local src/app.tsx src/audio.ts src/renderer.ts src/kinetic_art.ts src/surprise_art.ts src/journey_presentation.ts src/destination_art.ts`: PASS, all matched files formatted.
- `git diff --check`: PASS, no diagnostics.

The first typecheck found use of `Array.at`, unavailable under this repository's ES2020 library
contract. Direct indexed access replaces it; the subsequent check passes. Only owned TypeScript
files were formatted.

## Acceptance still required

The manager owns the integrated build and actual-controls browser acceptance. Fresh specification
and quality reviewers should inspect recognizable objects, active objective wording, early
destination return cues, all five transition captures, reduced motion, narrow title/pause menus,
sound silence, and stable canvas identity. Images must be visually inspected after that batch.

No subjective listening, final rendered-image acceptance, pacing measurement, or remote publication
is claimed by these source checks. The destination motifs are authored editable Canvas drawing code.
Shared documentation and changelog updates are reserved for the manager's closeout.
