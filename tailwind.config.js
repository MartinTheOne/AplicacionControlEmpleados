/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./api/**/*.js","../path/to/datatables.net/js/dataTables.min.js"],
  theme: {
    extend: {},
  },
  plugins: [],

  flyonui: {
    vendors: true 
  }
};
