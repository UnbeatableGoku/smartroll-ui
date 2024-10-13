/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#171717',
        secondary: '#404040',
        error: '#b91c1c',
        dataTableIcon: '#ABABAB',
        sidebar: {
          primary: '#161C28',
          secondary: '#707070',
        },
        button: {
          primary: '#000',
          secondary: '#fff',
        },
        green: {
          light: '#a6f1a18c',
          dark: '#82d77cbd',
          darker: '#449b44',
        },
      },
    },
  },
  plugins: [],
}
