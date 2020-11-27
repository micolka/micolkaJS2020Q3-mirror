module.exports = {
  env: {
    browser: true,
    // es2021: true,
  },
  extends: ['airbnb-typescript/base', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
  },
};
