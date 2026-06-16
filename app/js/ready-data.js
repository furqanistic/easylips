window.EasyLips = window.EasyLips || {};

EasyLips.getOutputDeviceLabel = function getOutputDeviceLabel(deviceId) {
  const device = EasyLips.OUTPUT_DEVICES.find((item) => item.id === deviceId);
  return device?.label || "Easy Lips Virtual Mic";
};

EasyLips.buildReadySummaryRows = function buildReadySummaryRows(state) {
  const icons = EasyLips.icons;

  const speakValue = state.speakAutoDetect ? "Auto-detect" : state.speakLanguage;
  const microphoneValue = state.inputDeviceLabel || "External Microphone";
  const outputValue =
    state.outputDeviceLabel || EasyLips.getOutputDeviceLabel(state.outputDeviceId);

  return [
    { icon: icons.user, label: "Account", value: "Connected" },
    { icon: icons.microphone, label: "I speak", value: speakValue },
    { icon: icons.translate, label: "Translate to", value: state.translateLanguage },
    { icon: icons.microphone, label: "Microphone", value: microphoneValue },
    { icon: icons.speaker, label: "Output", value: outputValue },
  ];
};
