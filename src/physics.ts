import type { Platform, Rect } from "./types/level";

/** Renderer and simulation share this geometry; decorative outlines do not collide. */
export function platformRect(platform: Platform, time: number): Rect {
  const rect: Rect = {
    x: platform.x,
    y: platform.y,
    width: platform.width,
    height: platform.height,
  };
  if (platform.motion) {
    const motion = platform.motion;
    const angle = (time / motion.period + (motion.phase ?? 0)) * Math.PI * 2;
    if (motion.kind === "orbit") {
      rect.x += Math.cos(angle) * motion.radiusX;
      rect.y += Math.sin(angle) * motion.radiusY;
    } else {
      rect[motion.axis] += Math.sin(angle) * motion.distance;
    }
  }
  return rect;
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
