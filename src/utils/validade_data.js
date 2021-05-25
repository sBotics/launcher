var extend = require('extend-shallow');

const Email = (email) => {
  const r =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return r.test(email);
};

const Password = (options) => {
  options = extend(
    {
      pass: '',
      minimalLength: 8,
    },
    options,
  );
  const pass = options.pass;

  const minimalLength = options.minimalLength;

  return pass ? (pass.length < minimalLength ? false : true) : false;
};

export { Email, Password };
