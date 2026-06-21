window.EasyLips = window.EasyLips || {};

(function (App) {
  const API_URL = App.API_URL || "http://localhost:8000";
  const ACCESS_TOKEN_KEY = "easylips_access_token";

  class AuthError extends Error {
    constructor(message, { status = 0, details = null } = {}) {
      super(message);
      this.name = "AuthError";
      this.status = status;
      this.details = details;
    }
  }

  function setAccessToken(token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  function clearAccessToken() {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  async function parseResponse(response) {
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new AuthError("The auth server returned an invalid response.", {
          status: response.status,
        });
      }
    }

    if (!response.ok) {
      throw new AuthError(
        data?.error?.message || "Authentication failed. Please try again.",
        {
          status: response.status,
          details: data?.error?.details || null,
        },
      );
    }

    return data;
  }

  async function authRequest(path, body) {
    let response;

    try {
      response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new AuthError(
        "Could not reach the auth server. Start the server and try again.",
      );
    }

    const data = await parseResponse(response);
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
    }
    return data;
  }

  App.auth = {
    AuthError,
    clearAccessToken,
    async google() {
      if (!window.electronAPI?.startGoogleAuth) {
        throw new AuthError("Google sign-in is only available in the desktop app.");
      }

      const oauth = await window.electronAPI.startGoogleAuth({
        clientId: App.GOOGLE_CLIENT_ID,
      });

      if (!oauth?.ok) {
        throw new AuthError(oauth?.message || "Google sign-in was cancelled.", {
          status: 0,
        });
      }

      return authRequest("/auth/google", {
        code: oauth.code,
        codeVerifier: oauth.codeVerifier,
        redirectUri: oauth.redirectUri,
        nonce: oauth.nonce,
      });
    },
    login({ email, password }) {
      return authRequest("/auth/login", { email, password });
    },
    signup({ email, password, name }) {
      return authRequest("/auth/signup", { email, password, name });
    },
  };
})(window.EasyLips);
