// Localiza e abre o arquivo de configuração
// Cria o arquivo de configuração
// Altera dados do arquivo de configuração
// Deleta o arquivo de configuração

var extend = require('extend-shallow');
import { Find, Save, Open } from '../utils/files-manager.js';
import { Encrypted, Decrypted } from '../utils/security-manager.js';

const DefaultConfiguration = {
  language: 'en_US',
  JULIO: 'oLÁ',
};

const CreateConfig = (options) => {
  options = extend(
    {
      data: '',
      defaultConfig: DefaultConfiguration,
      defaultPathSave: 'Launcher/data/Config.aes',
    },
    options,
  );

  const defaultConfig = options.defaultConfig;

  if (!defaultConfig) return false;

  const data = Encrypted({
    data: JSON.stringify({ ...defaultConfig, ...options.data }),
  });

  return new Promise((resolve, reject) => {
    Save(options.defaultPathSave, data)
      .then((value) => {
        resolve(true);
      })
      .catch((e) => {
        reject(false);
      });
  });
};

const OpenConfig = (options) => {
  console.log('A');
  options = extend(
    {
      defaultPathSave: 'Launcher/data/Config.aes',
      decrypted: true,
      JSONParse: true,
      createConfigNotFind: true,
    },
    options,
  );

  const defaultPathSave = options.defaultPathSave;
  const decrypted = options.decrypted;
  const JSONParse = options.JSONParse;
  const createConfigNotFind = options.createConfigNotFind;

  if (!defaultPathSave) return false;

  return new Promise((resolve, reject) => {
    Find(defaultPathSave)
      .then(() => {
        Open(defaultPathSave)
          .then((result) => {
            return decrypted
              ? !Decrypted({ data: result })
                ? reject('falsee')
                : resolve(
                    JSONParse
                      ? JSON.parse(Decrypted({ data: result }))
                      : Decrypted({ data: result }),
                  )
              : resolve(result);
          })
          .catch((e) => {
            return reject(e);
          });
      })
      .catch((e) => {
        if (createConfigNotFind)
          CreateConfig()
            .then((result) => {
              console.log('AQUI');
              OpenConfig();
            })
            .catch((e) => {
              return reject(false);
            });
      });
  });
};

export { CreateConfig, OpenConfig };
