const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'source.js'
  },
  plugins: [
    new CopyWebpackPlugin([{ from: 'resources' }])
  ]
}
