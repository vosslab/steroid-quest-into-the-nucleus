import { PLAYER_HEIGHT, PLAYER_WIDTH } from "../constants";
import { overlaps } from "../physics";
import { surpriseGeometry } from "./surprise_patterns";
import type { SurpriseGeometry } from "../types/sections";
import type { Platform, Rect, StageId } from "../types/level";
import type {
  BounceSection,
  CompiledSections,
  SectionSpec,
  TerraceSection,
  TunnelSection,
} from "../types/sections";

function requireNumber(value: number, name: string, positive = false): void {
  if (!Number.isFinite(value) || (positive ? value <= 0 : value < 0)) {
    throw new Error(`${name} must be finite and ${positive ? "positive" : "nonnegative"}.`);
  }
}

function requireRect(rect: Rect, name: string): void {
  requireNumber(rect.x, `${name}.x`);
  requireNumber(rect.y, `${name}.y`);
  requireNumber(rect.width, `${name}.width`, true);
  requireNumber(rect.height, `${name}.height`, true);
}

function sectionWidth(section: SectionSpec): number {
  if (section.kind !== "terraces") return section.width;
  return section.route.reduce((width, terrace) => width + terrace.gap + terrace.width, 0);
}

function tunnelPlatforms(section: TunnelSection, prefix: string): Platform[] {
  const lumen = section.floor - section.ceiling;
  if (lumen < PLAYER_HEIGHT + 80) throw new Error(`${prefix}: tunnel lumen is too narrow.`);
  const platforms: Platform[] = [
    {
      id: `${prefix}-floor`,
      x: 0,
      y: section.floor,
      width: section.width,
      height: 200,
      kind: "solid",
      material: "gel",
    },
    {
      id: `${prefix}-roof`,
      x: 0,
      y: section.ceiling - 40,
      width: section.width,
      height: 40,
      kind: "solid",
      material: section.material,
    },
  ];
  let previousEnd = 0;
  for (const [index, baffle] of section.baffles.entries()) {
    requireNumber(baffle.x, `${prefix} baffle x`);
    requireNumber(baffle.width, `${prefix} baffle width`, true);
    requireNumber(baffle.depth, `${prefix} baffle depth`, true);
    if (baffle.x - previousEnd < 150 || baffle.x + baffle.width > section.width - 150) {
      throw new Error(`${prefix}: baffles need 150 units of approach and recovery space.`);
    }
    if (lumen - baffle.depth < PLAYER_HEIGHT + 50) {
      throw new Error(`${prefix}: a baffle leaves insufficient body clearance.`);
    }
    // The normal jump rises about 105 units; 65 leaves a forgiving running margin.
    if (baffle.side === "lower" && baffle.depth > 65) {
      throw new Error(`${prefix}: a lower baffle exceeds the unbound jump allowance.`);
    }
    platforms.push({
      id: `${prefix}-baffle-${index}`,
      x: baffle.x,
      y: baffle.side === "lower" ? section.floor - baffle.depth : section.ceiling,
      width: baffle.width,
      height: baffle.depth,
      kind: "solid",
      material: baffle.material,
    });
    previousEnd = baffle.x + baffle.width;
  }
  return platforms;
}

function terracePlatforms(section: TerraceSection, prefix: string): Platform[] {
  if (section.route.length === 0) throw new Error(`${prefix}: terraces need a route.`);
  const platforms: Platform[] = [];
  let x = 0;
  for (const [index, terrace] of section.route.entries()) {
    requireNumber(terrace.gap, `${prefix} terrace gap`);
    requireNumber(terrace.floor, `${prefix} terrace floor`, true);
    requireNumber(terrace.width, `${prefix} terrace width`, true);
    x += terrace.gap;
    platforms.push({
      id: `${prefix}-route-${index}`,
      x,
      y: terrace.floor,
      width: terrace.width,
      height: 30,
      kind: "oneway",
      material: section.material,
    });
    x += terrace.width;
  }
  for (const [index, vesicle] of (section.vesicles ?? []).entries()) {
    requireNumber(vesicle.distance, `${prefix} vesicle distance`);
    requireNumber(vesicle.period, `${prefix} vesicle period`, true);
    platforms.push({
      id: `${prefix}-vesicle-${index}`,
      x: vesicle.x,
      y: vesicle.floor,
      width: vesicle.width,
      height: 22,
      kind: "oneway",
      motion: { axis: vesicle.axis, distance: vesicle.distance, period: vesicle.period },
    });
  }
  return platforms;
}

function bouncePlatforms(section: BounceSection, prefix: string): Platform[] {
  const gap = section.landingX - section.springX - section.springWidth;
  if (section.landingRise < 115 || section.landingRise > 150 || gap < 20 || gap > 80) {
    throw new Error(`${prefix}: bounce landing needs a 115-150 rise and 20-80 approach gap.`);
  }
  if (section.landingX + section.landingWidth > section.width - 280) {
    throw new Error(`${prefix}: bounce landing needs a broad descending exit.`);
  }
  if (
    section.launch &&
    (!Number.isFinite(section.launch.x) ||
      !Number.isFinite(section.launch.y) ||
      section.launch.y >= 0)
  ) {
    throw new Error(`${prefix}: a spring launch must be finite and point upward.`);
  }
  return [
    {
      id: `${prefix}-floor-before`,
      x: 0,
      y: section.floor,
      width: section.springX,
      height: 200,
      kind: "solid",
      material: "gel",
    },
    {
      id: `${prefix}-floor-after`,
      x: section.springX + section.springWidth,
      y: section.floor,
      width: section.width - section.springX - section.springWidth,
      height: 200,
      kind: "solid",
      material: "gel",
    },
    {
      id: `${prefix}-spring`,
      x: section.springX,
      y: section.floor,
      width: section.springWidth,
      height: 15,
      kind: "bounce",
      launch: section.launch,
    },
    {
      id: `${prefix}-landing`,
      x: section.landingX,
      y: section.floor - section.landingRise,
      width: section.landingWidth,
      height: section.landingRise,
      kind: "solid",
      material: section.material,
    },
    {
      id: `${prefix}-descent`,
      x: section.landingX + section.landingWidth,
      y: section.floor - 60,
      width: 180,
      height: 60,
      kind: "solid",
      material: "gel",
    },
  ];
}

function localGeometry(section: SectionSpec, prefix: string): SurpriseGeometry {
  let platforms: Platform[];
  switch (section.kind) {
    case "tunnel":
      platforms = tunnelPlatforms(section, prefix);
      break;
    case "terraces":
      platforms = terracePlatforms(section, prefix);
      break;
    case "bounce_chamber":
      platforms = bouncePlatforms(section, prefix);
      break;
    case "ribosome_bridge":
    case "organelle_pinball":
    case "vesicle_express":
    case "orbit_chamber":
    case "low_gravity_shaft":
      return surpriseGeometry(section, prefix);
    default: {
      const unreachable: never = section;
      throw new Error(String(unreachable));
    }
  }
  return {
    platforms,
    flowZones: [],
    collectibles: [],
    decorations: [],
    checkpoints: section.checkpoints,
  };
}

function platformEnvelope(platform: Platform): Rect {
  const motion = platform.motion;
  const radiusX =
    motion?.kind === "orbit" ? motion.radiusX : motion?.axis === "x" ? motion.distance : 0;
  const radiusY =
    motion?.kind === "orbit" ? motion.radiusY : motion?.axis === "y" ? motion.distance : 0;
  return {
    x: platform.x - radiusX,
    y: platform.y - radiusY,
    width: platform.width + radiusX * 2,
    height: platform.height + radiusY * 2,
  };
}

/** Motion envelopes are checked even when the authored starting rectangle fits. */
function validatePlatform(platform: Platform, width: number): void {
  requireRect(platform, platform.id);
  let radiusX = 0;
  let radiusY = 0;
  if (platform.motion) {
    const motion = platform.motion;
    requireNumber(motion.period, `${platform.id} period`, true);
    if (motion.phase !== undefined && !Number.isFinite(motion.phase)) {
      throw new Error(`${platform.id}: phase must be finite.`);
    }
    if (motion.kind === "orbit") {
      requireNumber(motion.radiusX, `${platform.id} radius x`, true);
      requireNumber(motion.radiusY, `${platform.id} radius y`, true);
      radiusX = motion.radiusX;
      radiusY = motion.radiusY;
    } else {
      requireNumber(motion.distance, `${platform.id} distance`);
      radiusX = motion.axis === "x" ? motion.distance : 0;
      radiusY = motion.axis === "y" ? motion.distance : 0;
    }
  }
  if (
    platform.x - radiusX < 0 ||
    platform.x + radiusX + platform.width > width ||
    platform.y - radiusY < 0
  ) {
    throw new Error(`${platform.id} motion envelope leaves its section.`);
  }
  if (platform.crumble) {
    requireNumber(platform.crumble.delay, `${platform.id} crumble delay`, true);
    requireNumber(platform.crumble.reformAfter, `${platform.id} reform time`, true);
  }
}

/** Validate safe static recovery geometry; traversal still needs controls-only play evidence. */
function validateRecovery(
  section: SectionSpec,
  platforms: readonly Platform[],
  prefix: string,
  geometry: SurpriseGeometry,
): void {
  for (const point of geometry.checkpoints) {
    requireNumber(point.x, `${prefix} checkpoint x`);
    requireNumber(point.floor, `${prefix} checkpoint floor`, true);
    const body = {
      x: point.x + 10,
      y: point.floor - PLAYER_HEIGHT,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };
    const support = platforms.some(
      (platform) =>
        !platform.motion &&
        !platform.crumble &&
        platform.kind !== "bounce" &&
        platform.y === point.floor &&
        body.x >= platform.x &&
        body.x + body.width <= platform.x + platform.width,
    );
    if (!support || platforms.some((platform) => overlaps(body, platformEnvelope(platform)))) {
      throw new Error(`${prefix}: checkpoint needs clear stationary support.`);
    }
    if (
      (section.hazards ?? []).some((hazard) =>
        overlaps(
          {
            x: body.x - 60,
            y: body.y - 30,
            width: body.width + 120,
            height: body.height + 60,
          },
          hazard,
        ),
      )
    ) {
      throw new Error(`${prefix}: checkpoint recovery is too close to a hazard.`);
    }
    if (
      [...geometry.flowZones, ...(section.flowZones ?? [])].some((field) => overlaps(body, field))
    ) {
      throw new Error(`${prefix}: checkpoint must recover outside currents.`);
    }
  }
}

/** Deterministic lowering keeps the existing LevelDefinition and simulation authoritative. */
export function compileSections(
  stage: StageId,
  sections: readonly SectionSpec[],
): CompiledSections {
  const compiled: CompiledSections = {
    width: 0,
    platforms: [],
    flowZones: [],
    hazards: [],
    checkpoints: [],
    collectibles: [],
    decorations: [],
    triggers: [],
  };
  const ids = new Set<string>();
  for (const section of sections) {
    if (!/^[a-z][a-z0-9_]*$/.test(section.id) || ids.has(section.id)) {
      throw new Error(`Invalid or repeated section ID: ${section.id}`);
    }
    ids.add(section.id);
    const prefix = `${stage}-${section.id}`;
    const width = sectionWidth(section);
    requireNumber(width, `${prefix} width`, true);
    const offset = compiled.width;
    const geometry = localGeometry(section, prefix);
    const platforms = geometry.platforms;
    for (const platform of platforms) {
      validatePlatform(platform, width);
    }
    for (const field of geometry.flowZones) {
      requireRect(field, field.id);
      if (field.x + field.width > width) throw new Error(`${field.id} leaves its section.`);
      if (field.gravityScale !== undefined)
        requireNumber(field.gravityScale, `${field.id} gravity scale`);
      if (field.drag !== undefined) requireNumber(field.drag, `${field.id} drag`);
      if (!Number.isFinite(field.acceleration.x) || !Number.isFinite(field.acceleration.y)) {
        throw new Error(`${field.id} acceleration must be finite.`);
      }
    }
    for (const item of geometry.collectibles) {
      requireNumber(item.x, `${item.id} x`);
      requireNumber(item.y, `${item.id} y`);
      if (item.x > width) throw new Error(`${item.id} leaves its section.`);
    }
    for (const item of geometry.decorations) {
      requireRect(item, `${prefix} generated decoration`);
      if (item.x + item.width > width) throw new Error(`${prefix} decoration leaves its section.`);
    }
    validateRecovery(section, platforms, prefix, geometry);
    compiled.platforms.push(
      ...platforms.map((platform) => ({ ...platform, x: platform.x + offset })),
    );
    for (const [index, point] of geometry.checkpoints.entries()) {
      compiled.checkpoints.push({
        id: `${prefix}-checkpoint-${index}`,
        x: offset + point.x,
        y: point.floor - 85,
        width: 65,
        height: 85,
        spawn: { x: offset + point.x + 10, y: point.floor - PLAYER_HEIGHT },
      });
    }
    for (const [index, hazard] of (section.hazards ?? []).entries()) {
      requireRect(hazard, `${prefix} hazard ${index}`);
      if (hazard.x + hazard.width > width) throw new Error(`${prefix}: hazard leaves its section.`);
      compiled.hazards.push({ ...hazard, id: `${prefix}-hazard-${index}`, x: hazard.x + offset });
    }
    compiled.flowZones.push(
      ...geometry.flowZones.map((field) => ({ ...field, x: field.x + offset })),
    );
    compiled.collectibles.push(
      ...geometry.collectibles.map((item) => ({ ...item, x: item.x + offset })),
    );
    compiled.decorations.push(
      ...geometry.decorations.map((item) => ({ ...item, x: item.x + offset })),
    );
    for (const [index, field] of (section.flowZones ?? []).entries()) {
      requireRect(field, `${prefix} current ${index}`);
      if (field.gravityScale !== undefined)
        requireNumber(field.gravityScale, `${prefix} gravity scale`);
      if (field.drag !== undefined) requireNumber(field.drag, `${prefix} drag`);
      if (
        !Number.isFinite(field.acceleration.x) ||
        !Number.isFinite(field.acceleration.y) ||
        field.x + field.width > width
      ) {
        throw new Error(`${prefix}: current must be finite and remain in its section.`);
      }
      compiled.flowZones.push({ ...field, id: `${prefix}-current-${index}`, x: field.x + offset });
    }
    for (const [index, item] of (section.collectibles ?? []).entries()) {
      requireNumber(item.x, `${prefix} collectible x`);
      requireNumber(item.y, `${prefix} collectible y`);
      if (item.x > width) throw new Error(`${prefix}: collectible leaves its section.`);
      compiled.collectibles.push({ ...item, id: `${prefix}-spark-${index}`, x: item.x + offset });
    }
    for (const decoration of section.decorations ?? []) {
      requireRect(decoration, `${prefix} decoration`);
      if (decoration.x + decoration.width > width)
        throw new Error(`${prefix} decoration leaves its section.`);
      compiled.decorations.push({ ...decoration, x: decoration.x + offset });
    }
    compiled.triggers.push({
      id: `${prefix}-caption`,
      kind: "caption",
      x: offset + 80,
      y: 0,
      width: 50,
      height: 1100,
      caption: section.caption,
    });
    compiled.width += width;
  }
  return compiled;
}
