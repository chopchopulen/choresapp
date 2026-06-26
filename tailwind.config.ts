import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:       '#FFF8F0',
        pink:        '#FF8FA3',
        mint:        '#7FD9C4',
        yellow:      '#FFD66B',
        plum:        '#6B5B95',
        'deep-plum': '#3A2E39',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body:    ['Inter',     'sans-serif'],
        accent:  ['Caveat',    'cursive'],
      },
    },
  },
} satisfies Config
