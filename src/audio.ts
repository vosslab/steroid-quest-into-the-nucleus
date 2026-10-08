import type { StageId } from "./types/level";
import type { GameEvent, SimulationState } from "./types/simulation";

type Voice = { source: AudioScheduledSourceNode; gain: GainNode; nodes: AudioNode[] };
type Tone = {
  frequency: number;
  duration?: number;
  amplitude?: number;
  delay?: number;
  pan?: number;
  bend?: number;
  modulation?: number;
};
const SCALE = [0, 3, 5, 7, 10];
const ROOTS: Record<StageId, number> = {
  membrane: 146.83,
  cytoplasm: 196,
  envelope: 174.61,
  receptor: 220,
  dna: 261.63,
  transcription: 293.66,
};

/** Optional procedural sound; the runtime's existing frame loop owns musical time. */
export function createAudio(): {
  setMuted(muted: boolean): void;
  play(event: GameEvent): void;
  update(state: Readonly<SimulationState>, stage: StageId): void;
  dispose(): void;
} {
  let context: AudioContext | undefined;
  let master: GainNode | undefined;
  let noise: AudioBuffer | undefined;
  let muted = true;
  let disposed = false;
  let active = false;
  let stage: StageId = "membrane";
  let nextPulse = 0;
  let pulse = 0;
  let previousVy = 0;
  let previousGrounded = true;
  let previousElapsed = 0;
  let previousPhase: SimulationState["phase"] = "title";
  let foregroundUntil = 0;
  const voices = new Set<Voice>();

  function release(voice: Voice): void {
    voices.delete(voice);
    for (const node of voice.nodes) node.disconnect();
  }

  function clearVoices(): void {
    if (!context) return;
    const now = context.currentTime;
    for (const voice of voices) {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0, now, 0.008);
      voice.source.stop(now + 0.04);
    }
    nextPulse = 0;
    foregroundUntil = 0;
  }

  function output(
    source: AudioScheduledSourceNode,
    signal: AudioNode,
    nodes: AudioNode[],
    at: number,
    duration: number,
    amplitude: number,
    pan: number,
  ): void {
    if (!context || !master) return;
    const gain = context.createGain();
    const stereo = context.createStereoPanner();
    stereo.pan.value = Math.max(-0.7, Math.min(0.7, pan));
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(amplitude, at + Math.min(0.018, duration / 4));
    gain.gain.exponentialRampToValueAtTime(0.00001, at + duration);
    signal.connect(gain);
    gain.connect(stereo);
    stereo.connect(master);
    const voice = { source, gain, nodes: [...nodes, gain, stereo] };
    voices.add(voice);
    source.onended = (): void => release(voice);
    source.start(at);
    source.stop(at + duration + 0.025);
  }

  function tone(options: Tone): void {
    if (!context || voices.size >= 36) return;
    const at = context.currentTime + (options.delay ?? 0);
    const duration = options.duration ?? 0.28;
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(options.frequency, at);
    if (options.bend)
      oscillator.frequency.exponentialRampToValueAtTime(options.bend, at + duration * 0.8);
    const nodes: AudioNode[] = [oscillator];
    if (options.modulation) {
      const modulator = context.createOscillator();
      const depth = context.createGain();
      modulator.frequency.value = options.frequency * 2.01;
      depth.gain.setValueAtTime(options.modulation * options.frequency, at);
      depth.gain.exponentialRampToValueAtTime(0.01, at + duration);
      modulator.connect(depth);
      depth.connect(oscillator.frequency);
      nodes.push(modulator, depth);
      modulator.start(at);
      modulator.stop(at + duration + 0.025);
    }
    output(
      oscillator,
      oscillator,
      nodes,
      at,
      duration,
      options.amplitude ?? 0.07,
      options.pan ?? 0,
    );
  }

  function air(frequency: number, duration: number, amplitude: number, pan = 0): void {
    if (!context || !noise || voices.size >= 36) return;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    source.buffer = noise;
    source.loop = true;
    filter.type = "bandpass";
    filter.Q.value = 3;
    const at = context.currentTime;
    filter.frequency.setValueAtTime(frequency, at);
    filter.frequency.exponentialRampToValueAtTime(frequency * 0.4, at + duration);
    source.connect(filter);
    output(source, filter, [source, filter], at, duration, amplitude, pan);
  }

  function initialize(): void {
    if (context) return;
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = 0.5;
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -16;
    limiter.knee.value = 8;
    limiter.ratio.value = 8;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.18;
    master.connect(limiter);
    limiter.connect(context.destination);
    // One cached, seeded noise texture. No buffers or random arrays in the frame loop.
    noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = noise.getChannelData(0);
    let seed = 98123;
    for (let index = 0; index < samples.length; index++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      samples[index] = (seed / 4294967296) * 2 - 1;
    }
  }

  async function unlock(): Promise<void> {
    if (!context) return;
    try {
      await context.resume();
    } catch (error) {
      if (disposed || context.state === "closed") return;
      // Browsers may reject activation; keep gameplay usable and explain this failure.
      // eslint-disable-next-line no-console -- Report the specific browser activation failure.
      console.warn("Steroid Quest sound could not start. Toggle sound to retry.", error);
    }
  }

  function motif(speed: number): void {
    if (!context || context.currentTime < nextPulse) return;
    nextPulse = context.currentTime + (stage === "transcription" ? 0.24 : 0.36);
    const step = pulse++;
    // Coprime phrase lengths keep the soft pattern changing without random dissonance.
    const length = stage === "dna" ? 11 : 13;
    const hit = ((step % length) * 5) % length < 5;
    if (!hit || context.currentTime < foregroundUntil) return;
    const degree = SCALE[(step * 3 + Math.floor(step / length)) % SCALE.length] ?? 0;
    const frequency = ROOTS[stage] * 2 ** (degree / 12);
    const amplitude = 0.013 + Math.min(Math.abs(speed) / 350, 1) * 0.01;
    const pan = Math.sin(step * 2.4) * 0.5;
    if (stage === "membrane") air(frequency * 5, 0.2, amplitude * 2, pan);
    else if (stage === "envelope") {
      tone({ frequency, duration: 0.65, amplitude: amplitude * 0.6, pan });
      air(frequency * 6, 0.35, amplitude * 0.3, -pan);
    } else {
      tone({
        frequency,
        duration: stage === "receptor" ? 0.55 : 0.22,
        amplitude,
        modulation: stage === "cytoplasm" ? 1.6 : 0.4,
        pan,
      });
    }
  }

  return {
    setMuted(value): void {
      if (disposed) return;
      muted = value;
      if (muted) clearVoices();
      else {
        initialize();
        void unlock();
        nextPulse = 0;
      }
    },
    play(event): void {
      if (muted || disposed || !context || context.state !== "running") return;
      if (event.type === "state" || event.type === "caption") return;
      foregroundUntil = context.currentTime + 0.4;
      switch (event.type) {
        case "stage":
          air(1500 + event.levelIndex * 250, 0.45, 0.16);
          break;
        case "collect":
          for (let index = 0; index < 3; index++)
            tone({
              frequency: 440 * 2 ** ((index * 7 + (event.total % 5) * 2) / 12),
              delay: index * 0.045,
              modulation: 1.2,
              amplitude: 0.055,
              pan: (index - 1) * 0.3,
            });
          break;
        case "checkpoint":
        case "hre":
          [1, 1.5, 2].forEach((ratio, index) =>
            tone({ frequency: 330 * ratio, delay: index * 0.075, duration: 0.5 }),
          );
          break;
        case "death":
          clearVoices();
          tone({ frequency: 180, bend: 65, duration: 0.3, amplitude: 0.08 });
          air(550, 0.2, 0.04);
          break;
        case "bound":
          foregroundUntil = context.currentTime + 1.6;
          // Two flexible beating tones converge; the scaffold resolves into a warm chord.
          tone({ frequency: 217, bend: 220, duration: 1.6, amplitude: 0.065, pan: -0.3 });
          tone({ frequency: 225, bend: 220, duration: 1.6, amplitude: 0.065, pan: 0.3 });
          [1.25, 1.5, 2].forEach((ratio, index) =>
            tone({ frequency: 220 * ratio, delay: 0.5 + index * 0.17, duration: 0.75 }),
          );
          break;
        case "recruitment":
          if (event.success) {
            [0, 4, 7].forEach((degree, index) =>
              tone({
                frequency: 294 * 2 ** ((degree + event.count * 2) / 12),
                delay: index * 0.06,
                modulation: 0.8,
              }),
            );
            air(1100, 0.07, 0.07);
          } else tone({ frequency: 260, bend: 220, duration: 0.12, amplitude: 0.045 });
          break;
        case "ended":
          clearVoices();
          [0, 4, 7, 12, 16, 19, 24].forEach((degree, index) =>
            tone({
              frequency: 220 * 2 ** (degree / 12),
              delay: index * 0.13,
              duration: 1,
              amplitude: 0.07,
              pan: Math.sin(index) * 0.4,
            }),
          );
          break;
      }
    },
    update(state, currentStage): void {
      if (disposed) return;
      const playing = state.phase === "playing" || state.phase === "recruiting";
      if (
        (state.phase !== previousPhase && (state.phase === "paused" || state.phase === "title")) ||
        state.elapsed < previousElapsed
      )
        clearVoices();
      if (playing && (!active || currentStage !== stage)) nextPulse = 0;
      if (!muted && context?.state === "running" && playing) {
        if (active && state.phase === "playing" && currentStage === stage) {
          if (state.player.vy < -100 && previousVy >= -100)
            tone({
              frequency: state.receptorBound ? 440 : 320,
              bend: 620,
              duration: 0.15,
              amplitude: 0.035,
              modulation: 0.6,
            });
          if (state.player.grounded && !previousGrounded && previousVy > 150) air(400, 0.08, 0.035);
        }
        stage = currentStage;
        motif(state.player.vx);
      }
      active = playing;
      stage = currentStage;
      previousVy = state.player.vy;
      previousGrounded = state.player.grounded;
      previousElapsed = state.elapsed;
      previousPhase = state.phase;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      clearVoices();
      if (context) void context.close();
    },
  };
}
