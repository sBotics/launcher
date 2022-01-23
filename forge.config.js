const path = require('path');
const iconDir = path.resolve(__dirname, 'assets', 'icons', 'app');

const commonLinuxConfig = {
    icon: {
        scalable: path.resolve(iconDir, 'icon.svg'),
    },
    mimeType: ['x-scheme-handler/sbotics'],
};

const config = {
    packagerConfig: {
        name: 'sBotics',
        executableName: 'sbotics',
        asar: true,
        icon: path.resolve(__dirname, 'assets', 'icons', 'app', 'icon'),
        appBundleId: 'com.sbotics.launcher',
        usageDescription: [],
        appCategoryType: 'public.app-category.developer-tools',
        protocols: [{
            name: 'sBotics Launcher Launch Protocol',
            schemes: ['sbotics'],
        }],
        win32metadata: {
            CompanyName: 'sBotics',
            OriginalFilename: 'sBotics',
        },
        osxSign: {
            identity: 'Developer ID Application: sBotics',
            hardenedRuntime: true,
            'gatekeeper-assess': false,
            entitlements: 'static/entitlements.plist',
            'entitlements-inherit': 'static/entitlements.plist',
            'signature-flags': 'library',
        },
    },
    makers: [{
            name: '@electron-forge/maker-squirrel',
            platforms: ['win32'],
            config: {
                name: 'sBotics',
                authors: 'sBotics',
                exe: 'sbotics.exe',
                iconUrl: path.resolve(iconDir, 'icon.ico'),
                noMsi: true,
                setupExe: `sbotics.exe`,
                setupIcon: path.resolve(iconDir, 'icon.ico')
            },
        },
        {
            name: '@electron-forge/maker-deb',
            platforms: ['linux'],
            config: commonLinuxConfig,
        },
        {
            name: '@electron-forge/maker-rpm',
            platforms: ['linux'],
            config: commonLinuxConfig,
        }, {
            name: '@electron-forge/maker-pkg',
            platforms: ['darwin'],
            config: {
                install: "/Applications"
            }
        }
    ],
    publishers: [{
        name: '@electron-forge/publisher-github',
        config: {
            repository: {
                owner: 'sbotics',
                name: 'launcher',
            },
            draft: true,
            prerelease: false,
        },
    }, ],
};

function notarizeMaybe() {
    if (process.platform !== 'darwin') {
        return;
    }

    if (!process.env.CI) {
        console.log(`Not in CI, skipping notarization`);
        return;
    }

    if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
        console.warn(
            'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
        );
        return;
    }

    config.packagerConfig.osxNotarize = {
        appBundleId: 'com.sbotics.launcher',
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
        ascProvider: 'LT94ZKYDCJ',
    };
}

notarizeMaybe();

module.exports = config;