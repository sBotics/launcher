const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

if (handleSquirrelEvent()) {
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess, error;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {}
    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
}

var mainWindow;
var splashWindow;

// Protocol sBotics Communication
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('sbotics', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('sbotics');
}

const createWindow = () => {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { height } = primaryDisplay.workAreaSize;
  const heightFinal = Math.round(height * 0.8);
  const widthFinal = Math.round((16 * heightFinal) / 9);

  mainWindow = new BrowserWindow({
    width: widthFinal,
    height: heightFinal,
    show: false,
    autoHideMenuBar: true,
    title: 'sBotics Launcher',
    icon: path.join(__dirname, '/assets/icons/app/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '/routes/main.html'));

  splashWindow = new BrowserWindow({
    width: 470,
    height: 265,
    resizable: false,
    minimizable: false,
    maximizable: false,
    frame: false,
    show: false,
    alwaysOnTop: true,
    title: 'sBotics Launcher',
    icon: path.join(__dirname, '/assets/icons/app/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  splashWindow.loadFile(path.join(__dirname, '/routes/splash.html'));

  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
  });

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splashWindow.close();
      mainWindow.show();
    }, 1500);
  });
};

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      console.log(encodeURI(commandLine[3]));
      mainWindow.webContents.send(
        'set_user_auth',
        commandLine[3].split('accessToken=')[1],
      );
    }
  });

  app.on('ready', () => {
    createWindow();
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
  });
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

//==> ipcMain <==
ipcMain.on('get-version', (event) => {
  event.returnValue = app.getVersion();
});

ipcMain.on('get-lang', (event) => {
  event.returnValue = app.getLocale();
});
