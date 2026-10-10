import { pathPoint } from "./physics";
import { decoration, label, rounded } from "./drawing";
import type { Point, Transport } from "./types/level";

/** A visible dotted route makes a channel or cargo ride understandable before contact. */
export function transportRoute(
  ctx: CanvasRenderingContext2D,
  transport: Transport,
  path: readonly Point[],
): void {
  if (path.length < 2) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(path[0]?.x ?? 0, path[0]?.y ?? 0);
  for (let sample = 1; sample <= 80; sample++) {
    const point = pathPoint(path, sample / 80);
    ctx.lineTo(point.x, point.y);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = transport.kind === "channel" ? "#8ce9ffaf" : "#ffe0a3a4";
  ctx.lineWidth = transport.kind === "channel" ? transport.radius * 2 : 3;
  if (transport.kind === "channel") {
    const sceneAlpha = ctx.globalAlpha;
    ctx.globalAlpha = sceneAlpha * 0.18;
    ctx.stroke();
    ctx.globalAlpha = sceneAlpha * 0.82;
    ctx.lineWidth = 2;
  }
  ctx.setLineDash(transport.kind === "channel" ? [4, 10] : [7, 8]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  const first = path[0];
  if (first && transport.kind === "channel") {
    ctx.beginPath();
    ctx.arc(first.x, first.y, transport.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#c7ffff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  if (first && transport.label)
    label(ctx, transport.label, first.x, first.y - transport.radius - 12, "#ecfff9", 11);
}

export function transportBody(
  ctx: CanvasRenderingContext2D,
  transport: Transport,
  position: Point,
  time: number,
  reducedMotion: boolean,
): void {
  const radius = transport.radius;
  if (transport.kind === "channel") {
    ctx.beginPath();
    ctx.arc(position.x, position.y, Math.max(8, radius * 0.32), 0, Math.PI * 2);
    ctx.fillStyle = "#c6f8ffbf";
    ctx.fill();
    return;
  }
  if (transport.kind === "motor") {
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.strokeStyle = "#c5a8ff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-radius * 1.5, radius * 0.5);
    ctx.lineTo(radius * 1.2, -radius * 0.5);
    ctx.stroke();
    for (const x of [-radius * 0.9, 0, radius * 0.9]) {
      ctx.beginPath();
      ctx.arc(x, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#f0c9ff";
      ctx.fill();
    }
    ctx.restore();
  }
  const pulse = reducedMotion ? 0 : Math.sin(time * 3.1) * 2;
  decoration(
    ctx,
    {
      kind: "vesicle",
      x: position.x - radius,
      y: position.y - radius + pulse,
      width: radius * 2,
      height: radius * 2,
    },
    time,
  );
  rounded(
    ctx,
    { x: position.x - 5, y: position.y - 5 + pulse, width: 10, height: 10 },
    5,
    "#ffe5a8",
  );
}

/** The final transcript remains one connected visual strand as polymerase progresses. */
export function transcriptionPayoff(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  time: number,
  reducedMotion: boolean,
): void {
  const length = 280 * progress;
  ctx.save();
  ctx.beginPath();
  for (let distance = 0; distance <= length; distance += 3) {
    const px = x - distance * 0.62;
    const py = y - 22 - distance * 0.15 + Math.sin(distance / 25) * Math.min(38, distance * 0.18);
    if (distance === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = "#ffd87e";
  ctx.lineWidth = 5;
  ctx.shadowColor = "#ffc96b";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;
  for (let index = 0; index < 12; index++) {
    const phase = reducedMotion ? index / 12 : (time * 0.55 + index / 12) % 1;
    const px = x + 18 + (1 - phase) * 120;
    const py = y - 35 - (1 - phase) * 90 + Math.sin(index * 2.3) * 22;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = index % 2 ? "#89e8df" : "#ffacae";
    ctx.fill();
  }
  if (progress > 0.2) label(ctx, "RNA TRANSCRIPT", x - length * 0.52, y - 92, "#ffe7a8", 11);
  ctx.restore();
}
