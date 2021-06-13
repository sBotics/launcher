var extend = require('extend-shallow');
const axios = require('axios').default;
import { Email, Password } from '../utils/validate-data.js';
import { CreateTopAlert } from '../utils/top-alert.js';
import { CreateUserFile, OpenUserFile } from '../class/__file_user.js';
import { UserData } from '../utils/connection-manager.js';
import { LoginClose, IndexOpen } from '../utils/window-manager.js';
import { Lang } from '../utils/language-manager.js';
import { GetMacAddress } from '../utils/mac-address-manager.js';

const authFormLogin = document.getElementById('AuthLogin');

const MessageLabel = (options) => {
  options = extend(
    {
      element: '',
      label: '',
      message: '',
      remove: 'input',
      remove_2: '',
      add: 'is-invalid',
    },
    options,
  );
  options.element.classList.remove(options.remove);
  if (options.remove_2) options.element.classList.remove(options.remove_2);
  options.element.classList.add(options.add);
  options.label.innerHTML = options.message;
};

$(document).on('input', '#UserEmail', () => {
  const userEmail = document.getElementById('UserEmail');
  if (userEmail.value) {
    MessageLabel({
      element: userEmail,
      label: document.getElementById('UserEmailLabel'),
      remove: 'is-invalid',
      remove_2: 'input',
      add: 'is-valid',
    });
  } else
    MessageLabel({
      element: userEmail,
      label: document.getElementById('UserEmailLabel'),
      remove: 'is-valid',
      add: 'input',
    });
});

$(document).on('input', '#UserPassword', () => {
  const userPassword = document.getElementById('UserPassword');
  if (userPassword.value) {
    MessageLabel({
      element: userPassword,
      label: document.getElementById('UserPasswordLabell'),
      remove: 'is-invalid',
      remove_2: 'input',
      add: 'is-valid',
    });
  } else
    MessageLabel({
      element: userPassword,
      label: document.getElementById('UserPasswordLabell'),
      remove: 'is-valid',
      add: 'input',
    });
});
var RememberCredential = false;
$('#UserRememberCredential').on('change', function () {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    $('.messageWarningLogin')
      .removeClass('text-secondary')
      .addClass('text-warning');
    RememberCredential = true;
  } else {
    $(this).attr('value', 'false');
    $('.messageWarningLogin')
      .removeClass('text-warning')
      .addClass('text-secondary');
    RememberCredential = false;
  }
});

authFormLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const userEmail = document.getElementById('UserEmail');
  const userEmailValue = userEmail.value;
  const userEmailLabel = document.getElementById('UserEmailLabel');
  const userPassword = document.getElementById('UserPassword');
  const userPasswordValue = userPassword.value;
  const userPasswordLabel = document.getElementById('UserPasswordLabell');
  if (userEmailValue && userPasswordValue) {
    const email = Email(userEmailValue);
    const pass = Password({ pass: userPasswordValue });
    if (email && pass) {
      axios
        .post(process.env.AUTH_URL, {
          email: userEmailValue,
          password: userPasswordValue,
          device_name: 'sBotics',
        })
        .then(function (response) {
          const access_token = response['data']['access_token'];
          UserData({
            accessToken: access_token,
          })
            .then((response) => {
              (async () => {
                const macAddress = (await GetMacAddress())
                  ? await GetMacAddress()
                  : '';

                if (
                  !CreateUserFile({
                    data: {
                      name: response['email'],
                      email: response['email'],
                      profilePicture: response['profile_photo_url'],
                      locale: response['locale'],
                      accessToken: access_token,
                      logged: RememberCredential,
                      macAddress: macAddress,
                    },
                  })
                ) {
                  CreateTopAlert({
                    states: 'danger',
                    idInner: 'TopAlertError',
                    absolute: true,
                    message: Lang(
                      'An unexpected failure happened! Try again later.',
                    ),
                  });
                  MessageLabel({ element: userEmail, label: userEmailLabel });
                  MessageLabel({
                    element: userPassword,
                    label: userPasswordLabel,
                  });
                  return;
                }

                IndexOpen();
                LoginClose();
              })();
            })
            .catch((err) => {
              CreateTopAlert({
                states: 'danger',
                idInner: 'TopAlertError',
                absolute: true,
                message: Lang(
                  'An unexpected failure to find data! Try again later.',
                ),
              });
              MessageLabel({ element: userEmail, label: userEmailLabel });
              MessageLabel({
                element: userPassword,
                label: UserPasswordLabell,
              });
            });
        })
        .catch(function (error) {
          CreateTopAlert({
            states: 'danger',
            idInner: 'TopAlertError',
            absolute: true,
            message: Lang('These credentials were not found in our records.'),
          });
          MessageLabel({ element: userEmail, label: userEmailLabel });
          MessageLabel({ element: userPassword, label: UserPasswordLabell });
        });
    } else {
      if (!email)
        MessageLabel({
          element: userEmail,
          label: userEmailLabel,
          message: Lang('Enter a valid email address.'),
        });
      if (!pass)
        MessageLabel({
          element: userPassword,
          label: userPasswordLabel,
          message: Lang('The password must be at least 8 characters long.'),
        });
    }
  } else {
    if (!userEmailValue)
      MessageLabel({
        element: userEmail,
        label: userEmailLabel,
        message: Lang('Enter an email.'),
      });
    if (!userPasswordValue)
      MessageLabel({
        element: userPassword,
        label: userPasswordLabel,
        message: Lang('Enter a password.'),
      });
  }
});
