var path = require('path');
var webpack = require('webpack');
var writeStats = require('./utils/writeStats');
var notifyStats = require('./utils/notifyStats');
var assetsPath = path.resolve(__dirname, '../dist');
var host = 'localhost';//'dev.ods.mos.ru';
var port = 3000;
//var ForceCaseSensitivityPlugin = require('./utils/forcecasesensitivity');

module.exports = {
  devtool: 'eval-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'app': [
      'webpack-dev-server/client?http://' + host + ':' + port,
      'webpack/hot/only-dev-server',
      "./scripts/app.jsx"
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
      { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true' }
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
    function () {
      this.plugin('done', function(stats) {
        writeStats.call(this, stats, 'dev');
      });
    }
  ]
};
