import {
  folderPathGsBotics,
  DetecOSFolder,
  folderPathBlockEduc,
} from '../utils/application-manager.js';
import { OpenConfig } from '../class/__file_config.js';
import { OpenUserFile } from '../class/__file_user.js';
import { IndexClose } from '../utils/window-manager.js';
const path = require('path');
var child = require('child_process').spawn;
const fs = require('fs-extra');
const os = require('os');

const OpenSbotics = () => {
  var string_execute;
  const fileConfig = OpenConfig();
  const fileUser = OpenUserFile();
  switch (DetecOSFolder()) {
    case 'macOS':
      string_execute = path.join(
        folderPathGsBotics(),
        'sBotics.app',
        'Contents',
        'MacOS',
        'sBotics',
      );
      break;
    case 'Windows':
      string_execute = path.join(folderPathGsBotics(), 'sBotics.exe');
      break;
    case 'Linux':
      string_execute = path.join(folderPathGsBotics(), 'sBotics.x86_64');
      break;
  }
  if (DetecOSFolder().includes('Linux')) {
    fs.chmodSync(path.join(folderPathGsBotics(), 'sBotics.x86_64'), 0o777);
    fs.chmodSync(
      path.join(os.homedir() + folderPathBlockEduc(), 'BlockEduc.AppImage'),
      0o777,
    );
  }
  if (DetecOSFolder().includes('macOS')) {
    fs.chmodSync(
      path.join(
        folderPathGsBotics(),
        'sBotics.app',
        'Contents',
        'MacOS',
        'sBotics',
      ),
      0o777,
    );
    fs.chmodSync(
      path.join(os.homedir() + folderPathBlockEduc(), 'BlockEduc.app'),
      0o777,
    );
  }
  var executablePath = string_execute;
  const languageAvarible = ['pt_BR'];
  const lang =
    languageAvarible.indexOf(fileConfig['languageSimulator']) > -1
      ? 'pt_BR'
      : 'en';
  var parameters = ['--lang', lang, '--auth_token', fileUser['accessToken']];
  child(executablePath, parameters, { detached: true });
  IndexClose();
};

export { OpenSbotics };
