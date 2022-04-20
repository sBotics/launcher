let extend = require('extend-shallow');

export function ExceptionController(options) {
  options = extend(
    {
      status: '',
    },
    options,
  );
  window.location.href = '../../routes/error.html';
}
