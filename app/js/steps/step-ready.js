window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.READY;
  const stepTag = App.formatStepTag(STEP);

  App.createReadyView = function createReadyView({
    summaryRows = [],
    onBack,
    onStart,
  }) {
    const body = document.createDocumentFragment();
    body.appendChild(App.createSetupSummaryCard(summaryRows));
    body.appendChild(
      App.createSetupTip({
        html:
          'In Zoom or Google Meet, choose <strong>Easy Lips Virtual Mic</strong> as your microphone.',
      }),
    );

    return App.createSetupStepView({
      viewName: "ready",
      contentClass: "content--ready",
      tag: stepTag,
      heading: "You're ready to go",
      subheading: "Review your setup and start translation.",
      body,
      onBack,
      onContinue: onStart,
      continueLabel: "Start translation",
    });
  };

  App.showTaskbarStartPrompt = function showTaskbarStartPrompt({ onConfirm } = {}) {
    App.showPrompt({
      title: "Easy Lips is running",
      message:
        "The app will run in your taskbar. You can switch your output mic and language from there anytime.",
      confirmLabel: "Got it",
      onConfirm,
    });
  };
})(window.EasyLips);
