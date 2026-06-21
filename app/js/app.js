(function (App) {
  const VIEWS = {
    ACCOUNT_OPTIONS: "account-options",
    EMAIL_FORM: "email-form",
    SIGN_IN_FORM: "sign-in-form",
    VERIFY_EMAIL: "verify-email",
    MICROPHONE: "microphone",
    LANGUAGES: "languages",
    READY: "ready",
  };

  const FORM_VIEWS = new Set([VIEWS.EMAIL_FORM, VIEWS.SIGN_IN_FORM]);
  const STEP_BY_VIEW = {
    [VIEWS.ACCOUNT_OPTIONS]: EasyLips.SETUP_STEPS.ACCOUNT,
    [VIEWS.EMAIL_FORM]: EasyLips.SETUP_STEPS.ACCOUNT,
    [VIEWS.SIGN_IN_FORM]: EasyLips.SETUP_STEPS.ACCOUNT,
    [VIEWS.VERIFY_EMAIL]: EasyLips.SETUP_STEPS.ACCOUNT,
    [VIEWS.MICROPHONE]: EasyLips.SETUP_STEPS.MICROPHONE,
    [VIEWS.LANGUAGES]: EasyLips.SETUP_STEPS.LANGUAGES,
    [VIEWS.READY]: EasyLips.SETUP_STEPS.READY,
  };

  function init() {
    const titleBarMount = document.getElementById("titlebar-mount");
    const stepperMount = document.getElementById("stepper-mount");
    const viewMount = document.getElementById("view-mount");
    const mainEl = document.querySelector(".main");

    const state = {
      email: "hello@easylips.ai",
      verifyReturnView: VIEWS.SIGN_IN_FORM,
      microphoneReturnView: VIEWS.ACCOUNT_OPTIONS,
      speakLanguage: "Urdu",
      translateLanguage: "",
      speakAutoDetect: true,
      detectedSpeakLanguage: "",
      inputDeviceId: "fallback-external",
      inputDeviceLabel: "External Microphone",
      outputDeviceId: "easy-lips-virtual",
      outputDeviceLabel: "Easy Lips Virtual Mic",
      outputVirtualReady: false,
      outputMeetingMicLabel: "Easy Lips Virtual Mic",
      listenEnabled: true,
      listenInputDeviceId: "system-audio",
      listenInputDeviceLabel: "Computer audio",
      listenInputSource: "system",
      listenOutputDeviceId: "default",
      listenOutputDeviceLabel: "Default speakers",
      testOutputDeviceId: "default",
      testOutputDeviceLabel: "Default speakers",
      remainingTranslationSeconds: 120 * 60,
    };

    const titleBar = App.createTitleBar();
    titleBarMount.appendChild(titleBar);
    App.bindWindowControls(titleBar);

    function setStep(step) {
      stepperMount.replaceChildren(App.createStepper(step));
    }

    setStep(EasyLips.SETUP_STEPS.ACCOUNT);

    function readEmailFromView(viewName) {
      const emailInput = views[viewName]?.querySelector(
        'input[type="email"], input[name="email"]',
      );
      const value = emailInput?.value.trim();
      return value || state.email;
    }

    function goToVerifyEmail({ returnView }) {
      state.email = readEmailFromView(returnView);
      state.verifyReturnView = returnView;
      showView(VIEWS.VERIFY_EMAIL);
    }

    function goToMicrophone({ returnView = VIEWS.ACCOUNT_OPTIONS } = {}) {
      state.microphoneReturnView = returnView;
      showView(VIEWS.MICROPHONE);
    }

    function goToLanguages() {
      showView(VIEWS.LANGUAGES);
    }

    function goToReady() {
      showView(VIEWS.READY);
    }

    let micCleanup = null;
    let liveBridge = null;
    let listenBridge = null;
    let detectBridge = null;
    let livePanel = null;

    function syncTrayControls() {
      window.electronAPI?.updateTrayState?.({
        speakLanguage: state.speakLanguage,
        translateLanguage: state.translateLanguage,
        speakAutoDetect: state.speakAutoDetect,
        languages: EasyLips.LANGUAGES,
        isRunning: liveBridge?.isRunning?.() === true || listenBridge?.isRunning?.() === true,
        remainingSeconds: state.remainingTranslationSeconds,
      });
    }

    function formatRemainingMinutes() {
      return Math.max(0, Math.ceil(state.remainingTranslationSeconds / 60));
    }

    function deductSpeechTime(durationSeconds = 0) {
      if (state.remainingTranslationSeconds <= 0) return;

      const previousMinute = formatRemainingMinutes();
      state.remainingTranslationSeconds = Math.max(
        0,
        state.remainingTranslationSeconds - durationSeconds,
      );
      const nextMinute = formatRemainingMinutes();

      if (nextMinute !== previousMinute || state.remainingTranslationSeconds === 0) {
        syncTrayControls();
        if (activeView === VIEWS.READY) {
          views[VIEWS.READY] = refreshReadyView();
          viewMount.replaceChildren(views[VIEWS.READY]);
          views[VIEWS.READY].classList.add("view--visible");
        }
      }

      if (state.remainingTranslationSeconds <= 0) {
        stopGeminiLiveTranslation();
      }
    }

    function refreshLanguagesView() {
      const nextView = App.createLanguagesView({
        speakLanguage: state.speakLanguage,
        translateLanguage: state.translateLanguage,
        speakAutoDetect: state.speakAutoDetect,
        inputDeviceId: state.inputDeviceId,
        testOutputDeviceId: state.testOutputDeviceId,
        onBack: () => showView(VIEWS.MICROPHONE),
        onContinue: () => goToReady(),
        onSpeakChange: (language) => {
          state.speakLanguage = language;
          syncTrayControls();
        },
        onSpeakDetected: (language) => {
          state.detectedSpeakLanguage = language;
          state.speakLanguage = language;
          syncTrayControls();
        },
        onTranslateChange: (language) => {
          state.translateLanguage = language;
          syncTrayControls();
        },
        onSpeakAutoDetectChange: (enabled) => {
          state.speakAutoDetect = enabled;
          if (!enabled) {
            state.detectedSpeakLanguage = "";
          }
          syncTrayControls();
        },
        onDetectLanguage: startGeminiLanguageDetection,
        onStopDetection: stopGeminiLanguageDetection,
        onTestInputChange: (device) => {
          state.inputDeviceId = device.id;
          state.inputDeviceLabel = device.label;
          syncTrayControls();
        },
        onTestOutputChange: (device) => {
          state.testOutputDeviceId = device.id;
          state.testOutputDeviceLabel = device.label;
        },
        onStartTest: startGeminiTestTranslation,
        onStopTest: stopGeminiLiveTranslation,
      });

      views[VIEWS.LANGUAGES] = nextView;
      livePanel = nextView.querySelector(".gemini-live-panel");
      return nextView;
    }

    async function startGeminiLiveTranslation({
      inputDeviceId,
      speakLanguage,
      translateLanguage,
      speakAutoDetect,
      outputDeviceId = state.outputDeviceId,
      persistOutputDevice = true,
      setStatus,
      setDetectedLanguage,
      setTranscripts,
    }) {
      if (liveBridge?.isRunning()) {
        return { ok: false, message: "Live translation is already running." };
      }

      if (state.remainingTranslationSeconds <= 0) {
        return { ok: false, message: "You have no translation minutes remaining." };
      }

      liveBridge?.stop();
      stopGeminiLanguageDetection();

      const targetLanguageCode = EasyLips.getLanguageCode(translateLanguage);
      if (!targetLanguageCode) {
        return { ok: false, message: "Choose a supported target language." };
      }

      const sourceLanguageCode = speakAutoDetect
        ? "auto"
        : EasyLips.getLanguageCode(speakLanguage);

      if (!speakAutoDetect && !sourceLanguageCode) {
        return { ok: false, message: "Choose a supported spoken language." };
      }

      const playbackOutput = await EasyLips.resolveOutputDeviceForPlayback?.(
        outputDeviceId,
      );

      if (playbackOutput && !playbackOutput.ok) {
        return {
          ok: false,
          message:
            "No virtual mic cable is installed yet. Install a virtual audio cable, restart the app, then choose it as the Easy Lips output.",
        };
      }

      if (playbackOutput?.ok && persistOutputDevice) {
        state.outputDeviceId = playbackOutput.deviceId;
        state.outputDeviceLabel = playbackOutput.label;
        state.outputVirtualReady = playbackOutput.virtual ? playbackOutput.installed === true : true;
        state.outputMeetingMicLabel = playbackOutput.meetingMicLabel || playbackOutput.label;
        syncTrayControls();
      }

      liveBridge = App.createGeminiLiveBridge({
        onStatus: (type, data) => {
          if (type === "connected") {
            setStatus?.("success", `Live translation active. Target: ${translateLanguage}.`);
            syncTrayControls();
          } else if (type === "disconnected" || type === "stopped") {
            const failed = type === "disconnected" && data?.ok === false;
            livePanel?.setRunning?.(false);
            setStatus?.(
              failed ? "error" : "idle",
              failed ? data.message || "Gemini Live session closed." : "Live translation stopped.",
            );
            syncTrayControls();
          }
        },
        onInputTranscript: (text) => {
          setTranscripts?.(text, undefined);
        },
        onOutputTranscript: (text) => {
          setTranscripts?.(undefined, text);
        },
        onDetectedLanguage: (language) => {
          state.detectedSpeakLanguage = language;
          state.speakLanguage = language;
          setDetectedLanguage?.(language);
          syncTrayControls();
        },
        onSpeechActivity: ({ speaking, durationSeconds }) => {
          if (speaking) {
            deductSpeechTime(durationSeconds);
          }
        },
        onError: (error) => {
          setStatus?.("error", error?.message || "Live translation error.");
          livePanel?.setRunning?.(false);
          syncTrayControls();
        },
      });

      const result = await liveBridge.start({
        deviceId: inputDeviceId,
        outputDeviceId: playbackOutput?.deviceId || outputDeviceId,
        targetLanguageCode,
        sourceLanguageCode,
      });

      if (!result?.ok) {
        liveBridge = null;
      }

      return result;
    }

    function resolveListenTargetLanguage() {
      return state.detectedSpeakLanguage || state.speakLanguage || "Urdu";
    }

    async function startGeminiListenTranslation({ setStatus } = {}) {
      if (!state.listenEnabled) {
        return { ok: true, skipped: true };
      }

      if (listenBridge?.isRunning()) {
        return { ok: false, message: "Headphone translation is already running." };
      }

      if (state.remainingTranslationSeconds <= 0) {
        return { ok: false, message: "You have no translation minutes remaining." };
      }

      const targetLanguage = resolveListenTargetLanguage();
      const targetLanguageCode = EasyLips.getLanguageCode(targetLanguage);
      const sourceLanguageCode = EasyLips.getLanguageCode(state.translateLanguage) || "auto";

      if (!targetLanguageCode) {
        return { ok: false, message: "Choose your language before starting headphone translation." };
      }

      const playbackOutput = await EasyLips.resolveOutputDeviceForPlayback?.(
        state.listenOutputDeviceId,
      );

      if (playbackOutput && !playbackOutput.ok) {
        return {
          ok: false,
          message: "Choose headphones or speakers for incoming translated audio.",
        };
      }

      if (playbackOutput?.ok) {
        state.listenOutputDeviceId = playbackOutput.deviceId;
        state.listenOutputDeviceLabel = playbackOutput.label;
      }

      listenBridge = App.createGeminiLiveBridge({
        onStatus: (type, data) => {
          if (type === "connected") {
            setStatus?.("success", `Headphone translation active. Target: ${targetLanguage}.`);
            syncTrayControls();
          } else if (type === "disconnected" || type === "stopped") {
            const failed = type === "disconnected" && data?.ok === false;
            setStatus?.(
              failed ? "error" : "idle",
              failed ? data.message || "Headphone translation closed." : "Headphone translation stopped.",
            );
            syncTrayControls();
          }
        },
        onSpeechActivity: ({ speaking, durationSeconds }) => {
          if (speaking) {
            deductSpeechTime(durationSeconds);
          }
        },
        onError: (error) => {
          setStatus?.("error", error?.message || "Headphone translation error.");
          syncTrayControls();
        },
      });

      const result = await listenBridge.start({
        deviceId: state.listenInputDeviceId,
        outputDeviceId: playbackOutput?.deviceId || state.listenOutputDeviceId,
        targetLanguageCode,
        sourceLanguageCode,
      });

      if (!result?.ok) {
        listenBridge = null;
      }

      return result;
    }

    function stopGeminiLiveTranslation() {
      liveBridge?.stop();
      liveBridge = null;
      listenBridge?.stop();
      listenBridge = null;
      syncTrayControls();
    }

    async function startConfiguredTranslations({ setStatus, setDetectedLanguage, setTranscripts } = {}) {
      if (liveBridge?.isRunning() || listenBridge?.isRunning()) {
        return { ok: true, message: "Live translation is already active." };
      }

      const voiceResult = await startGeminiLiveTranslation({
        inputDeviceId: state.inputDeviceId,
        speakLanguage: state.speakLanguage,
        translateLanguage: state.translateLanguage,
        speakAutoDetect: state.speakAutoDetect,
        setStatus,
        setDetectedLanguage,
        setTranscripts,
      });

      if (!voiceResult?.ok) {
        return voiceResult;
      }

      const listenResult = await startGeminiListenTranslation({ setStatus });
      if (!listenResult?.ok) {
        stopGeminiLiveTranslation();
        return listenResult;
      }

      return { ok: true };
    }

    async function startGeminiLanguageDetection({
      inputDeviceId,
      targetLanguage,
      setStatus,
      setDetectedLanguage,
      setSample,
    }) {
      if (liveBridge?.isRunning() || listenBridge?.isRunning()) {
        return { ok: false, message: "Stop live translation before detecting again." };
      }

      stopGeminiLanguageDetection();

      const targetLanguageCode = EasyLips.getLanguageCode(targetLanguage) || "en";
      detectBridge = App.createGeminiLiveBridge({
        onStatus: (type, data) => {
          if (type === "connected") {
            setStatus?.("loading", "Listening for a short phrase...");
          } else if (type === "disconnected" || type === "stopped") {
            const failed = type === "disconnected" && data?.ok === false;
            if (failed) {
              setStatus?.("error", data.message || "Gemini detection session closed.");
            }
          }
        },
        onInputTranscript: (text) => {
          setSample?.(text);
        },
        onDetectedLanguage: (language) => {
          state.detectedSpeakLanguage = language;
          state.speakLanguage = language;
          setDetectedLanguage?.(language);
          stopGeminiLanguageDetection();
        },
        onError: (error) => {
          setStatus?.("error", error?.message || "Language detection error.");
          stopGeminiLanguageDetection();
        },
      });

      const result = await detectBridge.start({
        deviceId: inputDeviceId,
        outputDeviceId: state.outputDeviceId,
        targetLanguageCode,
        sourceLanguageCode: "auto",
        muteOutput: true,
      });

      if (!result?.ok) {
        detectBridge = null;
      }

      return result;
    }

    function stopGeminiLanguageDetection() {
      detectBridge?.stop();
      detectBridge = null;
    }

    async function startGeminiTestTranslation({
      inputDeviceId,
      outputDeviceId,
      speakLanguage,
      translateLanguage,
      speakAutoDetect,
      setStatus,
      setDetectedLanguage,
      setTranscripts,
    }) {
      return startGeminiLiveTranslation({
        inputDeviceId,
        outputDeviceId,
        speakLanguage,
        translateLanguage,
        speakAutoDetect,
        persistOutputDevice: false,
        setStatus,
        setDetectedLanguage,
        setTranscripts,
      });
    }

    function refreshMicrophoneView() {
      const nextView = App.createMicrophoneView({
        inputDeviceId: state.inputDeviceId,
        outputDeviceId: state.outputDeviceId,
        listenInputDeviceId: state.listenInputDeviceId,
        listenOutputDeviceId: state.listenOutputDeviceId,
        listenEnabled: state.listenEnabled,
        onBack: () => showView(state.microphoneReturnView),
        onContinue: () => goToLanguages(),
        onInputChange: (device) => {
          state.inputDeviceId = device.id;
          state.inputDeviceLabel = device.label;
          syncTrayControls();
        },
        onOutputChange: (device) => {
          state.outputDeviceId = device.id;
          state.outputDeviceLabel = device.label;
          state.outputVirtualReady = device.virtual ? device.installed === true : true;
          state.outputMeetingMicLabel = device.meetingMicLabel || device.label;
          syncTrayControls();
        },
        onListenInputChange: (device) => {
          state.listenInputDeviceId = device.id;
          state.listenInputDeviceLabel = device.label;
          state.listenInputSource = device.source || "device";
          syncTrayControls();
        },
        onListenOutputChange: (device) => {
          state.listenOutputDeviceId = device.id;
          state.listenOutputDeviceLabel = device.label;
          syncTrayControls();
        },
        onListenEnabledChange: (enabled) => {
          state.listenEnabled = enabled;
          syncTrayControls();
        },
      });

      views[VIEWS.MICROPHONE] = nextView;
      return nextView;
    }

    function refreshReadyView() {
      const nextView = App.createReadyView({
        summaryRows: EasyLips.buildReadySummaryRows(state),
        outputVirtualReady: state.outputVirtualReady,
        outputMeetingMicLabel: state.outputMeetingMicLabel,
        listenEnabled: state.listenEnabled,
        listenOutputDeviceLabel: state.listenOutputDeviceLabel,
        onBack: () => showView(VIEWS.LANGUAGES),
        onStart: async ({ setStatus } = {}) => {
          if (liveBridge?.isRunning() || listenBridge?.isRunning()) {
            setStatus?.("success", "Live translation is already active.");
            window.setTimeout(() => window.electronAPI?.hideToTray?.(), 350);
            return { ok: true };
          }

          const result = await startConfiguredTranslations({
            setStatus,
            setDetectedLanguage: (language) => {
              state.detectedSpeakLanguage = language;
              state.speakLanguage = language;
              setStatus?.("success", `Live translation active. Detected ${language}.`);
            },
            setTranscripts: () => {},
          });

          if (result?.ok) {
            setStatus?.("success", "Live translation active. Easy Lips is running in the system tray.");
            window.setTimeout(() => window.electronAPI?.hideToTray?.(), 450);
          }

          return result;
        },
      });

      views[VIEWS.READY] = nextView;
      return nextView;
    }

    async function startTranslationFromTray() {
      if (liveBridge?.isRunning() || listenBridge?.isRunning()) {
        syncTrayControls();
        return { ok: true };
      }

      const result = await startConfiguredTranslations({
        setStatus: () => {},
        setDetectedLanguage: (language) => {
          state.detectedSpeakLanguage = language;
          state.speakLanguage = language;
          syncTrayControls();
        },
        setTranscripts: () => {},
      });

      syncTrayControls();
      return result;
    }

    async function restartTranslationIfRunning() {
      if (!liveBridge?.isRunning() && !listenBridge?.isRunning()) {
        syncTrayControls();
        return;
      }

      stopGeminiLiveTranslation();
      await startTranslationFromTray();
    }

    function refreshVisibleLanguageState() {
      if (activeView === VIEWS.LANGUAGES || activeView === VIEWS.READY) {
        const name = activeView;
        views[name]?.cleanup?.();
        activeView = null;
        showView(name);
      }
    }

    async function handleTrayCommand(command = {}) {
      if (command.type === "toggle-translation") {
        if (liveBridge?.isRunning()) {
          stopGeminiLiveTranslation();
        } else {
          await startTranslationFromTray();
        }
        return;
      }

      if (command.type === "start-translation") {
        await startTranslationFromTray();
        return;
      }

      if (command.type === "stop-translation") {
        stopGeminiLiveTranslation();
        return;
      }

      if (command.type === "open-language-settings") {
        showView(VIEWS.LANGUAGES);
        return;
      }

      if (command.type === "set-speak-autodetect") {
        state.speakAutoDetect = command.enabled !== false;
        if (state.speakAutoDetect) {
          state.detectedSpeakLanguage = "";
        }
        syncTrayControls();
        refreshVisibleLanguageState();
        await restartTranslationIfRunning();
        return;
      }

      if (command.type === "set-speak-language" && command.language) {
        state.speakAutoDetect = false;
        state.speakLanguage = command.language;
        state.detectedSpeakLanguage = "";
        syncTrayControls();
        refreshVisibleLanguageState();
        await restartTranslationIfRunning();
        return;
      }

      if (command.type === "set-translate-language" && command.language) {
        state.translateLanguage = command.language;
        syncTrayControls();
        refreshVisibleLanguageState();
        await restartTranslationIfRunning();
      }
    }

    window.electronAPI?.onTrayCommand?.((command) => {
      handleTrayCommand(command);
    });
    syncTrayControls();

    let updateDownloadToastShown = false;
    window.electronAPI?.onUpdateEvent?.((event = {}) => {
      if (event.type === "available") {
        updateDownloadToastShown = false;
        App.toast?.({
          title: "Update available",
          message: event.version
            ? `EasyLips ${event.version} is ready to download.`
            : "A new EasyLips update is ready to download.",
          type: "info",
          actions: [
            {
              label: "Download update",
              onClick: () => {
                App.toast?.({
                  title: "Downloading update",
                  message: "EasyLips will let you know when it is ready to install.",
                  type: "info",
                });
                return window.electronAPI?.downloadUpdate?.();
              },
            },
          ],
        });
        return;
      }

      if (event.type === "downloading" && !updateDownloadToastShown) {
        updateDownloadToastShown = true;
        App.toast?.({
          title: "Downloading update",
          message: "You can keep using EasyLips while the update downloads.",
          type: "info",
        });
        return;
      }

      if (event.type === "downloaded") {
        App.toast?.({
          title: "Update ready",
          message: "Restart EasyLips to install the latest version.",
          type: "success",
          actions: [
            {
              label: "Restart now",
              onClick: () => window.electronAPI?.installUpdate?.(),
            },
          ],
        });
      }
    });

    const views = {
      [VIEWS.ACCOUNT_OPTIONS]: App.createAccountOptionsView({
        onEmailClick: () => showView(VIEWS.EMAIL_FORM),
        onGoogleClick: async () => {
          const result = await App.auth.google();
          state.email = result?.user?.email || state.email;
          goToMicrophone({ returnView: VIEWS.ACCOUNT_OPTIONS });
          return result;
        },
        onSignInClick: () => showView(VIEWS.SIGN_IN_FORM),
      }),
      [VIEWS.EMAIL_FORM]: App.createEmailFormView({
        onBack: () => showView(VIEWS.ACCOUNT_OPTIONS),
        onSignInClick: () => showView(VIEWS.SIGN_IN_FORM),
        onContinue: () => goToMicrophone({ returnView: VIEWS.EMAIL_FORM }),
      }),
      [VIEWS.SIGN_IN_FORM]: App.createSignInFormView({
        onBack: () => showView(VIEWS.ACCOUNT_OPTIONS),
        onSignUpClick: () => showView(VIEWS.EMAIL_FORM),
        onForgotPassword: () => goToVerifyEmail({ returnView: VIEWS.SIGN_IN_FORM }),
        onSignIn: () => goToMicrophone({ returnView: VIEWS.SIGN_IN_FORM }),
      }),
      [VIEWS.VERIFY_EMAIL]: App.createVerifyEmailView({
        email: state.email,
        onBack: () => showView(state.verifyReturnView),
        onChangeEmail: () => showView(state.verifyReturnView),
        onVerify: () => goToMicrophone({ returnView: VIEWS.VERIFY_EMAIL }),
        onMagicLink: () => goToMicrophone({ returnView: VIEWS.VERIFY_EMAIL }),
        onResend: () => {},
      }),
    };

    let activeView = null;

    function refreshVerifyEmailView() {
      const nextView = App.createVerifyEmailView({
        email: state.email,
        onBack: () => showView(state.verifyReturnView),
        onChangeEmail: () => showView(state.verifyReturnView),
        onVerify: () => goToMicrophone({ returnView: VIEWS.VERIFY_EMAIL }),
        onMagicLink: () => goToMicrophone({ returnView: VIEWS.VERIFY_EMAIL }),
        onResend: () => {},
      });

      views[VIEWS.VERIFY_EMAIL] = nextView;
      return nextView;
    }

    function updateMainLayout(viewName) {
      mainEl?.classList.toggle("main--languages", viewName === VIEWS.LANGUAGES);
      mainEl?.classList.toggle("main--microphone", viewName === VIEWS.MICROPHONE);
      mainEl?.classList.toggle("main--ready", viewName === VIEWS.READY);
    }

    function showView(name) {
      if (activeView === name) return;

      micCleanup?.();
      micCleanup = null;
      views[activeView]?.cleanup?.();

      if (activeView === VIEWS.LANGUAGES && name !== VIEWS.LANGUAGES) {
        stopGeminiLanguageDetection();
        stopGeminiLiveTranslation();
      }

      if (name === VIEWS.VERIFY_EMAIL) {
        views[VIEWS.VERIFY_EMAIL] = refreshVerifyEmailView();
      }

      if (name === VIEWS.LANGUAGES) {
        views[VIEWS.LANGUAGES] = refreshLanguagesView();
      }

      if (name === VIEWS.MICROPHONE) {
        views[VIEWS.MICROPHONE] = refreshMicrophoneView();
      }

      if (name === VIEWS.READY) {
        views[VIEWS.READY] = refreshReadyView();
      }

      const nextView = views[name];
      const isFirstView = activeView === null;

      if (!isFirstView) {
        nextView.classList.remove("view--visible");
      }

      viewMount.replaceChildren(nextView);
      setStep(STEP_BY_VIEW[name] || EasyLips.SETUP_STEPS.ACCOUNT);
      updateMainLayout(name);

      if (name === VIEWS.MICROPHONE) {
        micCleanup = App.bindMicrophoneView(nextView, state);
      }

      if (isFirstView) {
        nextView.classList.add("view--visible");
      } else {
        requestAnimationFrame(() => {
          nextView.classList.add("view--visible");

          if (FORM_VIEWS.has(name)) {
            App.playFieldStagger(nextView);
          }

          if (name === VIEWS.VERIFY_EMAIL) {
            nextView.querySelector(".otp-digit")?.focus();
          }
        });
      }

      activeView = name;
    }

    showView(VIEWS.ACCOUNT_OPTIONS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window.EasyLips);
