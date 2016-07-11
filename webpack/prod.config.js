// Webpack config for creating the production bundle.

var path = require('path');
var webpack = require('webpack');
//var writeStats = require('./utils/writeStats');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');

var relativeAssetsPath = '../dist';
var assetsPath = path.join(__dirname, relativeAssetsPath);
var alias = require('./alias');

var stand = process.env.STAND || 'production';

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    'app': [
      'whatwg-fetch',
      './scripts/app.jsx'
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
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', '!raw!sass?outputStyle=expanded') }
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
    alias: alias,
    modulesDirectories: [
      'scripts',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    new CleanPlugin([relativeAssetsPath]),

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
    })
  /*
      function () {
        this.plugin('done', function(stats) {
          writeStats.call(this, stats, 'prod');
        });
      }*/
  ]
};
