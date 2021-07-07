var extend = require('extend-shallow');
const Downloader = require('nodejs-file-downloader');
import { FindSync, FileSizeSync, ExtractSync } from '../utils/files-manager.js';
import {
  DetecOSFolder,
  folderPathGsBotics,
  SLMP,
} from '../utils/application-manager.js';
import { Create, Update } from '../utils/progress-bar.js';
import { DownloadJSON, DownloadFile } from '../utils/donwload-manager.js';
import {
  StreamingAssets,
  CreateBackupStreamingAssets,
} from '../utils/backup-streaming-assets.js';
import { ParseTime, ConvertTime } from '../utils/last-updated.js';
import {
  AddEvent,
  UpdateEventParcent,
} from '../utils/relatorio-download-manager.js';

const BlackList = [
  'sBotics/sBotics_Data/StreamingAssets/Skybox.json',
  'sBotics/sBotics_Data/StreamingAssets/skybox.jpg',
  'sBotics/sBotics_Data/StreamingAssets/robots.png',
  'sBotics/sBotics_Data/StreamingAssets/KeyBinding.json',
  'sBotics/sBotics_Data/StreamingAssets/ColorTheme.json',
  'sBotics/sBotics_Data/StreamingAssets/ColorTheme.json.zip',
  'sBotics/sBotics_Data/StreamingAssets/KeyBinding.json.zip',
  'sBotics/sBotics_Data/StreamingAssets/robots.png.zip',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-en.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-pt_BR.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-en.json',
  'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-pt_BR.json',
];

const BlackListSize = [
  'sBotics/sBotics_Data/StreamingAssets/robots.png',
  'sBotics/sBotics_Data/StreamingAssets/skybox.jpg',
];

const DataUpdate = async (options) => {
  options = extend(
    {
      defaultOS: DetecOSFolder(),
    },
    options,
  );
  const defaultOS = options.defaultOS;
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
    },
    options,
  );

  const path = options.path;
  const name = options.name;
  const size = options.size;
  const lastUpdatedAt = options.lastUpdatedAt;

  const pathDownload = `sBotics/${path + name}`;

  if (FindSync(pathDownload)) {
    const donwloadFileTime = ParseTime(lastUpdatedAt);
    const saveFileTime = Math.floor(FileSizeSync(pathDownload).mtimeMs);
    if (donwloadFileTime >= saveFileTime) {
      return BlackListSize.indexOf(pathDownload) > -1;
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
    )
      return resolve({ state: 'ok', id: id });

    (async () => {
      AddEvent(id, path + name);
      CreateBackupStreamingAssets({
        fileName: name,
        backupConfig: backupConfig,
      });
      const downloader = new Downloader({
        url: pathURL,
        directory: folderPathGsBotics() + '/' + path,
        fileName: name,
        cloneFiles: false,
        maxAttempts: 15,
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
