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
passages without per-level runtime scripts. Retry preserves completed phases, fragments, and
biological milestones; Replay resets campaign state. Checkpoints have explicit progress order,
independent of world position. Returning left cannot overwrite a later checkpoint. Calm spawn
regions replace floor-supported checkpoints. Retry clears velocity, attachment, and transient
contact effects.

Transport paths and moving collision shapes share geometry helpers between simulation and
rendering. Temporary attachment ends automatically or through a Space pulse or held thrust.
Release positions must clear solids and destructive hazards. Ordinary collisions redirect the
player; world boundaries never kill. Marked acid regions own destructive contact.

[src/app.tsx](../src/app.tsx) uses scalar Solid signals for phase, stage, fragments, binding,
checkpoint, recruitment, captions, sound, and ending time. Events update those signals in a batch;
the UI never advances physics or mutates campaign progression. Buttons use the runtime interface.
Canvas data attributes are read-only browser observations; gameplay never reads them.

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

[src/input.ts](../src/input.ts) accepts ArrowLeft, ArrowRight, Space, Escape, and KeyR only
while the canvas owns focus. Browser defaults are suppressed only for recognized game keys.
Menus retain normal keyboard operation and focus containment.

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
