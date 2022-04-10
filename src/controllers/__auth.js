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
        document.getElementById('form_authentication').style.display = 'none';
        document.getElementById('animation_loading').style.display = 'none';
        console.log('Tentou');
        new Application().openMainWindow();
      })
      .catch(function (error) {
        document.getElementById('form_authentication').style.display = 'flex';
        document.getElementById('animation_loading').style.display = 'none';
      });
  })();
};
