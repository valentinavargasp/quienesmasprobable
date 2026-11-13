/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(.3)', opacity: '0' },
          '55%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        fadeUp: {
          from: { transform: 'translateY(14px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        grow: { from: { width: '0' } },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
        bump: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        ring: {
          '0%': { transform: 'scale(.6)', opacity: '.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glow: {
          '0%, 100%': { color: '#fff' },
          '50%': { color: '#fde047' },
        },
        dots: {
          '0%, 100%': { opacity: '.2' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        pop: 'pop .55s cubic-bezier(.2,1.4,.4,1) both',
        fadeUp: 'fadeUp .45s ease-out both',
        grow: 'grow .9s cubic-bezier(.2,.9,.3,1) both',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        bump: 'bump .3s ease-out',
        ring: 'ring .9s ease-out infinite',
        wave: 'wave 1.6s ease-in-out infinite',
        'wave-glow': 'wave 1.6s ease-in-out infinite, glow 3s ease-in-out infinite',
        dots: 'dots 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
