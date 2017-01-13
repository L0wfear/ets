const path = require('path');
const webpack = require('webpack');
const notifyStats = require('./utils/notifyStats');
const version = require('./utils/getVersion');
const host = 'localhost';
const port = 3000;
const alias = require('./alias');

const stand = process.env.STAND || 'development';

module.exports = {
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
  entry: {
    'app': [
      'webpack-dev-server/client?http://' + host + ':' + port,
      'webpack/hot/only-dev-server',
      './src/index.js',
      './src/assets/main.scss'
    ],
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(jpe?g|png|gif)$/, loader: 'url-loader?limit=1000000&name=images/[name].[ext]' },
      { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' },
      { test: /\.s?css$/, loaders: ['style', 'css-loader?sourceMap', 'resolve-url', 'sass-loader?sourceMap'] },
      { test: /ol-base\.js/, loader: 'imports?define=>false' },
    ],
  },
  resolve: {
    root: __dirname,
    alias,
    modulesDirectories: [
      'src',
      'node_modules',
    ],
    extensions: ['', '.json', '.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        STAND: JSON.stringify(stand),
        VERSION: JSON.stringify(version)
      },
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
    }),
    function onDone() {
      this.plugin('done', notifyStats);
    },
  ],
};
