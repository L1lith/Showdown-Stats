import TypeChart from '@data/typeChart.json'
import moveList from '@data/moveList.json'
import calculateStats from './calculateStats'
import {singleEffectiveness} from './getEffectiveness'
import specialMoves from './specialMoves'

function estimateDamage(pokemon, moveElement, opponent) {
  const moveType = moveElement.getElementsByClassName('type')[0].textContent
  const moveName = moveElement.childNodes[0].textContent
  const moveData = moveList[moveName.toLowerCase()]

  if (moveData === undefined || moveData.kind === 'status') return null

  const specialMove = specialMoves[moveName]

  if (specialMove && typeof specialMove.exact == 'function') return specialMove.exact()

  const effectiveness = singleEffectiveness(opponent, moveType)

  const pokemonStats = calculateStats(pokemon)
  const opponentStats = calculateStats(opponent)

  const attackStat = pokemonStats[moveData.kind === 'physical' ? 'atk' : 'spa']
  const defenseStat = opponentStats[moveData.kind === 'physical' ? 'def' : 'spd']

  const stab = specialMove && specialMove.hasOwnProperty('stab') && specialMove.stab() === true ? 1.5 : pokemon.types.includes(moveType) ? 1.5 : 1

  const levelDamage = ((2 * pokemon.level) / 5) + 2

  let lowPower = specialMove && typeof specialMove.base == 'function' ? specialMove.base(pokemon, opponent, window.room) : moveData.power
  let highPower = lowPower

  if (specialMove && typeof specialMove.base == 'function' ) [lowPower, highPower] = specialMove.baserange(pokemon, opponent, window.room)

  const lowDamage = ((levelDamage * lowPower * (attackStat.lowFinal / defenseStat.highFinal)) / 50) + 2
  const highDamage = ((levelDamage * highPower * (attackStat.highFinal / defenseStat.lowFinal)) / 50) + 2

  const modifier = stab * effectiveness

  console.log({lowDamage, highDamage, modifier, levelDamage, stab, attackStat, defenseStat, effectiveness, moveElement})

  return [Math.floor((lowDamage * modifier * 0.85) / opponentStats.hp.highFinal * 100), Math.floor((highDamage * modifier) / opponentStats.hp.lowFinal * 100)]
}

export default estimateDamage
