# Fast first playable ledger

The approved six-stage plan owns gameplay and acceptance. The target is an 8-12 minute journey
with optional reading and fragments, session-only progress, unlimited retries, and muted sound.
Remote publication is a separate step. Observed playthrough duration and human enjoyment are
pending; the target is not an acceptance result.

## Delegated execution

| Batch or lane | Ownership | Current evidence |
| --- | --- | --- |
| Foundation | Shared `src/types/`, Solid compilation, initial campaign interfaces | Complete; fresh specification and quality reviews pass |
| Core simulation/input | Simulation, physics, input, state, constants | Complete; infrastructure reviews pass |
| Core renderer/runtime | Canvas illustration, loop, resize, sound | Complete; infrastructure reviews pass |
| Core Solid UI | Menus, HUD, controls, lifecycle | Complete; infrastructure reviews pass |
| Manager integration | Connect accepted infrastructure | Check, build, and two browser smoke tests pass |
| Cell levels | Membrane, cytoplasm, nuclear envelope | Active |
| Nucleus levels | Receptor, DNA/HRE, transcription | Active |
| Simulation tests | Focused behavior tests | Active |
| Documentation | README, Solid model, guidance, decisions, changelog, this ledger | Active; initial documentation written |
| Final integration/review | Complete campaign, fresh specification and quality review | Pending |
| Final acceptance | Full commands, real-controls walkthrough, rendered captures | Pending |

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

Seven infrastructure lint findings are corrected. Menu Escape propagation is corrected.
Chromium was absent and installed through the standard Playwright setup. macOS MachPort
sandbox restrictions require elevated browser execution. Temporary screenshot and browser
artifacts stay under ignored `test-results/`.

## Final acceptance

Run from the repository root after integration:

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
