// Webpack config for creating the production bundle.
var path = require('path');
var webpack = require('webpack');
var notifyStats = require('./utils/notifyStats');
var CleanPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');

var assetsPath = path.join(__dirname, '..', 'dist');
var alias = require('./alias');

var stand = process.env.STAND || 'production';

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    'app': [
      'whatwg-fetch',
      './scripts/index.js'
    ],
    'style': 'raw!./styles/main.scss'
  },
  output: {
    path: assetsPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '../dist/'
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: { limit: 10240 } },
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel?stage=0&optional=runtime&plugins=typecheck'] },
      { test: /\.json$/, loader: 'json-loader' },
      // { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', '!raw!sass?outputStyle=expanded') }
      //  { test: /\.scss$/, loaders: ['style','css-loader?sourceMap', 'resolve-url', 'sass-loader?sourceMap'] }
    ]
  },
  node: {
    fs: "empty"
  },
  browser: {
    fs: "empty"
  },
  progress: true,
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
    new ExtractTextPlugin('../dist/[name].css', {
      allChunks: true
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
        from: path.join(__dirname, '..', 'fonts'),
        to: 'fonts'
      },
      {
        from: path.join(__dirname, '..', 'images'),
        to: 'images'
      },
      // TODO добавить, обсудив деплой
      // {
      //   from: path.join(__dirname, '..', 'index.html'),
      // }
    ]),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
    }),
    function () {
      this.plugin('done', notifyStats);
    },
  ]
};
