var extend = require('extend-shallow');

class ProgressBar {
  constructor() {}
  defaultState() {
    return {
      warning: {
        bg: 'bg-orange-500',
      },
      danger: {
        bg: 'bg-red-500',
      },
      success: {
        bg: 'bg-green-500',
      },
      info: {
        bg: 'bg-blue-500',
      },
    };
  }
  clear() {
    document.getElementById('__container_progress_bar').innerHTML = '';
  }
  activate(options) {
    if (!options) options = { clear: false };
    document
      .getElementById('__container_progress_bar')
      .classList.remove('hidden');
    document.getElementById('__container_progress_bar').classList.add('flex');
    if (options.clear) this.clear();
  }
  disable(options) {
    if (!options) options = { clear: false };
    document
      .getElementById('__container_progress_bar')
      .classList.remove('flex');
    document.getElementById('__container_progress_bar').classList.add('hidden');
    if (options.clear) this.clear();
  }
  create(options) {
    options = extend(
      {
        percentage: '0',
        progressBarContainer: '__container_progress_bar',
        state: '',
        id: '',
        prefix: '__sBotics_Download',
      },
      options,
    );

    document.getElementById(
      options.progressBarContainer,
    ).innerHTML += `<div id="${options.prefix}_${
      options.id
    }" class="w-full block transition-height duration-[2000ms] ease-in-out ${
      options.state ? this.defaultState()[options.state].bg : ''
    }" style="height: ${options.percentage > 100 ? 100 : options.percentage}%;"></div>`;
  }
}

export { ProgressBar };
