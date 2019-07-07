const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const stand = process.env.STAND || 'dev';
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  entry: [
    'react-hot-loader',
    'whatwg-fetch',
    'core-js/stable',
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
          "thread-loader",
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    corejs: 3,
                    useBuiltIns: 'entry', // 'usage' те функции, которые используются
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
                'babel-plugin-styled-components',
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
    new ManifestPlugin(),
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
      title: `__ETS::${stand.toUpperCase()}__`,
      favicon: path.resolve(__dirname, '..', 'src', 'assets', 'images', 'dev.png'),
      template: path.resolve(__dirname, 'templates', 'index.hbs'),
      MANIFEST_FILENAME: 'manifest.json'
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
