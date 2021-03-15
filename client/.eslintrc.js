module.exports = {
  extends: 'airbnb',
  overrides: [
    {
      files: ['*.jsx', '*.js'],
    },
  ],
  plugins: ['react', 'jsx-a11y', 'import'],
  rules: {
    'linebreak-style': 0,
  },
};
