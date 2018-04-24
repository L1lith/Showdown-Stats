import NatureChart from '@data/natureChart.json'

function getNatureFactor(pokemon, stat) {
  const nature = pokemon.nature
  if (typeof nature != 'string' || nature.length < 1 || stat === 'hp') return 1
  if (!NatureChart.hasOwnProperty(nature)) throw 'Invalid Nature'
  if (typeof stat != 'string' || stat.length < 1) throw 'Invalid Stat'
  stat = stat.toLowerCase()
  const [increase, decrease] = NatureChart[nature]
  if (stat === increase) {
    return 1.1
  } else if (stat === decrease) {
    return 0.9
  } else {
    return 1
  }
}

export default getNatureFactor
