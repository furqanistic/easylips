window.EasyLips = window.EasyLips || {};

(function (App) {
  const STEP = EasyLips.SETUP_STEPS.MICROPHONE;
  const stepTag = App.formatStepTag(STEP);

  App.createMicrophoneView = function createMicrophoneView({
    inputDeviceId = "fallback-external",
    outputDeviceId = "easy-lips-virtual",
    onBack,
    onContinue,
    onInputChange,
    onOutputChange,
  }) {
    const panels = App.createMicrophonePanels({
      inputDevices: EasyLips.FALLBACK_INPUT_DEVICES,
      inputValue: inputDeviceId,
      outputValue: outputDeviceId,
      onInputChange,
      onOutputChange,
    });

    const view = App.createSetupStepView({
      viewName: "microphone",
      contentClass: "content--microphone",
      tag: stepTag,
      heading: "Choose your microphone",
      subheading: "Select your input device and virtual output.",
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
    let disposed = false;

    function pickDefaultId(devices) {
      if (state.inputDeviceId && devices.some((device) => device.id === state.inputDeviceId)) {
        return state.inputDeviceId;
      }

      const external = devices.find((device) => /external/i.test(device.label));
      return external?.id || devices[0]?.id;
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

    panels.inputPicker.setOnChange((option) => {
      state.inputDeviceId = option.id;
      state.inputDeviceLabel = option.label;
      callbacks.onInputChange?.(option);
      startInput(option.id);
    });

    async function refreshDevices() {
      const devices = await EasyLips.listInputDevices();
      if (disposed) return;

      const selectedId = pickDefaultId(devices);
      const selectedDevice = devices.find((device) => device.id === selectedId);
      state.inputDeviceId = selectedId;
      state.inputDeviceLabel = selectedDevice?.label || state.inputDeviceLabel;
      panels.inputPicker.setOptions(devices, selectedId);
      await startInput(selectedId);
    }

    refreshDevices();

    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices?.addEventListener("devicechange", handleDeviceChange);

    return () => {
      disposed = true;
      levelBinding.stop();
      navigator.mediaDevices?.removeEventListener("devicechange", handleDeviceChange);
    };
  };
})(window.EasyLips);
