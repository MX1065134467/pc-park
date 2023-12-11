module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    'qq': true
  },
  extends: [
    'plugin:vue/essential', '@vue/standard'
  ],
  parserOptions: {
    // parser: 'babel-eslint'
  },
  rules: {
    'space-before-function-paren': 0,
    'no-tabs': 'off',
    'no-irregular-whitespace': 'off'
  }
}
