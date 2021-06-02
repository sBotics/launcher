var extend = require('extend-shallow');
import { FindSync, SaveSync, OpenSync } from '../utils/files-manager.js';
import { Encrypted, Decrypted } from '../utils/security-manager.js';

const DefaultUser = {
  name: '',
  email: '',
  profilePicture: '',
  locale: '',
  accessToken: '',
  logged: '',
};

const CreateUserFile = (options) => {
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
};

const OpenUserFile = (options) => {
  options = extend(
    {
      defaultPathSave: 'Launcher/data/User.aes',
      decrypted: true,
      JSONParse: true,
      createUserNotFind: true,
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
      ? !CreateUserFile()
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

const UpdateUserFile = (options) => {
  options = extend(
    {
      data: '',
      defaultPath: 'Launcher/data/User.aes',
      createUserNotFind: true,
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
  } else if (createUserNotFind) return CreateUserFile({ data: options.data });
  else return false;
};

export { CreateUserFile, OpenUserFile, UpdateUserFile };
