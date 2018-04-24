const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
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
    new CopyWebpackPlugin([{ from: 'resources' }])
  ]
}
