/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f7',
          100: '#dcf2ed',
          200: '#bce5db',
          300: '#8dd1c1',
          400: '#5bb5a3',
          500: '#3d9b87',
          600: '#2d7d6e',
          700: '#26655a',
          800: '#215149',
          900: '#1e443e',
          950: '#0d2621',
        },
        accent: {
          50: '#f5f6fa',
          100: '#eaecf4',
          200: '#d0d4e7',
          300: '#a8b1d4',
          400: '#7888bc',
          500: '#5566a6',
          600: '#434f8c',
          700: '#384072',
          800: '#31375f',
          900: '#2c3151',
          950: '#1d1f35',
        },
        neutral: {
          50: '#faf9f7',
          100: '#f0ede6',
          200: '#e0dcd2',
          300: '#cdc6b8',
          400: '#b5ab98',
          500: '#a0947e',
          600: '#8a7e6a',
          700: '#726858',
          800: '#5e564a',
          900: '#4d473e',
          950: '#28241f',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}