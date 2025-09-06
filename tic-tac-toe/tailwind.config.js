/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce': 'bounce 0.6s ease-in-out',
        'pulse': 'pulse 2s ease-in-out infinite',
        'dice-roll': 'diceRoll 0.8s linear',
        'crash-left': 'diceCrashLeft 0.6s ease-in-out forwards',
        'crash-right': 'diceCrashRight 0.6s ease-in-out forwards',
      },
      keyframes: {
        diceRoll: {
          '0%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
          '16%': { transform: 'perspective(1000px) rotateX(90deg) rotateY(45deg) rotateZ(90deg)' },
          '33%': { transform: 'perspective(1000px) rotateX(180deg) rotateY(90deg) rotateZ(180deg)' },
          '50%': { transform: 'perspective(1000px) rotateX(270deg) rotateY(135deg) rotateZ(270deg)' },
          '66%': { transform: 'perspective(1000px) rotateX(360deg) rotateY(180deg) rotateZ(360deg)' },
          '83%': { transform: 'perspective(1000px) rotateX(450deg) rotateY(225deg) rotateZ(450deg)' },
          '100%': { transform: 'perspective(1000px) rotateX(540deg) rotateY(270deg) rotateZ(540deg)' },
        },
        diceCrashLeft: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateX(12px) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'translateX(12px) scale(0)', opacity: '0' },
        },
        diceCrashRight: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateX(-12px) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'translateX(-12px) scale(0)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}