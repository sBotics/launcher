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
      indigo: colors.indigo,
      green: colors.green,
      black: colors.black,
      gray: colors.gray,
      white: colors.white,
      orange: colors.orange,
      yellow: colors.yellow,
      blue: colors.blue,
      slate: colors.slate,
    },
    fontFamily: {
      sans: ['sans-serif'],
    },
    transitionProperty: {
      height: 'height',
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: colors.gray[200],
            maxWidth: '65ch',
            '[class~="lead"]': {
              color: colors.gray[600],
            },
            a: {
              color: '#2FA9C2',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: colors.white,
              fontWeight: '600',
            },
            ol: {
              listStyleType: 'decimal',
            },
            'ol[type="A"]': {
              listStyleType: 'upper-alpha',
            },
            'ol[type="a"]': {
              listStyleType: 'lower-alpha',
            },
            'ol[type="A" s]': {
              listStyleType: 'upper-alpha',
            },
            'ol[type="a" s]': {
              listStyleType: 'lower-alpha',
            },
            'ol[type="I"]': {
              listStyleType: 'upper-roman',
            },
            'ol[type="i"]': {
              listStyleType: 'lower-roman',
            },
            'ol[type="I" s]': {
              listStyleType: 'upper-roman',
            },
            'ol[type="i" s]': {
              listStyleType: 'lower-roman',
            },
            'ol[type="1"]': {
              listStyleType: 'decimal',
            },
            ul: {
              listStyleType: 'disc',
            },
            'ol > li::marker': {
              fontWeight: '400',
              color: colors.gray[200],
            },
            'ul > li::marker': {
              color: colors.gray[200],
            },
            li: {
              color: colors.gray[200],
            },
            hr: {
              borderColor: colors.gray[200],
              borderTopWidth: 1,
              marginTop: '2em',
              marginBottom: '2em',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: colors.gray[900],
              borderLeftWidth: '0.25rem',
              borderLeftColor: colors.gray[200],
            },
            h1: {
              color: colors.white,
              fontWeight: '800',
            },
            h2: {
              color: colors.white,
              fontWeight: '700',
            },
            h3: {
              color: colors.white,
              fontWeight: '600',
            },
            h4: {
              color: colors.white,
              fontWeight: '600',
            },
            p: {
              color: colors.gray[200],
            },
            // TODO: Figure out how to not need this, it's a merging issue
            'figure > *': {},
            figcaption: {
              color: colors.gray[500],
            },
            code: {
              color: colors.gray[300],
              backgroundColor: '#025F70',
              borderRadius: '3px',
              paddingTop: '2px',
              paddingBottom: '2px',
              paddingLeft: '5px',
              paddingRight: '5px',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'a code': {
              color: colors.gray[900],
            },
            pre: {
              backgroundColor: '#44475a',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: colors.gray[300],
            },
            'thead th': {
              color: colors.white,
              fontWeight: '600',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: colors.gray[200],
            },
            tfoot: {
              borderTopWidth: '1px',
              borderTopColor: colors.gray[300],
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
