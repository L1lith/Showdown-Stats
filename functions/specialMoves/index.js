const path = require('path')
const output = {}
const specialMoves = require.context(__dirname, false, /^(?!.*index).*\.js$/)

specialMoves.keys().forEach(filePath => {
  output[path.basename(filePath, path.extname(filePath))] = specialMoves(filePath)
})

module.exports = output
