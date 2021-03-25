const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require('electron');
const util = require('util');

window.addEventListener('keyup', function(event){
    if (event.key == "Escape"){
        ipcRenderer.send("close-window", {id:"config"});
    }
})
document.getElementById('closeButton').addEventListener(
    'click', function(event){
        ipcRenderer.send("close-window", {id:"config"});
})

document.getElementById('reparar').addEventListener(
    'click', function(event){
        document.getElementById('confirmacao').style.visibility="visible"

})
document.getElementById('no').addEventListener(
    'click', function(event){
        document.getElementById('confirmacao').style.visibility="collapse"

})
