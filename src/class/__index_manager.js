var extend = require('extend-shallow');
const Swal = require('sweetalert2');
import { backdrop } from '../class/__interface_components.js';
import {
  DataUpdate,
  DownloadsUpdate,
  CheckAllUpdate,
} from '../class/__download_controller.js';
import {
  OpenInstallFolder,
  DetecOSFolder,
} from '../utils/application-manager.js';
import { Create, Update, Reset } from '../utils/progress-bar.js';
import { MagicButton } from '../utils/magic-button-manager.js';
import { OpenSbotics } from '../utils/open-sbotics.js';
import { OpenUserFile, UpdateUserFile } from '../class/__file_user.js';
import {
  LoginOpen,
  IndexClose,
  OpenCbotics,
  OpenTutorialWiki,
  IndexReload,
} from '../utils/window-manager.js';
import { LanguageInit, Lang } from '../utils/language-manager.js';
import { OpenConfig, UpdateConfig } from './__file_config.js';
import { IndexTranslator } from '../utils/language-window.js';
import { FindSync } from '../utils/files-manager.js';
import { VersionSbotics } from '../utils/version-sbotics.js';
import { CreateTopAlert } from '../utils/top-alert.js';
import { ClearEvent } from '../utils/relatorio-download-manager.js';
// Interface Manager
$('.close-alert').click(() => {
  $('.top-alert').css('display', 'none');
});

$('.close-config').click(() => {
  $('.config-content').css('display', 'none');
});

const GetImageUser = async () => {
  document.getElementById('UserImgSettings').src =
    OpenUserFile()['profilePicture'];
};

const GetPathNote = async () => {
  const versionSbotics = await VersionSbotics();
  document.getElementById('Version_sBotics').innerHTML = versionSbotics;
};

const InterfaceLoad = async () => {
  IndexTranslator();
  GetImageUser();
  GetPathNote();
  backdrop({ elementName: 'backdrop' });
};

const FailApplication = (message) => {
  CreateTopAlert({
    states: 'danger',
    message: `${message} -  ${Lang(
      'If a continuation fails, please contact the developers.',
    )}`,
  });
  Reset();
  Create({
    percentage: 100,
    id: '1',
    state: 'danger',
    limit: 100,
  });
  MagicButton({
    mode: 'fail',
    text: message,
  });
};

const FilesVerification = async (options) => {
  Reset();

  options = extend(
    {
      modeText: '',
      autoOpen: false,
    },
    options,
  );

  const modeText = options.modeText;
  const autoOpen = options.autoOpen;

  MagicButton({
    mode: 'process',
    text: modeText,
  });

  const dataUpdate = await DataUpdate();

  if (!dataUpdate)
    return FailApplication(Lang('Failure! When looking for sBotics update.'));

  const checkAllUpdate = CheckAllUpdate({ dataUpdate: dataUpdate });

  if (!checkAllUpdate)
    return FailApplication(Lang('Failure! When checking sBotics files.'));

  const filesFind = checkAllUpdate.filesFind;
  const dataUpdateFiles = checkAllUpdate.dataUpdateFiles;

  if (filesFind == dataUpdateFiles) {
    if (autoOpen) OpenSbotics();
    else
      MagicButton({
        mode: 'start',
      });
  } else {
    if (filesFind > 0) {
      MagicButton({
        mode: 'update',
      });
    } else {
      MagicButton({
        mode: 'install',
      });
    }
  }
};

// Download sBotics Manager
const DonwnloadsBotics = async (options) => {
  Reset();
  ClearEvent();
  options = extend(
    {
      modeText: '',
      type: '',
    },
    options,
  );

  const modeText = options.modeText;
  const type = options.type;

  MagicButton({
    mode: 'process',
    text: modeText,
  });

  const dataUpdate = await DataUpdate();

  if (!dataUpdate)
    return FailApplication(
      Lang('Download Failed! When looking for sBotics update.'),
    );

  try {
    const dataUpdateLength = dataUpdate['data'].length;
    var filesID = dataUpdateLength + 1;
    var filesPast = 0;
    var success = 0;
    dataUpdate['data'].map((dataUpdate) => {
      const fileID = --filesID;
      Create({
        percentage: dataUpdateLength,
        sizeCreate: true,
        id: fileID,
        state: 'info',
        limit: dataUpdateLength,
      });
      DownloadsUpdate({
        path: dataUpdate.path,
        pathURL: dataUpdate.download,
        name: dataUpdate.name,
        size: dataUpdate.size,
        prefix: `${DetecOSFolder()}/`,
        id: fileID,
        format: dataUpdate.format,
        lastUpdatedAt: dataUpdate.last_updated_at,
      })
        .then((resp) => {
          success = success + 1;
          if (resp.state == 'ok') {
            Update({
              id: resp.id,
              addState: 'sbotics-okfiles',
              removeState: 'info',
            });
          } else if (resp.state == 'update') {
            // console.log(dataUpdate.path + dataUpdate.name);
            Update({
              id: resp.id,
              addState: 'success',
              removeState: 'info',
            });
          } else {
            Update({
              id: resp.id,
              addState: 'danger',
              removeState: 'info',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          Update({
            id: err.id,
            addState: 'danger',
            removeState: 'info',
          });
        })
        .then(() => {
          filesPast = filesPast + 1;
          if (filesPast == dataUpdateLength)
            if (success != filesPast)
              FailApplication(
                Lang(
                  'Failed to install sBotics! Check your internet connection.',
                ),
              );
            else {
              switch (type) {
                case 'install':
                  CreateTopAlert({
                    states: 'success',
                    message: Lang(
                      'sBotics installed successfully! Ready to open.',
                    ),
                  });
                  break;
                case 'update':
                  CreateTopAlert({
                    states: 'success',
                    message: Lang(
                      'sBotics updated successfully! Ready to open.',
                    ),
                  });
                  break;
              }
              FilesVerification({
                modeText: Lang('Looking for update! Please wait...'),
              });
              MagicButton({
                mode: 'start',
              });
            }
        });
    });
  } catch (error) {
    return FailApplication(Lang('Download Failed!') + error);
  }
};

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  FilesVerification({ modeText: Lang('Looking for update! Please wait...') });
});

// Magic Button Manager Config
$(document).on('click', '#MagicButtonClick', () => {
  const mode = $('#MagicButtonClick').data('mode');
  const state = $('#MagicButtonClick').data('state');
  if (!state) return;
  switch (mode) {
    case 'install':
      DonwnloadsBotics({
        modeText: Lang('Installing sBotics! Please wait...'),
        type: 'install',
      });
      break;
    case 'update':
      DonwnloadsBotics({
        modeText: Lang('Updating sBotics! Please wait...'),
        type: 'update',
      });
      break;
    case 'start':
      FilesVerification({
        modelText: Lang(
          'Checking file integrity to open sBotics! Please wait...',
        ),
        autoOpen: true,
      });
      break;
    default:
      break;
  }
});

// Controller Menu_Bar
$(document).on('click', '#cBoticsButton', () => {
  OpenCbotics('https://cbotics.weduc.natalnet.br/', 'cBotics');
});

$(document).on('click', '#TutorialButton', () => {
  OpenTutorialWiki(
    'https://sbotics.github.io/tutorial/content/index.html',
    'sBotics Tutorial',
  );
});

$(document).on('click', '#UserSettings', () => {
  UpdateUserFile({ data: { accessToken: '', macAddress: '', logged: false } });
  LoginOpen();
  IndexClose();
});

$(document).on('click', '#OpenFolderInstall', () => {
  if (FindSync('sBotics/')) OpenInstallFolder();
  else {
    FilesVerification({ modeText: Lang('Looking for update! Please wait...') });
    Swal.fire({
      icon: 'error',
      title: Lang('Failed to open!'),
      text: Lang('Installation folder not found! Try installing again.'),
      showCancelButton: false,
      confirmButtonText: Lang('Install sBotics'),
    }).then((result) => {
      if (result.isConfirmed) {
        DonwnloadsBotics(Lang('Installing sBotics! Please wait...'));
      }
    });
  }
});

$(document).on('click', '#UpdateLanguageSbotics', () => {
  console.log(OpenConfig()['language']);
  const language = OpenConfig()['language'] == 'pt_BR' ? 'en_US' : 'pt_BR';
  UpdateConfig({
    data: {
      language: language,
      languageSimulator: language.replace('_US', ''),
    },
  });
  IndexReload();
});
