var extend = require('extend-shallow');
const axios = require('axios').default;

const URLdictionary = {
  auth: 'https://auth.sbotics.net',
  login: `https://auth.sbotics.net/login?provider=eyJpdiI6ImxIZEpnQnB1VHZEbVNjNlhhWkFNWmc9PSIsInZhbHVlIjoiQWt5TWhrMTMzbXlYN2JydFZkOWNkU25CR1Q4b1JlVEVZalljRkZiZDlRdWZqUDNuYkZsV3ZCaGxNUjZrZ0w3a2F1cGZ5YzhRVlh6TkFxQlgvRzJRS3c9PSIsIm1hYyI6IjI3NWExNDY4M2E3ODQ3NDRhNGJhNWZjODAzZDRhZmIxM2Y4YTUwYzI2NjNkMzEyZGQ3YWMwNzNkNWNkZDlmZmYiLCJ0YWciOiIifQ==`,
  register: `https://auth.sbotics.net/register?provider=eyJpdiI6ImxIZEpnQnB1VHZEbVNjNlhhWkFNWmc9PSIsInZhbHVlIjoiQWt5TWhrMTMzbXlYN2JydFZkOWNkU25CR1Q4b1JlVEVZalljRkZiZDlRdWZqUDNuYkZsV3ZCaGxNUjZrZ0w3a2F1cGZ5YzhRVlh6TkFxQlgvRzJRS3c9PSIsIm1hYyI6IjI3NWExNDY4M2E3ODQ3NDRhNGJhNWZjODAzZDRhZmIxM2Y4YTUwYzI2NjNkMzEyZGQ3YWMwNzNkNWNkZDlmZmYiLCJ0YWciOiIifQ==`,
  MyIP: 'http://meuip.com/api/meuip.php',
  userProfile: `https://auth.sbotics.net/user/profile`,

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
