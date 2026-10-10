# Expansion named steps

## D10 correction

`EncounterStep.id` is required and stays a stable local name within its encounter. Chamber
validation rejects missing, empty, non-local, and duplicate step IDs. The compiled encounter ID
provides the stage/chamber namespace; step IDs remain local, so separate encounters can reuse a
step name.

The new authoring helpers resolve names against the supplied sequence:

- `phaseAfter(sequence, stepId)` returns the completed-step threshold immediately after that step.
- `phaseBefore(sequence, stepId)` returns the completed-step threshold before that step completes.
- Unknown references throw `Unknown encounter step reference: <stepId>` during authoring.

Both helpers return numbers. `PhaseCondition`, `encounterPhases`, simulation, rendering, and runtime
retain their numeric phase model. The compiler continues to reject invalid numeric phase ranges.

## Authoring example

```ts
import { phaseAfter, phaseBefore } from "./encounter_phases";

const activeWhen = {
  encounterId: "membrane_loop",
  min: phaseAfter(membraneLoop.sequence, "outlet"),
  max: phaseBefore(membraneLoop.sequence, "return_pocket"),
};
```

The current threshold stays `3..3`. Inserting or moving steps before the named boundaries changes
the returned thresholds without changing those references. Resolve the helpers from the final
authored sequence when constructing its conditions.

All existing campaign phase conditions now call the helpers. This preserves the membrane inlet
cutoff, backward sweep, return-pocket activation, receptor trigger, chromatin current, and HRE
trigger behavior. Transcription has no authored encounter sequence or phase conditions to migrate.

## Files changed

- `src/types/level.ts`: required local `EncounterStep.id` contract.
- `src/levels/encounter_phases.ts`: two small exported numeric threshold helpers.
- `src/levels/chamber_validation.ts`: per-encounter ID validation.
- `src/levels/cell.ts`: stable names for all steps and helper-based phase conditions.
- `src/levels/nucleus.ts`: stable names and helper-based current/biological trigger conditions.
- `tests/test_level_sections.mjs`: named fixtures, insertion/reorder gate behavior, unknown-reference
  checks, and missing/empty/duplicate local-ID rejection.
- `tests/test_surprise_patterns.mjs`: fixture step IDs.
- `tests/test_simulation.mjs`: fixture step IDs.
- This report.

`section_specs.ts`, `surprise_patterns.ts`, and `transcription.ts` require no implementation changes.
No core, runtime, rendering, app, or physics edits belong to this correction. Existing changes from
the other M1 owners remain in place; the Git diff includes their earlier work.

## Verification

- Baseline and final `npx tsc --noEmit -p tsconfig.json`: exit 0, zero diagnostics.
- `node --import tsx --test tests/test_level_sections.mjs tests/test_surprise_patterns.mjs
  tests/test_simulation.mjs`: 30 passed, zero failures. The three new tests cover compiled numeric
  gate behavior after insertion and reorder, helper endpoints/unknown references, and local ID
  rejection. Local IDs survive translation and may be reused in a different encounter.
- `npx eslint src/types/level.ts src/levels/encounter_phases.ts
  src/levels/chamber_validation.ts src/levels/cell.ts src/levels/nucleus.ts
  tests/test_level_sections.mjs tests/test_surprise_patterns.mjs tests/test_simulation.mjs`: exit 0.
- `npx prettier --check` on the same eight source/test paths: exit 0.
- `git diff --check`: exit 0.

The new missing-ID test caught JavaScript regex coercion of `undefined`; validation now checks
that the ID is a string before matching the local-name rule.

The manager owns fresh specification and quality review, full integration acceptance, and built
artifact acceptance. This focused correction does not establish M2 authoring or campaign pacing.

## Durable documentation handoff

The manager can record this correction in the shared changelog without overlapping this owner:

- Require stable encounter-step names and resolve authored phase windows by name; reject invalid
  local step IDs and preserve numeric runtime phase counts.

Suggested settled decision: step identity is local to its encounter, while named authoring helpers
resolve sequence positions into the existing numeric phase condition contract.
