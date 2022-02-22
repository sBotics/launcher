var extend = require('extend-shallow');
const axios = require('axios').default;

const URLdictionary = {
  auth: 'http://auth.sbotics.localhost',
  login: `http://auth.sbotics.localhost/login?provider=eyJpdiI6IlRIUUw4aVJIVmFZcytsSDFGVFVpUlE9PSIsInZhbHVlIjoicHRib3Qvc3gxTllsUncrSUxtV2p6L2g2V1Z6L0YwRFZ6b2JEb3BSby9reFJjOTJ0aHhiODhxT0dHNk9wZ2xlTTh4d3VwUHd5UHpGU0FKekMxbnJDc3c9PSIsIm1hYyI6IjAxODhjZTA2NmFlYjBkZjE3OTZkMjZiNmQ4MjYwYmZiMjAwNDg4NDgyZDhjZDBmYzE3ODgzZTU1MDNjNjk3MmIiLCJ0YWciOiIifQ==`,
  register: `http://auth.sbotics.localhost/register?provider=eyJpdiI6IlRIUUw4aVJIVmFZcytsSDFGVFVpUlE9PSIsInZhbHVlIjoicHRib3Qvc3gxTllsUncrSUxtV2p6L2g2V1Z6L0YwRFZ6b2JEb3BSby9reFJjOTJ0aHhiODhxT0dHNk9wZ2xlTTh4d3VwUHd5UHpGU0FKekMxbnJDc3c9PSIsIm1hYyI6IjAxODhjZTA2NmFlYjBkZjE3OTZkMjZiNmQ4MjYwYmZiMjAwNDg4NDgyZDhjZDBmYzE3ODgzZTU1MDNjNjk3MmIiLCJ0YWciOiIifQ==`,
  MyIP: 'http://meuip.com/api/meuip.php',

  DataGithub: 'https://raw.githubusercontent.com/sBotics/builds/main/data.json',
  NextCompetition:
    'https://raw.githubusercontent.com/sBotics/builds/main/launcher/nextCompetition.json',

  Alert:
    'https://raw.githubusercontent.com/sBotics/builds/main/launcher/alerts/',
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

  return new Promise((resolve, reject) => {
    if (!accessToken) reject(false);

    axios
      .get(`${URLdictionary['auth']}/api/user`, {
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

const DataUpdateState = async () => {
  const dataGithub = await DataRequest({ url: URLdictionary['DataGithub'] });
  return new Promise((resolve, reject) => {
    if (!dataGithub) reject(false);
    resolve(dataGithub['update_launcher']);
  });
};

export {
  URLdictionary,
  ValidateConnection,
  UserData,
  DataRequest,
  DataUpdateState,
};
