# Steroid Quest

A keyboard-controlled arcade adventure for biology learners. Guide a red steroid through six illustrated cell regions, bind a receptor, and activate gene expression through movement and discovery, with no quiz gates.

[Play Steroid Quest in your browser](https://vosslab.github.io/steroid-quest-into-the-nucleus/)

Choose **Start adventure**, move right, and jump past the first membrane obstacles. Your red
steroid crosses the lipid bilayer directly. Keep exploring until an RNA transcript emerges and
**GENE EXPRESSION ACTIVATED** appears.

<!-- screenshots:begin (managed by screenshot-docs) -->
<!-- screenshots:end -->

## From steroid to RNA

The journey turns a molecular pathway into six playable challenges:

| Region | Your challenge | What the action shows |
| --- | --- | --- |
| Membrane | Cross the lipid strip, then bounce through a membrane pop | A steroid crosses the bilayer directly |
| Cytoplasm | Squeeze through gel, launch through giant pinball, and try a crumbling bridge | A crowded cell separates you from the nucleus |
| Nuclear envelope | Climb through pore suction, then explore a low-gravity loft | This route requires no key or pore-opening action |
| Receptor | Bind, float through low gravity, and ride orbiting vesicle moons | Binding forms an active complex and unlocks an air jump |
| DNA / HRE | Ride nucleosome orbits, cross crumbling chromatin, and launch toward the HRE | The complex recognizes a regulatory DNA region |
| Transcription | Time three recruitment actions and watch RNA emerge | Machinery assembles and polymerase produces RNA |

The red steroid stays visible inside the active complex. Optional fragments reward exploration.
Gel squeezes open into giant organelle pinball, contact-armed platforms crumble, currents sweep
through ER folds, and orbiting ledges circle above safe floors. Low-gravity fields change jump
arcs. Occasional upper caches and a high DNA shortcut reward detours with a route back. These
discoveries are authored and deterministic; clear collision lips and recovery floors mark the route.
Retries are unlimited; checkpoints, collected fragments, and completed milestones survive a
retry. Missed recruitment attempts repeat immediately. Short objectives and milestone captions
support the action; reading never gates progress.

## Quick start

To play a local copy, install Node.js, npm, and Python 3, and use a browser with a keyboard.
Run from the repository root:

```sh
npm install
./run_web_server.sh
```

The script builds and serves `dist/`. Open the local address printed in the terminal; the title
screen offers **Start adventure**. An interactive macOS terminal opens the browser automatically.
Stop the server with Ctrl+C. Set `PORT` to choose a port.

## Controls and retries

| Action | Keys |
| --- | --- |
| Move | Left / Right or A / D |
| Jump | Space, W, or Up; release early for a shorter jump |
| Extra air jump | Press jump again after receptor binding |
| Pause / resume | Esc |
| Retry checkpoint | R |
| Navigate menus | Tab and Enter |

The game pauses when it loses focus. Sound starts muted; enable it with the Sound button.
Optional algorithmic sound gives each region its own textures and evolving motifs, with cues
for movement, binding, recruitment, and RNA production.
Progress lasts only for this page session; Replay starts a new journey. Touch controls and
persistent saves are outside this release.

## About the biology

This is a generic nuclear steroid-receptor example. Receptor locations vary. The open pore is
this level's route; steroids do not universally require pores for nuclear entry. Gravity,
platforms, and the air jump are arcade abstractions. The complex remains bound at the hormone
response element (HRE) while machinery assembles at the nearby promoter and transcription begins.
The steroid and binding pocket visibly adjust together. Their exaggerated flexibility is a
schematic illustration that preserves the four-ring scaffold, rather than a chemical conversion.

The revised campaign completes in about 1:52 on a practiced automated keyboard route, including
all six stages, one deliberate checkpoint death, optional cache recovery, RNA production,
ending, and Replay. Human first-play duration and enjoyment remain unmeasured. See
[docs/active_plans/reports/surprise_walkthrough.md](docs/active_plans/reports/surprise_walkthrough.md)
for the current route, rendered captures, and exact coverage.

## Build and verify

```sh
./check_codebase.sh
./build_github_pages.sh
./run_playwright_tests.sh --build
```

The build produces the GitHub Pages-ready `dist/` artifact. Remote publication is a separate
step. The game uses TypeScript, SolidJS, and Canvas 2D, with procedural illustrations.

- [docs/SOLID_MODEL.md](docs/SOLID_MODEL.md): simulation authority, UI lifecycle, and biological limits.
- [docs/LEVEL_DESIGN.md](docs/LEVEL_DESIGN.md): typed section authoring, movement variety, and recovery.
- [docs/PLAYWRIGHT_USAGE.md](docs/PLAYWRIGHT_USAGE.md): browser setup, tests, and capture usage.
- [tests/TESTS_TYPESCRIPT_README.md](tests/TESTS_TYPESCRIPT_README.md): TypeScript verification tools.
- [docs/CHANGELOG.md](docs/CHANGELOG.md): implementation history and validation notes.

## License

Source code uses the MIT license: [LICENSE.MIT](LICENSE.MIT).
