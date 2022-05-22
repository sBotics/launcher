const window = require('electron').BrowserWindow;
const { TouchBar } = require('electron');
const { TouchBarButton } = TouchBar;

class WindowTouchBar {
  constructor() {}
  auth() {
    return new TouchBar({
      items: [
        new TouchBarButton({
          label: 'Acessar Conta',
          backgroundColor: '#207382',
          click: () => {
            let focusedWindow = window.getFocusedWindow();
            focusedWindow.webContents.send('__touchbar', {
              action: 'login',
            });
          },
        }),
        new TouchBarButton({
          label: 'Criar Conta',
          backgroundColor: '#207382',
          click: () => {
            let focusedWindow = window.getFocusedWindow();
            focusedWindow.webContents.send('__touchbar', {
              action: 'register',
            });
          },
        }),
      ],
    });
  }
  main() {
    return new TouchBar({
      items: [
        // new TouchBarButton({
        //   label: 'Apenas um teste',
        //   click: () => {},
        // }),
      ],
    });
  }
}

module.exports = WindowTouchBar;
