import type { Decoration, PlatformMaterial, Rect } from "./types/level";

export function rounded(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  radius: number,
  fill: string | CanvasGradient | CanvasPattern,
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

/**
 * Draw a substantial cellular mass inside the exact collision rectangle.  The organic details
 * explain what is solid, while the rectangle remains the only source of platform physics.
 */
export function organellePlatform(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  material: PlatformMaterial,
  accent: string,
): void {
  const radius = Math.min(18, r.height / 2, r.width / 8);
  const palette = materialPalette(material, accent);
  const fill = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.height);
  fill.addColorStop(0, palette.light);
  fill.addColorStop(0.16, palette.mid);
  fill.addColorStop(1, palette.dark);
  rounded(ctx, r, radius, fill, palette.rim);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(r.x + 2, r.y + 2, Math.max(1, r.width - 4), Math.max(1, r.height - 4), radius);
  ctx.clip();
  if (material === "mitochondrion") drawMitochondrialCristae(ctx, r, palette.detail);
  if (material === "reticulum") drawReticulumChannels(ctx, r, palette.detail, palette.light);
  if (material === "gel") drawGelMatrix(ctx, r, palette.detail, palette.light);
  if (material === "membrane") drawMembraneLayers(ctx, r, palette.detail);
  ctx.restore();
  rounded(
    ctx,
    { x: r.x + 5, y: r.y + 4, width: Math.max(1, r.width - 10), height: Math.min(6, r.height / 3) },
    3,
    `${palette.light}a8`,
  );
}

type MaterialPalette = { light: string; mid: string; dark: string; rim: string; detail: string };

function materialPalette(material: PlatformMaterial, accent: string): MaterialPalette {
  switch (material) {
    case "mitochondrion":
      return {
        light: "#f29c84",
        mid: "#9e4a61",
        dark: "#44243f",
        rim: "#ffd4b0",
        detail: "#ffccb0",
      };
    case "reticulum":
      return {
        light: "#a0e2d0",
        mid: "#397b84",
        dark: "#173b56",
        rim: "#c9fff0",
        detail: "#d8fff2",
      };
    case "gel":
      return {
        light: "#a8d8e2",
        mid: "#4f8295",
        dark: "#1d485f",
        rim: "#cef8fa",
        detail: "#defaff",
      };
    case "membrane":
      return { light: accent, mid: "#bd7f5b", dark: "#59364b", rim: "#ffe2a0", detail: "#fff1b5" };
  }
}

function drawMitochondrialCristae(ctx: CanvasRenderingContext2D, r: Rect, detail: string): void {
  const spacing = 26;
  for (let x = r.x + 14; x < r.x + r.width - 8; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, r.y + 7);
    ctx.bezierCurveTo(
      x - 10,
      r.y + r.height * 0.36,
      x + 12,
      r.y + r.height * 0.55,
      x,
      r.y + r.height - 7,
    );
    ctx.strokeStyle = `${detail}b8`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawReticulumChannels(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  detail: string,
  light: string,
): void {
  const channelHeight = Math.max(12, Math.min(25, r.height * 0.3));
  for (let y = r.y + 12; y < r.y + r.height - 8; y += channelHeight + 11) {
    ctx.beginPath();
    ctx.moveTo(r.x - 12, y);
    for (let x = r.x; x <= r.x + r.width + 16; x += 28) {
      ctx.quadraticCurveTo(x + 14, y - channelHeight * 0.42, x + 28, y);
    }
    ctx.strokeStyle = `${detail}ab`;
    ctx.lineWidth = 4;
    ctx.stroke();
    for (let x = r.x + 18; x < r.x + r.width; x += 38) {
      ctx.beginPath();
      ctx.arc(x, y + channelHeight * 0.38, 3.3, 0, Math.PI * 2);
      ctx.fillStyle = `${light}bb`;
      ctx.fill();
    }
  }
}

function drawGelMatrix(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  detail: string,
  light: string,
): void {
  const step = 26;
  for (let x = r.x - r.height; x < r.x + r.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, r.y + r.height);
    ctx.lineTo(x + r.height, r.y);
    ctx.strokeStyle = `${detail}58`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  for (let x = r.x + 12; x < r.x + r.width; x += 30) {
    for (let y = r.y + 13; y < r.y + r.height; y += 28) {
      ctx.beginPath();
      ctx.arc(x + (Math.floor(y / 28) % 2) * 8, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = `${light}86`;
      ctx.fill();
    }
  }
}

function drawMembraneLayers(ctx: CanvasRenderingContext2D, r: Rect, detail: string): void {
  const isVertical = r.height > r.width;
  const span = isVertical ? r.height : r.width;
  for (let offset = 12; offset < span; offset += 20) {
    const x = isVertical ? r.x + r.width * 0.3 : r.x + offset;
    const y = isVertical ? r.y + offset : r.y + r.height * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, 4.6, 0, Math.PI * 2);
    ctx.fillStyle = `${detail}cf`;
    ctx.fill();
    ctx.beginPath();
    if (isVertical) {
      ctx.moveTo(x + 4, y);
      ctx.lineTo(r.x + r.width * 0.7, y);
    } else {
      ctx.moveTo(x, y + 4);
      ctx.lineTo(x, r.y + r.height * 0.7);
    }
    ctx.strokeStyle = `${detail}8d`;
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
  flex = 0,
): void {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    // Apply one coherent schematic projection to every shared ring/pocket vertex.
    // This preserves fused edges; rings never rotate as independent hinged pieces.
    const centeredX = x - 4.3;
    const centeredY = y + 3.5;
    const projectedX = (centeredX + flex * centeredY * 0.12) * 0.8;
    const projectedY = (centeredY + flex * ((centeredX * centeredX) / 180 - 1.2)) * 0.8;
    if (index === 0) ctx.moveTo(projectedX, projectedY);
    else ctx.lineTo(projectedX, projectedY);
  });
  ctx.closePath();
}

export function steroid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1,
  flex = 0,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.shadowColor = "#fb5169";
  ctx.shadowBlur = 10;
  for (const [i, ring] of STEROID_RINGS.entries()) {
    ringPath(ctx, ring, flex);
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
  settling = 1,
  flex = 0,
): void {
  ctx.save();
  ctx.translate(x, y);
  // The protein and its pocket relax together around the unchanged red scaffold.
  ctx.scale(1 + (1 - settling) * 0.24, 1 - (1 - settling) * 0.12);
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
  const pocketScale = (size / 23) * (1.12 + (1 - settling) * 0.24);
  ctx.scale(pocketScale, pocketScale);
  ringPath(ctx, STEROID_CONTOUR, flex);
  ctx.fillStyle = "#172037";
  ctx.fill();
  ctx.strokeStyle = "#f2dbab";
  ctx.lineWidth = 1.5 / pocketScale;
  ctx.stroke();
  ctx.restore();
  motif(ctx, 0, size * 0.5, size * 0.18, "#5adccc");
  if (bound) steroid(ctx, 0, -size * 0.04, size / 23, flex);
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
