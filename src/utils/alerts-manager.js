import { OpenConfig } from '../class/__file_config.js';
import { URLdictionary, DataRequest } from '../utils/connection-manager.js';
import { GeoFinder } from './geo-manager.js';
import { CreateTopAlert } from './top-alert.js';

const CheckAlertGenerator = (data) => {
    CreateTopAlert({
        states: data.type,
        html: data.html,
        message: data.message,
        idInner: '',
        fixed: data.fixed,
        icon: data.icon,
        timeOutVIew: data.hiddenTime ? data.hiddenTime : 0,
    });
};

const CheckAlerts = async() => {
    const openConfig = OpenConfig();
    const geoFinder = await GeoFinder();
    const dataRequest = await DataRequest({
        url: `${URLdictionary['Alert']}${openConfig['language']}.json`,
    });
    dataRequest.map((data) => {
        if (!data['state']) return;
        const locales = data.locales.length != 0 ? data.locales : false;
        const regions = data.regions.length != 0 ? data.regions : false;
        if (!locales && !regions) return CheckAlertGenerator(data);
        locales.map((dataL) => {
            if (dataL == geoFinder['country']) {
                if (!regions) return CheckAlertGenerator(data);
                regions.map((dataR) => {
                    if (dataR == geoFinder['region']) CheckAlertGenerator(data);
                });
            }
        });
    });
};

export { CheckAlerts };