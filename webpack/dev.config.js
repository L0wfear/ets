var path = require('path');
var webpack = require('webpack');
//var writeStats = require('./utils/writeStats');
var notifyStats = require('./utils/notifyStats');
var assetsPath = path.resolve(__dirname, '../dist');
var host = 'localhost';
var port = 3000;
var alias = require('./alias');
//var ForceCaseSensitivityPlugin = require('./utils/forcecasesensitivity');

var stand = process.env.STAND || 'development';

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'app': [
      'whatwg-fetch',
      'webpack-dev-server/client?http://' + host + ':' + port,
      'webpack/hot/only-dev-server',
      "./scripts/index.js"
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel?stage=0&optional=runtime&plugins=typecheck']},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true' },

      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      {test: /ol-base\.js/, loader: 'imports?define=>false'}
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
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    //new ForceCaseSensitivityPlugin(),

    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('development'),
        STAND: JSON.stringify(stand)
      }
    }),

    new webpack.IgnorePlugin(/\.json$/),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),

    // stats
    function () {
      this.plugin('done', notifyStats);
    },
  ]
};
