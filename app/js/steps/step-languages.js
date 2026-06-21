window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.LANGUAGES;
  const stepTag = App.formatStepTag(STEP);
  const DETECTION_TARGET_LANGUAGE = "English";
  const DETECTION_PHRASES = [
    "Hello, how are you today?",
    "I am testing my translation setup.",
    "Can you understand what I am saying?",
  ];

  App.createLanguagesView = function createLanguagesView({
    speakLanguage = "Urdu",
    translateLanguage = "",
    speakAutoDetect = true,
    inputDeviceId = "fallback-external",
    testOutputDeviceId = "default",
    onBack,
    onContinue,
    onSpeakChange,
    onSpeakDetected,
    onTranslateChange,
    onSpeakAutoDetectChange,
    onDetectLanguage,
    onStopDetection,
    onTestInputChange,
    onTestOutputChange,
    onStartTest,
    onStopTest,
  }) {
    const view = document.createElement("div");
    view.className = "view";
    view.dataset.view = "languages";

    const content = document.createElement("div");
    content.className = "content content--languages";
    content.appendChild(
      App.createStepHeader({
        tag: stepTag,
        heading: "Set up translation",
        subheading: "Detect your language, choose the meeting language, then test your setup.",
      }),
    );

    let stage = 1;
    let currentSpeakLanguage = speakLanguage;
    let currentTranslateLanguage = translateLanguage;
    let currentSpeakAutoDetect = speakAutoDetect;
    let detectedLanguage = "";
    let testPanel = null;
    let primaryButton = null;

    const stageNav = App.createLanguageFlowNav();
    const sourceStage = document.createElement("section");
    sourceStage.className = "language-flow-stage";
    sourceStage.dataset.stage = "source";

    const targetStage = document.createElement("section");
    targetStage.className = "language-flow-stage";
    targetStage.dataset.stage = "target";

    const liveStage = document.createElement("section");
    liveStage.className = "language-flow-stage";
    liveStage.dataset.stage = "live";

    const sourcePicker = App.createLanguagePicker({
      id: "speak",
      icon: App.icons.microphone,
      title: "I speak",
      subtitle: "Use auto-detect or choose your spoken language.",
      value: speakLanguage,
      showAutoDetect: true,
      autoDetectEnabled: speakAutoDetect,
      onChange: (language) => {
        currentSpeakLanguage = language;
        onSpeakChange?.(language);
        testPanel?.setLanguages?.({ speakLanguage: language });
      },
      onAutoDetectChange: (enabled) => {
        currentSpeakAutoDetect = enabled;
        onSpeakAutoDetectChange?.(enabled);
        testPanel?.setLanguages?.({ speakAutoDetect: enabled });
        renderSourceHelper();
      },
    });

    const sourceHelper = App.createLanguageDetectionPanel({
      autoDetectEnabled: currentSpeakAutoDetect,
      detectedLanguage,
      onDetect: startDetection,
    });

    function renderSourceHelper() {
      sourceHelper.setAutoDetect(currentSpeakAutoDetect);
      sourceHelper.setDetectedLanguage(detectedLanguage);
    }

    sourceStage.append(sourcePicker, sourceHelper.element);

    const targetPicker = App.createLanguagePicker({
      id: "translate",
      icon: App.icons.translate,
      title: "Translate to",
      subtitle: "Choose the language you want to hear.",
      value: translateLanguage,
      placeholder: "Select target language",
      onChange: (language) => {
        currentTranslateLanguage = language;
        onTranslateChange?.(language);
        testPanel?.setLanguages?.({ translateLanguage: language });
      },
    });

    const targetHint = document.createElement("p");
    targetHint.className = "language-flow-note";
    targetHint.textContent = "Pick one target language before testing your setup.";
    targetStage.append(targetPicker, targetHint);

    testPanel = App.createGeminiTestPanel({
      inputDeviceId,
      outputDeviceId: testOutputDeviceId,
      speakLanguage: currentSpeakLanguage,
      translateLanguage: currentTranslateLanguage,
      speakAutoDetect: currentSpeakAutoDetect,
      onInputChange: onTestInputChange,
      onOutputChange: onTestOutputChange,
      onStart: (options = {}) => {
        onStopDetection?.();
        return onStartTest?.({
          ...options,
          translateLanguage: currentTranslateLanguage,
        });
      },
      onStop: onStopTest,
    });

    const summary = document.createElement("div");
    summary.className = "language-flow-summary";
    const sourceSummary = document.createElement("p");
    const targetSummary = document.createElement("p");
    summary.append(sourceSummary, targetSummary);
    liveStage.append(summary, testPanel);

    const body = document.createElement("div");
    body.className = "languages-body language-flow";
    body.append(stageNav, sourceStage, targetStage, liveStage);
    content.appendChild(body);

    const actions = document.createElement("div");
    actions.className = "setup-actions";

    const backButton = App.createBackLink({
      label: "Back",
      onClick: () => {
        if (stage > 1) {
          if (stage === 3) {
            onStopTest?.();
          }
          setStage(stage - 1);
          return;
        }
        onStopDetection?.();
        onBack?.();
      },
    });

    primaryButton = App.createPrimaryButton({
      className: "primary-btn--inline",
      label: "Next",
      onClick: () => {
        if (stage === 1) {
          setStage(2);
          return;
        }

        if (stage === 2) {
          if (!EasyLips.getLanguageCode(currentTranslateLanguage)) {
            targetHint.textContent = "Please choose a Translate to language in order to proceed.";
            targetHint.dataset.status = "error";
            return;
          }

          targetHint.textContent = "Target language selected.";
          targetHint.dataset.status = "success";
          setStage(3);
          return;
        }

        onStopTest?.();
        onContinue?.();
      },
    });

    actions.append(backButton, primaryButton);
    content.appendChild(actions);
    view.appendChild(content);

    function setStage(nextStage) {
      const previousStage = stage;
      stage = Math.max(1, Math.min(3, nextStage));
      if (previousStage === 3 && stage !== 3) {
        onStopTest?.();
      }
      sourceStage.hidden = stage !== 1;
      targetStage.hidden = stage !== 2;
      liveStage.hidden = stage !== 3;
      stageNav.setStage(stage);

      if (stage === 3) {
        updateSummary();
        testPanel?.setLanguages?.({
          speakLanguage: currentSpeakLanguage,
          translateLanguage: currentTranslateLanguage,
          speakAutoDetect: currentSpeakAutoDetect,
        });
        testPanel?.refreshDevices?.();
      }

      primaryButton.innerHTML = `${stage === 3 ? "Continue" : "Next"}${App.icons.arrowRight}`;
    }

    function updateSummary() {
      const source = currentSpeakAutoDetect
        ? detectedLanguage || "Auto-detect"
        : currentSpeakLanguage;
      sourceSummary.textContent = `Speaking: ${source}`;
      targetSummary.textContent = `Translating to: ${currentTranslateLanguage || "Not selected"}`;
    }

    function applyDetectedLanguage(language) {
      if (!language) return;

      detectedLanguage = language;
      currentSpeakLanguage = language;
      sourcePicker.setDetectedLanguage?.(language);
      renderSourceHelper();
      testPanel?.setLanguages?.({ speakLanguage: language });
      onSpeakDetected?.(language);
      if (!onSpeakDetected) {
        onSpeakChange?.(language);
      }
      updateSummary();
    }

    async function startDetection({ setStatus, setDetectedLanguage, setSample }) {
      if (!currentSpeakAutoDetect) {
        setStatus("idle", `Spoken language is set to ${currentSpeakLanguage}.`);
        return { ok: true };
      }

      const result = await onDetectLanguage?.({
        inputDeviceId,
        targetLanguage: DETECTION_TARGET_LANGUAGE,
        setStatus,
        setSample,
        setDetectedLanguage: (language) => {
          applyDetectedLanguage(language);
          setDetectedLanguage(language);
        },
      });

      return result || { ok: false, message: "Language detection is unavailable." };
    }

    setStage(1);
    view.cleanup = () => {
      testPanel?.dispose?.();
      onStopTest?.();
    };
    return view;
  };

  App.createLanguageFlowNav = function createLanguageFlowNav() {
    const nav = document.createElement("div");
    nav.className = "language-flow-nav";
    nav.setAttribute("aria-label", "Language setup steps");

    const steps = [
      ["Detect", "1"],
      ["Translate", "2"],
      ["Test", "3"],
    ].map(([label, number]) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "language-flow-nav-item";
      item.disabled = true;
      item.innerHTML = `<span>${number}</span>${label}`;
      nav.appendChild(item);
      return item;
    });

    nav.setStage = (stage) => {
      steps.forEach((item, index) => {
        const stepNumber = index + 1;
        item.classList.toggle("language-flow-nav-item--active", stepNumber === stage);
        item.classList.toggle("language-flow-nav-item--done", stepNumber < stage);
      });
    };

    return nav;
  };

  App.createLanguageDetectionPanel = function createLanguageDetectionPanel({
    autoDetectEnabled,
    detectedLanguage,
    onDetect,
  }) {
    let currentAutoDetect = autoDetectEnabled;
    const panel = document.createElement("section");
    panel.className = "language-detection-panel";
    panel.dataset.status = "idle";

    const title = document.createElement("h3");
    title.className = "language-detection-title";

    const status = document.createElement("p");
    status.className = "language-detection-status";
    status.setAttribute("aria-live", "polite");

    const detectedResult = document.createElement("div");
    detectedResult.className = "language-detection-result";
    detectedResult.hidden = true;
    detectedResult.innerHTML = `
      <span class="language-detection-result-label">Detected</span>
      <strong class="language-detection-result-value"></strong>
    `;

    const sample = document.createElement("p");
    sample.className = "language-detection-sample";

    const phrases = document.createElement("div");
    phrases.className = "language-detection-phrases";
    DETECTION_PHRASES.forEach((phrase) => {
      const chip = document.createElement("span");
      chip.textContent = phrase;
      phrases.appendChild(chip);
    });

    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-detection-button";
    button.textContent = "Detect language";

    let timeoutId = null;

    function setStatus(tone, message) {
      panel.dataset.status = tone;
      status.textContent = message;
    }

    function setDetectedLanguage(language) {
      clearTimeout(timeoutId);
      timeoutId = null;
      panel.dataset.detected = language;
      detectedResult.hidden = true;
      detectedResult.querySelector(".language-detection-result-value").textContent = language;
      button.disabled = false;
      button.textContent = "Detect again";
      setStatus("success", `Detected ${language}.`);
    }

    function setSample(text) {
      if (!text) return;
      sample.textContent = `Heard: ${text}`;
    }

    function syncAutoDetect(enabled) {
      currentAutoDetect = enabled;
      title.textContent = enabled ? "Speak so we can detect you" : "Spoken language selected";
      button.hidden = !enabled;
      phrases.hidden = !enabled;
      sample.hidden = !enabled;
      if (enabled) {
        detectedResult.hidden = !detectedLanguage;
        if (detectedLanguage) {
          detectedResult.querySelector(".language-detection-result-value").textContent = detectedLanguage;
        }
        setStatus(
          detectedLanguage ? "success" : "idle",
          detectedLanguage
            ? `Detected ${detectedLanguage}.`
            : "Say a short phrase in your normal speaking language.",
        );
      } else {
        clearTimeout(timeoutId);
        timeoutId = null;
        button.disabled = false;
        button.textContent = "Detect language";
        detectedResult.hidden = true;
        setStatus("idle", "Auto-detect is off. We will use the language you selected above.");
      }
    }

    button.addEventListener("click", async () => {
      clearTimeout(timeoutId);
      button.disabled = true;
      button.textContent = "Listening...";
      sample.textContent = "";
      detectedResult.hidden = true;
      setStatus("loading", "Speak one of the examples below, or any short sentence.");

      timeoutId = setTimeout(() => {
        button.disabled = false;
        button.textContent = "Try again";
        setStatus("error", "I could not detect a language yet. Try a slightly longer phrase.");
      }, 16000);

      const result = await onDetect?.({ setStatus, setDetectedLanguage, setSample });
      if (!result?.ok) {
        clearTimeout(timeoutId);
        timeoutId = null;
        button.disabled = false;
        button.textContent = "Try again";
        setStatus("error", result?.message || "Could not start language detection.");
      }
    });

    panel.append(title, status, sample, phrases, button);
    panel.setAutoDetect = syncAutoDetect;
    panel.setDetectedLanguage = (language) => {
      detectedLanguage = language;
      if (language) setDetectedLanguage(language);
      else syncAutoDetect(currentAutoDetect);
    };

    syncAutoDetect(autoDetectEnabled);
    return { element: panel, setAutoDetect: syncAutoDetect, setDetectedLanguage: panel.setDetectedLanguage };
  };

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
})(window.EasyLips);
