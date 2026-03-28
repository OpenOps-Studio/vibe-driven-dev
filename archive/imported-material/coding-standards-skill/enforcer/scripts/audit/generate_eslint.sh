#!/bin/bash

# Generates a strict ESLint config based on master rules

echo "module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import', 'jsx-a11y'],
  rules: {
    // ARCH-DEP-01: Unidirectional Dependencies & Path Aliases
    'import/no-relative-parent-imports': 'error', # Enforce @/ alias
    
    // ICON-REACT-01: No Inline SVG
    'react/no-danger': 'error',
    
    // TYPE-STRICT-02: Strict Mode
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    
    // DOC-COMMENTS-01: Code Comments (warn generally)
    'require-jsdoc': 'off', 
    
    // PERFORMANCE
    'react-hooks/exhaustive-deps': 'error',
    
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
}" > .eslintrc.js

echo "Generated strict .eslintrc.js mandatory configuration."
