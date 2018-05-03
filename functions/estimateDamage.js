import TypeChart from '@data/typeChart.json'
import moveList from '@data/moveList.json'
import calculateStats from './calculateStats'

function estimateDamage(pokemon, moveElement, opponent) {
  const moveType = moveElement.getElementsByClassName('type')[0].textContent
  const moveName = moveElement.childNodes[0].textContent
  const moveData = moveList[moveName.toLowerCase()]

  if (moveData === undefined || moveData.kind === 'status') return []

  let effectiveness = 1
  opponent.types.forEach(type => effectiveness *= TypeChart[type][moveType] || 1)

  const pokemonStats = calculateStats(pokemon)
  const opponentStats = calculateStats(opponent)

  const attackStat = pokemonStats[moveData.kind === 'physical' ? 'atk' : 'spa']
  const defenseStat = pokemonStats[moveData.kind === 'physical' ? 'def' : 'spd']

  const stab = pokemon.types.includes(moveType) ? 1.5 : 1

  const levelDamage = ((2 * pokemon.level) / 5) + 2

  const power = moveData.power

  const lowDamage = ((levelDamage * power * (attackStat.lowFinal / defenseStat.highFinal)) / 50) + 2
  const highDamage = ((levelDamage * power * (attackStat.highFinal / defenseStat.lowFinal)) / 50) + 2

  const modifier = stab * effectiveness

  return [(lowDamage * modifier * 0.85) / opponentStats.hp.highFinal * 100, (highDamage * modifier) / opponentStats.hp.lowFinal * 100].map(value => Math.floor(value))
}

export default estimateDamage
