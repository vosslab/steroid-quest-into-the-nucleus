# Steroid Quest

A keyboard-controlled molecular arcade adventure for biology learners. Guide a red steroid through a crowded cell, bind an intracellular receptor, recognize a DNA response element, and recruit transcription machinery across six illustrated stages.

## Play locally

Install Node.js and npm, then run from the repository root:

```sh
npm install
./run_web_server.sh
```

The script builds and serves `dist/`, prints the local address, and opens a browser in an
interactive macOS terminal. Stop it with Ctrl+C. Set `PORT` to choose a port.

Move with Left/Right or A/D. Jump with Space, W, or Up; release early for a shorter jump.
Esc pauses or resumes; R retries the checkpoint. Menus support Tab and Enter.
The game pauses when it loses focus. Sound starts muted; enable it with the Sound button.

## The journey

Cross the permeable membrane, explore the cytoplasm, and enter through an open nuclear pore.
Find a receptor in the nucleoplasm; binding unlocks an extra air jump. Match the complex to a
hormone response element on DNA, then press jump for three recruitment actions while it stays
bound. Missed timing attempts repeat immediately. An RNA transcript marks the finish.

Retries are unlimited. Checkpoints, collected optional fragments, and completed milestones
survive a retry. Progress lasts only for this page session; Replay starts a new journey.
Short objectives and captions support the action; reading never gates progress.

This is a generic nuclear steroid-receptor example. Receptor locations vary. The pore is this
level's route, without implying that steroids universally need pores for nuclear entry.
Gravity, platforms, and the air jump are arcade abstractions.

## Build and verify

```sh
./check_codebase.sh
./build_github_pages.sh
./run_playwright_tests.sh --build
```

The build produces the GitHub Pages-ready `dist/` artifact. Remote publication is a separate
step. Browser setup and test usage are in [docs/PLAYWRIGHT_USAGE.md](docs/PLAYWRIGHT_USAGE.md).
The state and lifecycle contract is in [docs/SOLID_MODEL.md](docs/SOLID_MODEL.md).
Implementation history is in [docs/CHANGELOG.md](docs/CHANGELOG.md).

## License

Source code: [LICENSE.MIT](LICENSE.MIT).
