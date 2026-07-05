window.EasyLips = window.EasyLips || {};

(function (App) {
  App.createSetupActions = function createSetupActions({
    onBack,
    onContinue,
    continueLabel,
  } = {}) {
    const actions = document.createElement("div");
    actions.className = "setup-actions";

    actions.appendChild(App.createBackLink({ label: "Back", onClick: onBack }));
    actions.appendChild(
      App.createPrimaryButton({
        className: "primary-btn--inline",
        label: continueLabel,
        onClick: onContinue,
      }),
    );

    return actions;
  };

  App.createSetupStepView = function createSetupStepView({
    viewName,
    contentClass = "",
    tag,
    heading,
    subheading,
    body = null,
    footerNode = null,
    onBack,
    onContinue,
    continueLabel,
  }) {
    const view = document.createElement("div");
    view.className = "view";
    view.dataset.view = viewName;

    const content = document.createElement("div");
    content.className = ["content", contentClass].filter(Boolean).join(" ");

    content.appendChild(App.createStepHeader({ tag, heading, subheading }));

    if (body) {
      content.appendChild(body);
    }

    if (footerNode) {
      content.appendChild(footerNode);
    }

    content.appendChild(
      App.createSetupActions({ onBack, onContinue, continueLabel }),
    );

    view.appendChild(content);
    return view;
  };

  App.formatStepTag = function formatStepTag(stepNumber) {
    return `STEP ${stepNumber}`;
  };
})(window.EasyLips);
