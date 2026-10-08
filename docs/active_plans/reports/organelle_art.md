# Organelle wall rendering

## Result

Add an optional `Platform.material` contract for static solid platform rectangles. The renderer
uses the rectangle itself as the clipped, visible extent of a cellular mass, preserving the
simulation's collision authority and leaving every unset platform unchanged.

`mitochondrion` draws a shaded membrane mass with repeated cristae; `reticulum` draws folded
channels with small ribosome-like dots; `gel` draws a cross-linked, bead-filled matrix; and
`membrane` draws lipid heads and tails. Each material has a bright top rim and dark interior so
safe empty corridors remain legible beside dense, solid walls.

## Verification

- `npx tsc --noEmit -p tsconfig.json`
- `npx eslint src/types/level.ts src/drawing.ts src/renderer.ts`
- `npx prettier --write src/types/level.ts src/drawing.ts src/renderer.ts`
- `git diff --check`

All passed. The level-authoring lane must assign materials to the new tunnel wall geometry;
rendered browser acceptance remains a separate integration step.
