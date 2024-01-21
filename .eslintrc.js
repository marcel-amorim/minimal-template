/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'import/order': [
      1,
      {
        groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@assets/**',
            group: 'internal',
          },
          {
            pattern: '@components/**',
            group: 'internal',
          },
          {
            pattern: '@data/**',
            group: 'internal',
          },
          {
            pattern: '@hooks/**',
            group: 'internal',
          },
          {
            pattern: '@pages/**',
            group: 'internal',
          },
          {
            pattern: '@public/**',
            group: 'internal',
          },
          {
            pattern: '@utils/**',
            group: 'internal',
          },
          {
            pattern: '@routes/**',
            group: 'internal',
          },
          {
            pattern: '@theme/**',
            group: 'internal',
          },
          {
            pattern: '@locales/**',
            group: 'internal',
          },
          {
            pattern: '@lib/**',
            group: 'internal',
          },
          {
            pattern: '@/**',
            group: 'internal',
          },
          {
            pattern: '@@types/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
  },
}
