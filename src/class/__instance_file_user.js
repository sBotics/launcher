var extend = require('extend-shallow');
import { FindSync, SaveSync, OpenSync } from '../utils/files-manager.js';
import { Encrypted, Decrypted } from '../utils/security-manager.js';

const DefaultUser = {
  nickname: '',
  name: '',
  email: '',
  profilePicture: '',
  preferredLanguage: '',
  preferredTimezone: '',
  accessToken: '',
  logged: '',
  macAddress: '',
};

class FileUser {
  constructor() {}
  create(options) {
    options = extend(
      {
        data: '',
        defaultUser: DefaultUser,
        defaultPathSave: 'Launcher/data/User.aes',
      },
      options,
    );
    const defaultUser = options.defaultUser;

    if (!defaultUser) return false;

    const data = Encrypted({
      data: JSON.stringify({ ...defaultUser, ...options.data }),
    });

    return SaveSync(options.defaultPathSave, data);
  }
  open(options) {
    options = extend(
      {
        decrypted: true,
        JSONParse: true,
        createUserNotFind: true,
        defaultPathSave: 'Launcher/data/User.aes',
      },
      options,
    );

    const defaultPathSave = options.defaultPathSave;
    const decrypted = options.decrypted;
    const JSONParse = options.JSONParse;
    const createUserNotFind = options.createUserNotFind;

    if (!defaultPathSave) return false;

    const fileFind = !FindSync(defaultPathSave)
      ? createUserNotFind
        ? !this.create()
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
  }
  update(options) {
    options = extend(
      {
        data: '',
        createUserNotFind: true,
        defaultPath: 'Launcher/data/User.aes',
      },
      options,
    );
    const defaultPath = options.defaultPath;
    const createUserNotFind = options.createUserNotFind;
    if (!options.data) return false;

    if (FindSync(defaultPath)) {
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
    } else if (createUserNotFind) return this.create({ data: options.data });
    else return false;
  }
}
export { FileUser };
