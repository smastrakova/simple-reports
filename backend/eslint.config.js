import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier: prettierPlugin
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error'
    }
  }
]
