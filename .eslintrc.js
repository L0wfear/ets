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
        config: {
          resolve: {
            modules: [__dirname, 'src', 'node_modules'],
            extensions: ['', '.json', '.js', '.jsx', '.ts', '.tsx'],
            alias: {
              utils: path.resolve(__dirname, 'src', 'utils'),
              api: path.resolve(__dirname, 'src', 'api'),
              components: path.resolve(__dirname, 'src', 'components'),
              models: path.resolve(__dirname, 'src', 'models'),
              constants: path.resolve(__dirname, 'src', 'constants'),
              config: path.resolve(__dirname, 'src', 'config'),
              stores: path.resolve(__dirname, 'src', 'stores'),
              actions: path.resolve(__dirname, 'src', 'actions'),
              redux: path.resolve(__dirname, 'src', 'redux'),
            },
          }
        }
      }
    }
  }
}
