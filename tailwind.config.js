/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.{html,js}'],
  darkMode: ['class'],
  theme: {
    colors: {
      'black-1': 'hsl(0 0% 2%)',
      'black-2': 'hsl(0 0% 12%)',
      'black-3': 'hsl(0 0% 18%)',
      'black-4': 'hsl(0 0% 23%)',
      'gray-1': 'hsl(0 0% 46%)',
      'gray-2': 'hsl(0 0% 91%)',
      'gray-3': 'hsl(0 0% 96%)',
      white: 'hsl(0 0% 100%)',
      purple: 'hsl(274 82% 60%)',
      red: 'hsl(0 100% 66%)'
    },
    fontFamily: {
      inter: 'Inter',
      lora: 'Lora',
      inconsolata: 'Inconsolata'
    },
    fontSize: {
      'mbody-s': ['0.875rem', '17px'],
      'mbody-m': ['0.9375rem', '24px'],
      'mheading-s': ['1rem', '19px'],
      'mheading-m': ['1.125rem', '24px'],
      'mheading-l': ['2rem', '39px'],
      'body-m': ['1.125rem', '24px'],
      'heading-s': ['1.25rem', '24px'],
      'heading-m': ['1.5rem', '29px'],
      'heading-l': ['4rem', '77px']
    },
    extend: {}
  },
  plugins: []
}
