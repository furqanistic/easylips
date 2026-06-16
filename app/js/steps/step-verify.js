window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.ACCOUNT;
  const stepTag = App.formatStepTag(STEP);

  App.createVerifyEmailView = function createVerifyEmailView({
    email,
    onBack,
    onChangeEmail,
    onVerify,
    onMagicLink,
    onResend,
  }) {
    const view = document.createElement("div");
    view.className = "view";
    view.dataset.view = "verify-email";

    const content = document.createElement("div");
    content.className = "content content--verify";

    content.appendChild(
      App.createStepHeader({
        tag: stepTag,
        heading: "Verify your email",
        subheading: `Enter the 6-digit code we sent to ${email}`,
      }),
    );

    const card = App.createVerifyEmailCard({
      email,
      onChangeEmail,
      onMagicLink,
      onResend,
    });

    content.appendChild(card);
    content.appendChild(
      App.createPrimaryButton({
        label: "Verify & continue",
        className: "primary-btn--inline",
        onClick: onVerify,
      }),
    );
    content.appendChild(
      App.createBackLink({ label: "Back", onClick: onBack }),
    );

    view.appendChild(content);
    return view;
  };
})(window.EasyLips);
