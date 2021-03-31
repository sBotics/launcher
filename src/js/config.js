const { ipcRenderer } = require("electron");
const fs = require("fs-extra");
const $ = require("jquery");
const pathlib = require("path");
var config;

let translation;

const SetStrings = () => {
  $("#repairbutton").text(translation["REPAIR"]);
  $("#repairwarning").text(translation["REPAIR_WARNING"]);
  $("#repairinstall").text(translation["REPAIR_INSTALLATION"]);
  $("#folder").text(translation["INSTALL_FOLDER"]);
  $("#foldermsg").text(translation["INSTALL_FOLDER_DESC"]);
  $("#pt_br").text(translation["PT_BR"]);
  $("#en_us").text(translation["EN_US"]);
  $("#langMsg").text(translation["LANGUAGE_MESSAGE"]);
  $("#lang").text(translation["LANGUAGE"]);
  $("#title").text(translation["SETTINGS"]);
};
const LoadStrings = () => {
  translation = ipcRenderer.sendSync("get-locale");
  SetStrings();
};

$(document).on("ready", () => {
  config = ipcRenderer.sendSync("get-config");
  LoadStrings();
});

$(document).on("ready", () => {
  config = ipcRenderer.sendSync("get-config");
  $("#langSelect").val(config.lang);
  $("#installFolder").val(config.downloadPath);
});

$(window).on("keyup", (ev) =>
  ev.key === "Escape" ? ipcRenderer.send("close-config") : null
);

$("#closeButton").on("click", (event) => {
  ipcRenderer.send("close-config");
});

$("#langSelect").on("change", (ev) => {
  const newLang = ev.target.value;
  if (newLang != config.lang) {
    ipcRenderer.send("set-config", { lang: newLang });
  }
});

$("#basic-addon1").on("click", (event) => {
  ipcRenderer.send("choose-dir");
});

ipcRenderer.on("selected-directory", (event, paths) => {
  let path = paths.filePaths[0];
  if (path.trim == "") return;
  const subPaths = path.split(pathlib.sep);
  const lastPath = subPaths[subPaths.length - 1];

  if (lastPath.toLowerCase() != "sbotics") {
    if (!fs.existsSync(pathlib.join(path, "sBotics"))) {
      fs.mkdirSync(pathlib.join(path, "sBotics"));
    }
    path = pathlib.join(path, "sBotics");
  }
  if (config.downloadPath != path) {
    fs.copySync(config.downloadPath, path, { overwrite: true });
    fs.rmdirSync(config.downloadPath, { recursive: true });
  }
  $("#installFolder").val(path);
  ipcRenderer.send("set-config", { downloadPath: path });
});

ipcRenderer.on("reload-lang", (ev, arg) => {
  translation = arg;
  SetStrings();
});

ipcRenderer.on("set-config", (ev, arg) => {
  config = arg;
});
