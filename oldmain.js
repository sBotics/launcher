const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const shell = electron.shell;
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");
const fs = require("fs-extra");
const { GetConfig, SetConfigs } = require("./utils/configs");

let config;
var screenElectron = electron.screen;
var ScreenSize;
var openWindows = {};
var locale;
// try {
//   require("electron-reloader")(module);
// } catch (_) {}
let userData;

const LoadLocale = (lang = config.lang) => {
  const localesFolder = path.join(__dirname, "locales");
  const fallbackLang = "en";
  const systemLang = app.getLocale().replace("-", "_");
  const langFile = path.join(localesFolder, lang + ".json");
  const chosenLang = fs.existsSync(langFile)
    ? lang
    : fs.existsSync(path.join(localesFolder, systemLang + ".json"))
    ? systemLang
    : fallbackLang;
  chosenLang != lang && SetConfigs({ lang: chosenLang }, userData);
  locale = JSON.parse(
    fs.readFileSync(path.join(localesFolder, chosenLang + ".json"))
  );
  return locale;
};

app.on("ready", () => {
  userData = app.getPath("userData");
  config = GetConfig(userData);
  LoadLocale(config.lang);
  ScreenSize = screenElectron.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  //OpenMainWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

const OpenUpdateWindow = () => {
  if ("update" in openWindows) return;

  var window = new BrowserWindow({
    width: Math.round(ScreenSize.width * 0.3),
    height: Math.round(ScreenSize.height * 0.7),
    transparent: true,
    resizable: false,
    menu: null,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // window.loadURL(`file://${__dirname}/src/html/updating.html`);
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "/src/html/updating.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  window.once("ready-to-show", () => {
    window.show();
  });
  openWindows["update"] = window;
};

autoUpdater.on("update-available", () => {
  OpenUpdateWindow();
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on("update-not-available", () => {
  OpenMainWindow();
});

autoUpdater.on("download-progress", (data) => {
  openWindows["update"].webContents.send("progress", data);
});

app.on("window-all-closed", () => {
  app.quit();
});

const OpenMainWindow = () => {
  if ("main" in openWindows) return;

  var newHeight = Math.round(ScreenSize.height * 0.6);

  var window = new BrowserWindow({
    width: Math.round((16 * newHeight) / 9),
    height: newHeight,
    menu: null,
    resizable: true,
    frame: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //   window.loadURL(`file://${__dirname}/src/html/newIndex.html`);
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "/src/html/newIndex.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  window.once("ready-to-show", () => {
    window.show();
  });
  window.setMenuBarVisibility(false);
  // window.webContents.openDevTools();
  openWindows["main"] = window;
};

var CloseConfigContent = false;
const OpenConfigWindow = (event) => {
  if ("config" in openWindows) return;

  var newHeight = Math.round(ScreenSize.height * 0.4);

  var window = new BrowserWindow({
    width: Math.round((16 * newHeight) / 9),
    height: newHeight,
    resizable: true,
    frame: true,
    show: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    parent: openWindows["main"],
  });
  //   window.loadURL(`file://${__dirname}/src/html/config.html`);
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "/src/html/config.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  window.once("ready-to-show", () => {
    window.show();
    openWindows["main"].webContents.send("config-opened");
  });
  window.setMenuBarVisibility(false);
  openWindows["config"] = window;

  window.once("closed", () => {
    CloseConfigContent = true;
    openWindows["main"].webContents.send("config-closed");
    delete openWindows["config"];
  });
};

const tutorialLink =
  "https://sbotics.github.io/tutorial/content/index.html?lang=";

ipc.on("open-config", OpenConfigWindow);

ipc.on("close-config", () => {
  CloseConfigContent = false;
});

ipc.on("close-config_mode", (event) => {
  event.returnValue = CloseConfigContent;
});

ipc.on("open-tutorial", (ev) => {
  shell.openExternal(tutorialLink + config.lang);
});

ipc.on("choose-dir", (event) => {
  dialog
    .showOpenDialog(openWindows["config"], {
      properties: ["openDirectory"],
    })
    .then((paths) => {
      event.sender.send("selected-directory", paths);
    });
});

ipc.on("get-config", (event) => {
  event.returnValue = config;
});

ipc.on("get-locale", (event) => {
  event.returnValue = locale;
});

ipc.on("get-version", (event) => {
  event.returnValue = app.getVersion();
});

ipc.on("open-install-folder", (event) => {
  shell.openPath(config.downloadPath);
});

ipc.on("set-config", (event, data) => {
  config = SetConfigs(data, userData);
  if ("lang" in data) {
    Object.keys(openWindows).map((k) => {
      openWindows[k].webContents.send("reload-lang", LoadLocale(data["lang"]));
      openWindows[k].webContents.send("set-config", config);
    });
  }
});

ipc.on("end", (ev) => app.quit());
