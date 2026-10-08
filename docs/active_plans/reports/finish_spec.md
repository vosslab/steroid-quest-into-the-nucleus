# Finish specification review

Disposition: focused simulation behavior and current documentation pass static review, with
the acceptance gaps below. Final finish acceptance requires correction or distinct evidence
for those gaps. This reviewer changed no product files and ran no additional test commands.
The manager reports eight Node tests, two rebuilt browser tests, and 828 pytest checks passing.

## Findings

1. **Checkpoint coverage gap.** `tests/test_simulation.mjs:120-141` checks recovery from the
   automatic receptor checkpoint, but its fixture inherits an empty `checkpoints` array
   (`tests/test_simulation.mjs:23`). General authored checkpoint activation and restoration
   (`src/simulation.ts:169-178`) therefore have no focused test. Add a behavior test that
   reaches a checkpoint after spawn, dies beyond it, and restores the authored spawn while
   preserving discoveries. Existing receptor recovery coverage should stay.
2. **Browser acceptance gap.** `tests/playwright/smoke.spec.ts:42-91` checks a preserved
   fragment count, not a count changed by collection or milestone/ability HUD updates. Neither
   browser test reaches ending or invokes Replay. The requested built-artifact walkthrough
   must verify changed HUD values, ending tally, and Replay reset through real controls, or
   add appropriate permanent behavior coverage. Node replay coverage does not establish the
   Solid ending button and signal synchronization.
3. **Evidence boundary.** `tests/playwright/smoke.spec.ts:86-89` proves the same canvas and
   one canvas element. It does not prove there is only one animation loop. Static source
   evidence is sound: one `onMount` runtime creation and `onCleanup` disposal
   (`src/app.tsx:93-100`), one frame scheduling site and disposal cancellation
   (`src/runtime.ts:88-115`, `src/runtime.ts:144-153`). Report stable-canvas browser evidence
   separately from static loop ownership unless runtime instrumentation verifies loop count.
4. **Guidance provenance.** `docs/HUMAN_GUIDANCE.md:14-15` combines the direct user request
   to implement the plan with priorities from a supplied previous-agent plan. Repository
   provenance rules keep supplied source authorship distinct (`docs/REPO_STYLE.md`, human
   guidance and design decisions). Preserve the direct implementation instruction as human
   guidance and move imported plan priorities to a settled implementation decision.

## Requirements checked

- Node tests exercise hold-versus-tap jump height, safe landing, coyote time, jump buffering,
  moving-platform carry on both axes, automatic bounce, quick hazard recovery, preservation
  of discoveries and receptor binding, one extra air jump and landing reset, binding/HRE
  prerequisites, forgiving recruitment, fixed docking, pause freeze, ending, and Replay reset.
  Assertions describe observable behavior and do not mirror exact movement constants.
- Browser smoke uses real keyboard and pointer actions and read-only observations. It covers
  start, movement, Escape and pointer pause/resume, pause focus containment, retry, focus loss,
  cleared held input, canvas identity, and absence of page errors in the first test.
- README commands match the required preview and integration interfaces. README and
  SOLID_MODEL accurately distinguish local builds from publication, session progress from
  Replay, simulation authority from UI signals, collision geometry from illustration, and
  biological examples from universal pathway claims.
- SOLID_MODEL correctly documents input allowlisting and focus ownership under ASVS 2.2.1,
  requestAnimationFrame cleanup, listeners and observer disposal, fixed logical viewport,
  optional sound initially muted, and reduced decorative motion.
- AGENTS uses concise pointers to source contracts and verification entry points. Settled
  design entries identify authoritative code/doc owners and explain consequences.
- CHANGELOG explicitly leaves full campaign and duration acceptance pending. No current
  durable document claims an observed 8-12 minute playthrough or remote publication.

## Remaining acceptance

Full six-region progression, captures, transformation readability, actual ending/Replay, and
observed duration belong to the separate campaign/browser evidence lane. Passing static
finish review and focused tests cannot establish enjoyable movement or human playability.
Refresh CHANGELOG after final evidence is available, preserving any unresolved duration limit.
