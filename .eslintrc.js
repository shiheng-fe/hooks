module.exports = {
  extends: ['@diamondyuan/react-typescript', 'plugin:prettier/recommended'],
  rules: {
    'no-redeclare': 'off',
    'no-return-assign': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
  },
};
