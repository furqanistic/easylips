window.EasyLips = window.EasyLips || {};

EasyLips.icons = {
  logo: `<img src="assets/home/logoicon.png" class="logo-icon" alt="OneLingo" />`,

  minimize: `<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,

  maximize: `<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>`,

  close: `<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,

  google: `<svg class="google-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>`,

  email: `<svg class="email-icon" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1.5" y="3.5" width="15" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
    <path d="M1.5 5.5L9 10.5L16.5 5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  arrowRight: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  arrowLeft: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  eye: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
  </svg>`,

  eyeOff: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a18.46 18.46 0 0 1-4.02 5.18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.73 6.73A18.46 18.46 0 0 0 2 12s3.5 7 10 7a10.94 10.94 0 0 0 5.76-1.63" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 2l20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  microphone: `<svg class="language-picker-icon-svg" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" stroke-width="1.4"/>
    <path d="M4 9.5a6 6 0 0 0 12 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M10 15.5V18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M7.5 18h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`,

  translate: `<svg class="language-picker-icon-svg" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="8" width="2" height="5" rx="1" fill="currentColor"/>
    <rect x="6" y="5" width="2" height="11" rx="1" fill="currentColor"/>
    <rect x="10" y="3" width="2" height="14" rx="1" fill="currentColor"/>
    <rect x="14" y="6" width="2" height="8" rx="1" fill="currentColor"/>
  </svg>`,

  globe: `<svg class="language-option-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/>
    <path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  search: `<svg class="language-search-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.3"/>
    <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`,

  chevronDown: `<svg class="language-picker-chevron" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  check: `<svg class="language-option-check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  deviceMic: `<svg class="language-option-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" stroke="currentColor" stroke-width="1.2"/>
    <path d="M3 7.5a5 5 0 0 0 10 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M8 12.5V14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  laptopMic: `<svg class="language-option-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="3" width="12" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
    <path d="M5.5 13h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="8" cy="7" r="1.2" fill="currentColor"/>
  </svg>`,

  speaker: `<svg class="language-option-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 5.5v5h2.5L9 14V2L5.5 5.5H3z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M11 5.5a2.5 2.5 0 0 1 0 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M12.5 4a4.5 4.5 0 0 1 0 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,

  headphones: `<svg class="language-option-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3.5 8.5V7a4.5 4.5 0 0 1 9 0v1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <rect x="2.5" y="8" width="2.5" height="5" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
    <rect x="11" y="8" width="2.5" height="5" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
  </svg>`,

  virtualMic: `<svg class="language-option-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1.5" y="6" width="1.5" height="4" rx="0.75" fill="currentColor"/>
    <rect x="4.5" y="4" width="1.5" height="8" rx="0.75" fill="currentColor"/>
    <rect x="7.5" y="2.5" width="1.5" height="11" rx="0.75" fill="currentColor"/>
    <rect x="10.5" y="5" width="1.5" height="6" rx="0.75" fill="currentColor"/>
    <rect x="13" y="3.5" width="1.5" height="9" rx="0.75" fill="currentColor"/>
  </svg>`,

  user: `<svg class="setup-summary-icon-svg" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.4"/>
    <path d="M4.5 17c0-3.5 2.5-5.5 5.5-5.5s5.5 2 5.5 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`,

  checkCircle: `<svg class="setup-summary-check-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="#22c55e" stroke-width="1.2"/>
    <path d="M5 8l2 2 4-4.5" stroke="#22c55e" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  info: `<svg class="setup-tip-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
    <path d="M8 7v4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="8" cy="5.25" r="0.75" fill="currentColor"/>
  </svg>`,
};
