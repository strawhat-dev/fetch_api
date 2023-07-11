const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: { es2021: true, node: true },
  ignorePatterns: ['dist', 'tsup.config.ts', '.eslintrc.cjs'],
  plugins: ['import', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: 'tsconfig.json',
  },
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': { 'import/resolver': { typescript: { alwaysTryTypes: true } } },
  },
  extends: ['plugin:import/typescript', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/consistent-type-specifier-style': 'error',
  },
});
