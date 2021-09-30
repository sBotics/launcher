const { ipcRenderer } = require('electron');

const UpdateInit = () => {
  return ipcRenderer.sendSync('update-init');
};

const UpdateChecking = new Promise((resolve, reject) => {
  ipcRenderer.on('update-checking', (event, arg) => {
    resolve(arg);
  });
});

const UpdateAvailable = new Promise((resolve, reject) => {
  ipcRenderer.on('update-available', (event, arg) => {
    resolve(arg);
  });
  ipcRenderer.on('update-not-available', (event, arg) => {
    resolve(arg);
  });
});

const UpdateInstall = () => {
  return ipcRenderer.sendSync('update-install');
};

export { UpdateInit, UpdateChecking, UpdateAvailable, UpdateInstall };
