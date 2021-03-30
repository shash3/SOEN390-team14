module.exports = {
  extends: ['airbnb-base', 'prettier'],
  overrides: [
    {
      files: ['*.jsx', '*.js'],
    },
  ],
  plugins: ['react', 'jsx-a11y', 'import'],
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'indent': ['error', 2],
    'no-multi-assign' : 0,
  },
};
