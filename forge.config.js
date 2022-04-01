const path = require('path');
const iconDir = path.resolve(__dirname, 'assets', 'icons', 'app');

const commonLinuxConfig = {
  icon: path.resolve(iconDir, 'icon.png'),
  mimeType: ['x-scheme-handler/sbotics'],
};

const config = {
  packagerConfig: {
    executableName: 'sbotics',
    asar: true,
    appBundleId: 'com.sbotics.launcher',
    usageDescription: [],
    appCategoryType: 'public.app-category.developer-tools',
    protocols: [
      {
        name: 'sBotics Launcher Launch Protocol',
        schemes: ['sbotics'],
      },
    ],
    win32metadata: {
      CompanyName: 'sBotics',
      OriginalFilename: 'sBotics',
    },
    osxSign: {
      identity: 'Developer ID Application: Julio Cesar Vera Neto (5UQ7TRCVCT)',
      'hardened-runtime': true,
      'gatekeeper-assess': false,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'signature-flags': 'library',
    },
    osxNotarize: {
       
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      arch: ['ia32', 'x64'],
      config: {
        name: 'sBotics',
        authors: 'sBotics',
        iconUrl: path.resolve(iconDir, 'icon.ico'),
        noMsi: true,
        setupExe: 'sbotics.exe',
        setupIcon: path.resolve(iconDir, 'icon.ico'),
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
    },
    {
      name: '@electron-forge/maker-pkg',
      platforms: ['darwin'],
      arch: 'all',
      config: {
        icon: path.resolve(iconDir, 'icon.icns'),
        install: '/Applications',
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'sbotics',
          name: 'launcher',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
};

module.exports = config;
