// Built-artifact walkthrough: actual keys, read-only canvas observations, no state mutation.
// Run: node --import tsx tests/playwright/campaign_walkthrough.mjs URL [output directory]
// Selector contract: src/runtime.ts observeState; src/app.tsx named menu buttons.
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { REPO_ROOT } from "./repo_root.mjs";
import { installObservation } from "./helper_observation.mjs";

process.chdir(REPO_ROOT);
const output = process.argv[3] ?? "test-results/fluid_campaign";
await mkdir(output, { recursive: true });
const sourceFiles = (await readdir("src", { recursive: true }))
  .filter((file) => /\.(ts|tsx|css|html)$/.test(file))
  .map((file) => `src/${file}`);
const files = [
  "tests/playwright/campaign_walkthrough.mjs",
  "tests/playwright/helper_observation.mjs",
  ...sourceFiles,
  "dist/main.js",
  "dist/style.css",
  "dist/index.html",
];
async function hashFiles() {
  return Object.fromEntries(
    await Promise.all(
      files.map(async (file) => [
        file,
        createHash("sha256")
          .update(await readFile(file))
          .digest("hex"),
      ]),
    ),
  );
}
const hashes = await hashFiles();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  recordVideo: { dir: `${output}/video`, size: { width: 1280, height: 900 } },
});
await installObservation(page);
const errors = [];
const observations = [];
const captures = [];
page.on("pageerror", (error) => errors.push(error.message));
const canvas = page.locator("canvas");
const started = Date.now();
async function state() {
  return canvas.evaluate((element) => ({ ...element.dataset }));
}
async function capture(name) {
  const path = `${String(captures.length).padStart(2, "0")}_${name}.png`;
  await page.screenshot({ path: `${output}/${path}` });
  captures.push(path);
  observations.push({
    event: name,
    wallSeconds: (Date.now() - started) / 1000,
    ...(await state()),
  });
  console.log(name, JSON.stringify(await state()));
}
async function waitFor(predicate, description, seconds = 12) {
  const until = Date.now() + seconds * 1000;
  while (Date.now() < until) {
    const value = await state();
    if (predicate(value)) return value;
    await page.waitForTimeout(50);
  }
  throw new Error(`Timed out: ${description}; ${JSON.stringify(await state())}`);
}
const held = new Set();
async function keys(...wanted) {
  for (const key of held)
    if (!wanted.includes(key)) {
      await page.keyboard.up(key);
      held.delete(key);
    }
  for (const key of wanted)
    if (!held.has(key)) {
      await page.keyboard.down(key);
      held.add(key);
    }
}
async function steerTo(
  x,
  { y, seconds = 12, tolerance = 35, pulse = true, thrust = false, stopWhen } = {},
) {
  const until = Date.now() + seconds * 1000;
  let lastPulse = 0;
  while (Date.now() < until) {
    const value = await state();
    if (stopWhen?.(value)) {
      await keys();
      return value;
    }
    const px = Number(value.playerX) + 15;
    const py = Number(value.playerY) + 15;
    const vx = Number(value.playerVx);
    const vy = Number(value.playerVy);
    const target = x - px;
    const want = target - vx * 0.28;
    await keys(
      ...(want > 12 ? ["ArrowRight"] : want < -12 ? ["ArrowLeft"] : []),
      ...(thrust ? ["Space"] : []),
    );
    if (
      pulse &&
      !thrust &&
      y !== undefined &&
      py > y + 25 &&
      vy > -65 &&
      Date.now() - lastPulse > 450 &&
      !value.attachmentId
    ) {
      await page.keyboard.press("Space");
      lastPulse = Date.now();
    }
    if (!stopWhen && Math.abs(target) < tolerance && (y === undefined || Math.abs(py - y) < 60)) {
      await keys();
      return value;
    }
    await page.waitForTimeout(35);
  }
  throw new Error(`Cannot steer to ${x},${y}; ${JSON.stringify(await state())}`);
}
let finished = false;
let originalCanvas;
try {
  await page.goto(process.argv[2] ?? "http://127.0.0.1:8367");
  await page.getByRole("button", { name: "Start adventure", exact: true }).waitFor();
  const servedHashes = {};
  for (const asset of ["main.js", "style.css", "index.html"]) {
    const response = await page.request.get(new URL(asset, page.url()).href);
    servedHashes[asset] = createHash("sha256")
      .update(await response.body())
      .digest("hex");
    assert.equal(servedHashes[asset], hashes[`dist/${asset}`]);
  }
  observations.push({ event: "served-hashes", servedHashes });
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 0);
  await capture("title_sound_on");
  await page.getByRole("button", { name: "Start adventure", exact: true }).click();
  originalCanvas = await canvas.elementHandle();
  await waitFor((value) => value.phase === "playing", "start");
  let peakRms = 0;
  for (let i = 0; i < 12; i++) {
    peakRms = Math.max(peakRms, (await page.evaluate(() => window.fluidObservation)).rms);
    await page.waitForTimeout(70);
  }
  assert.ok(peakRms > 0.0001, "Start produces real synthesized output");
  observations.push({
    event: "audio-after-start",
    peakRms,
    ...(await page.evaluate(() => window.fluidObservation)),
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  assert.ok(
    (await page.evaluate(() => window.fluidObservation)).rms < 0.0001,
    "pause silences sound",
  );
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.keyboard.press("Tab");
  await waitFor((value) => value.phase === "paused", "focus loss pause");
  await page.waitForTimeout(250);
  assert.ok(
    (await page.evaluate(() => window.fluidObservation)).rms < 0.0001,
    "focus loss silences sound",
  );
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  // Membrane: the first force is reached by forward input alone.
  await keys("ArrowRight");
  await waitFor(
    (s) => (JSON.parse(s.encounterPhases)["membrane-membrane_loop"] ?? 0) >= 2,
    "first rebound",
    10,
  );
  await capture("first_rebound");
  await keys("Space");
  await waitFor((s) => Number(s.playerY) < 20, "deliberate highest pocket", 5);
  await capture("highest_pocket");
  await keys();
  await steerTo(920, {
    y: 190,
    pulse: false,
    seconds: 12,
  });
  await capture("upper_pocket_descent");
  await steerTo(810, {
    pulse: false,
    seconds: 12,
    stopWhen: (s) => JSON.parse(s.encounterPhases)["membrane-membrane_loop"] >= 3,
  });
  await waitFor(
    (s) => JSON.parse(s.encounterPhases)["membrane-membrane_loop"] >= 3,
    "outlet phase",
  );
  await capture("backward_sweep");
  await steerTo(245, {
    pulse: false,
    seconds: 15,
    stopWhen: (s) => JSON.parse(s.encounterPhases)["membrane-membrane_loop"] >= 4,
  });
  await waitFor(
    (s) => JSON.parse(s.encounterPhases)["membrane-membrane_loop"] >= 4,
    "returned vesicle phase",
  );
  await capture("changed_return");
  const retained = await state();
  assert.ok(Number(retained.collected) > 0, "upper-pocket exploration collected a fragment");
  await steerTo(920, {
    y: 590,
    pulse: false,
    stopWhen: (s) => Number(s.playerY) > 565 && Math.abs(Number(s.playerX) + 15 - 920) < 35,
  });
  await keys("ArrowRight");
  await waitFor((s) => Number(s.deaths) > Number(retained.deaths), "marked acid detour death", 5);
  await keys();
  await waitFor((s) => s.phase === "playing", "checkpoint recovery");
  assert.equal((await state()).collected, retained.collected);
  assert.equal(JSON.parse((await state()).encounterPhases)["membrane-membrane_loop"], 4);
  assert.equal((await state()).checkpoint, retained.checkpoint);
  await capture("acid_recovery_retains_progress");
  await steerTo(255, {
    pulse: false,
    tolerance: 12,
    stopWhen: (s) => s.attachmentId.includes("membrane_loop"),
  });
  await keys();
  await waitFor((s) => s.attachmentId.includes("membrane_loop"), "arriving vesicle capture", 7);
  await capture("vesicle_ride");
  await waitFor((s) => !s.attachmentId, "vesicle automatic release", 5);
  await steerTo(1010, { y: 475, pulse: false });
  await waitFor((s) => s.attachmentId.includes("membrane_finish"), "channel entrance capture", 5);
  await capture("membrane_channel");
  await keys("Space");
  await waitFor(
    (s) => !s.attachmentId && Number(s.playerY) < 20,
    "channel pulse escape into highest pocket",
    6,
  );
  await keys();
  await capture("membrane_channel_highest_pocket");
  await steerTo(920, { y: 500, pulse: false });
  await capture("membrane_channel_return");
  await steerTo(1010, {
    y: 475,
    stopWhen: (s) => s.attachmentId.includes("membrane_finish"),
  });
  await waitFor((s) => s.attachmentId.includes("membrane_finish"), "channel recapture", 6);
  await keys();
  await waitFor((s) => s.stage === "cytoplasm", "membrane exit", 8);
  await keys();
  await capture("cytoplasm_start");
  await steerTo(150, {
    pulse: false,
    tolerance: 12,
    stopWhen: (s) => s.attachmentId.endsWith("motor_mito-transport-0"),
  });
  await waitFor((s) => s.attachmentId.endsWith("motor_mito-transport-0"), "motor pickup", 6);
  await capture("motor_cargo");
  await waitFor((s) => !s.attachmentId, "motor release", 5);
  await keys("ArrowRight");
  await waitFor(
    (s) => JSON.parse(s.encounterPhases)["cytoplasm-motor_mito"] >= 2,
    "mitochondrial rebound",
    5,
  );
  await capture("giant_mitochondrion");
  await keys("Space");
  await waitFor((s) => Number(s.playerY) < 20, "cytoplasm highest pocket", 6);
  await keys();
  await capture("cytoplasm_highest_pocket");
  await steerTo(975, { y: 565, pulse: false, seconds: 14 });
  await capture("cytoplasm_downward_return");
  await steerTo(350, {
    y: 0,
    thrust: true,
    seconds: 15,
    stopWhen: (s) => Number(s.playerY) < 20 && Number(s.playerX) < 550,
  });
  await keys();
  await capture("motor_chamber_highest_pocket");
  await steerTo(975, { y: 565, pulse: false });
  await capture("motor_chamber_downward_return");
  await steerTo(245, {
    pulse: false,
    tolerance: 12,
    stopWhen: (s) => s.attachmentId.endsWith("motor_mito-transport-1"),
  });
  await waitFor((s) => s.attachmentId.endsWith("motor_mito-transport-1"), "optional cargo ride", 6);
  await capture("optional_shortcut_pickup");
  await waitFor((s) => Number(s.playerX) > 550, "shortcut high arc", 5);
  await capture("optional_shortcut_arc");
  await waitFor((s) => !s.attachmentId, "shortcut automatic release", 6);
  await capture("optional_shortcut_return");
  await steerTo(1050, { y: 370, stopWhen: (s) => s.attachmentId.includes("er_channel") });
  await waitFor((s) => s.attachmentId.includes("er_channel"), "ER capture", 6);
  await capture("er_channel");
  await keys();
  await waitFor((s) => s.stage === "envelope", "cytoplasm exit", 8);
  await capture("envelope_start");
  await keys("ArrowRight");
  await waitFor((s) => Number(s.playerX) > 960, "missed pore lower approach", 7);
  await page.waitForTimeout(350);
  await capture("missed_pore_safe_rebound");
  await steerTo(840, { y: 40 });
  await keys("Space");
  await waitFor((s) => Number(s.playerY) < 20, "pre-pore ceiling", 5);
  await keys();
  await capture("pore_upper_pocket");
  await steerTo(915, { y: 260, pulse: false });
  await capture("pore_return_loop");
  await steerTo(1180, { y: 290 });
  await capture("open_pore_crossing");
  await steerTo(1320, { y: 0, seconds: 15, stopWhen: (s) => Number(s.playerY) < 20 });
  await keys();
  await capture("post_pore_highest_pocket");
  await steerTo(1960, { y: 290, stopWhen: (s) => s.stage === "receptor" });
  await waitFor((s) => s.stage === "receptor", "nuclear entry", 5);
  await keys();
  await capture("receptor_start");
  await steerTo(480, { pulse: false });
  await steerTo(595, { y: 290, stopWhen: (s) => s.attachmentKind === "sticky" });
  await waitFor((s) => s.attachmentKind === "sticky", "sticky contact", 5);
  await capture("sticky_contact");
  await page.keyboard.down("Space");
  await waitFor((s) => !s.attachmentId, "pulse escape", 2);
  await page.keyboard.up("Space");
  await capture("sticky_escape");
  await keys("ArrowRight", "Space");
  await waitFor((s) => Number(s.playerY) < 20, "held escape and receptor highest pocket", 9);
  await keys();
  await capture("receptor_highest_pocket");
  await steerTo(1960, { y: 550, pulse: false, seconds: 15 });
  await capture("receptor_upper_return");
  await steerTo(1100, { y: 495, stopWhen: (s) => s.receptorBound === "true" });
  await waitFor((s) => s.receptorBound === "true", "matching receptor", 5);
  await capture("bound_complex");
  await keys();
  await page.keyboard.press("r");
  await capture("bound_checkpoint_retry");
  assert.equal((await state()).receptorBound, "true");
  await steerTo(1960, { y: 300, stopWhen: (s) => s.stage === "dna" });
  await waitFor((s) => s.stage === "dna", "recognition enabled", 5);
  await keys();
  await capture("dna_start");
  await steerTo(700, { pulse: false });
  await steerTo(830, {
    y: 260,
    stopWhen: (s) => JSON.parse(s.encounterPhases)["dna-nucleosome_flow"] >= 2,
  });
  await waitFor(
    (s) => JSON.parse(s.encounterPhases)["dna-nucleosome_flow"] >= 2,
    "chromatin flow switch",
    6,
  );
  await capture("nucleosome_passage_changes_flow");
  await steerTo(1700, { y: 0, seconds: 15, stopWhen: (s) => Number(s.playerY) < 20 });
  await keys();
  await capture("dna_highest_pocket");
  await steerTo(1960, { y: 550, pulse: false, seconds: 15 });
  await capture("dna_downward_return");
  await steerTo(1810, { y: 500, stopWhen: (s) => s.stage === "transcription" });
  await waitFor((s) => s.stage === "transcription", "HRE docking", 5);
  await keys();
  await waitFor((s) => s.phase === "recruiting", "docked recruitment");
  await capture("hre_docked");
  await page.keyboard.down("Space");
  await page.waitForTimeout(1800);
  assert.ok(
    Number((await state()).recruitmentCount) <= 1,
    "hold submits at most one timing action",
  );
  await page.keyboard.up("Space");
  while (Number((await state()).recruitmentCount) < 3) {
    await waitFor(
      (s) =>
        (Number(s.recruitmentClock) % 1.4) / 1.4 > 0.32 &&
        (Number(s.recruitmentClock) % 1.4) / 1.4 < 0.65,
      "forgiving timing window",
      3,
    );
    const previousCount = Number((await state()).recruitmentCount);
    await page.keyboard.press("Space");
    await waitFor((s) => Number(s.recruitmentCount) > previousCount, "recruitment accepted", 2);
    await capture("recruitment_" + (await state()).recruitmentCount);
    await page.waitForTimeout(180);
  }
  await page.getByRole("button", { name: "Sound on", exact: true }).click();
  await page.waitForTimeout(1200);
  assert.ok(
    (await page.evaluate(() => window.fluidObservation)).rms < 0.0001,
    "mute silences sound",
  );
  await capture("moving_polymerase_growing_rna");
  await waitFor((s) => s.phase === "ended", "gene expression finale", 6);
  await capture("gene_expression_activated");
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await waitFor((s) => s.phase === "playing" && s.stage === "membrane", "Replay");
  assert.equal(
    await originalCanvas.evaluate((element) => element === document.querySelector("canvas")),
    true,
  );
  assert.equal((await state()).collected, "0");
  assert.equal((await state()).receptorBound, "false");
  const replayPhases = JSON.parse((await state()).encounterPhases);
  assert.ok((replayPhases["membrane-membrane_loop"] ?? 0) <= 1);
  assert.ok(Object.keys(replayPhases).every((id) => id === "membrane-membrane_loop"));
  await page.getByRole("button", { name: "Sound off", exact: true }).waitFor();
  const replayFrames = await page.evaluate(() => window.fluidObservation);
  assert.equal(replayFrames.frames.pending, 1);
  assert.equal(replayFrames.frames.maximum, 1);
  observations.push({ event: "replay-lifecycle", ...replayFrames });
  await capture("replay_sound_choice_retained");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: "Start adventure", exact: true }).waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const narrowCanvas = await canvas.elementHandle();
  await page.getByRole("button", { name: "Sound on", exact: true }).click();
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 0);
  await capture("narrow_prestart_muted");
  await page.getByRole("button", { name: "Start adventure", exact: true }).click();
  await keys("ArrowRight");
  await page.waitForTimeout(800);
  await keys();
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 0);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Retry checkpoint", exact: true }).click();
  await waitFor((s) => s.phase === "playing", "narrow retry");
  await page.keyboard.press("Escape");
  await capture("narrow_pause_menu");
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("button", { name: "Sound off", exact: true }).click();
  await page.waitForTimeout(200);
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 1);
  assert.equal(
    await narrowCanvas.evaluate((element) => element === document.querySelector("canvas")),
    true,
  );
  assert.equal((await page.evaluate(() => window.fluidObservation)).frames.maximum, 1);
  await keys("ArrowRight");
  await page.waitForTimeout(1000);
  await keys();
  await capture("narrow_reduced_motion_forces");
  finished = true;
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
  if (await canvas.count()) await capture("failure");
}
const finalState = (await canvas.count()) ? await state() : null;
const frames = await page.evaluate(() => window.fluidObservation);
const afterHashes = await hashFiles();
const sourceDrift = files.filter((file) => hashes[file] !== afterHashes[file]);
await writeFile(
  `${output}/report.json`,
  JSON.stringify(
    {
      finished,
      wallSeconds: (Date.now() - started) / 1000,
      hashes,
      sourceDrift,
      finalState,
      frames,
      captures,
      observations,
      errors,
    },
    null,
    2,
  ),
);
await page.close();
await browser.close();
if (!finished || errors.length || sourceDrift.length)
  throw new Error(
    `Walkthrough failed: ${errors.join("; ")}; source drift: ${sourceDrift.join(", ")}`,
  );
