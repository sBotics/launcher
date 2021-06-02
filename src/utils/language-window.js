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

export { LoginTranslator };
