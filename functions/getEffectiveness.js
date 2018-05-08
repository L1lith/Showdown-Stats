import TypeChart from '@data/typeChart.json'

export function allEffectiveness(pokemon) {
  if (typeof window.Pokemon == 'function' && !(pokemon instanceof window.Pokemon)) throw 'Input Not Pokemon'
  const output = {}
  Object.keys(TypeChart).forEach(type => {
    const effectiveness = singleEffectiveness(pokemon, type)
    if (effectiveness !== 1) output[type] = effectiveness
  })
  const sortedOutput = {}
  Object.keys(output).sort((type1, type2) => output[type2] - output[type1]).forEach(property => {
    sortedOutput[property] = output[property]
  })
  return sortedOutput
}
export function singleEffectiveness(pokemon, moveType) {
  let effectiveness = 1
  pokemon.types.forEach(type => {
    const typeEffectiveness = TypeChart[type][moveType]
    if (typeof typeEffectiveness == 'number') effectiveness *= typeEffectiveness
  })
  return effectiveness
}
