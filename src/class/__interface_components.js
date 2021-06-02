var extend = require('extend-shallow');
const customTitlebar = require('custom-electron-titlebar');
import { AppVersion } from '../utils/application-manager.js';

const TitleBar = () => {
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#131313'),
    menu: false,
    titleHorizontalAlignment: 'left',
    maximizable: false,
  });
};

const backdrop = (options) => {
  options = extend(
    {
      elementName: '',
      elementType: 'class',
      min: 1,
      max: 5,
      imagePathDefault: '../assets/background/',
      colorBackground: '--body',
    },
    options,
  );

  const elementType = options.elementType;
  const elementName =
    elementType == 'class' ? `.${options.elementName}` : options.elementName;

  const imagePath = `background-${(
    Math.floor(Math.random() * options.max) + options.min
  ).toString()}.png`;

  $(elementName).css(
    'background-image',
    `linear-gradient(to bottom, transparent, var(${options.colorBackground})), url('${options.imagePathDefault}${imagePath}')`,
  );
};

const TextVersion = (options) => {
  options = extend(
    {
      elementName: '',
    },
    options,
  );

  const elementName = options.elementName;
  document.getElementById(elementName).innerHTML = `v1.${AppVersion()}`;
};

export { TitleBar, backdrop, TextVersion };
