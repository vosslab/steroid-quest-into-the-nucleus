import { label, rounded } from "./drawing";
import type { FlowZone, Rect } from "./types/level";

function arrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-13, 0);
  ctx.lineTo(12, 0);
  ctx.lineTo(4, -6);
  ctx.moveTo(12, 0);
  ctx.lineTo(4, 6);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.restore();
}

/** Draw force arrows before entry; they remain still under reduced-motion preference. */
export function cellularCurrent(
  ctx: CanvasRenderingContext2D,
  zone: FlowZone,
  time: number,
  reducedMotion: boolean,
  viewport?: Rect,
): void {
  const magnitude = Math.hypot(zone.acceleration.x, zone.acceleration.y);
  const fill = zone.vortex ? "#9877df16" : "#64e1df12";
  rounded(ctx, zone, 22, fill, zone.vortex ? "#d9b3ff6d" : "#a8fff16d");
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(zone.x, zone.y, zone.width, zone.height, 22);
  ctx.clip();
  if (zone.vortex) {
    drawVortex(ctx, zone, time, reducedMotion);
  } else if (magnitude > 0) {
    const angle = Math.atan2(zone.acceleration.y, zone.acceleration.x);
    const firstY =
      zone.y + 30 + Math.max(0, Math.floor(((viewport?.y ?? zone.y) - zone.y - 30) / 58)) * 58;
    const firstX =
      zone.x + 32 + Math.max(0, Math.floor(((viewport?.x ?? zone.x) - zone.x - 32) / 74)) * 74;
    const lastY = Math.min(
      zone.y + zone.height,
      viewport ? viewport.y + viewport.height : Infinity,
    );
    const lastX = Math.min(zone.x + zone.width, viewport ? viewport.x + viewport.width : Infinity);
    for (let y = firstY; y < lastY; y += 58) {
      for (let x = firstX; x < lastX; x += 74) {
        const offset = reducedMotion ? 0 : ((time * 34 + x * 0.12 + y * 0.08) % 32) - 16;
        arrow(ctx, x + Math.cos(angle) * offset, y + Math.sin(angle) * offset, angle, "#b5fff1b8");
      }
    }
  }
  ctx.restore();
  if (zone.label) label(ctx, zone.label, zone.x + zone.width / 2, zone.y - 10, "#d9fff7", 11);
}

function drawVortex(
  ctx: CanvasRenderingContext2D,
  zone: FlowZone,
  time: number,
  reducedMotion: boolean,
): void {
  const vortex = zone.vortex;
  if (!vortex) return;
  const direction = vortex.strength < 0 ? -1 : 1;
  for (let ring = 24; ring < Math.min(zone.width, zone.height) * 0.55; ring += 25) {
    const turn = reducedMotion ? ring * 0.03 : time * direction * 0.72 + ring * 0.03;
    ctx.beginPath();
    ctx.arc(vortex.center.x, vortex.center.y, ring, turn, turn + Math.PI * 1.52);
    ctx.strokeStyle = "#d9c6ff83";
    ctx.lineWidth = 2;
    ctx.stroke();
    const a = turn + Math.PI * 1.52;
    arrow(
      ctx,
      vortex.center.x + Math.cos(a) * ring,
      vortex.center.y + Math.sin(a) * ring,
      a + (direction * Math.PI) / 2,
      "#f0dcff",
    );
  }
  ctx.beginPath();
  ctx.arc(vortex.center.x, vortex.center.y, 11, 0, Math.PI * 2);
  ctx.fillStyle = "#d5b0ff99";
  ctx.fill();
}

/** A short collision ripple clarifies every-side rebounds without implying a floor. */
export function reboundRipple(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  age: number,
  reducedMotion: boolean,
): void {
  if (age < 0 || age > 0.55) return;
  const progress = age / 0.55;
  ctx.save();
  ctx.globalAlpha = 1 - progress;
  ctx.strokeStyle = "#ffe7b2";
  ctx.lineWidth = 2;
  const radius = reducedMotion ? 32 : 18 + progress * 62;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function contactSpark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  age: number,
): void {
  if (age < 0 || age > 0.45) return;
  ctx.save();
  ctx.globalAlpha = 1 - age / 0.45;
  for (let index = 0; index < 7; index++) {
    const angle = (index * Math.PI * 2) / 7;
    const distance = 12 + age * 65;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#d5fff2";
    ctx.fill();
  }
  ctx.restore();
}
