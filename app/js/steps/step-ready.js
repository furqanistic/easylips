window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.READY;
  const stepTag = App.formatStepTag(STEP);

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  App.createReadyView = function createReadyView({
    summaryRows = [],
    outputVirtualReady = true,
    outputMeetingMicLabel = "Easy Lips Virtual Mic",
    listenEnabled = true,
    listenOutputDeviceLabel = "Default speakers",
    onBack,
    onStart,
  }) {
    let busy = false;
    const body = document.createDocumentFragment();
    body.appendChild(App.createSetupSummaryCard(summaryRows));
    body.appendChild(
      App.createSetupTip({
        html: outputVirtualReady
          ? `In Zoom or Google Meet, choose <strong>${escapeHtml(outputMeetingMicLabel)}</strong> as your microphone.${
              listenEnabled
                ? ` Incoming speech will play translated through <strong>${escapeHtml(listenOutputDeviceLabel)}</strong>.`
                : ""
            }`
          : 'Install a virtual audio cable first. After it appears in your system microphones, choose it in Zoom or Google Meet.',
      }),
    );

    const status = document.createElement("p");
    status.className = "ready-live-status";
    status.dataset.status = "idle";
    status.setAttribute("aria-live", "polite");
    status.textContent = "Start live translation when you are ready.";
    body.appendChild(status);

    function setStatus(tone, message) {
      status.dataset.status = tone;
      status.textContent = message;
    }

    async function handleStart(event) {
      if (busy) return;

      const button = event?.currentTarget;
      busy = true;
      if (button) {
        button.disabled = true;
        button.textContent = "Starting...";
      }
      setStatus("loading", "Checking microphone and connecting to Gemini...");

      try {
        const result = await onStart?.({ setStatus });
        if (!result?.ok) {
          setStatus("error", result?.message || "Could not start live translation.");
        }
      } catch (error) {
        setStatus("error", error?.message || "Could not start live translation.");
      } finally {
        busy = false;
        if (button) {
          button.disabled = false;
          button.innerHTML = `Start translation${App.icons.arrowRight}`;
        }
      }
    }

    return App.createSetupStepView({
      viewName: "ready",
      contentClass: "content--ready",
      tag: stepTag,
      heading: "You're ready to go",
      subheading: "Review your setup and start translation.",
      body,
      onBack,
      onContinue: handleStart,
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
