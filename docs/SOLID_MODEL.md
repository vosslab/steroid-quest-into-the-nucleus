# Solid and runtime model

## State ownership

[src/simulation.ts](../src/simulation.ts) owns authoritative session state and progression.
The fixed-step controller handles player motion, collisions, triggers, checkpoints, retries,
receptor binding, HRE docking, and recruitment. Level definitions own authored geometry and
objectives. Rendering geometry is separate from collision bounds.
Optional platform materials clip membrane, mitochondrion, reticulum, or gel artwork to solid
collision rectangles. Materials change presentation only; authored empty corridors and the
rectangle controller determine where the player can move.

[src/types/sections.ts](../src/types/sections.ts) defines local tunnel, terrace, and bounce-chamber
specifications plus five semantic surprise recipes. [src/levels/surprise_patterns.ts](../src/levels/surprise_patterns.ts)
generates their local geometry. [src/levels/section_specs.ts](../src/levels/section_specs.ts) compiles them into
stage-prefixed collision geometry and content arrays. Levels remain the source of truth;
[LEVEL_DESIGN.md](LEVEL_DESIGN.md) explains authoring and recovery checks.

Explicit `flowZones` add acceleration only while the player overlaps their rectangles. The
simulation sums overlapping fields before bounding velocity; movement input still opposes a
current. Holding the travel direction lets speed above normal running speed relax gradually;
opposite input applies the normal stronger steering. Leaving a field stops its acceleration
while preserving ordinary momentum. Bounce
platforms may supply a `launch` velocity; top contact sets that velocity and emits a `bounce`
event. Without an explicit launch, the existing upward bounce remains. Retry recreates the
player with cleared velocity, and pause stops the fixed-step interactions. Keep checkpoint
spawns outside fields and on stationary support. Currents and launches are arcade abstractions.

Fields may also scale gravity and apply drag. Overlapping gravity multipliers use the minimum
with the normal value of 1; drag values add and multiply velocity by `exp(-drag * dt)`. Leaving
restores ordinary physics while preserving momentum. These temporary traversal rules remain
fixed-step simulation behavior.

Platforms use linear or orbit motion with axis-aligned collision bounds. Orbit periods use
seconds and phases use turns; authored x/y locate the orbit center of the top-left corner.
Contact-armed crumble state belongs to the simulation's `crumbleStates` map: first top contact
starts the delay, leaving keeps the countdown, and collapsed platforms stop colliding.
Restoration waits through `reformAfter` and then for player clearance. Retry, stage changes,
and Replay clear this map; pause freezes timers. Retry preserves the stage's motion phase.
The renderer reads collapse state and motion without advancing either. Armed tiles keep a solid
collision lip; collapsed tiles show an empty dashed outline. Orbit bodies decorate translating
rectangles, while field rings and mesh identify current and gravity boundaries in both motion modes.

[src/app.tsx](../src/app.tsx) uses scalar Solid signals for the current phase, stage, fragment
tally, ability, checkpoint, recruitment count, captions, sound setting, and ending time.
Gameplay events update those signals in a batch; the UI does not wrap simulation state in a
reactive store or advance physics. Button actions enter through the runtime command interface.
Canvas data attributes are read-only observations for browser tests; gameplay never reads them.

The runtime sends simulation events to rendering and sound. The renderer uses a bounded queue
for launch ripples and recruitment assembly effects, clearing transient effects on stage changes
and Replay. Effect ages use simulation elapsed time so pause freezes them. Reduced motion uses
static directional cues and settled molecular tableaux while required platform motion remains
playable. Successful recruitment advances polymerase and grows one connected RNA backbone. Payoff
particle phases use simulation elapsed time, which advances during recruitment and freezes on
pause; reduced motion shows a settled payoff. Presentation never applies forces or changes progression.

## One mounted runtime

The canvas remains mounted through title, play, pause, and ending overlays. `onMount` creates
one runtime. Signal changes and menu focus effects never recreate the canvas or animation loop.
`onCleanup` disposes the runtime and clears the caption timer.

[src/runtime.ts](../src/runtime.ts) owns one requestAnimationFrame loop and a fixed-step
accumulator. It samples input once per rendered frame and consumes a jump press only once
across catch-up steps. Resizing adjusts backing pixels and the drawing transform while the
960-by-540 logical viewport, level coordinates, and physics remain fixed.

Disposal cancels the animation frame, disconnects the ResizeObserver, removes resize and
motion-preference listeners, disposes input and rendering, and closes any created audio context.
Input disposal removes window, canvas, and document listeners and clears held keys.
[src/audio.ts](../src/audio.ts) creates synthesized sound only after an unmute gesture; sound
starts muted. Reduced-motion preference limits decorative motion without changing progression.

Algorithmic audio uses regional seeded-noise textures, synthesized plucks and tones, and evolving
motifs with movement and molecular event cues. The existing runtime frame loop schedules pulses;
audio creates no separate timer or game loop. Limit synthesis to 36 primary voices with at most
one FM oscillator per voice. Pause and mute fade-stop active and scheduled cues, including death
and stage-transition tails; focus-loss pause updates audio immediately. After the first unmute
gesture, the context remains silently running during pause/mute to avoid suspend/resume races.
Replay clears old cues, and disposal closes the context. Synthesis measurements verify output
and lifecycle behavior separately from subjective listening judgment.

## Keyboard input boundary

Under ASVS 2.2.1, [src/input.ts](../src/input.ts) accepts an explicit allowlist of
`KeyboardEvent.code` values: ArrowLeft/KeyA, ArrowRight/KeyD, Space/KeyW/ArrowUp, Escape,
and KeyR. It suppresses browser defaults only for recognized keys while the canvas owns focus.
Unrecognized keys and keys outside gameplay retain normal browser behavior.

Escape and R map to commands; repeated command keydowns are ignored. Held movement and
one-shot jump presses have distinct representations. Window blur, canvas blur, and hidden-page
visibility clear held keys and pause. Resume, retry, and replay clear input before restoring
canvas focus. Menu Tab containment and Escape handling stay in the Solid UI; menu Escape
stops propagation so the resumed canvas does not immediately pause again.

## Biological model limits

The journey illustrates a generic nuclear steroid-receptor pathway: a steroid crosses a lipid
bilayer, binds an intracellular receptor, and the complex recognizes regulatory DNA associated
with a gene. Recruitment happens near the promoter while the complex stays at the HRE.
The red steroid remains visible inside the active complex.

Intracellular receptor locations differ among hormone pathways; ligand binding can change
receptor conformation and recruit proteins that support transcription. See the primary textbook
overview, [General principles of cell communication](https://www.ncbi.nlm.nih.gov/books/NBK26813/).
The nucleus-localized receptor in this game is an authored example, not a universal location.
The continuously open pore is the chosen level route, not a universal nuclear-entry requirement.
Gravity, currents, launches, low-gravity fields, collapsing and orbiting platforms, bounce surfaces,
platform geometry, and the unlocked air jump are
arcade abstractions. Cellular scenery communicates an exaggerated physical playground; these
movement rules do not model molecular forces, transport rates, or organelle mechanics.

Binding artwork exaggerates schematic conformational adjustment of the steroid and receptor
pocket while preserving the red steroid's four-ring scaffold. This depicts accommodation during
binding, not a chemical reaction. With reduced motion, show the settled bound shape directly.
The exaggerated motion is deliberately not scale accurate. The supplied paper
[Steroid flexibility and receptor specificity](https://www.sciencedirect.com/science/article/pii/0022473180901120)
discusses particular unsaturated steroids. The illustration neither measures atomic displacement
or binding energy nor implies that all steroid ligands have equal flexibility.
