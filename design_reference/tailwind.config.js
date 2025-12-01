/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          base: '#2D8CFF',
          hover: '#2575D9',
          pressed: '#1C5CAD',
        },
        secondary: {
          base: '#9B5CFF',
          hover: '#8447E0',
          pressed: '#6732B5',
        },
        accent: {
          success: '#00C48C',
          warning: '#FFB020',
          error: '#FF5A5F',
          info: '#2D8CFF',
        },
        neutral: {
          bgPage: '#F5F7FB',
          bgCard: '#FFFFFF',
          bgSoft: '#F0F3F9',
          borderSubtle: '#E1E4EC',
          textPrimary: '#101320',
          textSecondary: '#6F7483',
          textOnPrimary: '#FFFFFF',
          iconMuted: '#B4B9C7',
        },
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '20px',
        'xl': '28px',
        'pill': '999px',
      },
      boxShadow: {
        'card': '0 12px 30px -10px rgba(16, 19, 32, 0.08)',
        'floating': '0 18px 40px -12px rgba(12, 19, 38, 0.16)',
        'button': '0 4px 12px -2px rgba(8, 20, 60, 0.28)',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Text', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

