window.EasyLips = window.EasyLips || {};

(function (App) {
  const { icons } = App;
  const AUTO_DETECT_VALUE = "Auto-detect";
  const DETECTED_BADGE_LABEL = "Detected";

  App.createLanguagePicker = function createLanguagePicker({
    id,
    icon,
    title,
    subtitle,
    value,
    placeholder = "Choose language",
    languages = EasyLips.LANGUAGES,
    showAutoDetect = false,
    autoDetectEnabled = false,
    onChange,
    onAutoDetectChange,
  }) {
    const picker = document.createElement("article");
    picker.className = "language-picker";
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

    if (showAutoDetect) {
      const autoDetect = document.createElement("label");
      autoDetect.className = "language-picker-autodetect";
      autoDetect.innerHTML = `
        <span class="language-picker-autodetect-text">Auto-detect</span>
        <span class="toggle-switch">
          <input type="checkbox" class="toggle-switch-input" />
          <span class="toggle-switch-track" aria-hidden="true">
            <span class="toggle-switch-thumb"></span>
          </span>
        </span>
      `;
      header.appendChild(autoDetect);
    } else {
      const spacer = document.createElement("div");
      spacer.className = "language-picker-autodetect language-picker-autodetect--spacer";
      spacer.setAttribute("aria-hidden", "true");
      header.appendChild(spacer);
    }

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "language-picker-trigger";
    trigger.setAttribute("aria-expanded", "true");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.innerHTML = `
      <span class="language-picker-value">${value || placeholder}</span>
      ${icons.chevronDown}
    `;

    const detectedWrap = document.createElement("div");
    detectedWrap.className = "language-picker-detected";
    detectedWrap.setAttribute("aria-live", "polite");
    detectedWrap.innerHTML = `
      <div class="language-picker-detected-circle">
        <span class="language-picker-detected-label">${DETECTED_BADGE_LABEL}</span>
        <span class="language-picker-detected-value">${value || AUTO_DETECT_VALUE}</span>
      </div>
      <p class="language-picker-detected-note">We will automatically detect the language you are speaking.</p>
    `;

    const panel = document.createElement("div");
    panel.className = "language-picker-panel";

    const searchWrap = document.createElement("div");
    searchWrap.className = "language-picker-search";
    searchWrap.innerHTML = `${icons.search}`;
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.className = "language-picker-search-input";
    searchInput.placeholder = "Search languages";
    searchInput.setAttribute("aria-label", `Search ${title.toLowerCase()}`);
    searchWrap.appendChild(searchInput);

    const list = document.createElement("ul");
    list.className = "language-picker-list";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", title);

    languages.forEach((language) => {
      list.appendChild(createLanguageOption(language, language === value));
    });

    panel.append(searchWrap, list);
    picker.append(header, trigger, detectedWrap, panel);

    App.bindLanguagePicker(picker, {
      languages,
      value,
      placeholder,
      autoDetectEnabled,
      onChange,
      onAutoDetectChange,
    });

    return picker;
  };

  function createLanguageOption(language, selected) {
    const item = document.createElement("li");
    item.className = `language-option${selected ? " language-option--selected" : ""}`;
    item.dataset.value = language;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", selected ? "true" : "false");
    item.innerHTML = `
      <span class="language-option-leading">${icons.globe}</span>
      <span class="language-option-label">${language}</span>
      <span class="language-option-trailing">${icons.check}</span>
    `;
    return item;
  }

  App.bindLanguagePicker = function bindLanguagePicker(
    picker,
    {
      languages = EasyLips.LANGUAGES,
      value,
      placeholder = "Choose language",
      autoDetectEnabled = false,
      onChange,
      onAutoDetectChange,
    } = {},
  ) {
    const trigger = picker.querySelector(".language-picker-trigger");
    const valueEl = picker.querySelector(".language-picker-value");
    const panel = picker.querySelector(".language-picker-panel");
    const detectedValueEl = picker.querySelector(".language-picker-detected-value");
    const searchInput = picker.querySelector(".language-picker-search-input");
    const list = picker.querySelector(".language-picker-list");
    const autoDetectInput = picker.querySelector(".toggle-switch-input");

    let selected = value || "";
    let autoDetect = autoDetectEnabled;

    function syncSelectedOption(language) {
      list.querySelectorAll(".language-option").forEach((option) => {
        const isSelected = option.dataset.value === language;
        option.classList.toggle("language-option--selected", isSelected);
        option.setAttribute("aria-selected", isSelected ? "true" : "false");
      });
    }

    function syncAutoDetectState() {
      picker.classList.toggle("language-picker--autodetect", autoDetect);

      if (autoDetect) {
        valueEl.textContent = AUTO_DETECT_VALUE;
        trigger.setAttribute("aria-expanded", "false");
      } else {
        valueEl.textContent = selected || placeholder;
        trigger.setAttribute("aria-expanded", picker.classList.contains("language-picker--collapsed") ? "false" : "true");
      }

      if (detectedValueEl) {
        detectedValueEl.textContent = selected || AUTO_DETECT_VALUE;
      }
    }

    function setSelected(language) {
      if (autoDetect) return;

      selected = language;
      valueEl.textContent = language;
      syncSelectedOption(language);

      onChange?.(language);
    }

    function setDetectedLanguage(language) {
      if (!language) {
        if (detectedValueEl) {
          detectedValueEl.textContent = selected || AUTO_DETECT_VALUE;
        }
        return;
      }

      selected = language;
      syncSelectedOption(language);

      if (detectedValueEl) {
        detectedValueEl.textContent = language;
      }

      if (!autoDetect) {
        valueEl.textContent = language;
      }
    }

    function setAutoDetect(enabled) {
      autoDetect = enabled;
      if (autoDetectInput) {
        autoDetectInput.checked = enabled;
      }
      syncAutoDetectState();
      onAutoDetectChange?.(enabled, enabled ? null : selected);
      if (!enabled) {
        onChange?.(selected);
      }
    }

    function filterList(query) {
      const normalized = query.trim().toLowerCase();

      list.querySelectorAll(".language-option").forEach((option) => {
        const matches = option.dataset.value.toLowerCase().includes(normalized);
        option.hidden = !matches;
      });
    }

    trigger.addEventListener("click", () => {
      if (autoDetect) return;

      const collapsed = picker.classList.toggle("language-picker--collapsed");
      trigger.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });

    searchInput?.addEventListener("input", () => {
      filterList(searchInput.value);
    });

    list.addEventListener("click", (event) => {
      const option = event.target.closest(".language-option");
      if (!option || option.hidden || autoDetect) return;
      setSelected(option.dataset.value);
    });

    autoDetectInput?.addEventListener("change", () => {
      setAutoDetect(autoDetectInput.checked);
    });

    syncAutoDetectState();
    if (autoDetectInput) {
      autoDetectInput.checked = autoDetect;
    }

    picker.setValue = setSelected;
    picker.setDetectedLanguage = setDetectedLanguage;
    picker.getValue = () => (autoDetect ? null : selected);
    picker.isAutoDetect = () => autoDetect;
    picker.setAutoDetect = setAutoDetect;

    return picker;
  };

  App.createLanguagePanels = function createLanguagePanels({
    speakValue = "Urdu",
    translateValue = "English",
    speakAutoDetect = true,
    onSpeakChange,
    onTranslateChange,
    onSpeakAutoDetectChange,
  } = {}) {
    const row = document.createElement("div");
    row.className = "language-panels";

    const speakPicker = App.createLanguagePicker({
      id: "speak",
      icon: icons.microphone,
      title: "I speak",
      subtitle: "Choose the language you speak.",
      value: speakValue,
      showAutoDetect: true,
      autoDetectEnabled: speakAutoDetect,
      onChange: onSpeakChange,
      onAutoDetectChange: onSpeakAutoDetectChange,
    });

    const arrow = document.createElement("div");
    arrow.className = "language-panels-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = icons.arrowRight;

    const translatePicker = App.createLanguagePicker({
      id: "translate",
      icon: icons.translate,
      title: "Translate to",
      subtitle: "Choose the language to translate to.",
      value: translateValue,
      placeholder: "Select target language",
      onChange: onTranslateChange,
    });

    row.append(speakPicker, arrow, translatePicker);
    return row;
  };
})(window.EasyLips);
