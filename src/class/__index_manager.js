var extend = require('extend-shallow');
const Swal = require('sweetalert2');
import { TitleBar, backdrop } from '../class/__interface_components.js';
import {
  DataUpdate,
  DownloadsUpdate,
  CheckUpdate,
  CheckAllUpdate,
  CheckNewVersion,
} from '../class/__download_controller.js';
import {
  OpenInstallFolder,
  DetecOSFolder,
} from '../utils/application-manager.js';
import { Create, Update, Reset } from '../utils/progress-bar.js';
import { MagicButton } from '../utils/magic-button-manager.js';
import { OpenSbotics } from '../utils/open-sbotics.js';
import { OpenUserFile, UpdateUserFile } from '../class/__file_user.js';
import { LoginOpen, IndexClose, IndexReload } from '../utils/window-manager.js';
import { LanguageInit, Lang } from '../utils/language-manager.js';
import { LinkOpen } from '../utils/window-manager.js';
import { OpenConfig, UpdateConfig } from './__file_config.js';
import { IndexTranslator } from '../utils/language-window.js';
import { FindSync } from '../utils/files-manager.js';
import { VersionSbotics } from '../utils/version-sbotics.js';

// Interface Manager
$('.close-alert').click(function () {
  $('.top-alert').css('display', 'none');
});

$('.close-config').click(function () {
  $('.config-content').css('display', 'none');
});

const GetImageUser = () => {
  document.getElementById('UserImgSettings').src =
    OpenUserFile()['profilePicture'];
};

const InterfaceLoad = async () => {
  await backdrop({ elementName: 'backdrop' });
  IndexTranslator();
  GetImageUser();
};

// Download sBotics Manager
const DonwnloadsBotics = async (options) => {
  Reset();
  options = extend(
    {
      modeText: '',
      force: false,
    },
    options,
  );
  MagicButton({
    mode: 'process',
    text: options.modeText,
  });
  const dataUpdate = await DataUpdate();
  const dataUpdateLength = dataUpdate['data'].length;
  var filesID = dataUpdateLength + 1;
  var filesPast = 0;
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
      name: dataUpdate.name,
      size: dataUpdate.size,
      prefix: `${DetecOSFolder()}/`,
      id: fileID,
      format: dataUpdate.format,
      force: options.force,
    })
      .then((resp) => {
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
        Update({
          id: resp.id,
          addState: 'danger',
          removeState: 'info',
        });
      })
      .then(() => {
        filesPast = filesPast + 1;
        if (filesPast == dataUpdateLength)
          (async () => {
            UpdateConfig({ data: { versionSbotics: await VersionSbotics() } });
            MagicButton({
              mode: 'start',
            });
          })();
      });
  });
};

const FilesVerification = async () => {
  Reset();
  MagicButton({
    mode: 'process',
    text: Lang('Looking for update! Please wait...'),
  });

  const dataUpdate = await DataUpdate();
  const checkAllUpdate = CheckAllUpdate({ dataUpdate: dataUpdate });

  const filesFind = checkAllUpdate.filesFind;
  const filesNotFind = checkAllUpdate.filesNotFind;
  const dataUpdateFiles = checkAllUpdate.dataUpdateFiles;

  const newVersion = await CheckNewVersion();

  if (newVersion)
    return MagicButton({
      mode: 'update',
    });
  if (filesFind == dataUpdateFiles) {
    MagicButton({
      mode: 'start',
    });
  } else {
    if (filesFind > 0) {
      MagicButton({
        mode: 'repair_installation',
      });
    } else {
      MagicButton({
        mode: 'install',
      });
    }
  }
};

const FilesVerificationStart = async () => {
  Reset();
  MagicButton({
    mode: 'process',
    text: Lang('Checking file integrity to open sBotics! Please wait...'),
  });

  const dataUpdate = await DataUpdate();
  const checkAllUpdate = CheckAllUpdate({ dataUpdate: dataUpdate });

  const filesFind = checkAllUpdate.filesFind;
  const filesNotFind = checkAllUpdate.filesNotFind;
  const dataUpdateFiles = checkAllUpdate.dataUpdateFiles;

  const newVersion = await CheckNewVersion();

  if (newVersion)
    return MagicButton({
      mode: 'update',
    });

  if (filesFind == dataUpdateFiles) {
    OpenSbotics();
  } else {
    if (filesFind > 0) {
      MagicButton({
        mode: 'repair_installation',
      });
    } else {
      MagicButton({
        mode: 'install',
      });
    }
  }
};

// const ModalTest = () => {
//   const swalWithBootstrapButtons = Swal.mixin({
//     customClass: {
//       confirmButton: 'btn btn-success',
//       cancelButton: 'btn btn-danger',
//     },
//     buttonsStyling: false,
//   });

//   swalWithBootstrapButtons
//     .fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'No, cancel!',
//       reverseButtons: true,
//       background:
//         'linear-gradient(163deg, rgba(61,180,110,1) 0%, rgba(169,218,111,1) 100%)',
//     })
//     .then((result) => {
//       if (result.isConfirmed) {
//         swalWithBootstrapButtons.fire(
//           'Deleted!',
//           'Your file has been deleted.',
//           'success',
//         );
//       } else if (
//         /* Read more about handling dismissals below */
//         result.dismiss === Swal.DismissReason.cancel
//       ) {
//         swalWithBootstrapButtons.fire(
//           'Cancelled',
//           'Your imaginary file is safe :)',
//           'error',
//         );
//       }
//     });
// };

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  FilesVerification();
});

$(document).on('click', '#MagicButtonClick', () => {
  const mode = $('#MagicButtonClick').data('mode');
  const state = $('#MagicButtonClick').data('state');

  if (!state) return;

  switch (mode) {
    case 'install':
      DonwnloadsBotics({
        modeText: Lang('Installing sBotics! Please wait...'),
      });
      break;
    case 'update':
      DonwnloadsBotics({
        modeText: Lang('Updating sBotics! Please wait...'),
        force: true,
      });
      break;
    case 'repair_installation':
      DonwnloadsBotics({
        modeText: Lang('Repairing sBotics installation! Please wait...'),
      });
      break;
    case 'start':
      FilesVerificationStart();
      break;
    default:
      break;
  }
});

$(document).on('click', '#cBoticsButton', () => {
  LinkOpen('https://cbotics.weduc.natalnet.br/', 'cBotics');
});

$(document).on('click', '#TutorialButton', () => {
  LinkOpen(
    'https://sbotics.github.io/tutorial/content/index.html',
    'sBotics Tutorial',
  );
});

$(document).on('click', '#UserSettings', () => {
  UpdateUserFile({ data: { accessToken: '', logged: false } });
  LoginOpen();
  IndexClose();
});

$(document).on('click', '#OpenFolderInstall', () => {
  if (FindSync('sBotics/')) OpenInstallFolder();
  else {
    FilesVerification();
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
