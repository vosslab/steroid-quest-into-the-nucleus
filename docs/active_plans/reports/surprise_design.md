# Surprise design investigation

## Scope and status

The requested journey grows stranger through authored, reusable situations with readable
controls and quick recovery. This report investigates composition and records the revision's
status. Level sources own geometry; [LEVEL_DESIGN.md](../../LEVEL_DESIGN.md) owns the authoring
guide. A proposal in this report is not evidence that its route works in the built game.

## Investigation decisions

The earlier campaign already supplies currents, launches, linear moving ledges, squeeze
passages, optional roof routes, and receptor air jumps. The revision extends those ingredients.

| Situation | Current implementation | Direction and recovery |
| --- | --- | --- |
| Current, squeeze, launcher, moving vesicle | Implemented before revision | Reuse with new direction, enclosure, and exits |
| Ribosome cascade / collapsing bridge | Delivered recipe | Contact starts a short countdown; lower floor catches missed crossings |
| Organelle pinball | Delivered recipe | Sequence directional bounces above a broad recovery floor |
| Vesicle express / ER speed tunnel | Delivered recipe | Visible current accelerates a passage; exit opens onto a safe shelf |
| Rotating organelle chamber | Delivered recipe | Orbiting ledges offer an upper route above stationary support |
| Low-gravity shaft / pore suction | Delivered recipe | A visible field changes local traversal; stationary ledges lead back out |
| Organelle escape / absurd shortcut | Delivered authored detour | Reveal a cache or faster crossing and a visible return to the main route |
| Pursuing lethal AI | Deferred | Collapse timing supplies voluntary chase pressure without a new enemy system |
| Rotated solid collision bodies | Deferred | Orbit ledges retain axis-aligned collision bounds |
| Vesicle passenger capture | Deferred | Ride ordinary moving ledges; express fields do not enclose the player |
| Falling rigid-body ribosomes | Deferred | Contact-armed tiles disappear and restore without body-to-body impacts |
| Random surprise generator / control remapping | Deferred | Author explicit situations and preserve left, right, and jump |

The five recipes compile into the existing simulation arrays; exact controls, bounds, and
recovery validation appear in [LEVEL_DESIGN.md](../../LEVEL_DESIGN.md).

The pressure route is an optional race against collapsing footing. It does not claim a pursuing
creature or biological chase. Simulation owns field and platform behavior; the compiler owns recipe geometry.
Secrets are deterministic optional discoveries. Randomness never chooses the progression route.

## Delivered escalation rhythm

The finalized authored sequence is recorded in [LEVEL_DESIGN.md](../../LEVEL_DESIGN.md).
The first three stages are detailed in [surprise_cell_levels.md](surprise_cell_levels.md);
receptor and DNA in [surprise_nuclear_levels.md](surprise_nuclear_levels.md).

| Stage | Setup, twist, payoff, recovery |
| --- | --- |
| Membrane | Protein weave; direct bilayer crossing; pinball pop/reforming shelf; catch floor |
| Cytoplasm | Gel squeeze; giant pinball and upper cache; crumble shortcut, ER express, vesicle orbit; broad catches |
| Envelope | Stair ascent; visible current toward the open pore; spring/vesicle crossing and low-gravity loft; stationary shelves |
| Receptor | Quiet visible binding; required low-gravity hurdle jumps; vesicle moons/cache and fold express; saved binding checkpoint |
| DNA | Nucleosome orbits/cache; chromatin crumble; gel launch/high shortcut; calm matching-HRE basin |
| Transcription | Docked complex; three recruitment windows; polymerase and connected RNA; immediate retry |

Selected upper caches and the DNA shortcut are deterministic optional discoveries. Required
routes retain ordinary controls and biological order. True enclosed vesicle passenger capture,
lethal pursuing AI, rotated collision bodies, and rigid-body domino impacts remain deferred.
The giant mitochondrion is decoration around pinball geometry, not an enclosed collision body.

## Optional route recipes

- Vesicle express: show the vesicle silhouette and acceleration boundary before the ER corridor.
  The authored floor passage uses the field; stationary entry and exit remain outside it.
- Ribosome cascade: show the unstable crossing above a continuous catch floor. Contact arms each
  tile, so waiting on the approach is safe; falling returns to the ordinary route.
- Organelle escape: offer an upper orbit transfer from a stationary approach. A cache rewards the
  detour; a descending ledge or open drop returns to the supported floor.
- Absurd shortcut: let a conspicuous launcher skip a local obstacle sequence. Keep a visible
  destination and the complete ordinary route; the shortcut never skips receptor binding or HRE docking.

The campaign uses selected instances of these compositions; cache frequency belongs to level
authors. A cache is a static upper branch rather than a hidden-wall system.
Keep discoveries rare enough that the ordinary route establishes expectations first.

## Required evidence

Record the changed required route and each optional entry, reward, return, and miss. Measure
checkpoint-to-recovery elapsed time and deaths during the actual played route; report observed
values rather than an invented threshold. Verify waiting through a full motion cycle, collapsed
tile restoration with player clearance, pause/resume, retry, Replay, and reduced motion. Attribute
full-cycle carry and armed-timer pause to fixed-step tests/probes when those are their actual
evidence. A shorter built ride or ordinary pause-menu exercise does not establish those specific
browser interactions.

Source and contract review establishes ownership and geometry checks. Focused runtime tests
establish interaction behavior. Built keyboard traversal and rendered review establish only the
routes and states actually exercised. Human first-play enjoyment remains a separate question.

## Acceptance status

- Shared runtime, compiler, and renderer infrastructure: delivered. Fresh specification review
  [surprise_infra_spec.md](surprise_infra_spec.md) and quality review
  [surprise_infra_quality.md](surprise_infra_quality.md) pass their stated source scopes.
- The quality review's nonblocking frozen particle-phase observation was corrected by passing
  simulation `elapsed` to the transcription payoff; type checking passes after correction.
- Manager infrastructure integration: `./check_codebase.sh` passes 36 Node tests and other
  checks; a rebuilt smoke run passes two browser tests. This predates final authored-route acceptance.
- Cell and nuclear source probes pass the stated control routes in their linked reports.
  Fresh authored specification review [surprise_levels_spec.md](surprise_levels_spec.md) passes,
  including all 30 ordinary checkpoint bodies and the corrected payoff clock. Fresh campaign
  quality [surprise_levels_quality.md](surprise_levels_quality.md) passes, including independent
  ordinary-controls receptor/DNA traversal with zero deaths.
- Accepted built controls-only walk: 111.833 wall seconds, 111.66 simulation seconds, one deliberate
  hazard death, and 13/27 fragments. It traverses all six stages in biological order, exercises all
  five mechanics and a cache return, completes three recruitment actions/RNA/ending, and Replay.
  Checkpoint recovery takes about 0.42 seconds and preserves the collected fragment.
- Built crumble contact/catch/reformed contact and a 450 ms no-input orbit ride are observed.
  The orbit moves the rider 22.3 world units with both-axis carry; full-cycle waiting and armed-timer
  pause are separate fixed-step evidence. Express travel averages 347 units/s during its
  recorded interval, versus the 280 baseline speed.
- The 390-pixel reduced-motion browser route exercises Start, movement/jump, Pause/Resume,
  and Retry; canvas identity stays stable and the maximum pending animation callback is one.
- Final controls-only evidence belongs to [surprise_walkthrough.md](surprise_walkthrough.md).
  Accepted capture contains 58 screenshots, no browser errors or source drift, and served/build
  hashes match. Rehearsals and earlier campaign timings apply to separate runs/artifacts.
- Manager final checks: 36 Node tests, two rebuilt browser smoke tests, explicit Pages build,
  and 1033 full Python hygiene tests pass. Independent final integration
  [surprise_integration.md](surprise_integration.md) passes after matching all 32 recorded hashes
  and inspecting eight accepted captures. Its stated route/viewport limits remain explicit.
- Human first-play duration and enjoyment remain unmeasured. No remote publication is claimed.
