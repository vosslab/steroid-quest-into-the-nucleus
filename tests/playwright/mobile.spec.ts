import { expect, test } from "@playwright/test";

// app.tsx owns the named touch controls, Pause/Resume menu and rotate heading;
// runtime.ts exposes read-only canvas phase/velocity/elapsed observations.
test.use({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });

test("touch steering, cancellation and portrait pause keep one canvas and explicit resume", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start adventure", exact: true }).tap();
  const canvas = page.locator("canvas");
  const original = await canvas.elementHandle();
  await expect(canvas).toHaveAttribute("data-phase", "playing");
  const pad = page.getByRole("button", { name: "Direction pad: drag to steer", exact: true });
  const pulse = page.getByRole("button", { name: "Pulse: tap or hold to rise", exact: true });
  const box = await pad.boundingBox();
  if (!box) throw new Error("Direction pad must be visible");
  const session = await page.context().newCDPSession(page);
  const point = { id: 1, x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ ...point, x: point.x + 30 }],
  });
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-vx")))
    .toBeGreaterThan(20);
  await expect(canvas).toBeFocused();
  await session.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
  await pulse.tap();
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-vy")))
    .toBeLessThan(0);
  await page.getByRole("button", { name: "Pause", exact: true }).tap();
  await expect(canvas).toHaveAttribute("data-phase", "paused");
  await page.getByRole("button", { name: "Retry checkpoint", exact: true }).tap();
  await expect(canvas).toHaveAttribute("data-phase", "playing");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("heading", { name: "Rotate to landscape", exact: true }),
  ).toBeVisible();
  await expect(canvas).toHaveAttribute("data-phase", "paused");
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Retry checkpoint", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Retry checkpoint", exact: true }).tap();
  await expect(canvas).toHaveAttribute("data-phase", "paused");
  await expect(page.getByRole("button", { name: "Retry checkpoint", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(canvas).toHaveAttribute("data-phase", "paused");
  await expect(page.getByRole("button", { name: "Retry checkpoint", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Sound on", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Retry checkpoint", exact: true })).toBeFocused();
  const frozen = await canvas.getAttribute("data-elapsed");
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await expect(canvas).toHaveAttribute("data-phase", "paused");
  await expect(canvas).toHaveAttribute("data-elapsed", frozen ?? "");
  await page.getByRole("button", { name: "Resume", exact: true }).tap();
  await expect(canvas).toHaveAttribute("data-phase", "playing");
  expect(await original?.evaluate((element) => element === document.querySelector("canvas"))).toBe(
    true,
  );
  await expect
    .poll(async () =>
      page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight),
    )
    .toBe(true);
  const world = await canvas.boundingBox();
  const pulseBox = await pulse.boundingBox();
  expect(world && pulseBox && world.x + world.width <= pulseBox.x).toBeTruthy();
});
