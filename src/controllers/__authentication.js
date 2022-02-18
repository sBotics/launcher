var ipcRenderer = require('electron').ipcRenderer;
let shell = require('electron').shell;

window.onload = () => {};

window.Login = () => {
  shell.openExternal(
    'http://auth.sbotics.localhost/login?provider=eyJpdiI6IlRIUUw4aVJIVmFZcytsSDFGVFVpUlE9PSIsInZhbHVlIjoicHRib3Qvc3gxTllsUncrSUxtV2p6L2g2V1Z6L0YwRFZ6b2JEb3BSby9reFJjOTJ0aHhiODhxT0dHNk9wZ2xlTTh4d3VwUHd5UHpGU0FKekMxbnJDc3c9PSIsIm1hYyI6IjAxODhjZTA2NmFlYjBkZjE3OTZkMjZiNmQ4MjYwYmZiMjAwNDg4NDgyZDhjZDBmYzE3ODgzZTU1MDNjNjk3MmIiLCJ0YWciOiIifQ==',
  );
};

window.Register = () => {
  shell.openExternal(
    'http://auth.sbotics.localhost/register?provider=eyJpdiI6IlRIUUw4aVJIVmFZcytsSDFGVFVpUlE9PSIsInZhbHVlIjoicHRib3Qvc3gxTllsUncrSUxtV2p6L2g2V1Z6L0YwRFZ6b2JEb3BSby9reFJjOTJ0aHhiODhxT0dHNk9wZ2xlTTh4d3VwUHd5UHpGU0FKekMxbnJDc3c9PSIsIm1hYyI6IjAxODhjZTA2NmFlYjBkZjE3OTZkMjZiNmQ4MjYwYmZiMjAwNDg4NDgyZDhjZDBmYzE3ODgzZTU1MDNjNjk3MmIiLCJ0YWciOiIifQ==',
  );
};
