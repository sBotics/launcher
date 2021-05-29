// Localiza e abre o arquivo de configuração
// Cria o arquivo de configuração
// Altera dados do arquivo de configuração
// Deleta o arquivo de configuração

var extend = require('extend-shallow');
import { FindSync, SaveSync, OpenSync } from '../utils/files-manager.js';
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

  return SaveSync(options.defaultPathSave, data);
};

const OpenConfig = (options) => {
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

  const fileFind = !FindSync(defaultPathSave)
    ? createConfigNotFind
      ? !CreateConfig()
        ? false
        : true
      : false
    : true;

  if (!fileFind) return false;

  const file = OpenSync(defaultPathSave);

  if (!file) return false;

  const fileDecrypted = Decrypted({ data: file });

  return decrypted
    ? fileDecrypted
      ? JSONParse
        ? JSON.parse(fileDecrypted)
        : fileDecrypted
      : false
    : file;
};

export { CreateConfig, OpenConfig };
