var extend = require('extend-shallow');
const axios = require('axios').default;
import { Email, Password } from '../utils/validade_data.js';

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
      label: document.getElementById('UserPasswordLabel'),
      remove: 'is-invalid',
      remove_2: 'input',
      add: 'is-valid',
    });
  } else
    MessageLabel({
      element: userPassword,
      label: document.getElementById('UserPasswordLabel'),
      remove: 'is-valid',
      add: 'input',
    });
});

authFormLogin.addEventListener('submit', (e) => {
  e.preventDefault();

  const userEmail = document.getElementById('UserEmail');
  const userEmailValue = userEmail.value;
  const userEmailLabel = document.getElementById('UserEmailLabel');

  const userPassword = document.getElementById('UserPassword');
  const userPasswordValue = userPassword.value;
  const userPasswordLabel = document.getElementById('UserPasswordLabel');

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
          console.log(response['data']);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      if (!email)
        MessageLabel({
          element: userEmail,
          label: userEmailLabel,
          message: 'Digite um email valido.',
        });
      if (!pass)
        MessageLabel({
          element: userPassword,
          label: userPasswordLabel,
          message: 'A senha deve ter pelo menos 8 caracteres.',
        });
    }
  } else {
    if (!userEmailValue)
      MessageLabel({
        element: userEmail,
        label: userEmailLabel,
        message: 'Digite um email.',
      });
    if (!userPasswordValue)
      MessageLabel({
        element: userPassword,
        label: userPasswordLabel,
        message: 'Digite uma senha.',
      });
  }
});
