# README landing page refresh

## Outcome

README now starts with the learner purpose and the confirmed live Play link, then shows the
complete steroid-to-RNA activity before local setup. A six-region table pairs each playable
challenge with its biological meaning. Controls, retries, session limits, biological caveats,
four curated documentation routes, and the MIT license remain discoverable.

The strongest gain is proof placement: a newcomer can open the live game and start moving before
encountering developer setup. The exact empty screenshot-docs sentinels reserve the visual slot.
README makes no claim that the published artifact is identical to the current local build.

## Before and after score

The educational browser-game rubric rewards a playable demonstration and a representative
learner activity. Scores use only the rubric's fixed Full, Strong, Partial, Minimal, or Unmet
values; they are editorial judgments supported by the following evidence.

| Category | Before | After | Evidence and remaining improvement |
| --- | ---: | ---: | --- |
| Purpose, audience, and value | 15 | 15 | Plain opening identifies biology learners and the molecular arcade journey |
| Distinctive project identity | 11 | 15 | Six-region challenge/biology mapping makes the pathway the organizing story |
| Proof and demonstration | 10 | 15 | Live Play link and concrete start-to-RNA activity precede setup; a current visual remains useful |
| Meaningful first success | 11 | 15 | Canonical local command path includes runtimes, printed address, and Start adventure result |
| Usage and conceptual orientation | 10 | 10 | Controls, receptor air jump, retries, reading boundary, and biological caveats are explicit |
| Documentation navigation | 5 | 10 | Four existing routes have task-specific descriptions |
| Adoption context | 4 | 4 | Session-only progress, keyboard requirement, and license link are clear; license attribution has template fields |
| Presentation, accessibility, and currency | 8 | 10 | Concise hierarchy, introduced tables, plain ASCII, working links, and preserved biological boundaries |
| Total | 74 | 94 | Strongest gain: proof and demonstration, 10 to 15 |

The two highest-value improvements were surfacing the live game before installation and turning
the prose journey into a scannable activity/biology mapping.

## Verification

- Manager verified the configured live URL returned HTTP 200 on 2026-10-08 at approximately
  02:21 UTC. The user independently confirmed that URL works.
- Manager verified the canonical preview front door and the active local preview on port 8053.
  README uses the script's printed address rather than assuming a fixed port.
- Executable front door inspected: `run_web_server.sh` builds and serves `dist/`, uses Python 3,
  supports `PORT`, and opens a browser automatically in an interactive macOS terminal.
- Source evidence inspected: `src/app.tsx`, campaign assembly, package manifest,
  [../../SOLID_MODEL.md](../../SOLID_MODEL.md), and `LICENSE.MIT`.
- Ran `source source_me.sh && python3 -m pytest -q tests/test_readme_first_paragraph.py
  tests/test_markdown_links.py tests/test_ascii_compliance.py`: **179 passed**.
- Opening is under the skill's 250-character limit. One H1, exact screenshot sentinels,
  no README placeholders, and local link existence were checked.
- Current behavior and license wording trace to inspected source and repository files.
  Runtime/install/run verification uses manager's equivalent canonical execution evidence.
  No animated proof is included, so animation-specific gate requirements do not apply.

## Bounded follow-ups

### Show the active complex

- Outcome: let newcomers see the red steroid inside the bound complex before playing.
- Owner: screenshot-docs.
- Target files: `README.md`, `docs/screenshots/receptor_complex.png`.
- Evidence: a built-artifact playthrough reaches receptor binding with the red steroid visible.
- Work: capture a readable receptor or DNA scene and insert it between managed sentinels with
  descriptive alt text and a short caption.
- Success criteria: the player, binding/response-element context, and extra-air-jump status are
  readable at README display size; ordinary gameplay reaches the capture state.
- Verification: inspect the image and rendered README; run the local Markdown link check.

### Complete license attribution

- Outcome: preserve the existing MIT terms with resolved attribution.
- Owner: maintainer with the repository owner's authorship evidence.
- Target files: `LICENSE.MIT`.
- Evidence: the existing file still contains `[year] [fullname]`.
- Work: fill attribution from authoritative project ownership information.
- Success criteria: no template attribution fields remain; MIT terms are preserved.
- Verification: read the license and compare its terms against the current MIT text.

### Measure first play

- Outcome: support any numeric playtime promise with observed learner-style play.
- Owner: playability review.
- Target files: campaign verification report and `README.md` if a duration claim becomes useful.
- Evidence: six authored stages exist; automated completion does not establish human first-play time.
- Work: record an uninterrupted first play using ordinary controls, with deaths and retries.
- Success criteria: report observed elapsed time and tuning conclusions; update the qualified
  8-12 minute design target only when supported.
- Verification: complete all stages without injected state or bypassed progression.
