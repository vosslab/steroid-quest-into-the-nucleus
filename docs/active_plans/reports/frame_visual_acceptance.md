# Frame visual acceptance

## Contract and CSS scope

The persistent Solid shell presents a dark molecular-instrument frame around the game.
Its decorative gradients, border, and inset line stay behind gameplay and receive no pointer
input. The canvas retains its 16:9 geometry. The masthead, stage instructions, action controls,
and progress footer remain readable from 320 to 1280 CSS pixels.

The existing single stylesheet uses root palette tokens, scoped component selectors, responsive
rules at 850/580/350 pixels, and a reduced-motion override. It has no cascade layers. The
intentional dark color scheme remains the same under light and dark OS preferences.

The final overflow correction belongs to `src/style.css`: `.menu-card` permits intrinsic
shrinking and text wrapping; primary and compact buttons fit its width; `.hud-tools` and
`.start-controls` wrap; `.overlay` permits vertical scrolling. These rules accommodate enlarged
text without changing simulation coordinates, canvas lifetime, or the animation loop.

## Built-browser checks

The one-time bare Playwright fixture ran against `http://localhost:8367`, served from `dist/`
after `./build_github_pages.sh`. The complete run passed 18 states:

| Viewport | Dark states | Light states | Reduced motion |
| --- | --- | --- | --- |
| 1280 x 900 | Title, playing, paused | Title | - |
| 850 x 900 | Title, playing, paused | Title | - |
| 390 x 844 | Title, playing, paused | Title | Title |
| 320 x 740 | Title, playing, paused | Title | Paused |

All states have no horizontal page or viewport overflow, a visible frame border, clipped frame
decoration, visible keyboard outlines, and no page errors. All four playing states preserve
the 1.778 canvas ratio, expose the canvas at its center, retain the playing phase, and have no
menu overlay. The focus probe deliberately leaves playing canvas focus intact: focusing a HUD
button during play causes the documented canvas-blur pause.

At 320 pixels, a separate text-only enlargement probe doubled each element's computed font
size, including fixed-pixel font declarations. Newly mounted pause text was doubled too.
Title and pause menus have no horizontal overflow. Their content scrolls vertically; real
Start adventure, Pause, and Resume clicks succeed. Scrolling reaches Retry checkpoint.
This is a simulated text-only enlargement check, rather than a browser zoom claim.

Rendered inspection covered the wide title, phone gameplay, and narrow enlarged title/pause
screenshots, including their scrolled controls. The one-time fixture was removed after capture;
no permanent visual test was added. Screenshots and observations remain in gitignored
`test-results/frame/`. Integration and runtime-lifecycle acceptance belong to the broader task.

## Artifact identity

SHA-256 hashes identify the built snapshot and selected inspected evidence. Screenshot paths
below are local review artifacts and are not committed documentation assets.

| Artifact | SHA-256 |
| --- | --- |
| `src/style.css` and `dist/style.css` | `30e6fbe43113cf0bc59308880f34229bcf1e12ffdd62f3c958de96ce35e06dd8` |
| `dist/main.js` | `e9e93a18260bc01dceb6e09ada0d5ae568641cf9fccc40daa38a56d124b1531c` |
| `test-results/frame/observations-all.json` | `1178a49652b70ddfd1a2acd63f6ba656df8390fc9ed7047f16118f75aa32dbb4` |
| `test-results/frame/minimum-dark-title-text-200.png` | `33660ffbcf4917925a0e4f301169ef1a41080e131954dc145b126e0ab74f15e1` |
| `test-results/frame/minimum-dark-title-text-200-scrolled.png` | `770e0da89d021fb14a2217b9f1346e7985970b35049d35cc6fbe38bdd762282b` |
| `test-results/frame/minimum-dark-paused-text-200.png` | `48cd1437779925a8ce1dda6e80d5d82869cf559f868d6ff36de32a17707ef92e` |
| `test-results/frame/wide-dark-normal-title.png` | `7adfe495c2a5500d623c7c9d24f7426169c436cfd524b3386d8e8233d47f0636` |
| `test-results/frame/phone-dark-normal-playing.png` | `fe285a3ca238961d9f5dd3568465ddb68fc99919b1cbda0ba07f428144e0ee56` |
