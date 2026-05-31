import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

// ESLint v9 utilise le « flat config » (eslint.config.js) à la place de .eslintrc.json.
// Note : le README mentionne .eslintrc.json, mais ce format est déprécié depuis ESLint 9 ;
// on garde le même objectif (lint JS strict) avec la syntaxe moderne.
export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        __APP__: 'writable', // seule variable globale autorisée (debug)
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  // Désactive les règles de style qui entrent en conflit avec Prettier.
  prettier,
];
