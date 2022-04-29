import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { MagicButton } from '../class/__instance_magic_button.js';

let connection = new Connection();
let application = new Application();

function start() {
    

}

export async function LoadingDownloadController() {
  new MagicButton({
    mode: 'process',
    text: 'Procurando Atualização...',
  });

  connection
    .getRelease({ platform: application.getOSText() })
    .then(function (response) {
      const data = response.data;
      console.log(JSON.parse(data.content));
    })
    .catch(function (error) {
      try {
        new Exception().create({
          status: error.response.status,
          message: `sBotics Release | ${error.response.data.message}`,
        });
      } catch (error) {
        new Exception().create({
          status: errorObject['name'],
          message: errorObject['message'],
        });
      }
    });
}
