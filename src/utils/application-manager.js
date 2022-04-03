let ipcRenderer = require('electron').ipcRenderer;
const os = require('os');
import { StringToBoolean } from '../utils/conver-data.js';

const SLMP = () => {
  const slmp = StringToBoolean(process.env.SLMP);
  try {
    return slmp != undefined ? slmp : false;
  } catch (error) {
    return false;
  }
};

const OpenMainWindow = () => {
  return ipcRenderer.send('open-window-main');
};

const SystemGetLocale = () => {
  const locale = ipcRenderer.sendSync('get-lang').replace('-', '_');
  const languageAvarible = ['pt_BR'];
  return languageAvarible.indexOf(locale) > -1 ? locale : 'en_US';
};

const AppDefaultPath = () => {
  return ipcRenderer.sendSync('app-defaultpath');
};

const OpenInstallFolder = () => {
  shell.openPath(folderPathGsBotics());
};

const AppVersion = () => {
  return ipcRenderer.sendSync('get-version');
};

const DetectOS = () => {
  return process.platform.toLowerCase();
};

const DetecOSFolder = () => {
  const platforms = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};

const DetectOsText = () => {
  const platforms = {
    win32: 'windows',
    darwin: 'macOS',
    linux: 'linux',
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};

const folderPathGenaral = () => {
  return `${os.homedir()}/sBotics`;
};

const folderPathGLauncher = () => {
  return `${os.homedir()}/sBotics/Launcher`;
};

const folderPathGsBotics = () => {
  return `${os.homedir()}/sBotics/applications/sBotics`;
};

const folderPathStreamingAssets = () => {
  const platforms = {
    win32: 'sBotics/sBotics_Data/StreamingAssets/',
    darwin: 'sBotics/sBotics.app/Contents/Resources/Data/StreamingAssets/',
    linux: 'sBotics/sBotics_Data/StreamingAssets/',
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};

const folderPathBlockEduc = () => {
  const platforms = {
    win32: `/wEduc/sBotics/sBotics_Data/StreamingAssets/Addons/`,
    darwin: `/wEduc/sBotics/sBotics.app/Contents/Resources/Data/StreamingAssets/Addons/`,
    linux: `/wEduc/sBotics/sBotics_Data/StreamingAssets/Addons/`,
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};

export {
  SLMP,
  SystemGetLocale,
  AppDefaultPath,
  OpenInstallFolder,
  AppVersion,
  DetectOS,
  DetecOSFolder,
  DetectOsText,
  folderPathGenaral,
  folderPathGLauncher,
  folderPathGsBotics,
  folderPathStreamingAssets,
  folderPathBlockEduc,
  OpenMainWindow,
};
