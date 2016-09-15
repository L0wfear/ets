var path = require('path');
var webpackAlias = require(path.resolve(__dirname, 'webpack', 'alias'));

module.exports = {
  "extends": "airbnb",
  "env": {
    node: true,
    browser: true
  },
  "globals": {
    ol: true,
    window: true,
    document: true,
    confirmDialog: true
  },
  "parser": "babel-eslint",
  "rules": {
    "strict": "off",
    "import/no-extraneous-dependencies": "off",
    "no-tabs": "error",
    "no-mixed-spaces-and-tabs": "off",
    "no-confusing-arrow": "off",
    "quote-props": "warn",
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "class-methods-use-this": "off",
    "max-len": ["off", 120]
  },
  "settings": {
    "import-resolver": {
      "webpack": {
        config: path.resolve(__dirname, 'webpack', 'dev.config.js')
      }
    }
  }
}
