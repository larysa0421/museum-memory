/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        parchment: '#F2EBE0',
        brown: {
          DEFAULT: '#4A3728',
          light: '#7A5C48',
          dark: '#2E1F12',
        },
        warm: {
          gray: '#8C7B6E',
          tan: '#C4A882',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Georgia"', 'serif'],
        sans: ['"Noto Sans SC"', '"system-ui"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
