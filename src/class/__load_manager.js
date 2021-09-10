const { ipcRenderer } = require('electron');
import { backdrop, TextVersion } from '../class/__interface_components.js';
import { Create, Update } from '../utils/progress-bar.js';
import {
  URLdictionary,
  ValidateConnection,
  UserData,
  DataUpdateState,
} from '../utils/connection-manager.js';
import { OpenConfig } from '../class/__file_config.js';
import { CreateUserFile, OpenUserFile } from '../class/__file_user.js';
import { LanguageInit, Lang } from '../utils/language-manager.js';
import { asyncWait } from '../utils/wait-manager.js';
import {
  UpdateInit,
  UpdateAvailable,
  UpdateInstall,
} from '../utils/autoupdate-manager.js';
import { SLMP } from '../utils/application-manager.js';
import { LoadClose, LoginOpen, IndexOpen } from '../utils/window-manager.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';
import { FastModeTimer, FastModoState } from '../utils/fast-mode-manager.js';

var donwloadStateInit = false;
var donwloadStateCallback = true;

const InterfaceLoad = async () => {
  await backdrop({
    elementName: 'backdrop',
  });
  await TextVersion({ elementName: 'TextVersion' });
  Create({
    percentage: 2,
    id: 'LoadBar',
    text: [
      {
        textContainer: 'TextProgress',
        message: `<i class="fas fa-rocket text-rainbow"></i> <span style="margin-left: 13px">${Lang(
          'Warming up engines! Please wait...',
        )}</span`,
      },
    ],
  });
};

const init = async (timers = { 200: 200, 500: 500, 600: 600, 900: 900 }) => {
  await asyncWait(timers[600]);

  try {
    const dataUpdateState = await DataUpdateState();
    if (!dataUpdateState && dataUpdateState['launcher'] == false && !SLMP()) {
      Update({
        id: 'LoadBar',
        addState: 'info',
        percentage: 7,
        text: [
          {
            textContainer: 'TextProgress',
            message: `<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">${Lang(
              'Checking Internet Connection! Please wait...',
            )}</span>`,
          },
        ],
      });
    } else if (dataUpdateState['launcher'] != false && !SLMP()) {
      return Update({
        id: 'LoadBar',
        addState: 'danger',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message: `<i class="fas fa-tools text-danger"></i> <strong style="margin-left: 13px">${Lang(
              'Unable to open, we are in the maintenance process! Please wait...',
            )}</strong>`,
          },
        ],
      });
    }
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-tools text-danger"></i> <strong style="margin-left: 13px">${Lang(
            'Unable to open, we are in the maintenance process! Please wait...',
          )}</strong>`,
        },
      ],
    });
  }

  await asyncWait(timers[600]);

  try {
    if (await ValidateConnection({ url: URLdictionary['GitHub'] }))
      Update({
        id: 'LoadBar',
        addState: 'success',
        removeState: 'info',
        percentage: 15,
        text: [
          {
            textContainer: 'TextProgress',
            message: `<i class="fas fa-wifi text-success"></i> <strong style="margin-left: 13px">${Lang(
              'Connected to the internet',
            )}</strong>`,
          },
        ],
      });
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-wifi text-danger"></i> <strong style="margin-left: 13px">${Lang(
            'No internet connection!',
          )}</strong>${Lang('Check your internet connection.')}`,
        },
      ],
    });
  }

  await asyncWait(timers[600]);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 25,
    text: [
      {
        textContainer: 'TextProgress',
        message: `<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">${Lang(
          'Checking Connection to Our Servers! Please wait...',
        )}</span>`,
      },
    ],
  });

  await asyncWait(timers[600]);

  try {
    if (
      (await ValidateConnection({ url: URLdictionary['wEduc'] })) &&
      !SLMP() &&
      !FastModoState()
    )
      Update({
        id: 'LoadBar',
        addState: 'success',
        removeState: 'info',
        percentage: 35,
        text: [
          {
            textContainer: 'TextProgress',
            message: `<i class="fas fa-wifi text-success"></i> <strong style="margin-left: 13px">${Lang(
              'Connected to our servers.',
            )}</strong>`,
          },
        ],
      });
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-wifi text-danger"></i> <strong style="margin-left: 13px">${Lang(
            'Unable to connect to our servers!',
          )} </strong>${Lang('Try again later')}`,
        },
      ],
    });
  }

  await asyncWait(timers[600]);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 45,
    text: [
      {
        textContainer: 'TextProgress',
        message: `<i class="fas fa-file-archive text-info"></i> <span style="margin-left: 13px">${Lang(
          'Looking for sBotics Launcher update! Please wait...',
        )}</span>`,
      },
    ],
  });

  try {
    if (UpdateInit()) {
      await asyncWait(timers[600]);
      const updateAvailable = await UpdateAvailable;
      if (updateAvailable['state']) {
        Update({
          id: 'LoadBar',
          addState: 'info',
          percentage: 55,
          text: [
            {
              textContainer: 'TextProgress',
              message: `<i class="fas fa-file-archive text-info"></i> <strong style="margin-left: 13px">${Lang(
                'Update available by downloading! Please wait...',
              )}</strong>`,
            },
          ],
        });
        return (donwloadStateInit = true);
      } else {
        Update({
          id: 'LoadBar',
          addState: 'success',
          removeState: 'info',
          percentage: 55,
          text: [
            {
              textContainer: 'TextProgress',
              message: `<i class="fas fa-file-archive text-success"></i> <strong style="margin-left: 13px">${Lang(
                'sBotics Launcher is in the latest version available!',
              )}</strong>`,
            },
          ],
        });
      }
    } else if (!SLMP()) {
      return Update({
        id: 'LoadBar',
        addState: 'danger',
        removeState: 'info',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message: `<i class="fas fa-file-archive text-danger"></i> <strong style="margin-left: 13px">${Lang(
              'Failure!',
            )} </strong>${Lang(
              'Unable to look for updates. Try again later!',
            )}`,
          },
        ],
      });
    }
  } catch (error) {
    return Update({
      id: 'LoadBar',
      addState: 'danger',
      removeState: 'info',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-dumpster-fire text-danger"></i> <strong style="margin-left: 5px; margin-right: 13px;">[LauncherProtection]</strong>${Lang(
            'Update search aborted due to a localized failure!',
          )}`,
        },
      ],
    });
  }

  if (!donwloadStateInit) {
    await asyncWait(timers[500]);

    Update({
      id: 'LoadBar',
      addState: 'info',
      percentage: 80,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-file-archive text-info"></i> <span style="margin-left: 13px">${Lang(
            'Searching and loading your data! Please wait...',
          )}</span>`,
        },
      ],
    });
    var userdata = OpenUserFile();
    if (!userdata) {
      await asyncWait(timers[200]);
      Update({
        id: 'LoadBar',
        addState: 'danger',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message: `<i class="fas fa-user-circle text-danger"></i> <strong style="margin-left: 13px">${Lang(
              'Failure Detected!',
            )}</strong>${Lang(
              'While trying to find user data a fault was found! Wait trying to solve.',
            )}`,
          },
        ],
      });
      if (CreateUserFile()) {
        Update({
          id: 'LoadBar',
          addState: 'info',
          removeState: 'danger',
          percentage: 100,
          text: [
            {
              textContainer: 'TextProgress',
              message: `<i class="fas fa-user-circle text-info"></i> <span style="margin-left: 13px">${Lang(
                'Solved but login is required!',
              )}</span>`,
            },
          ],
        });
        await asyncWait(timers[200]);
        return console.log('LoginUser');
      } else {
        await asyncWait(timers[200]);
        return Update({
          id: 'LoadBar',
          addState: 'danger',
          removeState: 'info',
          percentage: 100,
          text: [
            {
              textContainer: 'TextProgress',
              message: `<i class="fas fa-dumpster-fire text-danger"></i> <strong style="margin-left: 5px; margin-right: 13px;">[LauncherProtection]</strong> ${Lang(
                'Unable to fix the fault found.',
              )}`,
            },
          ],
        });
      }
    }
    await asyncWait(timers[200]);
    const macAddress = await GetMacAddress();
    if (
      userdata['name'] &&
      userdata['email'] &&
      userdata['accessToken'] &&
      userdata['logged'] &&
      userdata['macAddress'] &&
      userdata['macAddress'] == macAddress
    ) {
      await asyncWait(timers[200]);
      const access_token = userdata['accessToken'];
      UserData({
        accessToken: access_token,
      })
        .then((response) => {
          Update({
            id: 'LoadBar',
            addState: 'success',
            removeState: 'info',
            percentage: 100,
            text: [
              {
                textContainer: 'TextProgress',
                message: `<i class="fas fa-user-circle text-success"></i> <span style="margin-left: 13px">${Lang(
                  'Success! Opening sBotics Launcher',
                )}</span>`,
              },
            ],
          });

          IndexOpen();
          LoadClose();
        })
        .catch((err) => {
          Update({
            id: 'LoadBar',
            addState: 'info',
            percentage: 100,
            text: [
              {
                textContainer: 'TextProgress',
                message: `<i class="fas fa-user-circle text-info"></i> <span style="margin-left: 13px">${Lang(
                  'Login is required!',
                )} </span>`,
              },
            ],
          });
          LoginOpen();
          LoadClose();
        });
    } else {
      Update({
        id: 'LoadBar',
        addState: 'info',
        percentage: 100,
        text: [
          {
            textContainer: 'TextProgress',
            message: `<i class="fas fa-user-circle text-info"></i> <span style="margin-left: 13px">${Lang(
              'Login is required!',
            )}</span>`,
          },
        ],
      });
      await asyncWait(timers[200]);
      LoginOpen();
      LoadClose();
    }
  }
};

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  init(FastModeTimer());
});

ipcRenderer.on('update-download-progress', (event, arg) => {
  const percentage =
    arg['progress']['percent'] == 100 && donwloadStateCallback
      ? 1
      : arg['progress']['percent'];
  donwloadStateCallback = false;
  if (donwloadStateInit)
    Update({
      id: 'LoadBar',
      addState: 'success',
      removeState: 'info',
      percentage: percentage,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-file-archive text-success"></i> <strong style="margin-left: 13px">${Lang(
            'Update available by downloading! Please wait...',
          )}</strong>`,
        },
      ],
    });
});

ipcRenderer.on('update-downloaded', (event, arg) => {
  (async () => {
    Update({
      id: 'LoadBar',
      addState: 'success',
      removeState: 'info',
      percentage: 100,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-redo-alt text-success"></i> <strong style="margin-left: 13px">${Lang(
            'Restarting to finish update...',
          )}</strong>`,
        },
      ],
    });
    await asyncWait(300);
    UpdateInstall();
  })();
});
