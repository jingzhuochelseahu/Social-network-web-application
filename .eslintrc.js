module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    // 'parser: babel-eslint',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 10,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-console': 0,
    'max-len': 0,
    'consistent-return': 0,
    'no-prototype-builtins': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
    'no-alert': 0,
    'linebreak-style': 0,
    'react/jsx-filename-extension': [0],
    'react/function-component-definition': 0,
    'react/prop-types': 0,
    'no-undef': 0,
    'no-restricted-globals': 0,
    'no-restricted-syntax': 0,
  },
};
