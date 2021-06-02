const readJsonSync = require('read-json-sync');
import { AppDefaultPath } from '../utils/application-manager.js';
import { OpenConfig } from '../class/__file_config.js';

const languageAvariable = ['pt_BR'];
var defaultLanguage = '';
var oldDefaultLanguage = '';
var languageDataBase = [];

const LanguageInit = (config) => {
  const languageConfig = config['language'];
  oldDefaultLanguage = defaultLanguage;
  defaultLanguage =
    languageAvariable.indexOf(languageConfig) > -1 ? languageConfig : 'en_US';
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
  if (languageDataBase[text] == undefined) LanguageInit(OpenConfig());
  return languageDataBase
    ? languageDataBase[text]
      ? languageDataBase[text]
      : text
    : text;
};

const LangElement = (element, defaultText, input = false) => {
  const textElement = input
    ? document.getElementById(element).placeholder
    : document.getElementById(element).innerHTML;
  const textElmenteResolve = textElement
    .trim()
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s+/g, ' ');
  console.log('estou aqui1');
  // if (oldDefaultLanguage == defaultLanguage) return;
  if (!element || !textElmenteResolve)
    return input
      ? (document.getElementById(element).placeholder = defaultText)
      : (document.getElementById(element).innerHTML = defaultText);
  const textLanguage =
    defaultLanguage != 'en_US'
      ? Lang(languageDataBase[textElmenteResolve])
      : defaultText;
  if (input) document.getElementById(element).placeholder = textLanguage;
  else document.getElementById(element).innerHTML = textLanguage;
};

export { defaultLanguage, languageDataBase, LanguageInit, Lang, LangElement };
