const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: { es2021: true, node: true, browser: true },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  plugins: ['import', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: ['tsconfig.json', 'tsconfig.node.json'],
  },
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts'] },
    'import/resolver': { 'import/resolver': { typescript: { alwaysTryTypes: true } } },
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/consistent-type-specifier-style': 'error',
  },
});
