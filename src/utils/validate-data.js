var extend = require('extend-shallow');

const Email = (email) => {
  const r = /^[^\s@]+@[^\s@]+$/;
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
