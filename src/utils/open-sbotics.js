import {
  folderPathGsBotics,
  DetecOSFolder,
} from '../utils/application-manager.js';
import { OpenConfig } from '../class/__file_config.js';
import { OpenUserFile } from '../class/__file_user.js';
const path = require('path');
const url = require('url');
var child = require('child_process').spawn;

const OpenSbotics = () => {
  var string_execute;
  const fileConfig = OpenConfig();
  const fileUser = OpenUserFile();
  switch (DetecOSFolder()) {
    case 'mac':
      string_execute = path.join(
        folderPathGsBotics(),
        'sBotics.app',
        'Contents',
        'MacOS',
        'sBotics',
      );
      break;
    case 'W32':
      string_execute = path.join(folderPathGsBotics(), 'sBotics.exe');
      break;
    case 'Linux AMD64':
      string_execute = path.join(folderPathGsBotics(), 'sBotics.x86_64');
      break;
  }
  if (DetecOSFolder().includes('Linux')) {
    fs.chmodSync(path.join(folderPathGsBotics(), 'sBotics.x86_64'), 0o777);
  }
  if (DetecOSFolder().includes('mac')) {
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
  }
  var executablePath = string_execute;
  var parameters = ['--lang', fileConfig['languageSimulator'], '--auth_token', fileUser['accessToken']];
  child(executablePath, parameters, { detached: true });
};
export { OpenSbotics };
