import { backdrop, TextVersion } from '../class/__interface_components.js';
import { LinkOpen } from '../utils/window-manager.js';
import { LoginTranslator } from '../utils/language-window.js';
$(document).ready(() => {
  backdrop({
    elementName: 'backdrop',
  });
  TextVersion({ elementName: 'TextVersion' });
  LoginTranslator();
});

$('#RegisterwEduc').click(() => {
  LinkOpen('https://auth.weduc.natalnet.br/register', 'sBotics Launcher');
});
$('#ForgotPasswordwEduc').click(() => {
  LinkOpen(
    'https://auth.weduc.natalnet.br/forgot-password',
    'sBotics Launcher',
  );
});
