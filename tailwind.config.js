/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D4AF37',
          600: '#C9A227',
          700: '#b7791f',
          800: '#92400e',
          900: '#78350f',
        },
        black: {
          DEFAULT: '#040d21',
          800: '#071630',
          700: '#0c1e40',
          600: '#122550',
          500: '#1a2f63',
          400: '#223a75',
        },
        electric: {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #C9A227 100%)',
        'dark-gradient':  'linear-gradient(135deg, #040d21 0%, #0c1e40 100%)',
        'blue-gradient':  'linear-gradient(135deg, #1e3a8a 0%, #0284c7 60%, #0891b2 100%)',
        'hero-gradient':  'radial-gradient(ellipse at top, #3b82f635 0%, transparent 65%)',
        'hero-gradient2': 'radial-gradient(ellipse at bottom right, #06b6d418 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
