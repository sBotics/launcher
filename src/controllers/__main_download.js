let extend = require('extend-shallow');
let hljs = require('highlight.js');
let swal = require('sweetalert2');
let markdown = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' +
      markdown.utils.escapeHtml(str) +
      '</code></pre>'
    );
  },
});

import { Alerts } from '../class/__instance_alerts.js';
import { Application } from '../class/__instance_application.js';
import { Connection } from '../class/__instance_connection.js';
import { MagicButton } from '../class/__instance_magic_button.js';
import { Exception } from '../class/__instance_exception.js';
import { FileConfig } from '../class/__instance_file_config.js';
import { FileSizeSync, FindSync } from '../utils/files-manager.js';
import { ProgressBar } from '../class/__instance_progress_bar.js';

let alert = new Alerts();
let connection = new Connection();
let application = new Application();
let fileConfig = new FileConfig();
let progressBar = new ProgressBar();

let dataContent = null;

const blackList = []; // Indica para o verificador, ignorar os caminhos contidos dentro dessa lista

// ===========================

const FailDownload = (options) => {
  options = extend(
    {
      mode: 0,
      message: '',
    },
    options,
  );
  const message = options.message;

  switch (options.mode) {
    case 1:
      alert.createTop({
        states: 'danger',
        message: message,
      });
      progressBar.clear();
      new MagicButton({
        mode: 'fail',
        text: message,
      });
      break;

    default:
      alert.createTop({
        states: 'danger',
        message: `${message} - Se a falha persistir, entre em contato com os desenvolvedores`,
        fixed: true,
        timeOutVIew: 0,
      });
      progressBar.clear();
      progressBar.styleHeight('small');
      progressBar.create({
        id: '1',
        state: 'danger',
        percentage: 100,
      });
      new MagicButton({
        mode: 'fail',
        text: message,
      });
      break;
  }
};

function CheckFile(options) {
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
}

function CheckFileUpdate(options) {
  options = extend(
    {
      dataContent: '',
    },
    options,
  );
  try {
    const dataContent = JSON.parse(options.dataContent);

    // localStorage.setItem('versionSbotics', dataUpdate['version']);

    // MODO DO FORCE INSTALL QUE VEM DIRETAMENTE DO ARQUIVO
    // const forceInstall = ForceInstallManager({
    //   forceInstall: dataUpdate['force'],
    //   newSboticsVersion: dataUpdate['version'],
    // });

    progressBar.clear();
    progressBar.styleHeight('large');

    let filesID = dataContent['data'].length + 1;
    let filesFind = 0;
    let filesNotFind = 0;

    dataContent['data'].map((dataContent) => {
      const fileID = --filesID;

      progressBar.create({
        percentage: 5,
        id: fileID,
        state: 'info',
        grid: false,
      });

      //   progressBar.update({
      //     percentage: 100,
      //     id: fileID,
      //     state: 'success',
      //   });

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
    // return {
    //   filesFind: filesFind,
    //   filesNotFind: filesNotFind,
    //   dataUpdateFiles: dataUpdateFilesSize,
    //   forceInstall: forceInstall,
    // };
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function FilesVerification(options) {
  progressBar.clear();

  options = extend(
    {
      modeText: '',
      autoOpen: false,
      autoInstall: false,
      installCheck: false,
      typeModel: '',
    },
    options,
  );

  const modeText = options.modeText;
  const autoOpen = options.autoOpen;
  const autoInstall = options.autoInstall;
  const installCheck = options.installCheck;
  const typeModel = options.typeModel;

  new MagicButton({
    mode: 'process',
    text: modeText,
  });

  if (!dataContent) {
    return FailDownload({
      message: 'Fracasso! Ao procurar por atualização do sBotics',
    });
  }

  const checkFileUpdate = CheckFileUpdate({ dataContent: dataContent });

  if (!checkFileUpdate) {
    return FailDownload({
      message: 'Fracasso! Ao verificar arquivos sBotics.',
    });
  }

  const filesFind = checkFileUpdate.filesFind;
  const dataUpdateFiles = checkFileUpdate.dataUpdateFiles;

  if (filesFind == dataUpdateFiles) {
    if (autoOpen) {
      application.OpenSbotics();
    } else {
      new MagicButton({
        mode: 'start',
      });

      if (installCheck) {
        switch (typeModel) {
          case 'install':
            alert.createTop({
              states: 'success',
              message: `${message} - sBotics instalado com sucesso! Pronto para abrir.`,
            });
            break;
          case 'update':
            alert.createTop({
              states: 'success',
              message: `${message} - sBotics atualizado com sucesso! Pronto para abrir.`,
            });
            break;
        }
      }
    }
  } else {
    if (autoInstall)
      DownloadsBotics({
        modeText: Lang('Installing sBotics! Please wait...'),
        type: 'install',
      });
    else {
      if (filesFind > 0) {
        MagicButton({
          mode: 'update',
        });
      } else {
        new MagicButton({
          mode: 'install',
        });
      }
    }
  }
}

function start(options) {
  options = extend(
    {
      name: '',
      type: '',
      version: '',
      content: '',
      patch_notes: '',
    },
    options,
  );

  const name = options.name;
  const type = options.type;
  const version = options.version;
  const content = options.content;

  const patch_notes = options.patch_notes.filter(
    (object) => object.language == application.getLocale(),
  )[0];

  const configs = fileConfig.open();
  const versionInstalled = configs.sBoticsVersionInstalled;

  PatchNotes(
    version,
    !versionInstalled || versionInstalled != version,
    markdown.render(patch_notes.line_text),
  );

  if (!versionInstalled || versionInstalled != version) {
    new MagicButton({
      mode: 'install',
    });
  } else {
    new MagicButton({
      mode: 'process',
      text: 'Verificando Integridade dos Arquivos...',
    });
  }
}

export async function LoadingDownloadController() {
  progressBar.activate();
  progressBar.styleHeight('default');
  progressBar.clear();

  new MagicButton({
    mode: 'process',
    text: 'Procurando Atualização...',
  });

  connection
    .getRelease({ platform: application.getOSText() })
    .then(function (response) {
      try {
        const data = response.data;
        dataContent = data.content;
        start({
          name: data.name,
          type: data.type,
          version: data.version,
          content: JSON.parse(data.content),
          patch_notes: data.patch_notes,
        });
      } catch (error) {
        new Exception().create({
          status: 514,
          error_name: error.name,
          error_message: error.message,
        });
      }
    })
    .catch(function (error) {
      try {
        if (error.response) {
          new Exception().create({
            status: error.response.status,
            message: `sBotics Release | ${error.response.data.message}`,
          });
        } else {
          new Exception().create({
            status: error.toJSON()['name'],
            message: error.toJSON()['message'],
          });
        }
      } catch (error) {
        new Exception().create({
          status: 513,
          error_name: error.name,
          error_message: error.message,
        });
      }
    });
}

window.OpenInstallFolder = function OpenInstallFolder() {
  if (FindSync('sBotics/')) {
    application.openInstallFolder();
  } else {
    FilesVerification({
      modeText: 'Procurando atualização! Por favor, espere...',
    });
    swal
      .fire({
        icon: 'error',
        title: 'Falhou para abrir!',
        text: 'Pasta de instalação não encontrada! Tente instalar novamente.',
        showCancelButton: false,
        confirmButtonText: 'Instalar sBotics',
      })
      .then((result) => {
        if (result.isConfirmed) {
          console.log('Instalando o sBotics! Por favor, espere...');
          // DownloadsBotics({
          //   modeText: Lang('Instalando o sBotics! Por favor, espere...'),
          //   type: 'install',
          // });
        }
      });
  }
};

window.MagicButtonAction = function MagicButtonAction(action) {
  switch (action) {
    case 'install':
      break;

    default:
      break;
  }
};
