var geoLocalization = require('geoip-lite');
import { URLdictionary, DataRequest } from '../utils/connection-manager.js';

const GeoFinder = async () => {
  const dataRequest = await DataRequest({
    url: URLdictionary['MyIP'],
  });
  return new Promise((resolve, reject) => {
    if (!dataRequest) reject(false);
    resolve(geoLocalization.lookup(dataRequest));
  });
};

export { GeoFinder };
