import { Application } from './__instance_application.js';

let extend = require('extend-shallow');

class Exception {
  constructor() {}
  textsDefault() {
    return {
      status: '505',
      message: 'The zul has detected that something has gone wrong.',
    };
  }
  create(options) {
    options = extend(
      {
        status: '505',
        message: 'O zul detectou que algo deu errado.',
        error_name: '',
        error_message: '',
      },
      options,
    );

    sessionStorage.setItem('Exception_Status', options.status);
    sessionStorage.setItem('Exception_Message', options.message);
    sessionStorage.setItem('Exception_ERROR_Name', options.error_name);
    sessionStorage.setItem('Exception_ERROR_Message', options.error_message);

    window.location.href = '../routes/error.html';

    // if (!new Application().SLMP()) {
    //   window.location.href = '../routes/error.html';
    // } else {
    //   console.error(`${options.error_name} - ${options.error_message}`);
    // }
  }
  default() {
    sessionStorage.setItem('Exception_Status', this.textsDefault()['status']);
    sessionStorage.setItem('Exception_Message', this.textsDefault()['message']);
    sessionStorage.setItem(
      'Exception_ERROR_Name',
      this.textsDefault()['error_name'],
    );
    sessionStorage.setItem(
      'Exception_ERROR_Message',
      this.textsDefault()['error_message'],
    );
  }
}

export { Exception };
