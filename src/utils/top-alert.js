var extend = require('extend-shallow');

const alertScheme = {
  warning: {
    bg: 'bg-sbotics-warning',
    icon: 'fas fa-exclamation-triangle',
    icon_bg: 'icon-sbotics-warning',
  },
  danger: {
    bg: 'bg-danger',
    icon: 'fas fa-exclamation-circle',
    icon_bg: 'icon-sbotics-danger',
  },
  success: {
    bg: 'bg-success',
    icon: 'fas fa-check-circle',
    icon_bg: 'icon-sbotics-success',
  },
  info: {
    bg: 'bg-sbotics-info',
    icon: 'fas fa-info-circle',
    icon_bg: 'icon-sbotics-info',
  },
};

const CreateTopAlert = (options) => {
  options = extend(
    {
      elementContainer: 'top-alert-container',
      states: '',
      message: '',
      absolute: false,
      idInner: '',
      multiple: true,
      colorScheme: alertScheme,
    },
    options,
  );

  const elementContainer = document.getElementById(options.elementContainer);
  const colorScheme = options.colorScheme;
  const stateScheme = colorScheme[options.states];
  const absolute = options.absolute ? 'position-absolute' : '';

  const alertContainer = `${stateScheme['bg']} ${absolute}`;
  const alertIcon = `${stateScheme['icon']} ${stateScheme['icon_bg']}`;
  const alertMessage = `${options.message}`;

  const component = `<div id="${options.idInner}" class="top-alert alert d-flex justify-content-between align-items-center fade show rounded-0 ${alertContainer}" role="alert"><div class="d-flex flex-row"><i class="${alertIcon} bi flex-shrink-0 me-2" style="font-size: 22px;"></i><div>${alertMessage}</div></div><div class="alert-dismissible-top"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>`;
  elementContainer.innerHTML = options.multiple
    ? elementContainer.innerHTML + component
    : component;
};

export { CreateTopAlert };
