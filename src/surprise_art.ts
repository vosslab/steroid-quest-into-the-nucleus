import { decoration, label, rounded } from "./drawing";
import type { Platform, Point, Rect, StageId } from "./types/level";
import type { CrumbleState } from "./types/simulation";

/** The track shows the whole route; the tether follows authoritative collision geometry. */
export function orbitTrack(ctx: CanvasRenderingContext2D, platform: Platform, r: Rect): void {
  const motion = platform.motion;
  if (motion?.kind !== "orbit") return;
  const x = platform.x + platform.width / 2;
  const y = platform.y + platform.height + 24;
  ctx.save();
  ctx.strokeStyle = "#b0e6ff55";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 9]);
  ctx.beginPath();
  ctx.ellipse(x, y, motion.radiusX, motion.radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#b0e6ff35";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(r.x + r.width / 2, r.y + r.height + 24);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.strokeStyle = "#c3edff88";
  ctx.stroke();
  // Fixed tangent arrows show circulation without extra decorative animation.
  for (const turn of [0, Math.PI]) {
    const tx = x + Math.cos(turn) * motion.radiusX;
    const ty = y + Math.sin(turn) * motion.radiusY;
    ctx.beginPath();
    ctx.moveTo(tx - 5, ty - Math.cos(turn) * 8);
    ctx.lineTo(tx, ty);
    ctx.lineTo(tx + 5, ty - Math.cos(turn) * 8);
    ctx.stroke();
  }
  ctx.restore();
}

export function movingBody(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  stage: StageId,
  time: number,
): void {
  decoration(
    ctx,
    {
      kind: stage === "dna" ? "nucleosome" : "vesicle",
      x: r.x - 8,
      y: r.y + 5,
      width: r.width + 16,
      height: stage === "dna" ? 80 : 70,
    },
    time,
  );
}

/** Ribosomal beads split after contact; missing collision is always a dashed empty outline. */
export function ribosomeBridge(
  ctx: CanvasRenderingContext2D,
  platform: Platform,
  r: Rect,
  state: CrumbleState | undefined,
  reducedMotion: boolean,
): void {
  const config = platform.crumble;
  if (!config) return;
  const collapsed = state?.phase === "collapsed";
  const progress = state?.phase === "armed" ? Math.max(0, 1 - state.remaining / config.delay) : 0;
  ctx.save();
  if (collapsed) {
    ctx.setLineDash([3, 8]);
    ctx.strokeStyle = "#e7cde77a";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(r.x, r.y, r.width, r.height);
    ctx.setLineDash([]);
    // Falling pieces expire quickly even when reform is waiting for player clearance.
    const age = Math.max(0, config.reformAfter - state.remaining);
    if (!reducedMotion && age < 0.85) {
      ctx.globalAlpha = (1 - age / 0.85) * 0.8;
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.translate(
          r.x + ((i + 0.5) * r.width) / 6 + (i - 2.5) * age * 14,
          r.y + r.height + age * 90 + age * age * 100,
        );
        ctx.rotate((i % 2 ? 1 : -1) * age * 3);
        rounded(ctx, { x: -7, y: -5, width: 14, height: 10 }, 5, "#be88bc", "#f7d9ee");
        ctx.restore();
      }
    }
    ctx.restore();
    return;
  }
  rounded(ctx, r, 8, "#684064", "#cfa8cc");
  const beads = Math.max(2, Math.floor(r.width / 19));
  for (let i = 0; i < beads; i++) {
    const bx = r.x + ((i + 0.5) * r.width) / beads;
    for (let row = 0; row < 2; row++) {
      ctx.beginPath();
      ctx.ellipse(bx + (row ? 3 : -2), r.y + 9 + row * 10, 8, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = row ? "#b681bb" : "#efc5de";
      ctx.fill();
    }
  }
  // A continuous pale collision lip remains readable as cracks deepen below it.
  rounded(ctx, { x: r.x + 2, y: r.y, width: r.width - 4, height: 4 }, 2, "#ffe6f3");
  if (state?.phase === "armed") {
    for (let i = 1; i <= 3; i++) {
      const cx = r.x + (r.width * i) / 4;
      ctx.beginPath();
      ctx.moveTo(cx, r.y + 5);
      ctx.lineTo(cx - 4, r.y + 10);
      ctx.lineTo(cx + 3, r.y + 15);
      ctx.lineTo(cx - 3, r.y + 6 + progress * (r.height - 6));
      ctx.strokeStyle = "#291e38";
      ctx.lineWidth = 1 + progress * 2;
      ctx.stroke();
    }
    rounded(ctx, { x: r.x, y: r.y - 9, width: r.width, height: 3 }, 1, "#392937");
    if (progress < 1)
      rounded(
        ctx,
        { x: r.x, y: r.y - 9, width: r.width * (1 - progress), height: 3 },
        1,
        "#ffe2a4",
      );
  }
  ctx.restore();
}

function rnaPoint(px: number, y: number, distance: number, progress: number): Point {
  // One connected strand grows into a broad whorl, then opens as polymerase advances.
  const angle = distance / 27;
  const radius = Math.min(64, distance * 0.23);
  const coil = Math.min(1, distance / 45) * (1 - progress * 0.4);
  return {
    x: px - distance * 0.47 + Math.sin(angle) * radius * coil,
    y: y - 25 - distance * 0.22 + (Math.cos(angle) - 1) * radius * coil,
  };
}

/** One RNA transcript is the hero; particles and crowd are finite presentation details. */
export function transcriptionPayoff(
  ctx: CanvasRenderingContext2D,
  px: number,
  y: number,
  progress: number,
  time: number,
  reducedMotion: boolean,
): void {
  const baseColors = ["#ffe298", "#ffacae", "#89e8df", "#c6a4ff"];
  const length = progress * 380;
  ctx.save();
  ctx.beginPath();
  for (let distance = 0; distance <= length; distance += 2) {
    const point = rnaPoint(px, y, distance, progress);
    if (distance === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }
  ctx.strokeStyle = "#ffd87e";
  ctx.lineWidth = 5;
  ctx.shadowColor = "#ffc96b";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;
  for (let distance = 10; distance <= length; distance += 14) {
    const point = rnaPoint(px, y, distance, progress);
    const next = rnaPoint(px, y, distance + 1, progress);
    const angle = Math.atan2(next.y - point.y, next.x - point.x) + Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x + Math.cos(angle) * 8, point.y + Math.sin(angle) * 8);
    ctx.strokeStyle = baseColors[Math.floor(distance / 14) % 4] ?? "#ffe298";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // Incoming nucleotides converge on the enzyme; larger molecular silhouettes remain behind.
  for (let i = 0; i < 18; i++) {
    const phase = reducedMotion ? i / 18 : (time * 0.65 + i / 18) % 1;
    const nx = px + 25 + (1 - phase) * 125;
    const ny = y - 15 - (1 - phase) * 110 + Math.sin(i * 2.4) * 28;
    ctx.beginPath();
    ctx.arc(nx, ny, 2.5 + (i % 3), 0, Math.PI * 2);
    ctx.fillStyle = `${baseColors[i % 4] ?? "#ffe298"}b0`;
    ctx.fill();
  }
  for (let i = 0; i < 5; i++) {
    const phase = reducedMotion ? 0.5 : (time * 0.13 + i * 0.19) % 1;
    const mx = px + 50 + i * 32 - phase * 35;
    const my = y - 115 - (i % 2) * 28 + phase * 18;
    ctx.globalAlpha = 0.25;
    rounded(
      ctx,
      { x: mx, y: my, width: 22 + (i % 2) * 9, height: 23 },
      9,
      baseColors[i % 4] ?? "#ffe298",
      "#ffffff",
    );
  }
  ctx.globalAlpha = 1;
  if (progress > 0.25) {
    const tip = rnaPoint(px, y, length, progress);
    label(ctx, "RNA TRANSCRIPT", tip.x, tip.y - 25, "#ffe7a8", 12);
  }
  ctx.restore();
}
