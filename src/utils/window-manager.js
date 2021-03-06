var remote = require('electron').remote;
var { screen } = remote;
var windowManager = remote.require('electron-window-manager');
import { SLMP, DetectOS } from '../utils/application-manager.js';

var GlobalShowDevTools = SLMP();

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

const OpenCbotics = (url, pageName = 'sBotics Launcher') => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.6);
  const width = Math.round((16 * height) / 9);

  var cBotics = windowManager.createNew('cBotics', pageName, url, false, {
    title: pageName,
    width: width,
    height: height,
    showDevTools: GlobalShowDevTools,
    DevTools: GlobalShowDevTools,
    menu: null,
    frame: true,
    resizable: true,
  });

  cBotics.open();
};

const OpenTutorialWiki = (url, pageName = 'sBotics Launcher') => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.6);
  const width = Math.round((16 * height) / 9);

  var tutorialWiki = windowManager.createNew(
    'tutorialWiki',
    pageName,
    url,
    false,
    {
      title: pageName,
      width: width,
      height: height,
      showDevTools: GlobalShowDevTools,
      DevTools: GlobalShowDevTools,
      menu: null,
      frame: true,
      resizable: true,
    },
  );

  tutorialWiki.open();
};

const OpenNextCompetition = (url, pageName = 'cBotics') => {
  var ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  const height = Math.round(ScreenSize.height * 0.6);
  const width = Math.round((16 * height) / 9);

  var nextCompetition = windowManager.createNew(
    'tutorialWiki',
    pageName,
    url,
    false,
    {
      title: pageName,
      width: width,
      height: height,
      showDevTools: GlobalShowDevTools,
      DevTools: GlobalShowDevTools,
      menu: null,
      frame: true,
      resizable: true,
    },
  );

  nextCompetition.open();
};

export {
  LoadClose,
  LoginOpen,
  LoginClose,
  IndexOpen,
  IndexClose,
  IndexReload,
  LinkOpen,
  OpenCbotics,
  OpenTutorialWiki,
  OpenNextCompetition,
};
