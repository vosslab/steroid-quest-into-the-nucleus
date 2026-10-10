# Solid and runtime model

## State ownership

[src/simulation.ts](../src/simulation.ts) owns authoritative session state and progression.
The fixed-step controller handles fluid motion, collisions, attachments, encounter phases,
checkpoints, retries, receptor binding, HRE docking, and recruitment. Level definitions own
geometry and objectives. Decorative geometry never determines collision.

[src/types/level.ts](../src/types/level.ts) defines circular, capsule, and rounded rectangular
obstacles, local fields, transport paths, and contact/entry encounter steps. The player uses
circular collision. Steering, held thrust, local acceleration, and exponential drag apply within
the fixed step. Total speed and collision substeps are bounded. There is no global gravity,
landing state, coyote time, remembered aiming direction, or extra jump after receptor binding.

An encounter advances through authored steps. Phase conditions enable fields, transports, and
passages without per-level runtime scripts. Steps have stable local IDs and one completion source:
region entry, named surface contact, transport capture, natural transport delivery, or a biological
milestone. Premature transport release does not count as delivery. Level data supplies ordered
`requiredEncounterIds`; [src/progression.ts](../src/progression.ts) derives the current encounter,
completion count, and readiness from `encounterPhases`. There is no second completion store.

Only the current required encounter advances; optional encounters remain independent. Receptor
and HRE triggers with required milestone steps bind only while that milestone is current. Completing
a required encounter immediately saves its authored calm spawn and enables phase-controlled onward
routes. Save order follows required encounter order, independent of world position. Exploration
markers do not advance required progress or replace a completed encounter's save. Retry and death
preserve phases, fragments, milestones, and opened routes; Replay resets campaign state. Retry
clears velocity, attachment, transition capture, and transient contact effects.

Chambers use local coordinates and an explicit placement origin. The compiler translates geometry,
paths, vortex centers, encounter regions, scenery, triggers, and spawns together. Primitive IDs are
namespaced once by stage and chamber; step IDs stay local to their encounter.
[src/levels/encounter_phases.ts](../src/levels/encounter_phases.ts) resolves `phaseBefore` and
`phaseAfter` from named steps, so insertion and reordering preserve the reference's meaning.

Transport paths and moving collision shapes share geometry helpers between simulation and
rendering. Temporary attachment ends automatically or through a Space pulse or held thrust.
Release positions must clear solids and destructive hazards. Ordinary collisions redirect the
player; world boundaries never kill. Marked acid regions own destructive contact.

[src/app.tsx](../src/app.tsx) uses scalar Solid signals for phase, stage, fragments, binding,
checkpoint, recruitment, required progress, current action, destination readiness, captions, sound,
and ending time. Events update those signals in a batch; the UI never advances physics or mutates
campaign progression. Buttons use the runtime interface.
Canvas data attributes are read-only browser observations; gameplay never reads them.

[src/journey_presentation.ts](../src/journey_presentation.ts) derives one current-action cue for
the HUD, world highlight, and compass from progression and actual attachment state. Pending delivery
targets the endpoint only while attached to the required ride. Detached players receive reboarding
guidance at the channel entrance or moving cargo's current capture position. Initial cargo capture
uses that same moving position. The cue describes an action; it never advances progression.

## Destination transition ownership

The first five stages declare a biological destination with a stable ID, center, capture radius,
label, and motif. Campaign order supplies the next stage. Required encounter completion and the
biological milestones gate capture; early contact gently redirects the steroid and identifies the
unfinished objective. The renderer displays locked progress and the HUD keeps the current action
readable independently of optional captions.

Simulation capture centers the steroid and starts a one-second transition measured in simulation
time. Pause and focus loss freeze it. The simulation commits the next stage once when the duration
ends; runtime input cleanup clears buffered pulses at the transition boundary. Retry cancels the
transition and restores the saved checkpoint.

The renderer receives readonly transition state and the next level definition, drawing a zoom and
blend through the existing canvas and loop. The next-stage view runs no simulation. The source stage
remains authoritative for HUD and progress until commitment. Reduced motion uses a crossfade without
scaling, and the DNA transition retains the bound complex and docking continuity.

[src/camera.ts](../src/camera.ts) owns pure normal and transition framing. Normal framing preserves
two-axis tracking, signed velocity look-ahead, and world clamps. During zoom it interpolates the
destination's screen anchor toward the viewport center, then derives the camera offset using the
current scale. The captured steroid and destination stay in view even near world edges. Reduced
motion retains normal framing and uses only the renderer's crossfade.

## One mounted runtime

The canvas remains mounted through title, play, pause, and ending overlays. `onMount` creates
one runtime; `onCleanup` disposes it and clears the caption timer. UI updates never recreate
the canvas or animation loop.

[src/runtime.ts](../src/runtime.ts) owns one requestAnimationFrame loop and a fixed-step
accumulator. Input is sampled once per rendered frame; each Space press is consumed once across
catch-up steps. Resizing changes backing pixels and drawing transforms, preserving the logical
960-by-540 viewport and simulation coordinates. The camera follows both axes with modest signed
velocity look-ahead, including backward travel.

Disposal cancels the animation frame, disconnects the ResizeObserver, removes resize and
motion-preference listeners, disposes input and rendering, and closes any created audio context.
Input disposal removes window, canvas, and document listeners and clears held keys.

Presentation consumes simulation events and time. Pause freezes movement and effect ages.
Reduced motion simplifies particles and decorative flexing while preserving directional cues,
transport movement, and collision geometry. Recruitment assembles nearby machinery, advances
polymerase, and grows one connected RNA backbone while the complex stays docked.

## Audio lifecycle

Sound defaults to on, and the Start gesture initializes synthesized audio. A pre-start mute
choice prevents initialization. Accessible title, play, and pause toggles share one session
preference, retained by retry and Replay.

[src/audio.ts](../src/audio.ts) synthesizes regional textures and molecular event cues through
the existing runtime frame loop. Synthesis is bounded to 36 primary voices with at most one FM
oscillator per voice. Pause, focus loss, and mute stop active and scheduled cues immediately,
including death and transition tails. After initialization, the context stays silently running
during pause/mute to avoid suspend/resume races. Disposal closes it. Resource and signal checks
are separate from subjective listening judgment.

## Keyboard input boundary

[src/input.ts](../src/input.ts) accepts ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Space, Escape,
and KeyR only while the canvas owns focus. Browser defaults are suppressed only for recognized
game keys.
Menus retain normal keyboard operation and focus containment.

Optional Up/Down applies 80 units/s^2 of continuous acceleration during free movement. Opposing
arrows cancel; their force combines with currents and existing Space thrust. They add no tap
impulse, attachment release, or recruitment action. Primary Left/Right/Space movement stays intact,
and authored required routes must remain completable with those three keys alone.

A Space press is distinct from held Space. Auto-repeat never creates another pulse or submits
another recruitment attempt. Window blur, canvas blur, and hidden-page visibility clear held
keys and pause. Resume, retry, and Replay clear input before restoring canvas focus. Menu
Escape stops propagation so resuming does not immediately pause the game again.

## Biological model limits

The journey illustrates a generic nuclear steroid-receptor pathway: a steroid crosses a lipid
bilayer, binds an intracellular receptor, and the complex recognizes regulatory DNA associated
with a gene. Binding enables DNA recognition, rather than a movement ability. Recruitment occurs
near the promoter while the complex remains at the HRE; the red steroid remains visible.

Receptor locations differ among hormone pathways. The nucleus-localized receptor and continuously
open pore are authored examples, not universal entry requirements. Currents, rebounds, sticky
contacts, vesicle rides, channels, and all forces are exaggerated arcade interpretations. They
do not model molecular forces, transport rates, or organelle mechanics.

Binding artwork exaggerates schematic accommodation of the steroid and receptor pocket while
preserving the four-ring scaffold. This represents accommodation, not a chemical reaction or
measured atomic displacement. Reduced motion uses the settled bound shape directly.
