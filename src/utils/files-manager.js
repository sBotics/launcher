var sBoticsSaver = require('sbotics-saver');

const __sBoticsSaver = new sBoticsSaver({
  useDirectoryHome: true,
  nameFolderDefault: 'wEduc',
  saveAllFromDefaultDirectory: true,
});

const Find = (path) => {
  return new Promise((resolve, reject) => {
    __sBoticsSaver.find(path, (err, resp) => {
      if (err) reject(err);
      else resp ? resolve(true) : reject(false);
    });
  });
};

const Save = (path, data) => {
  return new Promise((resolve, reject) => {
    __sBoticsSaver.save(path, { data: data }, (err, resp) => {
      if (err) {
        reject(false);
      } else resolve(true);
    });
  });
};

const Open = (path) => {
  return new Promise((resolve, reject) => {
    __sBoticsSaver.open(path, (err, resp) => {
      if (err) reject(err);
      else resolve(resp);
    });
  });
};

export { Find, Save, Open };
