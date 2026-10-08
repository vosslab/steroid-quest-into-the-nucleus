// Built-artifact acceptance: real keys and read-only observations; never mutates game state.
// Run: node --import tsx tests/playwright/campaign_walkthrough.mjs [preview URL] [output directory]
// Selector contract: src/runtime.ts:76-89 exposes read-only canvas observations;
// src/app.tsx owns accessible Start adventure, Replay, Resume, and Retry controls.
import { REPO_ROOT } from "./repo_root.mjs";
import { chromium } from "playwright";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { CAMPAIGN } from "../../src/levels.ts";
import { platformRect } from "../../src/physics.ts";

process.chdir(REPO_ROOT);
const output = process.argv[3] ?? "test-results/surprise_campaign";
await mkdir(output, { recursive: true });
const sourceFiles = (await readdir("src", { recursive: true }))
  .filter((file) => /\.(ts|tsx|css|html)$/.test(file))
  .map((file) => `src/${file}`)
  .sort();
const hashes = Object.fromEntries(
  await Promise.all(
    [
      ...sourceFiles,
      "dist/main.js",
      "dist/style.css",
      "dist/index.html",
      "tests/playwright/campaign_walkthrough.mjs",
    ].map(async (file) => [
      file,
      createHash("sha256")
        .update(await readFile(file))
        .digest("hex"),
    ]),
  ),
);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
await page.addInitScript(() => {
  const request = window.requestAnimationFrame.bind(window);
  const cancel = window.cancelAnimationFrame.bind(window);
  const pending = new Set();
  let maximum = 0;
  window.requestAnimationFrame = (callback) => {
    let handle;
    handle = request((time) => {
      pending.delete(handle);
      callback(time);
    });
    pending.add(handle);
    maximum = Math.max(maximum, pending.size);
    return handle;
  };
  window.cancelAnimationFrame = (handle) => {
    pending.delete(handle);
    cancel(handle);
  };
  Object.defineProperty(window, "campaignFrameObservation", {
    get: () => ({ pending: pending.size, maximum }),
  });
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(process.argv[2] ?? "http://localhost:8367");
const servedHashes = {};
for (const file of ["main.js", "style.css", "index.html"]) {
  const response = await page.request.get(new URL(file, page.url()).href);
  if (!response.ok()) throw new Error(`Built asset request failed: ${file}`);
  servedHashes[file] = createHash("sha256")
    .update(await response.body())
    .digest("hex");
  if (servedHashes[file] !== hashes[`dist/${file}`])
    throw new Error(`Preview asset differs from dist/${file}`);
}
await page.getByRole("button", { name: "Start adventure", exact: true }).click();
const started = Date.now();
const captures = new Set();
const stages = [];
const observations = [];
let stage = "";
let jumpStart = 0;
let secondJump = false;
let releaseAt = 0;
let rightHeld = false;
let leftHeld = false;
let encounter;
const mechanics = {};
let cacheCollected = false;
let sawDeath = false;
let deliberateDeath = true;
let previousDeaths = 0;
let lastLog = 0;
let finished = false;
let rnaStarted = 0;
let bindingObserved = false;
let stageElapsed = 0;
let optionalBranch;
let optionalReturn = false;
let lastCheckpoint = "";
let pendingRespawn;
let hreObserved = false;
let movingRide = false;
let reducedGameplay = false;
let reducedInteraction = false;
let lastState;
let frameObservation;
let wallSeconds = 0;
const capture = async (name) => {
  if (captures.has(name)) return;
  captures.add(name);
  await page.screenshot({ path: `${output}/${name}.png` });
};
const keyRight = async (held) => {
  if (rightHeld === held) return;
  rightHeld = held;
  await page.keyboard[held ? "down" : "up"]("ArrowRight");
};
const steer = async (direction) => {
  await keyRight(direction > 0);
  if (leftHeld !== direction < 0) {
    leftHeld = direction < 0;
    await page.keyboard[leftHeld ? "down" : "up"]("ArrowLeft");
  }
};
const jump = async (double) => {
  await page.keyboard.up("Space");
  await page.keyboard.down("Space");
  jumpStart = Date.now();
  secondJump = double;
  releaseAt = double ? jumpStart + 300 : jumpStart + 800;
};

// Observe authored structures in the built game; source geometry only guides ordinary controls.
async function observeSignatures(level, s, x, y, elapsed) {
  for (const platform of level.platforms) {
    const rect = platformRect(platform, elapsed - stageElapsed);
    let event;
    if (
      platform.id.endsWith("-roof") &&
      x > rect.x + 100 &&
      x < rect.x + rect.width - 100 &&
      y >= rect.y + rect.height
    )
      event = "tunnel";
    if (platform.id.endsWith("-roof") && s.standingPlatform === platform.id)
      event = "roof-shortcut";
    if (platform.id.includes("-baffle-") && x > rect.x - 160 && x < rect.x + 80) event = "baffle";
    if (
      platform.kind === "bounce" &&
      x > rect.x &&
      x < rect.x + rect.width + 180 &&
      y < rect.y - 45
    )
      event = "launch";
    if (platform.motion && x > rect.x - 150 && x < rect.x + rect.width) event = "moving-platform";
    if (!event || captures.has(platform.id)) continue;
    await capture(platform.id);
    observations.push({ event, id: platform.id, stage: level.id, elapsed, x, y });
    if (event === "launch" && platform.id.includes("bumper")) mechanics.pinball = true;
    if (event === "launch" && reducedGameplay && !reducedInteraction) {
      reducedInteraction = true;
      await capture("reduced-motion-launch");
      observations.push({
        event: "reduced-motion-interaction",
        interaction: "launch",
        elapsed,
        x,
        y,
      });
    }
  }
  for (const field of level.flowZones ?? []) {
    if (
      x + 30 <= field.x ||
      x >= field.x + field.width ||
      y + 30 <= field.y ||
      y >= field.y + field.height ||
      captures.has(field.id)
    )
      continue;
    await capture(field.id);
    observations.push({ event: "current-overlap", id: field.id, stage: level.id, elapsed, x, y });
    if (field.id.includes("express-field")) {
      const before = { x, elapsed };
      await page.waitForTimeout(300);
      const after = await page.locator("canvas").evaluate((canvas) => ({ ...canvas.dataset }));
      const speed = (Number(after.playerX) - x) / (Number(after.elapsed) - elapsed);
      if (speed <= 320)
        throw new Error(`Express field did not exceed ordinary run speed: ${speed}`);
      mechanics.express = true;
      observations.push({
        event: "express-speed",
        before,
        after: { x: Number(after.playerX), elapsed: Number(after.elapsed) },
        speed,
      });
      await capture("express-speed");
    }
    if (field.gravityScale < 1) {
      await jump(false);
      await page.waitForTimeout(200);
      const after = await page.locator("canvas").evaluate((canvas) => ({ ...canvas.dataset }));
      if (Number(after.playerY) >= y) throw new Error("Low-gravity field jump did not rise");
      mechanics.lowGravity = true;
      observations.push({
        event: "low-gravity-jump",
        before: { x, y },
        after: { x: Number(after.playerX), y: Number(after.playerY) },
        gravityScale: field.gravityScale,
      });
      await capture("low-gravity-jump");
    }
  }
  const standing = level.platforms.find((platform) => platform.id === s.standingPlatform);
  if (standing?.motion?.kind === "orbit" && s.grounded === "true" && !movingRide) {
    await steer(0);
    await page.keyboard.up("Space");
    secondJump = false;
    releaseAt = 0;
    await page.waitForTimeout(450);
    const carried = await page.locator("canvas").evaluate((canvas) => ({ ...canvas.dataset }));
    const distance = Math.hypot(Number(carried.playerX) - x, Number(carried.playerY) - y);
    if (
      carried.standingPlatform === standing.id &&
      Math.abs(Number(carried.playerX) - x) > 2 &&
      Math.abs(Number(carried.playerY) - y) > 2
    ) {
      movingRide = true;
      observations.push({
        event: "moving-ride",
        id: standing.id,
        elapsed,
        before: { x, y },
        after: { x: Number(carried.playerX), y: Number(carried.playerY) },
        distance,
      });
      mechanics.orbit = true;
      await capture("orbit-no-input-ride");
    }
    await keyRight(true);
    jumpStart = Date.now();
  }
  if (standing?.id.includes("secret") && !optionalBranch) {
    optionalBranch = { id: standing.id, stage: level.id, elapsed, x, y };
    observations.push({ event: "optional-branch", ...optionalBranch });
    await capture("optional-branch");
  } else if (
    optionalBranch?.stage === level.id &&
    standing &&
    !standing.id.includes("secret") &&
    /floor|route-|shelf-|catch/.test(standing.id) &&
    x > optionalBranch.x + 150 &&
    !optionalReturn
  ) {
    optionalReturn = true;
    observations.push({
      event: "optional-return",
      id: standing.id,
      stage: level.id,
      elapsed,
      x,
      y,
    });
    await capture("optional-return");
  }
}

// Voluntary upper routes require their own key-controlled approach; ordinary traversal can bypass them.
async function playEncounter(level, s, x, y, elapsed) {
  if (!encounter && level.id === "cytoplasm") {
    const cache = level.platforms
      .filter((p) => p.id.includes("cache-step"))
      .sort((a, b) => a.x - b.x);
    const bridge = level.platforms
      .filter((p) => p.id.includes("bridge-entry") || p.id.endsWith("ribosome-0"))
      .sort((a, b) => a.x - b.x);
    const orbit = level.platforms
      .filter((p) => p.id.endsWith("orbit-step-0") || p.id.endsWith("orbiter-0"))
      .sort((a, b) => a.x - b.x);
    for (const [name, route] of [
      ["cache", cache.slice(0, 3)],
      ["crumble", bridge],
      ["orbit", orbit],
    ]) {
      if (!mechanics[name] && route.length && x > route[0].x - 180 && x < route.at(-1).x + 220) {
        encounter = { name, route, index: 0 };
        break;
      }
    }
  }
  if (!encounter) return false;
  const target = encounter.route[encounter.index];
  const rect = platformRect(target, elapsed - stageElapsed);
  const center = rect.x + rect.width / 2 - 15;
  if (s.standingPlatform === target.id) {
    if (encounter.index < encounter.route.length - 1) {
      encounter.index++;
      return true;
    }
    if (encounter.name === "cache") {
      cacheCollected = Number(s.collected) > (encounter.collectedBefore ?? Number(s.collected));
      if (!cacheCollected) {
        await steer(Math.abs(center - x) > 10 ? Math.sign(center - x) : 0);
        await jump(false);
        return true;
      }
      optionalBranch = { id: target.id, stage: level.id, elapsed, x, y, collected: s.collected };
      await capture("optional-cache-collected");
      observations.push({ event: "optional-cache-collected", ...optionalBranch });
      mechanics.cache = true;
      optionalReturn = false;
      encounter = undefined;
      await steer(1);
      return true;
    }
    if (encounter.name === "orbit") {
      if (!movingRide) return true;
      encounter = undefined;
      await steer(1);
      return true;
    }
    if (encounter.reformed) {
      mechanics.crumble = true;
      observations.push({ event: "crumble-reformed-contact", id: target.id, elapsed, x, y });
      await capture("crumble-reformed-contact");
      encounter = undefined;
      await steer(1);
      return true;
    }
    await steer(0);
    await page.keyboard.up("Space");
    releaseAt = 0;
    secondJump = false;
    if (!encounter.contacted) {
      encounter.contacted = elapsed;
      await capture("crumble-contact");
      observations.push({ event: "crumble-contact", id: target.id, elapsed, x, y });
    }
    return true;
  }
  if (
    encounter.name === "crumble" &&
    encounter.contacted &&
    !encounter.fell &&
    s.grounded === "true" &&
    y > rect.y + 45
  ) {
    encounter.fell = elapsed;
    observations.push({ event: "crumble-fall-catch", id: target.id, elapsed, x, y });
    await capture("crumble-fall-catch");
    await steer(0);
    await page.waitForTimeout((target.crumble.reformAfter + 0.2) * 1000);
    encounter.reformed = true;
    return true;
  }
  if (encounter.name === "crumble" && encounter.reformed && s.standingPlatform === target.id)
    return true;
  if (
    encounter.name === "crumble" &&
    encounter.reformed &&
    encounter.index > 0 &&
    s.grounded === "true" &&
    y > rect.y + 45
  )
    encounter.index = 0;
  if (encounter.collectedBefore === undefined) encounter.collectedBefore = Number(s.collected);
  await steer(Math.abs(center - x) > 10 ? Math.sign(center - x) : 0);
  if (s.grounded === "true" && Date.now() - jumpStart > 300) await jump(false);
  return true;
}

function routeJump(level, s, x, elapsed) {
  const platform = level.platforms.find((candidate) => candidate.id === s.standingPlatform);
  if (!platform) return { needed: false, double: false };
  const standing = platformRect(platform, elapsed - stageElapsed);
  const obstacles = level.platforms.filter(
    (candidate) =>
      (candidate.kind === "solid" || (candidate.kind === "bounce" && candidate.y < standing.y)) &&
      candidate.id !== platform.id &&
      Math.abs(candidate.y + candidate.height - standing.y) < 5,
  );
  const ignoreHazards =
    level.id === "membrane" &&
    deliberateDeath &&
    level.checkpoints.some((checkpoint) => checkpoint.id === s.checkpoint);
  const hazards = ignoreHazards ? [] : level.hazards;
  const hurdle = [...obstacles, ...hazards].some(
    (candidate) =>
      Math.abs(candidate.y + candidate.height - standing.y) < 5 &&
      x > candidate.x - 95 &&
      x < candidate.x - 18,
  );
  if (hurdle) return { needed: true, double: false };
  const end = standing.x + standing.width;
  if (x + 30 < end - 55) return { needed: false, double: false };
  // Walk from the floor or its last low hurdle onto the pad instead of jumping past the launch.
  const flushSpring = level.platforms.some(
    (candidate) =>
      candidate.kind === "bounce" &&
      candidate.y >= standing.y &&
      candidate.y <= standing.y + 100 &&
      candidate.x <= end + 30 &&
      candidate.x + candidate.width >= end + 30,
  );
  if (flushSpring) return { needed: false, double: false };
  // Descending onto broad continuous support needs no jump, including a return from a secret.
  const recovery = level.platforms.some(
    (candidate) =>
      candidate.id !== platform.id &&
      candidate.kind !== "bounce" &&
      !candidate.id.includes("roof") &&
      candidate.x <= end &&
      candidate.x + candidate.width > end + 80 &&
      candidate.y >= standing.y &&
      candidate.y <= standing.y + 220,
  );
  if (recovery) return { needed: false, double: false };
  const next = level.platforms
    .filter(
      (candidate) =>
        candidate.x >= end - 2 &&
        !candidate.id.includes("roof") &&
        !candidate.id.includes("baffle") &&
        candidate.kind !== "bounce" &&
        candidate.y > standing.y - 180 &&
        candidate.y < standing.y + 300,
    )
    .sort((a, b) => a.x - b.x || Number(Boolean(b.motion)) - Number(Boolean(a.motion)))[0];
  if (!next) return { needed: false, double: false };
  const needsAirJump = standing.y - next.y >= 90 || next.x - end > 110;
  return { needed: true, double: s.receptorBound === "true" && needsAirJump };
}

try {
  while (Date.now() - started < 600_000) {
    const s = await page.locator("canvas").evaluate((canvas) => ({ ...canvas.dataset }));
    lastState = s;
    const x = Number(s.playerX);
    const y = Number(s.playerY);
    const elapsed = Number(s.elapsed);
    if (stage !== s.stage) {
      stage = s.stage;
      encounter = undefined;
      stageElapsed = elapsed;
      if (stage === "cytoplasm") {
        reducedGameplay = true;
        await page.emulateMedia({ reducedMotion: "reduce" });
      } else if (reducedGameplay) {
        reducedGameplay = false;
        await page.emulateMedia({ reducedMotion: "no-preference" });
      }
      stages.push({ stage, elapsed, wallSeconds: (Date.now() - started) / 1000 });
      console.log("STAGE", JSON.stringify(stages.at(-1)));
      jumpStart = 0;
      secondJump = false;
      await page.keyboard.up("Space");
      await capture(stage);
    }
    if (s.checkpoint !== lastCheckpoint) {
      lastCheckpoint = s.checkpoint;
      observations.push({ event: "checkpoint", id: s.checkpoint, stage, elapsed, x, y });
    }
    if (Number(s.deaths) > previousDeaths) {
      sawDeath = true;
      deliberateDeath = false;
      previousDeaths = Number(s.deaths);
      observations.push({
        event: "death",
        elapsed,
        checkpoint: s.checkpoint,
        collected: s.collected,
      });
      pendingRespawn = {
        checkpoint: s.checkpoint,
        collected: Number(s.collected),
        deathElapsed: elapsed,
      };
      console.log("DEATH", JSON.stringify(observations.at(-1)));
      await capture("death");
      jumpStart = 0;
      secondJump = false;
      await page.keyboard.up("Space");
    }
    if (pendingRespawn && s.phase === "playing") {
      if (
        Number(s.collected) !== pendingRespawn.collected ||
        s.checkpoint !== pendingRespawn.checkpoint
      )
        throw new Error("Checkpoint recovery changed retained collection or checkpoint");
      observations.push({
        event: "checkpoint-respawn",
        elapsed,
        recoverySeconds: elapsed - pendingRespawn.deathElapsed,
        x,
        y,
        ...pendingRespawn,
      });
      await capture("checkpoint-respawn");
      pendingRespawn = undefined;
    }
    if (s.hreBound === "true" && !hreObserved) {
      hreObserved = true;
      observations.push({ event: "hre-bound", stage, elapsed, receptorBound: s.receptorBound });
      await capture("hre-bound");
    }
    if (Date.now() - lastLog > 10_000) {
      console.log("POSITION", stage, s.phase, x, y, s.standingPlatform, s.checkpoint, elapsed);
      lastLog = Date.now();
    }
    if (s.phase === "ended") {
      await keyRight(false);
      if (
        !(await page
          .getByLabel(new RegExp(`^${s.collected} of \\d+ fragments collected$`))
          .isVisible())
      )
        throw new Error("Visible HUD did not match the completed collection tally");
      await capture("ending");
      finished = true;
      observations.push({ event: "ended", elapsed, deaths: s.deaths, collected: s.collected });
      break;
    }
    if (s.phase === "recruiting") {
      await capture("recruitment-timing");
      await keyRight(false);
      await page.keyboard.up("Space");
      const count = Number(s.recruitmentCount);
      if (count > 0) await capture(`recruitment-${count}`);
      if (count === 3) {
        if (!rnaStarted) rnaStarted = Date.now();
        if (Date.now() - rnaStarted > 1800) await capture("rna");
      } else if (
        (Number(s.recruitmentClock) % 1.4) / 1.4 > 0.35 &&
        (Number(s.recruitmentClock) % 1.4) / 1.4 < 0.65
      ) {
        await page.keyboard.press("Space");
        await page.waitForTimeout(80);
        observations.push({ event: "recruitment-action", countBefore: count, elapsed });
      }
    } else if (s.phase === "playing") {
      await steer(1);
      const level = CAMPAIGN.find((candidate) => candidate.id === stage);
      await observeSignatures(level, s, x, y, elapsed);
      if (await playEncounter(level, s, x, y, elapsed)) {
        await page.waitForTimeout(20);
        continue;
      }
      if (s.receptorBound === "true" && stage === "receptor" && !bindingObserved) {
        bindingObserved = true;
        await keyRight(false);
        await page.keyboard.up("Space");
        await capture("binding");
        await page.waitForTimeout(800);
        await capture("binding-settling");
        await page.waitForTimeout(850);
        await capture("binding-settled");
        observations.push({ event: "binding", elapsed, x, y });
        await keyRight(true);
      }
      if (stage === "membrane" && x > 2450) await capture("bilayer-crossing");
      if (stage === "envelope" && x > 1940 && x < 2210) await capture("open-pore");
      const hre = level.triggers.find((trigger) => trigger.kind === "hre");
      if (hre && x > hre.x - 210) await capture("hre");
      const now = Date.now();
      if (secondJump && now >= jumpStart + 340) {
        await page.keyboard.down("Space");
        secondJump = false;
        releaseAt = now + 900;
      } else if (releaseAt && now >= releaseAt) {
        await page.keyboard.up("Space");
        releaseAt = 0;
      } else if (secondJump && now >= jumpStart + 300) await page.keyboard.up("Space");
      if (s.grounded === "true" && now - jumpStart > 180) {
        const action = routeJump(level, s, x, elapsed);
        if (action.needed) {
          if (reducedGameplay && !captures.has("reduced-motion-jump")) {
            observations.push({ event: "reduced-motion-jump", elapsed, x, y });
            await capture("reduced-motion-jump");
          }
          await jump(action.double);
        }
      }
    }
    await page.waitForTimeout(20);
  }

  wallSeconds = (Date.now() - started) / 1000;
  frameObservation = await page.evaluate(() => window.campaignFrameObservation);
  if (finished) {
    const canvas = await page.locator("canvas").elementHandle();
    await page.getByRole("button", { name: "Replay", exact: true }).click();
    await page.waitForTimeout(100);
    const replay = await page
      .locator("canvas")
      .evaluate(
        (element, original) => ({ same: element === original, ...element.dataset }),
        canvas,
      );
    if (
      !replay.same ||
      replay.stage !== "membrane" ||
      replay.phase !== "playing" ||
      Number(replay.collected) !== 0 ||
      replay.receptorBound !== "false" ||
      replay.hreBound !== "false"
    )
      throw new Error("Replay failed to reset the mounted campaign");
    observations.push({ event: "replay", sameCanvas: replay.same, stage: replay.stage });
    if (!(await page.getByLabel(/^0 of \d+ fragments collected$/).isVisible()))
      throw new Error("Visible HUD did not reset after Replay");
    await capture("replay");
    await page.keyboard.up("Space");
    await page.keyboard.up("ArrowRight");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.getByRole("button", { name: "Start adventure", exact: true }).waitFor();
    const responsive = await page.evaluate(() => ({
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    }));
    if (responsive.scrollWidth > responsive.viewport || !responsive.reducedMotion)
      throw new Error("Small-viewport reduced-motion title acceptance failed");
    observations.push({ event: "responsive-title", ...responsive });
    await capture("small-title-reduced-motion");
    await page.getByRole("button", { name: "Start adventure", exact: true }).click();
    await page.keyboard.down("ArrowRight");
    await page.keyboard.down("Space");
    await page.waitForTimeout(200);
    await page.keyboard.up("Space");
    await page.keyboard.up("ArrowRight");
    const narrowGame = await page.locator("canvas").evaluate((element) => ({
      ...element.dataset,
      width: element.getBoundingClientRect().width,
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    if (
      narrowGame.phase !== "playing" ||
      Number(narrowGame.playerX) <= 80 ||
      narrowGame.width > narrowGame.viewport ||
      narrowGame.scrollWidth > narrowGame.viewport
    )
      throw new Error("Small-viewport gameplay controls or canvas acceptance failed");
    observations.push({ event: "responsive-gameplay", ...narrowGame });
    const narrowCanvas = await page.locator("canvas").elementHandle();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Resume", exact: true }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Retry checkpoint", exact: true }).click();
    await page.waitForFunction(
      () => document.querySelector("canvas").dataset.phase === "playing",
      null,
      { polling: 50 },
    );
    const narrowLifecycle = await page.locator("canvas").evaluate(
      (element, original) => ({
        sameCanvas: element === original,
        phase: element.dataset.phase,
        frames: window.campaignFrameObservation,
      }),
      narrowCanvas,
    );
    if (
      !narrowLifecycle.sameCanvas ||
      narrowLifecycle.phase !== "playing" ||
      narrowLifecycle.frames.maximum !== 1 ||
      narrowLifecycle.frames.pending !== 1
    )
      throw new Error("Small-viewport Resume/Retry canvas lifecycle failed");
    observations.push({ event: "responsive-menu-controls", ...narrowLifecycle });
    await capture("small-gameplay-reduced-motion");
  }
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
  await capture("failure");
}
const sourceDrift = [];
for (const [file, expected] of Object.entries(hashes)) {
  const current = createHash("sha256")
    .update(await readFile(file))
    .digest("hex");
  if (current !== expected) sourceDrift.push(file);
}
await writeFile(
  `${output}/report.json`,
  JSON.stringify(
    {
      finished,
      hashes,
      servedHashes,
      sourceDrift,
      lastState,
      sawDeath,
      optionalBranch,
      optionalReturn,
      cacheCollected,
      mechanics,
      movingRide,
      reducedInteraction,
      wallSeconds,
      stages,
      observations,
      frameObservation,
      captures: [...captures],
      errors,
    },
    null,
    2,
  ),
);
await browser.close();
if (!finished || !sawDeath || stages.length !== 6 || errors.length || sourceDrift.length)
  throw new Error("Campaign acceptance incomplete; inspect report.json");
if (!cacheCollected || !optionalReturn)
  throw new Error("Campaign did not demonstrate an actual optional branch and return");
if (!["crumble", "orbit", "pinball", "express", "lowGravity"].every((name) => mechanics[name]))
  throw new Error("A new authored mechanic was not actually exercised; inspect report.json");
if (!movingRide || !reducedInteraction)
  throw new Error("Moving-platform carry or reduced-motion launch was not observed");
if (
  !bindingObserved ||
  !hreObserved ||
  observations.filter((observation) => observation.event === "recruitment-action").length !== 3
)
  throw new Error("Receptor/HRE binding or three recruitment actions were not observed");
if (frameObservation.maximum !== 1 || frameObservation.pending !== 1)
  throw new Error("The built campaign did not maintain exactly one pending animation callback");
console.log("COMPLETE", wallSeconds, JSON.stringify(observations));
