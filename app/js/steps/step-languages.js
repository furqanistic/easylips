window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.LANGUAGES;
  const stepTag = App.formatStepTag(STEP);

  App.createLanguagesView = function createLanguagesView({
    speakLanguage = "Urdu",
    translateLanguage = "English",
    speakAutoDetect = true,
    onBack,
    onContinue,
    onSpeakChange,
    onTranslateChange,
    onSpeakAutoDetectChange,
  }) {
    const panels = App.createLanguagePanels({
      speakValue: speakLanguage,
      translateValue: translateLanguage,
      speakAutoDetect,
      onSpeakChange,
      onTranslateChange,
      onSpeakAutoDetectChange,
    });

    return App.createSetupStepView({
      viewName: "languages",
      contentClass: "content--languages",
      tag: stepTag,
      heading: "Choose your languages",
      subheading:
        "Select the language you speak and the language you want it translated to.",
      body: panels,
      onBack,
      onContinue,
    });
  };
})(window.EasyLips);
