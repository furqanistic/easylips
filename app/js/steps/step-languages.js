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
    onBack,
    onContinue,
    onSpeakChange,
    onSpeakDetected,
    onTranslateChange,
    onSpeakAutoDetectChange,
    onDetectLanguage,
    onStopDetection,
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
        subheading: "Detect your language, then choose the meeting language.",
      }),
    );

    let stage = 1;
    let currentSpeakLanguage = speakLanguage;
    let currentTranslateLanguage = translateLanguage;
    let currentSpeakAutoDetect = speakAutoDetect;
    let detectedLanguage = "";
    let primaryButton = null;

    const stageNav = App.createLanguageFlowNav();
    const sourceStage = document.createElement("section");
    sourceStage.className = "language-flow-stage";
    sourceStage.dataset.stage = "source";

    const targetStage = document.createElement("section");
    targetStage.className = "language-flow-stage";
    targetStage.dataset.stage = "target";

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
      },
      onAutoDetectChange: (enabled) => {
        currentSpeakAutoDetect = enabled;
        onSpeakAutoDetectChange?.(enabled);
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
      },
    });

    const targetHint = document.createElement("p");
    targetHint.className = "language-flow-note";
    targetHint.textContent = "Pick one target language before continuing.";
    targetStage.append(targetPicker, targetHint);

    const body = document.createElement("div");
    body.className = "languages-body language-flow";
    body.append(stageNav, sourceStage, targetStage);
    content.appendChild(body);

    const actions = document.createElement("div");
    actions.className = "setup-actions";

    const backButton = App.createBackLink({
      label: "Back",
      onClick: () => {
        if (stage > 1) {
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

        if (!EasyLips.getLanguageCode(currentTranslateLanguage)) {
          targetHint.textContent = "Please choose a Translate to language in order to proceed.";
          targetHint.dataset.status = "error";
          return;
        }

        targetHint.textContent = "Target language selected.";
        targetHint.dataset.status = "success";
        onStopDetection?.();
        onContinue?.();
      },
    });

    actions.append(backButton, primaryButton);
    content.appendChild(actions);
    view.appendChild(content);

    function setStage(nextStage) {
      stage = Math.max(1, Math.min(2, nextStage));
      sourceStage.hidden = stage !== 1;
      targetStage.hidden = stage !== 2;
      stageNav.setStage(stage);
      primaryButton.innerHTML = `${stage === 2 ? "Continue" : "Next"}${App.icons.arrowRight}`;
    }

    function applyDetectedLanguage(language) {
      if (!language) return;

      detectedLanguage = language;
      currentSpeakLanguage = language;
      sourcePicker.setDetectedLanguage?.(language);
      renderSourceHelper();
      onSpeakDetected?.(language);
      if (!onSpeakDetected) {
        onSpeakChange?.(language);
      }
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
      onStopDetection?.();
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
})(window.EasyLips);
