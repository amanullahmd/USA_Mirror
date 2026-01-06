module.exports = {
  content: [
    './index.html',
    './src/app/client/src/**/*.{ts,tsx,js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
