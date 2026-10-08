# Built audio and motion acceptance

## Artifact and method

Fresh Chromium acceptance uses the built game served from `dist/` at
`http://127.0.0.1:8053`. The main bundle SHA-256 is
`727c34a68ed51c28e2c90b5d07f909ea7abe003db9f8a1ad764b910d6467d091`.
The audio source SHA-256 is
`7bf4c2809b1617e8c89b1a0aa7631fcb77f27ea47ea5ed208df0fe6f992450f2`;
the renderer source SHA-256 is
`73abc094cb2cdccbda9276e0b3a6a6725ee2ec067ee9f189c5ec5abde3178d88`.

The one-time browser probe starts through Start adventure and activates sound through the
real Sound button. It observes the actual output bus with an analyser and counts created
contexts and started/ended source nodes. It does not write simulation state or bypass
progression. The temporary probe was removed after acceptance.

Ignored evidence is under `test-results/audio/`; a backup is also under
`/private/tmp/steroid-audio-acceptance-backup/` in case a test runner clears outputs.

## Results

- Before the first unmute: zero contexts, zero sources, and zero output.
- After the explicit unmute and normal resume: one running context, finite nonzero output,
  and maximum sampled peak 0.005166. This measures the quiet membrane texture.
- Pause, blur/focus loss, and mute each produce exactly zero analyser signal after 130 ms.
- Twelve repeated unmute/resume/pause/mute cycles keep one context. At the final observation,
  all 12 started sources have ended, with zero active sources and zero signal. The maximum
  concurrent source count for this membrane-only run is one.
- No page errors, console errors, or warnings occur.
- Free-steroid crops at elapsed 4.40 and 6.18 seconds show visibly different ring bends,
  opposing tilt, and bob. Visual inspection confirms that the amplified movement reads
  clearly even while the player stands still.
- Paused steroid crops 550 ms apart are pixel-identical and elapsed time remains 6.18.
- Reduced-motion steroid crops 650 ms apart are pixel-identical while simulation elapsed
  time advances from 9.02 to 9.69. Decorative ligand motion is suppressed.

Machine observations: `test-results/audio/built-app-acceptance.json`.
Crops: `amplified-free-a.png`, `amplified-free-b.png`, `paused-steroid-a.png`,
`paused-steroid-b.png`, `reduced-steroid-a.png`, and `reduced-steroid-b.png` in the same folder.

## Restored audio evidence

The integration test runner cleared the earlier audio outputs. The original bounded
`/private/tmp/steroid_audio_probe.mjs` was rerun to restore `probe.json` and the 3-second
`receptor-convergence.wav` audition artifact. Its independent source-level probe again
finds finite, non-clipping output for all nine foreground variants and six regional timbres;
500 collect events create 72 oscillators, with peak 0.31034. Pause/mute/transition/death-tail
silence and context disposal pass. Details remain in
[algorithmic_audio.md](algorithmic_audio.md).

## Limits

This focused built-app pass verifies the final free-steroid amplification and live audio
lifecycle. It does not claim subjective speaker listening, eight-to-twelve-minute human
playability, or a new complete campaign walkthrough. Bound-complex screenshots and ordered
progression belong to the campaign acceptance lane; this pass does not substitute a visual
fixture for progression evidence. No product source was modified.
