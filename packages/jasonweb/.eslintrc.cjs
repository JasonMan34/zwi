module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:react/jsx-runtime',
    '@jasonman34',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', '*.vue'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    'react-refresh/only-export-components': 'off',
    'import/no-default-export': 'off',
  },
};
