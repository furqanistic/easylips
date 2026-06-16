window.EasyLips = window.EasyLips || {};

(function (App) {
  const { icons } = App;
  const STEP = EasyLips.SETUP_STEPS.ACCOUNT;
  const stepTag = App.formatStepTag(STEP);

  App.createAccountOptionsView = function createAccountOptionsView({
    onEmailClick,
    onSignInClick,
  }) {
    const view = document.createElement("div");
    view.className = "view";
    view.dataset.view = "account-options";

    const content = document.createElement("div");
    content.className = "content";

    content.appendChild(
      App.createStepHeader({
        tag: stepTag,
        heading: "Create your account",
        subheading: "Sign in to continue with setup.",
      }),
    );

    content.appendChild(
      App.createCard([
        App.createAuthButton({
          label: "Continue with Google",
          icon: icons.google,
        }),
        App.createAuthButton({
          label: "Continue with Email",
          icon: icons.email,
          onClick: onEmailClick,
        }),
        App.createDivider(),
        App.createSignInPrompt(onSignInClick),
      ]),
    );

    view.appendChild(content);
    return view;
  };

  App.createEmailFormView = function createEmailFormView({
    onBack,
    onSignInClick,
    onContinue,
  }) {
    const view = document.createElement("div");
    view.className = "view";
    view.dataset.view = "email-form";

    const content = document.createElement("div");
    content.className = "content";

    content.appendChild(
      App.createStepHeader({
        tag: stepTag,
        heading: "Continue with email",
        subheading: "Create your account with email to continue setup.",
      }),
    );

    const fieldGroup = App.createFieldGroup([
      App.createTextField({
        id: "full-name",
        name: "fullName",
        label: "Full name",
        placeholder: "Full name",
        autocomplete: "name",
      }),
      App.createTextField({
        id: "email",
        name: "email",
        type: "email",
        label: "Email address",
        placeholder: "Email address",
        autocomplete: "email",
      }),
      App.createTextField({
        id: "password",
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Password",
        autocomplete: "new-password",
        trailing: App.createPasswordToggle,
      }),
    ]);

    const card = App.createCard([fieldGroup]);
    App.bindFieldFocusAnimations(fieldGroup);

    const footerLinks = document.createElement("div");
    footerLinks.className = "form-footer-links";
    footerLinks.appendChild(App.createSignInPrompt(onSignInClick));
    footerLinks.appendChild(App.createBackLink({ onClick: onBack }));

    card.appendChild(footerLinks);
    content.appendChild(card);
    content.appendChild(
      App.createPrimaryButton({
        className: "primary-btn--inline",
        onClick: onContinue,
      }),
    );

    view.appendChild(content);
    return view;
  };

  App.createSignInFormView = function createSignInFormView({
    onBack,
    onSignUpClick,
    onForgotPassword,
    onSignIn,
  }) {
    const view = document.createElement("div");
    view.className = "view";
    view.dataset.view = "sign-in-form";

    const content = document.createElement("div");
    content.className = "content";

    content.appendChild(
      App.createStepHeader({
        tag: stepTag,
        heading: "Sign in",
        subheading: "Welcome back. Sign in to continue setup.",
      }),
    );

    const fieldGroup = App.createFieldGroup([
      App.createTextField({
        id: "signin-email",
        name: "email",
        type: "email",
        label: "Email address",
        placeholder: "Email address",
        autocomplete: "email",
      }),
      App.createTextField({
        id: "signin-password",
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Password",
        autocomplete: "current-password",
        trailing: App.createPasswordToggle,
      }),
    ]);

    const card = App.createCard([fieldGroup]);
    App.bindFieldFocusAnimations(fieldGroup);

    const forgotPassword = App.createInlineLink({
      label: "Forgot password?",
      className: "inline-link inline-link--accent form-forgot-link",
      onClick: onForgotPassword,
    });

    const footerLinks = document.createElement("div");
    footerLinks.className = "form-footer-links";
    footerLinks.appendChild(App.createSignUpPrompt(onSignUpClick));
    footerLinks.appendChild(App.createBackLink({ label: "Back to options", onClick: onBack }));

    card.appendChild(forgotPassword);
    card.appendChild(footerLinks);
    content.appendChild(card);
    content.appendChild(
      App.createPrimaryButton({
        label: "Sign in",
        className: "primary-btn--inline",
        onClick: onSignIn,
      }),
    );

    view.appendChild(content);
    return view;
  };
})(window.EasyLips);
