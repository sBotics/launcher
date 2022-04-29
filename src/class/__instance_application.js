let ipcRenderer = require('electron').ipcRenderer;
const os = require('os');
import { StringToBoolean } from '../utils/conver-data.js';

class Application {
  constructor() {}
  SLMP() {
    const slmp = StringToBoolean(process.env.SLMP);
    try {
      return slmp != undefined ? slmp : false;
    } catch (error) {
      return false;
    }
  }
  getLocale() {
    const locale = ipcRenderer.sendSync('get-lang').replace('-', '_');
    const languageAvarible = ['pt_BR'];
    return languageAvarible.indexOf(locale) > -1 ? locale : 'en_US';
  }
  getVersion() {
    return ipcRenderer.sendSync('get-version');
  }
  getOS() {
    return process.platform.toLowerCase();
  }
  getDefaultPath() {
    return ipcRenderer.sendSync('app-defaultpath');
  }
  getOSFolder() {
    const platforms = {
      win32: 'Windows',
      darwin: 'macOS',
      linux: 'Linux',
    };
    return platforms[this.getOS()];
  }
  getOSText() {
    const platforms = {
      win32: 'Windows',
      darwin: 'OSX',
      linux: 'Linux',
    };
    return platforms[this.getOS()];
  }
  getFolderDefault() {
    return `${os.homedir()}/sBotics`;
  }
  getFolderPathLauncher() {
    return `${this.getFolderDefault()}/Launcher`;
  }
  getFolderPathSboticsSimulation() {
    return `${this.getFolderDefault()}/Applications/sBotics_simulation`;
  }
  getFolderPathSboticsSimulationStreamingAssets() {
    const platforms = {
      win32: 'sBotics/sBotics_Data/StreamingAssets/',
      darwin: 'sBotics/sBotics.app/Contents/Resources/Data/StreamingAssets/',
      linux: 'sBotics/sBotics_Data/StreamingAssets/',
    };
    return platforms[this.getOS()];
  }
  getFolderPathSboticsSimulationBlockEduc() {
    const platforms = {
      win32: `/wEduc/sBotics/sBotics_Data/StreamingAssets/Addons/`,
      darwin: `/wEduc/sBotics/sBotics.app/Contents/Resources/Data/StreamingAssets/Addons/`,
      linux: `/wEduc/sBotics/sBotics_Data/StreamingAssets/Addons/`,
    };
    var os = process.platform.toLowerCase();
    return platforms[os];
  }
  openMainWindow() {
    return ipcRenderer.send('open-window-main');
  }
  openAuthWindows() {
    return ipcRenderer.send('open-window-auth');
  }
  openInstallFolder() {
    shell.openPath(this.getFolderPathSboticsSimulation());
  }
  restartApp() {
    return ipcRenderer.send('restart-app');
  }
}
export { Application };
