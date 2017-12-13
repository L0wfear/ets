var path = require('path');
var webpack = require('webpack');
var notifyStats = require('./utils/notifyStats');
var CleanPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var versionUtils = require('./utils/version');

var alias = require('./alias');
var stand = process.env.STAND || 'production';
var useSourceMaps = process.env.USE_SOURCE_MAPS || false;

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'app': [
      './src/index.js'
    ],
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].[hash].js',
    /* если оставить publicPath то HtmlWebpackPlugin будет вставлять скрипты со ссылкой на него
     * а нам это не нужно т.к. index.html генерится в dist
     */
    // publicPath: '/dist/',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.tsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader', 'ts-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.hbs?$/, loader: 'handlebars-loader' },
      { test: /\.(png|jpe?g|gif)$/, loader: 'url-loader?limit=1000000&name=images/[name].[ext]' },
      { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' },
      { test: /^((?!\.module).)*\.s?css$/, loader: ExtractTextPlugin.extract('style','css-loader!resolve-url!sass-loader?sourceMap') },
      { test: /\.module\.s?css$/, loader: ExtractTextPlugin.extract('style','css-loader?modules&importLoaders=2&localIdentName=[path]___[name]__[local]___[hash:base64:5]!resolve-url!sass-loader?sourceMap') },
    ]
  },
  resolve: {
    root: __dirname,
    alias: alias,
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx', '.ts', '.tsx']
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
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        STAND: JSON.stringify(stand),
        VERSION: JSON.stringify(versionUtils.version)
      }
    }),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        pure_funcs: ['console.log'],
        warnings: false,
      },
      sourceMap: useSourceMaps,
      mangle: false
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '..', 'src', 'assets', 'fonts'),
        to: 'fonts'
      },
      {
        from: path.join(__dirname, '..', 'src', 'assets', 'images'),
        to: 'images'
      },
      {
        from: path.join(__dirname, '..', 'webpack', 'otherToDist', 'robots.txt'),
      },
      {
        from: path.join(__dirname, '..', 'webpack', 'otherToDist', 'construct'),
        to: 'construct'
      },
    ]),
    new ExtractTextPlugin('./css/[name].[hash].css'),
    new HtmlWebpackPlugin({
      title: 'ЕТС',
      template: path.resolve(__dirname, 'templates', 'index.hbs')
    }),
    function () {
      this.plugin('done', notifyStats);
    },
  ]
};