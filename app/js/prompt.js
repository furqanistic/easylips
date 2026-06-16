window.EasyLips = window.EasyLips || {};

(function (App) {
  App.showPrompt = function showPrompt({
    title,
    message,
    confirmLabel = "Got it",
    onConfirm,
  } = {}) {
    document.querySelector(".app-prompt-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "app-prompt-overlay";
    overlay.innerHTML = `
      <div class="app-prompt" role="dialog" aria-modal="true" aria-labelledby="app-prompt-title">
        <h2 class="app-prompt-title" id="app-prompt-title"></h2>
        <p class="app-prompt-message"></p>
        <button type="button" class="primary-btn app-prompt-confirm"></button>
      </div>
    `;

    overlay.querySelector(".app-prompt-title").textContent = title;
    overlay.querySelector(".app-prompt-message").textContent = message;
    const confirmBtn = overlay.querySelector(".app-prompt-confirm");
    confirmBtn.textContent = confirmLabel;

    function close() {
      overlay.remove();
      document.removeEventListener("keydown", handleKeydown);
    }

    function handleKeydown(event) {
      if (event.key === "Escape") close();
    }

    confirmBtn.addEventListener("click", () => {
      close();
      onConfirm?.();
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });

    document.addEventListener("keydown", handleKeydown);
    document.body.appendChild(overlay);
    confirmBtn.focus();
  };
})(window.EasyLips);
