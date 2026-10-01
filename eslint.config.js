const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  prettier,
  {
    ignores: ['coverage/**', 'dist/**'],
    rules: {
      'react-hooks/exhaustive-deps': 'error',
    },
  },
]);
