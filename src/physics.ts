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
    const { axis, distance, period, phase = 0 } = platform.motion;
    rect[axis] += Math.sin((time / period + phase) * Math.PI * 2) * distance;
  }
  return rect;
}

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
