import type { Platform } from "../types/level";
import type { SurpriseGeometry, SurpriseSection } from "../types/sections";

function range(value: number, minimum: number, maximum: number, name: string): void {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be within ${minimum}-${maximum}.`);
  }
}

function count(value: number, maximum: number, name: string): void {
  range(value, 1, maximum, name);
  if (!Number.isInteger(value)) throw new Error(`${name} must be an integer.`);
}

/** Safe floors make timing pressure voluntary; static ends remain outside all generated fields. */
export function surpriseGeometry(section: SurpriseSection, prefix: string): SurpriseGeometry {
  const approach = section.approachWidth ?? 220;
  const recovery = section.recoveryWidth ?? 220;
  range(approach, 180, section.width, `${prefix} approach`);
  range(recovery, 180, section.width, `${prefix} recovery`);
  range(section.floor, 400, 2000, `${prefix} floor`);
  const secretWidth = section.secret === "high_cache" ? 600 : 0;
  const start = approach;
  const end = section.width - recovery - secretWidth;
  const extent = end - start;
  range(extent, 600, 8000, `${prefix} encounter width`);
  const result: SurpriseGeometry = {
    platforms: [
      {
        id: `${prefix}-catch`,
        x: 0,
        y: section.floor,
        width: section.width,
        height: 200,
        kind: "solid",
        material: "gel",
      },
    ],
    flowZones: [],
    collectibles: [],
    decorations: [],
    checkpoints: section.checkpoints.length
      ? section.checkpoints
      : [{ x: 40, floor: section.floor }],
  };
  const ledge = (id: string, x: number, rise: number, width = 110): Platform => {
    const platform: Platform = {
      id: `${prefix}-${id}`,
      x,
      y: section.floor - rise,
      width,
      height: 20,
      kind: "oneway",
    };
    result.platforms.push(platform);
    return platform;
  };
  switch (section.kind) {
    case "ribosome_bridge": {
      range(section.bridgeRise, 60, 180, `${prefix} bridge rise`);
      count(section.count, 20, `${prefix} bridge count`);
      range(section.span, 180, extent - 320, `${prefix} span`);
      range(section.crumble.delay, 0.25, 4, `${prefix} crumble delay`);
      range(section.crumble.reformAfter, 0.5, 20, `${prefix} reform time`);
      const stride = section.span / section.count;
      range(stride, 75, 180, `${prefix} bridge stride`);
      const steps = Math.ceil(section.bridgeRise / 60);
      for (let i = 0; i < steps; i++) {
        ledge(`bridge-entry-${i}`, start + i * 70, (section.bridgeRise * (i + 1)) / steps, 100);
      }
      const bridgeX = start + 180;
      for (let i = 0; i < section.count; i++) {
        const tile = ledge(`ribosome-${i}`, bridgeX + i * stride, section.bridgeRise, stride - 15);
        tile.crumble = { ...section.crumble };
      }
      ledge("bridge-recovery", bridgeX + section.span, section.bridgeRise, 140);
      result.collectibles.push({
        id: `${prefix}-bridge-lure`,
        x: bridgeX + section.span / 2,
        y: section.floor - section.bridgeRise - 25,
      });
      result.decorations.push({
        kind: "filament",
        x: bridgeX,
        y: section.floor - section.bridgeRise + 30,
        width: section.span,
        height: 20,
      });
      break;
    }
    case "organelle_pinball": {
      count(section.bumperCount, 8, `${prefix} bumper count`);
      range(section.launch.x, 120, 380, `${prefix} launch x`);
      range(section.launch.y, -800, -620, `${prefix} launch y`);
      range(section.landingRise, 60, 120, `${prefix} landing rise`);
      const stride = extent / section.bumperCount;
      range(stride, 240, 1200, `${prefix} bumper spacing`);
      result.platforms.length = 0;
      for (let i = 0; i < section.bumperCount; i++) {
        const floorStart = i === 0 ? 0 : start + (i - 1) * stride + 60;
        const floorEnd = start + i * stride;
        result.platforms.push({
          id: `${prefix}-catch-${i}`,
          x: floorStart,
          y: section.floor,
          width: floorEnd - floorStart,
          height: 200,
          kind: "solid",
          material: "gel",
        });
        const x = start + i * stride;
        result.platforms.push({
          id: `${prefix}-bumper-${i}`,
          x,
          y: section.floor,
          width: 60,
          height: 12,
          kind: "bounce",
          material: "mitochondrion",
          launch: { ...section.launch },
        });
        ledge(`pinball-landing-${i}`, x + 110, section.landingRise, 120);
      }
      result.decorations.push({
        kind: "mitochondrion",
        x: start,
        y: section.floor - 330,
        width: extent + secretWidth,
        height: 310,
      });
      const lastEnd = start + (section.bumperCount - 1) * stride + 60;
      result.platforms.push({
        id: `${prefix}-catch-after`,
        x: lastEnd,
        y: section.floor,
        width: section.width - lastEnd,
        height: 200,
        kind: "solid",
        material: "gel",
      });
      break;
    }
    case "vesicle_express": {
      range(section.ceiling, 60, section.floor - 240, `${prefix} express ceiling`);
      range(section.acceleration.x, 350, 1000, `${prefix} express acceleration x`);
      range(section.acceleration.y, -150, 150, `${prefix} express acceleration y`);
      range(section.drag ?? 0, 0, 1.5, `${prefix} express drag`);
      result.platforms.push({
        id: `${prefix}-express-roof`,
        x: start,
        y: section.ceiling - 40,
        width: extent,
        height: 40,
        kind: "solid",
        material: "reticulum",
      });
      for (let i = 0; i < Math.floor(extent / 200); i++) {
        result.platforms.push({
          id: `${prefix}-er-fold-${i}`,
          x: start + 80 + i * 200,
          y: section.ceiling,
          width: 60,
          height: 45,
          kind: "solid",
          material: "reticulum",
        });
      }
      result.flowZones.push({
        id: `${prefix}-express-field`,
        x: start,
        y: section.ceiling,
        width: extent,
        height: section.floor - section.ceiling,
        acceleration: { ...section.acceleration },
        drag: section.drag,
      });
      for (let i = 0; i < 3; i++)
        result.decorations.push({
          kind: "vesicle",
          x: start + (extent * (i + 0.5)) / 3,
          y: section.ceiling + 30,
          width: 80,
          height: 65,
        });
      break;
    }
    case "orbit_chamber": {
      count(section.platformCount, 8, `${prefix} orbit count`);
      range(section.radiusX, 15, 80, `${prefix} orbit radius x`);
      range(section.radiusY, 15, 65, `${prefix} orbit radius y`);
      range(section.orbitRise, section.radiusY + 55, 180, `${prefix} orbit rise`);
      range(section.period, 3, 12, `${prefix} orbit period`);
      const stride = extent / section.platformCount;
      range(stride, 160 + section.radiusX * 2, 1200, `${prefix} orbit spacing`);
      for (let i = 0; i < section.platformCount; i++) {
        const x = start + stride * (i + 0.5) - 60;
        const platform = ledge(`orbiter-${i}`, x, section.orbitRise, 120);
        platform.motion = {
          kind: "orbit",
          radiusX: section.radiusX,
          radiusY: section.radiusY,
          period: section.period,
          phase: i / section.platformCount,
        };
        ledge(`orbit-step-${i}`, Math.max(start, x - section.radiusX - 65), 60, 90);
        result.decorations.push({
          kind: "vesicle",
          x,
          y: section.floor - section.orbitRise - 75,
          width: 120,
          height: 50,
        });
      }
      break;
    }
    case "low_gravity_shaft": {
      count(section.ledgeCount, 8, `${prefix} shaft ledge count`);
      range(section.gravityScale, 0.2, 0.65, `${prefix} gravity scale`);
      range(
        section.rise,
        120,
        Math.min(section.floor - 100, section.ledgeCount * 70),
        `${prefix} shaft rise`,
      );
      const stride = Math.min(110, (extent - 160) / section.ledgeCount);
      for (let i = 0; i < section.ledgeCount; i++) {
        ledge(
          `shaft-ledge-${i}`,
          start + 60 + i * stride,
          (section.rise * (i + 1)) / section.ledgeCount,
          125,
        );
      }
      result.flowZones.push({
        id: `${prefix}-shaft-field`,
        x: start,
        y: section.floor - section.rise - 60,
        width: extent,
        height: section.rise + 60,
        acceleration: { x: 0, y: 0 },
        gravityScale: section.gravityScale,
      });
      result.decorations.push({
        kind: "filament",
        x: start + 10,
        y: section.floor - section.rise,
        width: 20,
        height: section.rise,
      });
      break;
    }
  }
  // A separate static branch keeps the cache reachable without mastering the encounter.
  if (section.secret === "high_cache") {
    for (let i = 0; i < 5; i++) {
      const rise = (3 - Math.abs(2 - i)) * 60;
      const step = ledge(`cache-step-${i}`, end + 40 + i * 100, rise, 120);
      step.material =
        section.kind === "organelle_pinball"
          ? "mitochondrion"
          : section.kind === "vesicle_express"
            ? "reticulum"
            : "gel";
    }
    result.collectibles.push({
      id: `${prefix}-cache-reward`,
      x: end + 300,
      y: section.floor - 205,
    });
  }
  return result;
}
