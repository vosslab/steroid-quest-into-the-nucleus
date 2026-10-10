import { shapeAt, transportPosition } from "./physics";
import { getEncounterProgress } from "./progression";
import type { EncounterStep, LevelDefinition, Point, Rect, Shape } from "./types/level";
import type { Attachment } from "./types/simulation";

export type ActionCue = { text: string; center: Point; region?: Rect };

export function shapeBounds(shape: Shape): Rect {
  if (shape.kind === "roundedRect") return shape;
  if (shape.kind === "circle") {
    return {
      x: shape.center.x - shape.radius,
      y: shape.center.y - shape.radius,
      width: shape.radius * 2,
      height: shape.radius * 2,
    };
  }
  return {
    x: Math.min(shape.start.x, shape.end.x) - shape.radius,
    y: Math.min(shape.start.y, shape.end.y) - shape.radius,
    width: Math.abs(shape.end.x - shape.start.x) + shape.radius * 2,
    height: Math.abs(shape.end.y - shape.start.y) + shape.radius * 2,
  };
}

function center(rect: Rect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

/** Action wording comes from authored gameplay labels, independently of optional captions. */
export function actionText(step: EncounterStep): string {
  if (step.label) return step.label;
  switch (step.kind) {
    case "region":
      return "Reach the marked area";
    case "contact":
      return "Touch the highlighted surface";
    case "transport_capture":
      return "Catch the marked ride";
    case "transport_delivery":
      return "Stay aboard until delivery";
    case "milestone":
      return step.milestone === "receptor_bound"
        ? "Bind the matching receptor"
        : "Dock at the matching response element";
  }
}

/** A target compass indicates direction only; level geometry owns the navigable return route. */
export function currentAction(
  level: LevelDefinition,
  phases: ReadonlyMap<string, number>,
  time: number,
  attachment: Readonly<Attachment> | undefined,
): ActionCue | undefined {
  const encounter = getEncounterProgress(level, phases).current;
  const step = encounter?.steps[phases.get(encounter.id) ?? 0];
  if (!step) return undefined;
  const text = actionText(step);
  if (step.kind === "region") return { text, center: center(step.region), region: step.region };
  if (step.kind === "contact") {
    const obstacle = level.obstacles.find((item) => item.id === step.contactId);
    if (!obstacle) return undefined;
    const region = shapeBounds(shapeAt(obstacle, time));
    return { text, center: center(region), region };
  }
  if (step.kind === "transport_capture" || step.kind === "transport_delivery") {
    const transport = level.transports.find((item) => item.id === step.transportId);
    if (!transport) return undefined;
    const aboard = attachment?.kind === "transport" && attachment.id === transport.id;
    if (step.kind === "transport_delivery" && aboard) {
      const target = transport.path[transport.path.length - 1];
      return target ? { text, center: target } : undefined;
    }
    // Capture uses the channel entrance or the cargo's current position, as in simulation.
    const target =
      transport.kind === "channel" ? transport.path[0] : transportPosition(transport, time);
    const captureText =
      step.kind === "transport_delivery" ? "Reboard the marked ride for delivery" : text;
    return target ? { text: captureText, center: target } : undefined;
  }
  const trigger = level.triggers.find((item) =>
    step.milestone === "receptor_bound" ? item.kind === "receptor" : item.kind === "hre",
  );
  return trigger ? { text, center: center(trigger), region: trigger } : undefined;
}
