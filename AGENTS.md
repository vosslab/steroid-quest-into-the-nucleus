# Agent instructions

## Repository rules

Follow [docs/REPO_STYLE.md](docs/REPO_STYLE.md),
[docs/TYPESCRIPT_STYLE.md](docs/TYPESCRIPT_STYLE.md),
[docs/PYTHON_STYLE.md](docs/PYTHON_STYLE.md), and
[docs/MARKDOWN_STYLE.md](docs/MARKDOWN_STYLE.md).
Record edits in [docs/CHANGELOG.md](docs/CHANGELOG.md).
Keep human-stated guidance in [docs/HUMAN_GUIDANCE.md](docs/HUMAN_GUIDANCE.md) and settled
implementation decisions in [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md).

## Game boundaries

Follow [docs/SOLID_MODEL.md](docs/SOLID_MODEL.md) for simulation authority, Solid signals,
canvas lifetime, keyboard focus, cleanup, and biological model limits.
Shared type contracts live in `src/types/`; level data owns geometry and objectives.
Keep progress session-only and reading optional. Verify changes through the built artifact.

Use `./run_web_server.sh` for the local preview; it builds and serves `dist/`.
Run `./check_codebase.sh`, `./build_github_pages.sh`, and
`./run_playwright_tests.sh --build` for integration acceptance.
A local build or preview does not publish remotely.

## Python environment

Run Python through `source source_me.sh && python3`.
Add needed PYTHONPATH extensions to `source_me.sh`, after its shell setup.
Prefer system Python: Python 3.12 on macOS, Python 3.13 on Debian 13; use a venv as a last resort.
On this macOS host, Homebrew Python modules are in `/opt/homebrew/lib/python3.12/site-packages/`.
