window.EasyLips = window.EasyLips || {};

(function (App) {
  App.createMicLevelMonitor = function createMicLevelMonitor({ barCount = 20 } = {}) {
    let stream = null;
    let audioContext = null;
    let analyser = null;
    let rafId = null;
    let dataArray = null;

    async function start(deviceId, onLevel) {
      stop();

      const useExactDevice =
        deviceId && !String(deviceId).startsWith("fallback-");

      const constraints = {
        audio: useExactDevice
          ? {
              deviceId: { exact: deviceId },
              echoCancellation: true,
              noiseSuppression: true,
            }
          : { echoCancellation: true, noiseSuppression: true },
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let index = 0; index < dataArray.length; index += 1) {
          sum += dataArray[index];
        }

        const level = sum / (dataArray.length * 255);
        onLevel?.(level, dataArray);
        rafId = requestAnimationFrame(tick);
      };

      tick();
    }

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      stream?.getTracks().forEach((track) => track.stop());
      stream = null;

      if (audioContext) {
        audioContext.close().catch(() => {});
        audioContext = null;
      }

      analyser = null;
      dataArray = null;
    }

    return { start, stop };
  };

  App.getLevelStatus = function getLevelStatus(level) {
    if (level < 0.06) return { label: "Low", tone: "low" };
    if (level > 0.72) return { label: "Loud", tone: "loud" };
    return { label: "Good", tone: "good" };
  };
})(window.EasyLips);
