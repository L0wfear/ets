var path = require('path');

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
    "no-tabs": "error",
    "no-mixed-spaces-and-tabs": "off",
    "no-confusing-arrow": "off",
    "quote-props": "warn",
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "class-methods-use-this": "off",
    "max-len": ["off", 120],
    "camelcase": ["off"], // временно
    "no-param-reassign": ["off"], // временно
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "jsx-a11y/no-static-element-interactions": ["off"]
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        config: path.resolve(__dirname, 'webpack', 'dev.config.js')
      }
    }
  }
}
