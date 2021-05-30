const { app, BrowserWindow, screen, ipcMain, remote } = require('electron');
const path = require('path');
const url = require('url');

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
  var window = new BrowserWindow({
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
