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
    "no-continue": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-confusing-arrow": "off",
    "quote-props": "off", // временно
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "class-methods-use-this": "off",
    "max-len": ["off", 120],
    "camelcase": ["off"], // временно
    "no-param-reassign": ["off"], // временно
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "jsx-a11y/no-static-element-interactions": ["off"],
    // react
    "react/forbid-prop-types": ["off"]
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        config: path.resolve(__dirname, 'webpack', 'dev.config.js')
      }
    }
  }
}
