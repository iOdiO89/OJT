import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: { '@stylistic': stylistic },
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      '@stylistic/semi': 'off',
      '@stylistic/quotes': 'off',
      'linebreak-style': 0,
      'arrow-parens': ['error', 'as-needed'],
      'object-curly-newline': ['error', { consistent: true }],
      'operator-linebreak': 'off',
      'no-plusplus': 'off',
      'arrow-body-style': ['error', 'as-needed']
    }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
]
