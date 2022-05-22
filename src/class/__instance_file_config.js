let extend = require('extend-shallow');
import { FindSync, SaveSync, OpenSync } from '../utils/files-manager.js';
import { Application } from './__instance_application.js';
import { Security } from './__instance_security.js';

let application = new Application();
let security = new Security();

const DefaultConfiguration = {
  language: application.getLocale(),
  folderPath: application.getFolderPathLauncher(),
  languageSimulator: application.getLocale().replace('_US', ''),
  sBoticsVersionInstalled: '',
};

class FileConfig {
  constructor() {}
  create(options) {
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

    const data = security.encrypted({
      data: JSON.stringify({ ...defaultConfig, ...options.data }),
    });

    return SaveSync(options.defaultPathSave, data);
  }
  open(options) {
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
        ? !this.create()
          ? false
          : true
        : false
      : true;

    if (!fileFind) return false;

    const file = OpenSync(defaultPathSave);

    if (!file) return false;

    const fileDecrypted = security.decrypted({ data: file });

    return decrypted
      ? fileDecrypted
        ? JSONParse
          ? JSON.parse(fileDecrypted)
          : fileDecrypted
        : false
      : file;
  }
  update(options) {
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
      const decryptedFile = security.decrypted({ data: openFile });
      if (!decryptedFile) return false;
      const content = JSON.parse(decryptedFile);
      if (!content) return false;
      const data = security.encrypted({
        data: JSON.stringify({ ...content, ...options.data }),
      });
      return SaveSync(defaultPath, data);
    } else if (createConfigNotFind) return this.create({ data: options.data });
    else return false;
  }
}

export { FileConfig };
