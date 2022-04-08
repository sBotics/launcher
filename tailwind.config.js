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
      sbotics_main: {
        bar_left: 'rgba(255, 255, 255, 0)',
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
    extend: {},
  },
  plugins: [],
};