import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { FileUser } from '../class/__instance_file_user.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';
import { LoadingDownloadController } from './__main_download.js';

const startPipeLine = (data) => {
  try {
    LoadingUserAccount(data['getUser']);
    LoadingController(false);
    LoadingDownloadController();
  } catch (error) {
    console.log(error);
  }
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
            getUser: response.data,
          });
        } catch (error) {
          console.error(error);
        }
      })
      .catch(function (error) {
        if (error.response.status == 401) {
          window.location.href = '../routes/error.html';
        }
        // application.openAuthWindows();
      });
  })();
};
