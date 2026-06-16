window.EasyLips = window.EasyLips || {};

(function (App) {
  const { icons } = App;

  App.createSetupSummaryRow = function createSetupSummaryRow({
    icon,
    label,
    value,
  }) {
    const row = document.createElement("div");
    row.className = "setup-summary-row";
    row.innerHTML = `
      <span class="setup-summary-icon">${icon}</span>
      <span class="setup-summary-label">${label}</span>
      <span class="setup-summary-value">${value}</span>
      <span class="setup-summary-check">${icons.checkCircle}</span>
    `;
    return row;
  };

  App.createSetupSummaryCard = function createSetupSummaryCard(rows = []) {
    const card = document.createElement("div");
    card.className = "setup-summary-card";
    rows.forEach((row, index) => {
      card.appendChild(
        App.createSetupSummaryRow({
          icon: row.icon,
          label: row.label,
          value: row.value,
        }),
      );
      if (index < rows.length - 1) {
        const divider = document.createElement("div");
        divider.className = "setup-summary-divider";
        divider.setAttribute("aria-hidden", "true");
        card.appendChild(divider);
      }
    });
    return card;
  };

  App.createSetupTip = function createSetupTip({ html }) {
    const tip = document.createElement("p");
    tip.className = "setup-tip";
    tip.innerHTML = `${icons.info}<span>${html}</span>`;
    return tip;
  };
})(window.EasyLips);
