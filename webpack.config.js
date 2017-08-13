const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src', 'assets', 'js', 'index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: ['babel-loader', 'eslint-loader'], exclude: /node_modules/ },
      { test: /\.vue$/, loader: ['vue-loader', 'eslint-loader'] },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.scss$/, loader: ['css-loader', 'style-loader', 'sass-loader', 'postcss-loader'] }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '~': path.resolve(__dirname, 'src', 'assets', 'js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
      $: 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default']
    })
  ]
}
