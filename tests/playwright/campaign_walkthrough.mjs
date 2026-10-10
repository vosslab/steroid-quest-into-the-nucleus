// Actual-controls reference; selectors: runtime.ts observeState and app.tsx menu button names.
// node --import tsx tests/playwright/campaign_walkthrough.mjs URL output [--membrane-prefix] [--standard-only]
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { REPO_ROOT } from "./repo_root.mjs";
import { installObservation } from "./helper_observation.mjs";
import { createNavigation } from "./helper_navigation.mjs";
import { referenceApproach, referenceDestination } from "./helper_campaign_route.mjs";
import { CAMPAIGN } from "../../src/levels.ts";

process.chdir(REPO_ROOT);
const prefix = process.argv.includes("--membrane-prefix");
const standardOnly = process.argv.includes("--standard-only");
const output = process.argv[3] ?? "test-results/expansion/reference";
await mkdir(output, { recursive: true });
const sourceFiles = (await readdir("src", { recursive: true }))
  .filter((file) => /\.(ts|tsx|css|html)$/.test(file))
  .map((file) => `src/${file}`);
const files = [
  "tests/playwright/campaign_walkthrough.mjs",
  "tests/playwright/helper_observation.mjs",
  "tests/playwright/helper_navigation.mjs",
  "tests/playwright/helper_campaign_route.mjs",
  ...sourceFiles,
  "dist/main.js",
  "dist/style.css",
  "dist/index.html",
];
// ASVS 11.4.1/11.4.3: collision-resistant 256-bit fingerprints verify artifact identity.
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function hashFiles() {
  const currentSource = (await readdir("src", { recursive: true }))
    .filter((file) => /\.(ts|tsx|css|html)$/.test(file))
    .map((file) => `src/${file}`);
  const currentFiles = [...files.filter((file) => !file.startsWith("src/")), ...currentSource];
  return Object.fromEntries(
    await Promise.all(currentFiles.map(async (file) => [file, digest(await readFile(file))])),
  );
}
const hashes = await hashFiles();
await mkdir(`${output}/harness`, { recursive: true });
for (const file of files.filter((file) => file.startsWith("tests/playwright/"))) {
  await writeFile(`${output}/harness/${file.split("/").at(-1)}`, await readFile(file));
}
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  recordVideo: { dir: `${output}/video`, size: { width: 1280, height: 900 } },
});
await installObservation(page);
const errors = [],
  observations = [],
  captures = [],
  trace = [],
  timings = [];
const canvas = page.locator("canvas");
const { state, keys, waitFor, steerTo, record, setLane } = createNavigation(page, canvas, trace);
const started = Date.now();
let originalCanvas, standardStart, standardEnd, standardState;
let finished = false;
let recoveryDeliveries = false;
page.on("pageerror", (error) => errors.push(error.message));

async function capture(name) {
  const path = `${String(captures.length).padStart(2, "0")}_${name}.png`;
  await page.screenshot({ path: `${output}/${path}` });
  const value = await state();
  captures.push(path);
  observations.push({ event: name, wallSeconds: (Date.now() - started) / 1000, ...value });
  console.log(name, JSON.stringify(value));
}

function active(condition, value) {
  if (!condition) return true;
  const phase = JSON.parse(value.encounterPhases)[condition.encounterId] ?? 0;
  return phase >= (condition.min ?? 0) && phase <= (condition.max ?? Infinity);
}

async function descend(level, target, goal) {
  const value = await state();
  const px = Number(value.playerX) + 15,
    py = Number(value.playerY) + 15;
  if (py >= target.y - 55 || Number(value.playerVy) > 70) return;
  const streams = level.flowZones
    .filter(
      (field) =>
        active(field.activeWhen, value) &&
        field.acceleration.y > 100 &&
        field.y <= py + 15 &&
        field.y + field.height >= target.y - 55,
    )
    .sort(
      (first, second) =>
        Math.abs(first.x + first.width / 2 - px) +
        Math.abs(first.x + first.width / 2 - target.x) -
        Math.abs(second.x + second.width / 2 - px) -
        Math.abs(second.x + second.width / 2 - target.x),
    );
  const stream = streams[0];
  assert.ok(stream, `${goal}: descent stream available from ${px},${py}`);
  await steerTo(stream.x + stream.width / 2, {
    pulse: false,
    tolerance: Math.min(18, stream.width / 4),
    goal: `${goal}: reach visible descent`,
  });
  await steerTo(stream.x + stream.width / 2, {
    pulse: false,
    stopWhen: (s) => Number(s.playerY) + 15 >= target.y - 55,
    goal: `${goal}: descend in current`,
  });
}

async function navigate(level, target, options) {
  if (options.authored || level.id === "membrane")
    return steerTo(target.x, { y: target.y, ...options });
  await descend(level, target, options.goal);
  return steerTo(target.x, { y: target.y, ...options });
}

async function performStep(level, encounter, step, index) {
  const goal = `${encounter.id}/${step.id}`;
  const complete = (s) => (JSON.parse(s.encounterPhases)[encounter.id] ?? 0) > index;
  if (complete(await state())) return;
  const start = Number((await state()).elapsed);
  if (recoveryDeliveries && step.kind === "transport_delivery") {
    assert.equal((await state()).attachmentId, step.transportId);
    await page.keyboard.press("Space");
    await waitFor((s) => !s.attachmentId, `${goal}: early escape`, 3);
    assert.equal(JSON.parse((await state()).encounterPhases)[encounter.id], index);
    await capture(`ancillary_${encounter.id}_early_delivery_escape`);
    const retained = await state();
    await page.keyboard.press("r");
    await waitFor(
      (s) => !s.attachmentId && Math.abs(Number(s.playerVx)) < 1,
      `${goal}: pending delivery retry`,
      3,
    );
    assert.equal((await state()).checkpoint, retained.checkpoint);
    assert.equal((await state()).requiredCompleted, retained.requiredCompleted);
    assert.equal(JSON.parse((await state()).encounterPhases)[encounter.id], index);
    await capture(`ancillary_${encounter.id}_detached_pending_delivery`);
  }
  const approach = referenceApproach(encounter.id, step.id);
  if (approach) {
    for (const [viaIndex, via] of (approach.via ?? []).entries()) {
      await navigate(level, via, {
        ...via,
        authored: true,
        goal: `${goal}: visible route ${viaIndex + 1}`,
        stopWhen: (s) => complete(s) || Boolean(via.stopWhen?.(s)),
      });
      if (complete(await state())) break;
    }
    if (!complete(await state())) {
      await navigate(level, approach, { ...approach, goal, stopWhen: complete });
    }
  } else if (step.kind === "region") {
    await navigate(
      level,
      {
        x: step.region.x + step.region.width / 2,
        y: step.region.y + step.region.height / 2,
      },
      { goal, stopWhen: complete },
    );
  } else if (step.kind === "transport_capture" || step.kind === "transport_delivery") {
    const transport = level.transports.find((candidate) => candidate.id === step.transportId);
    assert.ok(transport, `${goal}: named transport exists`);
    await navigate(level, transport.path[0], {
      goal: `${goal}: capture`,
      tolerance: 12,
      verticalTolerance: 15,
      stopWhen: (s) => complete(s) || s.attachmentId === transport.id,
    });
    await keys();
    if (!complete(await state())) {
      await capture(`${encounter.id}_${step.id}_ride`);
      await waitFor(complete, `${goal}: actual delivery`, 35);
    }
  } else if (step.kind === "contact") {
    const obstacle = level.obstacles.find((candidate) => candidate.id === step.contactId);
    assert.ok(obstacle, `${goal}: named contact exists`);
    const shape = obstacle.shape;
    const center =
      shape.kind === "circle"
        ? shape.center
        : shape.kind === "capsule"
          ? { x: (shape.start.x + shape.end.x) / 2, y: (shape.start.y + shape.end.y) / 2 }
          : { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
    await navigate(level, center, { goal, stopWhen: complete });
  } else {
    const trigger = level.triggers.find(
      (candidate) => candidate.kind === (step.milestone === "receptor_bound" ? "receptor" : "hre"),
    );
    assert.ok(trigger, `${goal}: biological trigger exists`);
    await navigate(
      level,
      { x: trigger.x + trigger.width / 2, y: trigger.y + trigger.height / 2 },
      { goal, stopWhen: complete },
    );
  }
  if ((await state()).attachmentKind === "sticky") {
    await keys();
    await capture(`${encounter.id}_${step.id}_sticky_attached`);
    const released = await waitFor((s) => !s.attachmentId, `${goal}: automatic sticky release`, 5);
    record(`${goal}: automatic sticky release`, released, "automatic release", undefined, true);
    await capture(`${encounter.id}_${step.id}_sticky_automatic_release`);
  }
  await waitFor(complete, goal, 3);
  timings.push({
    stage: level.id,
    encounter: encounter.id,
    step: step.id,
    start,
    end: Number((await state()).elapsed),
  });
  await capture(`${encounter.id}_${step.id}`);
}

async function runStage(level) {
  assert.equal((await state()).stage, level.id);
  const start = Number((await state()).elapsed);
  await capture(`${level.id}_start`);
  for (const id of level.requiredEncounterIds) {
    const encounter = level.encounters.find((candidate) => candidate.id === id);
    assert.ok(encounter, `${id}: required encounter exists`);
    const encounterStart = Number((await state()).elapsed);
    for (const [index, step] of encounter.steps.entries())
      await performStep(level, encounter, step, index);
    assert.equal((await state()).checkpoint, encounter.completionCheckpoint.id);
    timings.push({
      stage: level.id,
      encounter: id,
      start: encounterStart,
      end: Number((await state()).elapsed),
    });
  }
  assert.equal((await state()).destinationReady, "true");
  const destination = level.destination;
  assert.ok(destination, `${level.id}: biological destination exists`);
  const destinationApproach = referenceDestination(level.id) ?? destination.center;
  await navigate(level, destinationApproach, {
    ...destinationApproach,
    goal: `${level.id}: approach ${destination.label}`,
    stopWhen: (s) => s.phase === "transition",
  });
  await keys();
  await capture(`${level.id}_destination_zoom`);
  const committed = await waitFor((s) => s.stage !== level.id, `${level.id}: stage commitment`, 3);
  const next = CAMPAIGN[CAMPAIGN.findIndex((candidate) => candidate.id === level.id) + 1];
  assert.equal(committed.stage, next.id);
  assert.equal(committed.transitionDestinationId, "");
  record(`${level.id}: committed to ${next.id}`, committed, "stage committed", undefined, true);
  observations.push({ event: `${level.id}_stage_committed`, ...committed });
  timings.push({ stage: level.id, start, end: Number(committed.elapsed) });
  await capture(`${level.id}_committed_${next.id}`);
  assert.equal(
    await originalCanvas.evaluate((element) => element === document.querySelector("canvas")),
    true,
  );
}

async function checkLifecycle() {
  let peakRms = 0;
  for (let index = 0; index < 12; index++) {
    peakRms = Math.max(peakRms, (await page.evaluate(() => window.fluidObservation)).rms);
    await page.waitForTimeout(70);
  }
  assert.ok(peakRms > 0.0001, "Start produces real synthesized output");
  observations.push({ event: "audio-after-start", peakRms });
  await page.keyboard.press("Escape");
  await waitFor((s) => s.phase === "paused", "pause");
  await page.waitForTimeout(250);
  assert.ok((await page.evaluate(() => window.fluidObservation)).rms < 0.0001);
  const paused = await state();
  await page.waitForTimeout(200);
  assert.equal((await state()).elapsed, paused.elapsed);
  await capture("pause_freezes_campaign");
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.keyboard.press("Tab");
  await waitFor((s) => s.phase === "paused", "focus loss");
  await page.waitForTimeout(250);
  assert.ok((await page.evaluate(() => window.fluidObservation)).rms < 0.0001);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
}

async function checkMembraneRecovery() {
  setLane("ancillary recovery");
  // A fresh real Start makes ancillary exploration independent of standard pacing.
  await page.reload();
  await page.getByRole("button", { name: "Start adventure", exact: true }).click();
  originalCanvas = await canvas.elementHandle();
  await waitFor((s) => s.phase === "playing", "ancillary Start");
  const level = CAMPAIGN[0];
  await keys("Space");
  await waitFor((s) => Number(s.playerY) < 20, "early roof bypass attempt", 18);
  await keys();
  await capture("ancillary_highest_pocket");
  await steerTo(5945, { y: 20, thrust: true, goal: "ancillary: ceiling bypass attempt" });
  await steerTo(4260, {
    pulse: false,
    goal: "ancillary: destination return stream",
    stopWhen: (s) => Number(s.playerY) + 15 >= 340,
  });
  await steerTo(level.destination.center.x, {
    y: level.destination.center.y,
    goal: "ancillary: contact locked biological destination",
    tolerance: 45,
    verticalTolerance: 70,
  });
  assert.equal((await state()).stage, "membrane");
  assert.equal((await state()).destinationReady, "false");
  assert.equal((await state()).requiredCompleted, "0");
  await capture("ancillary_early_destination_denied");
  await page.keyboard.press("r");
  await waitFor((s) => Number(s.playerX) < 150, "retry returns from locked destination", 3);
  const first = level.encounters.find(
    (encounter) => encounter.id === level.requiredEncounterIds[0],
  );
  for (const [index, step] of first.steps.entries()) await performStep(level, first, step, index);
  const retained = await state();
  await page.keyboard.press("r");
  await waitFor((s) => Math.abs(Number(s.playerVx)) < 1, "calm completed-encounter retry", 3);
  assert.equal((await state()).checkpoint, retained.checkpoint);
  assert.equal((await state()).requiredCompleted, retained.requiredCompleted);
  assert.equal(JSON.parse((await state()).encounterPhases)[first.id], first.steps.length);
  await capture("ancillary_retry_retains_completion");
  await keys("Space");
  await waitFor((s) => Number(s.playerY) < 20, "completed encounter highest pocket", 18);
  await keys();
  await capture("ancillary_completed_highest_pocket");
  const second = level.encounters.find(
    (encounter) => encounter.id === level.requiredEncounterIds[1],
  );
  recoveryDeliveries = true;
  for (const [index, step] of second.steps.entries()) await performStep(level, second, step, index);
  assert.equal((await state()).requiredCompleted, "2");
  await capture("ancillary_highest_pocket_backward_return");
  for (const id of level.requiredEncounterIds.slice(2)) {
    const encounter = level.encounters.find((candidate) => candidate.id === id);
    for (const [index, step] of encounter.steps.entries()) {
      await performStep(level, encounter, step, index);
    }
  }
  assert.equal((await state()).requiredCompleted, "4");
  const retainedAll = await state();
  await page.keyboard.press("r");
  await waitFor(
    (s) => !s.attachmentId && Math.abs(Number(s.playerVx)) < 1,
    "all completed encounter retry",
    3,
  );
  assert.equal((await state()).requiredCompleted, "4");
  assert.equal((await state()).checkpoint, retainedAll.checkpoint);
  await capture("ancillary_all_completions_retained");
  recoveryDeliveries = false;
}

async function checkPostCampaignLifecycle() {
  setLane("ancillary lifecycle");
  assert.ok((await page.evaluate(() => window.fluidObservation)).rms < 0.0001);
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await waitFor((s) => s.stage === "membrane" && s.phase === "playing", "Replay resets campaign");
  const replay = await state();
  assert.equal(replay.collected, "0");
  assert.equal(replay.receptorBound, "false");
  assert.equal(replay.hreBound, "false");
  assert.equal(replay.requiredCompleted, "0");
  assert.ok(
    Object.entries(JSON.parse(replay.encounterPhases)).every(
      ([id, phase]) => id === CAMPAIGN[0].requiredEncounterIds[0] && phase <= 1,
    ),
  );
  await page.getByRole("button", { name: "Sound off", exact: true }).waitFor();
  assert.equal(
    await originalCanvas.evaluate((element) => element === document.querySelector("canvas")),
    true,
  );
  await capture("ancillary_replay_resets_progress_retains_sound_choice");
  await keys("ArrowUp");
  await waitFor((s) => Number(s.playerVy) < -10, "optional gentle Up thrust", 3);
  await keys();
  await capture("ancillary_optional_up_thrust");
  await page.keyboard.press("r");
  await keys("ArrowDown");
  await waitFor((s) => Number(s.playerVy) > 10, "optional gentle Down thrust", 3);
  await keys();
  await capture("ancillary_optional_down_thrust");
  await page.keyboard.press("Escape");
  await waitFor((s) => s.phase === "paused", "optional control pause");
  const paused = await state();
  await page.waitForTimeout(250);
  assert.equal((await state()).playerY, paused.playerY);
  await page.getByRole("button", { name: "Resume", exact: true }).click();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: "Start adventure", exact: true }).waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const narrowCanvas = await canvas.elementHandle();
  await page.getByRole("dialog").getByRole("button", { name: "Sound on", exact: true }).click();
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 0);
  await capture("ancillary_narrow_prestart_muted");
  await page.getByRole("button", { name: "Start adventure", exact: true }).click();
  await keys("ArrowRight");
  await waitFor((s) => Number(s.playerX) > 100, "narrow movement", 3);
  await keys();
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 0);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Retry checkpoint", exact: true }).click();
  await waitFor((s) => s.phase === "playing", "narrow checkpoint retry");
  await page.keyboard.press("Escape");
  await capture("ancillary_narrow_reduced_motion_pause_menu");
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("button", { name: "Sound off", exact: true }).click();
  assert.equal((await state()).phase, "playing");
  assert.equal(await canvas.evaluate((element) => element === document.activeElement), true);
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 1);
  assert.equal(
    await narrowCanvas.evaluate((element) => element === document.querySelector("canvas")),
    true,
  );
  assert.equal((await page.evaluate(() => window.fluidObservation)).frames.maximum, 1);
  await keys("ArrowRight");
  await waitFor((s) => Number(s.playerX) > 250, "narrow reduced-motion forces", 5);
  await keys();
  await capture("ancillary_narrow_reduced_motion_play");
}

try {
  await page.goto(process.argv[2] ?? "http://127.0.0.1:8374");
  await page.getByRole("button", { name: "Start adventure", exact: true }).waitFor();
  const servedHashes = {};
  for (const asset of ["main.js", "style.css", "index.html"]) {
    const response = await page.request.get(new URL(asset, page.url()).href);
    assert.ok(response.ok(), `${asset}: HTTP asset available`);
    servedHashes[asset] = digest(await response.body());
    assert.equal(servedHashes[asset], hashes[`dist/${asset}`]);
  }
  observations.push({ event: "served-hashes", servedHashes });
  assert.equal((await page.evaluate(() => window.fluidObservation)).contexts, 0);
  await capture("title_sound_on");
  await page.getByRole("button", { name: "Start adventure", exact: true }).click();
  originalCanvas = await canvas.elementHandle();
  await waitFor((s) => s.phase === "playing", "start");
  await checkLifecycle();
  setLane("standard");
  standardStart = Number((await state()).elapsed);
  for (const level of CAMPAIGN.filter((level) => level.id !== "transcription")) {
    await runStage(level);
    if (prefix) break;
  }
  if (!prefix) {
    await waitFor((s) => s.phase === "recruiting", "HRE docking continuity");
    assert.equal((await state()).receptorBound, "true");
    assert.equal((await state()).hreBound, "true");
    await capture("hre_docked");
    while (Number((await state()).recruitmentCount) < 3) {
      await waitFor(
        (s) =>
          (Number(s.recruitmentClock) % 1.4) / 1.4 > 0.32 &&
          (Number(s.recruitmentClock) % 1.4) / 1.4 < 0.65,
        "forgiving recruitment window",
        3,
      );
      const count = Number((await state()).recruitmentCount);
      await page.keyboard.press("Space");
      await waitFor((s) => Number(s.recruitmentCount) > count, "recruitment action", 2);
      assert.equal(Number((await state()).recruitmentCount), count + 1);
      record("transcription recruitment", await state(), "tap pulse", undefined, true);
      await capture(`recruitment_${count + 1}`);
    }
    const expressionStart = Number((await state()).elapsed);
    await waitFor(
      (s) => Number(s.elapsed) >= expressionStart + 1.7,
      "automatic polymerase expression scene",
      3,
    );
    await capture("moving_polymerase_growing_rna");
    await page.getByRole("button", { name: "Sound on", exact: true }).click();
    observations.push({ event: "sound-choice-muted-before-ending", ...(await state()) });
    await waitFor((s) => s.phase === "ended", "gene expression finale", 10);
    await capture("gene_expression_activated");
    const completed = JSON.parse((await state()).encounterPhases);
    for (const level of CAMPAIGN) {
      for (const id of level.requiredEncounterIds) {
        const encounter = level.encounters.find((candidate) => candidate.id === id);
        assert.equal(completed[id], encounter.steps.length);
      }
    }
    assert.equal((await state()).deaths, "0");
  }
  standardState = await state();
  standardEnd = Number(standardState.elapsed);
  const frames = await page.evaluate(() => window.fluidObservation);
  assert.equal(frames.frames.pending, 1);
  assert.equal(frames.frames.maximum, 1);
  observations.push({ event: "standard-lifecycle", ...frames });
  if (!standardOnly) {
    if (prefix) await checkMembraneRecovery();
    else await checkPostCampaignLifecycle();
  }
  finished = true;
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
  await keys();
  if (await canvas.count()) await capture("failure");
}
const finalState = (await canvas.count()) ? await state() : null;
const frames = await page.evaluate(() => window.fluidObservation);
const afterHashes = await hashFiles();
const sourceDrift = [...new Set([...Object.keys(hashes), ...Object.keys(afterHashes)])].filter(
  (file) => hashes[file] !== afterHashes[file],
);
const activeSeconds = standardEnd === undefined ? undefined : standardEnd - standardStart;
const pacingTarget = prefix ? { minimum: 80, maximum: 115 } : { minimum: 480, maximum: 720 };
const pacingWithinTarget =
  activeSeconds !== undefined &&
  activeSeconds >= pacingTarget.minimum &&
  activeSeconds <= pacingTarget.maximum;
await writeFile(
  `${output}/report.json`,
  JSON.stringify(
    {
      mode: prefix ? "membrane-prefix" : "full-standard-reference",
      standardOnly,
      finished,
      wallSeconds: (Date.now() - started) / 1000,
      activeSeconds,
      standardStart,
      standardEnd,
      standardState,
      pacingTarget,
      pacingWithinTarget,
      campaignRequirements: CAMPAIGN.map((level) => ({
        stage: level.id,
        requiredEncounters: level.requiredEncounterIds,
      })),
      hashes,
      afterHashes,
      sourceDrift,
      finalState,
      frames,
      captures,
      observations,
      timings,
      errors,
    },
    null,
    2,
  ),
);
await writeFile(`${output}/controller_trace.json`, JSON.stringify(trace, null, 2));
await page.close();
await browser.close();
if (!finished || errors.length || sourceDrift.length)
  throw new Error(
    `Walkthrough failed: ${errors.join("; ")}; source drift: ${sourceDrift.join(", ")}`,
  );
if (!pacingWithinTarget)
  throw new Error(
    `Reference pacing needs content correction: ${activeSeconds}s; ` +
      `target ${pacingTarget.minimum}-${pacingTarget.maximum}s. See recorded encounter timings.`,
  );
