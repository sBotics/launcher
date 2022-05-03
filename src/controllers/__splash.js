var ipcRenderer = require('electron').ipcRenderer

window.onload = () => {
    document.getElementById('text-version').innerText = `Versão: ${ipcRenderer.sendSync('get-version')} BETA`;
}