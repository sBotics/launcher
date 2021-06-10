var extend = require('extend-shallow');
import { Lang } from '../utils/language-manager.js';

const Modes = {
  start: {
    theme: 'bg-success text-white MagicButtonCenter',
    text: `<i class="far fa-play-circle iconMagicButton"></i> <span class="textoMagicButton">${Lang(
      'Start',
    )}</span>`,
    state: true,
  },
  install: {
    theme: 'bg-primary text-white MagicButtonCenter',
    text: `<i class="fas fa-download iconMagicButton"></i> <span class="textoMagicButton">${Lang(
      'Install sBotics',
    )}</span>`,
    state: true,
  },
  update: {
    theme: 'bg-sbotics-info text-white MagicButtonCenter',
    text: `<i class="fas fa-download iconMagicButton"></i> <span class="textoMagicButton">${Lang(
      'Update sBotics',
    )}</span>`,
    state: true,
  },
  process: {
    theme: 'bg-secondary text-white disabled',
    text: '',
    state: false,
  },
  repair_installation: {
    theme: 'bg-danger text-white MagicButtonCenter',
    text: `<i class="fas fa-tools iconMagicButton"></i> <span class="textoMagicButton">${Lang(
      'Repair sBotics Installation',
    )}</span>`,
    state: true,
  },
};

const MagicButton = (options) => {
  options = extend(
    {
      mode: '',
      defaultModes: Modes,
      elementContent: 'MagicButtonContent',
      elementButton: 'MagicButton',
      text: '',
    },
    options,
  );

  const mode = options.mode;
  const elementContent = options.elementContent;
  const defaultModes = options.defaultModes[mode];
  const text = options.text;

  if (!mode) return false;

  const textButton = !text ? defaultModes.text : text;
  document.getElementById(
    elementContent,
  ).innerHTML = `<button id="MagicButtonClick" data-mode=${mode} data-state=${defaultModes.state} class="w-100 btn ${defaultModes.theme}">${textButton}</button>`;
};

export { MagicButton };
