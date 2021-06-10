var extend = require('extend-shallow');
var sBoticsDownloader = require('sbotics-downloader');

const __sBoticsDownloader = new sBoticsDownloader({
  user: 'sBotics',
  repository: 'sBoticsBuilds',
  branch: 'master',
  externalDownload: true,
  detailedAnswer: true,
});

const DownloadJSON = (options) => {
  options = extend(
    {
      path: '',
      parameter: '',
    },
    options,
  );
  return new Promise((resolve, reject) => {
    if (!options.path) return reject(false);
    __sBoticsDownloader.file(options.path, options.parameter, (err, resp) => {
      if (err) return reject(err);
      resolve(JSON.parse(resp.file));
    });
  });
};

const DownloadFile = (options) => {
  options = extend(
    {
      path: '',
      parameter: '',
    },
    options,
  );
  return new Promise((resolve, reject) => {
    if (!options.path) return reject(false);
    __sBoticsDownloader.file(options.path, options.parameter, (err, resp) => {
      if (err) return reject(err);
      resolve(resp);
    });
  });
};

export { DownloadJSON, DownloadFile };
