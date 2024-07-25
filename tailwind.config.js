/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
       'custom-blue': '#1a008f',
       'navy':'#011f4b'
       
      },

    },
  },
  plugins: [  ],
}
