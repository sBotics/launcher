var extend = require('extend-shallow');

const SizeCreate = (options) => {
  options = extend(
    {
      size: '',
      defaultValue: 100,
    },
    options,
  );
  return options.defaultValue / options.size;
};

const Create = (options) => {
  options = extend(
    {
      percentage: '',
      sizeCreate: false,
      progressBarName: 'ProgreesBar',
      state: 'info',
      limit: 100,
      id: '',
      text: '',
    },
    options,
  );

  const percentage = options.sizeCreate
    ? SizeCreate({ size: options.percentage })
    : options.percentage;
  const state = options.state;
  const limit = options.limit;
  const id = options.id;

  const text = options.text;

  document.getElementById(
    options.progressBarName,
  ).innerHTML += `<div id="${id}" class="progress-bar bg-${state}" role="progressbar" style="width: ${percentage}%; transition: width 2s;" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="${limit}"></div>`;

  if (text)
    text.forEach(
      (element) =>
        (document.getElementById(element.textContainer).innerHTML =
          element.message),
    );
};

const Update = (options) => {
  options = extend(
    {
      id: '',
      addState: '',
      onlyAdd: true,
      removeState: 'bg-warning',
      percentage: '',
      timeout: 0,
      text: '',
    },
    options,
  );

  const id = options.id;
  const onlyAdd = options.onlyAdd;
  const percentage = options.percentage;
  const text = options.text;

  setTimeout(() => {
    if (id) {
      if (onlyAdd)
        document
          .getElementById(id)
          .classList.remove(`bg-${options.removeState}`);
      document.getElementById(id).classList.add(`bg-${options.addState}`);
      if (percentage)
        document.getElementById(id).style.width = `${percentage}%`;
    }

    if (text)
      text.forEach(
        (element) =>
          (document.getElementById(element.textContainer).innerHTML =
            element.message),
      );
  }, options.timeout);
};

const Reset = (options) => {
  if (!options) options = { progressBarName: 'ProgreesBar' };
  document.getElementById(options.progressBarName).innerHTML = '';
};

const PercentageView = (value, options) => {
  if (!value) return undefined;

  options = extend(
    {
      elementView: false,
      elementInner: '',
      decimalCases: 2,
      ignoreZero: true,
    },
    options,
  );

  const elementView = options.elementView;
  const elementInner = options.elementInner;
  const decimalCases = options.decimalCases;
  const ignoreZero = options.ignoreZero;
  const ProgressID = value.progressID;
  const Size = value.size;

  const percentageValue = ignoreZero
    ? +(ProgressID * Size).toFixed(decimalCases)
    : (ProgressID * Size).toFixed(decimalCases);

  if (elementView)
    document.getElementById(elementInner).innerHTML = `${percentageValue}%`;
  else return `${percentageValue}%`;
};

export { SizeCreate, Create, Update, Reset, PercentageView };
