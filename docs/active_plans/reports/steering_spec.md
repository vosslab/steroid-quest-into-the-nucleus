# User steering specification review

## Scope and outcome

Fresh review of progressive obstacles and cellular debris, schematic steroid flexibility,
high-jump camera visibility, the README refresh, and optional algorithmic audio. This pass
owns this report only. Static review currently finds no material defect in the completed
obstacle, debris, binding-art, camera, or README changes. Algorithmic audio source review
passes after the pause-state correction below. Built-artifact campaign acceptance remains
with the independent walkthrough owner.

## Grounded checks

- `src/levels/cell.ts:285` adds low solid hurdles and visible enzyme hazards on selected
  broad terraces. `src/levels/nucleus.ts:134` keeps moving shelves, binding, the air-jump
  lesson, and the HRE shelf clear. The obstacle owner's 55-added count comprises two
  membrane, 25 cytoplasm, ten receptor, and eighteen DNA obstacles.
- An independent `node --import tsx` inspection of the current campaign verifies no
  overlap between relevant hurdles and any authored 30-by-30 checkpoint spawn box,
  and no hurdle overlap with receptor/HRE trigger rectangles. This verifies recovery
  keepouts, not full route playability.
- `src/simulation.ts:217` preserves milestone ordering: receptor binding gates entry
  to DNA; HRE docking gates entry to transcription. New artwork and debris do not
  advance authoritative state.
- `src/debris.ts:4` increases decorative density through membrane, cytoplasm, envelope,
  receptor, and DNA. `src/debris.ts:35` increases density across each region. The final
  transcription scene deliberately clears some material for the HRE/promoter climax.
  Four stable procedural families supply protein clusters, lipid fragments, vesicles,
  and ribosomes. `src/renderer.ts:63` draws these behind platforms and markers.
- `src/drawing.ts:119` projects the shared ring vertices coherently; fused-ring edges
  remain connected. `src/drawing.ts:171` settles the receptor and pocket around the
  visible red ligand. `src/renderer.ts:21` resets the render-only transition on replay,
  follows simulation time during pause, and directly shows settled artwork under
  reduced motion. Physics and chemical identity are unchanged by the illustration.
- `src/app.tsx:339` identifies the moving scaffold and settling pocket as schematic
  flexibility rather than chemical conversion or specificity prediction.
  [../../SOLID_MODEL.md](../../SOLID_MODEL.md) states the supplied paper's particular
  unsaturated-steroid scope and avoids atomic-distance/energy claims. This review
  checks fidelity to the user's supplied quotation, not an independent paper analysis.
- `src/renderer.ts:55` permits negative camera Y so high air jumps remain visible,
  while clamping downward travel to the authored floor extent. Moving platform artwork
  still uses the collision rectangle under reduced motion (`src/renderer.ts:84`).
- README provides the working live URL near its 216-character prose opening,
  introduces the playable steroid-to-RNA journey, preserves managed screenshot
  sentinels, and explains controls, canonical preview/build commands, and model limits.
  It distinguishes the existing published site from local build acceptance and leaves
  the human 8-12 minute target explicitly unverified.

## Remaining acceptance

The final browser walkthrough must cover the new hurdles and camera/binding revisions
through ordinary controls, including hazard recovery, binding, HRE, recruitment, ending,
and replay. Static keepout checks and the owner's successful simulated route do not
establish human first-play duration or enjoyment.

## Algorithmic audio review

`src/audio.ts` replaces simple event beeps with evolving coprime pentatonic patterns,
stage roots, frequency-modulated bells, filtered seeded noise, stereo placement, movement
and landing cues, collecting arpeggios, receptor beating tones that converge, recruitment
chords, and a multitone ending. Stage character varies with density/timbre and root;
background output ducks while foreground cues play. These source mechanisms satisfy
the request for interesting algorithmic sound beyond single oscillator beeps.

Creation stays inside the unmute command; default state is muted. One cached noise buffer,
36-main-voice cap, compression, and short envelopes bound resource and loudness behavior.
The existing runtime frame loop calls `audio.update`; audio introduces no timer or loop.
Tracked source completion disconnects associated nodes, and disposal closes the context.
`src/runtime.ts:37` updates audio synchronously when pausing, including focus loss, so a
hidden page does not wait for a suspended animation frame before becoming silent.

Review found one material gap: the first draft cleared pause only if the previous frame
was actively playing, leaving death/transition tails audible when paused from those phases.
The owner corrected `src/audio.ts:279` to detect entry to paused/title independently of
the playing flag. This correction is present in reviewed source. Muting cancels scheduled
envelopes and stops voices; resume restarts pulse scheduling without replaying old cues.

The owner's temporary `test-results/audio/probe.json` provides finite, nonzero rendered
output for all nine event variants, peaks between 0.0052 and 0.0901, no context before
activation, exact-zero pause/mute analyser samples, and a closed context after disposal.
These checks establish synthesis and lifecycle behavior; subjective sound appeal remains
a listening judgment. The owner's final probe also renders all six ambient regions with
finite nonzero peaks (0.00180-0.00581). A 500-collect burst stays at 36 primary plus 36 FM
oscillators and a 0.3104 peak without clipping. The corrected respawn/death-tail-to-pause
and transition/stage-tail-to-pause paths both become exactly silent after 100 ms. See
[algorithmic_audio.md](algorithmic_audio.md) for the audio owner's final evidence.
Final repository/browser checks remain in the manager lane.
