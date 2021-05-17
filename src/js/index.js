const axios = require('axios');
const luxon = require('luxon');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
var child = require('child_process').spawn;

axios.defaults.adapter = require('axios/lib/adapters/http');

const { ipcRenderer } = require('electron');
const util = require('util');
const unziper = require('@xmcl/unzip');
const exec = util.promisify(require('child_process').exec);
const states = {
  verifying: 1,
  downloading: 2,
  done: 3,
  toDownload: 4,
};
const filesToDownload = [];
var state = states.verifying;
var UserOs;
var FolderPath;
var currentProgress = 0;
var deltaProgress;
var localsystem = {};

let config;
let translation;

localStorage.setItem('repairSystem', 'false');

const PatchNote = () => {
  console.log('Patch_Note');
  axios
    .get(translation['URL_PATCHNOTE'])
    .then(function (response) {
      // handle success
      const PatchNoteAdd = response['data']['add'];
      const PatchNoteImprovement = response['data']['improvement'];
      const PatchNoteRemoved = response['data']['removed'];

      var DataPatchNoteAdd = '';
      for (let i = 0; i < PatchNoteAdd.length; i++) {
        const e = PatchNoteAdd[i];
        DataPatchNoteAdd += `<add>${e}</add>`;
      }

      for (let i = 0; i < PatchNoteImprovement.length; i++) {
        const e = PatchNoteImprovement[i];
        DataPatchNoteAdd += `<change>${e}</change>`;
      }

      for (let i = 0; i < PatchNoteRemoved.length; i++) {
        const e = PatchNoteRemoved[i];
        DataPatchNoteAdd += `<remove>${e}</remove>`;
      }

      document.getElementById(
        'PatchNoteContainer',
      ).innerHTML = DataPatchNoteAdd;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
const VersionUpdate = () => {
  axios
    .get('https://raw.githubusercontent.com/sBotics/builds/main/data.json')
    .then(function (response) {
      // handle success
      $('#Text_Version').text(
        translation['TEXT_VERSION'] + ' ' + response['data']['version'],
      );
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
const SetStrings = () => {
  $('#updateButton').text(translation['UPDATE']);
  $('#Or').text(translation['OR']);
  $('#OpenFolder').html(
    `<i class="fas fa-folder-open mr-2"></i>` + translation['OPEN_FOLDER'],
  );
  $('#Path_Note_Description').text(translation['DESCRIPTION_SBOTICS']);
  $('#Text_Last_Version').text(translation['TEXT_LAST_VERSION']);
  $('#Text_Description').text(translation['TEXT_DESCRIPTION']);
  VersionUpdate();
  PatchNote();
};

const LoadStrings = () => {
  translation = ipcRenderer.sendSync('get-locale');
  SetStrings();
};

const AlertMessage = async () => {
  const { data } = await axios.get(
    'https://raw.githubusercontent.com/sBotics/launcher/main/alerts.json',
  );
  if (data[config.lang] != '' && config.lang in data) {
    $('#alerta_msg').text(`${data[config.lang]}`);
    $('#alerta_div').css('display', 'flex');
  }
};

$(document).on('ready', () => {
  config = ipcRenderer.sendSync('get-config');
  LoadStrings();
  AlertMessage();
});

document.getElementById('tutorial').addEventListener('click', OpenTutorial);

document.getElementById('cboticsButton').addEventListener('click', ShowCbotics);
document.getElementById('logoimg').addEventListener('click', ShowLauncher);

function ShowCbotics() {
  document.getElementById('cbotics').style.display = 'block';
  document.getElementById('sbotics').style.display = 'none';
}

function ShowLauncher() {
  document.getElementById('cbotics').style.display = 'none';
  document.getElementById('sbotics').style.display = 'inherit';
}

function OpenTutorial() {
  ipcRenderer.send('open-tutorial');
}

function OpenConfig() {
  ipcRenderer.send('open-config');
}

function Close() {
  ipcRenderer.send('fim');
}

function reload() {
  ipcRenderer.send('reload');
}

ipcRenderer.on('config-opened', (ev) => {
  $('#overlay').addClass('overlay');
});
ipcRenderer.on('config-closed', (ev) => {
  $('#overlay').removeClass('overlay');
});

// document.getElementById("overlay").addEventListener("click", function() {
//     $("#overlay").removeClass("overlay");
//     ipcRenderer.send("close-config");
// });

ipcRenderer.on('reload-lang', (ev, arg) => {
  translation = arg;
  SetStrings();
});

ipcRenderer.on('set-config', (ev, arg) => {
  config = arg;
});
document.getElementById('settings').addEventListener('click', OpenConfig);
$('#OpenFolder').on('click', (ev) => {
  ipcRenderer.send('open-install-folder');
});

$('.close-button').on('click', (ev) => {
  ipcRenderer.send('end');
});

///

const RecursiveMkdir = (pathToCreate) => {
  var subpaths = pathToCreate.split(path.sep);
  if (subpaths[0] == '') {
    subpaths[0] = '/';
  }
  var new_array;
  for (var i = 1; i < subpaths.length + 1; i++) {
    new_array = subpaths.slice(0, i);
    new_array = new_array.join(path.sep);
    if (!fs.existsSync(new_array)) {
      fs.mkdirSync(new_array);
    }
  }
};

const DetectOs = () => {
  const platforms = {
    win32: 'W',
    darwin: 'mac',
    linux: 'Linux',
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};
const DetectArch = () => process.arch;

const GetFolder = () => {
  var ret;
  switch (UserOs) {
    case 'mac':
      ret = 'mac';
      break;
    case 'W':
      if (DetectArch() == 'x64') {
        ret = 'W64';
      } else {
        ret = 'W32';
      }
      break;
    case 'Linux':
      if (DetectArch() == 'x64') {
        ret = 'Linux AMD64';
      } else {
        ret = 'Linux i386';
      }
      break;
  }
  return ret;
};
const getFilesizeInBytes = (filepath) => {
  var stats = fs.statSync(filepath);
  var fileSizeInBytes = stats['size'];
  return fileSizeInBytes;
};
const ParseTime = (filedate) => {
  var year = parseInt(filedate.slice(0, 4));
  var month = parseInt(filedate.slice(5, 7));
  var day = parseInt(filedate.slice(8, 10));
  var hour = parseInt(filedate.slice(11, 13));
  var minute = parseInt(filedate.slice(14, 16));
  var second = parseInt(filedate.slice(17, 19));
  var date = luxon.DateTime.utc(year, month, day, hour, minute, second);
  return date.toMillis();
};

const download = async (url, pathe, filename) => {
  var u_path = path.join(config.downloadPath, pathe);
  if (!fs.existsSync(u_path)) {
    RecursiveMkdir(u_path);
  }
  u_path = path.join(u_path, filename);
  const writer = fs.createWriteStream(u_path);
  await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  }).then(function (response) {
    response.data.pipe(writer);
  });
  writer.on('finish', function () {
    writer.close();
  });

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const unzip = async (pathe, filepath) => {
  console.log(pathe);
  if (fs.existsSync(pathe.replace('.zip', '')))
    fs.unlinkSync(pathe.replace('.zip', ''));
  try {
    var readpath = pathe;
    var finalpath = path.join(config.downloadPath, filepath);
    await unziper.extract(readpath, finalpath);
  } catch (e) {
    console.log(e);
  }
};

const CheckFile = (file_path, file) => {
  try {
    return (
      !fs.existsSync(file_path) ||
      localsystem[file_path].downloaded < ParseTime(file.last_updated_at) ||
      getFilesizeInBytes(file_path) != file.size
    );
  } catch {
    return false;
  }
};

const Update = async () => {
  $('#updateButton').text(`${translation['UPDATING']}`);

  const config_path = path.join(config.downloadPath, 'config.json');
  deltaProgress = 100 / filesToDownload.length;
  currentProgress = 0;
  while (filesToDownload.length > 0) {
    const file = filesToDownload.shift();
    const file_path = path.join(config.downloadPath, file.path, file.name);
    try {
      console.log('vai baixar ' + file.name);

      await download(file.download, file.path, file.name);
      console.log('baixou ' + file.name);
    } catch {
      if (fs.existsSync(file_path)) {
        fs.unlinkSync(file_path);
      }
      await download(file.download, file.path, file.name);
      if (file.format == 'zip') {
        await unzip(file_path, file.path);
      }
      localsystem[file_path] = {
        downloaded: luxon.DateTime.local().toUTC().toMillis(),
      };
      localsystem['seses'] = luxon.DateTime.local().toUTC().toMillis();
      fs.writeFileSync(config_path, JSON.stringify(localsystem));
    }

    if (file.format == 'zip') {
      await unzip(file_path, file.path);
    }
    localsystem[file_path] = {
      downloaded: luxon.DateTime.local().toUTC().toMillis(),
    };
    localsystem['seses'] = luxon.DateTime.local().toUTC().toMillis();
    fs.writeFileSync(config_path, JSON.stringify(localsystem));
    currentProgress += deltaProgress;
    attLoading();
  }
  localsystem['seses'] = luxon.DateTime.local().toUTC().toMillis();
  fs.writeFileSync(config_path, JSON.stringify(localsystem));
  state = states.done;
  $('#updateButton').text(`${translation['PLAY']}`);
};

const verify = async (res) => {
  $('.progress .progress-bar').css('background-color', '#2fa9c1');
  $('#updateButton').text(translation['VERIFYING']);
  // if (res.data.version != ver) {
  //   var conf = path.join(config.downloadPath, "download.json");
  //   var whattowr = { download_link: obj.download_link };
  //   fs.writeFileSync(conf, JSON.stringify(whattowr));

  //   ipcRenderer.sendSync("deprecated");
  //   return;
  // }
  document.getElementById('updateButton').classList.remove('btn-danger');
  document.getElementById('updateButton').classList.add('btn-success');
  try {
    const data = res.data.data;
    deltaProgress = 100 / data.length;

    const config_path = path.join(config.downloadPath, 'config.json');
    if (!fs.existsSync(path.join(config.downloadPath))) {
      RecursiveMkdir(path.join(config.downloadPath));
    }

    if (!fs.existsSync(config_path)) {
      fs.writeFileSync(config_path, JSON.stringify(localsystem));
    } else {
      localsystem = JSON.parse(fs.readFileSync(config_path));
    }

    var file_path;
    let bytes = 0;
    data.map((file) => {
      file_path = path.join(config.downloadPath, file.path, file.name);
      if (CheckFile(file_path, file)) {
        filesToDownload.push(file);
        bytes += file.size;
      }
      currentProgress += deltaProgress;
      attLoading();
    });
    const mb = (bytes / 1024 / 1024).toLocaleString('en-us', {
      maximumFractionDigits: 2,
    });

    setTimeout(() => {
      if (filesToDownload.length == 0) {
        state = states.done;
        $('#updateButton').text(`${translation['PLAY']}`);
      } else {
        state = states.toDownload;
        $('.progress-bar').get(0).style.setProperty('--progress', '0%');
        $('.progress .progress-bar').css('background-color', 'var(--success)');
        $('#updateButton').text(`${translation['UPDATE']} (${mb} mb)`);
      }
    }, 1500);
  } catch (error) {
    console.log(error);
    $('#updateButton').text(`${translation['ERROR_VERIFICATION']}`);
    state = states.repair;
    document.getElementById('updateButton').classList.add('btn-danger');
    document.getElementById('updateButton').classList.remove('btn-success');
  }
};

function Finalizar(error, stdout, stderr) {
  ipcRenderer.send('fim');
}
UserOs = DetectOs();
FolderPath = GetFolder();

axios
  .get(
    'https://raw.githubusercontent.com/sBotics/sBoticsBuilds/master/' +
      FolderPath +
      '.json',
  )
  .then(verify);

$('#updateButton').on('click', () => {
  if (state == states.verifying || state == states.downloading) return;
  else if (state == states.toDownload) {
    Update();
    state = states.downloading;
  } else if (state == states.done) {
    StartSim();
  } else if (state == states.error) {
    repararIntalacao();
  }
});

const StartSim = () => {
  var string_execute;
  switch (FolderPath) {
    case 'mac':
      string_execute = path.join(
        config.downloadPath,
        'sBotics.app',
        'Contents',
        'MacOS',
        'sBotics',
      );
      break;
    case 'W64':
      string_execute = path.join(config.downloadPath, 'sBotics.exe');
      break;
    case 'W32':
      string_execute = path.join(config.downloadPath, 'sBotics.exe');
      break;

    case 'Linux AMD64':
      string_execute = path.join(config.downloadPath, 'sBotics.x86_64');
      break;
  }

  if (FolderPath.includes('Linux')) {
    fs.chmodSync(path.join(config.downloadPath, 'sBotics.x86_64'), 0o777);
  }

  if (FolderPath.includes('mac')) {
    fs.chmodSync(
      path.join(
        config.downloadPath,
        'sBotics.app',
        'Contents',
        'MacOS',
        'sBotics',
      ),
      0o777,
    );
  }

  var executablePath = string_execute;
  var parameters = ['-lang', config.lang];

  child(executablePath, parameters, { detached: true });
  ipcRenderer.send('end');
};

function attLoading() {
  $('.progress-bar')
    .get(0)
    .style.setProperty('--progress', `${currentProgress}%`);
}

function repararIntalacao() {
  console.log('Apagando Tudo da pasta sBotics!');
  fs.remove(config.downloadPath)
    .then(() => {
      console.log('success!');
      axios
        .get(
          'https://raw.githubusercontent.com/sBotics/sBoticsBuilds/master/' +
            FolderPath +
            '.json',
        )
        .then(verify);
    })
    .catch((err) => {
      console.error(err);
    });
}

setInterval(() => {
  const repaiurSystem = localStorage.getItem('repairSystem');
  if (repaiurSystem == 'true') {
    localStorage.setItem('repairSystem', 'false');
    axios
      .get(
        'https://raw.githubusercontent.com/sBotics/sBoticsBuilds/master/' +
          FolderPath +
          '.json',
      )
      .then(verify);
  }

  const configClose = ipcRenderer.sendSync('close-config_mode');
  if (configClose == true) {
    $('#overlay').removeClass('overlay');
    ipcRenderer.send('close-config');
  }
}, 300);
