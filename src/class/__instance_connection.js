let extend = require('extend-shallow');
const axios = require('axios').default;

class Connection {
  constructor() {}
  getDictionary() {
    return {
      auth: 'https://auth.sbotics.net',
      login: `https://auth.sbotics.net/login?provider=eyJpdiI6ImxIZEpnQnB1VHZEbVNjNlhhWkFNWmc9PSIsInZhbHVlIjoiQWt5TWhrMTMzbXlYN2JydFZkOWNkU25CR1Q4b1JlVEVZalljRkZiZDlRdWZqUDNuYkZsV3ZCaGxNUjZrZ0w3a2F1cGZ5YzhRVlh6TkFxQlgvRzJRS3c9PSIsIm1hYyI6IjI3NWExNDY4M2E3ODQ3NDRhNGJhNWZjODAzZDRhZmIxM2Y4YTUwYzI2NjNkMzEyZGQ3YWMwNzNkNWNkZDlmZmYiLCJ0YWciOiIifQ==`,
      register: `https://auth.sbotics.net/register?provider=eyJpdiI6ImxIZEpnQnB1VHZEbVNjNlhhWkFNWmc9PSIsInZhbHVlIjoiQWt5TWhrMTMzbXlYN2JydFZkOWNkU25CR1Q4b1JlVEVZalljRkZiZDlRdWZqUDNuYkZsV3ZCaGxNUjZrZ0w3a2F1cGZ5YzhRVlh6TkFxQlgvRzJRS3c9PSIsIm1hYyI6IjI3NWExNDY4M2E3ODQ3NDRhNGJhNWZjODAzZDRhZmIxM2Y4YTUwYzI2NjNkMzEyZGQ3YWMwNzNkNWNkZDlmZmYiLCJ0YWciOiIifQ==`,
      myIp: 'http://meuip.com/api/meuip.php',
      userProfile: `https://auth.sbotics.net/user/profile`,
      release: `https://sbotics.net/api/release`,
    };
  }
  getUser(options) {
    options = extend(
      {
        accessToken: '',
      },
      options,
    );

    return new Promise((resolve, reject) => {
      if (!options.accessToken) reject(false);

      axios
        .get(`${this.getDictionary()['auth']}/api/user`, {
          headers: {
            Authorization: `Bearer ${options.accessToken}`,
          },
        })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  getRelease(options) {
    options = extend(
      {
        prefix: 'sbotics_simulator',
        platform: '',
        type: 'primary',
        version: 'last',
      },
      options,
    );

    return new Promise((resolve, reject) => {
      if (!options.platform) reject(false);
      axios
        .get(
          `${this.getDictionary()['release']}/${options.prefix}/${
            options.platform
          }/${options.type}/${options.version}`,
        )
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}

export { Connection };
