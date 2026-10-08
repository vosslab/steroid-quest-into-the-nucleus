import type { GameEvent } from "./types/simulation";

/** Small, optional synthesized cues. Audio is created only after an unmute gesture. */
export function createAudio(): {
  setMuted(muted: boolean): void;
  play(event: GameEvent): void;
  dispose(): void;
} {
  let context: AudioContext | undefined;
  let muted = true;
  let disposed = false;
  return {
    setMuted(value): void {
      if (disposed) return;
      muted = value;
      if (!muted) {
        context ??= new AudioContext();
        void context.resume();
      } else if (context) {
        void context.suspend();
      }
    },
    play(event): void {
      if (muted || disposed || !context || context.state !== "running") return;
      const frequencies: Partial<Record<GameEvent["type"], number>> = {
        collect: 740,
        checkpoint: 520,
        death: 140,
        bound: 880,
        hre: 660,
        recruitment: 600,
        ended: 1040,
      };
      const frequency = frequencies[event.type];
      if (!frequency) return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.4, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      oscillator.onended = (): void => {
        oscillator.disconnect();
        gain.disconnect();
      };
    },
    dispose(): void {
      disposed = true;
      if (context) void context.close();
    },
  };
}
