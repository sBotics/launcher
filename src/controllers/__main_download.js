var extend = require('extend-shallow');
var markdown = require('markdown-it')();
import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { MagicButton } from '../class/__instance_magic_button.js';
import { Exception } from '../class/__instance_exception.js';
import { FileConfig } from '../class/__instance_file_config.js';

let connection = new Connection();
let application = new Application();
let fileConfig = new FileConfig();

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
  const patch_notes = options.patch_notes;

  const configs = fileConfig.open();
  const versionInstalled = configs.sBoticsVersionInstalled;

  PatchNotes(
    version,
    !versionInstalled || versionInstalled != version,
    markdown.render('# Teste'),
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
