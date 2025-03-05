module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#385754',
          50: '#EDF2F1',
          100: '#D7E2E0',
          200: '#ABC5C0',
          300: '#7FA7A0',
          400: '#538980',
          500: '#385754', // Your base color
          600: '#304A48',
          700: '#283E3C',
          800: '#1F3130',
          900: '#172524',
        },
        cream: {
          DEFAULT: '#FCF9EE',
          50: '#FFFFFF',
          100: '#FEFEFF',
          200: '#FDFEFE',
          300: '#FDFCF6',
          400: '#FCF9EE', // Your base color
          500: '#F5EED3',
          600: '#EEE3B9',
          700: '#E7D89E',
          800: '#E0CD84',
          900: '#D9C269',
        },
      },
    },
  },
  plugins: [],
};
