window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.MICROPHONE;
  const stepTag = App.formatStepTag(STEP);

  App.createMicrophoneView = function createMicrophoneView({
    inputDeviceId = "fallback-external",
    outputDeviceId = "easy-lips-virtual",
    listenInputDeviceId = "system-audio",
    listenOutputDeviceId = "default",
    listenEnabled = true,
    onBack,
    onContinue,
    onInputChange,
    onOutputChange,
    onListenInputChange,
    onListenOutputChange,
    onListenEnabledChange,
  }) {
    const panels = App.createMicrophonePanels({
      inputDevices: EasyLips.FALLBACK_INPUT_DEVICES,
      outputDevices: EasyLips.OUTPUT_DEVICES,
      listenInputDevices: [EasyLips.SYSTEM_AUDIO_INPUT_DEVICE],
      listenOutputDevices: [{ id: "default", label: "Default speakers", icon: "speaker" }],
      inputValue: inputDeviceId,
      outputValue: outputDeviceId,
      listenInputValue: listenInputDeviceId,
      listenOutputValue: listenOutputDeviceId,
      listenEnabled,
      onInputChange,
      onOutputChange,
      onListenInputChange,
      onListenOutputChange,
      onListenEnabledChange,
    });

    const view = App.createSetupStepView({
      viewName: "microphone",
      contentClass: "content--microphone",
      tag: stepTag,
      heading: "Choose your audio routes",
      subheading: "Send your translated voice to Meet, and hear client audio translated in your headphones.",
      body: panels,
      onBack,
      onContinue,
    });

    view.panels = panels;
    return view;
  };

  App.bindMicrophoneView = function bindMicrophoneView(view, state, callbacks = {}) {
    const panels = view.panels;
    if (!panels) return () => {};

    const monitor = App.createMicLevelMonitor();
    const levelBinding = App.bindInputLevelFooter(panels.inputFooter, monitor);
    const statusEl = panels.inputFooter.querySelector(".level-status");
    const listenMonitor = App.createMicLevelMonitor();
    const listenLevelBinding = App.bindInputLevelFooter(panels.listenInputFooter, listenMonitor);
    const listenStatusEl = panels.listenInputFooter.querySelector(".level-status");
    let disposed = false;

    function pickDefaultInputId(devices) {
      if (state.inputDeviceId && devices.some((device) => device.id === state.inputDeviceId)) {
        return state.inputDeviceId;
      }

      const external = devices.find((device) => /external/i.test(device.label));
      return external?.id || devices[0]?.id;
    }

    function pickDefaultOutputId(devices) {
      if (state.outputDeviceId && devices.some((device) => device.id === state.outputDeviceId)) {
        return state.outputDeviceId;
      }

      return devices[0]?.id;
    }

    function pickDefaultListenInputId(devices) {
      if (state.listenInputDeviceId && devices.some((device) => device.id === state.listenInputDeviceId)) {
        return state.listenInputDeviceId;
      }

      return EasyLips.SYSTEM_AUDIO_INPUT_DEVICE.id;
    }

    function pickDefaultListenOutputId(devices) {
      if (state.listenOutputDeviceId && devices.some((device) => device.id === state.listenOutputDeviceId)) {
        return state.listenOutputDeviceId;
      }

      const headphones = devices.find((device) => /airpod|headphone|headset|earbud/i.test(device.label));
      return headphones?.id || devices[0]?.id;
    }

    async function startInput(deviceId) {
      try {
        statusEl.textContent = "Good";
        statusEl.className = "level-status level-status--good";
        await levelBinding.start(deviceId);
      } catch {
        statusEl.textContent = "Denied";
        statusEl.className = "level-status level-status--denied";
        levelBinding.stop();
      }
    }

    async function startListenInput(deviceId) {
      if (EasyLips.isSystemAudioInputDeviceId?.(deviceId)) {
        listenLevelBinding.stop();
        listenStatusEl.textContent = "Ready";
        listenStatusEl.className = "level-status level-status--good";
        return;
      }

      try {
        listenStatusEl.textContent = "Good";
        listenStatusEl.className = "level-status level-status--good";
        await listenLevelBinding.start(deviceId);
      } catch {
        listenStatusEl.textContent = "Denied";
        listenStatusEl.className = "level-status level-status--denied";
        listenLevelBinding.stop();
      }
    }

    panels.inputPicker.setOnChange((option) => {
      state.inputDeviceId = option.id;
      state.inputDeviceLabel = option.label;
      callbacks.onInputChange?.(option);
      startInput(option.id);
    });

    panels.outputPicker.setOnChange((option) => {
      state.outputDeviceId = option.id;
      state.outputDeviceLabel = option.label;
      state.outputVirtualReady = option.virtual ? option.installed === true : true;
      state.outputMeetingMicLabel = option.meetingMicLabel || option.label;
      callbacks.onOutputChange?.(option);
      updateOutputStatus(option);
    });

    panels.listenInputPicker.setOnChange((option) => {
      state.listenInputDeviceId = option.id;
      state.listenInputDeviceLabel = option.label;
      state.listenInputSource = option.source || "device";
      callbacks.onListenInputChange?.(option);
      startListenInput(option.id);
    });

    panels.listenOutputPicker.setOnChange((option) => {
      state.listenOutputDeviceId = option.id;
      state.listenOutputDeviceLabel = option.label;
      callbacks.onListenOutputChange?.(option);
      updateListenOutputStatus(option);
    });

    panels.listenToggle.addEventListener("change", () => {
      state.listenEnabled = panels.listenToggle.checked;
      callbacks.onListenEnabledChange?.(state.listenEnabled);
    });

    function updateOutputStatus(option) {
      const needsVirtualDriver = option.virtual && option.installed === false;
      const tone = needsVirtualDriver ? "denied" : option.virtual ? "ready" : "idle";
      const label = needsVirtualDriver ? "Install cable" : option.virtual ? "Ready" : "Selected";
      const footer = panels.outputFooter;
      footer.className = `device-picker-footer device-picker-footer--status device-picker-footer--${tone}`;
      footer.querySelector(".status-text").textContent = label;
    }

    function updateListenOutputStatus(option) {
      const footer = panels.listenOutputFooter;
      footer.className = "device-picker-footer device-picker-footer--status device-picker-footer--idle";
      footer.querySelector(".status-text").textContent = option?.label ? "Selected" : "Choose output";
    }

    async function refreshInputDevices() {
      const devices = await EasyLips.listInputDevices();
      if (disposed) return;

      const selectedId = pickDefaultInputId(devices);
      const selectedDevice = devices.find((device) => device.id === selectedId);
      state.inputDeviceId = selectedId;
      state.inputDeviceLabel = selectedDevice?.label || state.inputDeviceLabel;
      panels.inputPicker.setOptions(devices, selectedId);
      await startInput(selectedId);
    }

    async function refreshOutputDevices() {
      const devices = await EasyLips.listOutputDevices();
      if (disposed) return;

      const selectedId = pickDefaultOutputId(devices);
      const selectedDevice = devices.find((device) => device.id === selectedId);
      state.outputDeviceId = selectedId;
      state.outputDeviceLabel = selectedDevice?.label || state.outputDeviceLabel;
      state.outputVirtualReady = selectedDevice?.virtual ? selectedDevice.installed === true : true;
      state.outputMeetingMicLabel = selectedDevice?.meetingMicLabel || selectedDevice?.label || state.outputMeetingMicLabel;
      panels.outputPicker.setOptions(devices, selectedId);
      updateOutputStatus(selectedDevice || devices[0]);
    }

    async function refreshListenInputDevices() {
      const devices = await EasyLips.listListeningInputDevices();
      if (disposed) return;

      const selectedId = pickDefaultListenInputId(devices);
      const selectedDevice = devices.find((device) => device.id === selectedId);
      state.listenInputDeviceId = selectedId;
      state.listenInputDeviceLabel = selectedDevice?.label || state.listenInputDeviceLabel;
      state.listenInputSource = selectedDevice?.source || "device";
      panels.listenInputPicker.setOptions(devices, selectedId);
      await startListenInput(selectedId);
    }

    async function refreshListenOutputDevices() {
      const devices = await EasyLips.listSpeakerOutputDevices();
      if (disposed) return;

      const selectedId = pickDefaultListenOutputId(devices);
      const selectedDevice = devices.find((device) => device.id === selectedId);
      state.listenOutputDeviceId = selectedId;
      state.listenOutputDeviceLabel = selectedDevice?.label || state.listenOutputDeviceLabel;
      panels.listenOutputPicker.setOptions(devices, selectedId);
      updateListenOutputStatus(selectedDevice || devices[0]);
    }

    async function refreshDevices() {
      await refreshInputDevices();
      await refreshOutputDevices();
      await refreshListenInputDevices();
      await refreshListenOutputDevices();
    }

    refreshDevices();

    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices?.addEventListener("devicechange", handleDeviceChange);

    return () => {
      disposed = true;
      levelBinding.stop();
      listenLevelBinding.stop();
      navigator.mediaDevices?.removeEventListener("devicechange", handleDeviceChange);
    };
  };
})(window.EasyLips);
