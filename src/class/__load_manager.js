import { TitleBar, backdrop } from '../class/__interface_components.js';
import { Create, Update } from '../utils/progress-bar.js';
import {
  URLdictionary,
  ValidateConnection,
} from '../utils/validate-connection.js';
import { OpenConfig } from '../class/__file_config.js';
import {
  CreateUserFile,
  OpenUserFile,
  UpdateUserFile,
} from '../class/__file_user.js';
import { LanguageInit, Lang } from '../utils/language-manager.js';
import { syncWait, asyncWait } from '../utils/wait-manager.js';
import { UpdateInit, UpdateChecking } from '../utils/autoupdate-manager.js';

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

const init = async () => {
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
          '<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">Verificando Conexão com a internet. Aguarde! </span>',
      },
    ],
  });

  await asyncWait(800);

  try {
    if (await ValidateConnection({ url: URLdictionary['GitHub'] }))
      Update({
        id: 'LoadBar',
        addState: 'success',
        removeState: 'info',
        percentage: 15,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-success"></i> <strong style="margin-left: 13px"> Conectado na Internet</strong>',
          },
        ],
      });
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message:
            '<i class="fas fa-wifi text-danger"></i> <strong style="margin-left: 13px"> Sem conexão com a internet! </strong> Verifique sua conexão com a internet',
        },
      ],
    });
  }

  await asyncWait(800);

  try {
    //if(UpdateInit())
    UpdateInit();
    if (await UpdateChecking)
      Update({
        id: 'LoadBar',
        addState: 'info',
        percentage: 20,
        text: [
          {
            textContainer: 'TextProgress',
            message:
              '<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">Procurando atualização do sBotics Launcher. Aguarde! </span>',
          },
        ],
      });
  } catch (error) {
    console.log('Ocorreu um erro ao verificar autoUpdate');
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
