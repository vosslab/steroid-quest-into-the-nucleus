import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

// Selector contract: src/app.tsx:100,110,120,129,137-142 provides the title,
// fragment label, named canvas, and visible Start/Pause/Resume/Retry controls.
// src/runtime.ts:61-77 publishes read-only simulation observations for canvas
// behavior that accessible roles cannot describe. No test changes game state.

async function renderedFrames(page: Page, count = 15): Promise<void> {
  await page.evaluate(async (frames): Promise<void> => {
    for (let frame = 0; frame < frames; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
  }, count);
}

async function numberAttribute(canvas: Locator, name: string): Promise<number> {
  const value = await canvas.getAttribute(`data-${name}`);
  expect(value, `Canvas observation data-${name} must exist`).not.toBeNull();
  return Number(value);
}

async function expectSingleLoop(page: Page): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute("data-test-pending-animation-frames", "1");
}

async function observeAnimationFrames(page: Page): Promise<void> {
  await page.addInitScript((): void => {
    const requestFrame = window.requestAnimationFrame.bind(window);
    const cancelFrame = window.cancelAnimationFrame.bind(window);
    const pending = new Set<number>();
    function publishPending(): void {
      document.documentElement?.setAttribute(
        "data-test-pending-animation-frames",
        String(pending.size),
      );
    }
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      const id = requestFrame((timestamp): void => {
        pending.delete(id);
        publishPending();
        callback(timestamp);
      });
      pending.add(id);
      publishPending();
      return id;
    };
    window.cancelAnimationFrame = (id: number): void => {
      cancelFrame(id);
      pending.delete(id);
      publishPending();
    };
    document.addEventListener("DOMContentLoaded", publishPending, { once: true });
  });
}

async function start(page: Page, observeLoop = false): Promise<Locator> {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Steroid Quest", exact: true })).toBeVisible();
  if (observeLoop) await expectSingleLoop(page);
  await page.getByRole("button", { name: "Start adventure", exact: true }).click();
  const canvas = page.getByLabel(/^Steroid Quest game world\./);
  await expect(canvas).toBeFocused();
  await expect(canvas).toHaveAttribute("data-phase", "playing");
  await expect(canvas).toHaveAttribute("data-player-vx", /-?\d+\.\d+/);
  await expect(canvas).toHaveAttribute("data-player-vy", /-?\d+\.\d+/);
  await expect(canvas).toHaveAttribute("data-attachment-id", "");
  await expect(canvas).toHaveAttribute("data-attachment-kind", "");
  await expect(canvas).toHaveAttribute("data-encounter-phases", /\{.*\}/);
  await expect(canvas).toHaveAttribute("data-checkpoint-order", /\d+/);
  if (observeLoop) await expectSingleLoop(page);
  return canvas;
}

async function expectFrozen(page: Page, canvas: Locator): Promise<void> {
  const position = await canvas.getAttribute("data-player-x");
  const elapsed = await canvas.getAttribute("data-elapsed");
  await renderedFrames(page);
  await expect(canvas).toHaveAttribute("data-player-x", position ?? "");
  await expect(canvas).toHaveAttribute("data-elapsed", elapsed ?? "");
}

test("movement, pause menus, and retry preserve the mounted world and HUD", async ({
  page,
}): Promise<void> => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // Count browser scheduling directly; canvas identity alone cannot detect duplicate loops.
  // Assertions run after renderedFrames finishes, so its temporary RAF is excluded.
  await observeAnimationFrames(page);
  const canvas = await start(page, true);
  const originalCanvas = await canvas.elementHandle();
  const spawnX = await numberAttribute(canvas, "player-x");
  const fragments = await canvas.getAttribute("data-collected");
  const stage = await canvas.getAttribute("data-stage");
  await expect(page.getByLabel(/\d+ of \d+ fragments collected/)).toBeVisible();

  await page.keyboard.down("ArrowRight");
  await expect.poll(() => numberAttribute(canvas, "player-x")).toBeGreaterThan(spawnX);
  await page.keyboard.up("ArrowRight");
  await page.keyboard.press("Escape");
  const paused = page.getByRole("dialog", { name: "Journey paused" });
  await expect(paused).toBeVisible();
  const resume = paused.getByRole("button", { name: "Resume", exact: true });
  await expect(resume).toBeFocused();
  await expect(canvas).toHaveAttribute("data-phase", "paused");
  await expectFrozen(page, canvas);
  await expectSingleLoop(page);
  await page.keyboard.press("Shift+Tab");
  await expect(paused.getByRole("button", { name: /^Sound/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(resume).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(paused).not.toBeVisible();
  await expect(canvas).toBeFocused();
  await expectSingleLoop(page);

  // Repeat through pointer controls: UI changes must keep one authoritative world.
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(paused).toBeVisible();
  await expectFrozen(page, canvas);
  await expectSingleLoop(page);
  await resume.click();
  await expect(canvas).toBeFocused();
  await expectSingleLoop(page);
  await page.keyboard.press("r");
  await expect(canvas).toHaveAttribute("data-phase", "playing");
  await expect.poll(() => numberAttribute(canvas, "player-x")).toBe(spawnX);
  await expectSingleLoop(page);
  await expect(canvas).toHaveAttribute("data-stage", stage ?? "");
  await expect(canvas).toHaveAttribute("data-collected", fragments ?? "");
  await expect(
    page.getByLabel(new RegExp(`^${fragments} of \\d+ fragments collected$`)),
  ).toBeVisible();
  expect(await canvas.evaluate((element, original) => element === original, originalCanvas)).toBe(
    true,
  );
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("losing keyboard focus pauses and clears held movement before resume", async ({
  page,
}): Promise<void> => {
  const canvas = await start(page);
  const spawnX = await numberAttribute(canvas, "player-x");
  await page.keyboard.down("ArrowRight");
  await expect.poll(() => numberAttribute(canvas, "player-x")).toBeGreaterThan(spawnX);
  // Tab is a real user focus change; Arrow Right intentionally stays held across resume.
  await page.keyboard.press("Tab");
  await expect(page.getByRole("dialog", { name: "Journey paused" })).toBeVisible();
  await expect(canvas).toHaveAttribute("data-phase", "paused");
  await expectFrozen(page, canvas);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(canvas).toBeFocused();
  // Fluid drag preserves momentum briefly, so verify that released steering slows it instead
  // of assuming a platforming-style immediate stop.
  const releasedVelocity = Math.abs(await numberAttribute(canvas, "player-vx"));
  await renderedFrames(page, 30);
  await expect
    .poll(async () => Math.abs(await numberAttribute(canvas, "player-vx")))
    .toBeLessThan(releasedVelocity);
  await page.keyboard.up("ArrowRight");
  await page.keyboard.down("ArrowLeft");
  await expect.poll(() => numberAttribute(canvas, "player-vx")).toBeLessThan(0);
  await page.keyboard.up("ArrowLeft");
});
