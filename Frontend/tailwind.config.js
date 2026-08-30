/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16211D',
        paper: '#F1F3EC',
        surface: '#FFFFFF',
        line: '#DCE0D3',
        pine: {
          DEFAULT: '#163832',
          50: '#E9EFED',
          100: '#CBDAD5',
          400: '#2C5C52',
          600: '#163832',
          700: '#0F2924',
          900: '#081714',
        },
        gold: {
          DEFAULT: '#C9962B',
          50: '#FBF3E2',
          400: '#DAAE4C',
          500: '#C9962B',
          600: '#A87A1D',
        },
        moss: '#4C6B4F',
        rust: '#A6432E',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '5px',
        lg: '8px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,33,29,0.06), 0 1px 12px rgba(22,33,29,0.05)',
        lift: '0 12px 24px -8px rgba(22,33,29,0.22)',
      },
    },
  },
  plugins: [],
};
