var sBoticsFilesManager = require('sbotics-files-manager');
const __sBoticsFilesManager = new sBoticsFilesManager({
  useDirectoryHome: true,
  nameFolderDefault: 'sBotics',
  saveAllFromDefaultDirectory: true,
});

const FindSync = (path) => {
  try {
    return __sBoticsFilesManager.find(path);
  } catch (error) {
    return false;
  }
};

const FindAsync = (path) => {
  return new Promise((resolve, reject) => {
    try {
      __sBoticsFilesManager.find(path, (err, resp) => {
        if (err) reject(err);
        else resp ? resolve(true) : reject(false);
      });
    } catch (error) {
      reject(false);
    }
  });
};

const SaveSync = (path, data, format = '') => {
  try {
    return __sBoticsFilesManager.save(path, { data: data, format: format });
  } catch (error) {
    return false;
  }
};

const SaveAsync = (path, data, format = '') => {
  return new Promise((resolve, reject) => {
    try {
      __sBoticsFilesManager.save(
        path,
        { data: data, format: format },
        (err, resp) => {
          if (err) reject(false);
          else resolve(true);
        },
      );
    } catch (error) {
      reject(false);
    }
  });
};

const OpenSync = (path) => {
  try {
    return __sBoticsFilesManager.open(path);
  } catch (error) {
    return false;
  }
};

const OpenAsync = (path) => {
  return new Promise((resolve, reject) => {
    try {
      __sBoticsFilesManager.open(path, (err, resp) => {
        if (err) reject(false);
        else resolve(resp);
      });
    } catch (error) {
      reject(false);
    }
  });
};

const FileSizeSync = (path) => {
  try {
    return __sBoticsFilesManager.stat(path);
  } catch (error) {
    return false;
  }
};

const CopySync = (originalPath, newPath) => {
  try {
    return __sBoticsFilesManager.copy(originalPath, {newPath: newPath});
  } catch (error) {
    console.log(error)
    return false;
  }
};

const ExtractSync = (path) => {
  try {
    return __sBoticsFilesManager.extractZip(path);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export {
  FindSync,
  FindAsync,
  SaveSync,
  SaveAsync,
  OpenSync,
  OpenAsync,
  FileSizeSync,
  CopySync,
  ExtractSync,
};
