function getEffectiveness(pokemon) {
  if (typeof window.Pokemon == 'function' && !(pokemon instanceof window.Pokemon)) throw 'Input Not Pokemon'
  const {types} = pokemon
  const output = {}
  types.forEach(type => {
    const chart = TypeChart[type]
    Object.keys(chart).forEach(typeResult => {
      if (!output.hasOwnProperty(typeResult)) output[typeResult] = 1
      output[typeResult] *= chart[typeResult]
    })
  })
  Object.keys(output).forEach(key => {
    if (output[key] === 1) delete output[key]
  })
  const sortedOutput = {}
  Object.keys(output).sort((type1, type2) => output[type2] - output[type1]).forEach(property => {
    sortedOutput[property] = output[property]
  })
  return sortedOutput
}

export default getEffectiveness
