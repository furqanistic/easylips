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

    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast-close";
    close.setAttribute("aria-label", "Dismiss notification");
    close.textContent = "x";

    const dismiss = () => {
      item.classList.add("toast--leaving");
      window.setTimeout(() => item.remove(), 160);
    };

    close.addEventListener("click", dismiss);
    item.append(body, close);
    root.appendChild(item);

    window.setTimeout(dismiss, TOAST_TIMEOUT);
  };
})(window.EasyLips);
