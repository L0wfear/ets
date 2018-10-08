const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const stand = process.env.STAND || 'dev';

module.exports = {
  entry: [
    'whatwg-fetch',
    '@babel/polyfill',
    './src/index',
  ],
  mode: 'production',
  context: path.resolve(__dirname, '..'),
  output: {
    filename: 'app.[name].[hash].js',
    path: path.join(__dirname, '..', 'dist'),
    publicPath: '/',
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
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    'chrome': '47',
                    'firefox': '42',
                    'ie': '11',
                  },
                  useBuiltIns: 'usage',
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
                '@babel/plugin-proposal-class-properties',
                {
                  loose: true,
                },
              ],
              '@babel/plugin-syntax-dynamic-import',
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000000,
              mimetype: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {
            limit: 1000000,
            encoding: 'base64',
          },
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              mimetype: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /^((?!\.module).)*\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
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
        test: /\.module\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 2,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
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
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new ManifestPlugin(),
    new CleanWebpackPlugin([path.resolve(__dirname, '..', 'dist')]),
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
    ]),
    new HtmlWebpackPlugin({
      title: 'ЕТС',
      template: path.resolve(__dirname, 'templates', 'index.hbs'),
    }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        STAND: JSON.stringify(stand),
        VERSION: JSON.stringify(require(path.join(__dirname, '..', 'package.json')).version)
      },
    }),
  ],
  optimization: {
    noEmitOnErrors: true,
  },
};
