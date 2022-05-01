let extend = require('extend-shallow');
let hljs = require('highlight.js');
let swal = require('sweetalert2');
let Downloader = require('nodejs-file-downloader');
let fs = require('fs-extra');
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
import { ExtractSync, FileSizeSync, FindSync } from '../utils/files-manager.js';
import { ProgressBar } from '../class/__instance_progress_bar.js';
import { Time } from '../class/__instance_time.js';

let alert = new Alerts();
let connection = new Connection();
let application = new Application();
let fileConfig = new FileConfig();
let progressBar = new ProgressBar();
let time = new Time();

let dataContent = null;
let dataVersion = null;

// ===========================

function BlackList() {
  return [''];
}

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

  const backupConfig = true;

  return new Promise((resolve, reject) => {
    if (
      CheckFile({
        path: path,
        name: name,
        size: size,
        lastUpdatedAt: lastUpdatedAt,
      })
    ) {
      return resolve({ state: 'ok', id: id });
    }

    (async () => {
      // REVISAR - Se o item estiver na blacklist faz backup do mesmo
      //   if (BlackList().indexOf(`Applications/sBotics_simulation/${path + name}`) > -1) {
      //     CreateBackupStreamingAssets({
      //       fileName: name,
      //       backupConfig: backupConfig,
      //     });
      //   }

      //   AddEvent(id, path + name);  REVISAR - Adiciona um evento ao relatorio
      const downloader = new Downloader({
        url: pathURL,
        directory: application.getFolderPathSboticsSimulation() + '/' + path,
        fileName: name,
        cloneFiles: false,
        maxAttempts: 5,
        timeout: 50000,
        onProgress: function (percentage, chunk, remainingSize) {
          //   UpdateEventParcent(id, percentage); REVISAR - Atualiza a porcentagem do evento no ralatorio
          progressBar.update({
            percentage: percentage,
            id: id,
            state: 'success',
          });
        },
        shouldStop: function (error) {
          if (application.SLMP()) {
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
        // StreamingAssets({
        //   fileName: name,
        //   backupConfig: backupConfig,
        // });
        if (format == 'zip') {
          if (ExtractSync('Applications/sBotics_simulation/' + path + name)) {
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

const DownloadsBoticsEvent = (options) => {
  options = extend(
    {
      dataContent: '',
      type: '',
    },
    options,
  );

  const data = options.dataContent;

  const dataUpdateLength = data['data'].length;
  var filesID = dataUpdateLength + 1;
  var filesPast = 0;
  var success = 0;

  data['data'].map((dataContent) => {
    const fileID = --filesID;
    progressBar.create({
      percentage: 5,
      id: fileID,
      state: 'info',
      grid: true,
    });
    DownloadsUpdate({
      path: dataContent.path,
      pathURL: dataContent.download,
      name: dataContent.name,
      size: dataContent.size,
      prefix: `${application.getOSFolder()}/`,
      id: fileID,
      format: dataContent.format,
      lastUpdatedAt: dataContent.last_updated_at,
    })
      .then((resp) => {
        success = success + 1;
        if (resp.state == 'ok') {
          progressBar.update({
            percentage: 100,
            id: resp.id,
            state: 'fileOK',
          });
        } else if (resp.state == 'update') {
          // console.log(dataUpdate.path + dataUpdate.name);
          progressBar.update({
            percentage: 100,
            id: resp.id,
            state: 'success',
          });
        } else {
          progressBar.update({
            percentage: 100,
            id: resp.id,
            state: 'danger',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        progressBar.update({
          percentage: 100,
          id: err.id,
          state: 'danger',
        });
      })
      .then(() => {
        filesPast = filesPast + 1;
        if (filesPast == dataUpdateLength)
          if (success != filesPast)
            FailDownload({
              message:
                'Falha ao instalar o sBotics! Verifique a sua conexão com a internet.',
            });
          else {
            FilesVerification({
              autoInstall: true,
              modeText: 'Procurando atualização! Por favor, espere...',
              installCheck: true,
              typeModel: options.type,
            });
          }
      });
  });
};

const DownloadsBotics = async (options) => {
  progressBar.clear();
  //  ClearEvent(); - Limpa o historico de download
  //  ReportDownloadButton(true); - Ativa o relatorio de download

  options = extend(
    {
      modeText: '',
      type: '',
    },
    options,
  );

  const modeText = options.modeText;
  const type = options.type;
  let dataContentDownload = JSON.parse(dataContent);

  new MagicButton({
    mode: 'process',
    text: modeText,
  });

  if (!dataContentDownload) {
    return FailDownload({
      message: 'Falha no Download! Ao procurar por atualização do sBotics.',
    });
  }

  const forceInstall = dataContentDownload['force'];

  try {
    if (forceInstall == true) {
      if (FindSync('Applications/sBotics_simulation/')) {
        fs.remove(application.getFolderPathSboticsSimulation())
          .then(() => {
            return DownloadsBoticsEvent({
              dataContent: dataContentDownload,
              type: type,
            });
          })
          .catch((err) => {
            return DownloadsBoticsEvent({
              dataContent: dataContentDownload,
              type: type,
            });
          });
      } else {
        return DownloadsBoticsEvent({
          dataContent: dataContentDownload,
          type: type,
        });
      }
    }
    return DownloadsBoticsEvent({
      dataContent: dataContentDownload,
      type: type,
    });
  } catch (error) {
    return FailDownload({ message: `Falha no Download! - ${error}` });
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
  const pathDownload = `Applications/sBotics_simulation/${path + name}`;
  const forceInstall = options.forceInstall;

  if (forceInstall == true) {
    if (FileSizeSync(pathDownload).size != size) {
      return BlackList().indexOf(pathDownload) > -1;
    }
    return false;
  }

  if (FindSync(pathDownload)) {
    if (
      time.ParseTime(lastUpdatedAt) >=
      Math.floor(FileSizeSync(pathDownload).mtimeMs)
    ) {
      return BlackList().indexOf(pathDownload) > -1;
    } else if (FileSizeSync(pathDownload).size != size) {
      return BlackList().indexOf(pathDownload) > -1;
    }
    return true;
  }

  return false;
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

    const forceInstall = dataContent['force'];

    progressBar.clear();
    progressBar.styleHeight('large');

    let dataUpdateFiles = dataContent['data'].length;
    let filesID = dataUpdateFiles + 1;
    let filesFind = 0;
    let filesNotFind = 0;

    dataContent['data'].map((dataContent) => {
      const fileID = --filesID;

      progressBar.create({
        percentage: 5,
        id: fileID,
        state: 'info',
        grid: true,
      });

      if (
        CheckFile({
          path: dataContent.path,
          name: dataContent.name,
          size: dataContent.size,
          lastUpdatedAt: dataContent.last_updated_at,
          forceInstall: forceInstall,
        })
      ) {
        setTimeout(() => {
          progressBar.update({
            percentage: 100,
            id: fileID,
            state: 'fileOK',
          });
        }, 10);
        filesFind = filesFind + 1;
      } else {
        setTimeout(() => {
          progressBar.update({
            percentage: 100,
            id: fileID,
            state: 'warning',
          });
        }, 10);
        filesNotFind = filesNotFind + 1;
      }
    });
    return {
      filesFind: filesFind,
      filesNotFind: filesNotFind,
      forceInstall: forceInstall,
      dataUpdateFiles: dataUpdateFiles,
    };
  } catch (error) {
    console.error(error);
    new Exception().create({
      status: 515,
      error_name: error.name,
      error_message: error.message,
    });
  }
}

async function FilesVerification(options) {
  progressBar.clear();
  progressBar.activate();

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
  console.log(checkFileUpdate);
  if (!checkFileUpdate) {
    return FailDownload({
      message: 'Fracasso! Ao verificar arquivos sBotics.',
    });
  }

  const configs = fileConfig.open();
  const versionInstalled = configs.sBoticsVersionInstalled;
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
        fileConfig.create({
          data: {
            sBoticsVersionInstalled: dataVersion,
          },
        });
        switch (typeModel) {
          case 'install':
            alert.createTop({
              states: 'success',
              message: 'sBotics instalado com sucesso! Pronto para abrir.',
            });
            setTimeout(() => {
              progressBar.disable({ clear: true });
            }, 100);
            break;
          case 'update':
            alert.createTop({
              states: 'success',
              message: 'sBotics atualizado com sucesso! Pronto para abrir.',
            });
            setTimeout(() => {
              progressBar.disable({ clear: true });
            }, 100);
            break;
          case 'repair_installation':
            alert.createTop({
              states: 'success',
              message: 'sBotics reparado com sucesso! Pronto para abrir.',
            });
            setTimeout(() => {
              progressBar.disable({ clear: true });
            }, 100);
            break;
        }
      }
    }
  } else {
    // Verificar se a versão instalada é a mesma da versão da att
    if (versionInstalled != dataVersion && filesFind > 0) {
      // Atualizar
      if (autoInstall) {
        setTimeout(() => {
          DownloadsBotics({
            modeText: 'Atualizando o sBotics! Por favor, espere...',
            type: 'update',
          });
        }, 500);
      } else {
        new MagicButton({
          mode: 'update',
        });
      }
    } else if (filesFind == 0) {
      // Instalar
      if (autoInstall) {
        setTimeout(() => {
          DownloadsBotics({
            modeText: 'Instalando o sBotics! Por favor, espere...',
            type: 'install',
          });
        }, 500);
      } else {
        new MagicButton({
          mode: 'install',
        });
      }
    } else {
      // Recuperar
      if (autoInstall) {
        setTimeout(() => {
          DownloadsBotics({
            modeText: 'Instalando o sBotics! Por favor, espere...',
            type: 'repair_installation',
          });
        }, 500);
      } else {
        new MagicButton({
          mode: 'repair_installation',
        });
      }
    }
  }
}
let hasExec = false;
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

  const configs = fileConfig.open();
  const versionInstalled = configs.sBoticsVersionInstalled;

  const patch_notes = options.patch_notes.filter(
    (object) => object.language == application.getLocale(),
  )[0];

  PatchNotes(
    version,
    !versionInstalled || versionInstalled != version,
    markdown.render(patch_notes.line_text),
  );

  if (!hasExec) {
    FilesVerification({
      modeText: 'Procurando atualização! Por favor, espere...',
    });
    hasExec = true;
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
        dataVersion = data.version;
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
  if (FindSync('Applications/sBotics_simulation/')) {
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
          DownloadsBotics({
            modeText: 'Instalando o sBotics! Por favor, espere...',
            type: 'install',
          });
        }
      });
  }
};

window.MagicButton = function MagicButton(mode, state) {
  if (!state) return;
  switch (mode) {
    case 'install':
      DownloadsBotics({
        modeText: 'Instalando o sBotics! Por favor, espere...',
        type: 'install',
      });
      break;
    case 'update':
      DownloadsBotics({
        modeText: 'Atualizando o sBotics! Por favor, espere...',
        type: 'update',
      });
      break;
    case 'repair_installation':
      DownloadsBotics({
        modeText: 'Reparando o sBotics! Por favor, espere...',
        type: 'repair_installation',
      });
      break;
    case 'start':
      FilesVerification({
        modelText:
          'Verificando a integridade do arquivo para abrir o sBotics! Por favor, espere...',
        autoOpen: true,
      });
      break;
    default:
      break;
  }
};
