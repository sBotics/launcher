var remote = require('electron').remote;
var { screen } = remote;
var windowManager = remote.require('electron-window-manager');
import { DetectOS } from '../utils/application-manager.js';

var GlobalShowDevTools = true;

const LoadClose = () => {
  windowManager.close('load');
};

const LoginOpen = () => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.5);
  const width = Math.round((16 * height) / 11);

  var login = windowManager.createNew(
    'login',
    'sBotics Launcher',
    'file://' + __dirname + '/login.html',
    false,
    {
      width: width,
      height: height,
      showDevTools: GlobalShowDevTools,
      DevTools: GlobalShowDevTools,
      menu: null,
      frame: DetectOS() == 'darwin',
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    },
  );

  login.open();
};

const LoginClose = () => {
  windowManager.close('login');
};

var index;
const IndexOpen = (restart = false) => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.8);
  const width = Math.round((16 * height) / 9);

  index = windowManager.createNew(
    'index',
    'sBotics Launcher',
    'file://' + __dirname + '/index.html',
    false,
    {
      width: width,
      height: height,
      showDevTools: GlobalShowDevTools,
      DevTools: GlobalShowDevTools,
      menu: null,
      frame: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    },
  );

  index.open();
};

const IndexClose = () => {
  windowManager.close('index');
};
const IndexReload = () => {
  document.location.reload(true);
};

const LinkOpen = (url, pageName = 'sBotics Launcher') => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.6);
  const width = Math.round((16 * height) / 9);

  var link = windowManager.createNew('link', pageName, url, false, {
    title: pageName,
    width: width,
    height: height,
    showDevTools: GlobalShowDevTools,
    DevTools: GlobalShowDevTools,
    menu: null,
    frame: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  link.open();
};

export {
  LoadClose,
  LoginOpen,
  LoginClose,
  IndexOpen,
  IndexClose,
  IndexReload,
  LinkOpen,
};
