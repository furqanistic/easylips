# EasyLips Desktop Builds

Run the same command from the repository root on the machine you want to build for:

```sh
npm run dist
```

On Windows, this creates an NSIS installer in `app/release/`.

On macOS, this creates DMG installers for Intel and Apple Silicon Macs in `app/release/`.

## App Updates

Installed apps check for updates from:

```text
https://updates.easylips.ai/desktop
```

For each public release:

1. Increase the version in `app/package.json`.
2. Run `npm run win` on Windows and `npm run mac` on macOS.
3. Upload the generated installer, `.blockmap`, and update metadata `.yml` files from `app/release/` to the update URL above.

When an installed app sees a newer version, it shows an in-app notification with a download button. After the download finishes, it shows a restart button to install the update.

Platform notes:

- Build Windows installers on Windows and macOS installers on macOS. Electron Builder cannot reliably create signed macOS DMGs from Windows.
- The desktop app currently talks to `http://localhost:8000` for auth/API calls. For real distribution, deploy the server and update `app/js/setup-config.js` before building.
- To distribute a macOS app outside your own machine, use an Apple Developer certificate and notarization credentials with Electron Builder's standard environment variables.
- The current build is installable but uses Electron's default app icon because no Windows `.ico` or macOS `.icns` asset exists in the repo yet.

Explicit platform commands are also available:

```sh
npm run win
npm run mac
```
