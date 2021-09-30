const macAddress = require('macaddress');

const GetMacAddress = () => {
  return new Promise((resolve, reject) => {
    macAddress.one((err, mac) => {
      if (err) reject(err);
      resolve(mac ? mac : false);
    });
  });
};

export { GetMacAddress };
