# Fluid campaign walkthrough

Accepted locally on 2026-10-08. The complete built campaign reaches gene expression using actual
Left, Right, and Space input. Recovery, sound, Replay, reduced motion, and narrow-screen checks
also pass. This record supersedes the earlier platform campaign's acceptance evidence.

## Evidence and reproduction

The accepted evidence directory is `test-results/fluid_campaign/verified/`. It contains
`report.json`, 49 PNG captures, and
`video/page@2557c1286c251c0da0eaf39427e0afd6.webm`. These generated files are local, ignored
artifacts. The report includes source and walkthrough hashes, served-asset hashes, simulation
observations, wall times, and real audio/frame observations. No browser errors or source/build
drift occurred. Served assets matched `dist/`.

Start the preview, then run the walkthrough in another terminal:

```sh
PORT=8367 ./run_web_server.sh
node --import tsx tests/playwright/campaign_walkthrough.mjs http://127.0.0.1:8367 test-results/fluid_campaign/new_run
```

The walkthrough in [campaign_walkthrough.mjs](../../../tests/playwright/campaign_walkthrough.mjs)
sends real keys and menu clicks and reads canvas observations. It never writes simulation state.
[helper_observation.mjs](../../../tests/playwright/helper_observation.mjs) measures actual audio
and outstanding animation callbacks without replacing synthesis.

Accepted `dist/main.js` SHA-256:

```text
605cfa688bb5f9757f8fb507848c2d10f743ee569133b8cff7804335c0e81d89
```

## Observed traversal times

These are simulation seconds between stage-entry captures. They include deliberate ceiling
excursions, backtracking, the acid death, optional cargo, and checkpoint retry. They are practiced
verification times, not estimates of a new player's campaign duration.

| Stage | Entry | Next stage or ending | Duration |
| --- | --- | --- | --- |
| Membrane | 0.00 | 27.32 | 27.32 |
| Cytoplasm | 27.32 | 65.45 | 38.13 |
| Nuclear envelope | 65.45 | 80.42 | 14.97 |
| Receptor | 80.42 | 101.15 | 20.73 |
| DNA / HRE | 101.15 | 114.45 | 13.30 |
| Transcription | 114.45 | 121.60 | 7.15 |

The recording, including title/audio setup, Replay, and the narrow-screen pass, takes 125.36 wall
seconds. The first rebound is captured at 2.63 simulation seconds, including the initial audio
observation period. Forward play alone reaches it within the three-second target. Ordinary
signature transitions occur a few seconds apart. The longest stretches are intentional
upper-pocket exercises, especially holding position against cytoplasmic currents. The
five-to-eight-second pacing goal remains a playtest target, not a tuning assertion.

## Signature and recovery captures

All filenames below are relative to the accepted evidence directory. The report's capture list
records every scene in order; the table highlights each stage's signature.

| Stage | Signature capture | Recovery evidence |
| --- | --- | --- |
| Membrane | `04_backward_sweep.png`, `07_vesicle_ride.png` | Changed return route, calm acid recovery, channel escape and re-entry |
| Cytoplasm | `13_giant_mitochondrion.png`, `21_er_channel.png` | Motor cargo, both ceiling pockets, optional shortcut and return |
| Nuclear envelope | `26_open_pore_crossing.png` | Missed lower approach, pre-pore descent, post-pore ceiling escape |
| Receptor | `29_sticky_contact.png`, `33_bound_complex.png` | Pulse/held escape, ceiling return, retained binding after retry |
| DNA / HRE | `36_nucleosome_passage_changes_flow.png`, `39_hre_docked.png` | Changed current, ceiling escape, calm docking |
| Transcription | `43_moving_polymerase_growing_rna.png`, `44_gene_expression_activated.png` | Three accepted timing actions; a 1.8-second hold submits at most one attempt |

Upper-pocket probes cover both membrane chambers, both cytoplasm chambers, both sides of the
nuclear pore, receptor, and DNA. Horizontal steering and coasting reach descending currents;
no downward input exists. Transcription starts docked and intentionally has no traversal pocket.
The membrane channel is escaped with Space, then approached again and completed. Vesicle,
motor, optional cargo, and ER rides release automatically. Sticky contact is escaped with a
pulse followed by held thrust and horizontal steering.

The acid death retains the collected fragment and completed membrane phases. Its calm checkpoint
restores zero velocity and no attachment. Binding saves checkpoint order 20, which retry retains
along with the red steroid-receptor complex. The run finishes with two of five optional fragments
and one deliberate death. Replay clears campaign progress and retains the chosen sound setting.

## Presentation and lifecycle

Visual review covers the six signature scenes, bound steroid identity, RNA assembly, and narrow
menus. Outlined collision surfaces remain distinct from faint decorative debris. Arrows,
circulation spirals, entrance rings, and labelled return streams explain available actions.
Camera framing accommodates upward and backward travel.

- Sound starts from the Start gesture: one real AudioContext, observed peak RMS about 0.00822.
- Pause, focus loss, and mute reduce measured RMS below 0.0001 after the cleanup interval.
- Muting before Start creates no AudioContext, including after starting play.
- Replay retains mute; re-enabling sound from the narrow play screen creates one context.
- The original canvas survives the campaign and Replay. Narrow retry/resume also preserve it.
- Maximum and current outstanding animation callbacks are both one.
- A 390-by-844 reduced-motion pass has no horizontal page overflow. Start, sound, pause, retry,
  and resume remain accessible; directional forces remain visible during actual movement.

Captures `45_replay_sound_choice_retained.png` through `48_narrow_reduced_motion_forces.png`
record the final lifecycle pass. Audio signal checks establish output and silence, not subjective
listening quality. Reduced motion simplifies decoration while required movement remains active.

## Recovery and enjoyment assessment

The strongest encounter is the membrane reversal: reaching the outlet changes the current,
returning exposes an arriving vesicle, and retry preserves that discovery. A mistake changes
the next opportunity instead of merely repeating an obstacle. The open pore similarly turns a
miss into a visible descent and another approach. Channel escape and optional cargo both return
to usable routes. Sticky release gives control back, and receptor binding provides a calm save.

Playtesting exposed real recovery defects: a missing pre-pore descent stream, immediate recapture
at an earlier checkpoint position, and automatic sticky release with no separating velocity.
Those are corrected in the accepted build. Strong currents can overcome weak held thrust;
repeated Space taps provide stronger lift, while following a return stream remains available.

My assessment from the captures and control-driven traversal is that mistakes now create
understandable opportunities and the opening delivers immediate variety. Human first-play
enjoyment and unaided discovery of distant return streams remain unmeasured. Automated completion
and this practiced route do not establish that the game is enjoyable for students.

## Integration checks

- `./check_codebase.sh`: strict type checks, lint, formatting, and 17 Node behavior tests pass.
- `./build_github_pages.sh`: produces the validated `dist/` artifact.
- `./run_playwright_tests.sh --build`: both browser smoke tests pass.
- `source source_me.sh && python3 -m pytest tests/ -q`: 1,112 hygiene checks pass.
- `git diff --check`: passes.

An intermediate smoke run encountered an occupied test port; the clean rerun passed. Earlier
walkthrough probes also corrected controller assumptions about coasting, pulse strength,
capture proximity, hazard approach height, and Replay's immediate entrance event. The accepted
run verifies actual transitions rather than treating arrival near a target as success.

The preview remains served through `./run_web_server.sh` at `http://127.0.0.1:8367`.
This is a validated local build; remote publication remains separate.
