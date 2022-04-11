import { Application } from '../class/__instance_application.js';
import { FileUser } from '../class/__instance_file_user.js';
import { UserData } from '../utils/connection-manager.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';

window.onload = () => {
  (async () => {
    let userData = new FileUser().open();
    console.log(userData);
    const macAddress = await GetMacAddress();
    if (
      !userData ||
      !userData['logged'] ||
      userData['macAddress'] != macAddress
    ) {
      document.getElementById('form_authentication').style.display = 'flex';
      document.getElementById('animation_loading').style.display = 'none';
    }
    console.log(userData['accessToken']);
    UserData({ accessToken: userData['accessToken'] })
      .then(function (response) {
        console.log(response);
        document.getElementById('form_authentication').style.display = 'none';
        document.getElementById('animation_loading').style.display = 'none';
        new FileUser().update({
          data: {
            nickname: response['nickname'],
            name: response['name'],
            email: response['email'],
            profilePicture: response['profile_photo_path'],
            preferredLanguage: response['preferred_language'],
            preferredTimezone: response['preferred_timezone'],
          },
        });
        new Application().openMainWindow();
      })
      .catch(function (error) {
        document.getElementById('form_authentication').style.display = 'flex';
        document.getElementById('animation_loading').style.display = 'none';
      });
  })();
};
