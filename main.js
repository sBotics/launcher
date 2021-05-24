const { app, BrowserWindow, screen } = require("electron");
let window;

app.whenReady().then(() => {
  ScreenSize = screen.getPrimaryDisplay();
  ScreenSize = ScreenSize.bounds;
  // var height = Math.round(ScreenSize.height * 0.6);
  // const width = Math.round((16 * height) / 9);
  var height = Math.round(ScreenSize.height * 0.4);
  const width = Math.round((16 * height) / 8);
  window = new BrowserWindow({
    titleBarStyle: "hiddenInset",
    width: width,
    height: height,
    backgroundColor: "#000",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  window.loadURL("file://" + __dirname + "/routes/load.html");
  window.webContents.openDevTools();
});
