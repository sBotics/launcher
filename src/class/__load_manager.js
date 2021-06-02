import {
  TitleBar,
  backdrop,
  TextVersion,
} from '../class/__interface_components.js';
import { Create, Update } from '../utils/progress-bar.js';
import {
  URLdictionary,
  ValidateConnection,
  UserData,
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
const { ipcRenderer } = require('electron');

var donwloadStateInit = false;
var donwloadStateCallback = true;

const InterfaceLoad = async () => {
  await TitleBar();
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
          'Warming up engines! Hold...',
        )}</span`,
      },
    ],
  });
};

const init = async () => {
  await asyncWait(900);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 7,
    text: [
      {
        textContainer: 'TextProgress',
        message: `<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">${Lang(
          'Checking Internet Connection! Hold...',
        )}</span>`,
      },
    ],
  });

  await asyncWait(600);

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

  await asyncWait(600);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 25,
    text: [
      {
        textContainer: 'TextProgress',
        message: `<i class="fas fa-wifi text-info"></i> <span style="margin-left: 13px">${Lang(
          'Checking Connection to Our Servers! Hold...',
        )}</span>`,
      },
    ],
  });

  await asyncWait(600);

  try {
    if (await ValidateConnection({ url: URLdictionary['wEduc'] }))
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

  await asyncWait(600);

  Update({
    id: 'LoadBar',
    addState: 'info',
    percentage: 45,
    text: [
      {
        textContainer: 'TextProgress',
        message: `<i class="fas fa-file-archive text-info"></i> <span style="margin-left: 13px">${Lang(
          'Looking for sBotics Launcher update! Hold...',
        )}</span>`,
      },
    ],
  });

  try {
    if (UpdateInit()) {
      await asyncWait(600);
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
                'Update available by downloading! Hold...',
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
            )}</strong>${Lang('Unable to look for updates. Try again later!')}`,
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
    await asyncWait(500);

    Update({
      id: 'LoadBar',
      addState: 'info',
      percentage: 80,
      text: [
        {
          textContainer: 'TextProgress',
          message: `<i class="fas fa-file-archive text-info"></i> <span style="margin-left: 13px">${Lang(
            'Searching and loading your data! Hold...',
          )}</span>`,
        },
      ],
    });
    var userdata = OpenUserFile();
    if (!userdata) {
      await asyncWait(200);
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
        await asyncWait(200);
        return console.log('LoginUser');
      } else {
        await asyncWait(200);
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
    await asyncWait(200);
    if (
      userdata['name'] &&
      userdata['email'] &&
      userdata['accessToken'] &&
      userdata['logged']
    ) {
      await asyncWait(200);
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
      await asyncWait(200);
      LoginOpen();
      LoadClose();
    }
  }
};

$(document).ready(() => {
  InterfaceLoad();
  LanguageInit(OpenConfig());
  init();
  Lang('Login is required!');
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
            'Update available by downloading! Hold...',
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
