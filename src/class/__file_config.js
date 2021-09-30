var extend = require('extend-shallow');
import { FindSync, SaveSync, OpenSync } from '../utils/files-manager.js';
import { Encrypted, Decrypted } from '../utils/security-manager.js';
import {
  folderPathGLauncher,
  SystemGetLocale,
} from '../utils/application-manager.js';

const DefaultConfiguration = {
  language: SystemGetLocale(),
  folderPath: folderPathGLauncher,
  languageSimulator: SystemGetLocale().replace('_US', ''),
  fastMode: false,
  currentSboticsVersion: '',
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

const UpdateConfig = (options) => {
  options = extend(
    {
      data: '',
      defaultPath: 'Launcher/data/Config.aes',
      createConfigNotFind: true,
    },
    options,
  );

  const defaultPath = options.defaultPath;
  const createConfigNotFind = options.createConfigNotFind;
  if (!options.data) return false;

  if (FindSync(defaultPath)) {
    console.log('Update');
    const openFile = OpenSync(defaultPath);
    if (!openFile) return false;
    const decryptedFile = Decrypted({ data: openFile });
    if (!decryptedFile) return false;
    const content = JSON.parse(decryptedFile);
    if (!content) return false;
    const data = Encrypted({
      data: JSON.stringify({ ...content, ...options.data }),
    });
    return SaveSync(defaultPath, data);
  } else if (createConfigNotFind) return CreateConfig({ data: options.data });
  else return false;
};

export { CreateConfig, OpenConfig, UpdateConfig };
