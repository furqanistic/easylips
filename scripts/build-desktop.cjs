const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const appDir = path.join(rootDir, "app");
const cacheDir = path.join(appDir, ".cache");
const sourceLogoPath = path.join(rootDir, "client", "public", "landing", "logo.png");
const buildResourcesDir = path.join(appDir, "build");
const buildIconPath = path.join(buildResourcesDir, "icon.png");
const buildIconPng256Path = path.join(buildResourcesDir, "icon-256.png");
const buildIconIcoPath = path.join(buildResourcesDir, "icon.ico");
const installerHeaderPath = path.join(buildResourcesDir, "installerHeader.bmp");
const installerSidebarPath = path.join(buildResourcesDir, "installerSidebar.bmp");
const uninstallerSidebarPath = path.join(buildResourcesDir, "uninstallerSidebar.bmp");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const requestedTarget = normalizeTarget(process.argv[2] || process.env.EASYLIPS_BUILD_TARGET || "current");
const hostPlatform = process.platform;
const target = requestedTarget === "current" ? currentHostTarget(hostPlatform) : requestedTarget;

if (!target) {
  fail(`Unsupported build host "${hostPlatform}". Use Windows or macOS for desktop installers.`);
}

if (target === "mac" && hostPlatform !== "darwin") {
  fail("macOS DMG builds must be run on macOS. Run `npm run mac` on your MacBook to create the Mac installer.");
}

if (target === "win" && hostPlatform !== "win32") {
  fail("Windows NSIS installer builds must be run on Windows. Run `npm run dist` on Windows to create the Windows installer.");
}

ensureAppDependencies();
prepareBuildResources();
runNpm(["--prefix", appDir, "run", `dist:${target}`]);

function normalizeTarget(value) {
  const normalized = String(value || "").trim().toLowerCase();
  const aliases = {
    current: "current",
    default: "current",
    win: "win",
    windows: "win",
    nsis: "win",
    mac: "mac",
    macos: "mac",
    darwin: "mac",
    dmg: "mac",
  };

  return aliases[normalized] || normalized;
}

function currentHostTarget(platform) {
  if (platform === "win32") return "win";
  if (platform === "darwin") return "mac";
  return null;
}

function ensureAppDependencies() {
  const electronBin =
    process.platform === "win32"
      ? path.join(appDir, "node_modules", ".bin", "electron.cmd")
      : path.join(appDir, "node_modules", ".bin", "electron");

  if (fs.existsSync(electronBin)) {
    return;
  }

  console.log("Installing Electron build dependencies...");
  runNpm(["--prefix", appDir, "ci", "--no-audit", "--no-fund"]);
}

function prepareBuildResources() {
  if (!fs.existsSync(sourceLogoPath)) {
    fail(`App icon source not found at ${sourceLogoPath}.`);
  }

  fs.mkdirSync(buildResourcesDir, { recursive: true });
  createPngIcon(sourceLogoPath, buildIconPath, 512);
  if (process.platform === "win32") {
    createPngIcon(sourceLogoPath, buildIconPng256Path, 256);
    createIcoFromPng(buildIconPng256Path, buildIconIcoPath);
    createWindowsInstallerArtwork(sourceLogoPath);
  }
  console.log(`Using app icon: ${sourceLogoPath}`);
}

function createPngIcon(sourcePath, destinationPath, size) {
  if (process.platform === "win32") {
    const script = [
      "Add-Type -AssemblyName System.Drawing",
      "$source = $env:EASYLIPS_ICON_SOURCE",
      "$destination = $env:EASYLIPS_ICON_DESTINATION",
      "$size = [int]$env:EASYLIPS_ICON_SIZE",
      "$image = [System.Drawing.Image]::FromFile($source)",
      "$bitmap = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)",
      "$graphics = [System.Drawing.Graphics]::FromImage($bitmap)",
      "$graphics.Clear([System.Drawing.Color]::Transparent)",
      "$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality",
      "$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic",
      "$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality",
      "$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality",
      "$graphics.DrawImage($image, 0, 0, $size, $size)",
      "$bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)",
      "$graphics.Dispose()",
      "$bitmap.Dispose()",
      "$image.Dispose()",
    ].join("; ");

    const result = spawnSync("powershell.exe", ["-NoProfile", "-Command", script], {
      cwd: rootDir,
      env: {
        ...process.env,
        EASYLIPS_ICON_SOURCE: sourcePath,
        EASYLIPS_ICON_DESTINATION: destinationPath,
        EASYLIPS_ICON_SIZE: String(size),
      },
      stdio: "inherit",
      shell: false,
    });

    if (result.error || result.status !== 0) {
      fail(result.error?.message || "Could not prepare the Windows app icon.");
    }
    return;
  }

  if (process.platform === "darwin") {
    const result = spawnSync("sips", ["-z", String(size), String(size), sourcePath, "--out", destinationPath], {
      cwd: rootDir,
      stdio: "inherit",
      shell: false,
    });

    if (result.error || result.status !== 0) {
      fail(result.error?.message || "Could not prepare the macOS app icon.");
    }
    return;
  }

  fs.copyFileSync(sourcePath, destinationPath);
}

function createIcoFromPng(pngPath, icoPath) {
  const png = fs.readFileSync(pngPath);
  const header = Buffer.alloc(22);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(0, 6);
  header.writeUInt8(0, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);

  fs.writeFileSync(icoPath, Buffer.concat([header, png]));
}

function createWindowsInstallerArtwork(sourcePath) {
  const script = [
    "Add-Type -AssemblyName System.Drawing",
    "$source = $env:EASYLIPS_ICON_SOURCE",
    "$headerPath = $env:EASYLIPS_INSTALLER_HEADER",
    "$sidebarPath = $env:EASYLIPS_INSTALLER_SIDEBAR",
    "$uninstallerPath = $env:EASYLIPS_UNINSTALLER_SIDEBAR",
    "function New-Brush($r, $g, $b) { New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($r, $g, $b)) }",
    "function New-Pen($r, $g, $b, $width) { New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb($r, $g, $b), $width) }",
    "function Draw-Logo($graphics, $logo, $x, $y, $size) { $graphics.DrawImage($logo, $x, $y, $size, $size) }",
    "$logo = [System.Drawing.Image]::FromFile($source)",
    "$fontLarge = New-Object System.Drawing.Font('Segoe UI', 17, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)",
    "$fontSmall = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)",
    "$white = New-Brush 255 255 255",
    "$muted = New-Brush 192 192 192",
    "$red = New-Brush 240 68 68",
    "$redPen = New-Pen 240 68 68 2",
    "$dark = New-Brush 8 8 8",
    "$panel = New-Brush 18 18 18",
    "$header = New-Object System.Drawing.Bitmap 150, 57, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)",
    "$g = [System.Drawing.Graphics]::FromImage($header)",
    "$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality",
    "$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic",
    "$g.FillRectangle($dark, 0, 0, 150, 57)",
    "$g.FillRectangle($panel, 0, 0, 150, 57)",
    "$g.FillRectangle($red, 0, 53, 150, 4)",
    "Draw-Logo $g $logo 10 11 35",
    "$g.DrawString('OneLingo', $fontLarge, $white, 52, 11)",
    "$g.DrawString('Desktop setup', $fontSmall, $muted, 54, 34)",
    "$header.Save($headerPath, [System.Drawing.Imaging.ImageFormat]::Bmp)",
    "$g.Dispose(); $header.Dispose()",
    "function New-Sidebar($destination, $label) {",
    "  $bitmap = New-Object System.Drawing.Bitmap 164, 314, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)",
    "  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)",
    "  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality",
    "  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic",
    "  $graphics.FillRectangle($dark, 0, 0, 164, 314)",
    "  $graphics.FillRectangle((New-Brush 16 16 16), 0, 0, 164, 314)",
    "  $graphics.FillRectangle((New-Brush 36 12 12), 0, 0, 164, 314)",
    "  $graphics.FillRectangle($red, 0, 0, 7, 314)",
    "  $graphics.DrawEllipse($redPen, 118, -28, 86, 86)",
    "  $graphics.DrawEllipse((New-Pen 255 255 255 1), -42, 234, 118, 118)",
    "  Draw-Logo $graphics $logo 43 38 78",
    "  $graphics.DrawString('OneLingo', $fontLarge, $white, 26, 142)",
    "  $graphics.DrawString($label, $fontSmall, $muted, 28, 168)",
    "  $graphics.FillRectangle($red, 28, 204, 54, 3)",
    "  $bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Bmp)",
    "  $graphics.Dispose(); $bitmap.Dispose()",
    "}",
    "New-Sidebar $sidebarPath 'Live translation'",
    "New-Sidebar $uninstallerPath 'Remove safely'",
    "$fontLarge.Dispose(); $fontSmall.Dispose(); $white.Dispose(); $muted.Dispose(); $red.Dispose(); $redPen.Dispose(); $dark.Dispose(); $panel.Dispose(); $logo.Dispose()",
  ].join("; ");

  const result = spawnSync("powershell.exe", ["-NoProfile", "-Command", script], {
    cwd: rootDir,
    env: {
      ...process.env,
      EASYLIPS_ICON_SOURCE: sourcePath,
      EASYLIPS_INSTALLER_HEADER: installerHeaderPath,
      EASYLIPS_INSTALLER_SIDEBAR: installerSidebarPath,
      EASYLIPS_UNINSTALLER_SIDEBAR: uninstallerSidebarPath,
    },
    stdio: "inherit",
    shell: false,
  });

  if (result.error || result.status !== 0) {
    fail(result.error?.message || "Could not prepare the Windows installer artwork.");
  }
}

function runNpm(args) {
  const command = process.platform === "win32" ? (process.env.ComSpec || "cmd.exe") : npmCmd;
  const commandArgs =
    process.platform === "win32"
      ? ["/d", "/s", "/c", [npmCmd, ...args].map(quoteWindowsArg).join(" ")]
      : args;

  const result = spawnSync(command, commandArgs, {
    cwd: rootDir,
    env: {
      ...process.env,
      ELECTRON_BUILDER_CACHE: path.join(cacheDir, "electron-builder"),
      ELECTRON_CACHE: path.join(cacheDir, "electron"),
    },
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    fail(result.error.message);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function quoteWindowsArg(value) {
  const text = String(value);
  if (!/[()\s^&|<>"]/.test(text)) return text;
  return `"${text.replace(/"/g, '\\"')}"`;
}

function fail(message) {
  console.error(`\nOneLingo build failed: ${message}\n`);
  process.exit(1);
}
