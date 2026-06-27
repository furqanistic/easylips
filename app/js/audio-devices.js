window.EasyLips = window.EasyLips || {};

EasyLips.OUTPUT_DEVICES = [
  {
    id: "easy-lips-virtual",
    label: "OneLingo Virtual Mic",
    icon: "virtualMic",
    virtual: true,
    installed: false,
    note: "Install cable",
  },
];

EasyLips.FALLBACK_INPUT_DEVICES = [
  { id: "fallback-macbook", label: "MacBook Microphone", icon: "laptopMic" },
  { id: "fallback-external", label: "External Microphone", icon: "deviceMic" },
  { id: "fallback-airpods", label: "AirPods Microphone", icon: "headphones" },
];

EasyLips.SYSTEM_AUDIO_INPUT_DEVICE = {
  id: "system-audio",
  label: "Computer audio",
  icon: "speaker",
  source: "system",
  note: "Meet audio",
};

EasyLips.isSystemAudioInputDeviceId = function isSystemAudioInputDeviceId(deviceId) {
  return deviceId === EasyLips.SYSTEM_AUDIO_INPUT_DEVICE.id;
};

EasyLips.getInputDeviceIcon = function getInputDeviceIcon(label = "") {
  const name = label.toLowerCase();
  if (name.includes("airpod") || name.includes("headphone")) return "headphones";
  if (name.includes("mac") || name.includes("built-in") || name.includes("laptop")) {
    return "laptopMic";
  }
  return "deviceMic";
};

EasyLips.getOutputDeviceIcon = function getOutputDeviceIcon(label = "") {
  const name = label.toLowerCase();
  if (name.includes("airpod") || name.includes("headphone")) return "headphones";
  if (name.includes("speaker")) return "speaker";
  if (name.includes("hdmi")) return "speaker";
  if (name.includes("display")) return "speaker";
  return "speaker";
};

EasyLips.isEasyLipsVirtualDeviceLabel = function isEasyLipsVirtualDeviceLabel(label = "") {
  const normalized = label.toLowerCase();
  return normalized.includes("easy lips virtual") || normalized.includes("easylips virtual") || normalized.includes("onelingo virtual");
};

EasyLips.isVirtualCableOutputLabel = function isVirtualCableOutputLabel(label = "") {
  const normalized = label.toLowerCase();
  return (
    EasyLips.isEasyLipsVirtualDeviceLabel(label) ||
    normalized.includes("cable input") ||
    normalized.includes("virtual mic cable") ||
    normalized.includes("virtual microphone cable") ||
    normalized.includes("vb-cable input") ||
    (normalized.includes("virtual cable") && normalized.includes("input")) ||
    (normalized.includes("vb-audio") && normalized.includes("input")) ||
    (normalized.includes("voicemeeter") && normalized.includes("input"))
  );
};

EasyLips.isVirtualCableInputLabel = function isVirtualCableInputLabel(label = "") {
  const normalized = label.toLowerCase();
  return (
    EasyLips.isEasyLipsVirtualDeviceLabel(label) ||
    normalized.includes("cable output") ||
    normalized.includes("virtual mic cable") ||
    normalized.includes("virtual microphone cable") ||
    normalized.includes("vb-cable output") ||
    (normalized.includes("virtual cable") && normalized.includes("output")) ||
    (normalized.includes("vb-audio") && normalized.includes("output")) ||
    (normalized.includes("voicemeeter") && normalized.includes("output"))
  );
};

EasyLips.cleanDeviceLabel = function cleanDeviceLabel(label = "") {
  return (
    label
      .replace(/^(default\s*-\s*|communications?\s*-\s*)/i, "")
      .replace(/\s*\(\s*communications?\s*\)\s*$/i, "")
      .trim() || "Microphone"
  );
};

EasyLips.getDeviceRank = function getDeviceRank(label = "") {
  const lower = label.toLowerCase();
  if (lower.startsWith("communications") || lower.includes("(communications)")) return 0;
  if (lower.startsWith("default")) return 2;
  return 1;
};

EasyLips.deduplicateInputDevices = function deduplicateInputDevices(devices) {
  const byGroup = new Map();

  devices.forEach((device) => {
    const rawLabel = device.label || "Microphone";
    const cleanLabel = EasyLips.cleanDeviceLabel(rawLabel);
    const key = device.groupId || cleanLabel.toLowerCase();
    const rank = EasyLips.getDeviceRank(rawLabel);
    const existing = byGroup.get(key);

    if (!existing || rank > existing.rank) {
      byGroup.set(key, {
        id: device.id,
        label: cleanLabel,
        icon: device.icon || EasyLips.getInputDeviceIcon(cleanLabel),
        rank,
      });
    }
  });

  const unique = [...byGroup.values()].map(({ id, label, icon }) => ({ id, label, icon }));
  const byLabel = new Map();

  unique.forEach((device) => {
    const key = device.label.toLowerCase();
    const existing = byLabel.get(key);
    if (!existing) {
      byLabel.set(key, device);
    }
  });

  return [...byLabel.values()];
};

EasyLips.mapInputDevices = function mapInputDevices(devices) {
  const mapped = devices
    .filter((device) => device.kind === "audioinput")
    .map((device) => ({
      id: device.deviceId,
      groupId: device.groupId,
      label: device.label || "Microphone",
      icon: EasyLips.getInputDeviceIcon(device.label || ""),
    }));

  return EasyLips.deduplicateInputDevices(mapped);
};

EasyLips.deduplicateOutputDevices = function deduplicateOutputDevices(devices) {
  const seen = new Map();

  devices.forEach((device) => {
    const rawLabel = device.label || "Output";
    const cleanLabel = EasyLips.cleanDeviceLabel(rawLabel);
    const key = (device.groupId || cleanLabel).toLowerCase();
    const rank = EasyLips.getDeviceRank(rawLabel);
    const existing = seen.get(key);

    if (!existing || rank > existing.rank) {
      seen.set(key, {
        id: device.id,
        label: cleanLabel,
        icon: device.icon || EasyLips.getOutputDeviceIcon(cleanLabel),
        rank,
      });
    }
  });

  return [...seen.values()]
    .map(({ id, label, icon }) => ({ id, label, icon }))
    .filter((device, index, self) => {
      const key = device.label.toLowerCase();
      return self.findIndex((item) => item.label.toLowerCase() === key) === index;
    });
};

EasyLips.mapOutputDevices = function mapOutputDevices(devices) {
  const mapped = devices
    .filter((device) => device.kind === "audiooutput")
    .map((device) => ({
      id: device.deviceId,
      groupId: device.groupId,
      label: device.label || "Output",
      icon: EasyLips.getOutputDeviceIcon(device.label || ""),
    }));

  return EasyLips.deduplicateOutputDevices(mapped);
};

EasyLips.resolveEasyLipsVirtualOutput = function resolveEasyLipsVirtualOutput(
  outputs = [],
  inputs = [],
) {
  const installed = outputs.find((device) => EasyLips.isEasyLipsVirtualDeviceLabel(device.label));
  const cableOutput = outputs.find((device) => EasyLips.isVirtualCableOutputLabel(device.label));
  const cableInput = inputs.find((device) => EasyLips.isVirtualCableInputLabel(device.label));
  const base = EasyLips.OUTPUT_DEVICES.find((device) => device.id === "easy-lips-virtual");

  if (!base) return null;

  if (installed) {
    return {
      ...base,
      id: installed.id,
    label: "OneLingo Virtual Mic",
      icon: "virtualMic",
      virtual: true,
      installed: true,
      systemLabel: installed.label,
      meetingMicLabel: cableInput?.label || "OneLingo Virtual Mic",
      note: "Installed",
    };
  }

  if (cableOutput) {
    return {
      ...base,
      id: cableOutput.id,
      label: "Virtual Mic Cable",
      icon: "virtualMic",
      virtual: true,
      installed: true,
      systemLabel: cableOutput.label,
      meetingMicLabel: cableInput?.label || "CABLE Output",
      note: "Installed",
    };
  }

  return { ...base };
};

EasyLips.listOutputDevices = async function listOutputDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return EasyLips.OUTPUT_DEVICES;
  }

  try {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let outputs = EasyLips.mapOutputDevices(devices);
    let inputs = EasyLips.mapInputDevices(devices);

    if (!outputs.length || outputs.every((device) => device.label === "Output")) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        devices = await navigator.mediaDevices.enumerateDevices();
        outputs = EasyLips.mapOutputDevices(devices);
        inputs = EasyLips.mapInputDevices(devices);
      } catch {
        return EasyLips.OUTPUT_DEVICES;
      }
    }

    const virtual = EasyLips.resolveEasyLipsVirtualOutput(outputs, inputs);
    const visibleOutputs = outputs.filter(
      (device) => !EasyLips.isVirtualCableOutputLabel(device.label),
    );
    const combined = virtual ? [virtual, ...visibleOutputs] : visibleOutputs;
    return combined.length ? combined : EasyLips.OUTPUT_DEVICES;
  } catch {
    return EasyLips.OUTPUT_DEVICES;
  }
};

EasyLips.listSpeakerOutputDevices = async function listSpeakerOutputDevices() {
  try {
    const outputs = await EasyLips.listOutputDevices();
    const speakers = outputs.filter((device) => !device.virtual);
    return speakers.length
      ? speakers
      : [{ id: "default", label: "Default speakers", icon: "speaker" }];
  } catch {
    return [{ id: "default", label: "Default speakers", icon: "speaker" }];
  }
};

EasyLips.listListeningInputDevices = async function listListeningInputDevices() {
  try {
    const inputs = await EasyLips.listInputDevices();
    const loopbackInputs = inputs
      .filter((device) => EasyLips.isVirtualCableInputLabel(device.label))
      .map((device) => ({
        ...device,
        icon: "virtualMic",
        note: "Loopback",
      }));
    const otherInputs = inputs.filter(
      (device) => !EasyLips.isVirtualCableInputLabel(device.label),
    );

    return [
      { ...EasyLips.SYSTEM_AUDIO_INPUT_DEVICE },
      ...loopbackInputs,
      ...otherInputs,
    ];
  } catch {
    return [{ ...EasyLips.SYSTEM_AUDIO_INPUT_DEVICE }];
  }
};

EasyLips.resolveOutputDeviceForPlayback = async function resolveOutputDeviceForPlayback(
  outputDeviceId,
) {
  const fallback = {
    ok: outputDeviceId !== "easy-lips-virtual",
    deviceId: outputDeviceId || "default",
    label: "Default output",
    meetingMicLabel: "Default output",
    virtual: false,
    installed: outputDeviceId !== "easy-lips-virtual",
  };

  try {
    const outputs = await EasyLips.listOutputDevices();
    const virtualOutput = outputs.find((device) => device.virtual);
    const selected =
      outputs.find((device) => device.id === outputDeviceId) ||
      (outputDeviceId === "easy-lips-virtual" ? virtualOutput : null);

    if (!selected) {
      return fallback;
    }

    if (selected.virtual && selected.installed !== true) {
      return {
        ok: false,
        deviceId: selected.id,
        label: selected.label,
        meetingMicLabel: selected.meetingMicLabel || selected.label,
        virtual: true,
        installed: false,
      };
    }

    return {
      ok: true,
      deviceId: selected.id,
      label: selected.label,
      systemLabel: selected.systemLabel,
      meetingMicLabel: selected.meetingMicLabel || selected.label,
      virtual: selected.virtual === true,
      installed: selected.installed !== false,
    };
  } catch {
    return fallback;
  }
};

EasyLips.listInputDevices = async function listInputDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return EasyLips.FALLBACK_INPUT_DEVICES;
  }

  try {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let inputs = EasyLips.mapInputDevices(devices);

    if (!inputs.length || inputs.every((device) => device.label === "Microphone")) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        devices = await navigator.mediaDevices.enumerateDevices();
        inputs = EasyLips.mapInputDevices(devices);
      } catch {
        return EasyLips.FALLBACK_INPUT_DEVICES;
      }
    }

    return inputs.length ? inputs : EasyLips.FALLBACK_INPUT_DEVICES;
  } catch {
    return EasyLips.FALLBACK_INPUT_DEVICES;
  }
};
