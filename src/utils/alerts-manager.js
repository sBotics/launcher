import { OpenConfig } from '../class/__file_config.js';
import { URLdictionary, DataRequest } from '../utils/connection-manager.js';
import { GeoFinder } from './geo-manager.js';
import { CreateTopAlert } from './top-alert.js';

const CheckAlertGenerator = (data) => {
  CreateTopAlert({
    states: data.type,
    html: data.html,
    message: data.message,
    idInner: 'Alert__1',
    fixed: data.fixed,
    icon: data.icon,
  });
};

const CheckAlerts = async () => {
  const openConfig = OpenConfig();
  const geoFinder = await GeoFinder();
  const dataRequest = await DataRequest({
    url: `${URLdictionary['Alert']}${openConfig['language']}.json`,
  });
  dataRequest.map((data) => {
    console.log(data);
    CheckAlertGenerator(data);
  });
};

export { CheckAlerts };
