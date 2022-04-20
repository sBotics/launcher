import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { Exception } from '../class/__instance_exception.js';
import { FileUser } from '../class/__instance_file_user.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';

window.onload = () => {
  (async () => {
    let connection = new Connection();
    let application = new Application();
    let userData = new FileUser().open();
    const macAddress = await GetMacAddress();

    if (
      !userData ||
      !userData['logged'] ||
      userData['macAddress'] != macAddress
    ) {
      document.getElementById('form_authentication').style.display = 'flex';
      document.getElementById('animation_loading').style.display = 'none';
    }

    connection
      .getUser({ accessToken: userData['accessToken'] })
      .then(function (response) {
        document.getElementById('form_authentication').style.display = 'none';
        document.getElementById('animation_loading').style.display = 'none';
        new FileUser().update({
          data: {
            nickname: response.data['nickname'],
            name: response.data['name'],
            email: response.data['email'],
            profilePicture: response.data['profile_photo_path'],
            preferredLanguage: response.data['preferred_language'],
            preferredTimezone: response.data['preferred_timezone'],
          },
        });
        new Application().openMainWindow();
      })
      .catch(function (error) {
        if (error.response.status == 401) {
          document.getElementById('form_authentication').style.display = 'flex';
          document.getElementById('animation_loading').style.display = 'none';
        } else {
          new Exception().create({
            status: error.response.status,
            message: error.response.data.message,
          });
        }
      });
  })();
};
