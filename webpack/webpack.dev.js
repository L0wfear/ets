const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const stand = process.env.STAND || 'dev';
const NODE_ENV = process.env.NODE_ENV;

const getNameFavicon = (stand) => {
  switch (stand) {
    case 'dev': return 'ets_dev';
    case 'gost_stage':
    case 'ets_test':
    case 'ets_hotfix': return 'ets_test';
    default: return 'ets';
  }
};

const getColor = (stand) => {
  switch (getNameFavicon(stand)) {
    case 'ets_dev': return '#0021FF';
    case 'ets_hotfix': return '#FFE100';
    default: return '#2ECC40';
  }
};

module.exports = {
  entry: [
    'core-js/stable',
    'whatwg-fetch',
    'react-hot-loader',
    'regenerator-runtime/runtime',
    './src/index',
  ],
  mode: 'development',
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
  devServer: {
    contentBase: './dist',
    port: 3000,
    hot: true,
    noInfo: true,
    quiet: false,
    inline: true,
    noInfo: true,
    lazy: false,
    public: '',
    host: '0.0.0.0',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '..', 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: [
          'handlebars-loader',
        ],
      },
      {
        test: /\.(jsx|js|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    corejs: { version: 3, proposals: true },
                    useBuiltIns: 'usage', // 'usage' те функции, которые используются
                    configPath: path.join(__dirname, '..'),
                  },
                ],
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: [
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                [
                  '@babel/plugin-proposal-optional-chaining',
                  {
                    loose: true,
                  }
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
                [
                  'babel-plugin-styled-components',
                  {
                    "fileName": false
                  },
                ],
                '@babel/plugin-syntax-dynamic-import',
                'react-hot-loader/babel',
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
            },
          },
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 100000,
            name: 'fonts/[name].[ext]',
          },
        },
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: 'global',
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(cvs|tsv)$/,
        use: [
          'cvs-loader',
        ],
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.json',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
    modules: [__dirname, 'src', 'node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
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
        from: path.join(__dirname, 'otherToDist', 'construct'),
        to: 'construct'
      },
      {
        from: path.join(__dirname, 'otherToDist', 'robots.txt'),
        to: 'robots.txt'
      },
      {
        from: path.resolve(__dirname, 'templates', 'sw.js'),
        to: 'sw.js'
      },
      {
        from: path.resolve(__dirname, 'templates', 'images', getNameFavicon(stand), 'icons'),
        to: 'icons'
      },
    ]),
    new ManifestPlugin({
      generate: (seed, files) => files.reduce(
        (manifest, {name, path}) => {
          if (name !== 'images/.DS_Store') {
            return ({
              ...manifest,
              chunks: {
                ...manifest.chunks || {},
                [name]: path,
              },
            });
          }

          return manifest;
        },
        seed,
      ),
      seed: {
        "short_name": `__ETS::${stand.toUpperCase()}__`,
        "name": `__ETS::${stand.toUpperCase()}__`,
        "start_url": "/",
        "background_color": "black",
        "theme_color": getColor(stand),
        "display": "fullscreen",
        "version": JSON.stringify(`${require(path.join(__dirname, '..', 'package.json')).version}`),
        "icons": [
          {
            "src": "./icons/icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "./icons/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "./icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "./icons/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "./icons/icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
          },
          {
            "src": "./icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "./icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "./icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
      },
    }),
    new HtmlWebpackPlugin({
      title: `__ETS::${stand.toUpperCase()}__`,
      favicon: path.resolve(__dirname, 'templates', 'images', getNameFavicon(stand), 'icons', 'icon-128x128.png'),
      template: path.resolve(__dirname, 'templates', 'index.hbs'),
      publicPath: '/',
      themeColor: getColor(stand),
      DEVELOPMENT: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: NODE_ENV !== 'production',
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        STAND: JSON.stringify(stand),
        VERSION: JSON.stringify(`2.${require(path.join(__dirname, '..', 'package.json')).version}`)
      },
    }),
  ],
  optimization: {
    noEmitOnErrors: true,
  },
};
