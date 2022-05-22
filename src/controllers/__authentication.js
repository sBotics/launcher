let ipcRenderer = require('electron').ipcRenderer;
let shell = require('electron').shell;
import { GetMacAddress } from '../utils/mac-address-manager.js';
import { FileUser } from '../class/__instance_file_user.js';
import { Connection } from '../class/__instance_connection.js';
import { Exception } from '../class/__instance_exception.js';

const Action = (openURL) => {
  document.getElementById('form_auth').style.display = 'none';
  document.getElementById('view_auth').style.display = 'flex';
  document
    .getElementById('view_auth_link')
    .setAttribute('onclick', `TryAgain('${openURL}')`);
  shell.openExternal(openURL);
};

window.Login = () => {
  Action(new Connection().getDictionary()['login']);
};

window.Register = () => {
  Action(new Connection().getDictionary()['register']);
};

window.TryAgain = (url) => {
  shell.openExternal(url);
};

ipcRenderer.on('__touchbar', (event, arg) => {
  switch (arg.action) {
    case 'register':
      Action(new Connection().getDictionary()['register']);
      break;
    default:
      Action(new Connection().getDictionary()['login']);
      break;
  }
});

ipcRenderer.on('set_user_auth', (event, arg) => {
  const accessToken = arg.replace('SBOTICS', '|');
  console.log(accessToken);
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
          new Exception().create({
            status: 500,
          });
          return;
        }
        location.reload();
      })();
    })
    .catch((error) => {
      new Exception().create({
        status: error.response.status,
        message: error.response.data.message,
      });
    });
});
