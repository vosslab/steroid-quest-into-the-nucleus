import {
  decoration,
  dna,
  label,
  motif,
  organellePlatform,
  receptor,
  rounded,
  steroid,
} from "./drawing";
import { cellularDebris } from "./debris";
import { platformRect } from "./physics";
import type { RenderSnapshot, Renderer } from "./types/render";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;

/** Canvas draws snapshots; simulation alone controls progression and checkpoints. */
export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is required to play Steroid Quest.");
  let disposed = false;
  let bindingStarted: number | undefined;
  let bindingInitialFlex = 0;
  let lastFreeFlex = 0;
  return {
    draw(snapshot: RenderSnapshot): void {
      if (disposed) return;
      const { state, reducedMotion } = snapshot;
      if (!state.receptorBound) {
        // Replay clears the render-only transition without touching session authority.
        bindingStarted = undefined;
        lastFreeFlex = reducedMotion ? 0 : Math.sin(state.elapsed * 1.8) * 2.25;
      } else if (bindingStarted === undefined) {
        bindingStarted = state.elapsed;
        bindingInitialFlex = lastFreeFlex;
      }
      const progress =
        bindingStarted === undefined || reducedMotion
          ? 1
          : Math.min(1, Math.max(0, (state.elapsed - bindingStarted) / 1.6));
      const settling = progress * progress * (3 - 2 * progress);
      const boundFlex = reducedMotion ? 0.65 : 1.65;
      const flex = state.receptorBound
        ? bindingInitialFlex * (1 - settling) + boundFlex * settling
        : lastFreeFlex;
      drawWorld(ctx, snapshot, settling, flex);
    },
    dispose(): void {
      disposed = true;
    },
  };
}

function drawWorld(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  settling: number,
  flex: number,
): void {
  const { level, state, reducedMotion } = snapshot;
  const { player } = state;
  const cameraX = Math.max(0, Math.min(level.width - VIEW_WIDTH, player.x - VIEW_WIDTH * 0.34));
  // Air jumps can rise above the authored origin; follow them while keeping the floor clamp.
  const cameraY = Math.min(Math.max(0, level.height - VIEW_HEIGHT), player.y - VIEW_HEIGHT * 0.57);
  const time = reducedMotion ? 0 : state.levelTime;
  ctx.save();
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, level.palette.background);
  gradient.addColorStop(1, "#071420");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  cellularDebris(ctx, level, cameraX, cameraY, time);
  // Stable seeded-looking particles provide depth without random frame-to-frame noise.
  for (let i = 0; i < 65; i++) {
    const x = (((i * 137.7 - cameraX * 0.22) % 1100) + 1100) % 1100;
    const y = (((i * 79.1 - cameraY * 0.2 + Math.sin(time * 0.15 + i) * 5) % 590) + 590) % 590;
    ctx.beginPath();
    ctx.arc(x, y, i % 3 === 0 ? 2.5 : 1.2, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 ? "#d1e4ff20" : `${level.palette.accent}55`;
    ctx.fill();
  }
  ctx.save();
  ctx.translate(-cameraX, -cameraY);
  ctx.globalAlpha = 0.8;
  for (const d of level.decorations) {
    if (d.kind === "lipid" || d.kind === "pore") continue;
    if (d.x + d.width < cameraX - 100 || d.x > cameraX + VIEW_WIDTH + 100) continue;
    decoration(ctx, d, time);
  }
  ctx.globalAlpha = 1;
  for (const p of level.platforms) {
    const r = platformRect(p, state.levelTime);
    if (r.x + r.width < cameraX || r.x > cameraX + VIEW_WIDTH) continue;
    // Moving molecular bodies use the same translated rectangle as the collision top.
    // Decorative motion preferences never freeze a body while its platform keeps moving.
    if (p.motion && level.id === "dna") {
      decoration(
        ctx,
        {
          kind: "nucleosome",
          x: r.x + r.width / 2 - 65,
          y: r.y + r.height,
          width: 130,
          height: 80,
        },
        time,
      );
      dna(ctx, { x: r.x - 8, y: r.y + r.height + 28, width: r.width + 16, height: 36 });
    }
    if (p.motion && level.id === "cytoplasm") {
      decoration(
        ctx,
        {
          kind: "vesicle",
          x: r.x - 8,
          y: r.y + 3,
          width: r.width + 16,
          height: 70,
        },
        time,
      );
    }
    if (p.material && p.kind === "solid") {
      organellePlatform(ctx, r, p.material, level.palette.accent);
    } else {
      const color = p.kind === "bounce" ? "#dc9ad5" : level.palette.foreground;
      rounded(ctx, r, Math.min(12, r.height / 2), color, "#ffffff25");
      rounded(
        ctx,
        { x: r.x + 3, y: r.y, width: Math.max(1, r.width - 6), height: 5 },
        3,
        p.kind === "bounce" ? "#ffe2fa" : level.palette.accent,
      );
    }
    if (p.kind === "bounce") {
      for (let x = r.x + 18; x < r.x + r.width; x += 26) {
        ctx.beginPath();
        ctx.moveTo(x - 6, r.y - 6);
        ctx.lineTo(x, r.y - 13);
        ctx.lineTo(x + 6, r.y - 6);
        ctx.strokeStyle = "#ffe2fa";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    if (p.motion) {
      ctx.beginPath();
      ctx.arc(r.x + r.width / 2, r.y + r.height / 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#f1f7ffaa";
      ctx.fill();
    }
  }
  // Membrane surfaces and pore labels sit above their opaque collision support.
  ctx.globalAlpha = 0.8;
  for (const d of level.decorations) {
    if (d.kind !== "lipid" && d.kind !== "pore") continue;
    if (d.x + d.width < cameraX - 100 || d.x > cameraX + VIEW_WIDTH + 100) continue;
    decoration(ctx, d, time);
  }
  ctx.globalAlpha = 1;
  for (const h of level.hazards) {
    rounded(ctx, h, 8, "#c9586640");
    ctx.strokeStyle = "#ff96a2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = h.x; x < h.x + h.width; x += 18) {
      ctx.moveTo(x, h.y + h.height);
      ctx.lineTo(x + 9, h.y + 3);
      ctx.lineTo(x + 18, h.y + h.height);
    }
    ctx.stroke();
    if (h.kind === "enzyme" && h.width > 40) {
      ctx.beginPath();
      ctx.arc(
        h.x + h.width / 2,
        h.y + h.height / 2,
        Math.min(h.width, h.height) * 0.28,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  }
  for (const checkpoint of level.checkpoints) {
    const active = checkpoint.id === state.checkpoint.id;
    ctx.strokeStyle = active ? "#a7ffd3" : "#7ab29e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(checkpoint.x + 8, checkpoint.y + checkpoint.height);
    ctx.lineTo(checkpoint.x + 8, checkpoint.y + 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(checkpoint.x + 8, checkpoint.y + 4);
    ctx.lineTo(checkpoint.x + 28, checkpoint.y + 11);
    ctx.lineTo(checkpoint.x + 8, checkpoint.y + 20);
    ctx.closePath();
    ctx.fillStyle = active ? "#a7ffd3" : "#559c8a";
    ctx.fill();
  }
  for (const item of level.collectibles) {
    if (state.collectedIds.has(item.id)) continue;
    const bob = Math.sin(time * 2.5 + item.x) * 4;
    ctx.save();
    ctx.translate(item.x, item.y + bob);
    ctx.rotate(Math.PI / 4);
    ctx.shadowColor = "#ffda83";
    ctx.shadowBlur = 12;
    rounded(ctx, { x: -7, y: -7, width: 14, height: 14 }, 2, "#fbd979", "#fff1bd");
    ctx.restore();
  }
  for (const trigger of level.triggers) {
    if (trigger.kind === "exit") {
      // Docking at the response element already communicates this stage's destination.
      const dockingTrigger = level.triggers.some(
        (other) =>
          other.kind === "hre" &&
          other.x < trigger.x + trigger.width &&
          other.x + other.width > trigger.x &&
          other.y < trigger.y + trigger.height &&
          other.y + other.height > trigger.y,
      );
      if (dockingTrigger) continue;
      const x = trigger.x + trigger.width / 2;
      const y = trigger.y + trigger.height / 2;
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 15);
      ctx.lineTo(x + 8, y);
      ctx.lineTo(x - 12, y + 15);
      ctx.strokeStyle = "#b4f8df";
      ctx.lineWidth = 5;
      ctx.stroke();
      label(ctx, "CONTINUE", x, trigger.y - 12, "#c6f7e4", 12);
    }
    if (trigger.kind === "hre") {
      motif(ctx, trigger.x + trigger.width / 2, trigger.y + trigger.height / 2, 14, "#5adccc");
      label(ctx, "RESPONSE ELEMENT", trigger.x + trigger.width / 2, trigger.y - 13, "#bbf8ed", 13);
    }
  }
  if (state.hreBound && level.id === "transcription") drawTranscription(ctx, snapshot);
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  ctx.save();
  if (state.phase === "respawning") ctx.globalAlpha = 0.35;
  if (state.receptorBound) {
    receptor(ctx, centerX, centerY, 24, true, settling, flex);
    if (!player.grounded && player.airJumpsRemaining > 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 32, 0.15, Math.PI - 0.15);
      ctx.strokeStyle = "#7af5ded0";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  } else {
    // Exaggerated display motion follows simulation time, so pause freezes it too.
    // Collision bounds and movement remain the simulation's unchanged rectangle.
    ctx.translate(centerX, centerY + (reducedMotion ? 0 : Math.sin(state.elapsed * 3.6) * 2.8));
    ctx.rotate(reducedMotion ? 0 : Math.sin(state.elapsed * 1.8) * 0.18);
    steroid(ctx, 0, 0, 1.35, flex);
  }
  ctx.restore();
  ctx.restore();
  // Soft vignette keeps the action readable against dense biological environments.
  const shade = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  shade.addColorStop(0, "#03101b40");
  shade.addColorStop(0.3, "#03101b00");
  shade.addColorStop(0.85, "#03101b00");
  shade.addColorStop(1, "#03101b50");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  if (state.phase === "recruiting" && state.recruitmentCount < 3) {
    const fraction = (state.recruitmentClock % 1.4) / 1.4;
    const bar = { x: 330, y: VIEW_HEIGHT - 60, width: 300, height: 16 };
    rounded(
      ctx,
      { x: 302, y: VIEW_HEIGHT - 106, width: 356, height: 90 },
      12,
      "#071420ee",
      "#d5eee7",
    );
    label(ctx, "SPACE / JUMP IN THE BRACKET", VIEW_WIDTH / 2, VIEW_HEIGHT - 80, "#f0fbf7", 13);
    rounded(ctx, bar, 8, "#435463");
    rounded(
      ctx,
      { x: bar.x + bar.width * 0.2, y: bar.y, width: bar.width * 0.6, height: bar.height },
      3,
      "#70ceb1",
    );
    ctx.strokeStyle = "#f0fbf7";
    ctx.lineWidth = 2;
    ctx.strokeRect(bar.x + bar.width * 0.2, bar.y - 3, bar.width * 0.6, bar.height + 6);
    rounded(
      ctx,
      { x: bar.x + fraction * bar.width - 3, y: bar.y - 6, width: 6, height: 28 },
      3,
      "#ffffff",
      "#071420",
    );
  }
  ctx.restore();
}

function drawTranscription(ctx: CanvasRenderingContext2D, { state, level }: RenderSnapshot): void {
  const trigger = level.triggers.find(
    (item) => item.kind === "transcription" || item.kind === "hre",
  );
  if (!trigger) return;
  const x = trigger.x + trigger.width / 2;
  const y = state.player.y + state.player.height + 24;
  const promoterX = x + 100;
  dna(ctx, { x: x - 45, y, width: 550, height: 32 });
  label(ctx, "PROMOTER", promoterX, y + 66, "#e3d4ff", 13);
  for (let i = 0; i < state.recruitmentCount; i++) {
    const mx = promoterX + i * 32;
    rounded(
      ctx,
      { x: mx - 16, y: y - 40 - (i % 2) * 8, width: 29, height: 32 },
      9,
      ["#b5a3eb", "#6db7cd", "#e9ba77"][i] ?? "#b5a3eb",
      "#f6e8ff",
    );
  }
  if (state.recruitmentCount === 3) {
    const progress = Math.max(0, Math.min(1, 1 - state.phaseRemaining / 4));
    const px = promoterX + progress * 330;
    rounded(ctx, { x: px - 24, y: y - 29, width: 58, height: 47 }, 20, "#d2b8ed", "#fff0ff");
    label(ctx, "RNA POLYMERASE", px, y - 44, "#ecd9ff", 12);
    ctx.beginPath();
    const length = progress * 210;
    for (let i = 0; i <= length; i += 3) {
      const rx = px - i * 0.7;
      const ry = y - 24 - i * 0.35 + Math.sin(i / 8) * 5;
      if (i === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.strokeStyle = "#ffd87e";
    ctx.lineWidth = 4;
    ctx.stroke();
    if (progress > 0.3)
      label(ctx, "RNA TRANSCRIPT", px - length * 0.45, y - length * 0.35 - 40, "#ffe7a8", 12);
  }
}
