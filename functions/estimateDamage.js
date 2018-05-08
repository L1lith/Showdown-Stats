import TypeChart from '@data/typeChart.json'
import moveList from '@data/moveList.json'
import calculateStats from './calculateStats'
import {singleEffectiveness} from './getEffectiveness'

function estimateDamage(pokemon, moveElement, opponent) {
  const moveType = moveElement.getElementsByClassName('type')[0].textContent
  const moveName = moveElement.childNodes[0].textContent
  const moveData = moveList[moveName.toLowerCase()]

  if (moveData === undefined || moveData.kind === 'status') return null

  const effectiveness = singleEffectiveness(pokemon, moveType)

  const pokemonStats = calculateStats(pokemon)
  const opponentStats = calculateStats(opponent)

  const attackStat = pokemonStats[moveData.kind === 'physical' ? 'atk' : 'spa']
  const defenseStat = opponentStats[moveData.kind === 'physical' ? 'def' : 'spd']

  const stab = pokemon.types.includes(moveType) ? 1.5 : 1

  const levelDamage = ((2 * pokemon.level) / 5) + 2

  const power = moveData.power

  const lowDamage = ((levelDamage * power * (attackStat.lowFinal / defenseStat.highFinal)) / 50) + 2
  const highDamage = ((levelDamage * power * (attackStat.highFinal / defenseStat.lowFinal)) / 50) + 2

  const modifier = stab * effectiveness

  return [Math.floor((lowDamage * modifier * 0.85) / opponentStats.hp.highFinal * 100), Math.floor((highDamage * modifier) / opponentStats.hp.lowFinal * 100)]
}

export default estimateDamage
