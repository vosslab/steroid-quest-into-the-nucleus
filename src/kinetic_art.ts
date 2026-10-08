import { label, rounded } from "./drawing";
import type { FlowZone, Platform, Rect } from "./types/level";

/** Direction stays legible when decorative animation is disabled. */
export function cellularCurrent(ctx: CanvasRenderingContext2D, zone: FlowZone, time: number): void {
  const magnitude = Math.hypot(zone.acceleration.x, zone.acceleration.y);
  fieldIdentity(ctx, zone, time);
  if (magnitude === 0) return;
  const ux = zone.acceleration.x / magnitude;
  const uy = zone.acceleration.y / magnitude;
  const angle = Math.atan2(uy, ux);
  ctx.save();
  rounded(ctx, zone, 24, "#80e4df0c", "#80e4df38");
  ctx.beginPath();
  ctx.roundRect(zone.x, zone.y, zone.width, zone.height, 24);
  ctx.clip();
  // Sparse strands and small moving bubbles reveal the current without filling the route.
  for (let row = 0; row < zone.height; row += 68) {
    for (let column = 0; column < zone.width; column += 76) {
      const phase = column * 0.013 + row * 0.017;
      const drift = ((time * 32 + phase * 16) % 36) - 18;
      const x = zone.x + column + 38 + ux * drift;
      const y = zone.y + row + 34 + uy * drift;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-21, 3);
      ctx.quadraticCurveTo(-5, -5 + Math.sin(time + phase) * 2, 16, 0);
      ctx.moveTo(10, -5);
      ctx.lineTo(17, 0);
      ctx.lineTo(10, 5);
      ctx.strokeStyle = "#a3f4e780";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-27, 2, 2.6, 0, Math.PI * 2);
      ctx.strokeStyle = "#bdfaf158";
      ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}

/** Rings and mesh expose fields with zero current, including their entry and return edges. */
function fieldIdentity(ctx: CanvasRenderingContext2D, zone: FlowZone, time: number): void {
  const lowGravity = (zone.gravityScale ?? 1) < 1;
  const gel = (zone.drag ?? 0) > 0;
  if (!lowGravity && !gel) return;
  ctx.save();
  rounded(ctx, zone, 20, gel ? "#bdaceb0e" : "#96eaff0d", "#c5ecff88");
  ctx.beginPath();
  ctx.roundRect(zone.x, zone.y, zone.width, zone.height, 20);
  ctx.clip();
  if (gel) {
    ctx.strokeStyle = "#cab7f04a";
    ctx.lineWidth = 1;
    for (let x = -zone.height; x < zone.width; x += 42) {
      ctx.beginPath();
      ctx.moveTo(zone.x + x, zone.y);
      ctx.lineTo(zone.x + x + zone.height, zone.y + zone.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(zone.x + x + zone.height, zone.y);
      ctx.lineTo(zone.x + x, zone.y + zone.height);
      ctx.stroke();
    }
  }
  if (lowGravity) {
    for (let row = 0; row < zone.height; row += 85) {
      for (let column = 0; column < zone.width; column += 85) {
        const lift = (time * 12) % 25;
        const x = zone.x + column + 42;
        const y = zone.y + row + 45 - lift;
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.arc(x + 18, y + 21, 5, 0, Math.PI * 2);
        ctx.strokeStyle = "#b6efff65";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 5, y + 3);
        ctx.lineTo(x, y - 4);
        ctx.lineTo(x + 5, y + 3);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
  // Open brackets mark where ordinary movement resumes on either side.
  ctx.save();
  ctx.strokeStyle = "#d8efffc0";
  ctx.lineWidth = 2;
  for (const edge of [zone.x, zone.x + zone.width]) {
    const direction = edge === zone.x ? 1 : -1;
    for (const y of [zone.y + 18, zone.y + zone.height - 18]) {
      ctx.beginPath();
      ctx.moveTo(edge + direction * 10, y - 7);
      ctx.lineTo(edge, y);
      ctx.lineTo(edge + direction * 10, y + 7);
      ctx.stroke();
    }
  }
  label(
    ctx,
    lowGravity && gel ? "LOW GRAVITY / GEL" : lowGravity ? "LOW GRAVITY" : "VISCOUS GEL",
    zone.x + zone.width / 2,
    zone.y + 18,
    "#d8efff",
    11,
  );
  ctx.restore();
}

/** The flat bright rim is the collision top; spring detail moves inside the body. */
export function launchPad(
  ctx: CanvasRenderingContext2D,
  platform: Platform,
  r: Rect,
  age: number | undefined,
  reducedMotion: boolean,
): void {
  const diagonal = Boolean(platform.launch?.x);
  const color = diagonal ? "#78e2d2" : "#f1a5e2";
  const recoil =
    age === undefined || reducedMotion ? 0 : Math.sin(age * 24) * Math.exp(-age * 7) * 5;
  rounded(ctx, r, Math.min(12, r.height / 2), diagonal ? "#286b72" : "#824c88", color);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(r.x + 2, r.y + 3, Math.max(1, r.width - 4), Math.max(1, r.height - 5), 8);
  ctx.clip();
  for (let x = r.x + 10; x < r.x + r.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x - 7, r.y + r.height - 4);
    ctx.lineTo(x + 4, r.y + r.height * 0.65 + recoil);
    ctx.lineTo(x - 4, r.y + r.height * 0.35 + recoil);
    ctx.lineTo(x + 7, r.y + 4);
    ctx.strokeStyle = diagonal ? "#a2f8eac0" : "#ffe0f6c0";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
  rounded(ctx, { x: r.x + 3, y: r.y, width: Math.max(1, r.width - 6), height: 5 }, 3, "#fff0fc");
  const direction = Math.atan2(platform.launch?.y ?? -700, platform.launch?.x ?? 0);
  for (let x = r.x + 20; x < r.x + r.width - 8; x += 34) {
    ctx.save();
    ctx.translate(x, r.y - 16);
    ctx.rotate(direction);
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(9, 0);
    ctx.lineTo(2, -6);
    ctx.moveTo(9, 0);
    ctx.lineTo(2, 6);
    ctx.strokeStyle = color;
    ctx.lineWidth = diagonal ? 3 : 2;
    ctx.stroke();
    ctx.restore();
  }
}

export function launchRipple(
  ctx: CanvasRenderingContext2D,
  platform: Platform,
  r: Rect,
  age: number,
): void {
  if (age < 0 || age > 0.8) return;
  const x = r.x + r.width / 2;
  const y = r.y;
  const direction = Math.atan2(platform.launch?.y ?? -700, platform.launch?.x ?? 0);
  ctx.save();
  ctx.globalAlpha = (1 - age / 0.8) * 0.65;
  ctx.strokeStyle = platform.launch?.x ? "#b3fff0" : "#ffe0f6";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(x, y, 13 + age * 90, 5 + age * 22, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  for (let index = 0; index < 7; index++) {
    const angle = direction + (index - 3) * 0.2;
    const distance = 13 + age * (65 + (index % 3) * 20);
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = index % 2 ? "#c7fff2" : "#ffd5ed";
    ctx.fill();
  }
  ctx.restore();
}

export function bindingWave(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
): void {
  if (progress >= 1) return;
  ctx.save();
  ctx.globalAlpha = (1 - progress) * 0.55;
  ctx.strokeStyle = "#a6ffe2";
  ctx.lineWidth = 2;
  for (let index = 0; index < 2; index++) {
    ctx.beginPath();
    ctx.arc(x, y, 28 + progress * 115 + index * 15, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let index = 0; index < 12; index++) {
    const angle = (index * Math.PI) / 6;
    const radius = 34 + progress * 85;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f4e5ac";
    ctx.fill();
  }
  ctx.restore();
}
