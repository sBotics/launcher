const { app, BrowserWindow, screen, ipcMain, remote } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');

var window;

const ScreenCalc = () => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  return ScreenSize;
};

const OpenApplication = (screenSizeCalc) => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(screenSizeCalc.height * 0.5);
  const width = Math.round((16 * height) / 11);
  window = new BrowserWindow({
    titleBarStyle: 'sBotics Launcher',
    width: width,
    height: height,
    backgroundColor: '#000',
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  window.setMenuBarVisibility(false);
  window.loadURL('file://' + __dirname + '/routes/load.html');
};

app.on('ready', () => {
  OpenApplication(ScreenCalc());
});

// ipcMain
ipcMain.on('get-version', (event) => {
  event.returnValue = app.getVersion();
});

ipcMain.on('app-defaultpath', (event) => {
  event.returnValue = __dirname;
});

// AutoUpdater
ipcMain.on('update-init', (event) => {
  autoUpdater
    .checkForUpdates()
    .then(() => (event.returnValue = true))
    .catch(() => (event.returnValue = false));
});

autoUpdater.on('checking-for-update', () => {
  window.webContents.send('update-checking', true);
});

autoUpdater.on('update-available', (info) => {
  window.webContents.send('update-available', { state: true, data: info });
});

autoUpdater.on('update-not-available', (info) => {
  window.webContents.send('update-not-available', {
    state: false,
    data: info,
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  window.webContents.send('update-download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  window.webContents.send('update-downloaded', { state: true, info: info });
});

ipcMain.on('update-install', (event) => {
  autoUpdater.quitAndInstall();
});
