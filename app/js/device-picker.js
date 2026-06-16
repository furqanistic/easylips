window.EasyLips = window.EasyLips || {};

(function (App) {
  const { icons } = App;

  function resolveIcon(name) {
    return icons[name] || icons.deviceMic;
  }

  App.createDevicePicker = function createDevicePicker({
    id,
    icon,
    title,
    subtitle,
    value,
    options = [],
    footer = null,
    onChange,
  }) {
    const picker = document.createElement("article");
    picker.className = "language-picker device-picker";
    picker.dataset.pickerId = id;

    const header = document.createElement("header");
    header.className = "language-picker-header";

    const headerMain = document.createElement("div");
    headerMain.className = "language-picker-header-main";
    headerMain.innerHTML = `
      <span class="language-picker-icon">${icon}</span>
      <div class="language-picker-heading">
        <h3 class="language-picker-title">${title}</h3>
        <p class="language-picker-subtitle">${subtitle}</p>
      </div>
    `;
    header.appendChild(headerMain);

    const spacer = document.createElement("div");
    spacer.className = "language-picker-autodetect language-picker-autodetect--spacer";
    spacer.setAttribute("aria-hidden", "true");
    header.appendChild(spacer);

    const selected = options.find((option) => option.id === value) || options[0];
    const triggerLabel = selected?.label || "Select device";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "language-picker-trigger";
    trigger.setAttribute("aria-expanded", "true");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.innerHTML = `
      <span class="language-picker-value">${triggerLabel}</span>
      ${icons.chevronDown}
    `;

    const panel = document.createElement("div");
    panel.className = "language-picker-panel device-picker-panel";

    const list = document.createElement("ul");
    list.className = "language-picker-list device-picker-list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", title);

    options.forEach((option) => {
      list.appendChild(createDeviceOption(option, option.id === selected?.id));
    });

    panel.appendChild(list);
    picker.append(header, trigger, panel);

    if (footer) {
      picker.appendChild(footer);
    }

    App.bindDevicePicker(picker, {
      options,
      value: selected?.id,
      onChange,
    });

    return picker;
  };

  function createDeviceOption(option, isSelected) {
    const item = document.createElement("li");
    item.className = `language-option device-option${isSelected ? " language-option--selected" : ""}`;
    item.dataset.value = option.id;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", isSelected ? "true" : "false");
    item.innerHTML = `
      <span class="language-option-leading">${resolveIcon(option.icon)}</span>
      <span class="language-option-label">${option.label}</span>
      <span class="language-option-trailing">${icons.check}</span>
    `;
    return item;
  }

  App.bindDevicePicker = function bindDevicePicker(
    picker,
    { options = [], value, onChange } = {},
  ) {
    const trigger = picker.querySelector(".language-picker-trigger");
    const valueEl = picker.querySelector(".language-picker-value");
    const list = picker.querySelector(".device-picker-list");

    let selectedId = value;
    let changeHandler = onChange;

    function setSelected(id, { notify = true } = {}) {
      const option = options.find((item) => item.id === id);
      if (!option) return;

      selectedId = id;
      valueEl.textContent = option.label;

      list.querySelectorAll(".device-option").forEach((item) => {
        const isSelected = item.dataset.value === id;
        item.classList.toggle("language-option--selected", isSelected);
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
      });

      if (notify) {
        changeHandler?.(option);
      }
    }

    trigger.addEventListener("click", () => {
      const collapsed = picker.classList.toggle("language-picker--collapsed");
      trigger.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });

    list.addEventListener("click", (event) => {
      const option = event.target.closest(".device-option");
      if (!option) return;
      setSelected(option.dataset.value);
    });

    picker.setOptions = (nextOptions, nextValue) => {
      options = nextOptions;
      list.replaceChildren(
        ...nextOptions.map((option) => createDeviceOption(option, option.id === nextValue)),
      );
      setSelected(nextValue, { notify: false });
    };

    picker.setValue = (id) => setSelected(id);
    picker.getValue = () => selectedId;
    picker.setOnChange = (handler) => {
      changeHandler = handler;
    };

    return picker;
  };

  App.createInputLevelFooter = function createInputLevelFooter() {
    const footer = document.createElement("div");
    footer.className = "device-picker-footer device-picker-footer--level";
    footer.innerHTML = `
      <div class="level-header">
        <span class="level-label">Input level</span>
        <span class="level-status level-status--good">Good</span>
      </div>
      <div class="level-meter" aria-hidden="true"></div>
    `;

    const meter = footer.querySelector(".level-meter");
    for (let index = 0; index < 20; index += 1) {
      const bar = document.createElement("span");
      bar.className = "level-bar";
      meter.appendChild(bar);
    }

    return footer;
  };

  App.createOutputStatusFooter = function createOutputStatusFooter({
    label = "Ready",
    tone = "ready",
  } = {}) {
    const footer = document.createElement("div");
    footer.className = `device-picker-footer device-picker-footer--status device-picker-footer--${tone}`;
    footer.innerHTML = `
      <span class="status-dot" aria-hidden="true"></span>
      <span class="status-text">${label}</span>
    `;
    return footer;
  };

  App.bindInputLevelFooter = function bindInputLevelFooter(footer, monitor) {
    const statusEl = footer.querySelector(".level-status");
    const bars = [...footer.querySelectorAll(".level-bar")];
    const center = (bars.length - 1) / 2;

    function render(level, dataArray) {
      const boosted = Math.min(1, level * 3.2);
      const status = App.getLevelStatus(boosted);

      statusEl.textContent = status.label;
      statusEl.className = `level-status level-status--${status.tone}`;

      const halfSpan = Math.round(boosted * center * 0.9);

      bars.forEach((bar, index) => {
        const distance = Math.abs(index - center);
        const binIndex = Math.min(
          dataArray?.length ? dataArray.length - 1 : 0,
          Math.round(distance * 1.6),
        );
        const binValue = dataArray ? dataArray[binIndex] / 255 : boosted;
        const withinSpan = distance <= halfSpan && boosted > 0.02;
        const isActive = withinSpan && binValue > 0.08;
        const intensity = isActive ? 1 - (distance / (halfSpan + 1)) * 0.35 : 0;

        bar.classList.toggle("level-bar--active", isActive);
        bar.style.height = isActive ? `${6 + intensity * 12}px` : "6px";
      });
    }

    return {
      async start(deviceId) {
        await monitor.start(deviceId, render);
        render(0);
      },
      stop() {
        monitor.stop();
        render(0);
      },
    };
  };

  App.createMicrophonePanels = function createMicrophonePanels({
    inputDevices = [],
    inputValue,
    outputValue = "easy-lips-virtual",
    onInputChange,
    onOutputChange,
  } = {}) {
    const row = document.createElement("div");
    row.className = "language-panels microphone-panels";

    const inputFooter = App.createInputLevelFooter();
    const inputPicker = App.createDevicePicker({
      id: "input-mic",
      icon: icons.microphone,
      title: "Input microphone",
      subtitle: "Choose the microphone you will speak into.",
      value: inputValue,
      options: inputDevices,
      footer: inputFooter,
      onChange: onInputChange,
    });

    const arrow = document.createElement("div");
    arrow.className = "language-panels-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = icons.arrowRight;

    const outputFooter = App.createOutputStatusFooter();
    const outputPicker = App.createDevicePicker({
      id: "output-mic",
      icon: icons.translate,
      title: "Output as",
      subtitle: "Use translated voice as a microphone in other apps.",
      value: outputValue,
      options: EasyLips.OUTPUT_DEVICES.map((device) => ({
        id: device.id,
        label: device.label,
        icon: device.icon,
      })),
      footer: outputFooter,
      onChange: (option) => {
        const tone = option.id === "easy-lips-virtual" ? "ready" : "idle";
        const label = option.id === "easy-lips-virtual" ? "Ready" : "Selected";
        outputFooter.className = `device-picker-footer device-picker-footer--status device-picker-footer--${tone}`;
        outputFooter.querySelector(".status-text").textContent = label;
        onOutputChange?.(option);
      },
    });

    row.append(inputPicker, arrow, outputPicker);
    row.inputPicker = inputPicker;
    row.outputPicker = outputPicker;
    row.inputFooter = inputFooter;

    return row;
  };
})(window.EasyLips);
