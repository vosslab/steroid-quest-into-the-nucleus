# Cellular surprise execution ledger

## Approved contract checkpoint

The manager approves five reusable cellular recipes, elliptical platform motion, contact-armed
crumble/reform, and marked local gravity/drag fields. Existing authored levels stay unchanged
during the prerequisite contract step. Gameplay keeps rectangular collision geometry, ordinary
controls, optional reading/rewards, and simulation-owned session state.

This is existing-repository work. Strict flags remain unchanged; `exactOptionalPropertyTypes`
is absent. Trusted authored TypeScript and existing units/ID conventions do not justify a
branding migration. Shared types serve simulation, rendering, and compilation without generic
builders, a coordinate DSL, or catch-all entity contracts.

## Contract handoff

- `src/types/level.ts` exports `LinearMotion`, `OrbitMotion`, `PlatformMotion`, and
  `CrumbleConfig`. Existing axis/distance motion accepts an omitted `kind`; new orbits use
  `kind: "orbit"`, `radiusX`, `radiusY`, `period`, and optional `phase`.
- `src/physics.ts` implements both motion variants now. Platform x/y is the orbit's mean
  top-left corner; x uses cosine and y sine. Positive y points down, phase uses turns, and
  period uses seconds. Motion translates an axis-aligned rectangle; it does not rotate it.
- `Platform.crumble?: CrumbleConfig` uses positive `delay` and `reformAfter` seconds. The
  first top contact arms collapse. Leaving does not cancel or restart an armed timer.
- `src/types/simulation.ts` exports `CrumbleState` and requires
  `SimulationState.crumbleStates: Map<string, CrumbleState>`. `src/game_state.ts` initializes
  the map. Missing entries mean intact; entries have `phase: "armed" | "collapsed"` and
  `remaining` seconds. Expired collapsed entries reform only when the player clears the
  current platform rectangle. Rendering reads this authoritative state.
- Retry, stage changes, and Replay clear crumble states. Pause freezes timers. Retry preserves
  existing `levelTime`, so orbit phase retains established retry behavior.
- `FlowZone.gravityScale?` is a nonnegative gravity multiplier. Overlaps use the minimum with
  normal gravity scale 1. `FlowZone.drag?` is nonnegative damping per second; overlaps sum
  before applying `exp(-drag * dt)` to velocity. Acceleration still sums independently.
  Leaving restores ordinary physics without clearing momentum; checkpoints stay outside fields.

## Recipe controls

`src/types/sections.ts` exports five named recipes through `SurpriseSection`. They share existing
local content fields plus `width`, `floor`, optional `approachWidth`, optional `recoveryWidth`,
and `secret?: "none" | "high_cache"`. Default static approach/recovery lengths are at least
180 units. Each compiler recipe generates a broad recovery floor, static ends, a safe checkpoint,
and an optional collectible reward route with a return. Checkpoints cannot rest on moving,
bounce, or crumble support. Generated fields must also be included in recovery validation.

| Export | Kind | Specific controls |
| --- | --- | --- |
| `RibosomeBridgeSection` | `ribosome_bridge` | `bridgeRise`, `span`, `count`, `crumble` |
| `OrganellePinballSection` | `organelle_pinball` | `bumperCount`, `launch`, `landingRise` |
| `VesicleExpressSection` | `vesicle_express` | `ceiling`, `acceleration`, optional `drag` |
| `OrbitChamberSection` | `orbit_chamber` | `orbitRise`, `radiusX`, `radiusY`, `period`, `platformCount` |
| `LowGravityShaftSection` | `low_gravity_shaft` | `rise`, `gravityScale`, `ledgeCount` |

Counts are positive integers. Lengths and periods must be finite and positive; gravity/drag
must be finite and nonnegative. Compilation owns further reachability limits and safe defaults.
Stages own ordering, objectives, theme, captions, and combinations of these recipes.

`SectionSpec` includes all five recipes alongside tunnels, terraces, and bounce chambers.
The compiler switches explicitly over every discriminant and lowers recipes through the focused
pattern module. Exact accepted ranges and generated recovery checks are documented in
[LEVEL_DESIGN.md](../../LEVEL_DESIGN.md); source remains authoritative.

## Implementation lanes

| Lane | Files and responsibility | Dependency |
| --- | --- | --- |
| Runtime | Physics, simulation, game state, focused mechanic tests | Shared contracts |
| Compiler | Section types/compiler, focused pattern module and tests | Shared contracts |
| Visuals | Renderer, kinetic artwork, focused set-piece artwork | Shared contracts and runtime state |
| Authors | Cell and nucleus stage composition | Runtime, compiler, visuals |
| Docs | Design guidance, model boundaries, changelog | Accepted behavior and stage composition |
| Real walk | Built keyboard traversal, retries, pause, secret return, reduced motion | Authored built stages |
| Fresh reviews | Source-spec, then fresh-quality, then integration | Implementations and route evidence |

The initial contract worker completed the prerequisite handoff. Fresh runtime, compiler,
and visual owners completed infrastructure. Fresh cell and nuclear authors own their separate
level sources; fresh source-spec, quality, and controls-only walk owners verify the resulting
campaign. The documentation completion owner now owns this ledger and the six assigned durable
and report documents; source and shell changes remain with their respective owners.

## Verification gates

- Baseline/prerequisite typechecks and prerequisite formatting: PASS.
- One-time geometry probe: PASS for orbit endpoints and legacy sinusoidal motion.
- Infrastructure source specification: PASS in
  [surprise_infra_spec.md](../reports/surprise_infra_spec.md); 31 focused Node tests pass.
- Fresh infrastructure quality: PASS in
  [surprise_infra_quality.md](../reports/surprise_infra_quality.md), including sampled parameter,
  full-cycle orbit, and mock Canvas probes within their stated scope.
- Nonblocking payoff-clock observation: closed by renderer elapsed-clock correction and typecheck.
- Manager infrastructure integration: `./check_codebase.sh` passes, including 36 Node tests;
  rebuilt browser smoke passes two tests; final authored integration also passes below.
- Cell/nuclear source probes: PASS in their author reports, with ordinary controls only.
- Fresh authored source-spec: PASS in [surprise_levels_spec.md](../reports/surprise_levels_spec.md),
  including all 30 ordinary checkpoint bodies and elapsed/payoff pause behavior.
- Fresh campaign quality: PASS in [surprise_levels_quality.md](../reports/surprise_levels_quality.md);
  fresh 31 focused tests, typecheck, and receptor/DNA ordinary-controls traversal with zero deaths.
- Final rebuilt browser smoke: PASS, two tests after both authored sources completed.
- Accepted built controls-only walk: PASS, 111.833 wall seconds / 111.66 simulation seconds,
  all six stages, one deliberate hazard death, 13/27 fragments, and about 0.42-second checkpoint
  recovery with fragment retention. All five encounters, cache return, three recruitment windows,
  connected RNA, ending, and Replay are observed; 58 captures, no errors/source drift, matching
  served/build hashes. Final details live in [surprise_walkthrough.md](../reports/surprise_walkthrough.md).
- Built narrow/reduced-motion lifecycle: PASS at 390 pixels; Start/move/jump/Pause/Resume/Retry,
  same canvas, maximum one pending animation callback. Built orbit carry covers 450 ms;
  full-cycle orbit and armed timer pause remain separately attributed fixed-step checks.
- Independent final integration: PASS in [surprise_integration.md](../reports/surprise_integration.md),
  with all 32 recorded hashes matching and eight accepted scenes visually inspected.
- Final authored `./check_codebase.sh`: PASS, including 36 Node tests; explicit
  `./build_github_pages.sh`: PASS. Fresh full Python hygiene after review docs: 1033 tests pass in 1.74 seconds.
- Documentation links/ASCII and README opening: PASS, 222 targeted pytest checks after final integration documentation.
- Human first-play timing/enjoyment: unmeasured; remote publication: outside this local acceptance.

## Controller acceptance closure

The walk controller and clean whole-route rerun are complete. Earlier narrow-menu failures stay
recorded as failed harness runs. Timer polling replaces RAF polling so the observer does not
add a callback to its own animation monitor; accepted Retry waits for actual playing readiness.
The clean accepted run and independent integration review verify the correction without product
source changes or a rebuilt artifact. No checkpoint question remains open for the delivered scope.

## Settled checkpoint questions

- Shared contracts lower into existing arrays; compiler handles every new recipe discriminant.
  Runtime, compiler, and reviewers applied this boundary and verified typechecks/focused tests.
- Pinball springs replace floor segments at floor height, making launch reachable on the ordinary
  route. Compiler and source-spec review verified top-contact behavior.
- Recovery checks include full motion envelopes and both generated/authored fields. Compiler,
  focused tests, and independent quality sampling verify the contract.
- Receptor contact stays inside visible artwork. A local canopy forces ordinary and repeated-jump
  approaches to meet it; the nuclear author verified binding with three input schedules.
- DNA launch horizontal speed was corrected from 350 to 490 after source traversal hit the fold;
  the author reran the full source route. The accepted built walk also traverses the landing.
- Particle phases use pause-aware elapsed time during recruitment. Renderer correction and
  typecheck close the infrastructure observation; accepted built captures show polymerase/RNA payoff.

Clarification, challenges, decisions, and escalation remain welcome. Any new checkpoint question
stays open until affected owners restate, apply, and verify the decision. Reports distinguish
source probes, integration, rendered acceptance, and subjective enjoyment. Full-cycle orbit
carry and armed-timer pause belong to fixed-step evidence unless explicitly exercised in the
browser; the accepted built walk covers a shorter no-input ride and ordinary pause menus.
