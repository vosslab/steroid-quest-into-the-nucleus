# User steering quality review

## Outcome and scope

Fresh quality review finds no material defect in the reviewed steering changes. This pass
owns this report only and makes no implementation changes. Reviewed source includes the
pause-state correction, amplified free-steroid motion and bound pucker, cellular debris,
55 additional authored obstacles, and the README refresh.

This is a source and existing-evidence review. The manager retains final rebuilt browser
acceptance; the earlier full walkthrough does not cover the latest audio/art amplification.
Human first-play duration and subjective movement/sound appeal remain unverified.

## Audio lifecycle and output

- [src/audio.ts](../../../src/audio.ts) creates its context and cached seeded noise only
  through the unmute command. [src/app.tsx](../../../src/app.tsx) supplies that command
  from the Sound button. Initial UI and audio states are muted.
- Regional patterns use the existing runtime frame callback rather than another timer or
  animation loop. Pulse scheduling advances from current audio time, so suspended frames
  do not create a catch-up backlog. Foreground sequences have short bounded delays.
- The 36 tracked-main-voice cap bounds synthesis; FM adds at most one modulator per tone.
  Source completion removes tracked voices and disconnects associated nodes. Muting and
  pausing cancel future envelopes and stop sources. Already started modulators finish
  their bounded original schedules while disconnected or behind a muted carrier.
- Pause detection depends on entry to the paused phase, including respawn and transition.
  [src/runtime.ts](../../../src/runtime.ts) calls audio update synchronously after pause,
  so focus loss silences current and scheduled cues without awaiting another frame.
  Replay clears old cues through the elapsed-time reset. Resume schedules current pulses
  without replaying previously scheduled effects.
- Disposal is idempotent, stops voices, and closes the created context. A pending resume
  rejection after disposal or context closure is handled without restarting synthesis.
  No new input listeners or external audio resources are introduced.
- Current temporary `test-results/audio/probe.json` records finite, nonzero output for
  all nine cue variants and all six regional patterns. A 500-event stress run reports
  72 oscillators and peak 0.3103. Lifecycle output is exactly zero after ordinary pause,
  mute, respawn-phase pause, and transition-phase pause, and the final context is closed.
  These measurements support resource/output acceptance; this reviewer did not rerun
  the probe or substitute these measurements for listening judgment.

## Rendering and geometry

[src/debris.ts](../../../src/debris.ts) keys procedural material to stable world cells,
raises density across each region and through the pre-transcription journey, and clears
some density for the final machinery scene. Debris renders behind scenery, platforms,
hazards, and markers. It never enters collision or progression data.

[src/drawing.ts](../../../src/drawing.ts) applies the same projection to shared steroid
vertices and the receptor pocket, preserving the fused four-ring scaffold and visible red
ligand. [src/renderer.ts](../../../src/renderer.ts) amplifies free flex, tilt, and bob and
settles binding toward a stable pucker. These are canvas transforms; simulation collision
rectangles remain authoritative. Animation uses simulation elapsed time, which freezes
while paused. Replay resets the rendering transition. Reduced motion suppresses free
oscillation and shows a settled bound shape directly. Moving platform artwork continues
to follow its collision rectangle under reduced motion.

The level additions occupy broad stationary terraces. The specification review's spawn
and receptor/HRE keepout inspection and the independently recorded ordinary-control
walkthrough cover current obstacle geometry. Neither source inspection nor pixel-only
changes establish enjoyment or the intended first-play duration.

## Documentation and input boundaries

[README.md](../../../README.md) provides the confirmed live link, playable journey,
controls, checkpoint/retry behavior, optional sound, canonical preview and verification
commands, and a clear distinction between local output and remote publication.
[SOLID_MODEL.md](../../SOLID_MODEL.md) separates illustrative conformational adjustment
from chemical reaction, measured atomic displacement, and universal steroid specificity.
The optional in-game biology copy makes the same schematic limitation clear.

[src/input.ts](../../../src/input.ts) retains the ASVS 2.2.1 explicit key allowlist and
canvas-focus ownership boundary. Audio and artwork changes do not add keyboard capture,
alter progression ordering, or let render-only state write simulation state.

## Final acceptance handoff

No correction is requested by this review. Integrate the audio owner's final evidence,
complete current changelog/decision notes, and run the manager's final built-artifact
browser checks before delivery. Keep the latest audio/art checks separately labeled
from the earlier complete campaign walkthrough.
