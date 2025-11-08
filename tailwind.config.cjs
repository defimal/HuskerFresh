module.exports = {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        husker: '#D00000',
        huskerDark: '#7A0000',
        banana: '#FFD84D',
        midnight: '#140400'
      },
      boxShadow: {
        peel: '0 10px 25px rgba(0,0,0,0.15)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
