# Fast first playable ledger

The approved six-stage plan owns gameplay and acceptance. The target is an 8-12 minute journey
with optional reading and fragments, session-only progress, unlimited retries, and muted sound.
Agents performed local build/verification without a remote deployment action; the user confirms
an existing live GitHub Pages site. The baseline expert route measured 122.752 wall seconds;
expanded real-controls timing is pending. Human first-play duration and enjoyment are unverified;
the target is not an acceptance result.

## Delegated execution

| Batch or lane | Ownership | Current evidence |
| --- | --- | --- |
| Foundation | Shared `src/types/`, Solid compilation, initial campaign interfaces | Complete; fresh specification and quality reviews pass |
| Core simulation/input | Simulation, physics, input, state, constants | Complete; infrastructure reviews pass |
| Core renderer/runtime | Canvas illustration, loop, resize, sound | Complete; infrastructure reviews pass |
| Core Solid UI | Menus, HUD, controls, lifecycle | Complete; infrastructure reviews pass |
| Manager integration | Connect accepted infrastructure | Check, build, and two browser smoke tests pass |
| Cell levels | Membrane, cytoplasm, nuclear envelope | Complete; expanded cytoplasm has six districts |
| Nucleus levels | Receptor, DNA/HRE, transcription | Complete; expanded routes and artwork corrections integrated |
| Simulation tests | Focused behavior tests | Complete; nine behavior tests pass |
| Documentation | README, Solid model, guidance, decisions, changelog, this ledger | Closeout active; final evidence pending |
| Progressive obstacles/debris | Additional authored obstacles and increasing cellular debris | Active; direct user steering |
| Binding flexibility | Schematic steroid/pocket accommodation with reduced-motion settling | Active; direct user steering |
| Algorithmic audio | Procedural region/movement motifs and molecular event cues | Active; optional and initially muted |
| Final integration/review | Complete campaign, fresh specification and quality review | Expanded specification passes; final quality/integration pending |
| Final acceptance | Full commands, real-controls walkthrough, rendered captures | Commands and hygiene pass; expanded walkthrough/captures pending |

Agents share the checkout and preserve each other's changes. Explicit handoff transfers file
ownership. The manager coordinates integration and reviews. Challenges and contract questions
stay open until the affected lane applies and verifies the decision.

## Frozen boundaries

- Type-only contracts separate levels, input, simulation state/events, and runtime/render inputs.
- Simulation owns all progression and session milestones; input maps recognized keys to commands.
- Authored levels own collision geometry, objectives, collectibles, and triggers.
- Solid updates scalar signals through events and commands; canvas/runtime mount once.
- Retry restores the checkpoint while retaining fragments and milestones. Replay resets the session.
- Rendering follows simulation state and keeps decorative molecular shapes separate from collisions.
- Read-only canvas data attributes support browser observations; gameplay never consumes them.
- Implementation details and lifecycle rules live in [docs/SOLID_MODEL.md](../../SOLID_MODEL.md).

## Review evidence

Foundation: [foundation_spec.md](../reports/foundation_spec.md) and
[foundation_quality.md](../reports/foundation_quality.md).
Infrastructure: [infrastructure_spec.md](../reports/infrastructure_spec.md) and
[infrastructure_quality.md](../reports/infrastructure_quality.md).
Expanded campaign: [expanded_spec.md](../reports/expanded_spec.md) verifies 381 unique entity
IDs and 64 supported safe authored checkpoint spawns. Earlier campaign and finish findings
are corrected, including organelle placement, receptor contact, moving nucleosome bodies,
bilayer visibility, HRE/recruitment labels, authored checkpoint coverage, loop observations,
and guidance provenance.

Seven infrastructure lint findings are corrected. Menu Escape propagation is corrected.
Chromium was absent and installed through the standard Playwright setup. macOS MachPort
sandbox restrictions require elevated browser execution. Temporary screenshot and browser
artifacts stay under ignored `test-results/`.

## Final acceptance

Fresh integration commands pass:

```sh
npx tsc --noEmit -p tsconfig.json
./check_codebase.sh
./build_github_pages.sh
./run_playwright_tests.sh --build
```

Run applicable repository hygiene checks separately. Report focused tests, full-suite checks,
rendered evidence, and local preview independently. Play all six stages through real controls,
including deaths and checkpoint recovery; capture regions, transformation, and ending without
bypassing progression. Record observed journey time. Automated completion alone does not prove
human enjoyment or the 8-12 minute target.

- `./check_codebase.sh`: both typechecks, lint, formatting, and nine Node tests pass.
- `./build_github_pages.sh`: passes; `dist/` is ready for GitHub Pages publication.
- `./run_playwright_tests.sh --build`: two smoke tests pass, including one pending animation
  frame across UI updates and preserved canvas identity.
- `source source_me.sh && python3 -m pytest -q`: 964 repository hygiene tests pass.
- `git diff --check`: passes. Final documentation checks follow the remaining evidence update.
- `./run_web_server.sh`: active local built preview at `http://localhost:8053`.
- [walkthrough.md](../reports/walkthrough.md): baseline passes controls-only progression with
  two deaths, 18/36 fragments, ending and Replay. Expanded final timing and captures pending.
