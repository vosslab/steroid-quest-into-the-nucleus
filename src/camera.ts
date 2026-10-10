import type { Point } from "./types/level";
import type { RenderSnapshot } from "./types/render";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;
export type Camera = Point & { scale: number };

/** Follow the player normally, then center a captured destination while zooming. */
export function cameraFor(snapshot: RenderSnapshot): Camera {
  const { level, state } = snapshot;
  const player = state.player;
  const lookX = Math.max(-90, Math.min(90, player.vx * 0.19));
  const lookY = Math.max(-70, Math.min(70, player.vy * 0.15));
  const targetX = player.x + player.width / 2 - VIEW_WIDTH / 2 + lookX;
  const targetY = player.y + player.height / 2 - VIEW_HEIGHT / 2 + lookY;
  const x = Math.max(-24, Math.min(Math.max(0, level.width - VIEW_WIDTH) + 24, targetX));
  const y = Math.max(-24, Math.min(Math.max(0, level.height - VIEW_HEIGHT) + 24, targetY));
  if (state.transition && level.destination && !snapshot.reducedMotion) {
    const fraction = Math.min(1, state.transition.elapsed / state.transition.duration);
    const zoom = fraction * fraction * (3 - 2 * fraction);
    const scale = 1 + zoom * 1.2;
    const center = level.destination.center;
    const screenX = center.x - x;
    const screenY = center.y - y;
    // Interpolate in screen space so changing scale cannot push the focus outward.
    const anchorX = screenX + (VIEW_WIDTH / 2 - screenX) * zoom;
    const anchorY = screenY + (VIEW_HEIGHT / 2 - screenY) * zoom;
    return { x: center.x - anchorX / scale, y: center.y - anchorY / scale, scale };
  }
  return { x, y, scale: 1 };
}
