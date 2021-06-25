const Swal = require('sweetalert2');
import { OpenConfig, UpdateConfig } from '../class/__file_config.js';
import { Lang } from './language-manager.js';

const FastModeTimer = () => {
  if (OpenConfig()['fastMode'] === undefined)
    UpdateConfig({ data: { fastMode: false } });
  return OpenConfig()['fastMode']
    ? { 200: 0, 500: 0, 600: 0, 900: 0 }
    : { 200: 200, 500: 500, 600: 600, 900: 900 };
};

const FastModoState = () => {
  if (OpenConfig()['fastMode'] === undefined)
    UpdateConfig({ data: { fastMode: false } });
  return OpenConfig()['fastMode'];
};

const FastModeUpdate = () => {
  const fastModeState = FastModoState();
  Swal.fire({
    title: !fastModeState
      ? Lang('Do you want to enable FastMode?')
      : Lang('Do you want to disable FastMode?'),
    text: !fastModeState
      ? Lang(
          'By enabling this option sBotics Launcher will be optimized to start faster.',
        )
      : Lang(
          'By disabling this option the sBotics Launcher will start slower.',
        ),
    icon: 'warning',
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonText: !fastModeState
      ? Lang('Enable FastMode')
      : Lang('Disable FastMode'),
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      if (
        UpdateConfig({
          data: { fastMode: OpenConfig()['fastMode'] ? false : true },
        })
      ) {
        document.getElementById('FastModeIcon').style.color = OpenConfig()[
          'fastMode'
        ]
          ? 'rgb(0, 160, 223)'
          : 'rgb(77, 84, 87)';
        Swal.fire(
          !fastModeState
            ? Lang('FastMode Enabled!')
            : Lang('FastMode Disabled!'),
          '',
          'success',
        );
      } else {
        Swal.fire(
          'FastMode indisponível!',
          !fastModeState
            ? Lang('Unable to enable FastMode')
            : Lang('Unable to disable FastMode'),
          'danger',
        );
      }
    }
  });
};

const FastModeLoad = () => {
  document.getElementById('FastModeIcon').style.color = OpenConfig()['fastMode']
    ? 'rgb(0, 160, 223)'
    : 'rgb(77, 84, 87)';
  document.getElementById('UpdateFastModeActive').style.display = 'flex';
};

export { FastModeTimer, FastModeUpdate, FastModeLoad, FastModoState };
