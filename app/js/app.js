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
      translateLanguage: "English",
      speakAutoDetect: true,
      inputDeviceId: "fallback-external",
      inputDeviceLabel: "External Microphone",
      outputDeviceId: "easy-lips-virtual",
      outputDeviceLabel: "Easy Lips Virtual Mic",
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

    function refreshLanguagesView() {
      const nextView = App.createLanguagesView({
        speakLanguage: state.speakLanguage,
        translateLanguage: state.translateLanguage,
        speakAutoDetect: state.speakAutoDetect,
        onBack: () => showView(VIEWS.MICROPHONE),
        onContinue: () => goToReady(),
        onSpeakChange: (language) => {
          state.speakLanguage = language;
        },
        onTranslateChange: (language) => {
          state.translateLanguage = language;
        },
        onSpeakAutoDetectChange: (enabled) => {
          state.speakAutoDetect = enabled;
        },
      });

      views[VIEWS.LANGUAGES] = nextView;
      return nextView;
    }

    function refreshMicrophoneView() {
      const nextView = App.createMicrophoneView({
        inputDeviceId: state.inputDeviceId,
        outputDeviceId: state.outputDeviceId,
        onBack: () => showView(state.microphoneReturnView),
        onContinue: () => goToLanguages(),
        onInputChange: (device) => {
          state.inputDeviceId = device.id;
          state.inputDeviceLabel = device.label;
        },
        onOutputChange: (device) => {
          state.outputDeviceId = device.id;
          state.outputDeviceLabel = device.label;
        },
      });

      views[VIEWS.MICROPHONE] = nextView;
      return nextView;
    }

    function refreshReadyView() {
      const nextView = App.createReadyView({
        summaryRows: EasyLips.buildReadySummaryRows(state),
        onBack: () => showView(VIEWS.LANGUAGES),
        onStart: () => {
          App.showTaskbarStartPrompt();
        },
      });

      views[VIEWS.READY] = nextView;
      return nextView;
    }

    const views = {
      [VIEWS.ACCOUNT_OPTIONS]: App.createAccountOptionsView({
        onEmailClick: () => showView(VIEWS.EMAIL_FORM),
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
