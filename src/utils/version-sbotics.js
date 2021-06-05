import { DetectOsText } from '../utils/application-manager.js';
import { DataRequest, URLdictionary } from '../utils/connection-manager.js';

const VersionSbotics = () => {
  return new Promise((resolve, reject) => {
    DataRequest({ url: URLdictionary['DataGithub'] })
      .then((response) => {
        return resolve(response['versions'][DetectOsText()]);
      })
      .catch((error) => {
        return reject(false);
      });
  });
};

export { VersionSbotics };
