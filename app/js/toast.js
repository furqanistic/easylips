window.EasyLips = window.EasyLips || {};

(function (App) {
  const TOAST_TIMEOUT = 4200;
  let viewport = null;

  function ensureViewport() {
    if (viewport) return viewport;

    viewport = document.createElement("div");
    viewport.className = "toast-viewport";
    viewport.setAttribute("aria-live", "polite");
    document.body.appendChild(viewport);
    return viewport;
  }

  App.toast = function toast({
    title,
    message = "",
    type = "info",
    actions = [],
    duration,
  }) {
    const root = ensureViewport();
    const item = document.createElement("div");
    item.className = `toast toast--${type}`;
    item.setAttribute("role", type === "error" ? "alert" : "status");

    const body = document.createElement("div");
    body.className = "toast-body";

    const heading = document.createElement("p");
    heading.className = "toast-title";
    heading.textContent = title;
    body.appendChild(heading);

    if (message) {
      const copy = document.createElement("p");
      copy.className = "toast-message";
      copy.textContent = message;
      body.appendChild(copy);
    }

    const dismiss = () => {
      item.classList.add("toast--leaving");
      window.setTimeout(() => item.remove(), 160);
    };

    if (actions.length) {
      const actionRow = document.createElement("div");
      actionRow.className = "toast-actions";

      actions.forEach((action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `toast-action toast-action--${action.variant || "primary"}`;
        button.textContent = action.label;
        button.addEventListener("click", async () => {
          button.disabled = true;
          try {
            await action.onClick?.();
            if (action.dismiss !== false) {
              dismiss();
            } else {
              button.disabled = false;
            }
          } catch {
            button.disabled = false;
          }
        });
        actionRow.appendChild(button);
      });

      body.appendChild(actionRow);
    }

    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast-close";
    close.setAttribute("aria-label", "Dismiss notification");
    close.textContent = "x";

    close.addEventListener("click", dismiss);
    item.append(body, close);
    root.appendChild(item);

    const timeout = duration ?? (actions.length ? 0 : TOAST_TIMEOUT);
    if (timeout > 0) {
      window.setTimeout(dismiss, timeout);
    }
  };
})(window.EasyLips);
