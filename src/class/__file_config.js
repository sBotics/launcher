// Localiza e abre o arquivo de configuração
// Cria o arquivo de configuração
// Altera dados do arquivo de configuração
// Deleta o arquivo de configuração

var extend = require('extend-shallow');
import {} from '../utils/files-manager.js';
const DefaultConfiguration = {
  language: 'en_US',
};

const CreateConfig = (options) => {
  options = extend(
    {
      data: '',
      defaultConfig: DefaultConfiguration,
      defaultPathSave: 'Launcher/data/',
    },
    options,
  );

  const data = options.data;
  const defaultConfig = options.defaultConfig;

  if (!defaultConfig) return false;

  const config = { ...defaultConfig, ...options.data };
};
