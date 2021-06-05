import { LanguageInit, LangElement } from '../utils/language-manager.js';
import { OpenConfig } from '../class/__file_config.js';

const LoginTranslator = () => {
  LanguageInit(OpenConfig());
  LangElement('UserPasswordLabel', 'Password:');
  LangElement('UserPassword', 'Password', true);
  LangElement('Text_remember_me', 'Remember me');
  LangElement(
    'Text_alert_save_credentials',
    'On the next login, your computer will remember your credentials.',
  );
  LangElement('RegisterwEduc', 'Create a wEduc account');
  LangElement('ForgotPasswordwEduc', 'Forgot your password?');
  LangElement('ButtonSubmit', 'Access');
};

const IndexTranslator = () => {
  LanguageInit(OpenConfig());
  LangElement('Or', 'OR');
  LangElement('TextMagicButtonNewFolder', 'Open installation folder');
  LangElement('Text_Last_Version', 'Latest Version');
  LangElement('Text_Version', 'Version');
  LangElement('Text_Description', 'Description');
  LangElement(
    'Path_Note_Description',
    'sBotics is a simulation platform designed to emulate various world-famous robotics competitions, where kits are commonly used to perform the required actions. This platform offers an alternative for those seeking to test and improve their skills in the field as well as being able to test programs without the risk of damaging physical parts.',
  );
};
export { LoginTranslator, IndexTranslator };
