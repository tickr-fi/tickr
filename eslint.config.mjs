import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    rules: {
      // Spacing and formatting rules
      'no-multi-spaces': 'warn',
      'space-in-parens': 'warn',
      'no-multiple-empty-lines': ['warn', {
        max: 1,
      }],
      'max-len': ['warn', 150],
      'eol-last': 'warn',
      'quotes': ['warn', 'single', {
        avoidEscape: true,
      }],

      // Variable and function rules
      'prefer-const': 'error',
      'no-use-before-define': 'error',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'curly': 'warn',

      // TypeScript rules
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
    },
  },
];

export default eslintConfig;
