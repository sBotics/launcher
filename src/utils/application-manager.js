var { app, ipcRenderer } = require('electron');

const SystemGetLocale = () => {
  const locale = app.getLocale().replace('-', '_');
  return locale ? locale : 'en_US';
};

const AppDefaultPath = () => {
  return ipcRenderer.sendSync("app-defaultpath");
};

export { SystemGetLocale, AppDefaultPath };
