import type { Decoration, Rect } from "./types/level";

export function rounded(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  radius: number,
  fill: string,
  stroke?: string,
): void {
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.width, r.height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = "#e8f5ff",
  size = 15,
): void {
  ctx.font = `600 ${size}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#07111bd9";
  const width = ctx.measureText(text).width + 20;
  rounded(ctx, { x: x - width / 2, y: y - size - 6, width, height: size + 13 }, 7, "#07111bd9");
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

/** A shared chevron motif identifies the complex and the response element by shape. */
export function motif(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size * 2);
  ctx.lineTo(x - size, y + size);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#fff5d9";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// Three hexagons and a pentagon share edges. The same outer contour defines the pocket.
const RING_RISE = Math.sqrt(3) * 4;
const STEROID_RINGS: readonly (readonly (readonly [number, number])[])[] = [
  [
    [-4, 0],
    [-8, RING_RISE],
    [-16, RING_RISE],
    [-20, 0],
    [-16, -RING_RISE],
    [-8, -RING_RISE],
  ],
  [
    [8, -RING_RISE],
    [4, 0],
    [-4, 0],
    [-8, -RING_RISE],
    [-4, -2 * RING_RISE],
    [4, -2 * RING_RISE],
  ],
  [
    [20, 0],
    [16, RING_RISE],
    [8, RING_RISE],
    [4, 0],
    [8, -RING_RISE],
    [16, -RING_RISE],
  ],
  [
    [16, -RING_RISE],
    [20, 0],
    [27.83, -1.66],
    [28.66, -9.62],
    [21.35, -12.87],
  ],
];
const STEROID_CONTOUR: readonly (readonly [number, number])[] = [
  [-20, 0],
  [-16, -RING_RISE],
  [-8, -RING_RISE],
  [-4, -2 * RING_RISE],
  [4, -2 * RING_RISE],
  [8, -RING_RISE],
  [16, -RING_RISE],
  [21.35, -12.87],
  [28.66, -9.62],
  [27.83, -1.66],
  [20, 0],
  [16, RING_RISE],
  [8, RING_RISE],
  [4, 0],
  [-4, 0],
  [-8, RING_RISE],
  [-16, RING_RISE],
];

function ringPath(
  ctx: CanvasRenderingContext2D,
  points: readonly (readonly [number, number])[],
): void {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    // Center the asymmetrical fused-ring silhouette around its visual midpoint.
    if (index === 0) ctx.moveTo((x - 4.3) * 0.8, (y + 3.5) * 0.8);
    else ctx.lineTo((x - 4.3) * 0.8, (y + 3.5) * 0.8);
  });
  ctx.closePath();
}

export function steroid(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.shadowColor = "#fb5169";
  ctx.shadowBlur = 10;
  for (const [i, ring] of STEROID_RINGS.entries()) {
    ringPath(ctx, ring);
    ctx.fillStyle = i % 2 ? "#f54e66" : "#ff7380";
    ctx.fill();
    ctx.strokeStyle = "#ffd1ca";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.restore();
}

export function receptor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  bound: boolean,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(-size, -size * 0.25);
  ctx.bezierCurveTo(-size * 1.4, -size * 1.25, size * 0.2, -size * 1.2, size * 0.75, -size * 0.65);
  ctx.bezierCurveTo(size * 1.5, -size * 0.05, size, size, size * 0.3, size);
  ctx.bezierCurveTo(-size * 0.8, size * 1.3, -size * 1.3, size * 0.5, -size, -size * 0.25);
  ctx.fillStyle = bound ? "#eab858" : "#ac84dd";
  ctx.fill();
  ctx.strokeStyle = bound ? "#fff1b1" : "#e1cbff";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.save();
  ctx.translate(0, -size * 0.04);
  const pocketScale = (size / 23) * 1.12;
  ctx.scale(pocketScale, pocketScale);
  ringPath(ctx, STEROID_CONTOUR);
  ctx.fillStyle = "#172037";
  ctx.fill();
  ctx.strokeStyle = "#f2dbab";
  ctx.lineWidth = 1.5 / pocketScale;
  ctx.stroke();
  ctx.restore();
  motif(ctx, 0, size * 0.5, size * 0.18, "#5adccc");
  if (bound) steroid(ctx, 0, -size * 0.04, size / 23);
  ctx.restore();
}

export function dna(ctx: CanvasRenderingContext2D, r: Rect, time = 0): void {
  ctx.lineWidth = 4;
  for (let strand = 0; strand < 2; strand++) {
    ctx.beginPath();
    for (let x = 0; x <= r.width; x += 5) {
      const y = r.y + r.height / 2 + Math.sin(x / 30 + strand * Math.PI + time) * r.height * 0.36;
      if (x === 0) ctx.moveTo(r.x + x, y);
      else ctx.lineTo(r.x + x, y);
    }
    ctx.strokeStyle = strand ? "#bd9af7" : "#65d6e2";
    ctx.stroke();
  }
  ctx.lineWidth = 2;
  for (let x = 0; x < r.width; x += 15) {
    const wave = Math.sin(x / 30 + time) * r.height * 0.36;
    ctx.beginPath();
    ctx.moveTo(r.x + x, r.y + r.height / 2 - wave);
    ctx.lineTo(r.x + x, r.y + r.height / 2 + wave);
    ctx.strokeStyle = "#dfd5ee99";
    ctx.stroke();
  }
}

export function decoration(ctx: CanvasRenderingContext2D, d: Decoration, time: number): void {
  const cx = d.x + d.width / 2;
  const cy = d.y + d.height / 2;
  switch (d.kind) {
    case "lipid":
      if (d.height > d.width) {
        for (let y = d.y; y < d.y + d.height; y += 19) {
          for (const x of [d.x + 10, d.x + d.width - 10]) {
            const direction = x < cx ? 1 : -1;
            ctx.strokeStyle = "#e6c99199";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y - 3);
            ctx.lineTo(x + direction * (d.width / 2 - 12), y - 5);
            ctx.moveTo(x, y + 3);
            ctx.lineTo(x + direction * (d.width / 2 - 12), y + 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 7, 0, Math.PI * 2);
            ctx.fillStyle = "#f6d985";
            ctx.fill();
          }
        }
        break;
      }
      for (let x = d.x; x < d.x + d.width; x += 19) {
        for (const y of [d.y + 10, d.y + d.height - 10]) {
          const direction = y < cy ? 1 : -1;
          ctx.strokeStyle = "#e6c99199";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x - 5, y + direction * (d.height / 2 - 12));
          ctx.moveTo(x + 3, y);
          ctx.lineTo(x + 5, y + direction * (d.height / 2 - 12));
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fillStyle = "#f6d985";
          ctx.fill();
        }
      }
      break;
    case "mitochondrion":
      rounded(ctx, d, d.height / 2, "#8e4558", "#dc8390");
      ctx.beginPath();
      for (let x = 12; x < d.width - 12; x += 12) {
        const y = d.y + d.height / 2 + Math.sin(x / 10) * d.height * 0.28;
        if (x === 12) ctx.moveTo(d.x + x, y);
        else ctx.lineTo(d.x + x, y);
      }
      ctx.strokeStyle = "#f4b7a2";
      ctx.lineWidth = 4;
      ctx.stroke();
      break;
    case "vesicle":
      ctx.beginPath();
      ctx.ellipse(cx, cy, d.width / 2, d.height / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#459ba12b";
      ctx.fill();
      ctx.strokeStyle = "#8cdcdba0";
      ctx.lineWidth = 3;
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(i * 2.4) * d.width * 0.23,
          cy + Math.sin(i * 2.4) * d.height * 0.22,
          4,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#b7eece99";
        ctx.fill();
      }
      break;
    case "filament":
      ctx.strokeStyle = "#619cc566";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y + d.height);
      ctx.bezierCurveTo(
        d.x + d.width * 0.3,
        d.y,
        d.x + d.width * 0.7,
        d.y + d.height,
        d.x + d.width,
        d.y,
      );
      ctx.stroke();
      break;
    case "pore":
      rounded(ctx, d, 26, "#071e30", "#78e5c2");
      rounded(
        ctx,
        { x: d.x + 12, y: d.y + 16, width: d.width - 24, height: d.height - 32 },
        20,
        "#0d3245",
        "#8cccca",
      );
      label(ctx, "OPEN PORE", cx, d.y - 16, "#a9f4d7");
      break;
    case "receptor":
      receptor(ctx, cx, cy, Math.min(d.width, d.height) * 0.43, false);
      label(ctx, "RECEPTOR", cx, d.y - 14);
      break;
    case "dna":
      dna(ctx, d);
      break;
    case "nucleosome":
      ctx.beginPath();
      ctx.ellipse(cx, cy, d.width / 2, d.height / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#694d89";
      ctx.fill();
      ctx.strokeStyle = "#c9b5f2";
      ctx.lineWidth = 4;
      ctx.stroke();
      dna(ctx, { x: d.x - 8, y: cy - 18, width: d.width + 16, height: 36 }, time * 0.05);
      break;
  }
}
