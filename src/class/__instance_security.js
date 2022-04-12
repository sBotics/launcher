var extend = require('extend-shallow');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.APP_KEY);

class Security {
  constructor() {}
  encrypted(options) {
    options = extend(
      {
        data: '',
      },
      options,
    );
    const data = options.data;
    return data ? cryptr.encrypt(data) : false;
  }
  decrypted(options) {
    options = extend(
      {
        data: '',
      },
      options,
    );
    const data = options.data;
    return data ? cryptr.decrypt(data) : false;
  }
}

export { Security };
