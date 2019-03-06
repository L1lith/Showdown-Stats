const args = require('yargs').argv

const environment = args.p === true || args.prod === true || args.production === true ? 'production' : args.d === true || args.dev === true || args.development === true ? 'development' : process.env.NODE_ENV || 'development'

process.env.NODE_ENV = environment

module.exports = environment
