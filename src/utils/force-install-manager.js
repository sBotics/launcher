import { OpenConfig, UpdateConfig } from '../class/__file_config.js';
import { StringToBoolean } from './conver-data.js';

var extend = require('extend-shallow');

const ForceInstallManager = (options) => {
  options = extend(
    {
      forceInstall: '',
      newSboticsVersion: '',
      currentSboticsVersion: '',
    },
    options,
  );

  if (!options.forceInstall && !options.newSboticsVersion) return false;

  const forceInstall = StringToBoolean(options.forceInstall);
  const currentSboticsVersion = localStorage.getItem('currentSboticsVersion');
  const newSboticsVersion = options.newSboticsVersion;

  return currentSboticsVersion != newSboticsVersion && forceInstall
    ? true
    : false;
};

export { ForceInstallManager };
