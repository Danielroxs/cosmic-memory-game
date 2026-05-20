/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      keyframes: {
        slideDown: {
          '0%':   { transform: 'translateY(-120px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(120px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        btnBounce: {
          '0%, 100%': { transform: 'translateY(0)   scale(1)' },
          '50%':      { transform: 'translateY(-10px) scale(1.06)' },
        },
        modalPop: {
          '0%':   { transform: 'scale(0.4)', opacity: '0' },
          '70%':  { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        timerPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.3', transform: 'scale(0.8)' },
        },
        confetti: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(60px) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        slideDown:   'slideDown 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
        slideUp:     'slideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s forwards',
        btnBounce:   'btnBounce 0.45s ease-in-out infinite',
        modalPop:    'modalPop 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        timerPulse:  'timerPulse 0.6s ease-in-out infinite',
        shimmer:     'shimmer 3s linear infinite',
        float:       'float 3s ease-in-out infinite',
        starTwinkle: 'starTwinkle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
