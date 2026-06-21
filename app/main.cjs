const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  session,
  shell,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
} = require("electron");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const crypto = require("node:crypto");

let mainWindow = null;
let tray = null;
let isQuitting = false;
const TOGGLE_TRANSLATION_SHORTCUT = "CommandOrControl+Alt+T";
const DEFAULT_WINDOW_WIDTH = 1280;
const DEFAULT_WINDOW_HEIGHT = 800;
const MIN_WINDOW_WIDTH = 960;
const MIN_WINDOW_HEIGHT = 640;
const trayState = {
  speakLanguage: "Urdu",
  translateLanguage: "",
  speakAutoDetect: true,
  languages: [],
  preferredLanguages: ["English", "Urdu", "Hindi", "Arabic", "Spanish", "French", "German"],
  isRunning: false,
  remainingSeconds: 120 * 60,
};

const GEMINI_LIVE_TRANSLATE_MODEL = "gemini-3.5-live-translate-preview";
const GEMINI_LIVE_WS_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

function createTrayImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#f04444"/>
      <path d="M10 10v12h8" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 10v12" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `;

  const image = nativeImage.createFromDataURL(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  image.setTemplateImage(false);
  return image.resize({ width: 16, height: 16 });
}

function base64Url(buffer) {
  return Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createCodeVerifier() {
  return base64Url(crypto.randomBytes(64));
}

function createCodeChallenge(verifier) {
  return base64Url(crypto.createHash("sha256").update(verifier).digest());
}

function createGoogleCallbackHtml(success, message) {
  const title = success ? "Google sign-in complete" : "Google sign-in failed";
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <style>
          body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #080808; color: #fff; font-family: system-ui, sans-serif; }
          main { max-width: 420px; padding: 32px; text-align: center; }
          h1 { font-size: 24px; margin: 0 0 12px; }
          p { color: rgba(255,255,255,.68); line-height: 1.5; margin: 0; }
        </style>
      </head>
      <body>
        <main>
          <h1>${title}</h1>
          <p>${message}</p>
        </main>
      </body>
    </html>`;
}

function startGoogleOAuth({ clientId }) {
  const placeholder = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
  if (!clientId || clientId === placeholder) {
    return Promise.resolve({
      ok: false,
      code: "missing_client_id",
      message: "Replace EasyLips.GOOGLE_CLIENT_ID in app/js/setup-config.js first.",
    });
  }

  return new Promise((resolve) => {
    const codeVerifier = createCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);
    const state = base64Url(crypto.randomBytes(32));
    const nonce = base64Url(crypto.randomBytes(32));
    let settled = false;
    let timeout = null;

    const server = http.createServer((req, res) => {
      const url = new URL(req.url || "/", "http://127.0.0.1");

      if (url.pathname !== "/oauth/google/callback") {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const returnedState = url.searchParams.get("state");
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      function finish(result) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        server.close();
        resolve(result);
      }

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(createGoogleCallbackHtml(false, "You can close this tab and return to Easy Lips."));
        finish({ ok: false, code: "google_error", message: error });
        return;
      }

      if (!code || returnedState !== state) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(createGoogleCallbackHtml(false, "The Google response could not be verified."));
        finish({ ok: false, code: "state_mismatch", message: "Google OAuth state mismatch." });
        return;
      }

      const redirectUri = `http://127.0.0.1:${server.address().port}/oauth/google/callback`;
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(createGoogleCallbackHtml(true, "Return to Easy Lips to continue setup."));
      finish({ ok: true, code, codeVerifier, redirectUri, nonce });
    });

    server.listen(0, "127.0.0.1", async () => {
      const redirectUri = `http://127.0.0.1:${server.address().port}/oauth/google/callback`;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        access_type: "offline",
        prompt: "select_account",
      });

      timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        server.close();
        resolve({
          ok: false,
          code: "timeout",
          message: "Google sign-in timed out. Please try again.",
        });
      }, 120000);

      await shell.openExternal(`${GOOGLE_AUTH_URL}?${params.toString()}`);
    });

    server.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({
        ok: false,
        code: "callback_server_failed",
        message: error.message || "Could not start the Google callback server.",
      });
    });
  });
}

function sendTrayCommand(command) {
  if (!mainWindow) {
    createWindow();
  }

  const send = () => {
    mainWindow?.webContents?.send("tray-command", command);
  };

  if (mainWindow?.webContents?.isLoading()) {
    mainWindow.webContents.once("did-finish-load", send);
  } else {
    send();
  }
}

function showMainWindow() {
  if (!mainWindow) {
    createWindow();
    return;
  }

  mainWindow.setSkipTaskbar(false);
  mainWindow.show();
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow.focus();
}

function updateTrayMenu() {
  if (!tray) return;

  const preferredLanguages = [
    trayState.speakLanguage,
    trayState.translateLanguage,
    ...trayState.preferredLanguages,
  ].filter(Boolean);
  const languages = [...new Set(preferredLanguages)].filter((language) =>
    !trayState.languages.length || trayState.languages.includes(language),
  );
  const running = activeSessions.size > 0 || trayState.isRunning;
  const remainingMinutes = Math.max(0, Math.ceil((trayState.remainingSeconds || 0) / 60));

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Show Easy Lips", click: showMainWindow },
    { label: `${remainingMinutes} minutes remaining`, enabled: false },
    {
      label: `Toggle translation (${process.platform === "darwin" ? "Cmd" : "Ctrl"}+Alt+T)`,
      click: () => sendTrayCommand({ type: "toggle-translation" }),
    },
    {
      label: "Translation",
      submenu: [
        {
          label: "Start translation",
          enabled: !running,
          click: () => sendTrayCommand({ type: "start-translation" }),
        },
        {
          label: "Stop translation",
          enabled: running,
          click: () => sendTrayCommand({ type: "stop-translation" }),
        },
      ],
    },
    { type: "separator" },
    {
      label: "I speak",
      submenu: [
        {
          label: "Auto-detect",
          type: "checkbox",
          checked: trayState.speakAutoDetect,
          click: () => sendTrayCommand({ type: "set-speak-autodetect", enabled: !trayState.speakAutoDetect }),
        },
        { type: "separator" },
        ...languages.map((language) => ({
          label: language,
          type: "radio",
          checked: !trayState.speakAutoDetect && trayState.speakLanguage === language,
          click: () => sendTrayCommand({ type: "set-speak-language", language }),
        })),
        { type: "separator" },
        {
          label: "Search/change in app...",
          click: () => {
            showMainWindow();
            sendTrayCommand({ type: "open-language-settings" });
          },
        },
      ],
    },
    {
      label: "Translate to",
      submenu: [
        ...languages.map((language) => ({
          label: language,
          type: "radio",
          checked: trayState.translateLanguage === language,
          click: () => sendTrayCommand({ type: "set-translate-language", language }),
        })),
        { type: "separator" },
        {
          label: "Search/change in app...",
          click: () => {
            showMainWindow();
            sendTrayCommand({ type: "open-language-settings" });
          },
        },
      ],
    },
    { type: "separator" },
    {
      label: "Quit Easy Lips",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]));
}

function ensureTray() {
  if (!tray) {
    tray = new Tray(createTrayImage());
    tray.setToolTip("Easy Lips");
    tray.on("click", showMainWindow);
    tray.on("double-click", showMainWindow);
  }

  updateTrayMenu();
  return tray;
}

function updateTrayState(nextState = {}) {
  Object.assign(trayState, nextState);
  updateTrayMenu();
}

function hideMainWindowToTray(win = mainWindow) {
  if (!win) return;

  ensureTray();
  win.setSkipTaskbar(true);
  win.hide();
}

function readDotEnv(filePath) {
  try {
    const contents = fs.readFileSync(filePath, "utf8");
    contents.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const separator = trimmed.indexOf("=");
      if (separator === -1) return;

      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
  } catch {
    // The desktop app can run without a local .env file.
  }
}

readDotEnv(path.join(__dirname, "..", ".env"));
readDotEnv(path.join(__dirname, ".env"));

function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    ""
  ).trim();
}

function getWebSocketCtor() {
  if (typeof WebSocket === "function") return WebSocket;

  try {
    return require("undici").WebSocket;
  } catch {
    return null;
  }
}

function formatGeminiCloseReason(event) {
  const reason = event.reason || `WebSocket closed with code ${event.code}`;
  if (event.code === 1000) return null;
  return reason;
}

async function readWebSocketJson(data) {
  let text = "";

  if (typeof data === "string") {
    text = data;
  } else if (data instanceof ArrayBuffer) {
    text = Buffer.from(data).toString("utf8");
  } else if (Buffer.isBuffer(data)) {
    text = data.toString("utf8");
  } else if (ArrayBuffer.isView(data)) {
    text = Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf8");
  } else if (data?.text && typeof data.text === "function") {
    text = await data.text();
  } else if (data?.arrayBuffer && typeof data.arrayBuffer === "function") {
    text = Buffer.from(await data.arrayBuffer()).toString("utf8");
  } else {
    throw new TypeError("Unsupported WebSocket message type.");
  }

  return JSON.parse(text);
}

function broadcastLiveEvent(type, payload = {}) {
  mainWindow?.webContents?.send("gemini-live-event", { type, ...payload });
}

const activeSessions = new Map();

function buildGeminiLiveSetupConfig({ targetLanguageCode }) {
  const translationConfig = {
    targetLanguageCode,
    echoTargetLanguage: true,
  };

  return {
    model: `models/${GEMINI_LIVE_TRANSLATE_MODEL}`,
    generationConfig: {
      responseModalities: ["AUDIO"],
      translationConfig,
    },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
  };
}

function createGeminiLiveSession({ targetLanguageCode, sourceLanguageCode = null }) {
  const apiKey = getGeminiApiKey();
  const WebSocketCtor = getWebSocketCtor();

  if (!apiKey) {
    return Promise.resolve({
      ok: false,
      code: "missing_api_key",
      message: "Add GEMINI_API_KEY to app/.env or your environment, then restart the app.",
    });
  }

  if (!targetLanguageCode) {
    return Promise.resolve({
      ok: false,
      code: "missing_target_language",
      message: "Choose a target language before starting Gemini Live.",
    });
  }

  if (!WebSocketCtor) {
    return Promise.resolve({
      ok: false,
      code: "websocket_unavailable",
      message: "This Electron runtime does not expose a WebSocket client.",
    });
  }

  return new Promise((resolve) => {
    const sessionId = crypto.randomUUID?.() || `session-${Date.now()}-${Math.random()}`;
    let settled = false;
    let websocket = null;

    function finish(result, { keepAlive = false } = {}) {
      if (settled) return;
      settled = true;

      if (!keepAlive) {
        try {
          websocket?.close(1000);
        } catch {
          // Best-effort cleanup.
        }
      }

      activeSessions.delete(sessionId);
      broadcastLiveEvent("disconnected", { sessionId, ...result });
      resolve(result);
    }

    function resolveSuccess(result) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(result);
    }

    const timeout = setTimeout(() => {
      finish({
        ok: false,
        code: "timeout",
        message: "Gemini did not finish the Live API setup handshake in time.",
      });
    }, 15000);

    try {
      const url = `${GEMINI_LIVE_WS_URL}?key=${encodeURIComponent(apiKey)}`;
      websocket = new WebSocketCtor(url);

      websocket.addEventListener("open", () => {
        websocket.send(JSON.stringify({
          setup: buildGeminiLiveSetupConfig({ targetLanguageCode }),
        }));
      });

      websocket.addEventListener("message", async (event) => {
        let message = null;

        try {
          message = await readWebSocketJson(event.data);
        } catch {
          finish({
            ok: false,
            code: "invalid_response",
            message: "Gemini returned a response the app could not parse.",
          });
          return;
        }

        if (message.error) {
          finish({
            ok: false,
            code: "gemini_error",
            message: message.error.message || "Gemini rejected the Live API setup.",
          });
          return;
        }

        if (message.setupComplete) {
          activeSessions.set(sessionId, {
            websocket,
            targetLanguageCode,
            sourceLanguageCode,
            stop() {
              try {
                websocket?.close(1000);
              } catch {
                // Ignore.
              }
              clearTimeout(timeout);
              activeSessions.delete(sessionId);
              updateTrayMenu();
              broadcastLiveEvent("stopped", { sessionId });
            },
            sendAudio(base64) {
              if (websocket?.readyState !== 1) return;
              websocket.send(JSON.stringify({
                realtimeInput: {
                  audio: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64,
                  },
                },
              }));
            },
          });
          updateTrayMenu();

          broadcastLiveEvent("connected", { sessionId, targetLanguageCode, sourceLanguageCode });
          resolveSuccess({
            ok: true,
            code: "connected",
            message: `Connected to ${GEMINI_LIVE_TRANSLATE_MODEL}.`,
            model: GEMINI_LIVE_TRANSLATE_MODEL,
            sessionId,
            targetLanguageCode,
            sourceLanguageCode,
          });
          return;
        }

        if (message.serverContent) {
          const content = message.serverContent;

          if (content.inputTranscription) {
            broadcastLiveEvent("input-transcript", {
              sessionId,
              text: content.inputTranscription.text,
              languageCode: content.inputTranscription.languageCode,
            });
          }

          if (content.outputTranscription) {
            broadcastLiveEvent("output-transcript", {
              sessionId,
              text: content.outputTranscription.text,
              languageCode: content.outputTranscription.languageCode,
            });
          }

          for (const part of content.modelTurn?.parts || []) {
            if (part.inlineData?.mimeType?.startsWith("audio/")) {
              broadcastLiveEvent("output-audio", {
                sessionId,
                mimeType: part.inlineData.mimeType,
                data: part.inlineData.data,
              });
            } else if (typeof part.text === "string") {
              broadcastLiveEvent("output-text", {
                sessionId,
                text: part.text,
              });
            }
          }
        }
      });

      websocket.addEventListener("error", () => {
        finish({
          ok: false,
          code: "network_error",
          message: "Could not connect to Gemini. Check your network, key, and billing/access.",
        });
      });

      websocket.addEventListener("close", (event) => {
        const reason = formatGeminiCloseReason(event);

        if (activeSessions.has(sessionId)) {
          activeSessions.delete(sessionId);
          updateTrayMenu();
          broadcastLiveEvent("disconnected", {
            sessionId,
            ok: false,
            code: "closed",
            message: reason || "Gemini Live session closed.",
          });
          return;
        }

        if (!reason && settled) return;

        finish({
          ok: false,
          code: "closed",
          message: reason || "Gemini Live session closed.",
        });
      });
    } catch (error) {
      finish({
        ok: false,
        code: "connection_failed",
        message: error.message || "Gemini Live API connection failed.",
      });
    }
  });
}

function stopGeminiLiveSession(sessionId) {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.stop();
    updateTrayMenu();
    return { ok: true };
  }

  for (const [id, session] of activeSessions) {
    session.stop();
  }
  activeSessions.clear();
  updateTrayMenu();

  return { ok: true };
}

function sendGeminiLiveAudio(sessionId, base64Audio) {
  const session = activeSessions.get(sessionId);
  if (!session) return { ok: false, message: "No active Gemini Live session." };
  session.sendAudio(base64Audio);
  return { ok: true };
}

function testGeminiLiveConnection({ targetLanguageCode }) {
  const apiKey = getGeminiApiKey();
  const WebSocketCtor = getWebSocketCtor();

  if (!apiKey) {
    return Promise.resolve({
      ok: false,
      code: "missing_api_key",
      message: "Add GEMINI_API_KEY to app/.env or your environment, then restart the app.",
    });
  }

  if (!targetLanguageCode) {
    return Promise.resolve({
      ok: false,
      code: "missing_target_language",
      message: "Choose a target language before testing Gemini.",
    });
  }

  if (!WebSocketCtor) {
    return Promise.resolve({
      ok: false,
      code: "websocket_unavailable",
      message: "This Electron runtime does not expose a WebSocket client.",
    });
  }

  return new Promise((resolve) => {
    let settled = false;
    let websocket = null;

    function finish(result) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      try {
        websocket?.close();
      } catch {
        // Closing after a failed setup is best-effort.
      }

      resolve(result);
    }

    const timeout = setTimeout(() => {
      finish({
        ok: false,
        code: "timeout",
        message: "Gemini did not finish the Live API setup handshake in time.",
      });
    }, 12000);

    try {
      const url = `${GEMINI_LIVE_WS_URL}?key=${encodeURIComponent(apiKey)}`;
      websocket = new WebSocketCtor(url);

      websocket.addEventListener("open", () => {
        websocket.send(JSON.stringify({
          setup: {
            model: `models/${GEMINI_LIVE_TRANSLATE_MODEL}`,
            generationConfig: {
              responseModalities: ["AUDIO"],
              translationConfig: {
                targetLanguageCode,
                echoTargetLanguage: true,
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        }));
      });

      websocket.addEventListener("message", async (event) => {
        let message = null;

        try {
          message = await readWebSocketJson(event.data);
        } catch {
          finish({
            ok: false,
            code: "invalid_response",
            message: "Gemini returned a response the app could not parse.",
          });
          return;
        }

        if (message.error) {
          finish({
            ok: false,
            code: "gemini_error",
            message: message.error.message || "Gemini rejected the Live API setup.",
          });
          return;
        }

        if (message.setupComplete) {
          finish({
            ok: true,
            code: "connected",
            message: `Connected to ${GEMINI_LIVE_TRANSLATE_MODEL}.`,
            model: GEMINI_LIVE_TRANSLATE_MODEL,
            targetLanguageCode,
          });
        }
      });

      websocket.addEventListener("error", () => {
        finish({
          ok: false,
          code: "network_error",
          message: "Could not connect to Gemini. Check your network, key, and billing/access.",
        });
      });

      websocket.addEventListener("close", (event) => {
        const reason = formatGeminiCloseReason(event);
        if (!reason) return;

        finish({
          ok: false,
          code: "closed",
          message: reason,
        });
      });
    } catch (error) {
      finish({
        ok: false,
        code: "connection_failed",
        message: error.message || "Gemini Live API connection failed.",
      });
    }
  });
}

function createWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: DEFAULT_WINDOW_WIDTH,
    height: DEFAULT_WINDOW_HEIGHT,
    minWidth: MIN_WINDOW_WIDTH,
    minHeight: MIN_WINDOW_HEIGHT,
    maxWidth: DEFAULT_WINDOW_WIDTH,
    maxHeight: DEFAULT_WINDOW_HEIGHT,
    resizable: true,
    maximizable: false,
    fullscreenable: false,
    fullscreen: false,
    backgroundColor: "#000000",
    autoHideMenuBar: true,
    frame: false,
    title: "Easy Lips",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMinimumSize(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT);
  mainWindow.setMaximumSize(DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT);
  mainWindow.setResizable(true);
  mainWindow.setMaximizable(false);
  mainWindow.setFullScreenable(false);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("close", (event) => {
    if (!isQuitting && activeSessions.size > 0) {
      event.preventDefault();
      hideMainWindowToTray(mainWindow);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.on("window-minimize", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on("window-hide-to-tray", (event) => {
  hideMainWindowToTray(BrowserWindow.fromWebContents(event.sender));
});

ipcMain.on("tray-state-update", (_event, payload = {}) => {
  updateTrayState(payload);
});

ipcMain.on("window-close", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle("gemini-live-test", (_event, payload = {}) => {
  return testGeminiLiveConnection({
    targetLanguageCode: payload.targetLanguageCode,
  });
});

ipcMain.handle("google-auth-start", (_event, payload = {}) => {
  return startGoogleOAuth({
    clientId: payload.clientId,
  });
});

ipcMain.handle("gemini-live-start", (_event, payload = {}) => {
  return createGeminiLiveSession({
    targetLanguageCode: payload.targetLanguageCode,
    sourceLanguageCode: payload.sourceLanguageCode || null,
  });
});

ipcMain.handle("gemini-live-stop", (_event, payload = {}) => {
  return stopGeminiLiveSession(payload.sessionId);
});

ipcMain.handle("gemini-live-send-audio", (_event, payload = {}) => {
  return sendGeminiLiveAudio(payload.sessionId, payload.audio);
});

app.on("before-quit", () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
  stopGeminiLiveSession();
});

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === "media" || permission === "microphone" || permission === "display-capture");
  });

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === "media" || permission === "microphone" || permission === "display-capture";
  });

  session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
    desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
      callback({
        video: sources[0],
        audio: "loopback",
      });
    }).catch(() => {
      callback({});
    });
  });

  ensureTray();
  globalShortcut.register(TOGGLE_TRANSLATION_SHORTCUT, () => {
    sendTrayCommand({ type: "toggle-translation" });
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("web-contents-created", (_event, contents) => {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});
