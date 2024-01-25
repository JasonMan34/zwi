module.exports = {
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/array-type': [
      'warn',
      { default: 'array-simple', readonly: 'array-simple' },
    ],
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, variables: false }],
    '@typescript-eslint/return-await': ['error', 'always'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
    ],

    'consistent-return': 'off',
    'max-classes-per-file': 'off',
    'no-param-reassign': 'off',
    'no-promise-executor-return': ['warn', { allowVoid: true }],
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-underscore-dangle': 'off',
    radix: 'off',
    'import/no-cycle': 'error',
    'import/no-mutable-exports': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'warn',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'warn',

    'prefer-destructuring': [
      'error',
      { VariableDeclarator: { object: true } },
      { enforceForRenamedProperties: false },
    ],

    // Unfortunately we have to re-define the entire rule just to remove the ForOf error
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
  },
};
