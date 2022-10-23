/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ["./src/*.{html,js}", './node_modules/tw-elements/dist/js/**/*.js'],
  theme: {
    extend: {},
    colors: {
        green: colors.green,
        slate: colors.slate,
        blue: colors.blue,
        white: colors.white,
        pink: colors.pink,
        'soil': {
            600: '#92745b',
            700: '#715a47',
            800: '#524133',
        },
        'water': {
            600: '#5080d0',
            700: '#3163b9',
            800: '#274e91',
        },
        'worm': {
            600: '#eb7a7c',
            700: '#e44e50',
            800: '#de2124',
        },
        'seed': {
            600: '#52a130',
            700: '#3e7a24',
            800: '#2a5219', 
        }
    }
  },
  plugins: [require('tw-elements/dist/plugin')],
}
