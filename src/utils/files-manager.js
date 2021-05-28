var sBoticsSaver = require('sbotics-saver');

const __sBoticsSaver = new sBoticsSaver({
  useDirectoryHome: true,
  nameFolderDefault: 'wEduc',
  saveAllFromDefaultDirectory: true,
});

const Save = (path, data) => {
  return new Promise((resolve, reject) => {
    __sBoticsSaver.save(path, { data: data }, (err, resp) => {
      if (err) reject(false);
      else resolve(true);
    });
  });
};

export { Save };
