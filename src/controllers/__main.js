import { Alerts } from '../class/__instance_alerts.js';
import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { FileUser } from '../class/__instance_file_user.js';
import { MagicButton } from '../class/__instance_magic_button.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';
import { LoadingDownloadController } from './__main_download.js';
import { Exception } from '../class/__instance_exception.js';
import { ProgressBar } from '../class/__instance_progress_bar.js';

const startPipeLine = (data) => {
  try {
    LoadingUserAccount(data['getUser']);
    LoadingController(false);

    // new ProgressBar().activate();
    // new ProgressBar().disable();
    // new ProgressBar().clear();
    // new ProgressBar().create({
    //   percentage: 40,
    //   state: 'success',
    //   id: '40',
    // });
    new ProgressBar().activate();

    for (let index = 0; index < 200; index++) {
      new ProgressBar().create({
        percentage: index,
        state: 'success',
        id: index,
      });
    }

    new MagicButton({
      mode: 'repair_installation',
    });

    new Alerts().createTop({
      states: 'success',
      message: 'sBotics instalado com sucesso! Pronto para abrir.',
    });
    new Alerts().createTop({
      states: 'success',
      html: `<h5 class=\"alert-heading\"><strong>Parabéns às equipes classificadas e a todos que participaram das etapas estaduais!</strong></h5><p>A lista das equipes classificadas para a etapa Nacional já está disponível em nosso site: <a href=\"http://www.obr.org.br/modalidade-pratica/etapa-nacional\" class=\"\" target=\"_blank\">obr.org.br/modalidade-pratica/etapa-nacional</a>!</p>`,
      message: ``,
      fixed: false,
      icon: true,
      timeOutVIew: 0,
    });

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
          application.openAuthWindows();
        } else {
          try {
            new Exception().create({
              status: error.response.status,
              message: error.response.data.message,
            });
          } catch (error) {
            new Exception().create();
          }
        }
      });
  })();
};
