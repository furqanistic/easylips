window.EasyLips = window.EasyLips || {};

(function (App) {
  /**
   * Lightweight store inspired by Zustand.
   * Supports: getState, setState, subscribe, persist.
   * No dependencies — vanilla JS for Electron renderer.
   */

  var STORAGE_KEY = "onelingo_store";
  var SESSION_DURATION_MS = 365 * 24 * 60 * 60 * 1000; /* 1 year */

  var listeners = new Set();
  var state = {
    /* ---- Auth session ---- */
    auth: {
      token: null,
      user: null,
      expiresAt: 0,
    },
    /* ---- Onboarding progress ---- */
    onboarding: {
      completedSteps: [],
    },
  };

  /* ── Persistence ── */

  function loadPersisted() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (parsed.auth) state.auth = Object.assign({}, state.auth, parsed.auth);
        if (parsed.onboarding) state.onboarding = Object.assign({}, state.onboarding, parsed.onboarding);
      }
    } catch (e) {
      /* corrupted storage — ignore */
    }
  }

  function persist() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          auth: state.auth,
          onboarding: state.onboarding,
        }),
      );
    } catch (e) {
      /* storage full or unavailable — ignore */
    }
  }

  /* Load on module init */
  loadPersisted();

  /* ── Public API ── */

  function getState() {
    return state;
  }

  function setState(partial) {
    if (typeof partial === "function") partial = partial(state);
    if (!partial || typeof partial !== "object") return state;

    var prev = state;
    state = Object.assign({}, state, partial);
    persist();
    notify(prev);
    return state;
  }

  function notify(prev) {
    listeners.forEach(function (listener) {
      try {
        listener(state, prev);
      } catch (e) {
        /* listener error — ignore */
      }
    });
  }

  function subscribe(listener) {
    listeners.add(listener);
    return function () {
      listeners.delete(listener);
    };
  }

  /* ── Auth helpers ── */

  function setSession(token, user, ttlMs) {
    var expiresAt = Date.now() + (ttlMs || SESSION_DURATION_MS);
    setState({
      auth: {
        token: token,
        user: user,
        expiresAt: expiresAt,
      },
    });
  }

  function clearSession() {
    setState({
      auth: {
        token: null,
        user: null,
        expiresAt: 0,
      },
    });
  }

  function isAuthenticated() {
    return !!state.auth.token && state.auth.expiresAt > Date.now();
  }

  function getAuthToken() {
    if (isAuthenticated()) return state.auth.token;
    return null;
  }

  function getUser() {
    if (isAuthenticated()) return state.auth.user;
    return null;
  }

  function timeUntilExpiry() {
    return Math.max(0, state.auth.expiresAt - Date.now());
  }

  /* ── Onboarding helpers ── */

  function markStepCompleted(stepId) {
    if (state.onboarding.completedSteps.indexOf(stepId) !== -1) return;
    setState(function (prev) {
      return {
        onboarding: {
          completedSteps: prev.onboarding.completedSteps.concat(stepId),
        },
      };
    });
  }

  function isStepCompleted(stepId) {
    return state.onboarding.completedSteps.indexOf(stepId) !== -1;
  }

  function clearOnboarding() {
    setState({
      onboarding: { completedSteps: [] },
    });
  }

  App.store = {
    getState: getState,
    setState: setState,
    subscribe: subscribe,
    /* auth */
    setSession: setSession,
    clearSession: clearSession,
    isAuthenticated: isAuthenticated,
    getAuthToken: getAuthToken,
    getUser: getUser,
    timeUntilExpiry: timeUntilExpiry,
    /* onboarding */
    markStepCompleted: markStepCompleted,
    isStepCompleted: isStepCompleted,
    clearOnboarding: clearOnboarding,
    /* constants */
    SESSION_DURATION_MS: SESSION_DURATION_MS,
  };
})(window.EasyLips);
