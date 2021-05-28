// const { app, ipcMain, screen } = require('electron');
// var windowManager = require('electron-window-manager');

// var Load = null;

// app.on('ready', function () {
//   ScreenSize = screen.getPrimaryDisplay();
//   ScreenSize = ScreenSize.bounds;
//   // var height = Math.round(ScreenSize.height * 0.6);
//   // const width = Math.round((16 * height) / 9);
//   var height = Math.round(ScreenSize.height * 0.5);
//   const width = Math.round((16 * height) / 11);

//   windowManager.init({
//     devMode: false,
//     defaultWindowTitle: 'sBotics Launcher',
//   });

//   Load = windowManager.createNew(
//     'load',
//     'sBotics Launcher',
//     'file://' + __dirname + '/routes/load.html',
//     false,
//     {
//       width: width,
//       height: height,
//       showDevTools: true,
//       DevTools: true,
//       menu: null,
//       transparent: false,
//       frame: false,
//       resizable: true,
//       webPreferences: {
//         nodeIntegration: true,
//         contextIsolation: false,
//         enableRemoteModule: true,
//       },
//     },
//   );
//   Load.open();
// });

const { app, BrowserWindow, screen } = require('electron');
let window;

app.whenReady().then(() => {
  ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  // var height = Math.round(ScreenSize.height * 0.6);
  // const width = Math.round((16 * height) / 9);
  var height = Math.round(ScreenSize.height * 0.5);
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
});
