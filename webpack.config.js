require('./setEnvironment')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'build.js'
  },
  resolve: {
    alias: {
      '@data': path.resolve(__dirname,'data')
    }
  },
  plugins: [
    new UglifyJsPlugin(),
    new CopyWebpackPlugin([{ from: 'resources' }])
  ]
}
