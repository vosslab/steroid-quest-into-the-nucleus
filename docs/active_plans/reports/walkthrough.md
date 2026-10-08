# Built campaign walkthrough

## Baseline result

The complete built game passes controls-only progression acceptance, but fails the requested
8-12 minute duration. Chromium completed in 122.752 real wall seconds and 122.63 simulation
seconds, including two deaths, with 18/36 fragments. No clock acceleration was used.
This is an automated expert route, not a human enjoyment or first-time usability study.

Run used `node --import tsx tests/playwright/campaign_walkthrough.mjs` against the existing
`http://localhost:8053` server. macOS Chromium required sandbox escalation. The script reads
authored platform definitions and read-only canvas data attributes, then sends actual
ArrowRight and Space keyboard input. It never initializes or mutates player coordinates,
velocity, checkpoint state, milestones, or simulation steps.

Baseline `dist/main.js` SHA-256:
`162c7fcab6a54c1ed623dc059dbb1a94e9a1f090cca3ec03cb71e0d471669160`.
Later source artwork corrections are not represented in these baseline screenshots.

| Stage entered | Simulation seconds | Wall seconds |
| --- | ---: | ---: |
| Membrane | 0.03 | 0.031 |
| Cytoplasm | 14.12 | 14.106 |
| Envelope | 55.55 | 55.538 |
| Receptor | 69.65 | 69.638 |
| DNA | 85.77 | 85.760 |
| Transcription | 117.92 | 117.903 |
| Ending | 122.63 | 122.752 |

## Progress and recovery

- Deliberately hit the first membrane enzyme at 2.17 seconds. One collected fragment survived
  the death and normal start-point respawn.
- An incidental cytoplasm fall at 29.57 seconds restored checkpoint 3; five fragments survived.
  The complete route then continued without another death.
- Crossed the lipid strip directly and used the continuously open pore with no key or action.
- Receptor binding visibly transformed the player; the red steroid remained inside the complex.
  Required double-jump routes reached DNA and the HRE through real jump input.
- Three real Space presses succeeded at 118.40, 118.50, and 118.62 seconds. Machinery appeared,
  polymerase advanced, the RNA transcript emerged, and the ending displayed 18/36 and 2:02.
- Real Replay button returned to membrane, reset the tally to 0/36, and preserved the canvas
  element identity. The run reported no uncaught browser errors.

## Visual and movement review

All baseline region, binding, HRE, transcription, RNA, ending, and replay screenshots were
individually opened and inspected. Baseline files are preserved under ignored
`test-results/campaign-baseline/`. Future runs write to `test-results/campaign/`.

The player and collision ledges are clear, regional palettes remain readable, captions are
brief, and the follow camera kept every mandatory landing route on screen. The two-step
air-jump sequence consistently crossed the large nucleus gaps. Recovery did not trap the
controller, and checkpoints made the incidental fall inexpensive. This establishes technical
route usability for a controller with exact geometry, not enjoyable movement for students.

Baseline corrections required before final visual acceptance:

- The HRE label overlaps the CONTINUE label at the DNA exit, reducing readability.
- The milestone caption partly covers the transcription timing bar.
- Envelope collision wall rectangles dominate the bilayer illustration at the pore.
- Baseline receptor pocket is rectangular and does not match the steroid contour; known
  pending artwork corrections need a rebuilt-artifact capture.
- Immediate count-3 RNA screenshot shows machinery before the transcript extends. The
  walkthrough script now waits 1.8 seconds of normal real-time playback for that capture.

The 2:03 result needs a substantial authored content increase to support an 8-12 minute
campaign. Artificial pauses or slower input should not be counted as game duration.
Final geometry must be independently replayed after the pacing correction and rebuilt artwork.
