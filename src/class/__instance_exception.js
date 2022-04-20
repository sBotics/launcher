let extend = require('extend-shallow');

class Exception {
  constructor() {}
  textsDefault() {
    return {
      status: 'OH NO',
      message: 'The zul has detected that something has gone wrong.',
    };
  }
  create(options) {
    options = extend(
      {
        status: '',
        message: '',
      },
      options,
    );
    sessionStorage.setItem(
      'Exception_Status',
      options.status ?? this.textsDefault()['status'],
    );
    sessionStorage.setItem(
      'Exception_Message',
      options.message ?? this.textsDefault()['message'],
    );
    window.location.href = '../routes/error.html';
  }
  default() {
    sessionStorage.setItem('Exception_Status', this.textsDefault()['status']);
    sessionStorage.setItem('Exception_Message', this.textsDefault()['message']);
  }
}

export { Exception };
