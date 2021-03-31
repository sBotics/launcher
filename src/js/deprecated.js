const fs = require("fs");
const path = require("path");
const os = require("os");
const { ipcRenderer } = require("electron");
const { shell } = require("electron");

const homedir = os.homedir();
var conf = path.join(homedir, "sBotics", "download.json");
var download_link = JSON.parse(fs.readFileSync(conf));
async function abrir() {
  download_link = download_link.download_link;
  await shell.openExternal(download_link);
  fs.unlinkSync(conf);

  ipcRenderer.send("fim");
}
document.getElementById("aqui").onclick = abrir;
