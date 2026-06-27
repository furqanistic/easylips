window.EasyLips = window.EasyLips || {};

(function (App) {
  const { icons } = App;
  const STEP = EasyLips.SETUP_STEPS.ACCOUNT;
  const stepTag = App.formatStepTag(STEP);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function normalizeEmail(value = "") {
    return value.trim().toLowerCase();
  }

  function validateEmail(value) {
    const email = normalizeEmail(value);
    if (!email) return "Email address is required.";
    if (email.length > 254) return "Email address must be 254 characters or less.";
    if (!emailPattern.test(email)) return "Enter a valid email address.";
    return "";
  }

  function validatePassword(value, { signup = false } = {}) {
    if (!value) return "Password is required.";
    if (signup && value.length < 8) return "Password must be at least 8 characters.";
    if (value.length > 128) return "Password must be 128 characters or less.";
    return "";
  }

  function validateName(value) {
    const name = value.trim();
    if (!name) return "Full name is required.";
    if (name.length > 120) return "Full name must be 120 characters or less.";
    return "";
  }

  function showAuthError(error, { signup = false } = {}) {
    const duplicateEmail = signup && error?.status === 409;
    const badLogin = !signup && error?.status === 401;

    App.toast?.({
      type: "error",
      title: signup ? "Could not create account" : "Sign in failed",
      message: duplicateEmail
        ? "An account with this email already exists. Sign in instead."
        : badLogin
          ? "No matching account was found. Check your email and password."
          : error?.message || "Please check your details and try again.",
    });
  }

  App.createAccountOptionsView = function createAccountOptionsView({
    onGoogleClick,
    onSignIn,
    onCreateAccount,
    onForgotPassword,
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
        subheading: "Sign in or create an account to continue.",
      }),
    );

    const logoEl = document.createElement("div");
    logoEl.className = "card-logo";
    logoEl.innerHTML = '<img src="assets/home/logoicon.png" alt="OneLingo" />';
    content.appendChild(logoEl);

    const googleButton = App.createAuthButton({
      label: "Continue with Google",
      icon: icons.google,
      onClick: handleGoogleClick,
    });
    const googleButtonHtml = googleButton.innerHTML;

    async function handleGoogleClick() {
      googleButton.disabled = true;
      googleButton.classList.add("auth-btn--loading");
      googleButton.innerHTML = `${icons.google}<span>Opening Google...</span>`;

      try {
        const result = await onGoogleClick?.();
        App.toast?.({
          type: "success",
          title: "Signed in with Google",
          message: "Your account is ready.",
        });
        return result;
      } catch (error) {
        App.toast?.({
          type: "error",
          title: "Google sign-in failed",
          message: error?.message || "Please try again.",
        });
        return null;
      } finally {
        googleButton.disabled = false;
        googleButton.classList.remove("auth-btn--loading");
        googleButton.innerHTML = googleButtonHtml;
      }
    }

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

    const formStatus = document.createElement("p");
    formStatus.className = "form-status";
    formStatus.setAttribute("aria-live", "polite");

    const forgotPassword = App.createInlineLink({
      label: "Forgot password?",
      className: "inline-link inline-link--accent form-forgot-link",
      onClick: onForgotPassword,
    });

    const createAccountLink = document.createElement("p");
    createAccountLink.className = "sign-in-text";
    createAccountLink.append("Don't have an account? ");

    const linkBtn = document.createElement("button");
    linkBtn.type = "button";
    linkBtn.className = "sign-in-link";
    linkBtn.textContent = "Create account";
    linkBtn.addEventListener("click", () => onCreateAccount?.());
    createAccountLink.appendChild(linkBtn);

    const card = App.createCard([
      googleButton,
      App.createDivider(),
      fieldGroup,
      formStatus,
      forgotPassword,
      createAccountLink,
    ]);
    App.bindFieldFocusAnimations(fieldGroup);

    content.appendChild(card);

    const submitButton = App.createPrimaryButton({
      label: "Sign in",
      className: "primary-btn--inline",
      onClick: handleSignIn,
    });
    content.appendChild(submitButton);

    const emailInput = fieldGroup.querySelector('input[name="email"]');
    const passwordInput = fieldGroup.querySelector('input[name="password"]');

    function validate() {
      const errors = {
        email: validateEmail(emailInput.value),
        password: validatePassword(passwordInput.value),
      };

      App.setFieldError(emailInput, errors.email);
      App.setFieldError(passwordInput, errors.password);

      return !Object.values(errors).some(Boolean);
    }

    [emailInput, passwordInput].forEach((input) => {
      input.addEventListener("input", () => {
        App.setFieldError(input, "");
        formStatus.textContent = "";
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSignIn();
        }
      });
    });

    async function handleSignIn() {
      App.clearFormErrors(view);
      formStatus.textContent = "";

      if (!validate()) {
        App.toast?.({
          type: "error",
          title: "Email and password are required",
          message: "Enter your account details before continuing.",
        });
        return;
      }

      App.setButtonLoading(submitButton, true, "Signing in...");

      try {
        const result = await App.auth.login({
          email: normalizeEmail(emailInput.value),
          password: passwordInput.value,
        });
        App.toast?.({
          type: "success",
          title: "Signed in",
          message: "Welcome back.",
        });
        onSignIn?.(result);
      } catch (error) {
        if (error?.status === 401) {
          App.setFieldError(emailInput, "Account must exist before you can sign in.");
          App.setFieldError(passwordInput, "Check the password for this account.");
        }
        formStatus.textContent = error?.message || "Sign in failed.";
        showAuthError(error);
      } finally {
        App.setButtonLoading(submitButton, false);
      }
    }

    view.appendChild(content);
    return view;
  };

  App.createEmailFormView = function createEmailFormView({
    onBack,
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
        heading: "Create account",
        subheading: "Enter your details to create an account.",
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

    const formStatus = document.createElement("p");
    formStatus.className = "form-status";
    formStatus.setAttribute("aria-live", "polite");

    const card = App.createCard([fieldGroup, formStatus]);
    App.bindFieldFocusAnimations(fieldGroup);

    const footerLinks = document.createElement("div");
    footerLinks.className = "form-footer-links";
    footerLinks.appendChild(App.createBackLink({ onClick: onBack }));

    card.appendChild(footerLinks);
    content.appendChild(card);
    const submitButton = App.createPrimaryButton({
      label: "Create account",
      className: "primary-btn--inline",
      onClick: handleSignup,
    });
    content.appendChild(submitButton);

    const fullNameInput = fieldGroup.querySelector('input[name="fullName"]');
    const emailInput = fieldGroup.querySelector('input[name="email"]');
    const passwordInput = fieldGroup.querySelector('input[name="password"]');

    function validate() {
      const errors = {
        fullName: validateName(fullNameInput.value),
        email: validateEmail(emailInput.value),
        password: validatePassword(passwordInput.value, { signup: true }),
      };

      App.setFieldError(fullNameInput, errors.fullName);
      App.setFieldError(emailInput, errors.email);
      App.setFieldError(passwordInput, errors.password);

      return !Object.values(errors).some(Boolean);
    }

    [fullNameInput, emailInput, passwordInput].forEach((input) => {
      input.addEventListener("input", () => {
        App.setFieldError(input, "");
        formStatus.textContent = "";
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSignup();
        }
      });
    });

    async function handleSignup() {
      App.clearFormErrors(view);
      formStatus.textContent = "";

      if (!validate()) {
        App.toast?.({
          type: "error",
          title: "Check the highlighted fields",
          message: "Account details are required before setup can continue.",
        });
        return;
      }

      App.setButtonLoading(submitButton, true, "Creating account...");

      try {
        const result = await App.auth.signup({
          name: fullNameInput.value.trim(),
          email: normalizeEmail(emailInput.value),
          password: passwordInput.value,
        });
        App.toast?.({
          type: "success",
          title: "Account created",
          message: "Your account is ready.",
        });
        onContinue?.(result);
      } catch (error) {
        if (error?.status === 409) {
          App.setFieldError(emailInput, "An account with this email already exists.");
        }
        formStatus.textContent = error?.message || "Could not create account.";
        showAuthError(error, { signup: true });
      } finally {
        App.setButtonLoading(submitButton, false);
      }
    }

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

    const formStatus = document.createElement("p");
    formStatus.className = "form-status";
    formStatus.setAttribute("aria-live", "polite");

    const card = App.createCard([fieldGroup, formStatus]);
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
    const submitButton = App.createPrimaryButton({
      label: "Sign in",
      className: "primary-btn--inline",
      onClick: handleSignIn,
    });
    content.appendChild(submitButton);

    const emailInput = fieldGroup.querySelector('input[name="email"]');
    const passwordInput = fieldGroup.querySelector('input[name="password"]');

    function validate() {
      const errors = {
        email: validateEmail(emailInput.value),
        password: validatePassword(passwordInput.value),
      };

      App.setFieldError(emailInput, errors.email);
      App.setFieldError(passwordInput, errors.password);

      return !Object.values(errors).some(Boolean);
    }

    [emailInput, passwordInput].forEach((input) => {
      input.addEventListener("input", () => {
        App.setFieldError(input, "");
        formStatus.textContent = "";
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSignIn();
        }
      });
    });

    async function handleSignIn() {
      App.clearFormErrors(view);
      formStatus.textContent = "";

      if (!validate()) {
        App.toast?.({
          type: "error",
          title: "Email and password are required",
          message: "Enter your account details before continuing.",
        });
        return;
      }

      App.setButtonLoading(submitButton, true, "Signing in...");

      try {
        const result = await App.auth.login({
          email: normalizeEmail(emailInput.value),
          password: passwordInput.value,
        });
        App.toast?.({
          type: "success",
          title: "Signed in",
          message: "Welcome back.",
        });
        onSignIn?.(result);
      } catch (error) {
        if (error?.status === 401) {
          App.setFieldError(emailInput, "Account must exist before you can sign in.");
          App.setFieldError(passwordInput, "Check the password for this account.");
        }
        formStatus.textContent = error?.message || "Sign in failed.";
        showAuthError(error);
      } finally {
        App.setButtonLoading(submitButton, false);
      }
    }

    view.appendChild(content);
    return view;
  };
})(window.EasyLips);
