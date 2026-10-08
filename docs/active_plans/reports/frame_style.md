# Molecular instrument frame

## Visual contract

`src/style.css` frames the unchanged 16:9 Canvas world as a dark molecular
instrument: teal specimen rails, a faint static molecular-grid backdrop, a coral
steroid identifier, and clear mint/gold state signals. The HUD remains first in
the reading order, buttons retain their semantic labels and focus rings, and all
decoration is behind the HUD, footer, canvas, or overlays.

The layout uses flexible header, HUD, and footer rows. At 850px stage names give
way to recognizable progress dots. At 580px the HUD tools move to their own row,
the footer retains dots plus wrapped ability text, and menus preserve their
minimum height. The 350px adjustment tightens spacing without clipping the title
or footer. Hover/press feedback is short and reduced motion removes transitions.

## Cascade surface and implementation

- Global role tokens and the static page backdrop are defined in `:root` and
  `body`.
- `.game-frame` plus its two inert pseudo-elements supplies the bezel and rail
  treatment. Decoration occupies stacking level zero while all game content is
  explicitly at level one, keeping it below the HUD, viewport, and footer.
- `.hud`, `.game-footer`, controls, menus, and in-canvas notices use the same
  surface, border, type, and focus vocabulary.
- Two established responsive breakpoints (850px and 580px), plus a narrow 350px
  spacing adjustment, own the whole adaptation. No markup or interaction code
  changed.

## Evidence and references

The local visual-craft route used the multi-layer background section in
`Background_Magic_CSS_The_Complete_Guide_to_Creating_Stunning_Backgrounds-2023.md`
and the skill's responsive flex and rendered-oracle routes. The chosen CSS uses
widely supported gradients, pseudo-elements, flexbox, `clamp()`, and media
queries; it avoids experimental layout or color syntax.

`npx prettier --check src/style.css` and `git diff --check` pass. The stylesheet
is 710 lines, below the repository source-file limit. Final built-artifact
screenshots at 1280px, 850px, 390px, and 320px plus keyboard focus and
reduced-motion confirmation remain the integration owner's browser acceptance
step.
