const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
  output: {
    filename: 'app.[name].js',
    path: path.join(__dirname, '..', 'dist'),
  },
  devServer: {
    contentBase: './dist',
    port: 3000,
    open: true,
    hot: true,
    quiet: false,
    inline: true,
    lazy: false,
  },
});
