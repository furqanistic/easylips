window.EasyLips = window.EasyLips || {};

(function (App) {
  const TARGET_SAMPLE_RATE = 16000;

  function float32ToPCM16(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);

    for (let i = 0; i < float32Array.length; i++) {
      let sample = Math.max(-1, Math.min(1, float32Array[i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(i * 2, Math.round(sample), true);
    }

    return new Uint8Array(buffer);
  }

  function uint8ToBase64(bytes) {
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToFloat32(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 0x8000;
    }

    return float32;
  }

  App.createGeminiLiveBridge = function createGeminiLiveBridge({
    onStatus,
    onInputTranscript,
    onOutputTranscript,
    onDetectedLanguage,
    onSpeechActivity,
    onError,
  } = {}) {
    let audioContext = null;
    let mediaStream = null;
    let scriptNode = null;
    let mediaSource = null;
    let sessionId = null;
    let isActive = false;
    let unsubscribeEvent = null;
    let playbackContext = null;
    let nextPlaybackTime = 0;
    let playbackDestination = null;
    let playbackElement = null;
    let playbackReadyPromise = null;
    let playbackChain = Promise.resolve();
    let detectedLanguageReported = false;
    let speakAutoDetect = false;
    let outputSinkId = "default";
    let muteOutput = false;

    function reset() {
      sessionId = null;
      isActive = false;
      detectedLanguageReported = false;
      speakAutoDetect = false;
      outputSinkId = "default";
      muteOutput = false;
      stopCapture();
      stopPlayback();

      if (unsubscribeEvent) {
        unsubscribeEvent();
        unsubscribeEvent = null;
      }
    }

    function stopCapture() {
      try {
        scriptNode?.disconnect();
        mediaSource?.disconnect();
      } catch {
        // Ignore cleanup errors.
      }

      mediaStream?.getTracks().forEach((track) => track.stop());
      mediaStream = null;
      scriptNode = null;
      mediaSource = null;

      if (audioContext) {
        audioContext.close().catch(() => {});
        audioContext = null;
      }
    }

    function stopPlayback() {
      try {
        playbackContext?.close().catch(() => {});
      } catch {
        // Ignore.
      }

      playbackContext = null;
      nextPlaybackTime = 0;
      playbackDestination = null;
      playbackElement = null;
      playbackReadyPromise = null;
      playbackChain = Promise.resolve();
    }

    async function configurePlaybackSink() {
      const targetSinkId = outputSinkId || "default";
      let sinkError = null;

      if (!playbackContext) return null;

      if (
        targetSinkId !== "default" &&
        typeof playbackContext.setSinkId === "function"
      ) {
        try {
          await playbackContext.setSinkId(targetSinkId);
          return playbackContext.destination;
        } catch (error) {
          sinkError = error;
          // Some Electron/Chromium builds expose setSinkId but reject it for
          // virtual audio devices. The media element path below is broader.
        }
      }

      if (
        targetSinkId !== "default" &&
        typeof Audio === "function" &&
        typeof playbackContext.createMediaStreamDestination === "function"
      ) {
        try {
          const streamDestination = playbackContext.createMediaStreamDestination();
          const audio = new Audio();
          audio.autoplay = true;
          audio.srcObject = streamDestination.stream;

          if (typeof audio.setSinkId !== "function") {
            throw new Error("This Electron runtime cannot select an audio output device.");
          }

          await audio.setSinkId(targetSinkId);
          await audio.play();
          playbackElement = audio;
          return streamDestination;
        } catch (error) {
          sinkError = error;
          playbackElement = null;
        }
      }

      if (targetSinkId !== "default") {
        throw sinkError || new Error("The selected audio output device is unavailable.");
      }

      if (typeof playbackContext.setSinkId === "function") {
        try {
          await playbackContext.setSinkId("default");
        } catch {
          // Default destination remains usable even if this fails.
        }
      }

      return playbackContext.destination;
    }

    async function ensurePlaybackGraph(sampleRate) {
      if (!playbackContext) {
        playbackContext = new AudioContext({ sampleRate });
        nextPlaybackTime = playbackContext.currentTime;
        playbackReadyPromise = null;
        playbackDestination = null;
      }

      if (playbackDestination) {
        return playbackDestination;
      }

      playbackReadyPromise = playbackReadyPromise || configurePlaybackSink();
      playbackDestination = await playbackReadyPromise;
      return playbackDestination;
    }

    function schedulePlayback(float32, sampleRate) {
      playbackChain = playbackChain
        .then(async () => {
          const destination = await ensurePlaybackGraph(sampleRate);
          if (!playbackContext || !destination) return;

          if (playbackContext.state === "suspended") {
            await playbackContext.resume().catch(() => {});
          }

          const buffer = playbackContext.createBuffer(1, float32.length, sampleRate);
          buffer.getChannelData(0).set(float32);

          const source = playbackContext.createBufferSource();
          source.buffer = buffer;
          source.connect(destination);

          const duration = buffer.duration;
          const startTime = Math.max(nextPlaybackTime, playbackContext.currentTime);
          source.start(startTime);
          nextPlaybackTime = startTime + duration;
        })
        .catch((error) => {
          onError?.({
            message: error?.message || "Translated audio could not be sent to the selected output.",
          });
        });
    }

    function handleEvent(data) {
      if (data.sessionId && sessionId && data.sessionId !== sessionId) return;

      switch (data.type) {
        case "connected":
          sessionId = data.sessionId;
          isActive = true;
          onStatus?.("connected", data);
          break;

        case "disconnected":
        case "stopped":
          isActive = false;
          onStatus?.(data.type, data);
          break;

        case "input-transcript":
          onInputTranscript?.(data.text);
          if (speakAutoDetect && !detectedLanguageReported) {
            const language = EasyLips.getLanguageByCode?.(data.languageCode)?.label;
            if (language) {
              detectedLanguageReported = true;
              onDetectedLanguage?.(language);
            }
          }
          break;

        case "output-transcript":
          onOutputTranscript?.(data.text);
          detectLanguageFromTranscript(data.text);
          break;

        case "output-text":
          detectLanguageFromTranscript(data.text);
          break;

        case "output-audio":
          if (!muteOutput) {
            playOutputAudio(data.data, data.mimeType);
          }
          break;

        case "error":
          onError?.(data);
          break;

        default:
          break;
      }
    }

    function detectLanguageFromTranscript(text) {
      if (detectedLanguageReported || !text) return;

      const match = text.match(/detected language[:\s]+([a-zA-Z\s()]+)/i);
      if (match) {
        const language = match[1].trim();
        detectedLanguageReported = true;
        onDetectedLanguage?.(language);
      }
    }

    function playOutputAudio(base64, mimeType) {
      const rateMatch = mimeType?.match(/rate=(\d+)/);
      const sampleRate = rateMatch ? Number(rateMatch[1]) : TARGET_SAMPLE_RATE;
      const float32 = base64ToFloat32(base64);
      schedulePlayback(float32, sampleRate);
    }

    async function start({
      deviceId,
      outputDeviceId,
      targetLanguageCode,
      sourceLanguageCode,
      muteOutput: shouldMuteOutput = false,
    }) {
      if (isActive) {
        return { ok: false, message: "A Gemini Live session is already running." };
      }

      reset();
      muteOutput = shouldMuteOutput;

      try {
        if (EasyLips.isSystemAudioInputDeviceId?.(deviceId)) {
          if (typeof navigator.mediaDevices?.getDisplayMedia !== "function") {
            throw new Error("Computer audio capture is not available in this Electron runtime.");
          }

          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
              sampleRate: TARGET_SAMPLE_RATE,
              channelCount: 1,
            },
            video: true,
          });
          mediaStream.getVideoTracks().forEach((track) => track.stop());

          if (!mediaStream.getAudioTracks().length) {
            throw new Error("No computer audio track was shared.");
          }
        } else {
          const useExactDevice = deviceId && !String(deviceId).startsWith("fallback-");
          const constraints = {
            audio: useExactDevice
              ? {
                  deviceId: { exact: deviceId },
                  echoCancellation: true,
                  noiseSuppression: true,
                  sampleRate: TARGET_SAMPLE_RATE,
                  channelCount: 1,
                }
              : {
                  echoCancellation: true,
                  noiseSuppression: true,
                  sampleRate: TARGET_SAMPLE_RATE,
                  channelCount: 1,
                },
          };

          mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        }
      } catch (error) {
        reset();
        return {
          ok: false,
          message: error?.name === "NotAllowedError"
            ? "Audio capture permission was denied."
            : error?.message || "Could not access the selected audio source.",
        };
      }

      unsubscribeEvent = window.electronAPI?.onGeminiLiveEvent?.(handleEvent);

      const startResult = await window.electronAPI?.startGeminiLive?.({
        targetLanguageCode,
        sourceLanguageCode,
      });

      if (!startResult?.ok) {
        reset();
        return startResult || { ok: false, message: "Gemini Live start bridge is unavailable." };
      }

      sessionId = startResult.sessionId;
      isActive = true;
      speakAutoDetect = sourceLanguageCode === "auto";
      outputSinkId = outputDeviceId || "default";

      try {
        audioContext = new AudioContext({ sampleRate: TARGET_SAMPLE_RATE });
        mediaSource = audioContext.createMediaStreamSource(mediaStream);

        scriptNode = audioContext.createScriptProcessor(1024, 1, 1);
        scriptNode.onaudioprocess = (event) => {
          if (!isActive) return;

          const inputData = event.inputBuffer.getChannelData(0);
          let sumSquares = 0;
          for (let index = 0; index < inputData.length; index += 1) {
            sumSquares += inputData[index] * inputData[index];
          }

          const rms = Math.sqrt(sumSquares / inputData.length);
          const durationSeconds = inputData.length / audioContext.sampleRate;
          onSpeechActivity?.({
            speaking: rms > 0.018,
            durationSeconds,
            level: rms,
          });

          const pcm16 = float32ToPCM16(inputData);
          const base64 = uint8ToBase64(pcm16);

          window.electronAPI?.sendGeminiLiveAudio?.({ sessionId, audio: base64 });
        };

        const silentGain = audioContext.createGain();
        silentGain.gain.value = 0;
        silentGain.connect(audioContext.destination);

        mediaSource.connect(scriptNode);
        scriptNode.connect(silentGain);
      } catch (error) {
        stop();
        return { ok: false, message: error.message || "Failed to start audio capture." };
      }

      return { ok: true, sessionId, message: "Gemini Live translation started." };
    }

    function stop() {
      if (sessionId) {
        window.electronAPI?.stopGeminiLive?.({ sessionId });
      }
      reset();
      return { ok: true };
    }

    function isRunning() {
      return isActive;
    }

    return {
      start,
      stop,
      isRunning,
    };
  };
})(window.EasyLips);
