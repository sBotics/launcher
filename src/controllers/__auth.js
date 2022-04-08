import { OpenUserFile } from '../class/__file_user.js';
import { OpenMainWindow } from '../utils/application-manager.js';
import { UserData } from '../utils/connection-manager.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';

window.onload = () => {
  (async () => {
    let userdata = OpenUserFile();
    const macAddress = await GetMacAddress();
    if (
      !userdata ||
      !userdata['logged'] ||
      userdata['macAddress'] != macAddress
    ) {
      document.getElementById('form_authentication').style.display = 'flex';
      document.getElementById('animation_loading').style.display = 'none';
    }

    UserData({ accessToken: userdata['accessToken'] })
      .then(function (response) {
        document.getElementById('form_authentication').style.display = 'none';
        document.getElementById('animation_loading').style.display = 'none';
        // window.location.href = "../routes/index.html";
        OpenMainWindow();
      })
      .catch(function (error) {
        document.getElementById('form_authentication').style.display = 'flex';
        document.getElementById('animation_loading').style.display = 'none';
      });
  })();
};