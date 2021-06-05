var extend = require('extend-shallow');
var sBoticsDownloader = require('sbotics-downloader');
import { FindSync, FileSizeSync, SaveAsync } from '../utils/files-manager.js';
import { DetecOSFolder } from '../utils/application-manager.js';
import { Create, Update } from '../utils/progress-bar.js';
import { VersionSbotics } from '../utils/version-sbotics.js';
import { OpenConfig, UpdateConfig } from '../class/__file_config.js';

const BlackList = [
  'sBotics/sBotics_Data/StreamingAssets/Skybox.json',
  'sBotics/sBotics_Data/StreamingAssets/skybox.jpg',
  'sBotics/sBotics_Data/StreamingAssets/robots.png',
  'sBotics/sBotics_Data/StreamingAssets/KeyBinding.json',
  'sBotics/sBotics_Data/StreamingAssets/ColorTheme.json',
  'sBotics/sBotics_Data/StreamingAssets/ColorTheme.json.zip',
  'sBotics/sBotics_Data/StreamingAssets/KeyBinding.json.zip',
  'sBotics/sBotics_Data/StreamingAssetsrobots.png.zip',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-en.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-pt_BR.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-en.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-pt_BR.json',
  'sBotics/sBotics_Data/StreamingAssets/Addons/BlockEduc.exe',
];

const __sBoticsDownloader = new sBoticsDownloader({
  user: 'sBotics',
  repository: 'sBoticsBuilds',
  branch: 'master',
  externalDownload: true,
  detailedAnswer: true,
});

const DataUpdate = (options) => {
  options = extend(
    {
      defaultOS: DetecOSFolder(),
    },
    options,
  );
  const defaultOS = options.defaultOS;
  return new Promise((resolve, reject) => {
    if (!defaultOS) return reject(false);
    __sBoticsDownloader.file(`${defaultOS}.json`, (err, resp) => {
      if (err) return reject(false);
      resolve(JSON.parse(resp.file));
    });
  });
};

const CheckUpdate = (options) => {
  options = extend(
    {
      path: '',
      name: '',
      size: '',
      force: false,
    },
    options,
  );

  const path = options.path;
  const name = options.name;
  const size = options.size;
  const force = options.force;

  const pathDownload = `sBotics/${path + name}`;

  if (force) {
    if (BlackList.indexOf(pathDownload) > -1) {
      return true;
    } else {
      return false;
    }
  }

  if (FindSync(pathDownload)) {
    if (FileSizeSync(pathDownload).size != size) {
      if (BlackList.indexOf(pathDownload) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const CheckAllUpdate = (options) => {
  options = extend(
    {
      dataUpdate: '',
      newVersion: '',
      findFolderInstall: '',
    },
    options,
  );

  const dataUpdate = options.dataUpdate;
  const newVersion = options.newVersion;
  const findFolderInstall = options.findFolderInstall;
  const dataUpdateFilesSize = dataUpdate['data'].length;
  var filesID = dataUpdateFilesSize + 1;
  var filesFind = 0;
  var filesNotFind = 0;

  dataUpdate['data'].map((dataUpdate) => {
    const fileID = --filesID;
    Create({
      percentage: dataUpdateFilesSize,
      sizeCreate: true,
      id: fileID,
      state: 'info',
      limit: dataUpdateFilesSize,
    });
    if (
      CheckUpdate({
        path: dataUpdate.path,
        name: dataUpdate.name,
        size: dataUpdate.size,
      })
    ) {
      if (newVersion)
        Update({
          id: fileID,
          addState: 'warning',
          removeState: 'info',
        });
      else
        Update({
          id: fileID,
          addState: 'sbotics-okfiles',
          removeState: 'info',
        });
      filesFind = filesFind + 1;
    } else {
      console.log('newVersion: ' + newVersion);
      console.log('findFolderInstall: ' + findFolderInstall);
      if (!newVersion && findFolderInstall)
        Update({
          id: fileID,
          addState: 'danger',
          removeState: 'info',
        });
      else
        Update({
          id: fileID,
          addState: 'warning',
          removeState: 'info',
        });
      filesNotFind = filesNotFind + 1;
    }
  });
  return {
    filesFind: filesFind,
    filesNotFind: filesNotFind,
    dataUpdateFiles: dataUpdateFilesSize,
  };
};

const DownloadsUpdate = (options) => {
  options = extend(
    {
      path: '',
      name: '',
      prefix: '',
      size: '',
      id: '',
      format: '',
      force: false,
    },
    options,
  );

  const path = options.path;
  const name = options.name;
  const prefix = options.prefix;
  const size = options.size;
  const id = options.id;
  const format = options.format;
  const force = options.force;

  if (!name || !prefix) return 'teste';

  const pathFile = (prefix + path + name).replace('#', '%23');

  return new Promise((resolve, reject) => {
    if (CheckUpdate({ path: path, name: name, size: size, force: force }))
      return resolve({ state: 'ok', id: id });

    __sBoticsDownloader.file(
      pathFile,
      { savePath: `sBotics/${path + name}` },
      (err, resp) => {
        if (err) return reject(false);
        SaveAsync(resp.path, resp.file, format)
          .then((resp) => resolve({ state: 'update', id: id }))
          .catch((err) => reject({ state: false, id: id }));
      },
    );
  });
};

const CheckNewVersion = async () => {
  const newVersion = await VersionSbotics();
  const openConfig = OpenConfig();

  if (!openConfig['versionSbotics']) return true;

  const versionSbotics = openConfig['versionSbotics'];

  return versionSbotics != newVersion;
};

const CheckNormalInstall = () => {
  if (OpenConfig()['normalInstall'] == undefined)
    UpdateConfig({ data: { normalInstall: true } });
  return OpenConfig()['normalInstall'];
};

export {
  DataUpdate,
  CheckUpdate,
  CheckAllUpdate,
  DownloadsUpdate,
  CheckNewVersion,
  CheckNormalInstall,
};
