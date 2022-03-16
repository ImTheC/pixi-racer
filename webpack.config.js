const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// @TODO: add script for building for production
// @TODO: add version for package file name (i.e. pixi-racer-v020.js)
module.exports = {
  mode: 'development',
  entry: './src/scripts/app.js',

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],

  output: {
    filename: 'pixi-racer.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  },

  module: {
    rules: [
      {
        test: /\.mp3$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|svg)$/i,
        type: 'asset/resource',
      },
    ]
  }
}
