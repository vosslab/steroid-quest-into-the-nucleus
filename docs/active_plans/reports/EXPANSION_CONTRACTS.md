# Expansion contract handoff

## Result and boundary

Shared contracts are ready for the Longer cellular journeys implementation. This batch changes
only `src/types/` and this report. Consumer migration is deliberately left to the assigned owners.
The existing `encounterPhases` map remains the sole completion authority. No stored completion
counter, generic graph, runtime validator, new configuration language, or unchecked cast is added.

## Canonical contracts

- `src/types/input.ts`: `InputFrame.up` and `.down` are required held booleans.
- `src/types/level.ts`: `EncounterStep` is an explicit discriminated union with `region`, `contact`,
  `transport_capture`, `transport_delivery`, and `milestone` kinds. Biological milestone values are
  `receptor_bound` and `hre_bound`. Every step retains its caption and optional label.
- `Encounter` owns `objective`, `steps`, and optional `completionCheckpoint: EncounterCheckpoint`.
  The checkpoint contains `id`, `order`, and a calm player-top-left `spawn`.
- `LevelDefinition.requiredEncounterIds` is ordered metadata; completion is derived from phases.
  `destination` is an explicit `DestinationDefinition | undefined`; transcription uses undefined.
  Destinations have `id`, `center`, `radius`, `label`, and a motif from vesicle/nucleus/receptor/
  chromatin/gene. The next stage comes from campaign order.
- `src/types/sections.ts`: `ChamberCommon` owns `placement`, `width`, `height`, local geometry,
  objective, and `{required: true; completionCheckpoint: Point} | {required: false}`. Optional
  chambers do not need or author a completion spawn. Referenced primitives retain stable local IDs.
  `CompiledChambers` contains ordered `requiredEncounterIds`.
- `src/types/simulation.ts`: `TransitionState` has readonly `destinationId`, `elapsed`, and
  `duration`. `SimulationState.transition` is explicit undefined when inactive. `previousPhase`
  accepts transition so focus loss/pause can preserve it. Derived `EncounterProgress` contains
  `current: Encounter | undefined`, `completed`, `total`, and `ready`.
- `GameEvent` adds `{type: "destination-ready"; destinationId: string}` and
  `{type: "transition-start"; destinationId: string}` for unlock sound and runtime input clearing.
- `src/types/render.ts`: `RenderSnapshot.nextLevel` is readonly next-stage definition or undefined,
  exclusively for visual entrance preview. There is one simulation and one rendering loop.

## Authoring migration

| Old source | New source | Owning migration |
| --- | --- | --- |
| Chamber `bounds` in world coordinates | `placement`, `width`, `height`; positions local | Compiler, recipes, levels |
| Unnamed array items | Authored stable local `id` | Recipes and levels |
| `contactId` inferred from array index | Local obstacle ID, compiler-prefixed | Compiler and levels |
| Optional `region`/`contactId` step fields | Required `kind` with its matching payload | Levels, simulation, renderer |
| Pre-prefixed phase encounter reference | Local chamber ID, compiler-prefixed | Compiler and levels |
| Rectangle exit trigger | Biological destination | Levels, simulation, renderer |
| Receptor trigger checkpoint | Required milestone encounter completion checkpoint | Levels, simulation |
| Render source-only snapshot | Source plus readonly `nextLevel` definition | Runtime, renderer |

The compiler translates rect origins, point coordinates, shape centers/endpoints, paths, vortex
centers, decorations, recovery spawns, and encounter region geometry. Acceleration, impulse,
release velocity, radii, dimensions, phase ranges, and durations remain unchanged by placement.
Use `${stage}-${chamber.id}` for an encounter and append the item's local ID for referenced objects.
Reject missing local references and collisions with generated recovery/checkpoint names.
Required checkpoint order is the encounter index in `requiredEncounterIds` plus one, never the
full chamber index if optional chambers occur between required chambers.

Required completion immediately saves its authored calm spawn. Optional encounter completion
never autosaves. Exploration markers do not advance required progress or replace a later required
save. Retry/death preserve phases and opened passages; Replay resets them.

## Helper recommendations

The new pure `src/progression.ts` should expose one shared derivation:

```ts
getEncounterProgress(
  level: LevelDefinition,
  phases: ReadonlyMap<string, number>,
): EncounterProgress
```

It finds the first incomplete required encounter and derives completion/readiness from
`encounterPhases` and each encounter's step length. Simulation, runtime HUD, and renderer consume
that result. Validate required ID existence at authoring boundaries, rather than silently treating
an unresolved ID as complete. Only the current required encounter may advance; optional encounters
remain independent. Delivery steps fire only when a transport naturally reaches its endpoint,
never from Space release or interrupted capture.

Transitions use simulation time. Source level remains active until exactly one commit; capture
centers and freezes the player at the destination. Pause preserves transition state; retry clears
it and restores the latest completed encounter save. Runtime clears buffered input on
`transition-start`, without reconstructing the canvas. A full deep-readonly state migration is
outside this batch by manager decision; existing public `Readonly<SimulationState>` stays intact.

## Verification evidence

`npx tsc --noEmit -p tsconfig.json` before edits: exit 0, zero diagnostics.
The same command after edits: exit 2, 115 expected consumer diagnostics; zero under `src/types/`.
These counts describe the contract-only boundary and are not integrated acceptance.

The independent type module coherence check passes with exit 0:

```sh
npx tsc --ignoreConfig --noEmit --strict --noUncheckedIndexedAccess \
  --verbatimModuleSyntax --moduleResolution bundler --module esnext \
  --target es2020 --skipLibCheck src/types/input.ts src/types/level.ts \
  src/types/sections.ts src/types/simulation.ts src/types/render.ts src/types/runtime.ts
```

Repository strict flags are retained unchanged. `exactOptionalPropertyTypes` is not enabled in
this checkout. Types stay narrow and feature-owned; there are no new brands or type-level helpers
requiring a new permanent test suite. Prettier passes on the five edited source files.

| Consumer owner | File | Initial diagnostics | Required work |
| --- | --- | --- | --- |
| Simulation | `src/game_state.ts` | 1 | Initialize inactive transition |
| Input | `src/input.ts` | 1 | Populate held up/down |
| Level content | `src/levels/cell.ts` | 41 | Local geometry/names, explicit steps, destinations |
| Level content | `src/levels/nucleus.ts` | 20 | Same, replace biological trigger save |
| Compiler | `src/levels/section_specs.ts` | 5 | Translate local data, named references, required saves |
| Recipes | `src/levels/surprise_patterns.ts` | 29 | Local bounds, names, authoring metadata |
| Level content | `src/levels/transcription.ts` | 1 | Empty requirements and undefined destination |
| Presentation | `src/renderer.ts` | 6 | Narrow step kinds, draw destination |
| Runtime | `src/runtime.ts` | 1 | Supply readonly nextLevel |
| Simulation | `src/simulation.ts` | 10 | Idle up/down, narrow kinds, destination/required saves |

## Initial exact diagnostics

The following diagnostic snapshot is captured before consumer migration. These are expected
integration work; the manager must require a final zero-diagnostic project check.

```text
src/game_state.ts(21,3): error TS2741: Property 'transition' is missing in type '{ phase: "title"; levelIndex: number; player: PlayerState; checkpoint: { id: string; levelIndex: number; order: number; spawn: { x: number; y: number; }; }; collectedIds: Set<string>; ... 10 more ...; previousPhase: "playing"; }' but required in type 'SimulationState'.
src/input.ts(67,7): error TS2739: Type '{ left: boolean; right: boolean; pulseHeld: boolean; pulsePressed: boolean; }' is missing the following properties from type 'InputFrame': up, down
src/levels/cell.ts(13,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/cell.ts(18,7): error TS2322: Type '{ contactId: string; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ contactId: string; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
    Property 'kind' is missing in type '{ contactId: string; caption: string; }' but required in type '{ kind: "contact"; contactId: string; }'.
src/levels/cell.ts(22,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/cell.ts(27,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/cell.ts(43,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/cell.ts(60,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "circle"; center: { x: number; y: number; }; radius: number; }; material: "membrane"; response: { kind: "rebound"; restitution: number; impulse: { x: number; y: number; }; }; }' but required in type 'Obstacle'.
src/levels/cell.ts(65,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "capsule"; start: { x: number; y: number; }; end: { x: number; y: number; }; radius: number; }; response: { kind: "rebound"; restitution: number; }; }' but required in type 'Obstacle'.
src/levels/cell.ts(71,7): error TS2322: Type 'FlowZone | { x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; activeWhen: { encounterId: string; max: number; }; } | { x: number; y: number; ... 4 more ...; label: string; } | { ...; } | { ...; }' is not assignable to type 'FlowZone'.
  Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; activeWhen: { encounterId: string; max: number; }; }' is not assignable to type 'FlowZone'.
    Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; activeWhen: { encounterId: string; max: number; }; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(72,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; activeWhen: { encounterId: string; max: number; }; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; activeWhen: { encounterId: string; max: number; }; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(81,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; max: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; max: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(90,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; max: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; max: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(99,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; drag: number; activeWhen: { encounterId: string; min: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; drag: number; activeWhen: { encounterId: string; min: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(111,7): error TS2741: Property 'id' is missing in type '{ kind: "vesicle"; path: { x: number; y: number; }[]; duration: number; radius: number; wait: number; releaseVelocity: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; }; label: string; }' but required in type 'Transport'.
src/levels/cell.ts(134,20): error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'Collectible'.
  Property 'id' is missing in type '{ x: number; y: number; }' but required in type '{ id: string; }'.
src/levels/cell.ts(145,7): error TS2322: Type 'FlowZone | { x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' is not assignable to type 'FlowZone'.
    Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(146,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(157,15): error TS2322: Type '{ x: number; y: number; width: number; height: number; kind: "acid"; }' is not assignable to type 'Hazard'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; kind: "acid"; }' but required in type '{ id: string; kind: "acid"; }'.
src/levels/cell.ts(164,9): error TS2322: Type '"exit"' is not assignable to type '"receptor" | "transcription" | "hre" | "caption"'.
src/levels/cell.ts(176,7): error TS2741: Property 'destination' is missing in type '{ width: number; height: number; obstacles: Obstacle[]; flowZones: FlowZone[]; transports: Transport[]; encounters: Encounter[]; ... 11 more ...; palette: { ...; }; }' but required in type 'LevelDefinition'.
src/levels/cell.ts(195,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/cell.ts(199,7): error TS2322: Type '{ contactId: string; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ contactId: string; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
    Property 'kind' is missing in type '{ contactId: string; caption: string; }' but required in type '{ kind: "contact"; contactId: string; }'.
src/levels/cell.ts(219,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/cell.ts(236,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "circle"; center: { x: number; y: number; }; radius: number; }; material: "mitochondrion"; response: { kind: "rebound"; restitution: number; impulse: { x: number; y: number; }; }; }' but required in type 'Obstacle'.
src/levels/cell.ts(243,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(253,7): error TS2322: Type 'Transport | { kind: "vesicle"; path: { x: number; y: number; }[]; duration: number; radius: number; wait: number; releaseVelocity: { x: number; y: number; }; label: string; }' is not assignable to type 'Transport'.
  Property 'id' is missing in type '{ kind: "vesicle"; path: { x: number; y: number; }[]; duration: number; radius: number; wait: number; releaseVelocity: { x: number; y: number; }; label: string; }' but required in type 'Transport'.
src/levels/cell.ts(254,7): error TS2741: Property 'id' is missing in type '{ kind: "vesicle"; path: { x: number; y: number; }[]; duration: number; radius: number; wait: number; releaseVelocity: { x: number; y: number; }; label: string; }' but required in type 'Transport'.
src/levels/cell.ts(272,20): error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'Collectible'.
  Property 'id' is missing in type '{ x: number; y: number; }' but required in type '{ id: string; }'.
src/levels/cell.ts(281,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "capsule"; start: { x: number; y: number; }; end: { x: number; y: number; }; radius: number; }; material: "reticulum"; response: { kind: "rebound"; restitution: number; }; }' but required in type 'Obstacle'.
src/levels/cell.ts(296,9): error TS2322: Type '"exit"' is not assignable to type '"receptor" | "transcription" | "hre" | "caption"'.
src/levels/cell.ts(307,7): error TS2741: Property 'destination' is missing in type '{ width: number; height: number; obstacles: Obstacle[]; flowZones: FlowZone[]; transports: Transport[]; encounters: Encounter[]; ... 11 more ...; palette: { ...; }; }' but required in type 'LevelDefinition'.
src/levels/cell.ts(325,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/cell.ts(329,7): error TS2322: Type '{ contactId: string; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ contactId: string; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
    Property 'kind' is missing in type '{ contactId: string; caption: string; }' but required in type '{ kind: "contact"; contactId: string; }'.
src/levels/cell.ts(341,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "roundedRect"; x: number; y: number; width: number; height: number; radius: number; }; material: "membrane"; response: { kind: "rebound"; restitution: number; }; }' but required in type 'Obstacle'.
src/levels/cell.ts(346,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "roundedRect"; x: number; y: number; width: number; height: number; radius: number; }; material: "membrane"; response: { kind: "rebound"; restitution: number; }; }' but required in type 'Obstacle'.
src/levels/cell.ts(353,7): error TS2322: Type 'FlowZone | { x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; } | { x: number; y: number; width: number; height: number; acceleration: { ...; }; label: string; } | { ...; }' is not assignable to type 'FlowZone'.
  Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' is not assignable to type 'FlowZone'.
    Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(354,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(362,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(370,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/cell.ts(381,20): error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'Collectible'.
  Property 'id' is missing in type '{ x: number; y: number; }' but required in type '{ id: string; }'.
src/levels/cell.ts(391,9): error TS2322: Type '"exit"' is not assignable to type '"receptor" | "transcription" | "hre" | "caption"'.
src/levels/cell.ts(402,7): error TS2741: Property 'destination' is missing in type '{ width: number; height: number; obstacles: Obstacle[]; flowZones: FlowZone[]; transports: Transport[]; encounters: Encounter[]; ... 11 more ...; palette: { ...; }; }' but required in type 'LevelDefinition'.
src/levels/nucleus.ts(13,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/nucleus.ts(18,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/nucleus.ts(30,7): error TS2322: Type 'Obstacle | { shape: { kind: "circle"; center: { x: number; y: number; }; radius: number; }; response: { kind: "sticky"; duration: number; }; }' is not assignable to type 'Obstacle'.
  Property 'id' is missing in type '{ shape: { kind: "circle"; center: { x: number; y: number; }; radius: number; }; response: { kind: "sticky"; duration: number; }; }' but required in type 'Obstacle'.
src/levels/nucleus.ts(31,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "circle"; center: { x: number; y: number; }; radius: number; }; response: { kind: "sticky"; duration: number; }; }' but required in type 'Obstacle'.
src/levels/nucleus.ts(37,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; vortex: { center: { x: number; y: number; }; strength: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/nucleus.ts(48,20): error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'Collectible'.
  Property 'id' is missing in type '{ x: number; y: number; }' but required in type '{ id: string; }'.
src/levels/nucleus.ts(60,9): error TS2353: Object literal may only specify known properties, and 'checkpoint' does not exist in type 'Trigger'.
src/levels/nucleus.ts(64,9): error TS2322: Type '"exit"' is not assignable to type '"receptor" | "transcription" | "hre" | "caption"'.
src/levels/nucleus.ts(75,7): error TS2741: Property 'destination' is missing in type '{ width: number; height: number; obstacles: Obstacle[]; flowZones: FlowZone[]; transports: Transport[]; encounters: Encounter[]; ... 11 more ...; palette: { ...; }; }' but required in type 'LevelDefinition'.
src/levels/nucleus.ts(92,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/nucleus.ts(96,7): error TS2322: Type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' is not assignable to type 'EncounterStep'.
  Type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' is not assignable to type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
    Property 'kind' is missing in type '{ region: { x: number; y: number; width: number; height: number; }; label: string; caption: string; }' but required in type '{ kind: "region"; region: Rect; }'.
src/levels/nucleus.ts(110,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "circle"; center: { x: number; y: number; }; radius: number; }; response: { kind: "rebound"; restitution: number; }; motion: { radiusX: number; radiusY: number; period: number; }; }' but required in type 'Obstacle'.
src/levels/nucleus.ts(115,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "circle"; center: { x: number; y: number; }; radius: number; }; response: { kind: "rebound"; restitution: number; }; motion: { radiusX: number; radiusY: number; period: number; phase: number; }; }' but required in type 'Obstacle'.
src/levels/nucleus.ts(120,7): error TS2741: Property 'id' is missing in type '{ shape: { kind: "capsule"; start: { x: number; y: number; }; end: { x: number; y: number; }; radius: number; }; response: { kind: "rebound"; restitution: number; }; }' but required in type 'Obstacle'.
src/levels/nucleus.ts(131,7): error TS2322: Type 'FlowZone | { x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; }; label: string; }' is not assignable to type 'FlowZone'.
    Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/nucleus.ts(132,7): error TS2322: Type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: number; y: number; width: number; height: number; acceleration: { x: number; y: number; }; activeWhen: { encounterId: string; min: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/nucleus.ts(143,20): error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'Collectible'.
  Property 'id' is missing in type '{ x: number; y: number; }' but required in type '{ id: string; }'.
src/levels/nucleus.ts(146,7): error TS2322: Type '{ kind: "hre"; x: number; y: number; width: number; height: number; caption: string; }' is not assignable to type 'Trigger'.
  Property 'id' is missing in type '{ kind: "hre"; x: number; y: number; width: number; height: number; caption: string; }' but required in type '{ id: string; kind: "receptor" | "transcription" | "hre" | "caption"; caption?: string | undefined; activeWhen?: PhaseCondition | undefined; }'.
src/levels/nucleus.ts(154,9): error TS2322: Type '"exit"' is not assignable to type '"receptor" | "transcription" | "hre" | "caption"'.
src/levels/nucleus.ts(159,7): error TS2741: Property 'destination' is missing in type '{ width: number; height: number; obstacles: Obstacle[]; flowZones: FlowZone[]; transports: Transport[]; encounters: Encounter[]; ... 11 more ...; palette: { ...; }; }' but required in type 'LevelDefinition'.
src/levels/section_specs.ts(130,48): error TS2339: Property 'checkpoint' does not exist on type 'Trigger'.
src/levels/section_specs.ts(133,17): error TS2339: Property 'checkpoint' does not exist on type 'Trigger'.
src/levels/section_specs.ts(150,11): error TS2339: Property 'bounds' does not exist on type 'ChamberSpec'.
src/levels/section_specs.ts(197,9): error TS2741: Property 'requiredEncounterIds' is missing in type '{ width: number; height: number; obstacles: never[]; flowZones: never[]; transports: never[]; encounters: never[]; hazards: never[]; checkpoints: never[]; collectibles: never[]; decorations: never[]; triggers: never[]; }' but required in type 'CompiledChambers'.
src/levels/section_specs.ts(230,30): error TS2345: Argument of type '{ id: string; steps: readonly EncounterStep[]; }' is not assignable to parameter of type 'Encounter'.
  Property 'objective' is missing in type '{ id: string; steps: readonly EncounterStep[]; }' but required in type 'Encounter'.
src/levels/surprise_patterns.ts(9,38): error TS2344: Type '"id" | "bounds" | "entrance" | "exit" | "sequence"' does not satisfy the constraint '"checkpoint" | "width" | "height" | "id" | "obstacles" | "transports" | "hazards" | "collectibles" | "decorations" | "triggers" | "entrance" | "exit" | "sequence" | "placement" | ... 5 more ... | "kind"'.
  Type '"bounds"' is not assignable to type '"checkpoint" | "width" | "height" | "id" | "obstacles" | "transports" | "hazards" | "collectibles" | "decorations" | "triggers" | "entrance" | "exit" | "sequence" | "placement" | ... 5 more ... | "kind"'.
src/levels/surprise_patterns.ts(18,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(18,21): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(19,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(21,15): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(26,7): error TS2322: Type '{ x: any; y: any; width: number; height: number; acceleration: Point; vortex: { center: { x: any; y: any; }; strength: number; }; label: string; }' is not assignable to type 'FlowZone'.
  Property 'id' is missing in type '{ x: any; y: any; width: number; height: number; acceleration: Point; vortex: { center: { x: any; y: any; }; strength: number; }; label: string; }' but required in type '{ id: string; acceleration: Point; vortex?: { center: Point; strength: number; } | undefined; drag?: number | undefined; activeWhen?: PhaseCondition | undefined; label?: string | undefined; }'.
src/levels/surprise_patterns.ts(27,12): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(28,12): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(29,16): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(30,17): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(33,24): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(33,35): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(33,56): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(33,67): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(52,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(52,21): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(53,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(55,15): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(60,7): error TS2741: Property 'id' is missing in type '{ kind: "vesicle" | "motor"; path: readonly Point[]; duration: number; radius: number; wait: number; releaseVelocity: { x: number; y: number; }; label: string; }' but required in type 'Transport'.
src/levels/surprise_patterns.ts(79,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(79,21): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(80,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(82,15): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(87,7): error TS2741: Property 'id' is missing in type '{ shape: { radius: number; x: number; y: number; width: number; height: number; kind: "roundedRect"; }; response: { kind: "sticky"; duration: number; }; }' but required in type 'Obstacle'.
src/levels/surprise_patterns.ts(105,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(105,21): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(106,10): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(108,15): error TS18046: 'bounds' is of type 'unknown'.
src/levels/surprise_patterns.ts(113,7): error TS2741: Property 'id' is missing in type '{ kind: "channel"; path: readonly Point[]; duration: number; radius: number; wait: number; releaseVelocity: { x: number; y: number; }; label: string; }' but required in type 'Transport'.
src/levels/transcription.ts(4,14): error TS2739: Type '{ id: "transcription"; name: string; objective: string; caption: string; width: number; height: number; spawn: { x: number; y: number; }; palette: { background: string; foreground: string; accent: string; }; ... 8 more ...; decorations: ({ ...; } | ... 1 more ... | { ...; })[]; }' is missing the following properties from type 'LevelDefinition': requiredEncounterIds, destination
src/renderer.ts(310,16): error TS2339: Property 'region' does not exist on type 'EncounterStep'.
  Property 'region' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
src/renderer.ts(311,23): error TS2339: Property 'region' does not exist on type 'EncounterStep'.
  Property 'region' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
src/renderer.ts(315,12): error TS2339: Property 'region' does not exist on type 'EncounterStep'.
  Property 'region' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
src/renderer.ts(315,28): error TS2339: Property 'region' does not exist on type 'EncounterStep'.
  Property 'region' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
src/renderer.ts(316,12): error TS2339: Property 'region' does not exist on type 'EncounterStep'.
  Property 'region' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
src/renderer.ts(331,16): error TS2367: This comparison appears to be unintentional because the types '"receptor" | "transcription" | "caption"' and '"exit"' have no overlap.
src/runtime.ts(119,21): error TS2345: Argument of type '{ state: SimulationState; level: LevelDefinition; canvasWidth: number; canvasHeight: number; reducedMotion: boolean; }' is not assignable to parameter of type 'RenderSnapshot'.
  Property 'nextLevel' is missing in type '{ state: SimulationState; level: LevelDefinition; canvasWidth: number; canvasHeight: number; reducedMotion: boolean; }' but required in type 'RenderSnapshot'.
src/simulation.ts(29,7): error TS2739: Type '{ left: false; right: false; pulsePressed: false; pulseHeld: false; }' is missing the following properties from type 'InputFrame': up, down
src/simulation.ts(262,17): error TS2339: Property 'contactId' does not exist on type 'EncounterStep'.
  Property 'contactId' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "region"; region: Rect; }'.
src/simulation.ts(484,17): error TS2339: Property 'region' does not exist on type 'EncounterStep'.
  Property 'region' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
src/simulation.ts(484,73): error TS2339: Property 'region' does not exist on type 'EncounterStep'.
  Property 'region' does not exist on type '{ caption: string; label?: string | undefined; } & { kind: "contact"; contactId: string; }'.
src/simulation.ts(520,9): error TS2367: This comparison appears to be unintentional because the types '"receptor" | "hre" | "caption"' and '"exit"' have no overlap.
src/simulation.ts(525,21): error TS2339: Property 'checkpoint' does not exist on type 'Trigger'.
src/simulation.ts(525,43): error TS2339: Property 'checkpoint' does not exist on type 'Trigger'.
src/simulation.ts(529,28): error TS2339: Property 'checkpoint' does not exist on type 'Trigger'.
src/simulation.ts(530,33): error TS2339: Property 'checkpoint' does not exist on type 'Trigger'.
src/simulation.ts(545,18): error TS2367: This comparison appears to be unintentional because the types '"caption"' and '"exit"' have no overlap.
```
