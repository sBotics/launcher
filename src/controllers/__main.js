import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { FileUser } from '../class/__instance_file_user.js';
import { UserData } from '../utils/connection-manager.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';

const startPipeLine = (data) => {
  LoadingUserAccount(data['getUser']);
  LoadingController(false);
};

window.onload = () => {
  (async () => {
    let connection = new Connection();
    let application = new Application();
    let userFile = new FileUser().open();
    const macAddress = await GetMacAddress();

    if (
      !userFile ||
      !userFile['logged'] ||
      userFile['macAddress'] != macAddress
    ) {
      application.openAuthWindows();
    }

    connection
      .getUser({ accessToken: userFile['accessToken'] })
      .then(function (response) {
        try {
          startPipeLine({
            userFile: userFile,
            getUser: response,
          });
        } catch (error) {
          console.error(error);
        }
      })
      .catch(function (error) {
        console.error(error);
        application.openAuthWindows();
      });
  })();
};
