const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  context: path.resolve(__dirname, '..'),
  output: {
    filename: 'app.[name].[hash].js',
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/',
  },
});
