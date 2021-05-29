var sBoticsFilesManager = require('sbotics-files-manager');

const __sBoticsFilesManager = new sBoticsFilesManager({
  useDirectoryHome: true,
  nameFolderDefault: 'wEduc',
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

const SaveSync = (path, data) => {
  try {
    return __sBoticsFilesManager.save(path, { data: data });
  } catch (error) {
    return false;
  }
};

const SaveAsync = (path, data) => {
  return new Promise((resolve, reject) => {
    try {
      __sBoticsFilesManager.save(path, { data: data }, (err, resp) => {
        if (err) reject(false);
        else resolve(true);
      });
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

export { FindSync, FindAsync, SaveSync, SaveAsync, OpenSync, OpenAsync };
