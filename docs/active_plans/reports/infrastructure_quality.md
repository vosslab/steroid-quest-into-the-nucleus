# Infrastructure quality review

Verdict: PASS for the movement-preview infrastructure. No material correctness,
lifecycle, or maintainability defects found in the reviewed implementation.
This was a fresh static quality review; the manager's passing check/build and two
browser smoke results were reported evidence, not independently rerun here.
No production files were changed.

## Evidence reviewed

- Runtime creation occurs once in Solid `onMount`, with disposal and caption timer
  cleanup in `src/app.tsx:93-100`. The canvas is unconditional (`src/app.tsx:155-164`).
  Runtime has one scheduled animation chain (`src/runtime.ts:88-115`), explicit
  disposal protection, cancellation, and listener/observer/audio cleanup
  (`src/runtime.ts:144-153`). UI signals do not own mutable simulation state.
- Input admits explicit keys only while canvas owns focus, ignores command repeats,
  clears movement and pending jumps on focus loss, and removes every installed
  listener (`src/input.ts:18-77`). Escape resume stops propagation before canvas
  focus changes (`src/app.tsx:73-78`). Pointer HUD controls preserve canvas focus.
- Fixed steps consume a jump press once across catch-up iterations
  (`src/runtime.ts:92-99`). Pause preserves the actual suspended phase, including
  recovery/transition/recruitment, and freezes elapsed time
  (`src/simulation.ts:241-279`). Retry preserves milestone and collection sets;
  replay replaces session state (`src/simulation.ts:47-54`, `282-297`).
- Platform carry uses successive shared platform positions before movement
  (`src/simulation.ts:84-90`). Landing, underside collisions, one-way surfaces,
  bounce behavior, jump cut, buffering/coyote time, and air-jump reset have coherent
  ownership in the controller (`src/simulation.ts:91-163`). Rendering uses the same
  platform geometry and simulation clock (`src/renderer.ts:53-55`).
- Recruitment timing and visible marker use the same 1.4-second period and
  20%-80% success region (`src/simulation.ts:260-265`, `src/renderer.ts:175-203`).
  Retry cannot undock the complex or erase successful recruitment actions.
  Receptor and HRE prerequisites gate the corresponding campaign transitions.
- Canvas effects use bounded loops, stable decoration, balanced context saves,
  and separate decorative/collision geometry. Reduced motion freezes optional
  decoration while moving platforms remain synchronized. Audio resources are
  lazy, initially muted, disconnected after cues, and closed on disposal.

## Acceptance limits

The smoke tests exercise real movement, pause through buttons/Escape, menu focus,
focus-loss held-key clearing, retry, HUD consistency, canvas identity, and browser
errors. They do not independently establish jump/landing/carry correctness,
transformation, ordered completion, replay, or duplicate-loop timing; static loop
ownership supports the latter. Focused simulation tests and the final campaign
browser walkthrough remain required by the approved plan.

Authored level files were intentionally outside this review. Safe checkpoint
locations, collectible reachability, six-stage continuity, transcription framing,
and the 8-12 minute/enjoyment target require the fresh integrated campaign review.
