/** Reference controller: actual keys and read-only canvas observations only. */
export function createNavigation(page, canvas, trace) {
  const held = new Set();
  let lastPulse = 0;
  let lastTrace = -Infinity;
  let previousMode = "";
  let lane = "standard";

  const state = () => canvas.evaluate((element) => ({ ...element.dataset }));

  async function keys(...wanted) {
    // ASVS 2.2.1: the standard reference is constrained to the approved three gameplay keys.
    const allowed =
      lane === "standard"
        ? ["ArrowLeft", "ArrowRight", "Space"]
        : ["ArrowLeft", "ArrowRight", "Space", "ArrowUp", "ArrowDown"];
    if (wanted.some((key) => !allowed.includes(key)))
      throw new Error(`Unapproved gameplay input for ${lane}: ${wanted.join(", ")}`);
    for (const key of held) {
      if (!wanted.includes(key)) {
        await page.keyboard.up(key);
        held.delete(key);
      }
    }
    for (const key of wanted) {
      if (!held.has(key)) {
        await page.keyboard.down(key);
        held.add(key);
      }
    }
  }

  function record(goal, value, mode, target, force = false) {
    const elapsed = Number(value.elapsed);
    if (!force && elapsed - lastTrace < 0.5 && mode === previousMode) return;
    trace.push({
      lane,
      goal,
      mode,
      inputs: [...held],
      tapInputs: mode === "tap pulse" ? ["Space"] : [],
      target,
      ...value,
    });
    lastTrace = elapsed;
    previousMode = mode;
  }

  async function waitFor(predicate, description, seconds = 20) {
    const deadline = Date.now() + seconds * 1000;
    while (Date.now() < deadline) {
      const value = await state();
      if (predicate(value)) return value;
      record(description, value, value.attachmentId ? "automatic ride" : "coast");
      await page.waitForTimeout(40);
    }
    throw new Error(`Timed out: ${description}; ${JSON.stringify(await state())}`);
  }

  async function steerTo(
    x,
    {
      y,
      seconds = 35,
      tolerance = 35,
      verticalTolerance = 45,
      pulse = true,
      resolve,
      thrust = false,
      stopWhen,
      goal = `navigate to ${x},${y}`,
    } = {},
  ) {
    const deadline = Date.now() + seconds * 1000;
    const initial = await state();
    record(goal, initial, "begin", { x, y }, true);
    while (Date.now() < deadline) {
      const value = await state();
      if (stopWhen?.(value)) {
        await keys();
        record(goal, value, "complete", { x, y }, true);
        return value;
      }
      if (value.stage !== initial.stage || value.phase === "transition") {
        await keys();
        throw new Error(`Unexpected stage change during ${goal}: ${JSON.stringify(value)}`);
      }
      const px = Number(value.playerX) + 15;
      const py = Number(value.playerY) + 15;
      const vx = Number(value.playerVx);
      const vy = Number(value.playerVy);
      const leg = resolve?.(value) ?? { x, y, pulse };
      const target = leg.x - px;
      // Opposing input actively brakes approaching momentum. Release near a calm target.
      const want = target - vx * 0.28;
      const upward = leg.y !== undefined && py > leg.y + 35;
      if (value.attachmentId) {
        await keys();
        record(goal, value, "automatic ride", leg);
      } else {
        await keys(
          ...(want > 10 ? ["ArrowRight"] : want < -10 ? ["ArrowLeft"] : []),
          ...(thrust && upward ? ["Space"] : []),
        );
        let mode = held.size ? "steer" : "coast";
        if (leg.pulse && !thrust && upward && vy > -65 && Date.now() - lastPulse > 500) {
          await page.keyboard.press("Space");
          lastPulse = Date.now();
          mode = "tap pulse";
        }
        record(goal, value, mode, leg);
      }
      if (
        !stopWhen &&
        Math.abs(target) < tolerance &&
        (leg.y === undefined || Math.abs(py - leg.y) < verticalTolerance)
      ) {
        await keys();
        record(goal, value, "complete", { x, y }, true);
        return value;
      }
      await page.waitForTimeout(40);
    }
    await keys();
    throw new Error(`Cannot ${goal}; ${JSON.stringify(await state())}`);
  }

  return {
    state,
    keys,
    waitFor,
    steerTo,
    record,
    setLane: (value) => {
      lane = value;
    },
  };
}
