import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';

export async function LoadingDownloadController() {
  let connection = new Connection();
  let application = new Application();

  connection
    .getRelease({ platform: application.getOSText() })
    .then(function (response) {
      const data = response.data;
    })
    .catch(function (error) {
      console.error(error.data.status);
    });
}
