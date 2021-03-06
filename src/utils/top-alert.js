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

var countAlert = 0;

const CreateTopAlert = (options) => {
  options = extend(
    {
      elementContainer: 'top-alert-container',
      states: '',
      message: '',
      absolute: false,
      idInner: '',
      idAutoInner: true,
      multiple: true,
      html: '',
      colorScheme: alertScheme,
      fixed: false,
      icon: true,
      timeOutVIew: 5000,
    },
    options,
  );

  const timeOutVIew = options.timeOutVIew;

  const idInner = !options.idInner
    ? options.idAutoInner
      ? countAlert++
      : ''
    : options.idInner;

  if (!options.html) {
    const elementContainer = document.getElementById(options.elementContainer);
    const colorScheme = options.colorScheme;
    const stateScheme = colorScheme[options.states];
    const absolute = options.absolute ? 'position-absolute' : '';

    const alertContainer = `${stateScheme['bg']} ${absolute}`;
    const alertIcon = `${stateScheme['icon']} ${stateScheme['icon_bg']}`;
    const alertMessage = `${options.message}`;

    const component = `<div id="Alert__${idInner}" class="top-alert alert justify-content-between align-items-center fade show rounded-0 ${alertContainer}" style="display: flex" role="alert"><div class="d-flex flex-row"><i class="${alertIcon} bi flex-shrink-0 me-2" style="font-size: 22px;"></i><div>${alertMessage}</div></div><div class="alert-dismissible-top"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>`;
    elementContainer.innerHTML = options.multiple
      ? elementContainer.innerHTML + component
      : component;
  } else {
    const elementContainer = document.getElementById(options.elementContainer);
    const colorScheme = options.colorScheme;
    const stateScheme = colorScheme[options.states];
    const absolute = options.absolute ? 'position-absolute' : '';

    const alertContainer = `${stateScheme['bg']} ${absolute}`;
    const alertIcon = `${stateScheme['icon']} ${stateScheme['icon_bg']}`;
    const alertMessage = `${options.html}`;
    const fixedState = options.fixed;
    const iconState = options.icon;

    const init = `<div id="Alert__${idInner}" class="alert ${alertContainer}" role="alert" style="margin-bottom: 0px; border-radius: 0px"><div class="d-flex flex-row">`;
    const icon = `<i class="${alertIcon} bi flex-shrink-0 me-2" style="font-size: 22px"></i>`;
    const body = `<div class="d-flex flex-column">${alertMessage}</div></div>`;
    const exit = `<div class="alert-dismissible-top"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    const end = `</div>`;

    var component = init;
    if (iconState == true) component += icon;
    component += body;
    if (fixedState == false) component += exit;
    component += end;

    elementContainer.innerHTML = options.multiple
      ? elementContainer.innerHTML + component
      : component;
  }

  if (timeOutVIew != 0) {
    setTimeout(() => {
      document.getElementById(`Alert__${idInner}`).style.display = 'none';
    }, timeOutVIew);
  }
};

export { CreateTopAlert };
