import type { LevelDefinition, StageId } from "./types/level";

// Decoration is keyed to world cells, so retries and camera motion preserve each molecule.
const STAGE_DENSITY: Record<StageId, number> = {
  membrane: 0.24,
  cytoplasm: 0.5,
  envelope: 0.6,
  receptor: 0.68,
  dna: 0.78,
  transcription: 0.36,
};

function sample(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** Muted cellular material sits behind authored scenery and every gameplay marker. */
export function cellularDebris(
  ctx: CanvasRenderingContext2D,
  level: LevelDefinition,
  cameraX: number,
  cameraY: number,
  time: number,
): void {
  const cell = 92;
  const parallax = 0.86;
  const offsetX = cameraX * parallax;
  const offsetY = cameraY * parallax;
  const firstColumn = Math.floor(offsetX / cell) - 1;
  const firstRow = Math.floor(offsetY / cell) - 1;
  const stageSeed = Object.keys(STAGE_DENSITY).indexOf(level.id) * 103;
  ctx.save();
  for (let column = firstColumn; column <= firstColumn + 12; column++) {
    const progress = Math.max(0, Math.min(1, (column * cell) / (level.width * parallax)));
    const density = STAGE_DENSITY[level.id] + progress * 0.2;
    for (let row = firstRow; row <= firstRow + 8; row++) {
      const seed = column * 73 + row * 211 + stageSeed;
      if (sample(seed + 1) > density) continue;
      const x = column * cell + 14 + sample(seed + 2) * 64 - offsetX;
      const y = row * cell + 14 + sample(seed + 3) * 64 - offsetY;
      const size = 13 + sample(seed + 4) * 17;
      const drift = Math.sin(time * 0.18 + seed) * 2;
      ctx.save();
      ctx.translate(x, y + drift);
      ctx.rotate(sample(seed + 5) * Math.PI * 2 + Math.sin(time * 0.06 + seed) * 0.035);
      ctx.lineWidth = 1.5;
      ctx.fillStyle = "#587e922f";
      ctx.strokeStyle = "#a3bbc35c";
      switch (Math.floor(sample(seed + 6) * 4)) {
        case 0:
          proteinCluster(ctx, size);
          break;
        case 1:
          membraneFragment(ctx, size);
          break;
        case 2:
          vesicle(ctx, size);
          break;
        case 3:
          ribosome(ctx, size);
          break;
      }
      ctx.restore();
    }
  }
  ctx.restore();
}

function proteinCluster(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = "#77739c4a";
  ctx.strokeStyle = "#b2a8ce65";
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.bezierCurveTo(-size * 1.5, -size, -size * 0.3, -size * 1.3, 0, -size * 0.65);
  ctx.bezierCurveTo(size * 0.8, -size * 1.4, size * 1.4, -size * 0.2, size * 0.75, 0);
  ctx.bezierCurveTo(size * 1.4, size, -size * 0.2, size * 1.25, -size * 0.4, size * 0.55);
  ctx.bezierCurveTo(-size * 1.3, size * 0.8, -size * 1.2, size * 0.2, -size, 0);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-size * 0.2, -size * 0.1, size * 0.22, 0, Math.PI * 1.6);
  ctx.stroke();
}

function membraneFragment(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.strokeStyle = "#b1a08667";
  ctx.fillStyle = "#b9a58765";
  for (let i = -2; i <= 2; i++) {
    const x = i * size * 0.34;
    const y = i * i * 1.2;
    ctx.beginPath();
    ctx.moveTo(x - 1, y + 4);
    ctx.lineTo(x - 3, y + size * 0.55);
    ctx.moveTo(x + 2, y + 4);
    ctx.lineTo(x + 5, y + size * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 3.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function vesicle(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = "#457f8433";
  ctx.strokeStyle = "#91b8b765";
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, 0, size - 4, size * 0.82 - 4, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "#91b8b730";
  ctx.stroke();
  ctx.fillStyle = "#abc8bc65";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(Math.cos(i * 2.4) * size * 0.4, Math.sin(i * 2.4) * size * 0.3, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ribosome(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = "#698ea445";
  ctx.strokeStyle = "#a4bdcc66";
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.2, size * 0.8, size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(size * 0.08, size * 0.48, size * 0.52, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}
