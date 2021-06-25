var extend = require('extend-shallow');
const axios = require('axios').default;

const URLdictionary = {
  Google: 'https://google.com',
  GitHub: 'https://github.com',
  wEduc: 'https://weduc.natalnet.br',
  sBotics: 'https://sbotics.weduc.natalnet.br',
  DataGithub: 'https://raw.githubusercontent.com/sBotics/builds/main/data.json',
  NextCompetition:
    'https://raw.githubusercontent.com/sBotics/builds/main/launcher/nextCompetition.json',
  MyIP: 'https://meuip.herokuapp.com/api/json',
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
};

const UserData = (options) => {
  options = extend(
    {
      accessToken: '',
    },
    options,
  );
  const accessToken = options.accessToken;

  if (!accessToken) return false;

  return new Promise((resolve, reject) => {
    axios
      .get('https://weduc.natalnet.br/api/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(false);
      });
  });
};

const DataRequest = (options) => {
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
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
        reject(false);
      });
  });
};

export { URLdictionary, ValidateConnection, UserData, DataRequest };
