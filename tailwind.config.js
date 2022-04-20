const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./routes/*.html', './src/**/*.js'],
  theme: {
    colors: {
      sbotics_gray: {
        100: '#f4EEF2',
        400: '#8E8E93',
        900: '#252425',
      },
      zul: {
        100: '#F2FDFF',
        200: '#D4E9ED',
        300: '#B6D6DB',
        400: '#98C2C9',
        500: '#2FA9C2',
        600: '#5C9AA6',
        700: '#3E8794',
        800: '#207382',
        900: '#025F70',
      },
      red: colors.red,
      green: colors.green,
      black: colors.black,
      gray: colors.gray,
      white: colors.white,
    },
    fontFamily: {
      sans: ['sans-serif'],
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
