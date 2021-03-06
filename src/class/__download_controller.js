var extend = require('extend-shallow');
const Downloader = require('nodejs-file-downloader');
const fs = require('fs-extra');
import { FindSync, FileSizeSync, ExtractSync } from '../utils/files-manager.js';
import {
  DetecOSFolder,
  folderPathGsBotics,
  folderPathStreamingAssets,
  SLMP,
} from '../utils/application-manager.js';
import { Create, Update } from '../utils/progress-bar.js';
import { DownloadJSON } from '../utils/donwload-manager.js';
import {
  StreamingAssets,
  CreateBackupStreamingAssets,
} from '../utils/backup-streaming-assets.js';
import { ParseTime } from '../utils/last-updated.js';
import {
  AddEvent,
  UpdateEventParcent,
} from '../utils/relatorio-download-manager.js';
import { ForceInstallManager } from '../utils/force-install-manager.js';
import { OpenConfig, UpdateConfig } from './__file_config.js';

const BlackList = [
  folderPathStreamingAssets() + 'Skybox.json',
  folderPathStreamingAssets() + 'skybox.jpg',
  folderPathStreamingAssets() + 'robots.png',
  folderPathStreamingAssets() + 'KeyBinding.json',
  folderPathStreamingAssets() + 'ColorTheme.json',
  folderPathStreamingAssets() + 'ColorTheme.json.zip',
  folderPathStreamingAssets() + 'KeyBinding.json.zip',
  folderPathStreamingAssets() + 'robots.png.zip',
  folderPathStreamingAssets() + 'ProgrammingThemes/C#-en.json',
  folderPathStreamingAssets() + 'ProgrammingThemes/C#-pt_BR.json',
  folderPathStreamingAssets() + 'ProgrammingThemes/rEduc-en.json',
  folderPathStreamingAssets() + 'ProgrammingThemes/rEduc-pt_BR.json',
];

const DataUpdate = async (options) => {
  options = extend(
    {
      defaultOS: DetecOSFolder(),
    },
    options,
  );
  const defaultOS = options.defaultOS;

  if (OpenConfig()['currentSboticsVersion'] === undefined)
    UpdateConfig({ data: { currentSboticsVersionn: '1.0.0' } });

  localStorage.setItem(
    'currentSboticsVersion',
    OpenConfig()['currentSboticsVersion'],
  );

  try {
    return await DownloadJSON({ path: `${defaultOS}.json` });
  } catch (error) {
    return false;
  }
};

const CheckUpdate = (options) => {
  options = extend(
    {
      path: '',
      name: '',
      size: '',
      lastUpdatedAt: '',
      forceInstall: false,
    },
    options,
  );

  const path = options.path;
  const name = options.name;
  const size = options.size;
  const lastUpdatedAt = options.lastUpdatedAt;
  const pathDownload = `sBotics/${path + name}`;
  const forceInstall = options.forceInstall;

  if (forceInstall) {
    if (FileSizeSync(pathDownload).size != size) {
      if (BlackList.indexOf(pathDownload) > -1) return true;
      else return false;
    }
    return false;
  }

  if (FindSync(pathDownload)) {
    const donwloadFileTime = ParseTime(lastUpdatedAt);
    const saveFileTime = Math.floor(FileSizeSync(pathDownload).mtimeMs);
    if (donwloadFileTime >= saveFileTime) {
      return BlackList.indexOf(pathDownload) > -1;
    } else if (FileSizeSync(pathDownload).size != size) {
      return BlackList.indexOf(pathDownload) > -1;
    }
    return true;
  } else {
    return false;
  }
};

const CheckAllUpdate = (options) => {
  options = extend(
    {
      dataUpdate: '',
    },
    options,
  );
  try {
    const dataUpdate = options.dataUpdate;

    localStorage.setItem('versionSbotics', dataUpdate['version']);

    const forceInstall = ForceInstallManager({
      forceInstall: dataUpdate['force'],
      newSboticsVersion: dataUpdate['version'],
    });

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
          lastUpdatedAt: dataUpdate.last_updated_at,
          forceInstall: forceInstall,
        })
      ) {
        Update({
          id: fileID,
          addState: 'sbotics-okfiles',
          removeState: 'info',
        });
        filesFind = filesFind + 1;
      } else {
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
      forceInstall: forceInstall,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

const DownloadsUpdate = async (options) => {
  options = extend(
    {
      path: '',
      pathURL: '',
      name: '',
      prefix: '',
      size: '',
      id: '',
      format: '',
      lastUpdatedAt: '',
    },
    options,
  );

  const path = options.path;
  const pathURL = options.pathURL;
  const name = options.name;
  const prefix = options.prefix;
  const size = options.size;
  const id = options.id;
  const format = options.format;
  const lastUpdatedAt = options.lastUpdatedAt;

  if (!name || !prefix) return 'teste';

  const pathFile = (prefix + path + name).replace('#', '%23');

  const backupConfig = true;

  return new Promise((resolve, reject) => {
    if (
      CheckUpdate({
        path: path,
        name: name,
        size: size,
        lastUpdatedAt: lastUpdatedAt,
      })
    ) {
      return resolve({ state: 'ok', id: id });
    }

    (async () => {
      if (BlackList.indexOf(`sBotics/${path + name}`) > -1) {
        CreateBackupStreamingAssets({
          fileName: name,
          backupConfig: backupConfig,
        });
      }

      AddEvent(id, path + name);
      const downloader = new Downloader({
        url: pathURL,
        directory: folderPathGsBotics() + '/' + path,
        fileName: name,
        cloneFiles: false,
        maxAttempts: 5,
        timeout: 50000,
        onProgress: function (percentage, chunk, remainingSize) {
          UpdateEventParcent(id, percentage);
        },
        shouldStop: function (error) {
          if (SLMP()) {
            console.info('Falhou: ' + path + name);
            console.error(error);
          }
          if (error.statusCode && error.statusCode === 404) {
            return true;
          }
        },
      });

      try {
        await downloader.download();
        StreamingAssets({
          fileName: name,
          backupConfig: backupConfig,
        });
        if (format == 'zip') {
          if (ExtractSync('sBotics/' + path + name)) {
            resolve({ state: 'update', id: id });
          } else {
            reject({ state: false, id: id });
          }
        } else {
          resolve({ state: 'update', id: id });
        }
      } catch (error) {
        console.log(error);
        reject({ state: false, id: id });
      }
    })();
  });
};

export { DataUpdate, CheckUpdate, CheckAllUpdate, DownloadsUpdate };
