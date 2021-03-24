const { BrowserWindow } = require("electron").remote;
let win = BrowserWindow({
  width: 600,
  height: 400,
  resizable: false,
  frame: false,
  webPreferences: {
    nodeIntegration: true,
  },
});
win.loadURL(`file://${__dirname}/newIndex.html`);
win.webContents.openDevTools();
function init() {}

module.exports = "render";
