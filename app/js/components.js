window.EasyLips = window.EasyLips || {};

(function (App) {
  const { icons } = App;

  const STEPS = EasyLips.SETUP_STEP_LABELS;

  App.createTitleBar = function createTitleBar() {
    const el = document.createElement("header");
    el.className = "titlebar";
    el.innerHTML = `
      <div class="logo">
        ${icons.logo}
        <span class="logo-text">Easy Lips</span>
      </div>
      <div class="window-controls">
        <button class="window-btn minimize" type="button" aria-label="Minimize">${icons.minimize}</button>
        <button class="window-btn close" type="button" aria-label="Close">${icons.close}</button>
      </div>
    `;
    return el;
  };

  App.createStepper = function createStepper(activeStep = 1) {
    const el = document.createElement("div");
    el.className = "stepper";

    STEPS.forEach((step, index) => {
      const stepNumber = index + 1;

      if (index > 0) {
        const line = document.createElement("div");
        line.className = `step-line ${index < activeStep ? "active" : "inactive"}`;
        el.appendChild(line);
      }

      const stepEl = document.createElement("div");
      let state = "upcoming";
      if (stepNumber < activeStep) state = "completed";
      else if (stepNumber === activeStep) state = "active";

      stepEl.className = `step step--${state}`;
      stepEl.innerHTML = `
        <div class="step-circle">${stepNumber}</div>
        <span class="step-label">${step.label}</span>
      `;
      el.appendChild(stepEl);
    });

    return el;
  };

  App.createStepHeader = function createStepHeader({ tag, heading, subheading }) {
    const el = document.createElement("div");
    el.className = "content-header";
    el.innerHTML = `
      <p class="step-tag">${tag}</p>
      <h1 class="heading">${heading}</h1>
      <p class="subheading">${subheading}</p>
    `;
    return el;
  };

  App.createCard = function createCard(children = [], className = "") {
    const el = document.createElement("div");
    el.className = `card${className ? ` ${className}` : ""}`.trim();
    children.forEach((child) => el.appendChild(child));
    return el;
  };

  App.createTextField = function createTextField({
    id,
    name,
    type = "text",
    label,
    placeholder,
    autocomplete,
    trailing = null,
  }) {
    const field = document.createElement("div");
    field.className = "field";

    const labelEl = document.createElement("label");
    labelEl.className = "field-label";
    labelEl.htmlFor = id;
    labelEl.textContent = label || placeholder;

    const wrap = document.createElement("div");
    wrap.className = "field-input-wrap";

    const input = document.createElement("input");
    input.className = `field-input${trailing ? " has-trailing" : ""}`;
    input.id = id;
    input.name = name;
    input.type = type;
    input.placeholder = " ";
    if (autocomplete) input.autocomplete = autocomplete;

    const syncFilled = () => {
      field.classList.toggle("field--filled", input.value.trim().length > 0);
    };

    input.addEventListener("input", syncFilled);
    syncFilled();

    wrap.appendChild(input);

    if (trailing) {
      wrap.appendChild(trailing(input));
    }

    field.appendChild(labelEl);
    field.appendChild(wrap);
    return field;
  };

  App.setFieldError = function setFieldError(input, message = "") {
    if (!input) return;

    const field = input.closest(".field");
    if (!field) return;

    let error = field.querySelector(".field-error");
    if (!error) {
      error = document.createElement("p");
      error.className = "field-error";
      error.id = `${input.id || input.name}-error`;
      field.appendChild(error);
    }

    if (message) {
      field.classList.add("field--error");
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", error.id);
      error.textContent = message;
      return;
    }

    field.classList.remove("field--error");
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    error.textContent = "";
  };

  App.clearFormErrors = function clearFormErrors(root) {
    root?.querySelectorAll(".field-input").forEach((input) => {
      App.setFieldError(input, "");
    });
  };

  App.createFieldGroup = function createFieldGroup(fields = []) {
    const group = document.createElement("div");
    group.className = "field-group";
    fields.forEach((field) => group.appendChild(field));
    return group;
  };

  App.bindFieldFocusAnimations = function bindFieldFocusAnimations(container) {
    const group = container.classList.contains("field-group")
      ? container
      : container.querySelector(".field-group");

    if (!group) return;

    const fields = [...group.querySelectorAll(".field")];

    fields.forEach((field) => {
      const input = field.querySelector(".field-input");
      if (!input) return;

      input.addEventListener("focus", () => {
        field.classList.add("field--active");
      });

      input.addEventListener("blur", () => {
        field.classList.remove("field--active");
      });
    });
  };

  App.playFieldStagger = function playFieldStagger(container) {
    const fields = [...container.querySelectorAll(".field")];

    fields.forEach((field) => {
      field.classList.remove("field--reveal");
      field.style.animationDelay = "";
    });

    void container.offsetWidth;

    fields.forEach((field, index) => {
      field.style.animationDelay = `${120 + index * 90}ms`;
      field.classList.add("field--reveal");
    });
  };

  App.createPasswordToggle = function createPasswordToggle(input) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "field-trailing";
    btn.setAttribute("aria-label", "Toggle password visibility");
    btn.innerHTML = icons.eye;

    let visible = false;

    btn.addEventListener("click", () => {
      visible = !visible;
      input.type = visible ? "text" : "password";
      btn.innerHTML = visible ? icons.eyeOff : icons.eye;
      btn.setAttribute(
        "aria-label",
        visible ? "Hide password" : "Show password",
      );
    });

    return btn;
  };

  App.createAuthButton = function createAuthButton({ label, icon, onClick }) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "auth-btn";
    btn.innerHTML = `${icon}<span>${label}</span>`;
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  };

  App.createDivider = function createDivider(text = "or") {
    const el = document.createElement("div");
    el.className = "divider";
    el.innerHTML = `
      <span class="divider-line"></span>
      <span class="divider-text">${text}</span>
      <span class="divider-line"></span>
    `;
    return el;
  };

  App.createSignInPrompt = function createSignInPrompt(onSignIn) {
    const el = document.createElement("p");
    el.className = "sign-in-text";
    el.append("Already have an account? ");

    const link = document.createElement("button");
    link.type = "button";
    link.className = "sign-in-link";
    link.textContent = "Sign in";
    link.addEventListener("click", () => onSignIn?.());

    el.appendChild(link);
    return el;
  };

  App.createSignUpPrompt = function createSignUpPrompt(onSignUp) {
    const el = document.createElement("p");
    el.className = "sign-in-text";
    el.append("Don't have an account? ");

    const link = document.createElement("button");
    link.type = "button";
    link.className = "sign-in-link";
    link.textContent = "Sign up";
    link.addEventListener("click", () => onSignUp?.());

    el.appendChild(link);
    return el;
  };

  App.createBackLink = function createBackLink({ label = "Back to options", onClick }) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-link";
    btn.innerHTML = `${icons.arrowLeft}<span>${label}</span>`;
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  };

  App.createPrimaryButton = function createPrimaryButton({
    label = "Continue",
    className = "",
    onClick,
  }) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `primary-btn ${className}`.trim();
    btn.innerHTML = `${label}${icons.arrowRight}`;
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  };

  App.setButtonLoading = function setButtonLoading(button, loading, label = "Please wait") {
    if (!button) return;

    if (loading) {
      button.dataset.originalHtml = button.innerHTML;
      button.disabled = true;
      button.classList.add("primary-btn--loading");
      button.innerHTML = `<span>${label}</span>`;
      return;
    }

    button.disabled = false;
    button.classList.remove("primary-btn--loading");
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
      delete button.dataset.originalHtml;
    }
  };

  App.createInlineLink = function createInlineLink({
    label,
    className = "inline-link",
    underline = false,
    onClick,
  }) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `${className}${underline ? " inline-link--underline" : ""}`.trim();
    btn.textContent = label;
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  };

  App.createEmailRecipientRow = function createEmailRecipientRow({
    email,
    onChangeEmail,
  }) {
    const row = document.createElement("div");
    row.className = "email-recipient-row";

    const leading = document.createElement("div");
    leading.className = "email-recipient-leading";
    leading.innerHTML = icons.email;

    const address = document.createElement("span");
    address.className = "email-recipient-address";
    address.textContent = email;

    const change = App.createInlineLink({
      label: "Change email",
      className: "inline-link inline-link--accent",
      onClick: onChangeEmail,
    });

    row.append(leading, address, change);
    return row;
  };

  App.createOtpInput = function createOtpInput({
    id = "otp",
    length = 6,
    name = "otp",
  } = {}) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "otp-input";
    fieldset.setAttribute("aria-label", "Verification code");

    const group = document.createElement("div");
    group.className = "otp-input-group";
    group.setAttribute("role", "group");

    for (let index = 0; index < length; index += 1) {
      const input = document.createElement("input");
      input.className = "otp-digit";
      input.type = "text";
      input.inputMode = "numeric";
      input.pattern = "[0-9]*";
      input.maxLength = 1;
      input.autocomplete = index === 0 ? "one-time-code" : "off";
      input.id = `${id}-${index + 1}`;
      input.name = `${name}-${index + 1}`;
      input.setAttribute("aria-label", `Digit ${index + 1} of ${length}`);
      group.appendChild(input);
    }

    fieldset.appendChild(group);
    return fieldset;
  };

  App.createResendRow = function createResendRow() {
    const row = document.createElement("div");
    row.className = "resend-row";

    const copy = document.createElement("p");
    copy.className = "resend-copy";
    copy.append("Didn't get the code? ");

    const resend = document.createElement("button");
    resend.type = "button";
    resend.className = "resend-link";
    resend.textContent = "Resend";

    const timer = document.createElement("span");
    timer.className = "resend-timer";
    timer.setAttribute("aria-live", "polite");
    timer.textContent = "00:24";

    copy.appendChild(resend);
    row.append(copy, timer);
    return row;
  };

  App.createVerifyEmailCard = function createVerifyEmailCard({
    email,
    onChangeEmail,
    onMagicLink,
    onResend,
  }) {
    const card = App.createCard([], "verify-card");

    card.appendChild(App.createEmailRecipientRow({ email, onChangeEmail }));
    card.appendChild(App.createOtpInput());
    card.appendChild(App.createResendRow());

    const magicLink = App.createInlineLink({
      label: "Use magic link instead",
      className: "inline-link inline-link--magic",
      underline: true,
      onClick: onMagicLink,
    });
    card.appendChild(magicLink);

    App.bindOtpInput(card);
    App.bindResendTimer(card, { onResend });

    return card;
  };

  App.bindWindowControls = function bindWindowControls(root = document) {
    root.querySelector(".window-btn.minimize")?.addEventListener("click", () => {
      window.electronAPI?.minimize();
    });
    root.querySelector(".window-btn.close")?.addEventListener("click", () => {
      window.electronAPI?.close();
    });
  };
})(window.EasyLips);
