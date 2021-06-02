var { app, shell } = require('electron').remote;
var { ipcRenderer } = require('electron');
const remote = require('electron').remote;
const os = require('os');

const SLMP = () => {
  try {
    return process.env.SLMP != undefined ? process.env.SLMP : false;
  } catch (error) {
    return false;
  }
};

const SystemGetLocale = () => {
  const locale = app.getLocale().replace('-', '_');
  return locale ? locale : 'en_US';
};

const AppDefaultPath = () => {
  return ipcRenderer.sendSync('app-defaultpath');
};

const OpenInstallFolder = () => {
  shell.openPath(`${os.homedir()}/wEduc/sBotics/`);
};

const AppVersion = () => {
  return app.getVersion();
};

const DetectOS = () => {
  return process.platform.toLowerCase();
};

const DetecOSFolder = () => {
  const platforms = {
    win32: 'W32',
    darwin: 'mac',
    linux: 'Linux AMD64',
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};

const folderPathGenaral = () => {
  return `${os.homedir()}/wEduc`;
};
const folderPathGLauncher = () => {
  return `${os.homedir()}/wEduc/Launcher`;
};
const folderPathGsBotics = () => {
  return `${os.homedir()}/wEduc/sBotics`;
};

export {
  SLMP,
  SystemGetLocale,
  AppDefaultPath,
  OpenInstallFolder,
  AppVersion,
  DetectOS,
  DetecOSFolder,
  folderPathGenaral,
  folderPathGLauncher,
  folderPathGsBotics,
};
