window.EasyLips = window.EasyLips || {};

EasyLips.OUTPUT_DEVICES = [
  {
    id: "easy-lips-virtual",
    label: "Easy Lips Virtual Mic",
    icon: "virtualMic",
  },
  {
    id: "speakers",
    label: "Speakers",
    icon: "speaker",
  },
  {
    id: "headphones",
    label: "Headphones",
    icon: "headphones",
  },
];

EasyLips.FALLBACK_INPUT_DEVICES = [
  { id: "fallback-macbook", label: "MacBook Microphone", icon: "laptopMic" },
  { id: "fallback-external", label: "External Microphone", icon: "deviceMic" },
  { id: "fallback-airpods", label: "AirPods Microphone", icon: "headphones" },
];

EasyLips.getInputDeviceIcon = function getInputDeviceIcon(label = "") {
  const name = label.toLowerCase();
  if (name.includes("airpod") || name.includes("headphone")) return "headphones";
  if (name.includes("mac") || name.includes("built-in") || name.includes("laptop")) {
    return "laptopMic";
  }
  return "deviceMic";
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
