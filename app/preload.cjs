const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  minimize: () => ipcRenderer.send("window-minimize"),
  hideToTray: () => ipcRenderer.send("window-hide-to-tray"),
  close: () => ipcRenderer.send("window-close"),
  updateTrayState: (payload) => ipcRenderer.send("tray-state-update", payload),
  onTrayCommand: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("tray-command", handler);
    return () => ipcRenderer.removeListener("tray-command", handler);
  },
  testGeminiLive: (payload) => ipcRenderer.invoke("gemini-live-test", payload),
  startGeminiLive: (payload) => ipcRenderer.invoke("gemini-live-start", payload),
  stopGeminiLive: (payload) => ipcRenderer.invoke("gemini-live-stop", payload),
  sendGeminiLiveAudio: (payload) => ipcRenderer.invoke("gemini-live-send-audio", payload),
  startGoogleAuth: (payload) => ipcRenderer.invoke("google-auth-start", payload),
  openExternalUrl: (url) => ipcRenderer.invoke("open-external-url", url),
  checkForUpdates: () => ipcRenderer.invoke("updates-check"),
  downloadUpdate: () => ipcRenderer.invoke("updates-download"),
  installUpdate: () => ipcRenderer.invoke("updates-install"),
  onUpdateEvent: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("update-event", handler);
    return () => ipcRenderer.removeListener("update-event", handler);
  },
  onGeminiLiveEvent: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("gemini-live-event", handler);
    return () => ipcRenderer.removeListener("gemini-live-event", handler);
  },
});
