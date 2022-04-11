require('dotenv').config();
import { notarize } from 'electron-notarize';

const _default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    const appName = context.packager.appInfo.productFilename;

    if (electronPlatformName !== 'darwin') {
        return;
    }

    return await notarize({
        appBundleId: 'com.jgraph.drawio.desktop',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: "",
        appleIdPassword: "",
    });
};
export { _default as default };