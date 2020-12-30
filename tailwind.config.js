module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        hero: "url('/headlights-landing3.jpg')",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
