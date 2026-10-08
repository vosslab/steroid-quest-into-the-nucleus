// Built-artifact acceptance: real keys and read-only observations; never mutates game state.
// Run: node --import tsx tests/playwright/campaign_walkthrough.mjs [preview URL]
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { CAMPAIGN } from "../../src/levels.ts";

const output = "test-results/campaign";
await mkdir(output, { recursive: true });
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
await page.goto(process.argv[2] ?? "http://localhost:8053");
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
let sawDeath = false;
let deliberateDeath = true;
let previousDeaths = 0;
let lastLog = 0;
let finished = false;
let rnaStarted = 0;
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
const jump = async (double) => {
  await page.keyboard.up("Space");
  await page.keyboard.down("Space");
  jumpStart = Date.now();
  secondJump = double;
  releaseAt = double ? jumpStart + 300 : jumpStart + 800;
};

while (Date.now() - started < 600_000) {
  const s = await page.locator("canvas").evaluate((canvas) => ({ ...canvas.dataset }));
  const x = Number(s.playerX);
  const y = Number(s.playerY);
  const elapsed = Number(s.elapsed);
  if (stage !== s.stage) {
    stage = s.stage;
    stages.push({ stage, elapsed, wallSeconds: (Date.now() - started) / 1000 });
    console.log("STAGE", JSON.stringify(stages.at(-1)));
    jumpStart = 0;
    secondJump = false;
    await page.keyboard.up("Space");
    await capture(stage);
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
    console.log("DEATH", JSON.stringify(observations.at(-1)));
    jumpStart = 0;
    secondJump = false;
    await page.keyboard.up("Space");
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
    await keyRight(false);
    await page.keyboard.up("Space");
    const count = Number(s.recruitmentCount);
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
    await keyRight(true);
    const level = CAMPAIGN.find((candidate) => candidate.id === stage);
    if (s.receptorBound === "true" && stage === "receptor") await capture("binding");
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
      let shouldJump = false;
      if (stage === "membrane") {
        const obstacles = level.platforms.filter((p) => p.id.includes("protein"));
        const hazards = deliberateDeath ? [] : level.hazards;
        shouldJump = [...obstacles, ...hazards].some((p) => x > p.x - 115 && x < p.x - 18);
      } else if (stage === "cytoplasm" || stage === "envelope") {
        const p = level.platforms.find((p) => p.id === s.standingPlatform);
        if (p && !p.id.includes("finish"))
          shouldJump =
            x > p.x + p.width - (stage === "envelope" && p.id.includes("descent") ? 95 : 65);
        if (stage === "envelope")
          shouldJump ||= level.hazards.some((h) => x > h.x - 110 && x < h.x - 20);
      } else if (stage === "receptor" || stage === "dna") {
        const p = level.platforms.find((p) => p.id === s.standingPlatform);
        const route = level.platforms.filter((platform) => platform.id.includes("-shelf-"));
        if (p && p.id !== route.at(-1)?.id) shouldJump = x > p.x + p.width - 40;
      }
      if (shouldJump) await jump(s.receptorBound === "true");
    }
  }
  await page.waitForTimeout(20);
}

const wallSeconds = (Date.now() - started) / 1000;
const frameObservation = await page.evaluate(() => window.campaignFrameObservation);
if (finished) {
  const canvas = await page.locator("canvas").elementHandle();
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await page.waitForTimeout(100);
  const replay = await page
    .locator("canvas")
    .evaluate((element, original) => ({ same: element === original, ...element.dataset }), canvas);
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
}
await writeFile(
  `${output}/report.json`,
  JSON.stringify(
    {
      finished,
      sawDeath,
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
if (!finished || !sawDeath || stages.length !== 6 || errors.length)
  throw new Error("Campaign acceptance incomplete; inspect report.json");
if (frameObservation.maximum !== 1 || frameObservation.pending !== 1)
  throw new Error("The built campaign did not maintain exactly one pending animation callback");
console.log("COMPLETE", wallSeconds, JSON.stringify(observations));
