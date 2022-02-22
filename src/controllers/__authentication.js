let ipcRenderer = require('electron').ipcRenderer;
let shell = require('electron').shell;
import { URLdictionary, UserData } from '../utils/connection-manager.js';
import { CreateUserFile, OpenUserFile } from '../class/__file_user.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';

const Action = (openURL) => {
  document.getElementById('form_auth').style.display = 'none';
  document.getElementById('view_auth').style.display = 'flex';
  document
    .getElementById('view_auth_link')
    .setAttribute('onclick', `TryAgain('${openURL}')`);
  shell.openExternal(openURL);
};

window.Login = () => {
  Action(URLdictionary['login']);
};

window.Register = () => {
  Action(URLdictionary['register']);
};

window.TryAgain = (url) => {
  shell.openExternal(url);
};

ipcRenderer.on('set_user_auth', (event, arg) => {
  const accessToken = arg.replace('SBOTICS', '|');
  UserData({
    accessToken: accessToken,
  })
    .then((response) => {
      console.log(response);
      (async () => {
        const macAddress = (await GetMacAddress()) ? await GetMacAddress() : '';
        if (
          !CreateUserFile({
            data: {
              nickname: response['nickname'],
              name: response['name'],
              email: response['email'],
              profilePicture: response['profile_photo_path'],
              preferredLanguage: response['preferred_language'],
              preferredTimezone: response['preferred_timezone'],
              accessToken: accessToken,
              logged: true,
              macAddress: macAddress,
            },
          })
        ) {
          // Adicionar um alert dizendo que aconteceu um erro inesperado e adicionar um código de erro
          return;
        }

        location.reload();
      })();
    })
    .catch((err) => {
      // Adicionar um alert dizendo que aconteceu um erro ao validar o accessToken e adicionar um código de erro
    });
});
