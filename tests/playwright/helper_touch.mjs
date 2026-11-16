// Chromium CDP sends real browser touch events; gameplay state is observed, never written.
export async function createTouchControls(page) {
  const session = await page.context().newCDPSession(page);
  const points = new Map();
  let direction = "";
  let origin;
  async function send(type, id) {
    await session.send("Input.dispatchTouchEvent", {
      type,
      // Chromium 156 dispatches changed contacts, including the lifted contact on touchEnd.
      touchPoints: [points.get(id)],
    });
  }
  async function center(name) {
    const box = await page.getByRole("button", { name, exact: true }).boundingBox();
    if (!box) throw new Error(`Touch control unavailable: ${name}`);
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  }
  async function steer(next) {
    if (next === direction) return;
    if (!next) {
      await send("touchEnd", 1);
      points.delete(1);
    } else {
      if (!direction) {
        origin = await center("Direction pad: drag to steer");
        points.set(1, { id: 1, ...origin });
        await send("touchStart", 1);
      }
      points.set(1, {
        id: 1,
        x: origin.x + (next.includes("Right") ? 30 : next.includes("Left") ? -30 : 0),
        y: origin.y + (next.includes("Down") ? 30 : next.includes("Up") ? -30 : 0),
      });
      await send("touchMove", 1);
    }
    direction = next;
  }
  return {
    async down(key) {
      if (key === "Space") {
        points.set(2, { id: 2, ...(await center("Pulse: tap or hold to rise")) });
        await send("touchStart", 2);
      } else await steer([direction, key].filter(Boolean).join(" "));
    },
    async up(key) {
      if (key === "Space") {
        await send("touchEnd", 2);
        points.delete(2);
      } else
        await steer(
          direction
            .split(" ")
            .filter((held) => held !== key)
            .join(" "),
        );
    },
    async press(key) {
      if (key === "Space") {
        await this.down(key);
        await this.up(key);
      } else if (key.toLowerCase() === "r") {
        await this.press("Escape");
        await page.getByRole("button", { name: "Retry checkpoint", exact: true }).tap();
      } else if (key === "Escape") {
        const paused = (await page.locator("canvas").getAttribute("data-phase")) === "paused";
        await page.getByRole("button", { name: paused ? "Resume" : "Pause", exact: true }).tap();
      } else throw new Error(`Unsupported touch control: ${key}`);
    },
  };
}
