const { TouchBar } = require('electron');
const ipcMain = require('electron').ipcMain;
const window = require('electron').BrowserWindow;
const { TouchBarPopover, TouchBarLabel, TouchBarButton, TouchBarSpacer } =
  TouchBar;
let ipcRenderer = require('electron').ipcRenderer;

// Spin button
const accessAccount = new TouchBarButton({
  label: 'Acessar Conta',
  backgroundColor: '#207382',
  click: () => {
    let focusedWindow = window.getFocusedWindow();
    focusedWindow.webContents.send('__touchbar', {
      action: 'login',
    });
  },
});
const registerAccount = new TouchBarButton({
  label: 'Criar Conta',
  backgroundColor: '#207382',
  click: () => {
    let focusedWindow = window.getFocusedWindow();
    focusedWindow.webContents.send('__touchbar', {
      action: 'register',
    });
  },
});

const touchBar = new TouchBar({
  items: [accessAccount, registerAccount],
});

// ipcRenderer.send('touch-bar');

