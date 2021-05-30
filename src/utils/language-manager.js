const readJsonSync = require('read-json-sync');
import { AppDefaultPath } from '../utils/application-manager.js';

const languageAvariable = ['pt_BR'];
var defaultLanguage = '';
var languageDataBase = [];

const LanguageInit = (config) => {
  const languageConfig = config['language'];
  defaultLanguage = languageConfig ? languageConfig : 'en-US';

  try {
    languageDataBase =
      languageAvariable.indexOf(defaultLanguage) > -1
        ? readJsonSync(`${AppDefaultPath()}/language/${defaultLanguage}.json`)
        : '';
  } catch (error) {
    languageDataBase = '';
  }
};

const Lang = (text) => {
  if (!text) return '';
  return languageDataBase
    ? languageDataBase[text]
      ? languageDataBase[text]
      : text
    : text;
};

export { defaultLanguage, languageDataBase, LanguageInit, Lang };
