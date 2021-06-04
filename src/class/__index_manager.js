const Swal = require('sweetalert2');
import { TitleBar, backdrop } from '../class/__interface_components.js';
import {
  DataUpdate,
  DownloadsUpdate,
  CheckUpdate,
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
  IndexOpen,
  IndexReload,
} from '../utils/window-manager.js';
import { LanguageInit, Lang } from '../utils/language-manager.js';
import { LinkOpen } from '../utils/window-manager.js';
import { OpenConfig, UpdateConfig } from './__file_config.js';
import { IndexTranslator } from '../utils/language-window.js';

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
const DonwnloadsBotics = async (modeText = '') => {
  Reset();
  MagicButton({
    mode: 'process',
    text: modeText,
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
    })
      .then((resp) => {
        if (resp.state == 'ok') {
          Update({
            id: resp.id,
            addState: 'sbotics-okfiles',
            removeState: 'info',
          });
        } else if (resp.state == 'update') {
          console.log(dataUpdate.path + dataUpdate.name);
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
          MagicButton({
            mode: 'start',
          });
      });
  });
};

const FilesVerification = async () => {
  MagicButton({
    mode: 'process',
    text: Lang('Looking for update! Please wait...'),
  });

  const dataUpdate = await DataUpdate();
  const checkAllUpdate = CheckAllUpdate({ dataUpdate: dataUpdate });

  const filesFind = checkAllUpdate.filesFind;
  const filesNotFind = checkAllUpdate.filesNotFind;
  const dataUpdateFiles = checkAllUpdate.dataUpdateFiles;

  if (filesFind == dataUpdateFiles) {
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

const ModalTest = () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
      background:
        'linear-gradient(163deg, rgba(61,180,110,1) 0%, rgba(169,218,111,1) 100%)',
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success',
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error',
        );
      }
    });
};

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  FilesVerification();
  ModalTest();
});

$(document).on('click', '#MagicButtonClick', () => {
  const mode = $('#MagicButtonClick').data('mode');
  const state = $('#MagicButtonClick').data('state');

  if (!state) return;

  switch (mode) {
    case 'install':
      DonwnloadsBotics(Lang('Installing sBotics! Please wait...'));
      break;

    case 'update':
      DonwnloadsBotics(Lang('Updating sBotics! Please wait...'));
      break;
    case 'start':
      OpenSbotics();
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
  OpenInstallFolder();
});

$(document).on('click', '#UpdateLanguageSbotics', () => {
  console.log(OpenConfig()['language']);
  const language = OpenConfig()['language'] == 'pt_BR' ? 'en_US' : 'pt_BR';
  UpdateConfig({ data: { language: language } });
  IndexReload();
});
