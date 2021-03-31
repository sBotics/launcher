const axios = require("axios");
const luxon = require("luxon");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { writer } = require("repl");
const { config, electron } = require("process");
const { ipcRenderer } = require("electron");
const homedir = os.homedir();
const util = require("util");
const unziper = require("@xmcl/unzip");
const exec = util.promisify(require("child_process").exec);
const states = {
  verifying: 1,
  downloading: 2,
  done: 3,
};

const filesToDownload = []

var state = states.verifying;
var UserOs;
var FolderPath;
var obj;
var currentWidth = 0;
var variantWidth;

var localsystem = {};

const RecursiveMkdir = (pathToCreate) => {
  var subpaths = pathToCreate.split(path.sep);
  if (array[0] == "") {
    array[0] = "/";
  }
  var new_array;
  for (var i = 1; i < subpaths.length + 1; i++) {
    new_array = subpaths.slice(0, i);
    new_array = new_array.join(path.sep);
    if (!fs.existsSync(new_array)) {
      fs.mkdirSync(new_array);
    }
  }
};

const DetectOs = () => {
  const platforms = {
    win32: "W",
    darwin: "mac",
    linux: "Linux",
  };
  var os = process.platform.toLowerCase();
  return platforms[os];
};
const DetectArch = () => process.arch;

const GetFolder = () => {
  var ret;
  switch (UserOs) {
    case "mac":
      ret = "mac";
      break;
    case "W":
      if (DetectArch() == "x64") {
        ret = "W64";
      } else {
        ret = "W32";
      }
      break;
    case "Linux ":
      if (DetectArch() == "x64") {
        ret = "Linux AMD64";
      } else {
        ret = "Linux i386";
      }
      break;
  }
  return ret;
};
const getFilesizeInBytes = (filepath) => {
  var stats = fs.statSync(filepath);
  var fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
}
const ParseTime=(filedate) => {
  var year = parseInt(filedate.slice(0, 4));
  var month = parseInt(filedate.slice(5, 7));
  var day = parseInt(filedate.slice(8, 10));
  var hour = parseInt(filedate.slice(11, 13));
  var minute = parseInt(filedate.slice(14, 16));
  var second = parseInt(filedate.slice(17, 19));
  var date = luxon.DateTime.utc(year, month, day, hour, minute, second);
  return date.toMillis();
}

const download = async (url, pathe, filename) => {
  var u_path = path.join(homedir, "sBotics", pathe);
  console.log(url);
  if (!fs.existsSync(u_path)) {
    RecursiveMkdir(u_path);
  }
  u_path = path.join(u_path, filename);
  const writer = fs.createWriteStream(u_path);
  await axios({
    method: "get",
    url: url,
    responseType: "stream",
  }).then(function (response) {
    response.data.pipe(writer);
  });
  writer.on("finish", function () {
    writer.close();
  });

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const unzip = async => (pathe, filename) {
  var readpath = path.join(homedir, "sBotics", pathe, filename + ".zip");
  var finalpath = path.join(homedir, "sBotics", pathe);
  await unziper.extract(readpath, finalpath);
}

// async function main(res) {
//   obj = res.data;
//   if (obj.version != ver) {
//     var conf = path.join(homedir, "sBotics", "download.json");
//     var whattowr = { download_link: obj.download_link };
//     fs.writeFileSync(conf, JSON.stringify(whattowr));

//     ipcRenderer.sendSync("deprecated");
//     return;
//   }
//   obj = obj.data;
//   variantWidth = 100 / obj.length;
//   const config_path = path.join(homedir, "sBotics", "config.json");
//   if (!fs.existsSync(path.join(homedir, "sBotics"))) {
//     RecursiveMkdir(path.join(homedir, "sBotics"));
//   }
//   if (!fs.existsSync(config_path)) {
//     fs.writeFileSync(config_path, JSON.stringify(localsystem));
//   } else {
//     localsystem = JSON.parse(fs.readFileSync(config_path));
//     //console.log(localsystem);
//   }
//   var file_path;
//   var objf;
//   var filestats;
//   var tries = 0;
//   for (var i = 0; i < obj.length; i++) {
//     var tries = 0;

//     objf = obj[i];
//     file_path = path.join(homedir, "sBotics", objf.path, objf.name);
//     console.log("verificando " + objf.name);
//     try {
//       if (!fs.existsSync(file_path)) {
//         stringsLoading = [
//           "Baixando " + objf.name + "",
//           "Baixando " + objf.name + ".",
//           "Baixando " + objf.name + "..",
//           "Baixando " + objf.name + "...",
//         ];
//         tries++;
//         await download(objf.download, objf.path, objf.name);
//         if (objf.format == "zip") {
//           await unzip(objf.path, objf.name.slice(0, objf.name.length - 4));
//         }
//         localsystem[file_path] = {
//           downloaded: luxon.DateTime.local().toUTC().toMillis(),
//         };
//         localsystem["seses"] = luxon.DateTime.local().toUTC().toMillis();
//         fs.writeFileSync(config_path, JSON.stringify(localsystem));
//       } else if (
//         localsystem[file_path].downloaded < ParseTime(objf.last_updated_at)
//       ) {
//         stringsLoading = [
//           "Baixando " + objf.name + "",
//           "Baixando " + objf.name + ".",
//           "Baixando " + objf.name + "..",
//           "Baixando " + objf.name + "...",
//         ];
//         tries++;

//         await download(objf.download, objf.path, objf.name);
//         if (objf.format == "zip") {
//           await unzip(file_path, objf.name.slice(0, objf.name.length - 4));
//         }
//         localsystem[file_path] = {
//           downloaded: luxon.DateTime.local().toUTC().toMillis(),
//         };
//         localsystem["seses"] = luxon.DateTime.local().toUTC().toMillis();
//         fs.writeFileSync(config_path, JSON.stringify(localsystem));
//       } else if (getFilesizeInBytes(file_path) != objf.size) {
//         stringsLoading = [
//           "Baixando " + objf.name + "",
//           "Baixando " + objf.name + ".",
//           "Baixando " + objf.name + "..",
//           "Baixando " + objf.name + "...",
//         ];
//         tries++;

//         await download(objf.download, objf.path, objf.name);
//         if (objf.format == "zip") {
//           await unzip(file_path, objf.name.slice(0, objf.name.length - 4));
//         }
//         localsystem[file_path] = {
//           downloaded: luxon.DateTime.local().toUTC().toMillis(),
//         };
//         localsystem["seses"] = luxon.DateTime.local().toUTC().toMillis();
//         fs.writeFileSync(config_path, JSON.stringify(localsystem));
//       }
//     } catch (e) {
//       console.log("deu pau");
//       while (true) {
//         try {
//           stringsLoading = [
//             "Tivemos um problema. Baixando " + objf.name + " novamente",
//             "Tivemos um problema. Baixando " + objf.name + " novamente.",
//             "Tivemos um problema. Baixando " + objf.name + " novamente" + "..",
//             "Tivemos um problema. Baixando " + objf.name + " novamente" + "...",
//           ];
//           if (fs.existsSync(file_path)) {
//             fs.unlinkSync(file_path);
//           }
//           await download(objf.download, objf.path, objf.name);
//           if (objf.format == "zip") {
//             await unzip(objf.path, objf.name.slice(0, objf.name.length - 4));
//           }
//           localsystem[file_path] = {
//             downloaded: luxon.DateTime.local().toUTC().toMillis(),
//           };
//           localsystem["seses"] = luxon.DateTime.local().toUTC().toMillis();
//           fs.writeFileSync(config_path, JSON.stringify(localsystem));
//           break;
//         } catch {
//           console.log("deu pau dnv");
//         }
//       }
//     }
//     attLoading();
//   }
//   stringsLoading = [
//     "Finalizando",
//     "Finalizando.",
//     "Finalizando..",
//     "Finalizando...",
//   ];
//   localsystem["seses"] = luxon.DateTime.local().toUTC().toMillis();
//   fs.writeFileSync(config_path, JSON.stringify(localsystem));

//   var string_execute;
//   switch (FolderPath) {
//     case "mac":
//       string_execute = path.join(
//         homedir,
//         "sBotics",
//         "sBotics.app",
//         "Contents",
//         "MacOS",
//         "sBotics"
//       );
//       string_execute = "cd / && ." + string_execute;
//       break;
//     case "W64":
//       string_execute = path.join(homedir, "sBotics", "sBotics.exe");
//       break;
//     case "W32":
//       string_execute = path.join(homedir, "sBotics", "sBotics.exe");
//       break;

//     case "Linux AMD64":
//       string_execute = path.join(homedir, "sBotics", "sBotics.x86_64");
//       break;

//     case "Linux i386":
//       string_execute = path.join(homedir, "sBotics", "sBotics.x86");
//       break;
//   }
//   if (FolderPath.includes("Linux")) {
//     fs.chmodSync(path.join(homedir, "sBotics", "sBotics.x86_64"), 0o777);
//   }
//   if (FolderPath.includes("mac")) {
//     fs.chmodSync(
//       path.join(
//         homedir,
//         "sBotics",
//         "sBotics.app",
//         "Contents",
//         "MacOS",
//         "sBotics"
//       ),
//       0o777
//     );
//   }
//   exec(string_execute, Finalizar);
//   ipcRenderer.send("jogo");
// }
// function Finalizar(error, stdout, stderr) {
//   ipcRenderer.send("fim");
// }
// UserOs = DetectOs();
// FolderPath = GetFolder();
// console.log(
//   "https://raw.githubusercontent.com/Txiag/sBotics/master/" +
//     FolderPath +
//     ".json"
// );
// axios
//   .get(
//     "https://raw.githubusercontent.com/Txiag/sBotics/master/" +
//       FolderPath +
//       ".json"
//   )
//   .then(main);

// let myVar = setInterval(function () {
//   timer();
// }, 500);
// var currentString = 0;
// function timer() {
//   document.getElementById("alertDown").innerText =
//     stringsLoading[currentString++];
//   currentString = currentString % 4;
// }
// function attLoading() {
//   document.getElementById("loadingbar").style.width = `${currentWidth}%`;
//   currentWidth += variantWidth;
// }
