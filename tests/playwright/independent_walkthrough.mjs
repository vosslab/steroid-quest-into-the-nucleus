/** One-time independent campaign evidence, executed only after the manager freezes the build.
 * Controls: app.tsx Start adventure button and canvas; runtime.ts:84-116 readonly dataset.
 * Run: node --import tsx tests/playwright/independent_walkthrough.mjs --approved-build HASH
 * No gameplay globals, hidden controls, synthetic events, or reference controller imports.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { CAMPAIGN } from "../../src/levels.ts";
import { chooseKeys, currentTarget, planRoute } from "./helper_independent_route.mjs";
import { REPO_ROOT } from "./repo_root.mjs";

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function directoryFiles(relative) {
  const files = [];
  const entries = await readdir(path.join(REPO_ROOT, relative), { withFileTypes: true });
  for (const entry of entries) {
    const name = `${relative}/${entry.name}`;
    if (entry.isDirectory()) files.push(...(await directoryFiles(name)));
    else files.push(name);
  }
  return files.sort();
}

async function fileHashes(files) {
  const result = {};
  for (const file of files) result[file] = hash(await readFile(path.join(REPO_ROOT, file)));
  return result;
}

async function provenance(baseUrl) {
  const buildFiles = await directoryFiles("dist");
  const sourceFiles = [
    ...(await directoryFiles("src")),
    "package.json",
    "build_github_pages.sh",
    "tsconfig.json",
  ];
  const source = await fileHashes(sourceFiles);
  const build = await fileHashes(buildFiles);
  const controller = await fileHashes([
    "tests/playwright/independent_walkthrough.mjs",
    "tests/playwright/helper_independent_route.mjs",
  ]);
  const served = {};
  if (baseUrl) {
    for (const file of buildFiles) {
      const url = new URL(file.slice(5), `${baseUrl}/`);
      const response = await fetch(url, { cache: "no-store" });
      assert.equal(response.status, 200, `Cannot fetch ${url}`);
      served[file] = hash(Buffer.from(await response.arrayBuffer()));
      assert.equal(served[file], build[file], `Served artifact differs: ${file}`);
    }
  }
  return {
    source,
    build,
    served,
    controller,
    sourceSignature: hash(JSON.stringify(source)),
    buildSignature: hash(JSON.stringify(build)),
  };
}

async function observe(page) {
  const raw = await page.locator("canvas").evaluate((canvas) => ({ ...canvas.dataset }));
  return {
    raw,
    stage: raw.stage,
    phase: raw.phase,
    x: Number(raw.playerX),
    y: Number(raw.playerY),
    vx: Number(raw.playerVx),
    vy: Number(raw.playerVy),
    elapsed: Number(raw.elapsed),
    attachmentId: raw.attachmentId,
    attachmentKind: raw.attachmentKind,
    encounter: raw.currentEncounterId,
    phases: JSON.parse(raw.encounterPhases),
    completed: Number(raw.requiredCompleted),
    total: Number(raw.requiredTotal),
    deaths: Number(raw.deaths),
    checkpoint: raw.checkpoint,
    recruitmentCount: Number(raw.recruitmentCount),
    clock: Number(raw.recruitmentClock),
  };
}

async function setKeys(page, held, desired, observation, decisions) {
  for (const key of held) {
    if (!desired.includes(key)) {
      await page.keyboard.up(key);
      held.delete(key);
      decisions.push({ event: "up", key, elapsed: observation.elapsed, stage: observation.stage });
    }
  }
  for (const key of desired) {
    assert(["ArrowLeft", "ArrowRight", "Space"].includes(key), `Invalid primary key ${key}`);
    if (!held.has(key)) {
      await page.keyboard.down(key);
      held.add(key);
      decisions.push({
        event: "down",
        key,
        elapsed: observation.elapsed,
        stage: observation.stage,
      });
    }
  }
}

function intervals(samples, field) {
  const result = [];
  let previous;
  for (const sample of samples) {
    const id =
      field === "stage"
        ? sample.stage
        : field === "encounter"
          ? `${sample.stage}:${sample.encounter || sample.phase}`
          : `${sample.stage}:${sample.target?.id ?? sample.phase}`;
    if (previous?.id === id) continue;
    if (previous) {
      previous.end = sample.elapsed;
      previous.seconds = previous.end - previous.start;
    }
    previous = { id, start: sample.elapsed, end: sample.elapsed, seconds: 0 };
    result.push(previous);
  }
  if (previous && samples.length) {
    previous.end = samples.at(-1).elapsed;
    previous.seconds = previous.end - previous.start;
  }
  return result;
}

async function drive(page, output, samples, keyTrace, screenshots, membraneOnly, stopRequested) {
  const held = new Set();
  let stage = "";
  let stageStart = 0;
  let targetId = "";
  let targetStart = 0;
  let lastPlan = -Infinity;
  let route = [];
  let lastSignature = "";
  let transcriptionPressed = false;
  let snapshotIndex = 0;
  let motionAnchor;
  await page.getByRole("button", { name: /Start adventure/ }).click();
  let observation = await observe(page);
  assert.equal(observation.phase, "playing");
  while (observation.phase !== "ended" && (!membraneOnly || observation.stage === "membrane")) {
    if (stopRequested()) {
      await setKeys(page, held, [], observation, keyTrace);
      throw new Error("Manager stopped diagnostic for build replacement");
    }
    assert.notEqual(observation.phase, "paused", "Unexpected loss of canvas focus");
    assert(observation.elapsed < 1200, "Independent route exceeds 20 active minutes");
    const level = CAMPAIGN.find((item) => item.id === observation.stage);
    assert(level, `Unknown stage ${observation.stage}`);
    if (stage !== observation.stage) {
      stage = observation.stage;
      stageStart = observation.elapsed;
      targetId = "";
      lastPlan = -Infinity;
    }
    const levelTime = observation.elapsed - stageStart;
    if (
      !motionAnchor ||
      Math.hypot(observation.x - motionAnchor.x, observation.y - motionAnchor.y) > 12 ||
      observation.phase !== "playing"
    ) {
      motionAnchor = { x: observation.x, y: observation.y, time: observation.elapsed };
    }
    assert(
      observation.elapsed - motionAnchor.time < 10,
      `Independent controller stopped moving in ${stage}`,
    );
    const target =
      observation.phase === "playing"
        ? currentTarget(level, observation, levelTime)
        : { id: observation.phase, kind: observation.phase };
    if (target.id !== targetId) {
      targetId = target.id;
      targetStart = observation.elapsed;
      lastPlan = -Infinity;
    }
    assert(
      observation.elapsed - targetStart < 75,
      `Independent navigation stalled on ${targetId}: ${JSON.stringify(observation)}`,
    );
    if (observation.phase === "playing" && observation.elapsed - lastPlan > 1.5) {
      route = planRoute(level, observation, target, levelTime);
      lastPlan = observation.elapsed;
    }
    let action;
    if (observation.phase === "recruiting") {
      const fraction = (observation.clock % 1.4) / 1.4;
      const eligible = observation.recruitmentCount < 3 && fraction >= 0.25 && fraction <= 0.75;
      action = {
        keys: eligible && !transcriptionPressed ? ["Space"] : [],
        reason: "visible recruitment window",
      };
      transcriptionPressed = action.keys.length > 0;
    } else {
      action = chooseKeys(level, observation, target, route);
    }
    await setKeys(page, held, action.keys, observation, keyTrace);
    const sample = { wall: new Date().toISOString(), ...observation, target, action };
    samples.push(sample);
    await appendFile(path.join(output, "independent_trace.jsonl"), `${JSON.stringify(sample)}\n`);
    const signature = `${stage}:${JSON.stringify(observation.phases)}:${observation.phase}`;
    if (signature !== lastSignature) {
      const filename = `independent_${String(snapshotIndex).padStart(3, "0")}_${stage}.png`;
      screenshots.push(page.screenshot({ path: path.join(output, filename) }));
      snapshotIndex += 1;
      lastSignature = signature;
      process.stdout.write(
        `${observation.elapsed.toFixed(2)}s ${targetId} ` +
          `(${observation.x.toFixed(0)},${observation.y.toFixed(0)})\n`,
      );
    }
    // Observe after 0.10 seconds of actual simulation, not an artificial input delay.
    // The existing keys remain active; natural transport and RNA payoff also keep advancing.
    await page.waitForFunction(
      (previous) => {
        const canvas = document.querySelector("canvas");
        return (
          canvas &&
          (Number(canvas.dataset.elapsed) >= previous + 0.1 ||
            canvas.dataset.phase === "ended" ||
            canvas.dataset.phase === "paused")
        );
      },
      observation.elapsed,
      { polling: 25, timeout: 5000 },
    );
    observation = await observe(page);
  }
  await setKeys(page, held, [], observation, keyTrace);
  const completedTarget = membraneOnly ? "prefix_complete" : "ended";
  samples.push({
    ...observation,
    target: { id: completedTarget },
    action: { keys: [], reason: completedTarget },
  });
  screenshots.push(
    page.screenshot({
      path: path.join(
        output,
        membraneOnly ? "independent_prefix_complete.png" : "independent_ending.png",
      ),
    }),
  );
  return observation;
}

async function main() {
  const argumentsList = process.argv.slice(2);
  const preparing = argumentsList.includes("--prepare");
  const membraneOnly = argumentsList.includes("--membrane-only");
  const index = argumentsList.indexOf("--approved-build");
  const approved = index >= 0 ? argumentsList[index + 1] : undefined;
  const mainIndex = argumentsList.indexOf("--approved-main");
  const approvedMain = mainIndex >= 0 ? argumentsList[mainIndex + 1] : undefined;
  const baseUrl = process.env.PW_BASE_URL ?? "http://127.0.0.1:8374";
  const before = await provenance(preparing ? undefined : baseUrl);
  if (preparing) {
    process.stdout.write(
      `${JSON.stringify(
        {
          buildSignature: before.buildSignature,
          targets: CAMPAIGN.map((level) => ({
            stage: level.id,
            required: level.requiredEncounterIds.length,
            steps: level.encounters.map((item) => ({ id: item.id, count: item.steps.length })),
          })),
        },
        null,
        2,
      )}\n`,
    );
    return;
  }
  assert(approved, "Manager frozen build approval is required (--approved-build HASH)");
  assert.equal(before.buildSignature, approved, "Build differs from manager-approved artifact");
  if (approvedMain) {
    assert.equal(
      before.build["dist/main.js"],
      approvedMain,
      "JavaScript bundle differs from manager-approved artifact",
    );
  }
  const runId = new Date().toISOString().replace(/[^0-9a-z]/gi, "_");
  const output = path.join(REPO_ROOT, "test-results/expansion", `independent_${runId}`);
  await mkdir(output, { recursive: true });
  await writeFile(
    path.join(output, "independent_provenance_before.json"),
    JSON.stringify(before, null, 2),
  );
  let browser;
  try {
    browser = await chromium.launch();
  } catch (error) {
    await writeFile(
      path.join(output, "independent_summary.json"),
      JSON.stringify(
        {
          complete: false,
          diagnostic: membraneOnly,
          diagnosticPassed: false,
          activeSeconds: 0,
          failure: String(error),
          failurePhase: "browser_launch",
          browserCreated: false,
        },
        null,
        2,
      ),
    );
    throw error;
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    recordVideo: { dir: output, size: { width: 1440, height: 1000 } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const samples = [];
  const keyTrace = [];
  const screenshots = [];
  let finalObservation;
  let failure;
  let managerStopped = false;
  function requestStop() {
    managerStopped = true;
  }
  process.on("SIGUSR1", requestStop);
  await writeFile(
    path.join(output, "independent_controller.mjs"),
    await readFile(path.join(REPO_ROOT, "tests/playwright/independent_walkthrough.mjs")),
  );
  await writeFile(
    path.join(output, "independent_policy.mjs"),
    await readFile(path.join(REPO_ROOT, "tests/playwright/helper_independent_route.mjs")),
  );
  try {
    await page.goto(baseUrl);
    await page.getByRole("button", { name: /Start adventure/ }).waitFor({ state: "visible" });
    finalObservation = await drive(
      page,
      output,
      samples,
      keyTrace,
      screenshots,
      membraneOnly,
      () => managerStopped,
    );
    assert.deepEqual(errors, [], "Browser errors during independent route");
    if (membraneOnly) assert.equal(finalObservation.stage, "cytoplasm");
    else assert.equal(new Set(samples.map((sample) => sample.stage)).size, 6);
    for (const level of membraneOnly ? CAMPAIGN.slice(0, 1) : CAMPAIGN) {
      for (const encounterId of level.requiredEncounterIds) {
        const encounter = level.encounters.find((item) => item.id === encounterId);
        assert(encounter, `Missing authored encounter ${encounterId}`);
        assert.equal(
          finalObservation.phases[encounterId],
          encounter.steps.length,
          `Required encounter not complete: ${encounterId}`,
        );
      }
    }
    if (!membraneOnly) {
      assert.equal(finalObservation.raw.receptorBound, "true");
      assert.equal(finalObservation.raw.hreBound, "true");
      assert.equal(finalObservation.recruitmentCount, 3);
      assert(
        finalObservation.elapsed >= 480 && finalObservation.elapsed <= 720,
        `Independent campaign pacing is ${finalObservation.elapsed}s, outside 480-720s`,
      );
    }
  } catch (error) {
    // Diagnostic attempts retain their explicit cause alongside timing and hashes.
    failure = String(error);
    screenshots.push(page.screenshot({ path: path.join(output, "independent_failure.png") }));
    throw error;
  } finally {
    const captures = await Promise.allSettled(screenshots);
    const captureErrors = captures
      .filter((item) => item.status === "rejected")
      .map((item) => String(item.reason));
    const after = await provenance(baseUrl);
    const summary = {
      complete: finalObservation?.phase === "ended",
      diagnostic: membraneOnly,
      diagnosticPassed: membraneOnly && !failure && finalObservation?.stage === "cytoplasm",
      failure,
      managerStopped,
      errors,
      captureErrors,
      activeSeconds: finalObservation?.elapsed ?? samples.at(-1)?.elapsed,
      pacingAccepted: Boolean(
        !membraneOnly &&
        !failure &&
        finalObservation?.phase === "ended" &&
        finalObservation.elapsed >= 480 &&
        finalObservation.elapsed <= 720,
      ),
      stages: intervals(samples, "stage"),
      encounters: intervals(samples, "encounter"),
      targets: intervals(samples, "target"),
      sourceUnchanged: before.sourceSignature === after.sourceSignature,
      buildUnchanged: before.buildSignature === after.buildSignature,
      controllerUnchanged: JSON.stringify(before.controller) === JSON.stringify(after.controller),
      finalObservation,
      lastObservation: samples.at(-1),
      screenshots: screenshots.length,
    };
    await writeFile(
      path.join(output, "independent_summary.json"),
      JSON.stringify(summary, null, 2),
    );
    await writeFile(
      path.join(output, "independent_key_trace.json"),
      JSON.stringify(keyTrace, null, 2),
    );
    await writeFile(
      path.join(output, "independent_provenance_after.json"),
      JSON.stringify(after, null, 2),
    );
    await context.close();
    const video = page.video();
    if (video) {
      await video.saveAs(path.join(output, "independent_video.webm"));
      await video.delete();
    }
    await browser.close();
    process.off("SIGUSR1", requestStop);
    process.stdout.write(`Independent evidence: ${output}\n${JSON.stringify(summary)}\n`);
    if (!membraneOnly) {
      assert.equal(summary.sourceUnchanged, true, "Source changed during independent evidence");
    }
    assert.equal(summary.buildUnchanged, true, "Build changed during independent evidence");
    assert.deepEqual(captureErrors, [], "Signature captures failed");
  }
}

await main();
