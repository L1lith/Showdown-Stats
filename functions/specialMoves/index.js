const path = require('path')
const output = {}
const specialMoves = require.context(__dirname, false, /^(?!.*index).*\.js$/)

specialMoves.keys().forEach(filePath => {
  let required = specialMoves(filePath)
  if (required.hasOwnProperty('default')) required = required.default
  if (!required.hasOwnProperty('name')) required.name = path.basename(filePath, path.extname(filePath))
  if (typeof required.calculate == 'function') {
    const oldCalculate = required.calculate
    required.calculate = (pokemon, opponent, room, ...args) => {
      if (typeof pokemon != 'object' || pokemon === null) throw new Error('Invalid Pokemon Input')
      if (typeof opponent != 'object' || opponent === null) throw new Error('Invalid Opponent Pokemon Input')
      if (typeof room != 'object' || room === null) throw new Error('Invalid Room Input')
      return oldCalculate(pokemon, opponent, room, ...args)
    }
  }
  output[required.name] = required
})

module.exports = Object.assign({}, output, {__esModule: true, default: output})
