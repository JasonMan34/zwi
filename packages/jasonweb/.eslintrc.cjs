module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['@jasonman34', 'plugin:react-hooks/recommended', 'airbnb', 'airbnb-typescript'],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/no-default-export': 'off',
  },
};
