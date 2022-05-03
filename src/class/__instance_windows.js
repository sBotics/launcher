const { BrowserWindow } = require('electron');
const path = require('path');

class Windows {
  constructor(screen) {
    this.primaryDisplay = screen.getPrimaryDisplay();
    const { height } = this.primaryDisplay.workAreaSize;
    this.height = height;
  }
  splash() {
    console.log(__dirname);
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
      icon: path.join(__dirname, '../../assets/icons/icon.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
  }
  auth() {
    const height = Math.round(this.height * 0.8);
    return new BrowserWindow({
      width: Math.round((16 * height) / 9),
      height: height,
      minHeight: 600,
      minWidth: 600,
      show: false,
      autoHideMenuBar: true,
      title: 'sBotics Launcher',
      icon: path.join(__dirname, '../../assets/icons/icon.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
  }
  main() {
    const height = Math.round(this.height * 0.8);
    return new BrowserWindow({
      width: Math.round((16 * height) / 9),
      height: height,
      minHeight: 600,
      minWidth: 600,
      show: false,
      autoHideMenuBar: true,
      title: 'sBotics Launcher',
      icon: path.join(__dirname, '../../assets/icons/icon.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
  }
}

module.exports = Windows;
