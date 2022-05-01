var extend = require('extend-shallow');
var hljs = require('highlight.js');
let swal = require('sweetalert2');
var markdown = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' +
      markdown.utils.escapeHtml(str) +
      '</code></pre>'
    );
  },
});

import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { MagicButton } from '../class/__instance_magic_button.js';
import { Exception } from '../class/__instance_exception.js';
import { FileConfig } from '../class/__instance_file_config.js';
import { FindSync } from '../utils/files-manager.js';

let connection = new Connection();
let application = new Application();
let fileConfig = new FileConfig();


function MagicButtonAction(action) {
  switch (action) {
    case 'install':
      break;

    default:
      break;
  }
}

function start(options) {
  options = extend(
    {
      name: '',
      type: '',
      version: '',
      content: '',
      patch_notes: '',
    },
    options,
  );

  const name = options.name;
  const type = options.type;
  const version = options.version;
  const content = options.content;

  const patch_notes = options.patch_notes.filter(
    (object) => object.language == application.getLocale(),
  )[0];

  const configs = fileConfig.open();
  const versionInstalled = configs.sBoticsVersionInstalled;

  PatchNotes(
    version,
    !versionInstalled || versionInstalled != version,
    markdown.render(patch_notes.line_text),
  );

  if (!versionInstalled || versionInstalled != version) {
    new MagicButton({
      mode: 'install',
    });
  } else {
    new MagicButton({
      mode: 'process',
      text: 'Verificando Integridade dos Arquivos...',
    });
  }
}

export async function LoadingDownloadController() {
  new MagicButton({
    mode: 'process',
    text: 'Procurando Atualização...',
  });

  connection
    .getRelease({ platform: application.getOSText() })
    .then(function (response) {
      try {
        const data = response.data;
        start({
          name: data.name,
          type: data.type,
          version: data.version,
          content: JSON.parse(data.content),
          patch_notes: data.patch_notes,
        });
      } catch (error) {
        new Exception().create({
          status: 514,
          error_name: error.name,
          error_message: error.message,
        });
      }
    })
    .catch(function (error) {
      try {
        if (error.response) {
          new Exception().create({
            status: error.response.status,
            message: `sBotics Release | ${error.response.data.message}`,
          });
        } else {
          new Exception().create({
            status: error.toJSON()['name'],
            message: error.toJSON()['message'],
          });
        }
      } catch (error) {
        new Exception().create({
          status: 513,
          error_name: error.name,
          error_message: error.message,
        });
      }
    });
}

window.OpenInstallFolder = function OpenInstallFolder(){
  if (FindSync('sBotics/')) {
    application.openInstallFolder();
  } else {
    // FilesVerification({ modeText: Lang('Looking for update! Please wait...') });
    swal
      .fire({
        icon: 'error',
        title: 'Falhou para abrir!',
        text: 'Pasta de instalação não encontrada! Tente instalar novamente.',
        showCancelButton: false,
        confirmButtonText: 'Instalar sBotics',
      })
      .then((result) => {
        if (result.isConfirmed) {
          console.log('Instalando o sBotics! Por favor, espere...');
          // DownloadsBotics({
          //   modeText: Lang('Instalando o sBotics! Por favor, espere...'),
          //   type: 'install',
          // });
        }
      });
  }
};
