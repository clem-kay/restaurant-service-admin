module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // shadcn/ui generated files export both components and variant helpers — suppress the
      // react-refresh warning that fires when a file mixes component and non-component exports.
      files: ['src/components/ui/**/*.tsx', 'src/components/Theme/theme-provider.tsx'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
  ],
}
