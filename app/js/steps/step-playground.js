window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.MICROPHONE;
  const stepTag = App.formatStepTag(STEP);

  App.createGeminiTestPanel = function createGeminiTestPanel({
    inputDeviceId = "fallback-external",
    outputDeviceId = "default",
    speakLanguage = "Urdu",
    translateLanguage = "",
    speakAutoDetect = true,
    onInputChange,
    onOutputChange,
    onStart,
    onStop,
  }) {
    const current = {
      inputDeviceId,
      outputDeviceId,
      speakLanguage,
      translateLanguage,
      speakAutoDetect,
    };
    let busy = false;
    let running = false;
    let disposed = false;
    let refreshing = false;

    const root = document.createElement("section");
    root.className = "gemini-test-workspace";
    root.setAttribute("aria-label", "Translation setup test");

    const inputFooter = App.createInputLevelFooter();
    const inputPicker = App.createDevicePicker({
      id: "test-input-mic",
      icon: App.icons.microphone,
      title: "Test microphone",
      subtitle: "Choose the microphone for this test.",
      value: current.inputDeviceId,
      options: EasyLips.FALLBACK_INPUT_DEVICES,
      footer: inputFooter,
      onChange: (option) => {
        current.inputDeviceId = option.id;
        onInputChange?.(option);
        startInputMonitor(option.id);
      },
    });

    const arrow = document.createElement("div");
    arrow.className = "language-panels-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = App.icons.arrowRight;

    const outputFooter = App.createOutputStatusFooter({
      label: "Speaker output",
      tone: "idle",
    });
    const outputPicker = App.createDevicePicker({
      id: "test-output-speaker",
      icon: App.icons.speaker,
      title: "Test output",
      subtitle: "Choose speakers or headphones for playback.",
      value: current.outputDeviceId,
      options: [{ id: "default", label: "Default speakers", icon: "speaker" }],
      footer: outputFooter,
      onChange: (option) => {
        current.outputDeviceId = option.id;
        onOutputChange?.(option);
        updateOutputStatus(option);
      },
    });

    const devices = document.createElement("div");
    devices.className = "language-panels microphone-panels gemini-test-devices";
    devices.append(inputPicker, arrow, outputPicker);

    const sessionPanel = document.createElement("section");
    sessionPanel.className = "gemini-test-panel";

    const copy = document.createElement("div");
    copy.className = "gemini-test-copy";

    const title = document.createElement("h3");
    title.className = "gemini-test-title";
    title.textContent = "Test translation setup";

    const status = document.createElement("p");
    status.className = "gemini-test-status";
    status.setAttribute("aria-live", "polite");

    copy.append(title, status);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gemini-test-button";
    button.textContent = "Start test";

    const transcriptWrap = document.createElement("div");
    transcriptWrap.className = "gemini-live-transcript";
    transcriptWrap.setAttribute("aria-live", "polite");
    transcriptWrap.hidden = true;

    const detectedBadge = document.createElement("div");
    detectedBadge.className = "gemini-live-detected";
    detectedBadge.hidden = true;
    detectedBadge.innerHTML = `
      <span class="gemini-live-detected-dot" aria-hidden="true"></span>
      <span class="gemini-live-detected-label">Detected language:</span>
      <span class="gemini-live-detected-value">Detecting...</span>
    `;

    const sourceText = document.createElement("p");
    sourceText.className = "gemini-live-source";

    const translatedText = document.createElement("p");
    translatedText.className = "gemini-live-translated";

    transcriptWrap.append(detectedBadge, sourceText, translatedText);

    const monitor = App.createMicLevelMonitor();
    const levelBinding = App.bindInputLevelFooter(inputFooter, monitor);
    const inputStatus = inputFooter.querySelector(".level-status");

    function canTest() {
      return Boolean(EasyLips.getLanguageCode(current.translateLanguage));
    }

    function setState(tone, message) {
      sessionPanel.dataset.status = tone;
      status.textContent = message;
    }

    function setDetectedLanguage(language) {
      if (!language) return;
      detectedBadge.querySelector(".gemini-live-detected-value").textContent = language;
      detectedBadge.hidden = false;
      transcriptWrap.hidden = false;
    }

    function setTranscripts(source, translated) {
      if (source) sourceText.textContent = source;
      if (translated) translatedText.textContent = translated;
      transcriptWrap.hidden = false;
    }

    function clearTranscripts() {
      sourceText.textContent = "";
      translatedText.textContent = "";
      detectedBadge.hidden = true;
      detectedBadge.querySelector(".gemini-live-detected-value").textContent = "Detecting...";
      transcriptWrap.hidden = true;
    }

    function updateOutputStatus(option) {
      outputFooter.className = "device-picker-footer device-picker-footer--status device-picker-footer--idle";
      outputFooter.querySelector(".status-text").textContent = option?.label
        ? "Selected"
        : "Choose output";
    }

    async function startInputMonitor(deviceId) {
      try {
        inputStatus.textContent = "Good";
        inputStatus.className = "level-status level-status--good";
        await levelBinding.start(deviceId);
      } catch {
        inputStatus.textContent = "Denied";
        inputStatus.className = "level-status level-status--denied";
        levelBinding.stop();
      }
    }

    function pickDeviceId(devices, preferredId) {
      if (preferredId && devices.some((device) => device.id === preferredId)) {
        return preferredId;
      }
      return devices[0]?.id;
    }

    function syncReadyState() {
      if (busy) return;

      const ready = canTest();
      button.disabled = !ready && !running;
      button.textContent = running ? "Stop test" : "Start test";
      setState(
        running ? "success" : "idle",
        running
          ? "Test translation is running. Speak into your mic to hear translated audio."
          : ready
            ? `Ready to test translation to ${current.translateLanguage}.`
            : "Choose a target language before testing your setup.",
      );
    }

    async function refreshDevices() {
      if (refreshing || disposed) return;
      refreshing = true;

      try {
        const [inputs, outputs] = await Promise.all([
          EasyLips.listInputDevices(),
          EasyLips.listSpeakerOutputDevices(),
        ]);
        if (disposed) return;

        const nextInputId = pickDeviceId(inputs, current.inputDeviceId);
        const nextOutputId = pickDeviceId(outputs, current.outputDeviceId);
        const nextInput = inputs.find((device) => device.id === nextInputId) || inputs[0];
        const nextOutput = outputs.find((device) => device.id === nextOutputId) || outputs[0];

        current.inputDeviceId = nextInput?.id || current.inputDeviceId;
        current.outputDeviceId = nextOutput?.id || current.outputDeviceId;

        inputPicker.setOptions(inputs, current.inputDeviceId);
        outputPicker.setOptions(outputs, current.outputDeviceId);

        if (nextInput) {
          onInputChange?.(nextInput);
          await startInputMonitor(nextInput.id);
        }

        if (nextOutput) {
          onOutputChange?.(nextOutput);
          updateOutputStatus(nextOutput);
        }
      } finally {
        refreshing = false;
      }
    }

    button.addEventListener("click", async () => {
      if (running) {
        busy = true;
        button.disabled = true;
        button.textContent = "Stopping...";
        onStop?.();
        running = false;
        busy = false;
        clearTranscripts();
        syncReadyState();
        return;
      }

      if (!canTest() || busy) {
        setState("error", "Please choose a Translate to language before testing.");
        return;
      }

      busy = true;
      button.disabled = true;
      button.textContent = "Starting...";
      clearTranscripts();
      setState("loading", "Starting a short live translation test...");

      try {
        const result = await onStart?.({
          inputDeviceId: current.inputDeviceId,
          outputDeviceId: current.outputDeviceId,
          speakLanguage: current.speakAutoDetect ? null : current.speakLanguage,
          translateLanguage: current.translateLanguage,
          speakAutoDetect: current.speakAutoDetect,
          setStatus: setState,
          setDetectedLanguage,
          setTranscripts,
        });

        if (result?.ok) {
          running = true;
          setState("success", "Test translation is running. Speak to hear the translated voice.");
        } else {
          setState("error", result?.message || "Could not start the translation test.");
        }
      } catch (error) {
        setState("error", error?.message || "Could not start the translation test.");
      } finally {
        busy = false;
        button.disabled = false;
        syncReadyState();
      }
    });

    sessionPanel.append(copy, button, transcriptWrap);
    root.append(devices, sessionPanel);

    root.setLanguages = (next = {}) => {
      Object.assign(current, next);
      syncReadyState();
    };

    root.refreshDevices = refreshDevices;
    root.dispose = () => {
      disposed = true;
      levelBinding.stop();
      if (running) {
        onStop?.();
      }
    };

    navigator.mediaDevices?.addEventListener("devicechange", refreshDevices);
    const originalDispose = root.dispose;
    root.dispose = () => {
      navigator.mediaDevices?.removeEventListener("devicechange", refreshDevices);
      originalDispose();
    };

    refreshDevices();
    syncReadyState();
    return root;
  };

  App.createPlaygroundView = function createPlaygroundView({
    speakLanguage = "Urdu",
    translateLanguage = "",
    speakAutoDetect = true,
    inputDeviceId = "fallback-external",
    testOutputDeviceId = "default",
    onBack,
    onSpeakChange,
    onTranslateChange,
    onSpeakAutoDetectChange,
    onTestInputChange,
    onTestOutputChange,
    onStartTest,
    onStopTest,
  }) {
    const view = document.createElement("div");
    view.className = "view";
    view.dataset.view = "playground";

    const content = document.createElement("div");
    content.className = "content content--languages";
    content.appendChild(
      App.createStepHeader({
        tag: stepTag,
        heading: "Test playground",
        subheading: "Pick your languages and run a quick translation test before you continue.",
      }),
    );

    let currentSpeakLanguage = speakLanguage;
    let currentTranslateLanguage = translateLanguage;
    let currentSpeakAutoDetect = speakAutoDetect;
    let testPanel = null;

    const languagePanels = App.createLanguagePanels({
      speakValue: speakLanguage,
      translateValue: translateLanguage,
      speakAutoDetect,
      onSpeakChange: (language) => {
        currentSpeakLanguage = language;
        onSpeakChange?.(language);
        testPanel?.setLanguages?.({ speakLanguage: language });
      },
      onTranslateChange: (language) => {
        currentTranslateLanguage = language;
        onTranslateChange?.(language);
        testPanel?.setLanguages?.({ translateLanguage: language });
      },
      onSpeakAutoDetectChange: (enabled, language) => {
        currentSpeakAutoDetect = enabled;
        if (!enabled && language) {
          currentSpeakLanguage = language;
          testPanel?.setLanguages?.({ speakAutoDetect: false, speakLanguage: language });
        } else {
          testPanel?.setLanguages?.({ speakAutoDetect: enabled });
        }
        onSpeakAutoDetectChange?.(enabled);
      },
    });

    testPanel = App.createGeminiTestPanel({
      inputDeviceId,
      outputDeviceId: testOutputDeviceId,
      speakLanguage: currentSpeakLanguage,
      translateLanguage: currentTranslateLanguage,
      speakAutoDetect: currentSpeakAutoDetect,
      onInputChange: onTestInputChange,
      onOutputChange: onTestOutputChange,
      onStart: (options = {}) => onStartTest?.(options),
      onStop: onStopTest,
    });

    const body = document.createElement("div");
    body.className = "languages-body language-flow playground-body";
    body.append(languagePanels, testPanel);
    content.appendChild(body);

    const actions = document.createElement("div");
    actions.className = "setup-actions";
    actions.appendChild(
      App.createBackLink({ label: "Back to microphone", onClick: onBack }),
    );
    content.appendChild(actions);

    view.appendChild(content);

    view.cleanup = () => {
      testPanel?.dispose?.();
      onStopTest?.();
    };
    return view;
  };
})(window.EasyLips);
