const { app, BrowserWindow, nativeTheme, ipcMain, shell, dialog } = require('electron');
const path = require('path');

var mainWindow;
var splashWindow;

// Protocol sBotics Communication
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('sbotics', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient('sbotics')
}





const createWindow = () => {
    const { screen } = require('electron')
    const primaryDisplay = screen.getPrimaryDisplay()
    const { height } = primaryDisplay.workAreaSize
    const heightFinal = Math.round(height * 0.8);
    const widthFinal = Math.round((16 * heightFinal) / 9);

    mainWindow = new BrowserWindow({
        width: widthFinal,
        height: heightFinal,
        show: false,
        autoHideMenuBar: true,
        title: "sBotics Launcher",
        icon: nativeTheme.shouldUseDarkColors ? path.join(__dirname, '/assets/icons/logo_white.ico') : path.join(__dirname, '/assets/icons/logo_dark.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

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
        title: "sBotics Launcher",
        icon: nativeTheme.shouldUseDarkColors ? path.join(__dirname, '/assets/icons/logo_white.ico') : path.join(__dirname, '/assets/icons/logo_dark.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

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
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
            var protocolLink = commandLine[1];

            console.log(commandLine[3])

        }

    })

    app.on('ready', () => {
        createWindow();
        app.on('activate', function() {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        })
    })

    app.on('open-url', (event, url) => {
        dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
    })
}

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})


//==> ipcMain <==
ipcMain.on('get-version', (event) => {
    event.returnValue = app.getVersion();
});

ipcMain.on('shell:open', () => {
    console.log("Shell Open");
})