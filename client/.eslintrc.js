module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // React rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General rules
    'no-console': 'error',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-undef': 'error',
    'no-trailing-spaces': 'error',

    // Custom rules to prevent trailing spaces in string literals
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/.*\\s+$/]',
        message: 'String literals should not have trailing spaces',
      },
    ],
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    jest: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    React: 'readonly',
  },
};
