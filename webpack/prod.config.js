const path = require('path');
const webpack = require('webpack');
const notifyStats = require('./utils/notifyStats');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const versionUtils = require('./utils/version');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const stand = process.env.STAND || 'production';
const useSourceMaps = process.env.USE_SOURCE_MAPS || false;

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
    rules: [
      { 
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true
            }
          },
        ],
      },
      { 
        test: /\.hbs?$/,
        use: 'handlebars-loader'
      },
      { 
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /^((?!\.module).)*\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.module\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              }
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ]
        }),
      },
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: [
          'file-loader',
        ]
      },
      {
        test: /\.svg/,
        use: {
            loader: 'svg-url-loader',
            options: {
              limit: 1000000,
              encoding: "base64",
            }
          }
      },
    ],
  },
  resolve: {
    modules: [__dirname, 'src', 'node_modules'],
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
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
    new UglifyJSPlugin({
      sourceMap: useSourceMaps,
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