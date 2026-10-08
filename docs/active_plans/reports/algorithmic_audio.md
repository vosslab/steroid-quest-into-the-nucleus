# Algorithmic audio delivery

## Implemented

[src/audio.ts](../../../src/audio.ts) replaces the original single sine cue with procedural
Web Audio textures and melodies. No sound assets or dependencies are required. Sound starts
muted, and the first explicit unmute gesture creates the context.

- Membrane: filtered seeded-noise swishes.
- Cytoplasm: glassy FM plucks.
- Envelope: soft resonant tones with airy noise.
- Receptor: two beating tones converge over 1.6 seconds, then a consonant chord resolves.
- DNA: short plucks with an eleven-step motif.
- Transcription: quicker pentatonic pulses, recruitment chordlets and percussion, and a warm
  ascending ending flourish.

Quiet background pulses use five-hit Euclidean distributions with eleven- or thirteen-step
phrases, a slowly shifting scale index, movement-dependent gain, and restrained stereo position.
Foreground events briefly duck the background by suppressing new background notes. Jump and
landing cues follow observed movement transitions. Missed recruitment gets a short retry cue.

[src/runtime.ts](../../../src/runtime.ts) calls audio update from its existing RAF and immediately
on pause so hidden-tab/focus-loss silence does not depend on receiving another animation frame.
There is no audio timer, additional animation loop, or queued catch-up sequence. Muting and
entering pause/title fade-stop active sources, including death/transition tails. Ending retains
its flourish; replay clears it. Notes are capped at 36 primary voices, with at most one FM
oscillator per primary voice, a conservative master gain, and compressor. Disposal stops voices
and closes the context. After activation the context stays silently running while muted/paused;
this avoids suspend/resume promise races. Browser resume rejection produces a targeted diagnostic
and allows a later sound toggle to retry.

## Verification

- `npx tsc --noEmit`: passed.
- ESLint with zero warnings on owned source files: passed.
- Prettier check on owned source files: passed.
- Temporary Chromium OfflineAudioContext probe rendered all nine foreground variants and all
  six region timbres. Every sample was finite. Foreground peaks were 0.0111 to 0.0900; ambient
  peaks were 0.00180 to 0.00581. No rendered cue clipped.
- A 500-event burst created 72 oscillators total, matching 36 primary plus 36 FM voices; peak
  remained 0.3104. Additional notes were refused at the voice bound.
- Realtime Chromium analyser: audible signal before pause; exactly zero after 100 ms for normal
  pause, mute, pause during a death/respawn tail, and pause during a stage-transition tail.
  No context existed before unmute, and context state was `closed` after disposal.

Temporary probe: `/private/tmp/steroid_audio_probe.mjs`.
Ignored evidence: `test-results/audio/probe.json` and
`test-results/audio/receptor-convergence.wav` (3-second mono WAV).

These measurements validate signal generation, conservative levels, and lifecycle behavior.
No subjective listening review was claimed. The WAV is available for audition. The built-game
browser walkthrough and full repository acceptance belong to the manager's final integration.
No `dist/` rebuild was performed by this lane.
