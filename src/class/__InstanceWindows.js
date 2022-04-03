const { BrowserWindow } = require('electron');
const path = require('path');

class Windows {
  constructor(screen) {
    this.primaryDisplay = screen.getPrimaryDisplay();
    const { height } = this.primaryDisplay.workAreaSize;
    this.height = height;
  }
  auth() {
    const height = Math.round(this.height * 0.8);
    return new BrowserWindow({
      width: Math.round((16 * height) / 9),
      height: height,
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
  }
  splash() {
    return new BrowserWindow({
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
  }
}

module.exports = Windows;
