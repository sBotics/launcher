import { TitleBar, backdrop } from '../class/__interface_components.js';
import { Create, Update } from '../utils/progress-bar.js';
import {
  URLdictionary,
  ValidateConnection,
} from '../utils/validate-connection.js';
import {
  CreateConfig,
  OpenConfig,
  UpdateConfig,
} from '../class/__file_config.js';
import {
  CreateUserFile,
  OpenUserFile,
  UpdateUserFile,
} from '../class/__file_user.js';
import { LanguageInit, Lang } from '../utils/language-manager.js';
import { syncWait, asyncWait } from '../utils/wait-manager.js';

const InterfaceLoad = async () => {
  await TitleBar();
  await backdrop({
    elementName: 'backdrop',
  });
  Create({
    percentage: 2,
    id: 'LoadBar',
    text: [{ textContainer: 'TextProgress', message: 'Inicializando...' }],
  });
};

const Init = async () => {
  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 7,
    text: [
      {
        textContainer: 'TextProgress',
        message:
          '<i class="fas fa-wifi text-info"></i> Verificando Conexão com a internet. Aguarde!',
      },
    ],
  });

  ValidateConnection({ url: URLdictionary['GitHub'] })
    .then((value) => {
      Update({
        id: 'LoadBar',
        addState: 'success',
        percentage: 15,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-success"></i> <strong> Conectado na Internet</strong>',
          },
        ],
      });
    })
    .catch((e) => {
      return Update({
        id: 'LoadBar',
        addState: 'danger',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-danger"></i> <strong> Sem conexão com a internet! </strong> Verifique sua conexão com a internet',
          },
        ],
      });
    });
};

const init = async () => {
  // Verificar conexão com o github
  // Verificar versão do launcher -> Auto Updatew
  // Verifica se os dados do user existe

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 7,
    text: [
      {
        textContainer: 'TextProgress',
        message:
          '<i class="fas fa-wifi text-info"></i> Verificando Conexão com a internet. Aguarde!',
      },
    ],
  });

  await asyncWait(800);

  try {
    if (await ValidateConnection({ url: URLdictionary['GitHub'] })) {
      Update({
        id: 'LoadBar',
        addState: 'success',
        removeState: 'info',
        percentage: 15,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-success"></i> <strong> Conectado na Internet</strong>',
          },
        ],
      });
    } else {
      return Update({
        id: 'LoadBar',
        addState: 'danger',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-danger"></i> <strong> Sem conexão com a internet! </strong> Verifique sua conexão com a internet',
          },
        ],
      });
    }
  } catch (error) {
    return;
  }
};

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  init();
  // init();
  // (async () => {
  //   try {
  //     console.log(
  //       await ValidasdasdateConnection({ url: URLdictionary['sBotics'] }),
  //     );
  //   } catch (error) {
  //     throw new Error('Aconteceu um erro');
  //   }
  //   console.log('Aqui');
  // })();

  // console.log(CreateConfig());
  // console.log(
  //   UpdateConfig({ data: { language: 'pt-BR', user: 'juliocesar' } }),
  // );
});
