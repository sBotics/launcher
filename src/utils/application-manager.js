const { app } = require('electron');

const GetLocaleLanguage = () => {
  const locale = app.getLocale().replace('-', '_');
  return locale ? locale : 'en_US';
};

export { GetLocaleLanguage };
