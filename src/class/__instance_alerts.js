var extend = require('extend-shallow');

var countAlert = 0;

class Alerts {
  constructor() {}
  alertScheme() {
    return {
      warning: {
        bg: 'bg-orange-100 text-orange-700',
        icon: 'fa-duotone fa-triangle-exclamation',
        icon_bg: 'text-orange-700',
      },
      danger: {
        bg: 'bg-red-100 text-red-700',
        icon: 'fa-duotone fa-biohazard',
        icon_bg: 'text-red-700',
      },
      success: {
        bg: 'bg-green-100 text-green-700',
        icon: 'fa-duotone fa-circle-check',
        icon_bg: 'text-green-700',
      },
      info: {
        bg: 'bg-blue-100 text-blue-700',
        icon: 'fa-duotone fa-circle-info',
        icon_bg: 'text-blue-700',
      },
    };
  }
  createTop(options) {
    options = extend(
      {
        elementContainer: '__container_top_alert',
        states: '',
        message: '',
        absolute: false,
        idInner: '',
        idAutoInner: true,
        multiple: true,
        html: '',
        colorScheme: this.alertScheme(),
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
      const elementContainer = document.getElementById(
        options.elementContainer,
      );
      const colorScheme = options.colorScheme;
      const stateScheme = colorScheme[options.states];

      const alertContainer = `${stateScheme['bg']} ${
        options.absolute ? 'absolute' : ''
      }`;
      const alertIcon = `${stateScheme['icon']} ${stateScheme['icon_bg']}`;
      const alertMessage = `${options.message}`;
      const fixedState = options.fixed;
      const iconState = options.icon;

      const component = `<div id="Alert__${idInner}" class="w-full py-3 px-5 mb-[1px] text-base ${alertContainer}" role="alert">${
        !fixedState
          ? `<button onclick="CloseAlert('Alert__${idInner}')" type="button" class="right-6 absolute"> <span class="text-2xl">&times;</span></button>`
          : ``
      }<div class="flex items-center">${
        iconState
          ? `<div class="py-1 mr-4"><i class="${alertIcon} text-[30px] fill-current h-8 w-8 text-green-800"></i></div>`
          : ``
      }<div>${alertMessage}</div></div></div>`;

      elementContainer.innerHTML = options.multiple
        ? elementContainer.innerHTML + component
        : component;
    } else {
      const elementContainer = document.getElementById(
        options.elementContainer,
      );
      const colorScheme = options.colorScheme;
      const stateScheme = colorScheme[options.states];

      const alertContainer = `${stateScheme['bg']} ${
        options.absolute ? 'absolute' : ''
      }`;
      const alertIcon = `${stateScheme['icon']} ${stateScheme['icon_bg']}`;
      const alertMessage = `${options.html}`;
      const fixedState = options.fixed;
      const iconState = options.icon;

      const init = `<div id="Alert__${idInner}" class="w-full py-3 px-5 text-base ${alertContainer}" role="alert"> ${
        !fixedState
          ? `<button onclick="CloseAlert('Alert__${idInner}')" type="button" class="right-6 absolute"> <span class="text-2xl">&times;</span></button>`
          : ``
      }`;
      const icon = `<div class="py-1 mr-4"><i class="${alertIcon} text-[30px] fill-current h-8 w-8 text-green-800"></i></div>`;
      const body = `<div class="flex">${
        iconState ? icon : ''
      }<div>${alertMessage}</div></div>`;
      const end = `</div>`;

      let component = init + body + end;

      elementContainer.innerHTML = options.multiple
        ? elementContainer.innerHTML + component
        : component;
    }

    if (timeOutVIew != 0) {
      setTimeout(() => {
        document.getElementById(`Alert__${idInner}`).style.display = 'none';
      }, timeOutVIew);
    }
  }
}
export { Alerts };
