module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
      "eslint:recommended",
      'plugin:vue/recommended',
      'plugin:prettier/recommended'
    ],
    // required to lint *.vue files
    plugins: [
      'vue',
      'prettier'
    ],
    // add your custom rules here
    rules: {
      "semi": [2, "never"],
      "no-unused-vars": ["error", { "args": "none" }],
      "vue/max-attributes-per-line": 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
  