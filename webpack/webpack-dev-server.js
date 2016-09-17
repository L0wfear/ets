var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require('./dev.config.js');
var compiler = webpack(webpackConfig);
var host = process.env.HOST || 'localhost';
var port = 3000;
var serverOptions = {
  // contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {"Access-Control-Allow-Origin": "*"},
  stats: {colors: true}
};

var devServer = new WebpackDevServer(compiler, serverOptions);


devServer.listen(port, '0.0.0.0', function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
