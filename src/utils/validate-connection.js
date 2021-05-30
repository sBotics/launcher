var extend = require('extend-shallow');
const axios = require('axios').default;

const URLdictionary = {
  Google: 'https://google.com',
  GitHub: 'https://github.com',
  wEduc: 'https://weduc.natalnet.br',
  sBotics: 'https://sbotics.weduc.natalnet.br',
};

const ValidateConnection = (options) => {
  options = extend(
    {
      url: '',
    },
    options,
  );

  const url = options.url;

  if (!url) return false;

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(function (response) {
        return response.status == 200 ? resolve(true) : reject(false);
      })
      .catch(function (error) {
        return reject(false);
      });
  });
};;

export { URLdictionary, ValidateConnection };
