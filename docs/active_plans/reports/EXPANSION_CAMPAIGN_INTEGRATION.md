# Campaign composition integration

## Status and scope

Source composition is frozen for fresh specification, quality, and final integration review.
The manager released wrapper integration after all four M3 stage owners froze their modules.
The approved [longer_cellular_journeys.md](../../archive/longer_cellular_journeys.md) remains the authority.

Edited only [cell.ts](../../../src/levels/cell.ts),
[nucleus.ts](../../../src/levels/nucleus.ts),
[test_level_sections.mjs](../../../tests/test_level_sections.mjs), and this report.
[test_surprise_patterns.mjs](../../../tests/test_surprise_patterns.mjs) needed no further changes:
its inline recipe fixtures already protect translation, recovery, and named delivery references.
Preserved concurrent work and made no Git index changes.

## Composition and sizes

The cell wrapper imports membrane, cytoplasm, and envelope in biological campaign order.
The nucleus wrapper imports receptor and DNA. Both retain explicit readonly `LevelDefinition[]`
contracts. [levels.ts](../../../src/levels.ts) appends the existing transcription level.

Removed the obsolete cytoplasm/envelope/receptor/DNA short-stage data and their unused compilation,
recipe, and phase-helper imports from the wrappers. The wrappers shrink from 261 and 218 lines to
10 and 5 lines: 479 to 15 total, removing 464 physical lines. Stage geometry and objectives have one
editable home each. Shared compiler/core modules and transcription were not edited.

The import probe records this current inventory; these sizes and counts are development evidence,
not permanent assertions.

| Stage source | Export | Source lines | World size | Required encounters | Steps | Destination |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `membrane.ts` | `MEMBRANE_LEVEL` | 663 | 6000 x 1800 | 4 | 23 | Vesicle |
| `cytoplasm.ts` | `CYTOPLASM_LEVEL` | 809 | 10200 x 1800 | 5 | 26 | Nucleus |
| `envelope.ts` | `ENVELOPE_LEVEL` | 525 | 5600 x 1800 | 3 | 18 | Receptor |
| `receptor.ts` | `RECEPTOR_LEVEL` | 560 | 7900 x 1800 | 4 | 17 | Chromatin |
| `dna.ts` | `DNA_LEVEL` | 752 | 7600 x 1800 | 5 | 25 | Response element and gene |
| `transcription.ts` | `TRANSCRIPTION_LEVEL` | 51 | 1600 x 620 | 0 | 0 | Finale |

All required stages compile local placements and stable primitive/step references through the
shared compiler. Whole-campaign import executes its cross-chamber spawn, swept-obstacle, hazard,
field, and transport-path safety checks. No cross-chamber safety failure was found.

## Permanent behavior checks

The campaign check preserves biological stage order and destination motifs. Every required
encounter has a completion save ordered by the required list and a readable objective. Each
traversal stage retains a full-height downward return.

Removed the obsolete assumption that the envelope's first encounter contains no contact steps.
The circulation approach now legitimately uses deflection. The replacement locates the named
`pore_mouth` and `pore_crossing` steps, derives their shared crossing height, and verifies a real
player-radius corridor against every obstacle and hazard. Inflated spatial and motion samples
cover continuous space and obstacle orbits. Checking all obstacles independent of phase conditions
ensures that a conditional wall cannot close this corridor. Crossing finishes its required
encounter immediately, preserving the completion-save behavior.

The first integrated Node run exposed another old content assumption: the DNA trigger must have
an explicit `activeWhen` condition. The new HRE trigger correctly relies on the simulation's
required milestone guard. Replaced that structural check with simulation behavior for the actual
receptor and HRE triggers: early contact cannot bind; the current milestone binds, advances its
phase, and saves a completed encounter. This unit setup assigns prior phases deliberately to
isolate the guard. It is not actual-controls traversal evidence.

No permanent assertion pins coordinates, chamber inventory counts, durations, or force tuning.
Failure means correcting the authored crossing/trigger or its simulation contract with the
responsible owner, then rerunning the behavior check and relevant built route. Tests must not be
weakened to admit a closed pore, bypassed milestone, or missing save.

## Commands and results

All commands ran from the repository root without building or modifying `dist/`.

| Command | Result |
| --- | --- |
| `node --import tsx --test 'tests/test_*.mjs'` | PASS: 38 tests, zero failures |
| `npx tsc --noEmit -p tsconfig.json` | PASS |
| `npx tsc --noEmit -p tsconfig.lint.json` | PASS |
| `npx eslint --max-warnings 0 src/levels/cell.ts src/levels/nucleus.ts tests/test_level_sections.mjs tests/test_surprise_patterns.mjs` | PASS |
| `npx prettier --check --ignore-path .gitignore --ignore-path .prettierignore --ignore-path .prettierignore.local src/levels/cell.ts src/levels/nucleus.ts tests/test_level_sections.mjs tests/test_surprise_patterns.mjs` | PASS |
| `git diff --check` | PASS |
| `source source_me.sh && python3 -m pytest tests/test_markdown_links.py -q` | PASS: 94 tests |

The inventory probe imported `CAMPAIGN` with `node --import tsx --input-type=module` and printed its
stage IDs, world sizes, ordered required IDs, step totals, and destination motifs. The same complete
import executes in the permanent Node suite. No compiler safety exception occurred.

## Frozen source identity

SHA-256 stage hashes match the owner handoffs. Transcription's integration-entry hash remains
unchanged.

```text
9bbcfbdf6810bf60eeb6725ea6675b8d5ce442bb6ad2baf399880686940f7d18  src/levels/cell.ts
97e61148df5300d6ccc48e5c4766b0ea4a2a8011869c5b389becf64277a009a2  src/levels/nucleus.ts
e19b7849fe624b369e7f1f38c5fbeab836fa0587b07afbce10b47c5d27613881  tests/test_level_sections.mjs
b77aa6c0c98cb006da097445fe575e1f2880e00b8062306ea47d08ade07dffe4  src/levels/membrane.ts
5c36fb36dad1821123cd79c1761222bee6db6f1e638639da977643578cfe3544  src/levels/cytoplasm.ts
1e024b0b8371430f4a87537f57735ce6ef877320e6edce71f9c1e3edc56a8b64  src/levels/envelope.ts
1281ec72fed912b031552d914aa34e4b452333dc0932ab2e6e949581131366c9  src/levels/receptor.ts
5e38cb7537ff584ca9104f3b1ec65c004965a342ae8c090ba9ea710956f56c73  src/levels/dna.ts
5db37f76bf8aab75e7c3b1c6e8c799ce8e9623e5900259eb9a139f07190f054b  src/levels/transcription.ts
```

## Acceptance boundary

Owner source control probes remain development evidence. This handoff establishes typed shared
composition, meaningful permanent checks, and compiler safety. Fresh reviews and actual-controls
built campaign traversal, shortcuts, recovery, presentation, lifecycle, and two 8-12 minute runs
remain required. The manager owns full gates, final build, local preview, and evidence publication.
No local build or preview establishes remote publication.
