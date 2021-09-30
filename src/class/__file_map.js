var extend = require('extend-shallow');
import { FindSync, SaveSync, OpenSync } from '../utils/files-manager.js';
import { Encrypted, Decrypted } from '../utils/security-manager.js';
const DefaultMap = [[]];
var SaveMapNotPush = [];

const CreateMap = (options) => {
  options = extend(
    {
      data: '',
      defaultMap: DefaultMap,
      defaultPathSave: 'Launcher/data/Map.aes',
    },
    options,
  );

  const defaultMap = options.defaultMap;

  if (!defaultMap) return false;

  const data = Encrypted({
    data: JSON.stringify({ ...defaultMap, ...options.data }),
  });

  return SaveSync(options.defaultPathSave, data);
};

const OpenMap = (options) => {
  options = extend(
    {
      defaultPathSave: 'Launcher/data/Map.aes',
      decrypted: true,
      JSONParse: true,
      createMapNotFind: true,
    },
    options,
  );

  const defaultPathSave = options.defaultPathSave;
  const decrypted = options.decrypted;
  const JSONParse = options.JSONParse;
  const createMapNotFind = options.createMapNotFind;

  if (!defaultPathSave) return false;

  const fileFind = !FindSync(defaultPathSave)
    ? createMapNotFind
      ? !CreateMap()
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

const UpdateMap = (options) => {
  options = extend(
    {
      data: '',
      defaultPath: 'Launcher/data/Map.aes',
      createMapNotFind: true,
    },
    options,
  );

  const defaultPath = options.defaultPath;
  const createMapNotFind = options.createMapNotFind;
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
  } else if (createMapNotFind) return CreateMap({ data: options.data });
  else return false;
};

const CacheMap = (options) => {
  options = extend(
    {
      data: '',
      push: false,
    },
    options,
  );
  const data = options.data;
  const pushMap = options.push;
  if (!data && !pushMap) return false;
  try {
    if (pushMap) return UpdateMap({ data: SaveMapNotPush });
    SaveMapNotPush.push(data);
    return true;
  } catch (error) {
    return false;
  }
};

const EmptyMap = () => {
  const map = OpenMap();
  return map.length !== undefined;
};

export { CreateMap, OpenMap, UpdateMap, CacheMap, EmptyMap };
