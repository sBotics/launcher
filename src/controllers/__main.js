import { Alerts } from '../class/__instance_alerts.js';
import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { FileUser } from '../class/__instance_file_user.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';
import { LoadingDownloadController } from './__main_download.js';
import { Exception } from '../class/__instance_exception.js';
import { ProgressBar } from '../class/__instance_progress_bar.js';

const startPipeLine = (data) => {
  try {
    LoadingUserAccount(data['getUser']);
    LoadingController(false);
    LoadingDownloadController();
  } catch (error) {
    new Exception().create({
      status: 512,
      error_name: error.name,
      error_message: error.message,
    });
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

    startPipeLine({
      userFile: userFile,
      getUser: userFile,
    });

    connection
      .getUser({ accessToken: userFile['accessToken'] })
      .then(function (response) {
        try {
          startPipeLine({
            userFile: userFile,
            getUser: response.data,
          });
        } catch (error) {
          new Exception().create({
            status: 511,
            error_name: error.name,
            error_message: error.message,
          });
        }
      })
      .catch(function (error) {
        try {
          if (error.response) {
            if (error.response.status == 401) {
              application.openAuthWindows();
            } else {
              new Exception().create({
                status: error.response.status,
                message: error.response.data.message,
              });
            }
          } else {
            new Exception().create({
              status: error.toJSON()['name'],
              message: error.toJSON()['message'],
            });
          }
        } catch (error) {
          new Exception().create({
            status: 510,
            error_name: error.name,
            error_message: error.message,
          });
        }
      });
  })();
};
