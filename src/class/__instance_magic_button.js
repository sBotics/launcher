var extend = require('extend-shallow');

class MagicButton {
  modes() {
    return {
      start: {
        theme:
          'bg-green-600 text-white uppercase flex items-center justify-center relative',
        text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-circle-play text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Pronto Para Iniciar</span>`,
        state: true,
      },
      install: {
        theme:
          'bg-indigo-600 text-white uppercase flex items-center justify-center relative',
        text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-download text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Instalar sBotics</span>`,
        state: true,
      },
      update: {
        theme:
          'bg-blue-600 text-white uppercase flex items-center justify-center relative',
        text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-download text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Atualizar sBotics</span>`,
        state: true,
      },
      process: {
        theme:
          'bg-gray-600 text-white uppercase flex items-center justify-center',
        text: ``,
        state: false,
      },
      repair_installation: {
        theme:
          'bg-orange-600 text-white uppercase flex items-center justify-center relative',
        text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-wrench text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Reparar Instalação sBotics</span>`,
        state: true,
      },
      fail: {
        theme: 'bg-red-600 text-white uppercase flex items-center justify-center',
        text: '',
        state: false,
      },
    };
  }

  constructor(options) {
    options = extend(
      {
        mode: '',
        defaultModes: this.modes(),
        elementContentButtonA: '__container_magic_button',
        elementContentButtonB: '__container_magic_button',
        text: '',
      },
      options,
    );

    const mode = options.mode;

    if (!mode) return false;

    const elementContentButtonA = options.elementContentButtonA;
    const elementContentButtonB = options.elementContentButtonB;
    const defaultModes = options.defaultModes[mode];
    const text = options.text;
    const textButton = !text ? defaultModes.text : text;

    document.getElementById(
      elementContentButtonA,
    ).innerHTML = `<button data-mode=${mode} data-state=${defaultModes.state} class="w-full h-[38px] xl:h-[45px] rounded-[8px] lg:rounded-[10px] ${defaultModes.theme}" ${!defaultModes.state ? "disabled" : ""}>${textButton}</button>`;
  }
}
export { MagicButton };
