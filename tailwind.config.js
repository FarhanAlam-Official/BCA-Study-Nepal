/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        toggleOn: {
          '0%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(32px) scale(1.1)' },
          '100%': { transform: 'translateX(32px) scale(1)' },
        },
        toggleOff: {
          '0%': { transform: 'translateX(32px)' },
          '60%': { transform: 'translateX(4px) scale(1.1)' },
          '100%': { transform: 'translateX(4px) scale(1)' },
        },
      },
      animation: {
        toggleOn: 'toggleOn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        toggleOff: 'toggleOff 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
};
