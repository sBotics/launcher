var isConfigOpened = false;
const tutorialLink = "file:///C:/Users/lucas/tutorial/index.html";
const { ipcRenderer } = require("electron");

document.getElementById("tutorial").addEventListener("click", OpenTutorial);

document.getElementById("cboticsButton").addEventListener("click", ShowCbotics);
document.getElementById("logoimg").addEventListener("click", ShowLauncher);
function ShowCbotics() {
  document.getElementById("cbotics").style.display = "block";
  document.getElementById("sbotics").style.display = "none";
}
function ShowLauncher() {
  document.getElementById("cbotics").style.display = "none";
  document.getElementById("sbotics").style.display = "inherit";
}
function OpenTutorial() {
  ipcRenderer.send(
    "open-external-link",
    tutorialLink
  );
}

function OpenConfig() {
  console.log("a");
  ipcRenderer.send("open-new-window", {
    id: "config",
    widht: 0.5,
    height: 0.5,
    url: "Config.html",
    quitonclose: false,
    signal: "Config abriu",
  });
}

function Close() {
  ipcRenderer.send("fim");
}

function reload() {
  console.log("aaa");
  ipcRenderer.send("reload");
}

ipcRenderer.on("Config abriu", () => {
  console.log("config abriu");
  isConfigOpened = true;
  document.getElementById("overlay").classList.add("overlay");
});

// document.getElementById("overlay").addEventListener("click", function () {
//   if (isConfigOpened) {
//     isConfigOpened = false;
//     document.getElementById("overlay").classList.remove("overlay");
//   }
// });

document.getElementById("settings").addEventListener("click", OpenConfig);
