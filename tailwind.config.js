const colors = require('tailwindcss/colors');

module.exports = {
    content: ["./routes/*.html", "./src/**/*.js"],
    theme: {
        colors: {
            sbotics_gray: {
                100: "#f4EEF2",
                400: "#8E8E93",
                900: "#252425",
            },
            red: colors.red,
            green: colors.green,
            black: colors.black,
            gray: colors.gray,
        },
        fontFamily: {
            sans: ['sans-serif'],
        },
        extend: {},
    },
    plugins: [],
}