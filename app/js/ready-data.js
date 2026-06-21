window.EasyLips = window.EasyLips || {};

EasyLips.getOutputDeviceLabel = function getOutputDeviceLabel(deviceId) {
  const device = EasyLips.OUTPUT_DEVICES.find((item) => item.id === deviceId);
  return device?.label || deviceId || "Default output";
};

EasyLips.buildReadySummaryRows = function buildReadySummaryRows(state) {
  const icons = EasyLips.icons;

  const speakValue = state.speakAutoDetect
    ? state.detectedSpeakLanguage || "Auto-detect"
    : state.speakLanguage;
  const microphoneValue = state.inputDeviceLabel || "External Microphone";
  const outputValue =
    state.outputDeviceLabel || EasyLips.getOutputDeviceLabel(state.outputDeviceId);
  const outputStatus =
    state.outputDeviceId === "easy-lips-virtual" && !state.outputVirtualReady
      ? `${outputValue} (driver needed)`
      : outputValue;
  const listenTarget = state.detectedSpeakLanguage || state.speakLanguage || "Your language";
  const listenSource = state.translateLanguage || "Client language";
  const listenOutput = state.listenEnabled
    ? state.listenOutputDeviceLabel || "Default speakers"
    : "Off";
  const remainingMinutes = Math.max(
    0,
    Math.ceil((state.remainingTranslationSeconds ?? 90 * 60) / 60),
  );
  const plan = EasyLips.PAYMENT_PLANS?.find((item) => item.id === state.selectedPaymentPlanId);

  return [
    { icon: icons.user, label: "Account", value: "Connected" },
    { icon: icons.info, label: "Plan", value: plan?.name || "Starter" },
    { icon: icons.info, label: "Auto top-up", value: state.autoTopUpEnabled ? "$6 / 100 min" : "Off" },
    { icon: icons.info, label: "Minutes left", value: `${remainingMinutes} min` },
    { icon: icons.microphone, label: "I speak", value: speakValue },
    { icon: icons.translate, label: "Translate to", value: state.translateLanguage },
    { icon: icons.microphone, label: "Microphone", value: microphoneValue },
    { icon: icons.speaker, label: "Output", value: outputStatus },
    { icon: icons.headphones, label: "I hear", value: state.listenEnabled ? `${listenSource} to ${listenTarget}` : "Off" },
    { icon: icons.speaker, label: "Headphones", value: listenOutput },
  ];
};
