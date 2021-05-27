import { TitleBar, backdrop } from '../class/__interface_components.js';
import { Create, Update } from '../utils/progress-bar.js';
import {
  URLdictionary,
  ValidateConnection,
} from '../utils/validate-connection.js';

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

// const Init = async () => {
//   Update({
//     id: 'LoadBar',
//     addState: 'info',
//     percentage: 7,
//     text: [
//       {
//         textContainer: 'TextProgress',
//         message:
//           '<i class="fas fa-wifi text-info"></i> Verificando Conexão com a internet. Aguarde!',
//       },
//     ],
//   });

//   ValidateConnection({ url: URLdictionary['GitHub'] })
//     .then((value) => {
//       Update({
//         id: 'LoadBar',
//         addState: 'success',
//         percentage: 15,
//         timeout: 600,
//         text: [
//           {
//             textContainer: 'TextProgress',
//             message:
//               '<i class="fas fa-wifi text-success"></i> <strong> Conectado na Internet</strong>',
//           },
//         ],
//       });
//     })
//     .catch((e) => {
//       Update({
//         id: 'LoadBar',
//         addState: 'danger',
//         percentage: 100,
//         timeout: 2000,
//         text: [
//           {
//             textContainer: 'TextProgress',
//             message:
//               '<i class="fas fa-wifi text-danger"></i> <strong> Sem conexão com a internet!</strong> Verifique sua conexão com a internet',
//           },
//         ],
//       });
//     });
// };

$(document).ready(() => {
  InterfaceLoad();
  Init();
});
