const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
    const { screen } = require('electron')
    const primaryDisplay = screen.getPrimaryDisplay()
    const { height } = primaryDisplay.workAreaSize
    const heightFinal = Math.round(height * 0.8);
    const widthFinal = Math.round((16 * heightFinal) / 9);

    let mainWindow = new BrowserWindow({
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

    let splashWindow = new BrowserWindow({
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

    // mainWindow.once('ready-to-show', () => {
    //     setTimeout(() => {
    //         splashWindow.close();
    //         mainWindow.show();
    //     }, 1500);
    // });
}

app.on('ready', () => {
    createWindow();
    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})


//==> ipcMain <==
ipcMain.on('get-version', (event) => {
    event.returnValue = app.getVersion();
});