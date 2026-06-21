window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.PAYMENT;
  const stepTag = App.formatStepTag(STEP);

  App.PAYMENT_PLANS = [
    {
      id: "starter",
      name: "Starter",
      price: "$4.99",
      period: "/month",
      audience: "For casual users.",
      minutes: 90,
      highlight: false,
    },
    {
      id: "plus",
      name: "Plus",
      price: "$14.99",
      period: "/month",
      audience: "For freelancers, students, and small meetings.",
      minutes: 275,
      highlight: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$39.99",
      period: "/month",
      audience: "For serious users, client calls, daily usage.",
      minutes: 750,
      highlight: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "from $99/month",
      audience: "Team seats, shared minutes, admin dashboard, priority support.",
      minutes: null,
      highlight: false,
    },
  ];

  App.PAYMENT_PLAN_MINUTES = App.PAYMENT_PLANS.reduce((acc, plan) => {
    if (Number.isFinite(plan.minutes)) acc[plan.id] = plan.minutes;
    return acc;
  }, {});

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  App.createPaymentView = function createPaymentView({
    email,
    selectedPlanId = "starter",
    autoTopUpEnabled = false,
    paymentStatus = "idle",
    onBack,
    onPlanChange,
    onAutoTopUpChange,
    onCheckout,
    onContinue,
  }) {
    let busy = false;
    let selected = selectedPlanId;
    const body = document.createDocumentFragment();

    const plans = document.createElement("div");
    plans.className = "payment-plans";
    plans.setAttribute("role", "radiogroup");
    plans.setAttribute("aria-label", "Payment plans");

    function updateSelection() {
      plans.querySelectorAll(".payment-plan-card").forEach((card) => {
        const isSelected = card.dataset.planId === selected;
        card.classList.toggle("payment-plan-card--selected", isSelected);
        card.setAttribute("aria-checked", isSelected ? "true" : "false");
      });
    }

    App.PAYMENT_PLANS.forEach((plan) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `payment-plan-card${plan.highlight ? " payment-plan-card--highlight" : ""}`;
      card.dataset.planId = plan.id;
      card.setAttribute("role", "radio");
      card.innerHTML = `
        <span class="payment-plan-topline">
          <span class="payment-plan-name">${escapeHtml(plan.name)}</span>
          ${plan.highlight ? '<span class="payment-plan-badge">Popular</span>' : ""}
        </span>
        <span class="payment-plan-price">
          <span class="payment-price-value">${escapeHtml(plan.price)}</span>
          <span class="payment-price-period">${escapeHtml(plan.period)}</span>
        </span>
        <span class="payment-plan-audience">${escapeHtml(plan.audience)}</span>
        <span class="payment-plan-minutes">${
          plan.minutes ? `${plan.minutes} real-time translation minutes` : "Custom limits and shared team minutes"
        }</span>
      `;

      card.addEventListener("click", () => {
        selected = plan.id;
        onPlanChange?.(selected);
        updateSelection();
      });

      plans.appendChild(card);
    });

    updateSelection();

    const topUp = document.createElement("div");
    topUp.className = "payment-topup";
    topUp.innerHTML = `
      <span class="payment-topup-copy-wrap">
        <span class="payment-topup-title">Auto top-up extra minutes</span>
        <span class="payment-topup-copy">$6 per 100 minutes after your monthly allowance.</span>
      </span>
      <label class="payment-toggle">
        <input class="payment-toggle-input" type="checkbox" ${autoTopUpEnabled ? "checked" : ""} />
        <span class="payment-toggle-track" aria-hidden="true">
          <span class="payment-toggle-thumb"></span>
        </span>
        <span class="payment-toggle-text">${autoTopUpEnabled ? "On" : "Off"}</span>
      </label>
    `;

    const topUpInput = topUp.querySelector(".payment-toggle-input");
    const topUpText = topUp.querySelector(".payment-toggle-text");
    topUpInput?.addEventListener("change", () => {
      const enabled = topUpInput.checked;
      topUpText.textContent = enabled ? "On" : "Off";
      onAutoTopUpChange?.(enabled);
    });

    const checkoutButton = document.createElement("button");
    checkoutButton.type = "button";
    checkoutButton.className = "primary-btn payment-checkout-btn";
    checkoutButton.innerHTML = `Open secure checkout${App.icons.arrowRight}`;

    const status = document.createElement("p");
    status.className = "payment-status";
    status.dataset.status = paymentStatus;
    status.setAttribute("aria-live", "polite");
    status.textContent =
      paymentStatus === "opened"
        ? "Checkout opened in your browser."
        : "Select a plan and complete checkout to activate billing.";

    function setStatus(tone, message) {
      status.dataset.status = tone;
      status.textContent = message;
    }

    checkoutButton.addEventListener("click", async () => {
      if (busy) return;

      busy = true;
      checkoutButton.disabled = true;
      checkoutButton.textContent = "Opening...";
      setStatus("loading", "Creating your Creem checkout...");

      try {
        const result = await onCheckout?.({
          planId: selected,
          autoTopUpEnabled: topUpInput?.checked === true,
          setStatus,
        });
        if (!result?.ok) {
          setStatus("error", result?.message || "Could not open checkout.");
        }
      } catch (error) {
        setStatus("error", error?.message || "Could not open checkout.");
      } finally {
        busy = false;
        checkoutButton.disabled = false;
        checkoutButton.innerHTML = `Open secure checkout${App.icons.arrowRight}`;
      }
    });

    body.append(plans, topUp, checkoutButton, status);

    return App.createSetupStepView({
      viewName: "payment",
      contentClass: "content--payment",
      tag: stepTag,
      heading: "Choose your plan",
      subheading: email
        ? `Checkout will use ${escapeHtml(email)}.`
        : "Checkout is handled securely by Creem.",
      body,
      onBack,
      onContinue,
      continueLabel: "Continue setup",
    });
  };
})(window.EasyLips);
