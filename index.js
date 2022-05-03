const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Windows = require('./src/class/__instance_windows');
const WindowTouchBar = require('./src/class/__instance_touchbar');

handleSquirrelEvent();

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

// Windows Declaretion and Controller
var authWindow;
var splashWindow;
var mainWindow;
var windowsAllClose = false;
var mainWindowIsOpen = false;

const createWindow = (accessToken = null) => {
  const { screen } = require('electron');
  const windows = new Windows(screen);
  const touchbar = new WindowTouchBar();

  // Auth Window Instance
  authWindow = windows.auth();
  authWindow.loadFile(path.join(__dirname, '/routes/auth.html'));
  authWindow.setTouchBar(touchbar.auth());

  // Splash Window Instance
  splashWindow = windows.splash();
  splashWindow.loadFile(path.join(__dirname, '/routes/splash.html'));
  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
  });

  // Main Window Instance
  mainWindow = windows.main();
  mainWindow.setTouchBar(touchbar.main());

  authWindow.once('ready-to-show', () => {
    authWindow.on('close', function () {
      if (!splashWindow.isDestroyed()) {
        splashWindow.close();
      }
      if (!mainWindowIsOpen) {
        mainWindow.close();
      }
    });

    setTimeout(() => {
      if (!splashWindow.isDestroyed()) {
        splashWindow.close();
      }
      if (authWindow) {
        authWindow.show();
        if (accessToken) {
          authWindow.focus();
          authWindow.webContents.send('set_user_auth', accessToken);
        }
      }
    }, 1500);
  });
};

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (authWindow) {
      if (authWindow.isMinimized()) authWindow.restore();
      authWindow.focus();
        console.log(event);
        console.log(commandLine);
        console.log(workingDirectory);
      authWindow.webContents.send(
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
    if (windowsAllClose) {
      createWindow(url.split('accessToken=')[1]);
      return;
    }
    if (authWindow.isMinimized()) authWindow.restore();
    authWindow.focus();
    authWindow.webContents.send('set_user_auth', url.split('accessToken=')[1]);
  });
}
app.on('window-all-closed', function () {
  console.log('O eventos de fechar todas as telas foram acionados');
  windowsAllClose = true;
  if (process.platform !== 'darwin') app.quit();
});

// IpcMain Events
ipcMain.on('get-version', (event) => {
  event.returnValue = app.getVersion();
});
ipcMain.on('get-lang', (event) => {
  event.returnValue = app.getLocale();
});
ipcMain.on('open-window-main', () => {
  mainWindow.loadFile(path.join(__dirname, '/routes/main.html'));
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindowIsOpen = true;
    authWindow.close();
    authWindow = false;
  });
});
ipcMain.on('open-window-auth', () => {
  mainWindow.close();
  createWindow();
});
ipcMain.on('restart-app', () => {
  app.relaunch();
  app.exit();
});
ipcMain.on('close-app', () => {
  app.exit();
});