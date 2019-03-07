require('./setEnvironment')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {join} = require('path')

const coreDirectory = join(__dirname, '..', 'core')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: join(coreDirectory, 'index.js'),
  output: {
    path: join(__dirname, '../../build/webExtension'),
    filename: 'build.js'
  },
  resolve: {
    alias: {
      '@data': join(coreDirectory, 'data')
    }
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: true,
  	    compress: {
  		    sequences: true,
  		    dead_code: true,
  		    conditionals: true,
  		    booleans: true,
  		    unused: true,
  		    if_return: true,
  		    join_vars: true,
  		    //drop_console: true
        }
      }
    }),
    new CopyWebpackPlugin([{ from: join(__dirname, 'resources') }])
  ]
}
