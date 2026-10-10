import { dna, label, motif, receptor, rounded } from "./drawing";
import type { DestinationDefinition } from "./types/level";
import type { EncounterProgress } from "./types/simulation";

/** Destination bodies are recognizable biological scenery; the ring alone shows capture state. */
export function biologicalDestination(
  ctx: CanvasRenderingContext2D,
  destination: DestinationDefinition,
  progress: EncounterProgress,
): void {
  const { center, radius } = destination;
  const body = Math.max(26, Math.min(62, radius * 0.72));
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.globalAlpha *= progress.ready ? 1 : 0.62;
  switch (destination.motif) {
    case "vesicle":
      drawVesicle(ctx, body);
      break;
    case "nucleus":
      drawNucleus(ctx, body);
      break;
    case "receptor":
      receptor(ctx, 0, 0, body * 0.85, false);
      break;
    case "chromatin":
      drawChromatin(ctx, body);
      break;
    case "gene":
      drawGene(ctx, body);
      break;
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = progress.ready ? "#c4ffe7" : "#b3c3d177";
  ctx.lineWidth = progress.ready ? 3 : 2;
  ctx.setLineDash(progress.ready ? [] : [4, 7]);
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  const segments = Math.max(1, progress.total);
  for (let index = 0; index < segments; index++) {
    const start = -Math.PI / 2 + (index * Math.PI * 2) / segments + 0.06;
    const end = -Math.PI / 2 + ((index + 1) * Math.PI * 2) / segments - 0.06;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius + 7, start, end);
    ctx.strokeStyle = index < progress.completed ? "#b7ffe1" : "#55737f";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  label(ctx, destination.label, center.x, center.y - radius - 18, "#e8fff6", 12);
  label(
    ctx,
    progress.ready
      ? "READY - ENTER THE RING"
      : `${progress.completed} / ${progress.total} REQUIRED`,
    center.x,
    center.y + radius + 34,
    progress.ready ? "#c4ffe7" : "#d7e3e9",
    11,
  );
  ctx.restore();
}

function drawVesicle(ctx: CanvasRenderingContext2D, radius: number): void {
  ctx.beginPath();
  ctx.arc(0, -4, radius * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = "#3f8189";
  ctx.fill();
  ctx.strokeStyle = "#b7f9ea";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -4, radius * 0.56, 0, Math.PI * 2);
  ctx.strokeStyle = "#91d4cd";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-radius, radius * 0.86);
  ctx.lineTo(radius, radius * 0.86);
  ctx.strokeStyle = "#bfabeb";
  ctx.lineWidth = 5;
  ctx.stroke();
  for (const direction of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, radius * 0.6);
    ctx.lineTo(direction * radius * 0.28, radius * 0.75);
    ctx.lineTo(direction * radius * 0.46, radius * 0.85);
    ctx.strokeStyle = "#ffe1a0";
    ctx.lineWidth = 4;
    ctx.stroke();
    rounded(
      ctx,
      { x: direction * radius * 0.46 - 6, y: radius * 0.85 - 4, width: 12, height: 8 },
      4,
      "#ffdfa3",
    );
  }
}

function drawNucleus(ctx: CanvasRenderingContext2D, radius: number): void {
  for (const ring of [1, 0.86]) {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * ring, radius * ring * 0.88, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#514475";
    ctx.strokeStyle = "#d5c1f5";
    ctx.lineWidth = 3;
    if (ring === 1) ctx.fill();
    ctx.stroke();
  }
  dna(ctx, { x: -radius * 0.54, y: -14, width: radius * 1.08, height: 28 });
  for (let index = 0; index < 7; index++) {
    const angle = (index * Math.PI * 2) / 7;
    ctx.save();
    ctx.translate(Math.cos(angle) * radius * 0.93, Math.sin(angle) * radius * 0.82);
    ctx.rotate(angle);
    rounded(ctx, { x: -7, y: -9, width: 14, height: 18 }, 5, "#142a3e", "#a5f8e6");
    ctx.restore();
  }
}

function drawChromatin(ctx: CanvasRenderingContext2D, radius: number): void {
  ctx.beginPath();
  for (let index = 0; index <= 120; index++) {
    const phase = index / 120;
    const angle = phase * Math.PI * 5;
    const x = (phase - 0.5) * radius * 1.7;
    const y = Math.sin(angle) * radius * 0.5;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#9edfee";
  ctx.lineWidth = 6;
  ctx.stroke();
  for (let index = 0; index < 5; index++) {
    const x = (index - 2) * radius * 0.34;
    const y = Math.sin(index * Math.PI * 1.25) * radius * 0.5;
    rounded(ctx, { x: x - 11, y: y - 11, width: 22, height: 22 }, 9, "#bd9ce5", "#e8d5ff");
  }
}

function drawGene(ctx: CanvasRenderingContext2D, radius: number): void {
  dna(ctx, { x: -radius, y: -10, width: radius * 2, height: 26 });
  motif(ctx, -radius * 0.48, -3, 9, "#5adccc");
  rounded(ctx, { x: radius * 0.12, y: 22, width: radius * 0.8, height: 13 }, 4, "#ffd38a");
  label(ctx, "GENE", radius * 0.5, 57, "#ffe2ae", 10);
}
