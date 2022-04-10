import { Application } from '../class/__instance_application.js';
import { FileUser } from '../class/__instance_file_user.js';
import { UserData } from '../utils/connection-manager.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';

window.onload = () => {
  (async () => {
    let application = new Application();
    let userData = new FileUser().open();
    const macAddress = await GetMacAddress();
    if (
      !userData ||
      !userData['logged'] ||
      userData['macAddress'] != macAddress
    ) {
      application.openAuthWindows();
    }
    UserData({ accessToken: userData['accessToken'] })
      .then(function (response) {
        console.log(response);
        LoadingController(false);
      })
      .catch(function (error) {
        application.openAuthWindows();
      });
  })();
};
