# Infrastructure specification review

Verdict: PASS for infrastructure movement-preview specification acceptance. The manager reports
passing typecheck, repository checks, build, and two rebuilt browser smoke tests. Fresh quality
review remains a separate gate. This reviewer changed no production code.

## Findings and corrections

The first UI review found recruitment instructions without visible timing feedback. The fresh
correction agent added a white marker and outlined success bracket (`src/renderer.ts:175-203`).
Its 1.4-second period and 20%-80% zone match simulation timing acceptance.

Escape resume initially called `play("resume")` without stopping propagation
(`src/app.tsx:73-77`). Resume synchronously focuses canvas, so the same keydown reaches window
input, sees canvas focus, and pauses again. Preventing default alone cannot prevent this.
The fresh correction adds `event.stopPropagation()` before resuming (`src/app.tsx:76`), verified
in this review. The manager reports passing rebuilt browser Escape-resume coverage.

## Reviewed contracts

- `src/simulation.ts:84-162` implements moving-platform carry, acceleration, momentum, coyote
  time, buffered variable-height jumping, one-way landings, bounce surfaces, and air-jump reset.
  Recovery and transitions are 0.4 and 0.45 seconds (`src/constants.ts:14-15`).
- Checkpoint restore preserves collections and milestones (`src/simulation.ts:47-58`). Receptor
  binding grants an air jump and immediate checkpoint (`src/simulation.ts:197-206`). Receptor/HRE
  prerequisites gate recruitment and stage exits (`src/simulation.ts:207-226`). Recruitment
  holds position, permits repeated misses, and preserves completed actions on retry
  (`src/simulation.ts:252-270`, `src/simulation.ts:282-298`). Replay resets session progress.
- Explicit keyboard mapping and canvas-focus ownership live in `src/input.ts`; held keys clear
  on focus/visibility loss. `src/runtime.ts` has a single fixed-step animation loop, consumes
  jump presses once, pauses on focus loss, and resizes backing pixels without changing physics.
  Disposal removes animation, input, observers, preference listener, renderer, and audio.
- Solid constructs runtime once and disposes it and caption timeout (`src/app.tsx:92-99`).
  Its unconditional canvas (`src/app.tsx:155`) survives menu/HUD updates. Events copy scalar
  signals rather than simulation ownership (`src/app.tsx:28-48`). Menus contain keyboard focus.
- Decorative geometry is separate from collision geometry. Rendering uses shared platform
  positions. Reduced motion freezes decoration while platforms remain synchronized with physics.
  The transformed receptor retains red steroid (`src/drawing.ts:116`) and matching HRE shape.
  Synthesized audio starts muted and initializes after unmute (`src/audio.ts:10-18`).
- UI includes objectives, controls, optional tally, ability state, captions, pause/retry, ending,
  and replay. Optional explanation avoids universal pore/receptor-location claims
  (`src/app.tsx:316-319`).

## Acceptance scope

The current training stage intentionally has no campaign exit. Static infrastructure review
cannot establish six-stage completion, safe authored receptor checkpoints, scenery continuity,
jump-distance tuning, enjoyment, or the 8-12 minute target. Content must keep IDs unique across
stages, place receptor binding safely, and make milestones reachable before gated exits.

Browser checks must separately verify movement, pause/resume including Escape, focus-loss
recovery, retry, HUD updates, sound interaction, stable canvas identity, and no duplicate loops.
Full campaign acceptance requires real-control progression and rendered evidence for six regions,
transformation, transcription, and ending. The manager reports two browser tests passing in
2.4 seconds for movement, pause via Escape/button, focus loss, retry, HUD, and stable canvas.
Those reported results support this batch, not full campaign or playability acceptance.
