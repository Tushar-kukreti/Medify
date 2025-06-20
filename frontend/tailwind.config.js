// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for automatic based on system
  content: [
    './index.html',
    './src/**/*.{js,jsx}', // make sure Tailwind scans these files
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#1CA7EC',      // Bright blue
        sunset: '#FF6B6B',     // Coral red
        forest: '#228B22',     // Forest green
        lavender: '#B57EDC',   // Soft purple
        bg_white: '#fcfffd',  // Off-white background
        bg_light_sky: '#daffef', // Light sky blue background
        bg_dim_sky: '#c0fdfb', // Dim sky blue background
        bg_sky: '#64b6ac', // Sky blue background
        bg_grey: '#5d737e' // grey background
      },
    },
  },
  plugins: [],
}