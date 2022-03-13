const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
