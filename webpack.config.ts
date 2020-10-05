import * as path from 'path';
import * as webpack from 'webpack';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const packageJson = require(path.join(__dirname, 'package.json'));
const packageJson_version = packageJson.version;

const stand = process.env.STAND || 'dev';
const NODE_ENV = process.env.NODE_ENV as 'development' | 'production';

const __DEVELOPMENT__ = NODE_ENV === 'development';

console.info(`[webpack.config] version: ${process.version}`);

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
    case 'ets_test': return '#FFE100';
    default: return '#2ECC40';
  }
};

const getPlugins = () => {
  const plugins: webpack.Configuration['plugins'] = [
    new MomentLocalesPlugin({
      localesToKeep: ['ru'],
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(__dirname, 'dist'),
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'assets', 'fonts'),
          to: 'fonts'
        },
        {
          from: path.join(__dirname, 'src', 'assets', 'images'),
          to: 'images'
        },
        {
          from: path.join(__dirname, 'webpack', 'otherToDist', 'construct'),
          to: 'construct'
        },
        {
          from: path.join(__dirname, 'webpack', 'otherToDist', 'robots.txt'),
          to: 'robots.txt'
        },
        {
          from: path.resolve(__dirname, 'webpack', 'templates', 'sw.js'),
          to: 'sw.js'
        },
        {
          from: path.resolve(__dirname, 'webpack', 'templates', 'images', getNameFavicon(stand), 'icons'),
          to: 'icons'
        },
      ]
    }),
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
        permissions: [
          'storage',
          '*://localhost/*'
        ],
        short_name: __DEVELOPMENT__ ? `__ETS::${stand.toUpperCase()}__` : 'ЕТС',
        name: __DEVELOPMENT__ ? `__ETS::${stand.toUpperCase()}__` : 'ЕТС',
        start_url: '/',
        background_color: 'black',
        theme_color: getColor(stand),
        display: 'fullscreen',
        version: JSON.stringify(`${packageJson_version}`),
        icons: [
          {
            src: './icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: './icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: './icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: './icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: './icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: './icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: './icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
      },
    }),
    new HtmlWebpackPlugin({
      title: __DEVELOPMENT__ ? `__ETS::${stand.toUpperCase()}__` : 'ЕТС',
      favicon: path.resolve(__dirname, 'webpack', 'templates', 'images', getNameFavicon(stand), 'icons', 'icon-128x128.png'),
      template: path.resolve(__dirname, 'webpack', 'templates', 'index.hbs'),
      publicPath: '/',
      themeColor: getColor(stand),
      DEVELOPMENT: __DEVELOPMENT__,
    }),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__SERVER__': false,
      '__DEVELOPMENT__': __DEVELOPMENT__,
      '__DEVTOOLS__': false,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        STAND: JSON.stringify(stand),
        VERSION: JSON.stringify(`${packageJson_version}`)
      },
    }),
  ];

  if (__DEVELOPMENT__) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  // if (false) {
  //   plugins.push(
  //     new BundleAnalyzerPlugin({
  //       analyzerMode: 'static'
  //     }),
  //   );
  // }

  return plugins;
};

console.info('*************');
console.table([
  {
    Разработка: __DEVELOPMENT__,
    Стенд: stand,
    Версия: packageJson_version,
  }
]);
console.info('*************');

const config: webpack.Configuration = {
  entry: [
    'core-js/stable',
    'whatwg-fetch',
    'react-hot-loader',
    'regenerator-runtime/runtime',
    './src/index',
  ],
  mode: __DEVELOPMENT__ ? 'development' : 'production',
  devtool: __DEVELOPMENT__ ? 'eval' : undefined,
  devServer: {
    contentBase: './dist',
    port: 3000,
    hot: true,
    noInfo: true,
    quiet: false,
    inline: true,
    lazy: false,
    public: '',
    host: '0.0.0.0',
  },
  context: path.resolve(__dirname),
  output: {
    filename: __DEVELOPMENT__ ? '[name].bundle.js' : 'app.[name].[contenthash].js',
    path: path.join(__dirname, 'dist'),
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
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
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
          'style-loader',
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
    alias: {
      'react-dom': __DEVELOPMENT__ ? '@hot-loader/react-dom' : 'react-dom',
    },
    modules: [__dirname, 'src', 'node_modules'],
  },
  plugins: getPlugins(),
  optimization: {
    noEmitOnErrors: true,
  },
};

module.exports = config;
