let ipcRenderer = require('electron').ipcRenderer;
let shell = require('electron').shell;
import { URLdictionary, UserData } from '../utils/connection-manager.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';
import { FileUser } from '../class/__instance_file_user.js';
import { Connection } from '../class/__instance_connection.js';

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

ipcRenderer.on('__touchbar', (event, arg) => {
  switch (arg.action) {
    case 'register':
      Action(URLdictionary['register']);
      break;
    default:
      Action(URLdictionary['login']);
      break;
  }
});

ipcRenderer.on('set_user_auth', (event, arg) => {
  const accessToken = arg.replace('SBOTICS', '|');
  new Connection()
    .getUser({ accessToken: accessToken })
    .then((response) => {
      (async () => {
        let fileUser = new FileUser();

        const macAddress = (await GetMacAddress()) ? await GetMacAddress() : '';
        if (
          !fileUser.create({
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
          console.log(
            'Adicionar um alert dizendo que aconteceu um erro inesperado e adicionar um código de erro',
          );
          return;
        }
        location.reload();
      })();
    })
    .catch((err) => {
      console.log(
        'Adicionar um alert dizendo que aconteceu um erro ao validar o accessToken e adicionar um código de erro',
      );
    });
});
