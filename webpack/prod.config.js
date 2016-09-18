var path = require('path');
var webpack = require('webpack');
var notifyStats = require('./utils/notifyStats');
var CleanPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var alias = require('./alias');

var stand = process.env.STAND || 'production';

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: {
    'app': [
      './scripts/index.js'
    ],
    // 'style': 'raw!./styles/main.scss'
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    /* если оставить publicPath то HtmlWebpackPlugin будет вставлять скрипты со ссылкой на него
     * а нам это не нужно т.к. index.html генерится в dist
     */
    // publicPath: '/dist/',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.hbs?$/, loader: 'handlebars-loader' },
      { test: /\.(png|jpe?g|gif)$/, loader: 'url-loader?limit=10000&name=images/[name].[ext]' },
      { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style','css-loader!resolve-url!sass-loader?sourceMap') }
    ]
  },
  resolve: {
    root: __dirname,
    alias: alias,
    modulesDirectories: [
      'scripts',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    new CleanPlugin(['dist'], {
      root: path.resolve(__dirname, '..')
    }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),
    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production'),
        STAND: JSON.stringify(stand)
      }
    }),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        pure_funcs: ['console.log']
      },
      sourceMap: false,
      mangle: false
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '..', 'scripts', 'assets', 'fonts'),
        to: 'fonts'
      },
      {
        from: path.join(__dirname, '..', 'scripts', 'assets', 'images'),
        to: 'images'
      }
    ]),
    new ExtractTextPlugin('./css/[name].css'),
    new HtmlWebpackPlugin({
      title: 'ЕТС',
      template: path.resolve(__dirname, 'templates', 'index.hbs')
    }),
    function () {
      this.plugin('done', notifyStats);
    },
  ]
};
