import {
  collisionShape,
  decoration,
  dna,
  label,
  motif,
  organelleSurface,
  receptor,
  rounded,
  steroid,
} from "./drawing";
import { cellularDebris } from "./debris";
import { cellularCurrent, contactSpark, reboundRipple } from "./kinetic_art";
import { isActive, pathPoint, shapeAt, transportPosition, transportProgress } from "./physics";
import { transcriptionPayoff, transportBody, transportRoute } from "./surprise_art";
import type { RenderSnapshot, Renderer } from "./types/render";
import type { GameEvent } from "./types/simulation";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;
type Transient = { x: number; y: number; started: number; kind: "bounce" | "contact" };

/** Snapshot-only cell renderer. Simulation owns all movement, captures, phases, and progress. */
export function createRenderer(canvas: HTMLCanvasElement): Renderer {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is required to play Steroid Quest.");
  let disposed = false;
  let lastElapsed = 0;
  let bindingStarted: number | undefined;
  let bindingSettled = false;
  const pending: GameEvent[] = [];
  const transients: Transient[] = [];
  return {
    play(event): void {
      if (disposed) return;
      if (event.type === "stage") {
        pending.length = 0;
        transients.length = 0;
        return;
      }
      if (event.type === "reset") {
        pending.length = 0;
        transients.length = 0;
        bindingStarted = undefined;
        bindingSettled = true;
        return;
      }
      if (event.type === "bound") bindingSettled = false;
      if (
        ["bounce", "capture", "release", "encounter", "pulse", "bound", "hre"].includes(event.type)
      ) {
        if (pending.length >= 20) pending.shift();
        pending.push(event);
      }
    },
    draw(snapshot): void {
      if (disposed) return;
      if (snapshot.state.elapsed < lastElapsed) {
        transients.length = 0;
        bindingStarted = undefined;
        bindingSettled = false;
      }
      lastElapsed = snapshot.state.elapsed;
      recordEvents(snapshot, pending, transients);
      pending.length = 0;
      while (transients[0] && snapshot.state.elapsed - (transients[0]?.started ?? 0) > 0.8)
        transients.shift();
      if (snapshot.state.receptorBound && bindingStarted === undefined) {
        bindingStarted = bindingSettled ? snapshot.state.elapsed - 1 : snapshot.state.elapsed;
      }
      if (!snapshot.state.receptorBound) {
        bindingStarted = undefined;
        bindingSettled = false;
      }
      drawWorld(ctx, snapshot, transients, bindingStarted);
    },
    dispose(): void {
      disposed = true;
      pending.length = 0;
      transients.length = 0;
    },
  };
}

function recordEvents(
  snapshot: RenderSnapshot,
  pending: GameEvent[],
  transients: Transient[],
): void {
  const player = snapshot.state.player;
  const x = player.x + player.width / 2;
  const y = player.y + player.height / 2;
  for (const event of pending) {
    if (event.type === "bounce")
      transients.push({ x, y, started: snapshot.state.elapsed, kind: "bounce" });
    if (
      event.type === "capture" ||
      event.type === "release" ||
      event.type === "pulse" ||
      event.type === "encounter"
    ) {
      transients.push({ x, y, started: snapshot.state.elapsed, kind: "contact" });
    }
  }
}

function drawWorld(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  transients: readonly Transient[],
  bindingStarted: number | undefined,
): void {
  const { level, state, reducedMotion } = snapshot;
  const time = state.levelTime;
  const camera = cameraFor(snapshot);
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, level.palette.background);
  gradient.addColorStop(1, "#071420");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  cellularDebris(ctx, level, camera.x, camera.y, reducedMotion ? 0 : time);
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  drawFieldLayer(ctx, snapshot, time);
  drawDecorationLayer(ctx, snapshot, time);
  drawTransportLayer(ctx, snapshot, time);
  drawObstacleLayer(ctx, snapshot, time);
  drawProgressMarkers(ctx, snapshot, time);
  if (state.hreBound && level.id === "transcription") drawTranscription(ctx, snapshot);
  drawPlayer(ctx, snapshot, bindingStarted);
  for (const transient of transients) {
    const age = state.elapsed - transient.started;
    if (transient.kind === "bounce")
      reboundRipple(ctx, transient.x, transient.y, age, reducedMotion);
    else contactSpark(ctx, transient.x, transient.y, age);
  }
  ctx.restore();
  drawVignette(ctx);
  drawTimingPanel(ctx, snapshot);
}

function cameraFor(snapshot: RenderSnapshot): { x: number; y: number } {
  const { level, state } = snapshot;
  const player = state.player;
  const lookX = Math.max(-90, Math.min(90, player.vx * 0.19));
  const lookY = Math.max(-70, Math.min(70, player.vy * 0.15));
  const targetX = player.x + player.width / 2 - VIEW_WIDTH / 2 + lookX;
  const targetY = player.y + player.height / 2 - VIEW_HEIGHT / 2 + lookY;
  return {
    x: Math.max(-24, Math.min(Math.max(0, level.width - VIEW_WIDTH) + 24, targetX)),
    y: Math.max(-24, Math.min(Math.max(0, level.height - VIEW_HEIGHT) + 24, targetY)),
  };
}

function drawFieldLayer(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  time: number,
): void {
  const { level, state, reducedMotion } = snapshot;
  for (const zone of level.flowZones) {
    if (isActive(zone.activeWhen, state.encounterPhases))
      cellularCurrent(ctx, zone, time, reducedMotion);
  }
}

function drawDecorationLayer(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  time: number,
): void {
  for (const item of snapshot.level.decorations)
    decoration(ctx, item, snapshot.reducedMotion ? 0 : time * 0.12);
}

function drawTransportLayer(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  time: number,
): void {
  const { level, state, reducedMotion } = snapshot;
  for (const transport of level.transports) {
    if (!isActive(transport.activeWhen, state.encounterPhases)) continue;
    const path = transport.path;
    transportRoute(ctx, transport, path);
    const riding = state.player.attachment;
    const progress =
      riding?.kind === "transport" && riding.id === transport.id
        ? riding.progress
        : transportProgress(transport, time);
    const position =
      riding?.kind === "transport" && riding.id === transport.id
        ? pathPoint(path, riding.progress)
        : transportPosition(transport, time);
    transportBody(ctx, transport, position, time, reducedMotion);
    if (transport.kind === "channel" && path.length > 1) {
      const next = pathPoint(path, Math.min(1, progress + 0.04));
      const angle = Math.atan2(next.y - position.y, next.x - position.x);
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(angle);
      ctx.fillStyle = "#e4ffff";
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-7, -6);
      ctx.lineTo(-7, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
}

function drawObstacleLayer(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  time: number,
): void {
  const { level, state } = snapshot;
  for (const obstacle of level.obstacles) {
    if (!isActive(obstacle.activeWhen, state.encounterPhases)) continue;
    const shape = shapeAt(obstacle, time);
    const fill = obstacle.response.kind === "sticky" ? "#8569a864" : "#294c6888";
    const stroke = obstacle.response.kind === "sticky" ? "#efcbff" : "#c7f2ef";
    if (obstacle.material) organelleSurface(ctx, shape, obstacle.material, level.palette.accent);
    else collisionShape(ctx, shape, fill, stroke);
    drawObstacleDetail(ctx, obstacle.id, shape, obstacle.material, obstacle.response.kind);
  }
}

function drawObstacleDetail(
  ctx: CanvasRenderingContext2D,
  id: string,
  shape: ReturnType<typeof shapeAt>,
  material: "membrane" | "mitochondrion" | "reticulum" | "gel" | undefined,
  response: "rebound" | "sticky",
): void {
  if (shape.kind === "roundedRect" && material) {
    const fill =
      material === "mitochondrion"
        ? "#f29c8460"
        : material === "membrane"
          ? "#f6d98546"
          : "#a0e2d046";
    rounded(
      ctx,
      { x: shape.x + 5, y: shape.y + 5, width: shape.width - 10, height: shape.height - 10 },
      Math.max(6, shape.radius - 5),
      fill,
    );
  }
  if (response === "sticky") {
    const center =
      shape.kind === "circle"
        ? shape.center
        : shape.kind === "capsule"
          ? shape.start
          : { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
    label(
      ctx,
      id.includes("receptor") ? "STICKY CONTACT" : "TEMPORARY HOLD",
      center.x,
      center.y - 18,
      "#ffe2fb",
      10,
    );
  }
}

function drawProgressMarkers(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  time: number,
): void {
  const { level, state, reducedMotion } = snapshot;
  for (const hazard of level.hazards) {
    rounded(ctx, hazard, 13, "#d74b6655", "#ffabb7");
    label(ctx, "LYSOSOME ACID", hazard.x + hazard.width / 2, hazard.y - 8, "#ffc1ca", 10);
  }
  for (const checkpoint of level.checkpoints) {
    if (!isActive(checkpoint.activeWhen, state.encounterPhases)) continue;
    const active = checkpoint.id === state.checkpoint.id;
    rounded(
      ctx,
      checkpoint,
      10,
      active ? "#82f2bd5e" : "#4a917359",
      active ? "#c9ffe1" : "#a4dec0",
    );
    label(
      ctx,
      active ? "CALM RETURN" : "CHECKPOINT",
      checkpoint.x + checkpoint.width / 2,
      checkpoint.y - 9,
      "#d4ffe6",
      10,
    );
  }
  for (const item of level.collectibles) {
    if (state.collectedIds.has(item.id)) continue;
    const bob = reducedMotion ? 0 : Math.sin(time * 2.2 + item.x) * 4;
    ctx.save();
    ctx.translate(item.x, item.y + bob);
    ctx.rotate(Math.PI / 4);
    rounded(ctx, { x: -7, y: -7, width: 14, height: 14 }, 3, "#fbd979", "#fff1bd");
    ctx.restore();
  }
  for (const encounter of level.encounters) {
    const step = encounter.steps[state.encounterPhases.get(encounter.id) ?? 0];
    if (!step?.region || !step.label) continue;
    rounded(ctx, step.region, 20, "#f9d98918", "#f9d989aa");
    label(
      ctx,
      step.label,
      step.region.x + step.region.width / 2,
      step.region.y + 24,
      "#ffe8ac",
      12,
    );
  }
  for (const trigger of level.triggers) {
    if (!isActive(trigger.activeWhen, state.encounterPhases)) continue;
    const x = trigger.x + trigger.width / 2;
    const y = trigger.y + trigger.height / 2;
    if (trigger.kind === "receptor" && !state.receptorBound) {
      rounded(ctx, trigger, 28, "#e4ccfa12", "#e4ccfa88");
      label(ctx, "MATCHING RECEPTOR", x, trigger.y - 12, "#eedbff", 11);
    } else if (trigger.kind === "hre") {
      motif(ctx, x, y, 13, "#5adccc");
      label(ctx, "RESPONSE ELEMENT", x, trigger.y - 12, "#c4fff1", 11);
    } else if (trigger.kind === "exit") {
      label(ctx, "CONTINUE", x, trigger.y - 12, "#c4fff1", 11);
      ctx.beginPath();
      ctx.moveTo(x - 10, y - 12);
      ctx.lineTo(x + 11, y);
      ctx.lineTo(x - 10, y + 12);
      ctx.strokeStyle = "#c4fff1";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  snapshot: RenderSnapshot,
  bindingStarted: number | undefined,
): void {
  const { player } = snapshot.state;
  const x = player.x + player.width / 2;
  const y = player.y + player.height / 2;
  const settling =
    bindingStarted === undefined || snapshot.reducedMotion
      ? 1
      : Math.min(1, (snapshot.state.elapsed - bindingStarted) / 0.8);
  if (snapshot.state.receptorBound) receptor(ctx, x, y, 25, true, settling, 0.55);
  else
    steroid(
      ctx,
      x,
      y,
      1.35,
      snapshot.reducedMotion ? 0 : Math.sin(snapshot.state.elapsed * 1.8) * 1.4,
    );
  if (player.attachment) {
    ctx.beginPath();
    ctx.arc(x, y, player.radius + 10, 0, Math.PI * 2);
    ctx.strokeStyle = player.attachment.kind === "transport" ? "#ffedb6" : "#f3c9ff";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawTranscription(ctx: CanvasRenderingContext2D, snapshot: RenderSnapshot): void {
  const { state, level, reducedMotion } = snapshot;
  const trigger = level.triggers.find((item) => item.kind === "transcription");
  if (!trigger) return;
  const x = trigger.x + trigger.width / 2;
  const y = trigger.y + trigger.height + 24;
  const promoter = x + 125;
  dna(ctx, { x: x - 45, y, width: 590, height: 32 }, reducedMotion ? 0 : state.elapsed * 0.1);
  label(ctx, "PROMOTER", promoter, y + 60, "#ecd9ff", 12);
  const colors = ["#b5a3eb", "#6db7cd", "#e9ba77"];
  for (let index = 0; index < state.recruitmentCount; index++) {
    rounded(
      ctx,
      { x: promoter - 16 + index * 31, y: y - 35 - (index % 2) * 9, width: 27, height: 30 },
      9,
      colors[index] ?? "#b5a3eb",
      "#f6e8ff",
    );
  }
  if (state.recruitmentCount < 3) return;
  const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, 1 - state.phaseRemaining / 4));
  const enzymeX = promoter + progress * 300;
  rounded(ctx, { x: enzymeX - 27, y: y - 24, width: 59, height: 46 }, 20, "#d2b8ed", "#fff0ff");
  label(ctx, "RNA POLYMERASE", enzymeX, y - 42, "#ecd9ff", 11);
  transcriptionPayoff(ctx, enzymeX, y, progress, reducedMotion ? 0 : state.elapsed, reducedMotion);
}

function drawVignette(ctx: CanvasRenderingContext2D): void {
  const shade = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  shade.addColorStop(0, "#03101b50");
  shade.addColorStop(0.25, "#03101b00");
  shade.addColorStop(0.8, "#03101b00");
  shade.addColorStop(1, "#03101b60");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
}

function drawTimingPanel(ctx: CanvasRenderingContext2D, snapshot: RenderSnapshot): void {
  const { state } = snapshot;
  if (state.phase !== "recruiting" || state.recruitmentCount >= 3) return;
  const fraction = (state.recruitmentClock % 1.4) / 1.4;
  const bar = { x: 330, y: VIEW_HEIGHT - 60, width: 300, height: 16 };
  rounded(
    ctx,
    { x: 302, y: VIEW_HEIGHT - 106, width: 356, height: 90 },
    12,
    "#071420ee",
    "#d5eee7",
  );
  label(ctx, "PRESS SPACE IN THE BRIGHT ZONE", VIEW_WIDTH / 2, VIEW_HEIGHT - 80, "#f0fbf7", 13);
  rounded(ctx, bar, 8, "#435463");
  rounded(
    ctx,
    { x: bar.x + bar.width * 0.2, y: bar.y, width: bar.width * 0.6, height: bar.height },
    3,
    "#70ceb1",
  );
  rounded(
    ctx,
    { x: bar.x + fraction * bar.width - 3, y: bar.y - 6, width: 6, height: 28 },
    3,
    "#ffffff",
    "#071420",
  );
}
