var extend = require('extend-shallow');

const backdrop = (options) => {
  options = extend(
    {
      elementName: '',
      elementType: 'class',
      min: 1,
      max: 5,
      imagePathDefault: '../assets/background/',
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
    `linear-gradient(to bottom, transparent, var(--body)), url('${options.imagePathDefault}${imagePath}')`,
  );
};

export { backdrop };
