const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const request = require("request");

var screenElectron = electron.screen;
var ScreenSize;
var openWindows = [];
var userdata;
function ShowAllWindows() {
  for (var i = 0; i < openWindows.length; i++) {
    openWindows[i].bw.show();
  }
}
function ShowWindow(winId) {
  for (var i = 0; i < openWindows.length; i++) {
    if (openWindows[i].id == winId) {
      openWindows[i].bw.show();
      break;
    }
  }
}
function HideAllWindows() {
  for (var i = 0; i < openWindows.length; i++) {
    openWindows[i].bw.hide();
  }
}
function HideWindow(winId) {
  for (var i = 0; i < openWindows.length; i++) {
    if (openWindows[i].id == winId) {
      openWindows[i].bw.hide();
      break;
    }
  }
}

function SendMessageToWin(winId, message, data) {
  for (var i = 0; i < openWindows.length; i++) {
    if (openWindows[i].id == winId) {
      openWindows[i].bw.webContents.send(message, data);
      break;
    }
  }
}
function SendMessageWithData(message, data) {
  for (var i = 0; i < openWindows.length; i++) {
    openWindows[i].bw.webContents.send(message, data);
  }
}
function SendMessage(message) {
  for (var i = 0; i < openWindows.length; i++) {
    openWindows[i].bw.webContents.send(message);
  }
}
function OpenNewWindow(
  id,
  widht,
  height,
  url,
  quitonclose = false,
  signal = ""
) {
  console.log(Math.round(ScreenSize.width * height));
  var newWindow = {
    id: id,
    bw: new BrowserWindow({
      width: Math.round(ScreenSize.width * widht),
      height: Math.round(ScreenSize.height * height),
      resizable: false,
      frame: false,
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    }),
  };
  newWindow.bw.loadURL(`file://${__dirname}/src/html/${url}`);
  console.log(newWindow.bw.representedFilename);
  newWindow.bw.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURl) => {
      console.log(errorCode + "\n" + errorDescription + "\n" + validatedURl);
    }
  );

  newWindow.bw.once("ready-to-show", () => {
    newWindow.bw.show();
    if (signal != "") {
      SendMessage(signal);
    }
  });
  if (quitonclose) {
    newWindow.bw.on("closed", function () {
      app.quit();
    });
  }
  openWindows.push(newWindow);
}
function CloseWindow(id) {
  for (var i = 0; i < openWindows.length; i++) {
    if (openWindows[i].id == id) {
      openWindows[i].bw.close();
      openWindows[i] = null;
      openWindows = []
        .concat(openWindows.slice(0, i))
        .concat(openWindows.slice(i + 1));
      SendMessage(`closed-${id}`);
      break;
    }
  }
}
app.commandLine.appendSwitch("disable-http-cache");
app.on("ready", () => {
  userdata = app.getPath("userData");
  electron.session.defaultSession.clearStorageData();
  ScreenSize = screenElectron.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  request(
    {
      uri: "https://txiag.github.io/sbotics-updater/src/html/index.html",
      timeout: 20000,
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        OpenNewWindow("main", 0.8, 0.95, `newIndex.html`, true);
        //OpenNewWindow("main", 0.8, 0.95, `https://txiag.github.io/sbotics-updater/src/html/index.html`, true)
      } else {
        OpenNewWindow("deprecated", 0.4, 0.6, `error.html`, true);
      }
    }
  );
});
ipc.on("reload", function (event) {
  console.log("aaa");
  app.relaunch();
  app.quit();
});
ipc.on("fim", function (event, data) {
  app.quit();
});
ipc.once("jogo", function (event, data) {
  win.hide();
});

ipc.on("hide-window", function (event, data) {
  if ("winId" in data) {
    HideWindow(data.winId);
  } else {
    HideAllWindows();
  }
});

ipc.on("fecharJanelaConfig", () => {
  console.log("entrou no fecharJanelaConfig");
  winSecondary.close();
  win.webContents.send("fecharconfig");
});

ipc.on("send-message", function (event, data) {
  if ("message" in data) {
    if ("data" in data) {
      if ("winId" in data) {
        SendMessageToWin(data.winId, data.message, data.data);
      } else {
        SendMessageWithData(data.message, data.data);
      }
    } else {
      SendMessage(data.message);
    }
  }
});

ipc.on("open-external-link", function (event, data) {
  electron.shell.openExternal(data);
});
ipc.on("open-new-window", function (event, data) {
  console.log(data);
  OpenNewWindow(
    data.id,
    data.widht,
    data.height,
    data.url,
    data.quitonclose,
    data.signal
  );
});
ipc.on("close-window", function (event, data) {
  CloseWindow(data.id);
});
