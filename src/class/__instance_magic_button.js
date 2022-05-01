var extend = require('extend-shallow');

let buttonsInstances = false;

class MagicButton {
  modes() {
    return {
      start: {
        button_A: {
          theme:
            'bg-green-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-circle-play text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Pronto Para Iniciar</span>`,
          state: true,
        },
        button_B: {
          theme:
            'bg-green-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-circle-play text-[20px] ml-3"></i></div><span class="text-[11px] lg:text-[14px] font-medium">Pronto Para Iniciar</span>`,
          state: true,
        },
      },
      install: {
        button_A: {
          theme:
            'bg-indigo-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-download text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Instalar sBotics</span>`,
          state: true,
        },
        button_B: {
          theme:
            'bg-indigo-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-download text-[20px] ml-3"></i></div><span class="text-[11px] lg:text-[14px] font-medium">Instalar sBotics</span>`,
          state: true,
        },
      },
      update: {
        button_A: {
          theme:
            'bg-blue-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-download text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Atualizar sBotics</span>`,
          state: true,
        },
        button_B: {
          theme:
            'bg-blue-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-download text-[20px] ml-3"></i></div><span class="text-[11px] lg:text-[14px] font-medium">Atualizar sBotics</span>`,
          state: true,
        },
      },
      process: {
        button_A: {
          theme:
            'bg-gray-600 text-white uppercase flex items-center justify-center',
          text: ``,
          state: false,
        },
        button_B: {
          theme:
            'bg-gray-600 text-white uppercase flex items-center justify-center',
          text: ``,
          state: false,
        },
      },
      repair_installation: {
        button_A: {
          theme:
            'bg-orange-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-wrench text-[20px] ml-3"></i></div><span class="text-[14px] font-medium">Reparar Instalação sBotics</span>`,
          state: true,
        },
        button_B: {
          theme:
            'bg-orange-600 text-white uppercase flex items-center justify-center relative',
          text: `<div class="absolute w-full flex justify-start"><i class="fa-duotone fa-wrench text-[20px] ml-3"></i></div><span class="text-[11px] lg:text-[14px] font-medium">Reparar Instalação sBotics</span>`,
          state: true,
        },
      },
      fail: {
        button_A: {
          theme:
            'bg-red-600 text-white uppercase flex items-center justify-center',
          text: ``,
          state: false,
        },
        button_B: {
          theme:
            'bg-red-600 text-white uppercase flex items-center justify-center',
          text: ``,
          state: false,
        },
      },
    };
  }

  constructor(options) {
    options = extend(
      {
        mode: '',
        defaultModes: this.modes(),
        elementContentButtonA: '__container_magic_button',
        elementContentButtonB: '__container_fixed_magic_button',
        text: '',
      },
      options,
    );

    const mode = options.mode;

    if (!mode) return false;

    const defaultModes = options.defaultModes[mode];
    const text = options.text;

    document.getElementById(
      options.elementContentButtonA,
    ).innerHTML = `<button data-mode=${mode} data-state=${
      defaultModes.button_A.state
    } class="w-full h-[38px] xl:h-[45px] rounded-[8px] lg:rounded-[10px] ${
      defaultModes.button_A.theme
    }" ${!defaultModes.button_A.state ? 'disabled' : ''}>${
      !text
        ? defaultModes.button_A.text
        : `<span class="text-[14px] font-medium">${text}</span>`
    }</button>`;

    let contentButtonBInner = document.getElementById(
      options.elementContentButtonB,
    );

    contentButtonBInner.innerHTML = `<button data-mode=${mode} data-state=${
      defaultModes.button_B.state
    } class="py-[8px] md:py-[8px] md:px-[40px] lg:py-[10px] lg:px-[80px] xl:px-[110px] rounded-[8px] lg:rounded-[10px] mr-0 md:mr-[5px] lg:mr-[15px] mt-[15px] md:mt-0 ${
      defaultModes.button_B.theme
    }" ${!defaultModes.button_B.state ? 'disabled' : ''}>${
      !text
        ? defaultModes.button_B.text
        : `<span class="text-[11px] lg:text-[14px] font-medium">${text}</span>`
    }</button> 
    <div
        class="w-full flex md:hidden flex-row items-center justify-between mt-[8px] md:mt-0 mb-[8px] md:mb-0">
        <hr class="w-1/2 text-white" />
        <span class="text-[#9F9F9F] font-bold uppercase px-[15px]">ou</span>
        <hr class="w-1/2 bg-white" />
    </div>
    <button
        class="py-[8px] md:py-[8px] md:px-[20px] lg:py-[10px] lg:px-[26px] bg-[#292D31] text-[11px] lg:text-[14px] font-medium text-[#9F9F9F] rounded-[8px] lg:rounded-[10px] uppercase"
        onclick="OpenInstallFolder()">
        Abrir Pasta de Instalação
    </button>
    `;
  }
}
export { MagicButton };
