/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,js}',
    './src/**/*.{html,js,css}',
  ],
   theme: {
    extend: {
      fontFamily: { // ⬇️⬇️ 이 부분을 추가하세요! ⬇️⬇️
        sans: ['Montserrat', 'Spline Sans', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}