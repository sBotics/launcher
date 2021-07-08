var extend = require('extend-shallow');
import {
  FindSync,
  SaveSync,
  OpenSync,
  CopySync,
} from '../utils/files-manager.js';

const FilesBackupList = {
  'Skybox.json': {
    name: 'Skybox.json',
    path: 'sBotics/sBotics_Data/StreamingAssets/Skybox.json',
    type: 'JSON',
  },
  'skybox.jpg': {
    name: 'skybox.jpg',
    path: 'sBotics/sBotics_Data/StreamingAssets/skybox.jpg',
    type: 'IMAGE',
  },
  'robots.png': {
    name: 'robots.png',
    path: 'sBotics/sBotics_Data/StreamingAssets/robots.png',
    type: 'IMAGE',
  },
  'KeyBinding.json': {
    name: 'KeyBinding.json',
    path: 'sBotics/sBotics_Data/StreamingAssets/KeyBinding.json',
    type: 'JSON',
  },
  'ColorTheme.json': {
    name: 'ColorTheme.json',
    path: 'sBotics/sBotics_Data/StreamingAssets/ColorTheme.json',
    type: 'JSON',
  },
  'C#-en.json': {
    name: 'C#-en.json',
    path: 'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-en.json',
    type: 'JSON',
  },
  'C#-pt_BR.json': {
    name: 'C#-pt_BR.json',
    path: 'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/C#-pt_BR.json',
    type: 'JSON',
  },
  'rEduc-en.json': {
    name: 'rEduc-en.json',
    path: 'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-en.json',
    type: 'JSON',
  },
  'rEduc-pt_BR.json': {
    name: 'rEduc-pt_BR.json',
    path: 'sBotics/sBotics_Data/StreamingAssets/ProgrammingThemes/rEduc-pt_BR.json',
    type: 'JSON',
  },
};

const StreamingAssets = (options) => {
  options = extend(
    {
      fileName: '',
      filesBackupList: FilesBackupList,
      defaultPathFolder: 'Launcher/backup/StreamingAssets',
      backupConfig: true,
    },
    options,
  );

  try {
    const fileName = options.fileName;
    const backupConfig = options.backupConfig;
    const filesBackupList = options.filesBackupList[fileName];
    const defaultPathFolder = options.defaultPathFolder;
    const backupFolder = `${defaultPathFolder}/${fileName}`;
    const sBoticsPath = filesBackupList.path;
    const fileType = filesBackupList.type;

    if (backupConfig) {
      try {
        if (FindSync(sBoticsPath) && FindSync(backupFolder)) {
          switch (fileType) {
            case 'JSON':
              const originalJSON = JSON.parse(OpenSync(sBoticsPath));
              const backupJSON = JSON.parse(OpenSync(backupFolder));
              const changeFile = { ...originalJSON, ...backupJSON };
              return SaveSync(sBoticsPath, JSON.stringify(changeFile))
                ? true
                : false;

              break;
            case 'IMAGE':
              return CopySync(backupFolder, sBoticsPath) ? true : false;
              break;
            default:
              return false;
              break;
          }
        }
      } catch (error) {
        throw new Error(
          'Falha! Não foi possivel localizar, routas de arquivos validos para salvar!',
        );
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const CreateBackupStreamingAssets = (options) => {
  options = extend(
    {
      fileName: '',
      filesBackupList: FilesBackupList,
      defaultPathFolder: 'Launcher/backup/StreamingAssets',
      backupConfig: true,
    },
    options,
  );

  try {
    const fileName = options.fileName;
    const backupConfig = options.backupConfig;
    const filesBackupList = options.filesBackupList[fileName];
    const defaultPathFolder = options.defaultPathFolder;
    const backupFolder = `${defaultPathFolder}/${fileName}`;
    const sBoticsPath = filesBackupList.path;
    const fileType = filesBackupList.type;

    if (backupConfig) {
      try {
        if (FindSync(sBoticsPath)) {
          const CopyFile = CopySync(sBoticsPath, backupFolder);
          if (!CopyFile) return false;
          return true;
        }
      } catch (error) {
        throw new Error(
          'Falha! Não foi possivel localizar, routas de arquivos validos para salvar!',
        );
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const CreateBackupStreamingAssetsAll = () => {
  const BlackList = [
    'Skybox.json',
    'skybox.jpg',
    'robots.png',
    'KeyBinding.json',
    'ColorTheme.json',
    'C#-en.json',
    'C#-pt_BR.json',
    'rEduc-en.json',
    'rEduc-pt_BR.json',
  ];
  const blackListLength = BlackList.length;
  var backlistnow = 1;
  return new Promise((resolve, reject) => {
    BlackList.map((file) => {
      CreateBackupStreamingAssets({ fileName: file });
      if (blackListLength == backlistnow++) resolve(true);
    });
  });
};

export {
  StreamingAssets,
  CreateBackupStreamingAssets,
  CreateBackupStreamingAssetsAll,
};
