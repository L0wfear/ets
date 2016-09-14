var path = require('path');
var webpackAlias = require(path.resolve(__dirname, 'webpack', 'alias'));
console.log(webpackAlias);

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
  },
  "parser": "babel-eslint",
  "rules": {
    "strict": 0,
    "import/no-extraneous-dependencies": 0
  },
  "settings": {
    "import-resolver": {
      "webpack": {
        config: path.resolve(__dirname, 'webpack', 'dev.config.js')
      }
    }
  }
}
