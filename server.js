var
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  config = require('./webpack/dev.config.js'),
  host = process.env.HOST || 'localhost',
  port = 3000;
  //localServer = process.env.LOCAL_SERVER_URL;
  options = {
   // contentBase: 'http://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: config.output.publicPath,
    headers: {"Access-Control-Allow-Origin": "*"},
    stats: {colors: true}
  };

if (process.env.npm_config_local_server_url) {
  config.plugins.push(
    new webpack.DefinePlugin({
      LOCAL_SERVER_URL: JSON.stringify(process.env.npm_config_local_server_url)
    })
  );
}

var compiler = webpack(config,
  function(err, stats){
    var json = stats.toJson();
    if (json.errors.length)
      console.error(json.errors[0])
  }
);
var devServer = new WebpackDevServer(compiler, options);


devServer.listen(port, host, function() {
  console.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
});
