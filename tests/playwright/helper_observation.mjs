/** Observe the real frame/audio lifecycles without changing simulation or generated sound. */
export async function installObservation(page) {
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const pending = new Set();
    let maximum = 0;
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        pending.delete(id);
        callback(time);
      });
      pending.add(id);
      maximum = Math.max(maximum, pending.size);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      pending.delete(id);
      cancel(id);
    };
    const contexts = [];
    const analysers = [];
    const OriginalContext = window.AudioContext;
    window.AudioContext = class extends OriginalContext {
      constructor(...args) {
        super(...args);
        contexts.push(this);
      }
    };
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (...args) {
      const result = connect.apply(this, args);
      if (args[0] instanceof AudioDestinationNode) {
        const analyser = this.context.createAnalyser();
        analyser.fftSize = 2048;
        connect.call(this, analyser);
        analysers.push(analyser);
      }
      return result;
    };
    Object.defineProperty(window, "fluidObservation", {
      get: () => {
        let rms = 0;
        for (const analyser of analysers) {
          const values = new Float32Array(analyser.fftSize);
          analyser.getFloatTimeDomainData(values);
          rms = Math.max(
            rms,
            Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length),
          );
        }
        return {
          frames: { pending: pending.size, maximum },
          contexts: contexts.length,
          states: contexts.map((context) => context.state),
          rms,
        };
      },
    });
  });
}
