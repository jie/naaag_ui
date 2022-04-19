const colors = require('tailwindcss/colors')

colors.knitx = {
  borderGray: '#F6F6F6',
  bgGray: '#F6F6F6'
}


module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    colors: colors,
    extend: {},
  },
  plugins: []
}
