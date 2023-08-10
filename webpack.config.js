const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',

  entry: {
    "hl-contacts": ['./src/index.js']
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'contacts.js',
    libraryTarget: 'umd'
  },

  externals: {
    'jquery': 'jQuery',
    'react': 'react',
    'react-dom': 'react-dom',
    'fs': true
  },

  devtool: isDev ? 'eval-source-map' : false,

  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.json']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      { test: /\.html$/, use: 'html-loader' },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              importLoaders: 1,
              includePaths: ['src/styles']
            }
          }
        }
        ]
      },
      { test: /\.svg(\?.*)?$/, use: [{ loader: 'svg-sprite-loader', options: {} }, 'svgo-loader'] }
    ]
  },

  optimization: {
    minimize: !isDev
  }
};
