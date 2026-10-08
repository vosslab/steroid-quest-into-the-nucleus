# Kinetic cell artwork implementation

## Scope

Implemented `src/renderer.ts`, `src/audio.ts`, and a focused procedural helper
`src/kinetic_art.ts`. Approved event integration also updates `src/runtime.ts` and
`src/types/render.ts`. Existing `src/drawing.ts` and `src/debris.ts` remain the
shared source for steroid, receptor, organelle materials, nucleosomes, and background debris.

## Visible behavior

- Cellular currents have sparse translucent strands, bubbles, and directional arrows.
  Their direction derives from the authored acceleration vector. All direction cues remain
  visible with reduced motion.
- Bounce platforms have a clear flat collision rim, visible spring geometry, and an arrow
  aligned to authored launch velocity. Diagonal launchers use mint bodies/arrows; vertical
  springs use pink. Contact produces a short spring recoil, upward ripple, and seven particles.
- The renderer consumes authoritative bounce events through `Renderer.play(event)`.
  The queue holds at most 16 pending events; expired launch effects clear after 0.8 simulation
  seconds. Stage changes, replay, and disposal clear transient state.
- Receptor binding adds a soft expanding wave around the existing conformation transition.
  The red steroid and its exaggerated free motion remain intact. No camera shake or flashing
  was added.
- Moving receptor-stage bodies now use vesicle artwork aligned to the same collision rectangle.
  DNA moving platforms keep nucleosome artwork aligned to authoritative platform motion.
- Successful recruitment sends colored machinery toward the promoter over 0.45 simulation
  seconds. The DNA/promoter anchor derives from the authored docking trigger. The complex
  stays at the response element. Polymerase produces one RNA ribbon with colored bases while
  small nucleotides approach the machinery.
- Reduced motion makes machinery arrivals immediate, shows the settled bound conformation,
  and presents the final RNA scene statically. Gameplay timing and the required three inputs
  remain authoritative. Pause freezes all elapsed/level-time-driven decoration.
- Bounce sound is a rubbery FM pluck rising into a whistle plus filtered noise. Audio keeps
  its existing muted default, lifecycle handling, and 36-primary-voice bound.

## Verification

- `npx tsc --noEmit`: passed for the current complete source tree.
- Focused ESLint: passed for renderer, kinetic artwork helper, runtime, render types, and audio.
- Focused Prettier check with all three repository ignore files: passed.
- Largest owned source is renderer at 413 lines; helper 145, audio 319, runtime 160.
- One-time Chromium source-only audio probe: passed, artifact
  `test-results/chaotic-cell/audio/bounce-probe.json`; reproducible probe copy at
  `/private/tmp/steroid_bounce_probe.mjs`.
  One bounce: finite samples, peak 0.02473. Stress with 500 immediately queued bounces:
  finite samples, peak 0.28679, 36 oscillators plus 12 noise buffers total including FM
  oscillators. Primary synthesis remains bounded at 36 voices. The stress peak is below 1.
- Real AudioContext lifecycle probe: default mute creates zero contexts; unmute creates one;
  bounce produces finite audible samples; pause, mute, and muted replay measure zero peak;
  disposal closes the context. Browser launch required sandbox escalation due to macOS Mach
  bootstrap denial; the approved run completed successfully.

This lane did not run a build. Built-artifact campaign, visual captures, and full integration
acceptance belong to the manager's coordinated gate. Sound measurements establish finite
output and lifecycle behavior; they do not claim subjective listening acceptance.
